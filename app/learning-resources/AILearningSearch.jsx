'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

// This component can be placed in: app/learning-resources/page.tsx
export default function AILearningSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setError('');

    try {
      // Replace with your actual API endpoint - you should use environment variables for API keys
      const response = await fetch('/api/learning-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch learning resources');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Split content by double line breaks to create separate cards
      const contentSections = data.content
        .split(/\n\n+/)
        .filter((section) => section.trim());
      setResults(contentSections);
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6'>
        <h1 className='text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6'>
          AI Learning Resource Finder
        </h1>
        <p className='text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
          Enter any topic you want to learn about, and our AI will find the best
          articles, videos, courses, and resources to help you master it.
        </p>

        {/* Search bar */}
        <div className='relative max-w-2xl mx-auto mb-10'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search a topic like 'neural networks' or 'JavaScript basics'..."
            className='block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white'
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className='absolute inset-y-0 right-2 flex items-center px-4 font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors my-1'
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className='mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-xl max-w-2xl mx-auto'>
            <p>{error}</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className='flex justify-center items-center space-x-2 mb-8'>
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
        )}

        {/* Results */}
        <div className='space-y-6 max-w-3xl mx-auto'>
          {results.length > 0 && (
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6'>
              {/* Introduction section - Always show first */}
              {results[0] && (
                <div className='mb-6'>
                  <div className='prose dark:prose-invert prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none'>
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-purple-500 hover:text-purple-700 underline'
                          />
                        ),
                      }}
                    >
                      {results[0]}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Articles Section */}
              <div className='mb-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2'>
                  Recommended Articles
                </h2>
                <div className='space-y-4'>
                  {results
                    .slice(1)
                    .filter(
                      (section) =>
                        section.toLowerCase().includes('article') ||
                        section.includes('## ')
                    ).length > 0 ? (
                    results
                      .slice(1)
                      .filter(
                        (section) =>
                          section.toLowerCase().includes('article') ||
                          section.includes('## ')
                      )
                      .map((section, index) => (
                        <div
                          key={`article-${index}`}
                          className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4'
                        >
                          <div className='prose dark:prose-invert prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none'>
                            <ReactMarkdown
                              components={{
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-purple-500 hover:text-purple-700 underline'
                                  />
                                ),
                              }}
                            >
                              {section}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400 italic'>
                      No article resources found for this topic.
                    </p>
                  )}
                </div>
              </div>

              {/* Videos Section */}
              <div className='mb-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2'>
                  Video Resources
                </h2>
                <div className='space-y-4'>
                  {results
                    .slice(1)
                    .filter(
                      (section) =>
                        section.toLowerCase().includes('video') ||
                        section.toLowerCase().includes('youtube')
                    ).length > 0 ? (
                    results
                      .slice(1)
                      .filter(
                        (section) =>
                          section.toLowerCase().includes('video') ||
                          section.toLowerCase().includes('youtube')
                      )
                      .map((section, index) => (
                        <div
                          key={`video-${index}`}
                          className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4'
                        >
                          <div className='prose dark:prose-invert prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none'>
                            <ReactMarkdown
                              components={{
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-purple-500 hover:text-purple-700 underline'
                                  />
                                ),
                              }}
                            >
                              {section}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400 italic'>
                      No video resources found for this topic.
                    </p>
                  )}
                </div>
              </div>

              {/* Courses Section */}
              <div className='mb-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2'>
                  Courses & Interactive Learning
                </h2>
                <div className='space-y-4'>
                  {results
                    .slice(1)
                    .filter(
                      (section) =>
                        section.toLowerCase().includes('course') ||
                        section.toLowerCase().includes('interactive') ||
                        section.toLowerCase().includes('community') ||
                        (!section.toLowerCase().includes('article') &&
                          !section.toLowerCase().includes('video') &&
                          !section.toLowerCase().includes('youtube'))
                    ).length > 0 ? (
                    results
                      .slice(1)
                      .filter(
                        (section) =>
                          section.toLowerCase().includes('course') ||
                          section.toLowerCase().includes('interactive') ||
                          section.toLowerCase().includes('community') ||
                          (!section.toLowerCase().includes('article') &&
                            !section.toLowerCase().includes('video') &&
                            !section.toLowerCase().includes('youtube'))
                      )
                      .map((section, index) => (
                        <div
                          key={`course-${index}`}
                          className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4'
                        >
                          <div className='prose dark:prose-invert prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none'>
                            <ReactMarkdown
                              components={{
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-purple-500 hover:text-purple-700 underline'
                                  />
                                ),
                              }}
                            >
                              {section}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400 italic'>
                      No courses or interactive resources found for this topic.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
