import os

class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.join(BASE_DIR, 'model', 'kmeans_model.pkl')
    SCALER_PATH = os.path.join(BASE_DIR, 'model', 'scaler.pkl')
    DATASET_PATH = os.path.join(BASE_DIR, 'dataset', 'Mall_Customers.csv')
    PORT = int(os.environ.get('PORT', 5001))
    DEBUG = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
