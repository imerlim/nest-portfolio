import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Calendar } from 'lucide-react'; //
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR);

interface CustomDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    id: string;
    label: string;
    placeholder?: string;
    description?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selected, onChange, id, label, placeholder = 'Select date', description }) => {
    return (
        <div className="flex flex-col gap-1.5 mb-4">
            <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>

            {/* Wrapping container to apply Tailwind to internal DatePicker classes */}
            <div
                className="relative group 
        [&_.react-datepicker]:border-gray-300 [&_.react-datepicker]:font-sans
        [&_.react-datepicker__header]:bg-white [&_.react-datepicker__header]:border-b-gray-200
        [&_.react-datepicker__day--selected]:bg-indigo-600 [&_.react-datepicker__day--selected]:text-white
        [&_.react-datepicker__day:hover]:bg-indigo-100
        
        /* Dark Mode targeting via class-based arbitrary variants */
        dark:[&_.react-datepicker]:bg-gray-800 dark:[&_.react-datepicker]:border-gray-700
        dark:[&_.react-datepicker__header]:bg-gray-900 dark:[&_.react-datepicker__header]:border-gray-700
        dark:[&_.react-datepicker__current-month]:text-white dark:[&_.react-datepicker__day-name]:text-gray-400
        dark:[&_.react-datepicker__day]:text-gray-200 dark:[&_.react-datepicker__day:hover]:bg-gray-700
      "
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Calendar className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
                </div>

                <DatePicker
                    id={id}
                    selected={selected}
                    onChange={onChange}
                    locale="pt-BR"
                    dateFormat="dd/MM/yyyy"
                    placeholderText={placeholder}
                    autoComplete="off"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
                     bg-white text-gray-900 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                     sm:text-sm transition-all
                     dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
            </div>

            {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
    );
};

export default CustomDatePicker;
