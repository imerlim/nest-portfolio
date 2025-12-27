import { useState } from 'react';
import api from '../services/api.ts';

interface LoginProps {
    onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    // No Vue 3 seria: const email = ref('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Impede o refresh da página (comum em SPAs)
        setLoading(true);

        try {
            // O equivalente ao router.post('/login') do Inertia
            // Mas aqui apontamos para a URL absoluta do seu NestJS
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            // SUCESSO: O NestJS devolveu o access_token
            const token = response.data.access_token;

            // Guardamos o "crachá" no navegador para não deslogar no F5
            localStorage.setItem('token', token);

            // Avisamos o componente pai (App.tsx) que deu tudo certo
            onLoginSuccess();
        } catch (error) {
            alert('Erro ao entrar! Verifique seu e-mail e senha.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2>Login Administrativo</h2>
                <p>Use os dados do PostgreSQL</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="email"
                        placeholder="E-mail (ex: admin@teste.com)"
                        value={email}
                        onChange={e => setEmail(e.target.value)} // No Vue seria v-model
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Estilos rápidos para não ficar feio (como se fosse o CSS do Vue)
const styles = {
    wrapper: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
    card: {
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center' as const,
    },
    form: { display: 'flex', flexDirection: 'column' as const, gap: '1rem', width: '300px' },
    input: { padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '0.8rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    buttonDisabled: {
        padding: '0.8rem',
        backgroundColor: '#ccc',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
    },
};
