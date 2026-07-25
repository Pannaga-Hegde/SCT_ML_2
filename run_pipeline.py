import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import joblib

def main():
    # Set plotting style
    sns.set_theme(style="whitegrid")
    
    # 1. Load Dataset
    df = pd.read_csv('Mall_Customers.csv')
    print("Dataset loaded successfully. Shape:", df.shape)
    
    # 2. Summary Statistics & Data Dictionary Verification
    print("\nDataset Info:")
    df.info()
    print("\nSummary Statistics:")
    print(df.describe())
    print("\nMissing values:")
    print(df.isnull().sum())
    
    # 3. Enhanced EDA & Visualization
    os.makedirs('images', exist_ok=True)
    
    # Distribution plots
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    sns.histplot(df['Age'], kde=True, ax=axes[0], color='#7C3AED')
    axes[0].set_title('Distribution of Age', fontsize=12, fontweight='bold')
    
    sns.histplot(df['Annual Income (k$)'], kde=True, ax=axes[1], color='#06B6D4')
    axes[1].set_title('Distribution of Annual Income', fontsize=12, fontweight='bold')
    
    sns.histplot(df['Spending Score (1-100)'], kde=True, ax=axes[2], color='#22C55E')
    axes[2].set_title('Distribution of Spending Score', fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.savefig('images/distributions.png', dpi=300)
    plt.close()
    
    # Boxplots for outlier detection
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    sns.boxplot(y=df['Age'], ax=axes[0], color='#7C3AED')
    axes[0].set_title('Boxplot of Age (Outlier Detection)', fontsize=12, fontweight='bold')
    
    sns.boxplot(y=df['Annual Income (k$)'], ax=axes[1], color='#06B6D4')
    axes[1].set_title('Boxplot of Annual Income (Outlier Detection)', fontsize=12, fontweight='bold')
    
    sns.boxplot(y=df['Spending Score (1-100)'], ax=axes[2], color='#22C55E')
    axes[2].set_title('Boxplot of Spending Score (Outlier Detection)', fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.savefig('images/boxplots.png', dpi=300)
    plt.close()
    
    # Count plot for Gender
    plt.figure(figsize=(6, 4))
    sns.countplot(x='Gender', data=df, palette=['#06B6D4', '#7C3AED'])
    plt.title('Gender Distribution', fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.savefig('images/gender_distribution.png', dpi=300)
    plt.close()
    
    # Pairplot
    pairplot_fig = sns.pairplot(df.drop('CustomerID', axis=1), hue='Gender', palette=['#7C3AED', '#06B6D4'])
    pairplot_fig.fig.suptitle('Pairplot of Dataset Colored by Gender', y=1.02, fontweight='bold')
    pairplot_fig.savefig('images/pairplot.png', dpi=300)
    plt.close()
    
    # Correlation Heatmap (numerical columns only)
    plt.figure(figsize=(8, 6))
    numerical_cols = ['Age', 'Annual Income (k$)', 'Spending Score (1-100)']
    corr = df[numerical_cols].corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.2f', linewidths=0.5)
    plt.title('Correlation Heatmap', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig('images/correlation_heatmap.png', dpi=300)
    plt.close()
    
    # 4. Feature Selection
    features = ['Annual Income (k$)', 'Spending Score (1-100)']
    X = df[features]
    
    # 5. Feature Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 6. Elbow Method & Silhouette Scores
    wcss = []
    silhouette_scores = []
    k_range = range(1, 11)
    
    for k in k_range:
        kmeans = KMeans(n_clusters=k, init='k-means++', random_state=42, n_init=10)
        kmeans.fit(X_scaled)
        wcss.append(kmeans.inertia_)
        if k > 1:
            score = silhouette_score(X_scaled, kmeans.labels_)
            silhouette_scores.append(score)
            print(f"K = {k}: Silhouette Score = {score:.4f}, WCSS (Inertia) = {kmeans.inertia_:.2f}")
            
    # Save elbow method plot
    plt.figure(figsize=(10, 5))
    plt.plot(list(k_range), wcss, marker='o', linestyle='--', color='#7C3AED')
    plt.title('Elbow Method to Find Optimal K', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Number of Clusters (K)', fontsize=12)
    plt.ylabel('WCSS (Inertia)', fontsize=12)
    plt.grid(True, linestyle=':', alpha=0.6)
    plt.tight_layout()
    plt.savefig('images/elbow_plot.png', dpi=300)
    plt.close()
    
    # Save Silhouette score plot
    plt.figure(figsize=(10, 5))
    plt.plot(list(range(2, 11)), silhouette_scores, marker='s', linestyle='-', color='#06B6D4')
    plt.title('Silhouette Score for Various K', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Number of Clusters (K)', fontsize=12)
    plt.ylabel('Silhouette Score', fontsize=12)
    plt.grid(True, linestyle=':', alpha=0.6)
    plt.tight_layout()
    plt.savefig('images/silhouette_plot.png', dpi=300)
    plt.close()
    
    # Based on the elbow plot and highest silhouette score, K=5 is verified as the optimal number of clusters
    optimal_k = 5
    print(f"\nTraining K-Means with optimal K = {optimal_k}")
    
    # 7. Model Training & Cluster Assignment
    kmeans_model = KMeans(n_clusters=optimal_k, init='k-means++', random_state=42, n_init=10)
    cluster_labels = kmeans_model.fit_predict(X_scaled)
    
    # Add cluster labels to dataframe
    df['Cluster'] = cluster_labels
    
    # Calculate Cluster Statistics
    cluster_stats = df.groupby('Cluster')[['Age', 'Annual Income (k$)', 'Spending Score (1-100)']].mean()
    print("\nCluster Statistics (Means):")
    print(cluster_stats)
    
    # Business mapping for clusters
    cluster_means = df.groupby('Cluster')[features].mean()
    cluster_mapping = {}
    for cluster_id in range(optimal_k):
        inc = cluster_means.loc[cluster_id, 'Annual Income (k$)']
        spend = cluster_means.loc[cluster_id, 'Spending Score (1-100)']
        
        if inc > 70 and spend > 70:
            name = "Premium Customers"
            segment = "High Income, High Spending"
            rec = "Target with luxury promotions, exclusive loyalty rewards, and early access to new premium product lines."
        elif inc > 70 and spend < 40:
            name = "Cautious Customers"
            segment = "High Income, Low Spending"
            rec = "Offer high-quality value propositions, financial/investment-style rewards, and structured discount memberships."
        elif inc < 45 and spend > 60:
            name = "Spender Customers"
            segment = "Low Income, High Spending"
            rec = "Target with impulse-buy campaigns, flash sales, trendy fast-fashion marketing, and flexible payment options."
        elif inc < 45 and spend < 40:
            name = "Budget Customers"
            segment = "Low Income, Low Spending"
            rec = "Provide extreme-value discounts, bundle packages, budget-friendly loyalty programs, and essential items marketing."
        else:
            name = "Standard Customers"
            segment = "Average Income, Average Spending"
            rec = "Maintain engagement with standard promotional newsletters, seasonal coupons, and general marketing updates."
            
        cluster_mapping[cluster_id] = {
            'Cluster Name': name,
            'Segment': segment,
            'Recommendation': rec
        }
        
    df['Cluster Name'] = df['Cluster'].map(lambda c: cluster_mapping[c]['Cluster Name'])
    df['Segment'] = df['Cluster'].map(lambda c: cluster_mapping[c]['Segment'])
    df['Recommendation'] = df['Cluster'].map(lambda c: cluster_mapping[c]['Recommendation'])
    
    # 8. Save Model and Scaler separately
    joblib.dump(kmeans_model, 'kmeans_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    print("Saved kmeans_model.pkl and scaler.pkl successfully!")
    
    # Save clustered customers dataset
    df.to_csv('clustered_customers.csv', index=False)
    print("Saved clustered_customers.csv")
    
    # 9. Plot Clusters and Centroids
    plt.figure(figsize=(10, 8))
    colors = ['#7C3AED', '#06B6D4', '#22C55E', '#EF4444', '#F59E0B']
    
    # Plot data points
    for i in range(optimal_k):
        cluster_df = df[df['Cluster'] == i]
        plt.scatter(
            cluster_df['Annual Income (k$)'], 
            cluster_df['Spending Score (1-100)'],
            s=80, 
            c=colors[i], 
            label=f"{cluster_mapping[i]['Cluster Name']} (Cluster {i})",
            edgecolors='black',
            linewidths=0.5,
            alpha=0.85
        )
        
    # Plot centroids
    centroids_scaled = kmeans_model.cluster_centers_
    centroids = scaler.inverse_transform(centroids_scaled)
    plt.scatter(
        centroids[:, 0], 
        centroids[:, 1], 
        s=300, 
        c='white', 
        marker='*', 
        label='Centroids',
        edgecolors='black',
        linewidths=1.5
    )
    
    plt.title('Customer Segments (K-Means Clustering)', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('Annual Income (k$)', fontsize=12)
    plt.ylabel('Spending Score (1-100)', fontsize=12)
    plt.legend(loc='best', frameon=True, facecolor='white', edgecolor='gray')
    plt.grid(True, linestyle=':', alpha=0.6)
    plt.tight_layout()
    plt.savefig('images/cluster_scatter_plot.png', dpi=300)
    plt.close()
    
    # Customer Count per Cluster plot
    plt.figure(figsize=(8, 5))
    sns.countplot(x='Cluster Name', data=df, palette=colors)
    plt.title('Customer Count per Cluster Segment', fontsize=14, fontweight='bold')
    plt.xlabel('Customer Segment', fontsize=12)
    plt.ylabel('Count', fontsize=12)
    plt.xticks(rotation=15)
    plt.tight_layout()
    plt.savefig('images/cluster_count_plot.png', dpi=300)
    plt.close()
    print("Saved all cluster visualization plots in images/ directory!")

if __name__ == '__main__':
    main()
