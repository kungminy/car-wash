'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, FlaskConical, ShoppingBag, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/', label: '오늘의 세차', icon: Sparkles },
  { href: '/supplies', label: '내 용품함', icon: FlaskConical },
  { href: '/recommend', label: '용품 추천', icon: ShoppingBag },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-sky-500 rounded-xl p-1.5">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">CarWash Planner</span>
          </Link>
        </div>
      </header>

      {children}

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto grid grid-cols-3 h-16">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors',
                  isActive ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600',
                ].join(' ')}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
