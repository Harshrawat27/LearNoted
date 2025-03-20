'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../components/ThemeContext';
import { usePathname } from 'next/navigation';
import {
  UserCircle,
  // BarChart3,
  BookOpen,
  Menu,
  X,
  LogOut,
  Highlighter,
  Moon,
  Sun,
  Youtube,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initialize on load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    {
      label: 'Profile',
      href: '/dashboard',
      icon: <UserCircle className='w-5 h-5' />,
    },
    // {
    //   label: 'Usage Statistics',
    //   href: '/dashboard/usage',
    //   icon: <BarChart3 className='w-5 h-5' />,
    // },
    {
      label: 'Saved Words',
      href: '/dashboard/words',
      icon: <BookOpen className='w-5 h-5' />,
    },
    {
      label: 'Highlighted Text',
      href: '/dashboard/highlights',
      icon: <Highlighter className='w-5 h-5' />,
    },
    {
      label: 'Youtube Highlight',
      href: '/dashboard/youtube-highlights',
      icon: <Youtube className='w-5 h-5' />,
    },
  ];

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100'>
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md'
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static z-30 transition-transform duration-300 w-64 h-full bg-white dark:bg-gray-800 shadow-md`}
      >
        <div className='flex flex-col h-full'>
          <Link href='/'>
            {/* Logo and Title */}
            <div className='flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700'>
              <Image
                src={
                  theme === 'light'
                    ? '/LearNoted-logo-white-512.svg'
                    : '/learnoted-logo-white.svg'
                }
                alt='Logo'
                width={40}
                height={40}
                className='rounded-full'
              />
              <h1 className='text-xl font-bold'>LearNoted</h1>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className='flex-1 p-4 space-y-2'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  pathname === item.href
                    ? 'bg-gray-100 dark:bg-gray-700 font-medium'
                    : ''
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
            <Link
              href='/api/auth/signout'
              className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            >
              <LogOut className='w-5 h-5' />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6 md:p-8 relative'>
        <button
          onClick={toggleTheme}
          className='w-25 h-25 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors absolute top-5 right-5'
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        {children}
      </main>{' '}
    </div>
  );
}
