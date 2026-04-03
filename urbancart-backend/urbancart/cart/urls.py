from django.urls import path
from .views import CartListView, CartAddView, CartItemDetailView, CartClearView

urlpatterns = [
    path('cart/',           CartListView.as_view(),       name='cart-list'),
    path('cart/add/',       CartAddView.as_view(),        name='cart-add'),
    path('cart/clear/',     CartClearView.as_view(),      name='cart-clear'),
    path('cart/<int:pk>/',  CartItemDetailView.as_view(), name='cart-item-detail'),
]
