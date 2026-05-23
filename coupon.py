from flask import Blueprint, request, jsonify
from models import Coupon, Cart

coupon_bp = Blueprint('coupon', __name__)

@coupon_bp.route('/coupons', methods=['POST'])
def create_coupon():
    data = request.get_json()
    code = data.get('code')
    discount = data.get('discount')
    expiration_date = data.get('expiration_date')

    coupon = Coupon(code=code, discount=discount, expiration_date=expiration_date)
    coupon.save()

    return jsonify({'message': 'Coupon created successfully'}), 201

@coupon_bp.route('/coupons/apply', methods=['POST'])
def apply_coupon():
    data = request.get_json()
    user_id = data.get('user_id')
    code = data.get('code')

    coupon = Coupon.find_by_code(code)
    if not coupon:
        return jsonify({'message': 'Invalid coupon code'}), 404

    cart = Cart.find_by_user_id(user_id)
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    discount_amount = cart.apply_coupon(coupon)
    cart.save()

    return jsonify({'message': 'Coupon applied successfully', 'discount_amount': discount_amount}), 200
