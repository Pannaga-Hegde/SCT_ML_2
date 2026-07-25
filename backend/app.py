from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.routes.cluster import cluster_bp
from backend.routes.analytics import analytics_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all domains to ease local development and deployment testing
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(cluster_bp)
    app.register_blueprint(analytics_bp)

    @app.route('/', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "message": "CustomerInsight API is running",
            "version": "1.0.0"
        })

    return app

app = create_app()

if __name__ == '__main__':
    # Add project root directory to path to allow absolute imports when running directly
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
