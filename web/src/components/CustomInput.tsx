import React, { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { Trash2, X, Search, Plus } from 'lucide-react';

interface CustomInputProps {
    value: string | number;
    onChange: (value: string | number) => void;
    label?: string;
    id?: string;
    name?: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    maxlength?: number;
    prepend?: ReactNode;
    append?: ReactNode;

    // Action Buttons
    showSearch?: boolean;
    showClear?: boolean;
    showTrash?: boolean;
    showAdd?: boolean;

    // Callbacks
    onSearch?: () => void;
    onClear?: () => void;
    onTrash?: () => void;
    onAdd?: () => void;

    // Validation & Styling
    error?: boolean;
    errorMessage?: string;
    largeAppend?: boolean;
    textSize?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
    formatCurrency?: boolean;
    autofocus?: boolean;
}

const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const {
        value,
        onChange,
        label,
        id,
        name,
        type = 'text',
        placeholder,
        disabled,
        required,
        maxlength,
        prepend,
        append,
        showSearch,
        showClear,
        showTrash,
        showAdd,
        onSearch,
        onClear,
        onTrash,
        onAdd,
        error,
        errorMessage,
        largeAppend,
        textSize = 'text-base',
        formatCurrency,
        autofocus,
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    // Expose the focus method to parents (Equivalent to defineExpose in Vue)
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
    }));

    // Logic to handle currency formatting (Equivalent to updateValue in Vue)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;

        if (formatCurrency) {
            // 1. Replace comma with dot (handle BR decimals)
            rawValue = rawValue.replace(',', '.');

            // 2. Remove multiple dots (thousands separators)
            const parts = rawValue.split('.');
            if (parts.length > 2) {
                const decimal = parts.pop();
                rawValue = parts.join('') + '.' + decimal;
            }

            const numericValue = parseFloat(rawValue) || 0;
            onChange(numericValue);
        } else {
            onChange(rawValue);
        }
    };

    // Helper for displaying currency
    const displayValue = (val: any) => {
        if (formatCurrency) {
            if (val === null || val === undefined || isNaN(val)) return '';
            return Number(val).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
        return val;
    };

    const hasButtons = showSearch || showClear || showTrash || showAdd;

    // Dynamic Size Classes
    const buttonPadding = {
        'text-xs': 'p-1.5',
        'text-sm': 'p-2',
        'text-base': 'p-2.5',
        'text-lg': 'p-3',
        'text-xl': 'p-3.5',
    }[textSize];

    const iconSize = textSize === 'text-xs' || textSize === 'text-sm' ? 18 : 22;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className={`block mb-1 font-medium text-slate-900 dark:text-white ${textSize}`}>
                    {label}
                </label>
            )}

            <div className={`flex items-center w-full ${hasButtons ? 'gap-2' : ''}`}>
                <div className="flex-grow min-w-0">
                    <div
                        className={`
            flex items-center w-full overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-700 border transition-all
            ${largeAppend ? 'px-0' : 'px-2'}
            ${
                error
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-slate-300 dark:border-slate-600 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500'
            }
          `}
                    >
                        {/* Prepend Slot */}
                        {prepend && (
                            <div className={`flex items-center gap-1 select-none text-slate-500 dark:text-slate-400 ${textSize}`}>
                                {prepend}
                            </div>
                        )}

                        <input
                            ref={inputRef}
                            id={id}
                            name={name}
                            type={type}
                            autoFocus={autofocus}
                            placeholder={placeholder}
                            disabled={disabled}
                            required={required}
                            maxLength={maxlength}
                            value={displayValue(value)}
                            onChange={handleChange}
                            className={`
                w-full p-2 text-slate-900 bg-transparent dark:text-white placeholder-slate-400 
                focus:outline-none border-none ${textSize}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
                        />

                        {/* Append Slot */}
                        {append && (
                            <div
                                className={`
                flex items-center justify-end gap-1 text-slate-500 dark:text-slate-400
                ${textSize} ${largeAppend ? 'w-60' : 'w-auto px-2'}
              `}
                            >
                                {append}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {hasButtons && (
                    <div className="flex-shrink-0 flex items-center gap-2">
                        {showTrash && (
                            <button
                                type="button"
                                onClick={onTrash}
                                className={`rounded-md bg-red-600 text-white hover:bg-red-500 transition ${buttonPadding}`}
                            >
                                <Trash2 size={iconSize} />
                            </button>
                        )}
                        {showClear && (
                            <button
                                type="button"
                                onClick={onClear}
                                className={`rounded-md bg-slate-600 text-white hover:bg-slate-500 transition ${buttonPadding}`}
                            >
                                <X size={iconSize} />
                            </button>
                        )}
                        {showSearch && (
                            <button
                                type="button"
                                onClick={onSearch}
                                className={`rounded-md bg-blue-600 text-white hover:bg-blue-500 transition ${buttonPadding}`}
                            >
                                <Search size={iconSize} />
                            </button>
                        )}
                        {showAdd && (
                            <button
                                type="button"
                                onClick={onAdd}
                                className={`rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition ${buttonPadding}`}
                            >
                                <Plus size={iconSize} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {error && errorMessage && <p className={`mt-1 text-red-600 ${textSize}`}>{errorMessage}</p>}
        </div>
    );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;
