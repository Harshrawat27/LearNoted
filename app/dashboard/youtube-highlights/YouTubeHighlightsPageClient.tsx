'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Search,
  ExternalLink,
  ChevronRight,
  X,
  Video,
  SquarePlay,
  Youtube,
} from 'lucide-react';

interface Timestamp {
  _id: string;
  time: number;
  comment: string;
  createdAt: string;
}

interface YouTubeHighlight {
  _id: string;
  videoId: string;
  channelName: string;
  title: string;
  timestamps: Timestamp[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface YouTubeHighlightsPageClientProps {
  initialHighlights: YouTubeHighlight[];
  totalCount: number;
}

export default function YouTubeHighlightsPageClient({
  initialHighlights,
  totalCount,
}: YouTubeHighlightsPageClientProps) {
  const [highlights, setHighlights] =
    useState<YouTubeHighlight[]>(initialHighlights);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<
    'all' | 'channel' | 'title' | 'comment'
  >('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(totalCount > initialHighlights.length);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHighlight, setSelectedHighlight] =
    useState<YouTubeHighlight | null>(null);

  const loaderRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

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
          `/api/youtube-timestamps?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(
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
        console.error('Error fetching YouTube highlights:', error);
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

  // Format timestamp to MM:SS
  const formatTimestamp = (seconds: number) => {
    const roundedSeconds = Math.round(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Generate YouTube video thumbnail URL
  const getVideoThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Generate YouTube video link with timestamp
  const getVideoLink = (videoId: string, timeInSeconds: number) => {
    const roundedSeconds = Math.round(timeInSeconds);
    return `https://www.youtube.com/watch?v=${videoId}&t=${roundedSeconds}s`;
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold mb-8'>Your YouTube Highlights</h1>

      {/* Search Bar with Filters */}
      <div className='mb-6 space-y-3'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search your YouTube highlights...'
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
            onClick={() => setSearchFilter('channel')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center ${
              searchFilter === 'channel'
                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Youtube className='h-4 w-4 mr-1' />
            Channel
          </button>
          <button
            onClick={() => setSearchFilter('title')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center ${
              searchFilter === 'title'
                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Video className='h-4 w-4 mr-1' />
            Video Title
          </button>
          <button
            onClick={() => setSearchFilter('comment')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center ${
              searchFilter === 'comment'
                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <ChevronRight className='h-4 w-4 mr-1' />
            Comments
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Highlights List */}
        <div className='lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-semibold'>Your Saved Videos</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {searchTerm
                ? `${highlights.length} results found`
                : `${totalCount} videos in your collection`}
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
                      <div className='flex-1 pr-4'>
                        <div className='font-medium line-clamp-1'>
                          {highlight.title}
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center'>
                          <Youtube className='h-3 w-3 mr-1' />
                          {highlight.channelName}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                          {highlight.timestamps.length}{' '}
                          {highlight.timestamps.length === 1
                            ? 'highlight'
                            : 'highlights'}
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-gray-400 flex-shrink-0 ${
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
                  ? 'No videos found matching your search'
                  : 'No saved YouTube highlights yet'}
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

        {/* Video Details and Timestamps */}
        <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md'>
          {selectedHighlight ? (
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-2xl font-bold line-clamp-2'>
                  {selectedHighlight.title}
                </h2>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedHighlight.videoId}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full'
                  aria-label='Watch on YouTube'
                >
                  <ExternalLink className='h-5 w-5' />
                </a>
              </div>

              <div className='mb-6'>
                <p className='text-gray-700 dark:text-gray-300 flex items-center'>
                  <Youtube className='h-4 w-4 mr-2 text-red-500' />
                  {selectedHighlight.channelName}
                </p>
              </div>

              {/* Video Thumbnail */}
              <div className='relative mb-6 w-full pt-[56.25%] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden'>
                <Image
                  src={getVideoThumbnail(selectedHighlight.videoId)}
                  alt={selectedHighlight.title}
                  className='absolute inset-0 w-full h-full object-cover'
                />
                <a
                  href={`https://www.youtube.com/watch?v=${selectedHighlight.videoId}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-opacity'
                >
                  <div className='w-16 h-16 flex items-center justify-center bg-red-600 rounded-full'>
                    <SquarePlay className='h-12 w-12 opacity-30' />
                  </div>
                </a>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>
                  Highlights & Timestamps
                </h3>
                {selectedHighlight.timestamps.length > 0 ? (
                  <ul className='space-y-4'>
                    {selectedHighlight.timestamps.map((timestamp, index) => (
                      <li
                        key={timestamp._id || index}
                        className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'
                      >
                        <div className='flex items-start'>
                          <a
                            href={getVideoLink(
                              selectedHighlight.videoId,
                              timestamp.time
                            )}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex-shrink-0 px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg font-mono hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors mr-4'
                          >
                            {formatTimestamp(timestamp.time)}
                          </a>
                          <div className='flex-1'>
                            <p className='text-gray-800 dark:text-gray-200'>
                              {timestamp.comment}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                              Saved on{' '}
                              {new Date(timestamp.createdAt).toLocaleDateString(
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
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-gray-500 dark:text-gray-400 italic'>
                    No timestamps saved for this video.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center p-6 text-center text-gray-500'>
              <div>
                <SquarePlay className='h-12 w-12 mx-auto mb-4 opacity-30' />
                <h3 className='text-lg font-medium mb-2'>Select a video</h3>
                <p>
                  Click on any video from your list to view highlights and
                  timestamps
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
