import React from 'react';

export default function ChartCard({ title, description, children, action }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-apple transition-all duration-300 hover:shadow-apple-hover">
      <div className="flex items-start justify-between pb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="relative w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
