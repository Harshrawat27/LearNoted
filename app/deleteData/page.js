'use client';
import { useState } from 'react';

export default function DeleteDataPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/deleteHighlights', {
        method: 'DELETE',
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to delete data', error);
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Delete Highlights Data</h1>
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? 'Deleting...' : 'Delete All Data'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
