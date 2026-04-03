from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal

from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects
            .filter(user=request.user)
            .prefetch_related('items__product')
            .order_by('-created_at')
        )
        return Response(OrderSerializer(orders, many=True).data)

    def post(self, request):
        address = request.data.get('address', '').strip()
        if not address:
            return Response({'detail': 'Address is required.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        if not cart_items.exists():
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total (price + 18% GST, free shipping over 999)
        subtotal     = sum(item.product.price * item.quantity for item in cart_items)
        shipping     = Decimal('0') if subtotal >= Decimal('999') else Decimal('99')
        gst          = (subtotal * Decimal('0.18')).quantize(Decimal('1'))
        total_amount = subtotal + shipping + gst

        order = Order.objects.create(
            user         = request.user,
            address      = address,
            total_amount = total_amount,
            status       = 'confirmed',
        )

        order_items = [
            OrderItem(
                order      = order,
                product    = item.product,
                quantity   = item.quantity,
                unit_price = item.product.price,
            )
            for item in cart_items
        ]
        OrderItem.objects.bulk_create(order_items)

        # Clear cart
        cart_items.delete()

        order.refresh_from_db()
        return Response(
            OrderSerializer(Order.objects.prefetch_related('items__product').get(pk=order.pk)).data,
            status=status.HTTP_201_CREATED,
        )
