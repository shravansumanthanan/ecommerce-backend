from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from utils import success_response, error_response

coupon_bp = Blueprint('coupon', __name__)

@coupon_bp.route('/coupons', methods=['POST'])
@jwt_required()
def create_coupon():
    # Stub
    return success_response(message='Coupon created successfully')

@coupon_bp.route('/coupons/<code>', methods=['GET'])
@jwt_required()
def get_coupon(code):
    # Stub
    return error_response('Coupon not found', 404)
