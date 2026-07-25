import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import { Users, Layers, Cpu, ShieldAlert } from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Cell
} from 'recharts';

const API_BASE = 'http://127.0.0.1:5001';

export default function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = axios.get(`${API_BASE}/metrics`);
    const fetchAnalytics = axios.get(`${API_BASE}/analytics`);

    Promise.all([fetchMetrics, fetchAnalytics])
      .then(([metricsRes, analyticsRes]) => {
        setMetrics(metricsRes.data);
        setAnalytics(analyticsRes.data);
      })
      .catch(err => {
        console.error("Error loading analytics metrics:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Setup color constants
  const colors = ['#6366F1', '#0EA5E9', '#10B981', '#EF4444', '#F59E0B'];

  // Parse details
  const scatterPoints = analytics?.scatter_data || [];
  const centroids = analytics?.centroids || [];
  const stats = analytics?.cluster_statistics || [];
  const elbowData = metrics?.elbow_data || [];

  const clusters = Array.from(new Set(scatterPoints.map(p => p.cluster_id))).sort();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500">
          Real-time metrics, optimization parameters, and mathematical profiles of customer clusters.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Customer Dataset" 
          value={metrics?.num_customers || 200} 
          icon={<Users size={20} />} 
          description="shoppers mapped" 
        />
        <MetricCard 
          title="Optimal Clusters" 
          value={metrics?.num_clusters || 5} 
          icon={<Layers size={20} />} 
          description="personas identified" 
        />
        <MetricCard 
          title="Inertia (WCSS)" 
          value={metrics?.inertia || "65.57"} 
          icon={<Cpu size={20} />} 
          description="clustering variance" 
        />
        <MetricCard 
          title="Silhouette Score" 
          value={metrics?.silhouette_score || "0.5547"} 
          icon={<ShieldAlert size={20} />} 
          description="mathematical validation" 
        />
      </div>

      {/* Chart Layout Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Customer Clusters Scatter Plot */}
        <div className="lg:col-span-8">
          <ChartCard 
            title="Customer Clusters & Centroids" 
            description="2D representation of Annual Income vs Spending Score showing the five segmented groups."
          >
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis 
                    type="number" 
                    dataKey="annual_income" 
                    name="Annual Income" 
                    unit="k$" 
                    domain={[10, 140]}
                    stroke="#94A3B8"
                    fontSize={11}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="spending_score" 
                    name="Spending Score" 
                    domain={[0, 100]}
                    stroke="#94A3B8"
                    fontSize={11}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
                            <p className="text-xs font-bold text-slate-800">{data.customer_type || 'Centroid'}</p>
                            <p className="text-[10px] text-slate-500 font-medium mt-1">Income: ${data.annual_income}k</p>
                            <p className="text-[10px] text-slate-500 font-medium">Spending Score: {data.spending_score}</p>
                            {data.id && <p className="text-[10px] text-slate-400">Customer ID: #{data.id}</p>}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  
                  {/* Render Cluster Scatter points */}
                  {clusters.map((cId) => (
                    <Scatter
                      key={cId}
                      name={stats.find(s => s.cluster_id === cId)?.customer_type || `Cluster ${cId}`}
                      data={scatterPoints.filter(p => p.cluster_id === cId)}
                      fill={colors[cId % colors.length]}
                      shape="circle"
                      opacity={0.7}
                    />
                  ))}

                  {/* Render Centroids */}
                  <Scatter 
                    name="Centroid Markers" 
                    data={centroids} 
                    fill="#0F172A" 
                    shape="star"
                    line={false}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Elbow Curve */}
        <div className="lg:col-span-4">
          <ChartCard 
            title="Elbow Validation Curve" 
            description="WCSS plotted against K values. The optimal elbow bend occurs at K=5."
          >
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={elbowData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="k" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="wcss" 
                    name="WCSS" 
                    stroke="#6366F1" 
                    strokeWidth={2.5}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Cluster Details Table & Distribution */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Customer Distribution Bar Chart */}
        <div className="lg:col-span-5">
          <ChartCard 
            title="Segment Density Distribution" 
            description="Volume distribution of shoppers across identified K-Means cluster groups."
          >
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="customer_type" stroke="#94A3B8" fontSize={9} interval={0} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]}>
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[entry.cluster_id % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Statistical Summary Grid */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple h-full">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">Cluster Statistical Profiles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Segment Type</th>
                    <th className="px-4 py-3">Vol</th>
                    <th className="px-4 py-3">Avg Age</th>
                    <th className="px-4 py-3">Avg Income</th>
                    <th className="px-4 py-3 rounded-r-lg">Avg Spending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.map((s, idx) => (
                    <tr key={s.cluster_id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3.5 font-semibold text-slate-900 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[s.cluster_id % colors.length] }} />
                        {s.customer_type}
                      </td>
                      <td className="px-4 py-3.5 font-medium">{s.count}</td>
                      <td className="px-4 py-3.5">{s.mean_age} yrs</td>
                      <td className="px-4 py-3.5">${s.mean_income}k</td>
                      <td className="px-4 py-3.5">{s.mean_spending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
