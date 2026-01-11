import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    id: string;
    label: string;
    placeholder?: string;
    description?: string;
    showMonthPicker?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    selected,
    onChange,
    id,
    label,
    placeholder = 'Select month/year',
    description,
    showMonthPicker = true,
}) => {
    return (
        <div className="flex flex-col gap-1.5 mb-4 w-fit">
            <label htmlFor={id} className="text-sm font-medium text-slate-900 dark:text-white">
                {label}
            </label>

            <div className="relative group [&_.react-datepicker-wrapper]:w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Calendar className="h-4 w-4 text-slate-400 group-focus-within:text-sky-500" />
                </div>

                <DatePicker
                    id={id}
                    selected={selected}
                    onChange={onChange}
                    // 🇺🇸 Year-first format (YYYY/MM)
                    dateFormat="yyyy/MM"
                    showMonthYearPicker={showMonthPicker}
                    showFullMonthYearPicker
                    placeholderText={placeholder}
                    autoComplete="off"
                    className="cursor-pointer block w-64 pl-10 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-base transition-all bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />
            </div>

            {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
    );
};

export default CustomDatePicker;
