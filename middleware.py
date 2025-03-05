from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models import User

def role_based_access_control():
    # Public endpoints that don't require authentication
    public_endpoints = [
        'welcome',  # Root endpoint
        'auth.register',  # Registration
        'auth.login',    # Login
    ]
    
    # Allow public access to welcome, register, login, and GET /products endpoints
    if (request.endpoint in public_endpoints or 
        (request.endpoint and request.endpoint.startswith('product.') and request.method == 'GET')):
        return None
        
    try:
        verify_jwt_in_request()
    except:
        return jsonify({'message': 'Missing or invalid authorization token'}), 401

    endpoint = request.endpoint
    current_user_id = get_jwt_identity()
    user = User.find_by_id(current_user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if endpoint.startswith('auth.') or endpoint.startswith('product.') or endpoint.startswith('cart.') or endpoint.startswith('order.') or endpoint.startswith('coupon.') or endpoint.startswith('webhook.'):
        if user['role'] == 'buyer' and endpoint.startswith('product.') and request.method in ['POST', 'PUT', 'DELETE']:
            return jsonify({'message': 'Access denied'}), 403
        if user['role'] == 'seller' and endpoint.startswith('cart.'):
            return jsonify({'message': 'Access denied'}), 403
        if user['role'] == 'seller' and endpoint.startswith('order.'):
            return jsonify({'message': 'Access denied'}), 403

    return None
