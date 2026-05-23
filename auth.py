from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User
from schemas import UserRegistrationSchema, UserLoginSchema
from utils import success_response, error_response
from marshmallow import ValidationError

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    schema = UserRegistrationSchema()
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response('Validation failed', 400, err.messages)

    if User.find_by_email(data['email']):
        return error_response('User already exists', 400)

    # Force role to buyer via API unless it's a special setup
    new_user = User(
        username=data['username'], 
        email=data['email'], 
        password=data['password'], 
        role='buyer'
    )
    new_user.save()

    return success_response(message='User registered successfully', status_code=201)

@auth_bp.route('/login', methods=['POST'])
def login():
    schema = UserLoginSchema()
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response('Validation failed', 400, err.messages)

    user = User.find_by_email(data['email'])
    if not user or not User.verify_password(user['password'], data['password']):
        return error_response('Invalid credentials', 401)

    access_token = create_access_token(identity=str(user['_id']))
    return success_response(
        data={'access_token': access_token, 'user': {'id': str(user['_id']), 'username': user['username'], 'role': user['role']}},
        message='Login successful'
    )

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.find_by_id(current_user_id)
    if not user:
        return error_response('User not found', 404)
    user_data = {'id': str(user['_id']), 'username': user['username'], 'email': user['email'], 'role': user['role']}
    return success_response(data=user_data)
