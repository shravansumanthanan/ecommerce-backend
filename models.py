from extensions import db_manager
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import datetime, timezone
from bson import ObjectId

def get_db():
    return db_manager.get_db()

class User:
    def __init__(self, username, email, password, role='buyer'):
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
        get_db().users.insert_one(user_data)

    @staticmethod
    def find_by_email(email):
        return get_db().users.find_one({'email': email})

    @staticmethod
    def find_by_id(user_id):
        if isinstance(user_id, str):
            try:
                user_id = ObjectId(user_id)
            except Exception:
                return None
        user = get_db().users.find_one({'_id': user_id})
        if user:
            user['_id'] = str(user['_id'])
        return user

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    @staticmethod
    def generate_tokens(user_id):
        access_token = create_access_token(identity=str(user_id))
        refresh_token = create_refresh_token(identity=str(user_id))
        return access_token, refresh_token

class Product:
    def __init__(self, name, description, price, category, seller_id, stock=0, image_url=None):
        self.name = name
        self.description = description
        self.price = price
        self.category = category
        self.seller_id = seller_id
        self.stock = stock
        self.image_url = image_url

    def save(self):
        product_data = {
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'seller_id': self.seller_id,
            'stock': self.stock,
            'image_url': self.image_url,
            'created_at': datetime.now(timezone.utc)
        }
        result = get_db().products.insert_one(product_data)
        return str(result.inserted_id)

    @staticmethod
    def find_all(page=1, per_page=20):
        skip = (page - 1) * per_page
        cursor = get_db().products.find().sort('_id', -1).skip(skip).limit(per_page)
        total = get_db().products.count_documents({})
        products = list(cursor)
        for product in products:
            product['_id'] = str(product['_id'])
        return {'items': products, 'total': total, 'page': page, 'per_page': per_page}

    @staticmethod
    def find_by_id(product_id):
        if isinstance(product_id, str):
            try:
                product_id = ObjectId(product_id)
            except Exception:
                return None
        product = get_db().products.find_one({'_id': product_id})
        if product:
            product['_id'] = str(product['_id'])
        return product

    @staticmethod
    def update(product_id, update_data):
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
        get_db().products.update_one({'_id': product_id}, {'$set': update_data})

    @staticmethod
    def delete(product_id):
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
        get_db().products.delete_one({'_id': product_id})

    @staticmethod
    def search(keywords=None, category=None, min_price=None, max_price=None, page=1, per_page=20):
        query = {}
        if category:
            query['category'] = category
        if min_price is not None or max_price is not None:
            query['price'] = {}
            if min_price is not None:
                query['price']['$gte'] = float(min_price)
            if max_price is not None:
                query['price']['$lte'] = float(max_price)
        if keywords:
            query['$text'] = {'$search': keywords}
            
        skip = (page - 1) * per_page
        cursor = get_db().products.find(query).skip(skip).limit(per_page)
        total = get_db().products.count_documents(query)
        products = list(cursor)
        for product in products:
            product['_id'] = str(product['_id'])
        return {'items': products, 'total': total, 'page': page, 'per_page': per_page}

class Cart:
    @staticmethod
    def find_by_user_id(user_id):
        cart = get_db().carts.find_one({'user_id': user_id})
        if cart:
            cart['_id'] = str(cart['_id'])
        return cart

    @staticmethod
    def add_item(user_id, product_id, quantity):
        # We need to either increment existing quantity or push new item
        # But for simplicity in schema updates, if item exists, update it, else push
        result = get_db().carts.update_one(
            {'user_id': user_id, 'items.product_id': product_id},
            {'$inc': {'items.$.quantity': quantity}}
        )
        if result.matched_count == 0:
            get_db().carts.update_one(
                {'user_id': user_id},
                {'$push': {'items': {'product_id': product_id, 'quantity': quantity}}},
                upsert=True
            )

    @staticmethod
    def remove_item(user_id, product_id):
        get_db().carts.update_one(
            {'user_id': user_id},
            {'$pull': {'items': {'product_id': product_id}}}
        )

    @staticmethod
    def update_item(user_id, product_id, quantity):
        get_db().carts.update_one(
            {'user_id': user_id, 'items.product_id': product_id},
            {'$set': {'items.$.quantity': quantity}}
        )

    @staticmethod
    def delete(user_id):
        get_db().carts.delete_one({'user_id': user_id})

class Order:
    @staticmethod
    def create(user_id, items, total_price):
        order_data = {
            'user_id': user_id,
            'items': items,
            'total_price': total_price,
            'status': 'Pending',
            'created_at': datetime.now(timezone.utc)
        }
        result = get_db().orders.insert_one(order_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_user_id(user_id, page=1, per_page=20):
        skip = (page - 1) * per_page
        cursor = get_db().orders.find({'user_id': user_id}).sort('_id', -1).skip(skip).limit(per_page)
        total = get_db().orders.count_documents({'user_id': user_id})
        orders = list(cursor)
        for order in orders:
            order['_id'] = str(order['_id'])
        return {'items': orders, 'total': total, 'page': page, 'per_page': per_page}

    @staticmethod
    def update_status(order_id, status):
        if isinstance(order_id, str):
            order_id = ObjectId(order_id)
        get_db().orders.update_one({'_id': order_id}, {'$set': {'status': status}})

class Coupon:
    # Stub for now
    @staticmethod
    def find_by_code(code):
        return None
