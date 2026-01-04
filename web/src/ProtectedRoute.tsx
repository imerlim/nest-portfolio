import React from 'react'; // 👈 Adicione isso
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// ADICIONE ESTA LINHA NO FINAL PARA RESOLVER O ERRO:
export default ProtectedRoute;
