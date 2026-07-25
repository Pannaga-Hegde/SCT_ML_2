import React, { useState } from 'react';
import { Play } from 'lucide-react';

export default function InputPanel({ onPredict, isLoading }) {
  const [income, setIncome] = useState(50);
  const [spending, setSpending] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict({ annual_income: income, spending_score: spending });
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple">
      <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-6">Inference parameters</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Annual Income Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-500">Annual Income</label>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{income} k$</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="140" 
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>$10k</span>
            <span>$75k</span>
            <span>$140k</span>
          </div>
        </div>

        {/* Spending Score Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-500">Spending Score</label>
            <span className="text-sm font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">{spending}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={spending}
            onChange={(e) => setSpending(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>1 (Low)</span>
            <span>50 (Avg)</span>
            <span>100 (High)</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-md shadow-slate-200 transition-all duration-300 hover:bg-slate-800 active:scale-[0.98] disabled:bg-slate-400"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing customer...
            </span>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              Segment Customer
            </>
          )}
        </button>
      </form>
    </div>
  );
}
