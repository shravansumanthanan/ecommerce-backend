from flask import Flask, jsonify
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from config import Config
from auth import auth_bp
from product import product_bp
from cart import cart_bp
from order import order_bp
from coupon import coupon_bp
from webhook import webhook_bp
from middleware import role_based_access_control
from error_handling import register_error_handlers
from logging_config import setup_logging

app = Flask(__name__)
app.config.from_object(Config)

# Set up MongoDB connection
client = MongoClient(app.config['MONGO_URI'])
db = client[app.config['MONGO_DBNAME']]

# Set up JWT
jwt = JWTManager(app)

@app.route('/')
def welcome():
    return jsonify({
        'message': 'Welcome to E-Commerce Marketplace API',
        'version': '1.0'
    }), 200

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(order_bp)
app.register_blueprint(coupon_bp)
app.register_blueprint(webhook_bp)

# Apply middleware
app.before_request(role_based_access_control)

# Register error handlers
register_error_handlers(app)

# Set up logging
setup_logging()

if __name__ == '__main__':
    app.run(debug=True)
