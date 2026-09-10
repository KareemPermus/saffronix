import React from 'react';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function GradientHeader({ title, subtitle, children }: GradientHeaderProps) {
  return (
    <div
      className="rounded-2xl p-6 text-white"
      style={{ background: 'var(--gradient-header-primary)' }}
    >
      <h1 className="font-serif text-2xl font-semibold">{title}</h1>
      {subtitle && <p className="text-emerald-100/80 text-sm mt-1">{subtitle}</p>}
      {children}
    </div>
  );
}