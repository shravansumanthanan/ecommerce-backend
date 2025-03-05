from flask import Blueprint, request, jsonify
from models import Order, Cart, Product

order_bp = Blueprint('order', __name__)

@order_bp.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    user_id = data.get('user_id')

    cart = Cart.find_by_user_id(user_id)
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    total_price = 0
    items = []
    for item in cart['items']:
        product = Product.find_by_id(item['product_id'])
        if not product:
            return jsonify({'message': f'Product {item["product_id"]} not found'}), 404
        total_price += product['price'] * item['quantity']
        items.append({
            'product_id': item['product_id'],
            'quantity': item['quantity'],
            'price': product['price']
        })

    new_order = Order(user_id=user_id, items=items, total_price=total_price)
    new_order.save()

    # Clear the cart after checkout
    Cart.delete(cart['_id'])

    return jsonify({'message': 'Order placed successfully', 'order_id': new_order._id}), 201

@order_bp.route('/orders', methods=['GET'])
def get_orders():
    user_id = request.args.get('user_id')

    orders = Order.find_by_user_id(user_id)
    if not orders:
        return jsonify({'message': 'No orders found'}), 404

    return jsonify(orders), 200

@order_bp.route('/orders/<order_id>', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json()
    status = data.get('status')

    Order.update_status(order_id, status)

    return jsonify({'message': 'Order status updated'}), 200
