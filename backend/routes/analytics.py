from flask import Blueprint, jsonify
import pandas as pd
from backend.config import Config
from backend.services.predictor import predictor_service

analytics_bp = Blueprint('analytics', __name__)

def get_loaded_df():
    # Load dataset and assign clusters dynamically using the model
    df = pd.read_csv(Config.DATASET_PATH)
    features = ['Annual Income (k$)', 'Spending Score (1-100)']
    X = df[features]
    X_scaled = predictor_service.scaler.transform(X)
    df['Cluster'] = predictor_service.model.predict(X_scaled)
    return df

@analytics_bp.route('/metrics', methods=['GET'])
def get_metrics():
    try:
        df = get_loaded_df()
        num_customers = len(df)
        num_clusters = int(predictor_service.model.n_clusters)
        inertia = float(predictor_service.model.inertia_)
        
        # Calculate silhouette score
        from sklearn.metrics import silhouette_score
        features = ['Annual Income (k$)', 'Spending Score (1-100)']
        X_scaled = predictor_service.scaler.transform(df[features])
        sil_score = float(silhouette_score(X_scaled, df['Cluster']))

        # Return a list of Elbow values for the frontend line chart
        # We can run the K-Means inertia computation on the spot or return static precalculated points:
        elbow_data = [
            {"k": 1, "wcss": 400.0}, # Approximated scaled values for visual rendering
            {"k": 2, "wcss": 269.69},
            {"k": 3, "wcss": 157.70},
            {"k": 4, "wcss": 108.92},
            {"k": 5, "wcss": 65.57},
            {"k": 6, "wcss": 55.06},
            {"k": 7, "wcss": 44.86},
            {"k": 8, "wcss": 37.23},
            {"k": 9, "wcss": 32.39},
            {"k": 10, "wcss": 29.98}
        ]

        return jsonify({
            "num_customers": num_customers,
            "num_clusters": num_clusters,
            "inertia": round(inertia, 2),
            "silhouette_score": round(sil_score, 4),
            "elbow_data": elbow_data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        df = get_loaded_df()
        
        # Get centroids in original scale
        centroids_scaled = predictor_service.model.cluster_centers_
        centroids_unscaled = predictor_service.scaler.inverse_transform(centroids_scaled)
        
        # Create centroid list with details
        centroids_list = []
        for i, center in enumerate(centroids_unscaled):
            meta = predictor_service.get_cluster_metadata(i)
            centroids_list.append({
                "cluster_id": i,
                "annual_income": round(float(center[0]), 2),
                "spending_score": round(float(center[1]), 2),
                "customer_type": meta["customer_type"],
                "segment": meta["segment"]
            })

        # Scatter plot data
        scatter_data = []
        for idx, row in df.iterrows():
            meta = predictor_service.get_cluster_metadata(row['Cluster'])
            scatter_data.append({
                "id": int(row['CustomerID']),
                "gender": row['Gender'],
                "age": int(row['Age']),
                "annual_income": float(row['Annual Income (k$)']),
                "spending_score": float(row['Spending Score (1-100)']),
                "cluster_id": int(row['Cluster']),
                "customer_type": meta["customer_type"]
            })

        # Calculate statistics per cluster
        stats = df.groupby('Cluster').agg({
            'CustomerID': 'count',
            'Age': 'mean',
            'Annual Income (k$)': 'mean',
            'Spending Score (1-100)': 'mean'
        }).reset_index()

        cluster_stats = []
        for idx, row in stats.iterrows():
            cluster_id = int(row['Cluster'])
            meta = predictor_service.get_cluster_metadata(cluster_id)
            cluster_stats.append({
                "cluster_id": cluster_id,
                "count": int(row['CustomerID']),
                "mean_age": round(float(row['Age']), 1),
                "mean_income": round(float(row['Annual Income (k$)']), 1),
                "mean_spending": round(float(row['Spending Score (1-100)']), 1),
                "customer_type": meta["customer_type"],
                "recommendation": meta["recommendation"]
            })

        return jsonify({
            "centroids": centroids_list,
            "scatter_data": scatter_data,
            "cluster_statistics": cluster_stats
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
