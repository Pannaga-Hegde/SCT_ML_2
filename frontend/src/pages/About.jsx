import React from 'react';
import { Settings, CheckCircle2, Server, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-12">
      
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">About CustomerInsight</h1>
        <p className="text-sm text-slate-500">
          Learn about the algorithms, datasets, workflows, and technologies supporting this application.
        </p>
      </div>

      {/* Grid of details */}
      <div className="space-y-8">
        
        {/* Section 1: Mall Customers Dataset */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="text-indigo-600" size={20} />
            Mall Customers Dataset
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            The dataset consists of shopper profiles containing demographic characteristics (Age, Gender) and behavioral traits (Annual Income, Spending Score). We leverage the behavioral dimensions (Income and Spending) to extract clean, unlabelled segments to better tailor business marketing campaigns.
          </p>
        </div>

        {/* Section 2: K-Means Clustering Algorithm */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="text-sky-500" size={20} />
            K-Means Clustering & Scaling
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            K-Means is a distance-based clustering model. Because features have varying bounds (e.g. Annual Income up to $137k, Spending Score up to 100), we utilize a <strong>StandardScaler</strong> to normalize metrics. Without normalization, features with higher values would disproportionately affect distance metrics. We validate the optimal K=5 using both the <strong>Elbow Method</strong> (minimizing within-cluster inertia) and the <strong>Silhouette Score</strong> (maximizing inter-cluster distance).
          </p>
        </div>

        {/* Section 3: Tech Stack */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2 mb-4">
            <Server className="text-emerald-500" size={20} />
            Technology Stack
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Globe size={16} className="text-indigo-600" />
                Frontend (UI/UX)
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-500 list-disc list-inside">
                <li>React with Vite bundling</li>
                <li>Tailwind CSS layout design</li>
                <li>Recharts responsive dashboards</li>
                <li>Framer Motion route transitions</li>
                <li>Lucide icons library</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Server size={16} className="text-emerald-500" />
                Backend (Server/API)
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-500 list-disc list-inside">
                <li>Flask server microframework</li>
                <li>Flask-CORS header permissions</li>
                <li>Scikit-Learn K-Means model</li>
                <li>Joblib object serialization</li>
                <li>Pandas dataset loading</li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
