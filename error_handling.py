from utils import error_response

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        return error_response(message='Bad request', status_code=400, details=str(error))

    @app.errorhandler(401)
    def unauthorized(error):
        return error_response(message='Unauthorized', status_code=401, details=str(error))

    @app.errorhandler(403)
    def forbidden(error):
        return error_response(message='Forbidden', status_code=403, details=str(error))

    @app.errorhandler(404)
    def not_found(error):
        return error_response(message='Not found', status_code=404, details=str(error))

    @app.errorhandler(500)
    def internal_server_error(error):
        return error_response(message='Internal server error', status_code=500, details=str(error))
