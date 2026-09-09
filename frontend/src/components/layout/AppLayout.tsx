import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, BookOpen, PlusCircle, ChefHat, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Recipes', href: '/recipes', icon: BookOpen },
  { label: 'Add Recipe', href: '/add-recipe', icon: PlusCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/' || router.pathname === '/home';
    return router.pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-stone-50 text-stone-800">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed z-40 lg:static lg:z-auto
        w-60 h-screen flex flex-col bg-white border-r border-stone-200
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-6 py-5 flex items-center gap-2 border-b border-stone-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="font-serif text-xl font-semibold">Saffronix</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-emerald-50 text-emerald-800 font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-stone-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
            S
          </div>
          <div className="text-sm">
            <p className="font-medium leading-tight">Home Cook</p>
            <p className="text-xs text-stone-400">Recipe lover</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur px-4 md:px-8 py-4 flex items-center justify-between border-b border-stone-200">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-stone-100 mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link
            href="/add-recipe"
            className="flex items-center gap-2 bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Recipe</span>
          </Link>
        </div>

        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>

        <footer className="px-4 md:px-8 py-4 border-t border-stone-200 text-sm text-stone-400 flex justify-between">
          <span>© 2024 Saffronix</span>
          <span>Made with fresh ingredients &amp; ♥</span>
        </footer>
      </main>
    </div>
  );
}