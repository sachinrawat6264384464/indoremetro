import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition w-full my-4 space-y-4">
      <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 border border-amber-200 shadow-inner">
        {icon || (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>

      <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm max-w-md leading-relaxed font-medium">{description}</p>

      {actionLabel && (
        <div className="pt-2">
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 text-sm"
            >
              {actionLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 text-sm"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
