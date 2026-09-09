import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function SupportFab() {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-800 flex items-center justify-center transition-colors"
      title="Help & Support"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  );
}