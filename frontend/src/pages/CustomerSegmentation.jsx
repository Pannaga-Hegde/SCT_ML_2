import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import InputPanel from '../components/InputPanel';
import ClusterCard from '../components/ClusterCard';
import ChartCard from '../components/ChartCard';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Users, AlertTriangle } from 'lucide-react';

// Setup API URL base
const API_BASE = 'http://127.0.0.1:5001';

export default function CustomerSegmentation() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scatterPoints, setScatterPoints] = useState([]);
  const [currentCoords, setCurrentCoords] = useState({ x: 50, y: 50 });

  // Load scatter plot points on page load to display background points
  useEffect(() => {
    axios.get(`${API_BASE}/analytics`)
      .then(res => {
        setScatterPoints(res.data.scatter_data || []);
      })
      .catch(err => {
        console.error("Error loading analytics data: ", err);
      });
  }, []);

  const handlePredict = (coords) => {
    setIsLoading(true);
    setError(null);
    setCurrentCoords({ x: coords.annual_income, y: coords.spending_score });

    axios.post(`${API_BASE}/cluster`, coords)
      .then(res => {
        setPrediction(res.data);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Unable to reach the predictive model API server.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Group scatter points by cluster for charting
  const clusters = Array.from(new Set(scatterPoints.map(p => p.cluster_id))).sort();
  const colors = ['#6366F1', '#0EA5E9', '#10B981', '#EF4444', '#F59E0B'];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Predictive Customer Segmentation</h1>
        <p className="text-sm text-slate-500">
          Enter customer purchasing data below to predict their segment and review tailor-made marketing recommendations.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Left Side: Sliders */}
        <div className="lg:col-span-4 space-y-6">
          <InputPanel onPredict={handlePredict} isLoading={isLoading} />

          {/* Display prediction result if available */}
          <AnimatePresence mode="wait">
            {prediction && (
              <ClusterCard clusterData={prediction} />
            )}
          </AnimatePresence>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Positioning Scatter Plot */}
        <div className="lg:col-span-8">
          <ChartCard 
            title="Customer Mapping Plane" 
            description="Explore where this customer falls relative to the existing shopper segments."
          >
            <div className="h-[450px] w-full">
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
                            <p className="text-xs font-bold text-slate-800">{data.customer_type || 'Selected Coordinates'}</p>
                            <p className="text-[10px] text-slate-500 font-medium mt-1">Income: ${data.annual_income}k</p>
                            <p className="text-[10px] text-slate-500 font-medium">Spending Score: {data.spending_score}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  
                  {/* Background points */}
                  {clusters.map((cId) => (
                    <Scatter
                      key={cId}
                      name={`Cluster ${cId}`}
                      data={scatterPoints.filter(p => p.cluster_id === cId)}
                      fill={colors[cId % colors.length]}
                      opacity={0.35}
                      shape="circle"
                    />
                  ))}

                  {/* Reference dot for selected coordinates */}
                  <ReferenceDot 
                    x={currentCoords.x} 
                    y={currentCoords.y} 
                    r={8} 
                    fill={prediction ? colors[prediction.cluster_id % colors.length] : "#475569"}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="animate-bounce"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
