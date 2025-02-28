'use client';

import { useTheme } from './ThemeContext';
import { useEffect } from 'react';

const Layout = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

export default Layout;
