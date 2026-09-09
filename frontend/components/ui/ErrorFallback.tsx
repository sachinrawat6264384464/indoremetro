import React from 'react';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  title = 'Something went wrong',
  message = 'We encountered an issue loading this information. Please check your connection and try again.',
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-rose-950/20 border border-rose-900/40 rounded-2xl max-w-lg mx-auto my-8">
      <div className="p-4 bg-rose-900/30 rounded-full text-rose-400 mb-4 border border-rose-500/20">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-rose-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-md leading-relaxed">{message}</p>

      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-md"
          >
            Try Again
          </button>
        )}
        <a
          href="/"
          className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
