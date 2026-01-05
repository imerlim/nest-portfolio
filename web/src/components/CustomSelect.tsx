import React, { forwardRef, useImperativeHandle, useRef, useMemo, type ReactNode } from 'react';
import { Trash2, Delete, Search, Plus } from 'lucide-react'; // Usando Delete/Backspace para o Clear

// Definindo o formato das opções
export interface SelectOption {
    label: string;
    value: string | number;
}

interface CustomSelectProps {
    value?: string | number | null;
    onChange: (value: string | number) => void;

    // Dados
    options: SelectOption[];
    label?: string;
    id?: string;
    name?: string;
    placeholder?: string;

    // Estados
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    errorMessage?: string;

    // Slots visuais
    prepend?: ReactNode;
    append?: ReactNode;

    // Botões de Ação
    showTrash?: boolean;
    showClear?: boolean;
    showSearch?: boolean;
    showAdd?: boolean;

    // Callbacks dos botões
    onTrash?: () => void;
    onClear?: () => void;
    onSearch?: () => void;
    onAdd?: () => void;

    // Estilo
    textSize?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
}

// Interface para expor métodos (como o focus)
export interface CustomSelectHandle {
    focus: () => void;
}

const CustomSelect = forwardRef<CustomSelectHandle, CustomSelectProps>((props, ref) => {
    const {
        value,
        onChange,
        options,
        label,
        id,
        name,
        placeholder,
        disabled,
        required,
        error,
        errorMessage,
        prepend,
        append,
        showTrash,
        showClear,
        showSearch,
        showAdd,
        onTrash,
        onClear,
        onSearch,
        onAdd,
        textSize = 'text-base',
    } = props;

    const selectRef = useRef<HTMLSelectElement>(null);

    // 🔹 Expõe o método 'focus' para o componente pai (igual ao defineExpose do Vue)
    useImperativeHandle(ref, () => ({
        focus: () => {
            selectRef.current?.focus();
        },
    }));

    // Lógica de tamanho dos botões (Computed do Vue)
    const buttonSizeClass = useMemo(() => {
        switch (textSize) {
            case 'text-xs':
                return 'p-1.5';
            case 'text-sm':
                return 'p-2';
            case 'text-base':
                return 'p-2.5';
            case 'text-lg':
                return 'p-3';
            case 'text-xl':
                return 'p-3.5';
            default:
                return 'p-2.5';
        }
    }, [textSize]);

    // Lógica de tamanho dos ícones (Computed do Vue)
    const iconSize = useMemo(() => {
        switch (textSize) {
            case 'text-xs':
            case 'text-sm':
                return 20; // size-5 equivalent
            default:
                return 24; // size-6 equivalent
        }
    }, [textSize]);

    // Handler de mudança
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    // Estilos do Tooltip (Convertido do CSS scoped do Vue para Tailwind classes)
    const tooltipClasses =
        'absolute z-10 -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100';

    return (
        <div className="sm:col-span-2 w-full">
            {label && (
                <label htmlFor={id} className={`block mb-1 font-medium text-slate-900 dark:text-white ${textSize}`}>
                    {label}
                </label>
            )}

            {/* Linha principal: select + botões */}
            <div className={`flex items-center w-full ${showTrash || showClear || showSearch || showAdd ? 'gap-2' : ''}`}>
                {/* Wrapper do SELECT */}
                <div className="flex-grow min-w-0">
                    <div
                        className={`
                            flex items-center w-full overflow-hidden rounded-lg px-2 bg-slate-50 dark:bg-slate-700 transition-all
                            ${
                                error
                                    ? 'border border-red-500 focus-within:ring-red-500'
                                    : 'border border-slate-300 dark:border-slate-600 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500'
                            }
                        `}
                    >
                        {/* Prepend */}
                        {prepend && <div className={`flex items-center text-slate-700 dark:text-slate-300 ${textSize}`}>{prepend}</div>}

                        {/* SELECT */}
                        <select
                            ref={selectRef}
                            id={id}
                            name={name}
                            disabled={disabled}
                            required={required}
                            value={value || ''}
                            onChange={handleChange}
                            className={`
                                w-full p-2 text-slate-900 bg-slate-50 dark:bg-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 
                                focus:outline-none border-none
                                ${textSize}
                                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <option value="" disabled>
                                {placeholder || 'Select'}
                            </option>
                            {options.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Append */}
                        {append && <div className={`flex items-center text-slate-700 dark:text-slate-300 ${textSize}`}>{append}</div>}
                    </div>
                </div>

                {/* Botões Laterais */}
                {(showTrash || showClear || showSearch || showAdd) && (
                    <div className="flex-shrink-0 flex items-center gap-2">
                        {/* Trash */}
                        {showTrash && (
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={onTrash}
                                    className={`rounded-md bg-red-600 text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-600 ${buttonSizeClass}`}
                                >
                                    <Trash2 size={iconSize} />
                                </button>
                                <span className={tooltipClasses}>Deletar</span>
                            </div>
                        )}

                        {/* Clear (Backspace) */}
                        {showClear && (
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={onClear}
                                    className={`rounded-md bg-sky-800 text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-sky-600 ${buttonSizeClass}`}
                                >
                                    {/* Usando Delete do Lucide para simular o Backspace */}
                                    <Delete size={iconSize} />
                                </button>
                                <span className={tooltipClasses}>Limpar</span>
                            </div>
                        )}

                        {/* Search */}
                        {showSearch && (
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={onSearch}
                                    className={`rounded-md bg-sky-800 text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-sky-600 ${buttonSizeClass}`}
                                >
                                    <Search size={iconSize} />
                                </button>
                                <span className={tooltipClasses}>Buscar</span>
                            </div>
                        )}

                        {/* Add */}
                        {showAdd && (
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={onAdd}
                                    className={`rounded-md bg-sky-800 text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-sky-600 ${buttonSizeClass}`}
                                >
                                    <Plus size={iconSize} />
                                </button>
                                <span className={tooltipClasses}>Adicionar</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && errorMessage && <p className={`mt-1 text-red-600 ${textSize}`}>{errorMessage}</p>}
        </div>
    );
});

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
