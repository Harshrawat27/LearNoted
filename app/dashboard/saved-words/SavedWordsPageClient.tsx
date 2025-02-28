// app/dashboard/saved-words/SavedWordsPageClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce'; // Install with `npm install lodash`

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

  // Fetch words from the API
  const fetchWords = useCallback(
    async (currentPage: number, currentSearch: string) => {
      const res = await fetch(
        `/api/searches?userId=${userId}&page=${currentPage}&limit=10&search=${currentSearch}`
      );
      const data = await res.json();

      // Filter out any duplicates based on _id (extra safety)
      const newWords = data.searches.filter(
        (word: Search) => !words.some((existing) => existing._id === word._id)
      );

      // Append new words to the existing list
      setWords((prev) => [...prev, ...newWords]);
      setHasMore(data.hasMore);
    },
    [userId, words]
  );

  // Handle search input with debounce
  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page
    setWords([]); // Clear words for new search
    setHasMore(true); // Reset hasMore
  }, 500);

  // Fetch words when page or search term changes
  useEffect(() => {
    fetchWords(page, searchTerm);
  }, [page, searchTerm, fetchWords]);

  // Infinite scroll: increment page when loader is in view
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
        Saved Words
      </h2>
      <input
        type='text'
        placeholder='Search words...'
        onChange={(e) => handleSearch(e.target.value)}
        className='w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white'
      />
      <div className='space-y-4'>
        {words.map((word) => (
          <div key={word._id} className='p-4 border rounded'>
            <h3 className='text-lg font-semibold'>{word.word}</h3>
            <p>{word.meaning}</p>
            <p>Synonyms: {word.synonyms.join(', ')}</p>
            <p>Date: {new Date(word.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      {hasMore && (
        <div
          ref={ref}
          className='text-center p-4 text-gray-600 dark:text-gray-400'
        >
          Loading more...
        </div>
      )}
    </div>
  );
}
