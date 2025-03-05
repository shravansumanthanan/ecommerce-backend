from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import datetime
from bson import ObjectId

client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce_db']

class User:
    def __init__(self, username, email, password, role):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.role = role

    def save(self):
        user_data = {
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'role': self.role
        }
        db.users.insert_one(user_data)

    @staticmethod
    def find_by_email(email):
        return db.users.find_one({'email': email})

    @staticmethod
    def find_by_id(user_id):
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        user = db.users.find_one({'_id': user_id})
        if user:
            user['_id'] = str(user['_id'])
        return user

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    @staticmethod
    def generate_tokens(user_id):
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        return access_token, refresh_token

class Product:
    def __init__(self, name, description, price, category, seller_id):
        self.name = name
        self.description = description
        self.price = price
        self.category = category
        self.seller_id = seller_id

    def save(self):
        product_data = {
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'seller_id': self.seller_id
        }
        result = db.products.insert_one(product_data)
        return str(result.inserted_id)

    @staticmethod
    def find_all():
        products = list(db.products.find())
        for product in products:
            product['_id'] = str(product['_id'])
        return products

    @staticmethod
    def find_by_id(product_id):
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
        product = db.products.find_one({'_id': product_id})
        if product:
            product['_id'] = str(product['_id'])
        return product

    @staticmethod
    def update(product_id, update_data):
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
        db.products.update_one({'_id': product_id}, {'$set': update_data})

    @staticmethod
    def delete(product_id):
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
        db.products.delete_one({'_id': product_id})

    @staticmethod
    def find(query):
        products = list(db.products.find(query))
        for product in products:
            product['_id'] = str(product['_id'])
        return products

class Cart:
    def __init__(self, user_id):
        self.user_id = user_id
        self.items = []

    def add_item(self, product_id, quantity):
        self.items.append({'product_id': product_id, 'quantity': quantity})

    def remove_item(self, product_id):
        self.items = [item for item in self.items if item['product_id'] != product_id]

    def update_item(self, product_id, quantity):
        for item in self.items:
            if item['product_id'] == product_id:
                item['quantity'] = quantity

    def save(self):
        cart_data = {
            'user_id': self.user_id,
            'items': self.items
        }
        db.carts.insert_one(cart_data)

    @staticmethod
    def find_by_user_id(user_id):
        return db.carts.find_one({'user_id': user_id})

    @staticmethod
    def delete(cart_id):
        db.carts.delete_one({'_id': cart_id})

    def apply_coupon(self, coupon):
        # Implement apply coupon logic here
        return 0

class Order:
    def __init__(self, user_id, items, total_price, status='Pending'):
        self.user_id = user_id
        self.items = items
        self.total_price = total_price
        self.status = status
        self.created_at = datetime.now(datetime.timezone.utc)

    def save(self):
        order_data = {
            'user_id': self.user_id,
            'items': self.items,
            'total_price': self.total_price,
            'status': self.status,
            'created_at': self.created_at
        }
        db.orders.insert_one(order_data)

    @staticmethod
    def find_by_user_id(user_id):
        return list(db.orders.find({'user_id': user_id}))

    @staticmethod
    def update_status(order_id, status):
        db.orders.update_one({'_id': order_id}, {'$set': {'status': status}})

class Coupon:
    def __init__(self, code, discount, expiration_date):
        self.code = code
        self.discount = discount
        self.expiration_date = expiration_date

    def save(self):
        # Implement save logic here
        pass

    @staticmethod
    def find_by_code(code):
        # Implement find logic here
        return None
