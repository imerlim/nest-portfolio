import React, { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { Trash2, X, Search, Plus } from 'lucide-react';

interface CustomInputProps {
    value: string | number;
    onChange: (value: string | number) => void;
    onBlur?: () => void;
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
        onBlur,
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    // --- CURRENCY LOGIC ---

    const formatarMoeda = (valor: string | number) => {
        // Safety: ensure we never process null/undefined
        if (valor === null || valor === undefined) return '0,00';

        let numericValue: number;
        if (typeof valor === 'number') {
            // Convert decimal (5.5) to cents (550) for integer math
            numericValue = Math.round(valor * 100);
        } else {
            // String cleaning: "R$ 1.234,56" -> "123456"
            const cleanString = valor.replace(/\D/g, '');
            numericValue = parseInt(cleanString, 10);
        }

        if (isNaN(numericValue) || numericValue === 0) return '0,00';

        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue / 100);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formatCurrency) {
            const onlyNumbers = e.target.value.replace(/\D/g, '');
            // Convert typing to decimal (e.g. "150" -> 1.5)
            const numericValue = onlyNumbers ? parseInt(onlyNumbers, 10) / 100 : 0;
            onChange(numericValue);
        } else {
            onChange(e.target.value);
        }
    };

    const handleBlur = () => {
        if (onBlur) onBlur();
    };

    // Use empty string fallback to prevent "Controlled to Uncontrolled" error
    const displayValue = formatCurrency ? formatarMoeda(value) : value ?? '';

    // --- COMPONENT LOGIC ---

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
    }));

    const hasButtons = showSearch || showClear || showTrash || showAdd;

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
                            // CRITICAL FIX: The "?? ''" ensures the input is always controlled
                            value={displayValue ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // Helpful: auto-select text when clicking into the field
                            onFocus={e => e.target.select()}
                            className={`
                                w-full p-2 text-slate-900 bg-transparent dark:text-white placeholder-slate-400 
                                focus:outline-none border-none ${textSize}
                                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        />

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
