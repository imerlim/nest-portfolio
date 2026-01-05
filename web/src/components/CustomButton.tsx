import React from 'react';

// Estendemos os atributos nativos do botão para aceitar onClick, type, etc.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
    children,
    disabled = false,
    className = '', // Permite passar classes extras de fora
    ...props
}) => {
    // Lógica de classes idêntica ao seu código Vue
    const baseClasses =
        'rounded-md px-3 py-2 text-base font-semibold bg-sky-800 text-white shadow-sm hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 inline-flex transition-all items-center justify-center';

    const disabledClasses = disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer';

    return (
        <button
            type="button"
            disabled={disabled}
            className={`${baseClasses} ${disabledClasses} ${className}`}
            {...props} // Repassa todos os atributos como onClick, title, etc.
        >
            {children}
        </button>
    );
};

export default CustomButton;
