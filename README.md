# CustomerInsight AI: Customer Segmentation Dashboard

CustomerInsight AI is a professional Business Intelligence (BI) dashboard designed to explore and segment retail customers using an existing trained K-Means clustering model. The interface features a clean, minimal, Apple-inspired light theme built using React, Tailwind CSS v4, and Recharts, connected to a Flask API backend.

---

## Folder Structure
```text
SCT_ML_2/
├── backend/
│   ├── app.py                     # Flask entrypoint
│   ├── config.py                  # API Config settings
│   ├── requirements.txt           # Python dependencies
│   ├── dataset/
│   │   └── Mall_Customers.csv     # Input dataset
│   ├── model/
│   │   ├── kmeans_model.pkl       # Trained K-Means clustering model
│   │   └── scaler.pkl             # StandardScaler model
│   ├── routes/
│   │   ├── analytics.py           # Metrics and analytics endpoints
│   │   └── cluster.py             # Inference/prediction endpoint
│   └── services/
│       └── predictor.py           # Model predictor singleton service
├── frontend/
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── src/
│   │   ├── App.jsx                # Router & main application shell
│   │   ├── index.css              # Custom Tailwind v4 stylesheet
│   │   ├── main.jsx               # React entry point
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── ClusterCard.jsx
│   │   │   ├── InputPanel.jsx
│   │   │   └── Loader.jsx
│   │   └── pages/                 # Routing pages
│   │       ├── Home.jsx           # App presentation landing page
│   │       ├── CustomerSegmentation.jsx # Form with prediction
│   │       ├── Analytics.jsx      # Metrics charts dashboard
│   │       └── About.jsx          # Documentation
├── README.md                      # Documentation
└── requirements.txt               # Main python packages
```

---

## Technology Stack

### Backend
- **Flask**: Microframework for routing REST endpoints.
- **Flask-CORS**: Facilitates resource request routing.
- **Scikit-Learn**: Supports standard scalar scaling and K-Means predictions.
- **Joblib**: Deserializes stored model binary configurations.

### Frontend
- **React (Vite)**: Rapid single-page component compiling.
- **Tailwind CSS v4**: Minimalist, Apple-inspired styling using custom themes.
- **Recharts**: Interactive dashboard elements (Elbow curve, Scatter plots, Distribution charts).
- **Framer Motion**: Smooth entry animations.
- **Lucide React**: Line icons.

---

## API Documentation

### Health Check
- **Endpoint**: `GET /`
- **Output**:
  ```json
  {
    "status": "healthy",
    "message": "CustomerInsight API is running",
    "version": "1.0.0"
  }
  ```

### Get Dashboard Metrics
- **Endpoint**: `GET /metrics`
- **Output**:
  ```json
  {
    "num_customers": 200,
    "num_clusters": 5,
    "inertia": 65.57,
    "silhouette_score": 0.5547,
    "elbow_data": [
      { "k": 1, "wcss": 400.0 },
      ...
    ]
  }
  ```

### Get Group Analytics
- **Endpoint**: `GET /analytics`
- **Output**:
  ```json
  {
    "centroids": [
      { "cluster_id": 0, "annual_income": 55.3, "spending_score": 49.5, "customer_type": "Standard Customers", "segment": "Average Income, Average Spending" }
    ],
    "scatter_data": [
      { "id": 1, "gender": "Male", "age": 19, "annual_income": 15, "spending_score": 39, "cluster_id": 4, "customer_type": "Budget Customers" }
    ],
    "cluster_statistics": [
      { "cluster_id": 0, "count": 81, "mean_age": 42.7, "mean_income": 55.3, "mean_spending": 49.5, "customer_type": "Standard Customers", "recommendation": "..." }
    ]
  }
  ```

### Predict Customer Cluster
- **Endpoint**: `POST /cluster`
- **Input Parameters (JSON)**:
  ```json
  {
    "annual_income": 85,
    "spending_score": 90
  }
  ```
- **Output**:
  ```json
  {
    "cluster_id": 1,
    "customer_type": "Premium Customers",
    "segment": "High Income, High Spending",
    "recommendation": "Target with luxury promotions, exclusive loyalty rewards, and early access to new premium product lines.",
    "centroid": {
      "annual_income": 86.53,
      "spending_score": 82.12
    }
  }
  ```

---

## Installation & Local Development

### 1. Launch the Backend Server
```bash
# Navigate to project directory
cd SCT_ML_2

# Install backend dependencies
pip install -r backend/requirements.txt

# Start backend server
python -m backend.app
```
Server runs on: [http://127.0.0.1:5000](http://127.0.0.1:5000)

### 2. Launch the Frontend Development Environment
In a separate terminal:
```bash
# Navigate to frontend directory
cd SCT_ML_2/frontend

# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```
Development build page runs on: [http://localhost:5173](http://localhost:5173)

---

## Deployment Recommendations
- **Frontend**: Connect the `frontend/` folder directly to **Vercel** with build setting `npm run build` and output folder `dist`.
- **Backend**: Connect the `backend/` folder to **Render** as a Web Service. Set environment variables if custom host/port binds are needed.
