import os
import sys
from pymongo import MongoClient

# Use the same connection logic as the app
mongo_uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(mongo_uri)
db = client['ecommerce']

products = [
    {
        "name": "Wireless Earbuds, IPX8",
        "description": "Organic Cotton, fairtrade certified",
        "price": 89.00,
        "category": "Headphone",
        "image_url": "/api/placeholder/earbuds.png"
    },
    {
        "name": "AirPods Max",
        "description": "A perfect balance of high-fidelity audio",
        "price": 559.00,
        "category": "Headphone",
        "image_url": "/images/airpods.png"
    },
    {
        "name": "Bose BT Earphones",
        "description": "Table with air purifier, stained venner/black",
        "price": 289.00,
        "category": "Headphone",
        "image_url": "/api/placeholder/bose.png"
    },
    {
        "name": "VIVEFOX Headphones",
        "description": "Wired Stereo Headsets With Mic",
        "price": 39.00,
        "category": "Headphone",
        "image_url": "/api/placeholder/vivefox.png"
    },
    {
        "name": "JBL TUNE 600BTNC",
        "description": "Premium Bone Conduction Open Ear Bluetooth",
        "price": 59.00,
        "category": "Headphone",
        "image_url": "/api/placeholder/jbl.png"
    },
    {
        "name": "TAGRY Bluetooth",
        "description": "256, 8 core GPU, 8 GB",
        "price": 109.00,
        "category": "Headphone",
        "image_url": "/api/placeholder/tagry.png"
    }
]

# Clear existing products to ensure a clean demo
db.products.delete_many({})

# Insert new ones
db.products.insert_many(products)

print(f"Successfully seeded {len(products)} products into the database.")
