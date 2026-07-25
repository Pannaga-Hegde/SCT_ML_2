import React from 'react';

export default function MetricCard({ title, value, icon, description, trend }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple transition-all duration-300 hover:shadow-apple-hover">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        {(description || trend) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            {trend && (
              <span className={`font-semibold ${trend.type === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend.value}
              </span>
            )}
            <span>{description}</span>
          </div>
        )}
      </div>
    </div>
  );
}
