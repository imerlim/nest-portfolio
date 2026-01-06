import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Expenses from './pages/Transactions';
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Aqui você define o nome da rota e qual componente ela abre */}
                <Route path="/login" element={<Login onLoginSuccess={() => (window.location.href = '/expenses')} />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/expenses"
                    element={
                        <ProtectedRoute>
                            <Expenses />
                        </ProtectedRoute>
                    }
                />

                {/* Redireciona a raiz "/" para o login por padrão */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
