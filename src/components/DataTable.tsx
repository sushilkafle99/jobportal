import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950/40" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-850 text-left text-sm text-zinc-500">
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className={`px-6 py-4 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950/20">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-zinc-400 dark:text-zinc-500">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                {columns.map((col, colIdx) => {
                  const content =
                    typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode);
                  return (
                    <td key={colIdx} className={`whitespace-nowrap px-6 py-4 text-zinc-850 dark:text-zinc-300 ${col.className || ""}`}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
