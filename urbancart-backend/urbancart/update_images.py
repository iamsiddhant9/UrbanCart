import os
import sys
import django
import pymysql
pymysql.version_info = (2, 2, 1, "final", 0)
pymysql.install_as_MySQLdb()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'urbancart.settings')
django.setup()

from products.models import Product

IMAGE_MAP = {
    # Living & Home
    'Linen Throw Pillow':    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    'Ceramic Pour-Over Set': 'https://images.unsplash.com/photo-1495474472201-dabd415177a6?q=80&w=800&auto=format&fit=crop',
    'Soy Wax Candle Set':    'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?q=80&w=800&auto=format&fit=crop',
    # Fashion
    'Oversized Wool Blazer': 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?q=80&w=800&auto=format&fit=crop',
    'Canvas Tote Bag':       'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    'Relaxed Linen Shirt':   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    # Furniture
    'Wooden Desk Lamp':      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
    'Rattan Side Table':     'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    'Sheepskin Floor Pouf':  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=800&auto=format&fit=crop',
    # Beauty
    'Cold Pressed Face Oil': 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?q=80&w=800&auto=format&fit=crop',
    'Bamboo Brush Set':      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=800&auto=format&fit=crop',
    'Rose Clay Mask':        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
}

def update_images():
    for name, url in IMAGE_MAP.items():
        try:
            p = Product.objects.get(name=name)
            p.image_url = url
            p.save()
            print(f"Updated {name}")
        except Product.DoesNotExist:
            print(f"Missing {name}")

if __name__ == '__main__':
    update_images()
