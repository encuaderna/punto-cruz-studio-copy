import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, FolderOpen, HelpCircle, Settings, Scissors } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/nuevo', label: 'Nuevo', icon: PlusCircle },
  { path: '/biblioteca', label: 'Biblioteca', icon: FolderOpen },
  { path: '/ayuda', label: 'Ayuda', icon: HelpCircle },
  { path: '/ajustes', label: 'Ajustes', icon: Settings },
];

export default function AppLayout() {
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card min-h-screen fixed left-0 top-0 z-30">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold leading-tight">Punto Cruz</h1>
              <p className="text-xs text-muted-foreground font-medium">Studio</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">Punto Cruz Studio v1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Scissors className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-base font-bold">Punto Cruz Studio</h1>
        </header>
        
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border pb-safe">
        <div className="flex items-center justify-around px-1 py-1">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path);
            const isPrimary = ['/', '/biblioteca', '/nuevo'].includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 py-2 px-2 min-w-[56px] transition-all relative"
              >
                {/* Pill indicator on active primary items */}
                {active && isPrimary && (
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary" />
                )}
                <div className={`flex items-center justify-center rounded-xl transition-all ${
                  active ? 'text-primary' : 'text-muted-foreground'
                } ${isPrimary ? 'mt-1' : 'mt-1'}`}>
                  <item.icon className={`transition-all ${
                    isPrimary ? 'w-6 h-6' : 'w-5 h-5'
                  } ${active ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}