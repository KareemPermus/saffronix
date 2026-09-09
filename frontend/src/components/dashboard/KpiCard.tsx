import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor?: string;
}

export default function KpiCard({ label, value, icon, accentColor = '#15803d' }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-semibold font-serif">{value}</p>
      </div>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: accentColor + '15', color: accentColor }}
      >
        {icon}
      </div>
    </div>
  );
}