import React, { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { Trash2, X, Search, Plus } from 'lucide-react';

interface CustomInputProps {
    value: string | number;
    onChange: (value: string | number) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

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

    showSearch?: boolean;
    showClear?: boolean;
    showTrash?: boolean;
    showAdd?: boolean;

    onSearch?: () => void;
    onClear?: () => void;
    onTrash?: () => void;
    onAdd?: () => void;

    error?: boolean;
    errorMessage?: string;
    largeAppend?: boolean;

    textSize?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
    formatCurrency?: boolean;
    autofocus?: boolean;

    className?: string; // ✅ wrapper
    inputClassName?: string; // ✅ input
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
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
        onBlur,
        onFocus,
        onKeyDown,
        className = '',
        inputClassName = '',
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // --- Currency Formatting Logic ---
    const formatarMoeda = (valor: string | number) => {
        if (valor === null || valor === undefined || valor === '') return '$0.00';

        let numericValue: number;
        if (typeof valor === 'number') {
            numericValue = Math.round(valor * 100);
        } else {
            const cleanString = String(valor).replace(/\D/g, '');
            numericValue = parseInt(cleanString, 10);
        }

        if (isNaN(numericValue) || numericValue === 0) return '$0.00';

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue / 100);
    };

    // --- Event Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        if (formatCurrency) {
            // Remove everything except numbers to get the "cents"
            const cleanString = rawValue.replace(/\D/g, '');
            if (cleanString === '') {
                onChange(0);
                return;
            }
            // Convert to decimal (e.g., "1250" becomes 12.50)
            const numericValue = parseInt(cleanString, 10) / 100;
            onChange(numericValue);
        } else {
            onChange(rawValue);
        }
    };

    const hasButtons = showSearch || showClear || showTrash || showAdd;

    const buttonPadding = {
        'text-xs': 'p-1.5',
        'text-sm': 'p-2',
        'text-base': 'p-2.5',
        'text-lg': 'p-3',
        'text-xl': 'p-3.5',
    }[textSize];

    const iconSize = textSize === 'text-xs' || textSize === 'text-sm' ? 18 : 22;

    // Decide what to show in the input box
    const displayValue = formatCurrency ? formatarMoeda(value) : value ?? '';

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className={`block mb-1 font-medium ${textSize}`}>
                    {label}
                </label>
            )}

            <div className={`flex items-center w-full ${hasButtons ? 'gap-2' : ''}`}>
                <div className="grow min-w-0">
                    <div
                        className={`
                            flex items-center w-full rounded-lg bg-slate-50 dark:bg-slate-700
                            ${largeAppend ? 'px-0' : 'px-2'}
                            ${
                                error
                                    ? 'border-red-500 ring-1 ring-red-500'
                                    : 'border-slate-300 focus-within:ring-1 focus-within:ring-blue-500'
                            }
                        `}
                    >
                        {prepend && <div className="mr-1">{prepend}</div>}

                        <input
                            ref={inputRef}
                            id={id}
                            name={name}
                            type={formatCurrency ? 'text' : type} // Force text mode for currency masking
                            autoFocus={autofocus}
                            placeholder={placeholder}
                            disabled={disabled}
                            required={required}
                            maxLength={maxlength}
                            value={displayValue}
                            onChange={handleInputChange}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            onKeyDown={onKeyDown}
                            className={`
                                w-full p-2 bg-transparent outline-none
                                ${textSize}
                                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                ${inputClassName}
                            `}
                        />

                        {append && <div className={`${largeAppend ? 'w-60' : 'px-2'}`}>{append}</div>}
                    </div>
                </div>

                {hasButtons && (
                    <div className="flex items-center gap-2">
                        {showTrash && (
                            <button onClick={onTrash} className={`bg-red-600 text-white rounded ${buttonPadding}`}>
                                <Trash2 size={iconSize} />
                            </button>
                        )}
                        {showClear && (
                            <button onClick={onClear} className={`bg-slate-600 text-white rounded ${buttonPadding}`}>
                                <X size={iconSize} />
                            </button>
                        )}
                        {showSearch && (
                            <button onClick={onSearch} className={`bg-blue-600 text-white rounded ${buttonPadding}`}>
                                <Search size={iconSize} />
                            </button>
                        )}
                        {showAdd && (
                            <button onClick={onAdd} className={`bg-emerald-600 text-white rounded ${buttonPadding}`}>
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
