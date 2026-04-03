from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'emoji']


class ProductSerializer(serializers.ModelSerializer):
    category_id   = serializers.IntegerField(source='category.id', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model  = Product
        fields = [
            'id', 'category_id', 'category_name',
            'name', 'brand', 'description',
            'price', 'old_price', 'badge',
            'stock', 'image_url', 'created_at',
        ]


class ProductWriteSerializer(serializers.ModelSerializer):
    """Used for admin create/update (accepts category as integer FK)."""
    class Meta:
        model  = Product
        fields = [
            'category', 'name', 'brand', 'description',
            'price', 'old_price', 'badge', 'stock', 'image_url',
        ]
