import React, { useState, useMemo } from 'react';
import CustomInput from './CustomInput';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Pencil, Search } from 'lucide-react';

// Define the Types for our Props
interface TableHeader {
    label: string;
    key: string;
    keys?: string[];
    customRender?: string;
}

interface TableProps {
    headers: TableHeader[];
    items: any[];
    itemsPerPage?: number;
    showSearch?: boolean;
    showActions?: boolean;
    loading?: boolean;
    clickableRows?: boolean;
    actionType?: 'edit' | 'delete';
    onAction?: (item: any) => void;
    onRowClick?: (item: any) => void;
    renderCustomSlot?: (slotName: string, item: any) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({
    headers,
    items,
    itemsPerPage = 5,
    showSearch = false,
    showActions = false,
    loading = false,
    clickableRows = false,
    actionType = 'edit',
    onAction,
    onRowClick,
    renderCustomSlot,
}) => {
    // 1. State (Replaces Vue's data)
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // 2. Logic for Sorting (Replaces Vue's parseValue inside computed)
    const parseValue = (val: any) => {
        if (val === null || val === undefined) return null;
        if (typeof val !== 'string') return val;
        let str = val
            .trim()
            .replace(/^R\$\s?/, '')
            .replace(/\s/g, '');

        const numNormalized = str.replace(/\./g, '').replace(',', '.');
        if (!isNaN(Number(numNormalized)) && numNormalized !== '') return parseFloat(numNormalized);

        const dateObj = new Date(str);
        if (!isNaN(dateObj.getTime())) return dateObj;

        return str.toLowerCase();
    };

    // 3. Filtered and Sorted Items (Replaces Vue's computed)
    const filteredItems = useMemo(() => {
        if (!showSearch || !searchQuery) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            headers.some(column => {
                if (column.keys && Array.isArray(column.keys)) {
                    return column.keys.some(key => item[key]?.toString().toLowerCase().includes(query));
                }
                return item[column.key]?.toString().toLowerCase().includes(query);
            })
        );
    }, [items, searchQuery, headers, showSearch]);

    const sortedItems = useMemo(() => {
        if (!sortBy) return filteredItems;
        return [...filteredItems].sort((a, b) => {
            const valA = parseValue(a[sortBy]);
            const valB = parseValue(b[sortBy]);
            let comparison = 0;
            if (valA < valB) comparison = -1;
            if (valA > valB) comparison = 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filteredItems, sortBy, sortDirection]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * localItemsPerPage;
        return sortedItems.slice(start, start + localItemsPerPage);
    }, [sortedItems, currentPage, localItemsPerPage]);

    // 4. Pagination Helpers
    const totalPages = Math.ceil(sortedItems.length / localItemsPerPage);
    const startRecord = (currentPage - 1) * localItemsPerPage + 1;
    const endRecord = Math.min(currentPage * localItemsPerPage, sortedItems.length);

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDirection('asc');
        }
    };

    const getRowClass = (item: any) => {
        const base = clickableRows ? 'cursor-pointer ' : '';
        switch (item._RowVariant) {
            case 'green':
                return base + 'bg-green-50 hover:bg-green-100 dark:bg-green-800 dark:hover:bg-green-700';
            case 'red':
                return base + 'bg-red-50 hover:bg-red-100 dark:bg-red-800 dark:hover:bg-red-700';
            default:
                return base + 'hover:bg-slate-100 dark:hover:bg-slate-700';
        }
    };

    // 5. Shared Button Class (Replaces @apply in CSS)
    const btnClass =
        'w-8 h-8 flex items-center justify-center rounded-md border dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 transition';

    return (
        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md">
            {/* Search and Items per page */}
            {!loading && (
                <div className="grid md:grid-cols-6 mb-4 gap-4 items-end">
                    {showSearch && (
                        <div className="md:col-span-3">
                            <div className="relative">
                                <CustomInput
                                    value={searchQuery}
                                    onChange={val => {
                                        setSearchQuery(val.toString());
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search..."
                                    textSize="text-sm"
                                    // This shows the 'X' button only when there is text
                                    showClear={searchQuery.length > 0}
                                    onClear={() => {
                                        setSearchQuery('');
                                        setCurrentPage(1);
                                    }}
                                    // This puts the magnifying glass inside the input
                                    prepend={<Search size={18} className="text-slate-400" />}
                                />
                            </div>
                        </div>
                    )}
                    <div className="md:col-span-1 md:col-start-6">
                        <label className="block text-xs text-slate-900 dark:text-white mb-1">Items per page:</label>
                        <select
                            className="w-full p-2 rounded-md border border-slate-300 text-slate-900 dark:text-white dark:border-slate-600 dark:bg-slate-800"
                            value={localItemsPerPage}
                            onChange={e => {
                                setLocalItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[5, 10, 20, 50].map(n => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Table Core */}
            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
                <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-600">
                        <tr>
                            {headers.map((column, idx) => (
                                <th
                                    key={idx}
                                    onClick={() => handleSort(column.key)}
                                    className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        {column.label}
                                        {sortBy === column.key && <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </th>
                            ))}
                            {showActions && <th className="px-4 py-3 text-right text-slate-900 dark:text-white"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                        {paginatedItems.map((item, idx) => (
                            <tr key={idx} className={getRowClass(item)} onClick={() => onRowClick?.(item)}>
                                {headers.map((column, colIdx) => (
                                    <td key={colIdx} className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {column.customRender && renderCustomSlot
                                            ? renderCustomSlot(column.customRender, item)
                                            : column.keys
                                            ? column.keys.map((subKey, sIdx) => (
                                                  <div key={sIdx} className={sIdx === 0 ? 'font-semibold' : 'text-xs text-slate-400'}>
                                                      {item[subKey]}
                                                  </div>
                                              ))
                                            : item[column.key]}
                                    </td>
                                ))}
                                {showActions && (
                                    <td className="px-4 py-4 text-right">
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                onAction?.(item);
                                            }}
                                            className={
                                                actionType === 'delete'
                                                    ? 'text-red-500 hover:text-red-700'
                                                    : 'text-sky-500 hover:text-sky-700'
                                            }
                                        >
                                            {actionType === 'delete' ? <Trash2 className="size-5" /> : <Pencil className="size-5" />}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {!loading && sortedItems.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-slate-400">
                    <div>
                        Showing {startRecord} - {endRecord} of {sortedItems.length}
                    </div>
                    <div className="flex space-x-1">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className={btnClass}>
                            <ChevronsLeft className="size-4" />
                        </button>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className={btnClass}>
                            <ChevronLeft className="size-4" />
                        </button>
                        <span className="px-4 py-1 bg-slate-200 dark:bg-slate-600 rounded text-slate-900 dark:text-white">
                            {currentPage}
                        </span>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className={btnClass}>
                            <ChevronRight className="size-4" />
                        </button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className={btnClass}>
                            <ChevronsRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
