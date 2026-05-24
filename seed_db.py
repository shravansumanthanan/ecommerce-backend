import os
import sys
from pymongo import MongoClient

# Use the same connection logic as the app
mongo_uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(mongo_uri)
db = client['ecommerce']

products = [
    {
        "name": "Bose QuietComfort Earbuds",
        "description": "True wireless noise cancelling bluetooth earbuds with world-class audio.",
        "price": 279.00,
        "category": "Earbuds",
        "image_url": "/images/bose.png"
    },
    {
        "name": "AirPods Max",
        "description": "A perfect balance of high-fidelity audio and magical AirPods experience.",
        "price": 549.00,
        "category": "Headphones",
        "image_url": "/images/airpods.png"
    },
    {
        "name": "HTC VIVE Pro VR",
        "description": "Professional-grade VR headset for immersive and high-fidelity virtual reality.",
        "price": 799.00,
        "category": "VR Headset",
        "image_url": "/images/vive.png"
    },
    {
        "name": "JBL Live 460NC",
        "description": "Wireless on-ear noise cancelling headphones with deep bass.",
        "price": 129.95,
        "category": "Headphones",
        "image_url": "/images/jbl.png"
    },
    {
        "name": "Marshall Major IV",
        "description": "Iconic wireless headphones with 80+ hours of wireless playtime.",
        "price": 149.99,
        "category": "Headphones",
        "image_url": "/images/marshall.png"
    },
    {
        "name": "Beats Studio Pro",
        "description": "Premium wireless noise cancelling headphones with custom acoustic platform.",
        "price": 349.99,
        "category": "Headphones",
        "image_url": "/images/beats.png"
    }
]

# Clear existing products to ensure a clean demo
db.products.delete_many({})

# Insert new ones
db.products.insert_many(products)

print(f"Successfully seeded {len(products)} products into the database.")
