import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} CustomerInsight AI. Apple-Inspired Business Intelligence Dashboard.</p>
        <p className="mt-1">Developed for SkillCraft Technology ML Internship Task 2.</p>
      </div>
    </footer>
  );
}
