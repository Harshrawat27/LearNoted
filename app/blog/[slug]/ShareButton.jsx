'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Share2,
  Copy,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
} from 'lucide-react';

export default function ShareButton({ title, excerpt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Share functions
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `${title}\n\n${excerpt?.substring(0, 100)}${excerpt?.length > 100 ? '...' : ''}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(title || 'Check out this blog post');
    const body = encodeURIComponent(
      `${title}\n\n${excerpt || ''}\n\n${window.location.href}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title || 'Blog Post',
          text: excerpt || '',
          url: window.location.href,
        })
        .catch((err) => console.error('Error sharing:', err));
      setIsOpen(false);
    }
  };

  return (
    <div className='relative'>
      <button
        className='flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'
        onClick={() => setIsOpen(!isOpen)}
        aria-label='Share post'
      >
        <Share2 className='h-4 w-4 mr-1' />
        Share
      </button>

      {/* Share popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className='absolute z-10 mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden'
          style={{ right: 0 }}
        >
          <div className='p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Share this post
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            >
              <X className='h-4 w-4' />
            </button>
          </div>

          <div className='p-3'>
            {/* Native share (mobile) */}
            {navigator.share && (
              <button
                onClick={nativeShare}
                className='w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mb-1'
              >
                <Share2 className='h-5 w-5 mr-3 text-purple-600 dark:text-purple-400' />
                <span className='text-gray-800 dark:text-gray-200'>
                  Share via device
                </span>
              </button>
            )}

            {/* Copy link */}
            <button
              onClick={copyToClipboard}
              className='w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mb-1'
            >
              <Copy className='h-5 w-5 mr-3 text-purple-600 dark:text-purple-400' />
              <span className='text-gray-800 dark:text-gray-200'>
                {copySuccess ? 'Copied!' : 'Copy link'}
              </span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={shareOnTwitter}
              className='w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mb-1'
            >
              <Twitter className='h-5 w-5 mr-3 text-purple-600 dark:text-purple-400' />
              <span className='text-gray-800 dark:text-gray-200'>
                Share on Twitter
              </span>
            </button>

            {/* Facebook */}
            <button
              onClick={shareOnFacebook}
              className='w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mb-1'
            >
              <Facebook className='h-5 w-5 mr-3 text-purple-600 dark:text-purple-400' />
              <span className='text-gray-800 dark:text-gray-200'>
                Share on Facebook
              </span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareOnLinkedIn}
              className='w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mb-1'
            >
              <Linkedin className='h-5 w-5 mr-3 text-purple-600 dark:text-purple-400' />
              <span className='text-gray-800 dark:text-gray-200'>
                Share on LinkedIn
              </span>
            </button>

            {/* Email */}
            <button
              onClick={shareByEmail}
              className='w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            >
              <Mail className='h-5 w-5 mr-3 text-purple-600 dark:text-purple-400' />
              <span className='text-gray-800 dark:text-gray-200'>
                Share via Email
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
