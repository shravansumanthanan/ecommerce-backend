from marshmallow import Schema, fields, validate

class UserRegistrationSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)

class ProductSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1))
    description = fields.String(required=True)
    price = fields.Float(required=True, validate=validate.Range(min=0.01))
    category = fields.String(required=True)
    stock = fields.Integer(missing=0, validate=validate.Range(min=0))
    image_url = fields.Url(missing=None)

class CartItemSchema(Schema):
    product_id = fields.String(required=True, validate=validate.Length(equal=24))
    quantity = fields.Integer(required=True, validate=validate.Range(min=1))

class OrderStatusSchema(Schema):
    status = fields.String(required=True, validate=validate.OneOf(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']))
