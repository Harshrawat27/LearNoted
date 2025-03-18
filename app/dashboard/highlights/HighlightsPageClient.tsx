'use client';
import { useState, useCallback } from 'react';
import {
  Search,
  ExternalLink,
  ChevronRight,
  X,
  HighlighterIcon,
  Globe,
  Calendar,
} from 'lucide-react';

interface CharOffsets {
  start?: number;
  end?: number;
  [key: string]: unknown;
}

// Interfaces for our data types
interface HighlightItem {
  _id: string;
  text: string;
  color: string;
  context: string;
  url: string;
  createdAt: string;
  serialized?: string;
  charOffsets?: CharOffsets | null;
}

interface URLSummary {
  url: string;
  title: string;
  totalHighlights: number;
  lastUpdated: string;
}

interface DateGroupedHighlights {
  date: string;
  highlights: HighlightItem[];
}

interface HighlightsPageClientProps {
  urlSummaries: URLSummary[];
  initialHighlights: HighlightItem[];
  initialUrl: string | null;
}

export default function HighlightsPageClient({
  urlSummaries,
  initialHighlights,
  initialUrl,
}: HighlightsPageClientProps) {
  // We're keeping the URLs state but not updating it after initial load
  // This is intentional as we're not adding new URLs during the session
  const [urls] = useState<URLSummary[]>(urlSummaries);
  const [highlights, setHighlights] =
    useState<HighlightItem[]>(initialHighlights);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(initialUrl);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'domain' | 'text'>(
    'all'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHighlight, setSelectedHighlight] =
    useState<HighlightItem | null>(
      initialHighlights.length > 0 ? initialHighlights[0] : null
    );

  // Format URL for display
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname === '/'
        ? urlObj.hostname
        : `${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return url;
    }
  };

  // Group highlights by date
  const groupHighlightsByDate = (
    items: HighlightItem[]
  ): DateGroupedHighlights[] => {
    const dateMap = new Map<string, HighlightItem[]>();

    items.forEach((highlight) => {
      // Format the date as YYYY-MM-DD
      const date = new Date(highlight.createdAt);
      const dateKey = date.toISOString().split('T')[0];

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }

      dateMap.get(dateKey)!.push(highlight);
    });

    // Convert to array and sort by date (newest first)
    return Array.from(dateMap.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, highlights]) => ({
        date,
        highlights: highlights.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      }));
  };

  // Fetch highlights for a specific URL
  const fetchHighlightsForUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/highlights?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) throw new Error('Failed to fetch highlights');
      const data = await response.json();
      setHighlights(data.highlights);
      if (data.highlights.length > 0) {
        setSelectedHighlight(data.highlights[0]);
      } else {
        setSelectedHighlight(null);
      }
    } catch (error) {
      console.error('Error fetching highlights:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle URL selection
  const handleUrlSelect = (url: string) => {
    setSelectedUrl(url);
    fetchHighlightsForUrl(url);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  // Filter URLs based on search term
  const filteredUrls = urls.filter((urlData) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();

    // Apply filters based on searchFilter
    if (searchFilter === 'domain' || searchFilter === 'all') {
      if (
        urlData.title.toLowerCase().includes(lowerSearch) ||
        urlData.url.toLowerCase().includes(lowerSearch)
      ) {
        return true;
      }
    }

    // For 'text' filter, we'd need to check highlights content
    // This would require fetching all highlights or searching on the server
    // For simplicity, we're just filtering URLs here

    return false;
  });

  // Group and filter highlights
  const dateGroupedHighlights = groupHighlightsByDate(
    searchTerm && searchFilter === 'text'
      ? highlights.filter(
          (h) =>
            h.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (h.context &&
              h.context.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : highlights
  );

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
            Page
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
        {/* URLs List */}
        <div className='lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-semibold'>Saved Pages</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {searchTerm && searchFilter !== 'text'
                ? `${filteredUrls.length} results found`
                : `${filteredUrls.length} pages with highlights`}
            </p>
          </div>

          <div className='h-[600px] overflow-y-auto'>
            {filteredUrls.length > 0 ? (
              <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredUrls.map((urlData) => (
                  <li key={urlData.url}>
                    <button
                      onClick={() => handleUrlSelect(urlData.url)}
                      className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors ${
                        selectedUrl === urlData.url
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : ''
                      }`}
                    >
                      <div className='flex-1 min-w-0'>
                        <div className='font-medium line-clamp-1'>
                          {formatUrl(urlData.url)}
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center'>
                          <Globe className='h-3 w-3 mr-1' />
                          <span className='truncate'>{urlData.title}</span>
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center'>
                          <HighlighterIcon className='h-3 w-3 mr-1' />
                          {urlData.totalHighlights} highlight
                          {urlData.totalHighlights !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-gray-400 flex-shrink-0 ml-2 ${
                          selectedUrl === urlData.url ? 'text-purple-500' : ''
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='p-6 text-center text-gray-500 dark:text-gray-400'>
                {searchTerm
                  ? 'No pages found matching your search'
                  : 'No saved highlights yet'}
              </div>
            )}
          </div>
        </div>

        {/* Highlight Details */}
        <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden'>
          {isLoading ? (
            <div className='h-full flex items-center justify-center'>
              <div className='flex justify-center items-center space-x-2'>
                <div className='w-3 h-3 rounded-full bg-purple-500 animate-bounce'></div>
                <div
                  className='w-3 h-3 rounded-full bg-purple-500 animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className='w-3 h-3 rounded-full bg-purple-500 animate-bounce'
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          ) : selectedUrl && dateGroupedHighlights.length > 0 ? (
            <div className='h-[600px] overflow-y-auto'>
              <div className='p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold line-clamp-1'>
                    {formatUrl(selectedUrl)}
                  </h2>
                  <a
                    href={selectedUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full'
                    aria-label='Visit source website'
                  >
                    <ExternalLink className='h-5 w-5' />
                  </a>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {searchTerm && searchFilter === 'text'
                    ? `${dateGroupedHighlights.reduce(
                        (acc, group) => acc + group.highlights.length,
                        0
                      )} highlights found`
                    : `${highlights.length} highlights on this page`}
                </p>
              </div>

              <div className='p-4 space-y-6'>
                {dateGroupedHighlights.map((group) => (
                  <div key={group.date}>
                    <div className='flex items-center gap-2 mb-3 sticky top-[60px] bg-white dark:bg-gray-800 py-2 z-10'>
                      <Calendar className='h-4 w-4 text-gray-500' />
                      <h3 className='text-md font-medium text-gray-600 dark:text-gray-300'>
                        {formatDate(group.date)}
                      </h3>
                    </div>

                    <div className='space-y-4'>
                      {group.highlights.map((highlight) => (
                        <div
                          key={highlight._id}
                          className={`p-4 rounded-lg ${
                            getColorClasses(highlight.color).bg
                          } transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-500 ${
                            selectedHighlight?._id === highlight._id
                              ? 'ring-2 ring-purple-500'
                              : ''
                          }`}
                          onClick={() => setSelectedHighlight(highlight)}
                        >
                          <p
                            className={`${
                              getColorClasses(highlight.color).text
                            } text-lg`}
                          >
                            &quot;{highlight.text}&quot;
                          </p>

                          {/* Show context if expanded */}
                          {selectedHighlight?._id === highlight._id &&
                            highlight.context && (
                              <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-600'>
                                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                                  {highlight.context}
                                </p>
                              </div>
                            )}

                          <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                            {new Date(highlight.createdAt).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center p-6 text-center text-gray-500'>
              <div>
                <HighlighterIcon className='h-12 w-12 mx-auto mb-4 opacity-30' />
                <h3 className='text-lg font-medium mb-2'>Select a page</h3>
                <p>Click on any page from your list to view highlights</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
