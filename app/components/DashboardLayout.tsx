// components/DashboardLayout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { name: 'Profile', path: '/dashboard/profile' },
  { name: 'Usage', path: '/dashboard/usage' },
  { name: 'Saved Words', path: '/dashboard/saved-words' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Sidebar */}
      <aside className='w-64 bg-white dark:bg-gray-800 p-4 shadow-md'>
        <div className='mb-8'>
          <Image
            src='/logo.png' // Replace with your logo
            alt='Logo'
            width={40}
            height={40}
            className='rounded-full'
          />
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className='mb-2'>
                <Link
                  href={item.path}
                  className={`block p-2 rounded ${
                    pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className='flex-1 p-8'>{children}</main>
    </div>
  );
}
