'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Mail, Package, Edit, Check } from 'lucide-react';

interface ProfilePageClientProps {
  user: {
    name: string;
    email: string;
    subscriptionPlan: string;
    wordSearchCount: number;
    image?: string;
  };
}

export default function ProfilePageClient({ user }: ProfilePageClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the API call to update the user's name
    // For now, we'll just toggle the editing state back
    setIsEditing(false);
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-8'>Your Profile</h1>

      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden'>
        {/* Profile Header */}
        <div className='bg-gradient-to-r from-purple-500 to-indigo-600 h-32' />

        <div className='p-6 relative'>
          {/* Profile Picture */}
          <div className='absolute -top-16 left-6'>
            <div className='h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700'>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={128}
                  height={128}
                  className='object-cover'
                />
              ) : (
                <div className='flex items-center justify-center h-full text-gray-500 dark:text-gray-400'>
                  <User size={64} />
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className='mt-16'>
            <div className='flex justify-between items-center mb-4'>
              {isEditing ? (
                <form onSubmit={handleSubmit} className='flex gap-2'>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  />
                  <button
                    type='submit'
                    className='p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600'
                  >
                    <Check size={20} />
                  </button>
                </form>
              ) : (
                <>
                  <h2 className='text-xl font-bold'>{user.name}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className='text-purple-500 hover:text-purple-600 flex items-center gap-1'
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                </>
              )}
            </div>

            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                <Mail className='w-5 h-5 text-gray-500' />
                <span>{user.email}</span>
              </div>

              <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                <Package className='w-5 h-5 text-gray-500' />
                <span>
                  <span className='font-semibold'>{user.subscriptionPlan}</span>{' '}
                  subscription
                </span>
              </div>

              <div>
                <h3 className='font-semibold text-lg mb-2'>
                  Account Statistics
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Word Searches
                    </div>
                    <div className='text-2xl font-bold'>
                      {user.wordSearchCount}
                    </div>
                  </div>
                  <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Account Status
                    </div>
                    <div className='text-2xl font-bold'>Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
