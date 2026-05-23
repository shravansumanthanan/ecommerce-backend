from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Cart, Product
from schemas import CartItemSchema
from utils import success_response, error_response
from marshmallow import ValidationError

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    schema = CartItemSchema()
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response('Validation failed', 400, err.messages)

    product = Product.find_by_id(data['product_id'])
    if not product:
        return error_response('Product not found', 404)

    if product.get('stock', 0) < data['quantity']:
        return error_response('Insufficient stock', 400)

    Cart.add_item(user_id, data['product_id'], data['quantity'])
    return success_response(message='Item added to cart')

@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def view_cart():
    user_id = get_jwt_identity()
    cart = Cart.find_by_user_id(user_id)
    if not cart:
        return success_response(data={'items': []})
    
    # populate product details
    for item in cart.get('items', []):
        product = Product.find_by_id(item['product_id'])
        if product:
            item['product'] = product
    return success_response(data=cart)

@cart_bp.route('/cart/<product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    user_id = get_jwt_identity()
    Cart.remove_item(user_id, product_id)
    return success_response(message='Item removed from cart')

@cart_bp.route('/cart/<product_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(product_id):
    user_id = get_jwt_identity()
    schema = CartItemSchema()
    try:
        data = schema.load({'product_id': product_id, **(request.get_json() or {})})
    except ValidationError as err:
        return error_response('Validation failed', 400, err.messages)

    Cart.update_item(user_id, product_id, data['quantity'])
    return success_response(message='Cart item updated')
