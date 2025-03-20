'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'confirm';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
  duration?: number;
}

export function Toast({
  id,
  message,
  type,
  onConfirm,
  onCancel,
  duration = 3000,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-dismiss for success/error toasts after duration
  useEffect(() => {
    if (type !== 'confirm' && visible) {
      // Start progress countdown
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 100 / (duration / 100);
        });
      }, 100);

      // Set timeout to hide
      const timeout = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [type, duration, visible]);

  // Handle confirmation
  const handleConfirm = async () => {
    if (onConfirm) {
      setIsProcessing(true);
      try {
        await onConfirm();
      } finally {
        setIsProcessing(false);
        setVisible(false);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setVisible(false);
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case 'error':
        return <AlertTriangle className='h-5 w-5 text-red-500' />;
      case 'confirm':
        return <Trash2 className='h-5 w-5 text-red-500' />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      case 'confirm':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div
      className={`min-w-[300px] max-w-md p-4 rounded-lg shadow-md border ${getBackgroundColor()} relative overflow-hidden`}
      role='alert'
    >
      <div className='flex items-start'>
        <div className='flex-shrink-0 mr-3'>{getIcon()}</div>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>
            {message}
          </p>

          {type === 'confirm' && (
            <div className='mt-3 flex space-x-2'>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className='px-3 py-1 text-xs font-medium rounded bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50'
              >
                {isProcessing ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className='px-3 py-1 text-xs font-medium rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {type !== 'confirm' && (
          <button
            onClick={handleCancel}
            className='ml-4 text-gray-400 hover:text-gray-500 focus:outline-none'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {type !== 'confirm' && (
        <div className='absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full'>
          <div
            className={`h-full ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
          ></div>
        </div>
      )}
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastProps[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col space-y-2'>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onCancel={() => {
            if (toast.onCancel) toast.onCancel();
            removeToast(toast.id);
          }}
        />
      ))}
    </div>
  );
}
