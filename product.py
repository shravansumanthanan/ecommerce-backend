from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Product
from schemas import ProductSchema
from utils import success_response, error_response
from marshmallow import ValidationError

product_bp = Blueprint('product', __name__)

@product_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    schema = ProductSchema()
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response('Validation failed', 400, err.messages)

    seller_id = get_jwt_identity()

    new_product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        category=data['category'],
        seller_id=seller_id,
        stock=data.get('stock', 0),
        image_url=data.get('image_url')
    )
    product_id = new_product.save()

    return success_response(data={'product_id': product_id}, message='Product created successfully', status_code=201)

@product_bp.route('/products/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    product = Product.find_by_id(product_id)
    if not product:
        return error_response('Product not found', 404)
    
    if product['seller_id'] != get_jwt_identity():
        return error_response('Access denied: You do not own this product', 403)

    schema = ProductSchema(partial=True)
    try:
        update_data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response('Validation failed', 400, err.messages)

    Product.update(product_id, update_data)
    return success_response(message='Product updated successfully')

@product_bp.route('/products/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    product = Product.find_by_id(product_id)
    if not product:
        return error_response('Product not found', 404)
    
    if product['seller_id'] != get_jwt_identity():
        return error_response('Access denied: You do not own this product', 403)

    Product.delete(product_id)
    return success_response(message='Product deleted successfully')

@product_bp.route('/products', methods=['GET'])
def list_products():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    result = Product.find_all(page=page, per_page=per_page)
    return success_response(data=result['items'], meta={'page': result['page'], 'total': result['total'], 'per_page': result['per_page']})

@product_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.find_by_id(product_id)
    if not product:
        return error_response('Product not found', 404)
    return success_response(data=product)

@product_bp.route('/products/search', methods=['GET'])
def search_products():
    keywords = request.args.get('keywords')
    category = request.args.get('category')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))

    result = Product.search(keywords=keywords, category=category, min_price=min_price, max_price=max_price, page=page, per_page=per_page)
    return success_response(data=result['items'], meta={'page': result['page'], 'total': result['total'], 'per_page': result['per_page']})
