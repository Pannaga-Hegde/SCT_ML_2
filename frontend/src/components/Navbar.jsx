import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, HelpCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <LayoutDashboard size={18} />
          </div>
          <span>Customer<span className="text-indigo-600 font-bold">Insight</span></span>
        </NavLink>
        
        <nav className="flex items-center gap-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-950'
              }`
            }
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/segmentation" 
            className={({ isActive }) => 
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-950'
              }`
            }
          >
            <Users size={16} />
            Segmentation
          </NavLink>
          
          <NavLink 
            to="/analytics" 
            className={({ isActive }) => 
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-950'
              }`
            }
          >
            <BarChart3 size={16} />
            Analytics
          </NavLink>
          
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-950'
              }`
            }
          >
            <HelpCircle size={16} />
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
