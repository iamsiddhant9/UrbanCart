"""
Seed script — populates Categories and Products for UrbanCart.
Run with: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from products.models import Category, Product


CATEGORIES = [
    {'name': 'Living & Home', 'slug': 'living-home', 'emoji': '🏡'},
    {'name': 'Fashion',       'slug': 'fashion',      'emoji': '👗'},
    {'name': 'Furniture',     'slug': 'furniture',    'emoji': '🪑'},
    {'name': 'Beauty',        'slug': 'beauty',       'emoji': '✨'},
]

PRODUCTS = [
    # Living & Home
    dict(category_slug='living-home', name='Linen Throw Pillow',    brand='Maison',       price=1299, old_price=1799, badge='Sale',       stock=12, description='Handwoven linen pillow with a natural texture that complements any living space.'),
    dict(category_slug='living-home', name='Ceramic Pour-Over Set', brand='Kiln & Co',    price=2499, old_price=None, badge='New',        stock=8,  description='Handcrafted ceramic pour-over set. Each piece is unique with subtle glaze variations. Includes dripper, carafe, and two mugs.'),
    dict(category_slug='living-home', name='Soy Wax Candle Set',    brand='Ember & Ash',  price=899,  old_price=None, badge='Bestseller', stock=25, description='A trio of hand-poured soy wax candles in amber glass jars. Scents: cedar, sandalwood, and vetiver.'),
    # Fashion
    dict(category_slug='fashion',     name='Oversized Wool Blazer', brand='Atelier',      price=5999, old_price=8499, badge='Sale',       stock=5,  description='Timeless oversized blazer cut from premium Italian wool. Single-button closure, two patch pockets, fully lined.'),
    dict(category_slug='fashion',     name='Canvas Tote Bag',       brand='Everyday',     price=899,  old_price=None, badge='Bestseller', stock=30, description='Sturdy 12oz canvas tote with interior zip pocket and key fob. Fits a 15" laptop. Reinforced stitching.'),
    dict(category_slug='fashion',     name='Relaxed Linen Shirt',   brand='Atelier',      price=2799, old_price=None, badge='New',        stock=18, description='Boxy-fit linen shirt with mother-of-pearl buttons. Breathable and pre-washed for instant softness.'),
    # Furniture
    dict(category_slug='furniture',   name='Wooden Desk Lamp',      brand='Lumière',      price=3499, old_price=4200, badge='Sale',       stock=7,  description='Warm-toned solid teak base with an adjustable steel arm and Edison-style bulb. Cord length 1.8m.'),
    dict(category_slug='furniture',   name='Rattan Side Table',     brand='Maison',       price=4199, old_price=None, badge='New',        stock=4,  description='Lightweight rattan side table with a tempered glass top. Perfect for indoor or covered outdoor use.'),
    dict(category_slug='furniture',   name='Sheepskin Floor Pouf',  brand='Koos Studio',  price=3299, old_price=4199, badge='Sale',       stock=9,  description='Hand-stitched sheepskin floor pouf. Natural wool, dense fill. 55cm diameter.'),
    # Beauty
    dict(category_slug='beauty',      name='Cold Pressed Face Oil', brand='Sève',         price=1599, old_price=None, badge='',           stock=20, description='A restorative blend of rosehip, sea buckthorn, and jojoba oils. 30ml amber glass dropper bottle.'),
    dict(category_slug='beauty',      name='Bamboo Brush Set',      brand='Green Ritual', price=749,  old_price=999,  badge='Sale',       stock=15, description='Zero-waste bamboo brush set — face brush, kabuki, and blender. Soft synthetic bristles, plastic-free packaging.'),
    dict(category_slug='beauty',      name='Rose Clay Mask',        brand='Sève',         price=1199, old_price=None, badge='New',        stock=22, description='Fine-ground rose clay with calendula and aloe. Draws out impurities while keeping skin balanced.'),
]


class Command(BaseCommand):
    help = 'Seed the database with categories and products'

    def handle(self, *args, **options):
        # Categories
        cat_map = {}
        for c in CATEGORIES:
            obj, created = Category.objects.get_or_create(
                slug=c['slug'],
                defaults={'name': c['name'], 'emoji': c['emoji']},
            )
            # Update emoji if category already existed
            if not created and obj.emoji != c['emoji']:
                obj.emoji = c['emoji']
                obj.save()
            cat_map[c['slug']] = obj
            self.stdout.write(f"  {'Created' if created else 'Exists'} category: {obj.name}")

        # Products
        for p in PRODUCTS:
            slug = p.pop('category_slug')
            category = cat_map[slug]
            obj, created = Product.objects.get_or_create(
                name=p['name'],
                defaults={**p, 'category': category},
            )
            self.stdout.write(f"  {'Created' if created else 'Exists'} product: {obj.name}")

        self.stdout.write(self.style.SUCCESS('\n✅ Seed complete!'))
