import React from 'react';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  isLoading,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full space-y-3 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-white/5 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        {emptyState || <p>No records found.</p>}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3.5 px-4 ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                } ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, idx) => (
            <tr
              key={keyExtractor(row, idx)}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-white/[0.04]' : 'hover:bg-white/[0.02]'
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.render ? col.render(row, idx) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
