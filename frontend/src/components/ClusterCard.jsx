import React from 'react';
import { Sparkles, TrendingUp, DollarSign, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClusterCard({ clusterData }) {
  if (!clusterData) return null;

  const { cluster_id, customer_type, segment, recommendation } = clusterData;

  // Let's assign background styles/colors based on the customer type
  const getStyle = (type) => {
    switch (type) {
      case 'Premium Customers':
        return {
          bg: 'bg-indigo-50 border-indigo-100',
          text: 'text-indigo-700',
          badge: 'bg-indigo-600 text-white',
          icon: <Sparkles size={20} className="text-indigo-600" />
        };
      case 'Cautious Customers':
        return {
          bg: 'bg-amber-50 border-amber-100',
          text: 'text-amber-700',
          badge: 'bg-amber-500 text-white',
          icon: <TrendingUp size={20} className="text-amber-600" />
        };
      case 'Spender Customers':
        return {
          bg: 'bg-rose-50 border-rose-100',
          text: 'text-rose-700',
          badge: 'bg-rose-500 text-white',
          icon: <DollarSign size={20} className="text-rose-600" />
        };
      case 'Budget Customers':
        return {
          bg: 'bg-sky-50 border-sky-100',
          text: 'text-sky-700',
          badge: 'bg-sky-500 text-white',
          icon: <Target size={20} className="text-sky-600" />
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-100',
          text: 'text-slate-700',
          badge: 'bg-slate-500 text-white',
          icon: <Target size={20} className="text-slate-600" />
        };
    }
  };

  const style = getStyle(customer_type);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border p-6 shadow-apple ${style.bg}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
            {style.icon}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Predicted Segment</span>
            <h4 className="text-xl font-bold text-slate-900">{customer_type}</h4>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}>
          Cluster {cluster_id}
        </span>
      </div>

      <div className="mt-6 border-t border-slate-100/50 pt-4">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Persona Profile</h5>
        <p className="mt-1 text-sm font-medium text-slate-700">{segment}</p>
      </div>

      <div className="mt-4 border-t border-slate-100/50 pt-4">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Marketing Strategy & Recommendations</h5>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{recommendation}</p>
      </div>
    </motion.div>
  );
}
