# E-Commerce Marketplace (Backend API)

> A modern, fully containerized e-commerce backend platform built with Flask and MongoDB.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

This project provides a production-ready, scalable foundation for an e-commerce marketplace backend. It abstracts away the complexity of managing authentication, shopping carts, and checkout logic, providing a seamless API for any client application to consume.

## Tech Stack

- **Backend:** Python, Flask, PyMongo, Flask-JWT-Extended, Marshmallow
- **Database:** MongoDB
- **Orchestration:** Docker & Docker Compose

## Quick Start (Docker)

The fastest way to run the entire backend stack (API and Database) is using Docker Compose.

**Prerequisites**: [Docker](https://docs.docker.com/get-docker/) and Git.

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ecommerce-backend
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build -d
   ```

3. **Access the API**:
   - Running at `http://localhost:5000/api/v1`
   - Healthcheck: `http://localhost:5000/health`

## Local Development (Without Docker)

If you prefer to run the services individually for development:

### Backend Setup
1. Open a terminal in the project root:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Create a `.env` file in the root directory:
   ```env
   FLASK_ENV=development
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET_KEY=your-secret-key-here
   PORT=5000
   ```
3. Ensure MongoDB is running locally on port 27017.
4. Run the API:
   ```bash
   python app.py
   ```

## Key Endpoints

- **Auth**: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- **Products**: `GET /api/v1/products`, `POST /api/v1/products`
- **Cart**: `GET /api/v1/cart`, `POST /api/v1/cart`
- **Checkout**: `POST /api/v1/checkout`
- **Orders**: `GET /api/v1/orders`

## License
MIT License.
