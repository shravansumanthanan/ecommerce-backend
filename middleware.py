from flask import request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask_jwt_extended.exceptions import JWTExtendedException
from jwt.exceptions import PyJWTError
from models import User
from utils import error_response

def role_based_access_control():
    # Public endpoints that don't require authentication
    public_endpoints = [
        'welcome',  # Root endpoint
        'health',
        'auth.register',  # Registration
        'auth.login',    # Login
    ]
    
    # Allow public access to welcome, register, login, and GET /products endpoints
    if (request.endpoint in public_endpoints or 
        (request.endpoint and request.endpoint.startswith('product.') and request.method == 'GET')):
        return None
        
    try:
        verify_jwt_in_request()
    except (JWTExtendedException, PyJWTError) as e:
        return error_response(message='Missing or invalid authorization token', status_code=401, details=str(e))
    except Exception as e:
        return error_response(message='Authentication error', status_code=401, details=str(e))

    endpoint = request.endpoint
    current_user_id = get_jwt_identity()
    user = User.find_by_id(current_user_id)

    if not user:
        return error_response(message='User not found', status_code=404)

    if endpoint:
        if user['role'] == 'buyer' and endpoint.startswith('product.') and request.method in ['POST', 'PUT', 'DELETE']:
            return error_response(message='Access denied', status_code=403)
        if user['role'] == 'seller' and endpoint.startswith('cart.'):
            return error_response(message='Access denied', status_code=403)
        if user['role'] == 'seller' and endpoint.startswith('order.'):
            return error_response(message='Access denied', status_code=403)

    return None
