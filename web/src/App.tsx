import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';

// Componente simples de Dashboard para teste
const Dashboard = () => (
  <div style={{ padding: '20px' }}>
    <h1>Painel do Portfólio</h1>
    <p>Você está logado!</p>
    <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
      Sair
    </button>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Aqui você define o nome da rota e qual componente ela abre */}
        <Route path="/login" element={<Login onLoginSuccess={() => window.location.href = '/dashboard'} />} />

        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redireciona a raiz "/" para o login por padrão */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;