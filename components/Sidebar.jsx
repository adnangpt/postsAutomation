'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Twitter, MessageSquare, HelpCircle, Settings, Activity } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'X (Twitter)', href: '/automation/x', icon: Twitter },
  { name: 'Reddit', href: '/automation/reddit', icon: MessageSquare },
  { name: 'Quora', href: '/automation/quora', icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <Activity className="h-8 w-8 text-blue-500" />
        <h1 className="ml-2 text-xl font-bold">AutoMarketer</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-800 p-4">
        <div className="text-xs text-gray-400">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2024 AutoMarketer</p>
        </div>
      </div>
    </div>
  );
}
