import joblib
import numpy as np
import pandas as pd
from backend.config import Config

class PredictorService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.cluster_mapping = {}
        self.load_model()

    def load_model(self):
        try:
            self.model = joblib.load(Config.MODEL_PATH)
            self.scaler = joblib.load(Config.SCALER_PATH)
            print("Successfully loaded K-Means model and scaler.")
            
            # Recreate mapping based on typical centroids or values
            # (Note: we can also compute the cluster centroids properties dynamically to map them)
            # Standard mapped segments for Mall Customers:
            self.cluster_mapping = {
                "High Income, High Spending": {
                    "name": "Premium Customers",
                    "recommendation": "Target with luxury promotions, exclusive loyalty rewards, and early access to new premium product lines."
                },
                "High Income, Low Spending": {
                    "name": "Cautious Customers",
                    "recommendation": "Offer high-quality value propositions, financial/investment-style rewards, and structured discount memberships."
                },
                "Low Income, High Spending": {
                    "name": "Spender Customers",
                    "recommendation": "Target with impulse-buy campaigns, flash sales, trendy fast-fashion marketing, and flexible payment options."
                },
                "Low Income, Low Spending": {
                    "name": "Budget Customers",
                    "recommendation": "Provide extreme-value discounts, bundle packages, budget-friendly loyalty programs, and essential items marketing."
                },
                "Average Income, Average Spending": {
                    "name": "Standard Customers",
                    "recommendation": "Maintain engagement with standard promotional newsletters, seasonal coupons, and general marketing updates."
                }
            }
        except Exception as e:
            print(f"Error loading model or scaler: {e}")

    def get_cluster_metadata(self, cluster_id):
        # We can dynamically identify the persona using the centroid's income and spending score
        try:
            centroids_scaled = self.model.cluster_centers_
            centroids = self.scaler.inverse_transform(centroids_scaled)
            centroid = centroids[cluster_id]
            inc, spend = centroid[0], centroid[1]

            if inc > 70 and spend > 70:
                key = "High Income, High Spending"
            elif inc > 70 and spend < 40:
                key = "High Income, Low Spending"
            elif inc < 45 and spend > 60:
                key = "Low Income, High Spending"
            elif inc < 45 and spend < 40:
                key = "Low Income, Low Spending"
            else:
                key = "Average Income, Average Spending"

            meta = self.cluster_mapping.get(key, {
                "name": "Standard Customers",
                "recommendation": "Maintain engagement with standard promotional newsletters and seasonal coupons."
            })
            return {
                "cluster_id": int(cluster_id),
                "customer_type": meta["name"],
                "segment": key,
                "recommendation": meta["recommendation"],
                "centroid": {
                    "annual_income": float(inc),
                    "spending_score": float(spend)
                }
            }
        except Exception as e:
            print(f"Error resolving cluster metadata: {e}")
            return {
                "cluster_id": int(cluster_id),
                "customer_type": "Unknown Segment",
                "segment": "Unknown",
                "recommendation": "Perform standard customer relationship outreach."
            }

    def predict(self, annual_income, spending_score):
        if self.model is None or self.scaler is None:
            raise RuntimeError("Model or scaler is not loaded.")
        
        # Prepare input
        input_data = np.array([[annual_income, spending_score]])
        scaled_data = self.scaler.transform(input_data)
        
        # Predict cluster
        cluster_id = int(self.model.predict(scaled_data)[0])
        
        # Get mapping metadata
        metadata = self.get_cluster_metadata(cluster_id)
        return metadata

# Instantiate singleton service
predictor_service = PredictorService()
