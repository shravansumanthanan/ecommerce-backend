from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Order, Cart
from extensions import db_manager
from schemas import OrderStatusSchema, CheckoutPayloadSchema
from utils import success_response, error_response
from marshmallow import ValidationError
from bson import ObjectId

order_bp = Blueprint('order', __name__)

@order_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    schema = CheckoutPayloadSchema()
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response('Validation failed', 400, err.messages)

    user_id = get_jwt_identity()
    cart = Cart.find_by_user_id(user_id)

    if not cart or not cart.get('items'):
        return error_response('Cart is empty', 400)

    items = cart['items']
    total_price = 0
    db = db_manager.get_db()

    # 1. Check stock for all items
    for item in items:
        try:
            p_id = ObjectId(item['product_id'])
        except Exception:
            return error_response(f'Invalid product ID {item["product_id"]}', 400)
            
        prod_doc = db.products.find_one({'_id': p_id})
        if not prod_doc:
            return error_response(f'Product {item["product_id"]} not found', 400)
        if prod_doc.get('stock', 0) < item['quantity']:
            return error_response(f'Insufficient stock for product {prod_doc.get("name", item["product_id"])}', 400)
        
        item['price'] = prod_doc['price']
        total_price += prod_doc['price'] * item['quantity']

    # 2. Deduct stock
    for item in items:
        p_id = ObjectId(item['product_id'])
        db.products.update_one(
            {'_id': p_id},
            {'$inc': {'stock': -item['quantity']}}
        )

    # 3. Create Order
    order_id = Order.create(
        user_id=user_id, 
        items=items, 
        total_price=total_price,
        shipping_address=data['shipping_address'],
        payment_info=data['payment_info']
    )
    
    # 4. Clear Cart
    Cart.delete(user_id)
            
    return success_response(data={'order_id': order_id}, message='Order placed successfully', status_code=201)

@order_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    result = Order.find_by_user_id(user_id, page=page, per_page=per_page)
    return success_response(data=result['items'], meta={'page': result['page'], 'total': result['total'], 'per_page': result['per_page']})

@order_bp.route('/orders/<order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    schema = OrderStatusSchema()
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response('Validation failed', 400, err.messages)

    Order.update_status(order_id, data['status'])
    return success_response(message='Order status updated successfully')
