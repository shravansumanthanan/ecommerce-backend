from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import Product

product_bp = Blueprint('product', __name__)

@product_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    category = data.get('category')
    seller_id = data.get('seller_id')

    new_product = Product(name=name, description=description, price=price, category=category, seller_id=seller_id)
    new_product.save()

    return jsonify({'message': 'Product created successfully'}), 201

@product_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.find_by_id(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    return jsonify(product), 200

@product_bp.route('/products/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    data = request.get_json()
    update_data = {
        'name': data.get('name'),
        'description': data.get('description'),
        'price': data.get('price'),
        'category': data.get('category')
    }

    Product.update(product_id, update_data)
    return jsonify({'message': 'Product updated successfully'}), 200

@product_bp.route('/products/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    Product.delete(product_id)
    return jsonify({'message': 'Product deleted successfully'}), 200

@product_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.find_all()
    return jsonify(products), 200

@product_bp.route('/products/search', methods=['GET'])
def search_products():
    category = request.args.get('category')
    price_range = request.args.get('price_range')
    keywords = request.args.get('keywords')

    query = {}
    if category:
        query['category'] = category
    if price_range:
        min_price, max_price = map(float, price_range.split('-'))
        query['price'] = {'$gte': min_price, '$lte': max_price}
    if keywords:
        query['$text'] = {'$search': keywords}

    products = Product.find(query)
    return jsonify(products), 200
