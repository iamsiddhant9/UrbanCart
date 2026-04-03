from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer, ProductWriteSerializer


class CategoryListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        cats = Category.objects.all()
        return Response(CategorySerializer(cats, many=True).data)

    def post(self, request):
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({'detail': 'Admin only.'}, status=status.HTTP_403_FORBIDDEN)
        s = CategorySerializer(data=request.data)
        if s.is_valid():
            s.save()
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        qs = Product.objects.select_related('category').all()

        # Filter by category
        cat = request.query_params.get('category')
        if cat:
            qs = qs.filter(category_id=cat)

        # Search
        search = request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(brand__icontains=search)

        # Sort
        sort = request.query_params.get('sort', 'newest')
        if sort == 'price_asc':
            qs = qs.order_by('price')
        elif sort == 'price_desc':
            qs = qs.order_by('-price')
        else:  # newest
            qs = qs.order_by('-created_at')

        return Response(ProductSerializer(qs, many=True).data)

    def post(self, request):
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({'detail': 'Admin only.'}, status=status.HTTP_403_FORBIDDEN)
        s = ProductWriteSerializer(data=request.data)
        if s.is_valid():
            product = s.save()
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Product.objects.select_related('category').get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProductSerializer(product).data)

    def put(self, request, pk):
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({'detail': 'Admin only.'}, status=status.HTTP_403_FORBIDDEN)
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        s = ProductWriteSerializer(product, data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(ProductSerializer(product).data)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({'detail': 'Admin only.'}, status=status.HTTP_403_FORBIDDEN)
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
