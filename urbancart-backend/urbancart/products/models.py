from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    BADGE_CHOICES = [('New', 'New'), ('Sale', 'Sale'), ('Bestseller', 'Bestseller')]

    category    = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    name        = models.CharField(max_length=200)
    brand       = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    old_price   = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    badge       = models.CharField(max_length=20, choices=BADGE_CHOICES, blank=True)
    stock       = models.IntegerField(default=0)
    image_url   = models.URLField(max_length=500, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
