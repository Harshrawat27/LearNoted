import { useTheme } from './ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className='flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md'>
      <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
        AI Extension
      </h1>
      <button
        onClick={toggleTheme}
        className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
};

export default Header;
