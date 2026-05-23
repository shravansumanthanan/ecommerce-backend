from flask import Flask, jsonify
from config import Config
from extensions import jwt, cors, db_manager

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    db_manager.init_app(app)

    # Register blueprints
    from auth import auth_bp
    from product import product_bp
    from cart import cart_bp
    from order import order_bp
    from coupon import coupon_bp
    from webhook import webhook_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(product_bp, url_prefix='/api/v1')
    app.register_blueprint(cart_bp, url_prefix='/api/v1')
    app.register_blueprint(order_bp, url_prefix='/api/v1')
    app.register_blueprint(coupon_bp, url_prefix='/api/v1')
    app.register_blueprint(webhook_bp, url_prefix='/api/v1/webhook')

    # Register error handlers and middleware
    from error_handling import register_error_handlers
    from middleware import role_based_access_control
    from logging_config import setup_logging
    
    app.before_request(role_based_access_control)
    register_error_handlers(app)
    setup_logging()

    @app.route('/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'message': 'E-Commerce Marketplace API is running',
            'version': '1.0'
        }), 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=int(app.config.get('PORT', 5000)), debug=app.config.get('FLASK_ENV') == 'development')
