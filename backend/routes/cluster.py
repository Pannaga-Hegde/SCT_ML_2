from flask import Blueprint, request, jsonify
from backend.services.predictor import predictor_service

cluster_bp = Blueprint('cluster', __name__)

@cluster_bp.route('/cluster', methods=['POST'])
def predict_cluster():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        annual_income = data.get('annual_income')
        spending_score = data.get('spending_score')

        if annual_income is None or spending_score is None:
            return jsonify({"error": "Missing annual_income or spending_score"}), 400

        try:
            annual_income = float(annual_income)
            spending_score = float(spending_score)
        except ValueError:
            return jsonify({"error": "Inputs must be numeric values"}), 400

        result = predictor_service.predict(annual_income, spending_score)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
