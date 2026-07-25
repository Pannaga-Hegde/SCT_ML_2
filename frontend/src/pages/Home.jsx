import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BarChart3, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-24">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700"
        >
          <Sparkles size={12} />
          Customer Segmentation Engine
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 leading-tight"
        >
          Understand Your Customers. <br />
          <span className="text-indigo-600 bg-clip-text">Predict Market Intent.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed"
        >
          Leverage high-precision K-Means clustering algorithm to identify target customer cohorts, customize product marketing, and increase retail spend scores.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Link 
            to="/segmentation" 
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]"
          >
            Predict Segments
            <ArrowRight size={16} />
          </Link>
          <Link 
            to="/analytics" 
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            Explore Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="mt-24 md:mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Feature 1 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple transition-all duration-300 hover:shadow-apple-hover">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Users size={22} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">High-Precision Segments</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Automatically categories shoppers into Premium, Cautious, Spender, Budget, and Standard customer profiles based on annual incomes.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple transition-all duration-300 hover:shadow-apple-hover">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <BarChart3 size={22} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Interactive Analytics</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Explore customer densities, distributions, optimal clustering validation graphs, centroids, and descriptive metrics.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple transition-all duration-300 hover:shadow-apple-hover">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={22} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">SaaS Quality Insights</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Generate strategic marketing recommendations customized for each customer segment to yield highest conversion rates.
          </p>
        </div>
        
      </div>
      
    </div>
  );
}
