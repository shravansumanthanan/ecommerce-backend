from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from flask_cors import CORS

jwt = JWTManager()
cors = CORS()

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None

    def get_db(self):
        return self.db

    def init_app(self, app):
        self.client = MongoClient(
            app.config['MONGO_URI'],
            maxPoolSize=50,
            serverSelectionTimeoutMS=5000
        )
        self.db = self.client[app.config['MONGO_DBNAME']]
        self._setup_indexes()

    def _setup_indexes(self):
        try:
            self.db.users.create_index("email", unique=True)
            self.db.users.create_index("username", unique=True)
            self.db.products.create_index([
                ("name", "text"),
                ("description", "text"),
                ("category", "text")
            ])
            self.db.products.create_index("category")
        except Exception as e:
            print(f"Warning: Could not create indexes: {e}")

db_manager = DatabaseManager()
