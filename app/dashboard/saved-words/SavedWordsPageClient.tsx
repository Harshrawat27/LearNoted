'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';

interface Search {
  _id: string;
  word: string;
  meaning: string;
  synonyms: string[];
  createdAt: string;
}

export default function SavedWordsPageClient({ userId }: { userId: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState<Search[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const fetchWords = useCallback(
    async (currentPage: number, currentSearch: string) => {
      const res = await fetch(
        `/api/searches?userId=${userId}&page=${currentPage}&limit=10&search=${currentSearch}`
      );
      const data = await res.json();

      const newWords = data.searches.filter(
        (word: Search) => !words.some((existing) => existing._id === word._id)
      );

      setWords((prev) => [...prev, ...newWords]);
      setHasMore(data.hasMore);
    },
    [userId, words]
  );

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
    setPage(1);
    setWords([]);
    setHasMore(true);
  }, 500);

  useEffect(() => {
    fetchWords(page, searchTerm);
  }, [page, searchTerm, fetchWords]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  return (
    <div className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-2xl mx-auto'>
      <h2 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center'>
        Saved Words
      </h2>
      <input
        type='text'
        placeholder='Search words...'
        onChange={(e) => handleSearch(e.target.value)}
        className='w-full p-3 mb-6 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#ff6633] focus:outline-none'
      />
      <div className='space-y-6'>
        {words.map((word) => (
          <div
            key={word._id}
            className='p-5 border border-gray-200 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800'
          >
            <h3 className='text-xl font-semibold text-[#ff6633] dark:text-[#ff6633]'>
              {word.word}
            </h3>
            <p className='text-gray-700 dark:text-gray-300'>{word.meaning}</p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Synonyms:{' '}
              <span className='font-medium'>{word.synonyms.join(', ')}</span>
            </p>
            <p className='text-xs text-gray-400 dark:text-gray-500'>
              Date: {new Date(word.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      {hasMore && (
        <div
          ref={ref}
          className='text-center py-6 text-gray-600 dark:text-gray-400 animate-pulse'
        >
          Loading more...
        </div>
      )}
    </div>
  );
}
