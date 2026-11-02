'use client';

export default function Toast({ message, type = 'success', isVisible }) {
  if (!isVisible) return null;

  return (
    <div className={`toast-msg show toast-${type}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={type === 'error' ? '#ef4444' : '#10b981'} strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>{message}</span>
    </div>
  );
}
