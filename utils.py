from flask import jsonify

def success_response(data=None, message="Success", status_code=200, meta=None):
    response = {
        "success": True,
        "message": message,
        "data": data,
        "error": None
    }
    if meta:
        response["meta"] = meta
    return jsonify(response), status_code

def error_response(message="An error occurred", status_code=400, details=None):
    return jsonify({
        "success": False,
        "message": message,
        "data": None,
        "error": details
    }), status_code
