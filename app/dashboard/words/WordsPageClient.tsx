'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, Bookmark, ChevronRight, X } from 'lucide-react';

interface SearchItem {
  _id: string;
  word: string;
  meaning: string;
  synonyms: string[];
  createdAt: string;
  category?: string;
  context: string;
  additional?: string;
}

interface WordsPageClientProps {
  initialSearches: SearchItem[];
  totalCount: number;
  userId: string;
}

export default function WordsPageClient({
  initialSearches,
  totalCount,
  userId,
}: WordsPageClientProps) {
  const [searches, setSearches] = useState<SearchItem[]>(initialSearches);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(totalCount > initialSearches.length);
  const [selectedWord, setSelectedWord] = useState<SearchItem | null>(null);

  const loader = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

  // Fetch searches from the API
  const fetchSearches = useCallback(
    async (
      currentPage: number,
      currentSearch: string,
      append: boolean = false
    ) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/searches?userId=${userId}&page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(
            currentSearch
          )}`
        );
        if (!response.ok) throw new Error('Failed to fetch searches');
        const data = await response.json();
        const newSearches = data.searches;
        const hasMoreFromAPI = data.hasMore;

        setSearches((prev) =>
          append ? [...prev, ...newSearches] : newSearches
        );
        setHasMore(hasMoreFromAPI);
      } catch (error) {
        console.error('Error fetching searches:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // Reset and fetch when search term changes
  useEffect(() => {
    setPage(1);
    setSearches([]); // Clear current searches
    fetchSearches(1, searchTerm);
  }, [searchTerm, fetchSearches]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const currentLoader = loader.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchSearches(nextPage, searchTerm, true);
        }
      },
      { threshold: 1.0 }
    );

    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, isLoading, page, searchTerm, fetchSearches]);

  return (
    <div className='max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold mb-8'>Saved Words</h1>

      {/* Search Bar */}
      <div className='relative mb-6'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <SearchIcon className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          placeholder='Search your saved words...'
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

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Words List */}
        <div className='lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-semibold'>Your Saved Words</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {totalCount} words in your collection
            </p>
          </div>

          <div className='h-[600px] overflow-y-auto'>
            {searches.length > 0 ? (
              <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                {searches.map((search) => (
                  <li key={search._id}>
                    <button
                      onClick={() => setSelectedWord(search)}
                      className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors ${
                        selectedWord?._id === search._id
                          ? 'bg-purple-50 dark:bg-purple-900/20 border-l-2 border-purple-500'
                          : ''
                      }`}
                    >
                      <div>
                        <div className='font-medium'>{search.word}</div>
                        <div className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
                          {search.meaning}
                        </div>
                      </div>
                      <ChevronRight
                        className={`min-h-5 min-w-5 max-h-5 max-w-5 text-gray-400 ${
                          selectedWord?._id === search._id
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
                  ? 'No words found matching your search'
                  : 'No saved words yet'}
              </div>
            )}

            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div ref={loader} className='p-4 text-center'>
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

        {/* Word Details */}
        <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md'>
          {selectedWord ? (
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-2xl font-bold'>{selectedWord.word}</h2>
                <button className='p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full'>
                  <Bookmark className='h-5 w-5' />
                </button>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Definition</h3>
                  <p className='text-gray-700 dark:text-gray-300'>
                    {selectedWord.meaning}
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold mb-2'>Synonyms</h3>
                  <div className='flex flex-wrap gap-2'>
                    {selectedWord.synonyms.map((synonym, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm'
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-semibold mb-2'>Added On</h3>
                  <p className='text-gray-700 dark:text-gray-300'>
                    {new Date(selectedWord.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>

                {selectedWord.category && (
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>Category</h3>
                    <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm'>
                      {selectedWord.category}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className='text-lg font-semibold mb-2'>Example Usage</h3>
                  <p className='italic text-gray-600 dark:text-gray-400'>
                    {selectedWord.context}
                  </p>
                </div>

                {selectedWord.additional && (
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>
                      Additional Info
                    </h3>
                    <p className='text-gray-700 dark:text-gray-300'>
                      {selectedWord.additional}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center p-6 text-center text-gray-500'>
              <div>
                <Bookmark className='h-12 w-12 mx-auto mb-4 opacity-30' />
                <h3 className='text-lg font-medium mb-2'>Select a word</h3>
                <p>Click on any word from your list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 'use client';
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Search as SearchIcon, Bookmark, ChevronRight, X } from 'lucide-react';

// interface SearchItem {
//   _id: string;
//   word: string;
//   meaning: string;
//   synonyms: string[];
//   createdAt: string;
//   category?: string;
// }

// interface WordsPageClientProps {
//   initialSearches: SearchItem[];
//   totalCount: number;
//   userId: string;
// }

// export default function WordsPageClient({
//   initialSearches,
//   totalCount,
//   userId,
// }: WordsPageClientProps) {
//   const [searches, setSearches] = useState<SearchItem[]>(initialSearches);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(totalCount > initialSearches.length);
//   const [selectedWord, setSelectedWord] = useState<SearchItem | null>(null);

//   const loader = useRef<HTMLDivElement>(null);
//   const itemsPerPage = 20;

//   // Fetch searches from the API
//   const fetchSearches = useCallback(
//     async (
//       currentPage: number,
//       currentSearch: string,
//       append: boolean = false
//     ) => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(
//           `/api/searches?userId=${userId}&page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(
//             currentSearch
//           )}`
//         );
//         if (!response.ok) throw new Error('Failed to fetch searches');
//         const data = await response.json();
//         const newSearches = data.searches;
//         const hasMoreFromAPI = data.hasMore;

//         setSearches((prev) =>
//           append ? [...prev, ...newSearches] : newSearches
//         );
//         setHasMore(hasMoreFromAPI);
//       } catch (error) {
//         console.error('Error fetching searches:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [userId]
//   );

//   // Reset and fetch when search term changes
//   useEffect(() => {
//     setPage(1);
//     setSearches([]); // Clear current searches
//     fetchSearches(1, searchTerm);
//   }, [searchTerm, fetchSearches]);

//   // Infinite scroll with Intersection Observer
//   useEffect(() => {
//     const currentLoader = loader.current;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !isLoading) {
//           const nextPage = page + 1;
//           setPage(nextPage);
//           fetchSearches(nextPage, searchTerm, true);
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (currentLoader) observer.observe(currentLoader);
//     return () => {
//       if (currentLoader) observer.unobserve(currentLoader);
//     };
//   }, [hasMore, isLoading, page, searchTerm, fetchSearches]);

//   return (
//     <div className='max-w-6xl mx-auto px-4 py-8'>
//       <h1 className='text-3xl font-bold mb-8 text-gray-800 dark:text-white'>
//         <span className='border-b-4 border-[#ff6633] pb-1'>Saved Words</span>
//       </h1>

//       {/* Search Bar */}
//       <div className='relative mb-8'>
//         <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
//           <SearchIcon className='h-5 w-5 text-gray-400' />
//         </div>
//         <input
//           type='text'
//           placeholder='Search your saved words...'
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className='block w-full pl-12 pr-12 py-4 border-0 rounded-xl bg-white dark:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ff6633] transition-all'
//         />
//         {searchTerm && (
//           <button
//             onClick={() => setSearchTerm('')}
//             className='absolute inset-y-0 right-0 pr-4 flex items-center'
//           >
//             <X className='h-5 w-5 text-gray-400 hover:text-gray-500' />
//           </button>
//         )}
//       </div>

//       <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
//         {/* Words List */}
//         <div className='lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700'>
//           <div className='p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'>
//             <h2 className='text-lg font-semibold flex items-center'>
//               <Bookmark className='h-5 w-5 mr-2 text-[#ff6633]' />
//               Your Saved Words
//             </h2>
//             <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
//               {totalCount} words in your collection
//             </p>
//           </div>

//           <div className='h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
//             {searches.length > 0 ? (
//               <ul className='divide-y divide-gray-100 dark:divide-gray-700'>
//                 {searches.map((search) => (
//                   <li key={search._id}>
//                     <button
//                       onClick={() => setSelectedWord(search)}
//                       className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between transition-all ${
//                         selectedWord?._id === search._id
//                           ? 'bg-[#ff6633]/5 dark:bg-[#ff6633]/10 border-l-4 border-[#ff6633]'
//                           : 'border-l-4 border-transparent'
//                       }`}
//                     >
//                       <div className='flex-1 min-w-0'>
//                         <div className='font-medium text-gray-900 dark:text-white'>
//                           {search.word}
//                         </div>
//                         <div className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1'>
//                           {search.meaning}
//                         </div>
//                       </div>
//                       <ChevronRight
//                         className={`min-h-5 min-w-5 max-h-5 max-w-5 ml-3 ${
//                           selectedWord?._id === search._id
//                             ? 'text-[#ff6633]'
//                             : 'text-gray-400'
//                         }`}
//                       />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className='p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center'>
//                 <Bookmark className='h-10 w-10 mb-3 opacity-20' />
//                 {searchTerm
//                   ? 'No words found matching your search'
//                   : 'No saved words yet'}
//               </div>
//             )}

//             {/* Loading indicator for infinite scroll */}
//             {hasMore && (
//               <div ref={loader} className='p-4 text-center'>
//                 {isLoading ? (
//                   <div className='flex justify-center items-center space-x-2'>
//                     <div className='w-2 h-2 rounded-full bg-[#ff6633] animate-bounce'></div>
//                     <div
//                       className='w-2 h-2 rounded-full bg-[#ff6633] animate-bounce'
//                       style={{ animationDelay: '0.2s' }}
//                     ></div>
//                     <div
//                       className='w-2 h-2 rounded-full bg-[#ff6633] animate-bounce'
//                       style={{ animationDelay: '0.4s' }}
//                     ></div>
//                   </div>
//                 ) : (
//                   <span className='text-sm text-gray-500 dark:text-gray-400'>
//                     Scroll for more
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Word Details */}
//         <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700'>
//           {selectedWord ? (
//             <div className='p-8'>
//               <div className='flex items-center justify-between mb-6'>
//                 <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
//                   {selectedWord.word}
//                 </h2>
//                 <button className='p-2 text-[#ff6633] hover:text-[#ff6633]/80 hover:bg-[#ff6633]/10 rounded-full transition-colors'>
//                   <Bookmark className='h-6 w-6' />
//                 </button>
//               </div>

//               <div className='space-y-8'>
//                 <div className='bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl'>
//                   <h3 className='text-lg font-semibold mb-3 flex items-center'>
//                     <span className='w-8 h-8 rounded-full bg-[#ff6633]/10 text-[#ff6633] inline-flex items-center justify-center mr-2'>
//                       1
//                     </span>
//                     Definition
//                   </h3>
//                   <p className='text-gray-700 dark:text-gray-300 ml-10'>
//                     {selectedWord.meaning}
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className='text-lg font-semibold mb-3 flex items-center'>
//                     <span className='w-8 h-8 rounded-full bg-[#ff6633]/10 text-[#ff6633] inline-flex items-center justify-center mr-2'>
//                       2
//                     </span>
//                     Synonyms
//                   </h3>
//                   <div className='flex flex-wrap gap-2 ml-10'>
//                     {selectedWord.synonyms.map((synonym, index) => (
//                       <span
//                         key={index}
//                         className='px-3 py-1 bg-[#ff6633]/10 text-[#ff6633] rounded-full text-sm'
//                       >
//                         {synonym}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                   <div className='bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl'>
//                     <h3 className='text-lg font-semibold mb-2'>Added On</h3>
//                     <p className='text-gray-700 dark:text-gray-300'>
//                       {new Date(selectedWord.createdAt).toLocaleDateString(
//                         'en-US',
//                         {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric',
//                         }
//                       )}
//                     </p>
//                   </div>

//                   {selectedWord.category && (
//                     <div className='bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl'>
//                       <h3 className='text-lg font-semibold mb-2'>Category</h3>
//                       <span className='px-3 py-1 bg-[#ff6633]/10 text-[#ff6633] rounded-full text-sm'>
//                         {selectedWord.category}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <div className='bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl'>
//                   <h3 className='text-lg font-semibold mb-3'>Example Usage</h3>
//                   <p className='italic text-gray-600 dark:text-gray-400 border-l-4 border-[#ff6633] pl-4 py-2'>
//                     &quot;The professor used the word &apos;{selectedWord.word}
//                     &apos; in the context of linguistic theory.&quot;
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className='h-full flex items-center justify-center p-6 text-center text-gray-500'>
//               <div className='max-w-md p-8'>
//                 <div className='w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6'>
//                   <Bookmark className='h-10 w-10 text-[#ff6633] opacity-50' />
//                 </div>
//                 <h3 className='text-xl font-medium mb-3 text-gray-800 dark:text-white'>
//                   Select a word
//                 </h3>
//                 <p className='text-gray-500 dark:text-gray-400'>
//                   Click on any word from your collection to view its details,
//                   definition, and example usage
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
