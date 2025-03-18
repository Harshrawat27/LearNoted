'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  ExternalLink,
  ChevronRight,
  X,
  HighlighterIcon,
  Globe,
} from 'lucide-react';

import { ClientHighlightItem } from '../../utils/highlightAdapter';

// Just alias the type to maintain compatibility with the existing component
type HighlightItem = ClientHighlightItem;

interface HighlightsPageClientProps {
  initialHighlights: HighlightItem[];
  totalCount: number;
}

export default function HighlightsPageClient({
  initialHighlights,
  totalCount,
}: HighlightsPageClientProps) {
  const [highlights, setHighlights] =
    useState<HighlightItem[]>(initialHighlights);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'domain' | 'text'>(
    'all'
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(totalCount > initialHighlights.length);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHighlight, setSelectedHighlight] =
    useState<HighlightItem | null>(null);

  const loaderRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

  // Extract domain from URL
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  // Fetch highlights from the API
  const fetchHighlights = useCallback(
    async (
      currentPage: number,
      currentSearch: string,
      searchType: string,
      append: boolean = false
    ) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/highlights?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(
            currentSearch
          )}&searchType=${searchType}`
        );
        if (!response.ok) throw new Error('Failed to fetch highlights');
        const data = await response.json();
        const newHighlights = data.highlights;
        const hasMoreFromAPI = data.hasMore;

        setHighlights((prev) =>
          append ? [...prev, ...newHighlights] : newHighlights
        );
        setHasMore(hasMoreFromAPI);
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Reset and fetch when search term changes
  useEffect(() => {
    setPage(1);
    fetchHighlights(1, searchTerm, searchFilter);
  }, [searchTerm, searchFilter, fetchHighlights]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchHighlights(nextPage, searchTerm, searchFilter, true);
        }
      },
      { threshold: 1.0 }
    );

    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, isLoading, page, searchTerm, searchFilter, fetchHighlights]);

  // Format URL for display
  const formatUrl = (url: string) => {
    return getDomain(url);
  };

  // Color mapping for styling
  const colorMap: { [key: string]: { bg: string; text: string } } = {
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-800 dark:text-yellow-300',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-800 dark:text-green-300',
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-800 dark:text-blue-300',
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900/20',
      text: 'text-pink-800 dark:text-pink-300',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-800 dark:text-purple-300',
    },
  };

  // Get color classes or default to gray
  const getColorClasses = (color: string) => {
    return (
      colorMap[color] || {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-300',
      }
    );
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold mb-8'>Your Highlights</h1>

      {/* Search Bar with Filters */}
      <div className='mb-6 space-y-3'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search your highlights...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
            >
              <X className='h-5 w-5 text-gray-400 hover:text-gray-500' />
            </button>
          )}
        </div>

        {/* Search Filter Options */}
        <div className='flex space-x-2'>
          <button
            onClick={() => setSearchFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${
              searchFilter === 'all'
                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSearchFilter('domain')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center ${
              searchFilter === 'domain'
                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Globe className='h-4 w-4 mr-1' />
            Domain
          </button>
          <button
            onClick={() => setSearchFilter('text')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center ${
              searchFilter === 'text'
                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <HighlighterIcon className='h-4 w-4 mr-1' />
            Content
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Highlights List */}
        <div className='lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-semibold'>Your Saved Highlights</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {searchTerm
                ? `${highlights.length} results found`
                : `${totalCount} highlights in your collection`}
            </p>
          </div>

          <div className='h-[600px] overflow-y-auto'>
            {highlights.length > 0 ? (
              <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                {highlights.map((highlight) => (
                  <li key={highlight._id}>
                    <button
                      onClick={() => setSelectedHighlight(highlight)}
                      className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors ${
                        selectedHighlight?._id === highlight._id
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : ''
                      }`}
                    >
                      <div>
                        <div className='font-medium line-clamp-1'>
                          {highlight.text}
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center'>
                          <span
                            className='inline-block w-2 h-2 rounded-full mr-2'
                            style={{ backgroundColor: highlight.color }}
                          ></span>
                          <Globe className='h-3 w-3 mr-1' />
                          {formatUrl(highlight.url)}
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-gray-400 ${
                          selectedHighlight?._id === highlight._id
                            ? 'text-purple-500'
                            : ''
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='p-6 text-center text-gray-500 dark:text-gray-400'>
                {searchTerm
                  ? 'No highlights found matching your search'
                  : 'No saved highlights yet'}
              </div>
            )}

            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div ref={loaderRef} className='p-4 text-center'>
                {isLoading ? (
                  <div className='flex justify-center items-center space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-purple-500 animate-bounce'></div>
                    <div
                      className='w-2 h-2 rounded-full bg-purple-500 animate-bounce'
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className='w-2 h-2 rounded-full bg-purple-500 animate-bounce'
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                ) : (
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    Scroll for more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Highlight Details */}
        <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md'>
          {selectedHighlight ? (
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold line-clamp-1'>
                  {selectedHighlight.title || formatUrl(selectedHighlight.url)}
                </h2>
                <a
                  href={selectedHighlight.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full'
                  aria-label='Visit source website'
                >
                  <ExternalLink className='h-5 w-5' />
                </a>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-3'>
                    Highlighted Text
                  </h3>
                  <div
                    className={`p-4 rounded-lg ${
                      getColorClasses(selectedHighlight.color).bg
                    }`}
                  >
                    <p
                      className={`${
                        getColorClasses(selectedHighlight.color).text
                      } text-lg`}
                    >
                      &quot;{selectedHighlight.text}&quot;
                    </p>
                  </div>
                </div>

                {selectedHighlight.context && (
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>Context</h3>
                    <p className='text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                      {selectedHighlight.context}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className='text-lg font-semibold mb-2'>Source</h3>
                  <a
                    href={selectedHighlight.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-purple-600 dark:text-purple-400 hover:underline flex items-center'
                  >
                    <Globe className='h-4 w-4 mr-2' />
                    {selectedHighlight.url}
                    <ExternalLink className='h-4 w-4 ml-1' />
                  </a>
                </div>

                <div>
                  <h3 className='text-lg font-semibold mb-2'>Saved On</h3>
                  <p className='text-gray-700 dark:text-gray-300'>
                    {new Date(selectedHighlight.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center p-6 text-center text-gray-500'>
              <div>
                <HighlighterIcon className='h-12 w-12 mx-auto mb-4 opacity-30' />
                <h3 className='text-lg font-medium mb-2'>Select a highlight</h3>
                <p>Click on any highlight from your list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
