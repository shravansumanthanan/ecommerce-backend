# E-Commerce Marketplace Backend

A Flask-based e-commerce backend system with features like user authentication, product management, shopping cart, order processing, and coupon management.

## Features

- User Authentication (JWT)
- Product Management (CRUD operations)
- Shopping Cart Management
- Order Processing
- Coupon/Discount System
- Webhook Integration
- Role-Based Access Control (Buyer/Seller)

## Prerequisites

- Python 3.7+
- MongoDB
- pip (Python package manager)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # For Unix/macOS
# OR
.\venv\Scripts\activate  # For Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Environment Configuration:
Create a `.env` file in the root directory with the following variables:
```
FLASK_APP=app.py
FLASK_ENV=development
MONGO_URI=mongodb://localhost:27017/
MONGO_DBNAME=ecommerce
JWT_SECRET_KEY=your-secret-key
```

5. Start the application:
```bash
flask run
```

The server will start on `http://localhost:5000`

## API Usage Examples

Here are some practical examples using curl commands to interact with the API:

### Authentication

1. Register a new user:
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password",
    "role": "buyer"
  }'
```

2. Login:
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure_password"
  }'
```
Save the returned access token for subsequent requests.

### Product Management

1. Create a product (Seller only):
```bash
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Smartphone",
    "description": "Latest model smartphone",
    "price": 999.99,
    "category": "Electronics"
  }'
```

2. Get all products:
```bash
curl -X GET http://localhost:5000/products
```

3. Search products by category:
```bash
curl -X GET "http://localhost:5000/products/search?category=Electronics"
```

### Shopping Cart

1. Add item to cart:
```bash
curl -X POST http://localhost:5000/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": "PRODUCT_ID",
    "quantity": 1
  }'
```

2. View cart:
```bash
curl -X GET http://localhost:5000/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Coupon Management

1. Create a coupon (Seller only):
```bash
curl -X POST http://localhost:5000/coupon \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "code": "SUMMER2023",
    "discount": 20
  }'
```

2. Apply coupon:
```bash
curl -X POST http://localhost:5000/coupon/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "code": "SUMMER2023"
  }'
```

### Order Processing

Create an order:
```bash
curl -X POST http://localhost:5000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "payment_method": "credit_card"
  }'
```

## Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message explaining the error:
```json
{
    "error": "Error description here"
}
```

## Testing

Run the tests using:
```bash
python -m pytest
```

## Logging

Logs are stored in `ecommerce.log`. The logging level can be configured in `logging_config.py`.

## Security Notes

- All passwords are hashed before storage
- JWT tokens expire after 24 hours
- API endpoints are protected with role-based authentication
- Input validation is implemented for all endpoints

## Development

To contribute:
1. Create a new branch
2. Make your changes
3. Submit a pull request

## Database Structure
![image](https://github.com/user-attachments/assets/6fe2651d-6af9-42a2-af0a-052ff6769e12)

![image](https://github.com/user-attachments/assets/9cdf0f8b-72ac-4b2e-9f6c-5bbace1b190e)

![image](https://github.com/user-attachments/assets/4d17b322-3a2d-4a7e-8ac3-fcc6477bc565)

![image](https://github.com/user-attachments/assets/44f2876f-619e-452e-9340-72abcdfb99a5)

![image](https://github.com/user-attachments/assets/afd06b2b-c8b6-4e36-bdc9-cdb7acc09b01)

![image](https://github.com/user-attachments/assets/eaae87be-b4cc-40de-b29c-fdfe8027b797)

![image](https://github.com/user-attachments/assets/439a7907-c300-466f-b165-880439ef75b1)

![image](https://github.com/user-attachments/assets/f961a7d9-3bea-4ccc-aa76-ba7dc7d03cf0)

![image](https://github.com/user-attachments/assets/b75367ee-3d80-489c-b2d4-f3b87f0b92ca)

![image](https://github.com/user-attachments/assets/0d85a8af-4bcb-456d-b2ba-26b74980c0b7)

![image](https://github.com/user-attachments/assets/fffa9fc1-e97f-47f4-b53c-a61962e1c79e)

![image](https://github.com/user-attachments/assets/b42f7606-2583-4dfa-8a86-678c49900561)
