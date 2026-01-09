import React, { useMemo } from 'react';

interface CustomCheckboxProps {
    modelValue: any;
    id: string;
    type?: 'checkbox' | 'radio';
    name?: string;
    label: string;
    description?: string;
    tooltip?: string;
    value?: any;
    uncheckedValue?: any;
    disabled?: boolean;
    onChange: (value: any) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    modelValue,
    id,
    type = 'checkbox',
    name,
    label,
    description,
    tooltip,
    value = true,
    uncheckedValue = false,
    disabled = false,
    onChange,
}) => {
    // Lógica para verificar se está marcado (baseado no seu código Vue)
    const isChecked = useMemo(() => {
        if (typeof value === 'boolean') {
            return modelValue === value;
        }
        return String(modelValue) === String(value);
    }, [modelValue, value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;

        // Se for radio, emite o valor. Se for checkbox, alterna entre value e uncheckedValue
        const out = type === 'radio' ? value : checked ? value : uncheckedValue;
        onChange(out);
    };

    return (
        <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center h-5 relative group">
                <input
                    id={id}
                    name={name}
                    type={type}
                    checked={isChecked}
                    title={tooltip}
                    disabled={disabled}
                    onChange={handleChange}
                    className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 
                   dark:bg-gray-800 dark:border-gray-600 dark:checked:bg-indigo-600 dark:checked:border-indigo-600
                   disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>

            <div className="text-sm leading-6">
                <label htmlFor={id} className="font-medium text-gray-900 dark:text-white cursor-pointer">
                    {label}
                </label>
                {description && <p className="text-gray-500 dark:text-gray-400">{description}</p>}
            </div>
        </div>
    );
};

export default CustomCheckbox;
