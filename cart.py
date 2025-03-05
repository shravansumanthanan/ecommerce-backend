from flask import Blueprint, request, jsonify
from models import Cart, Product

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    cart = Cart.find_by_user_id(user_id)
    if not cart:
        cart = Cart(user_id=user_id)
    
    cart.add_item(product_id, quantity)
    cart.save()

    return jsonify({'message': 'Item added to cart'}), 201

@cart_bp.route('/cart/<product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    user_id = request.args.get('user_id')

    cart = Cart.find_by_user_id(user_id)
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    cart.remove_item(product_id)
    cart.save()

    return jsonify({'message': 'Item removed from cart'}), 200

@cart_bp.route('/cart/<product_id>', methods=['PUT'])
def update_cart_item(product_id):
    data = request.get_json()
    user_id = data.get('user_id')
    quantity = data.get('quantity')

    cart = Cart.find_by_user_id(user_id)
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    cart.update_item(product_id, quantity)
    cart.save()

    return jsonify({'message': 'Cart item updated'}), 200

@cart_bp.route('/cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('user_id')

    cart = Cart.find_by_user_id(user_id)
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    return jsonify(cart), 200

@cart_bp.route('/cart/total', methods=['GET'])
def get_cart_total():
    user_id = request.args.get('user_id')

    cart = Cart.find_by_user_id(user_id)
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    total_price = 0
    for item in cart['items']:
        product = Product.find_by_id(item['product_id'])
        total_price += product['price'] * item['quantity']

    return jsonify({'total_price': total_price}), 200
