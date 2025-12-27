import { useState, useEffect } from 'react';
import api from '../services/api.ts';
import Table from '../components/Table';

const tableHeaders = [
    { label: 'Description', key: 'description' },
    { label: 'Category', key: 'category' },
    { label: 'Value', key: 'amount' },
    { label: 'Date', key: 'createdAt' },
];

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get('/expenses');
                setExpenses(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Erro ao buscar:', error);
                setExpenses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Navbar Recuperada */}
            <nav className="flex justify-between items-center px-10 py-4 bg-slate-950 text-white shadow-lg">
                <h1 className="text-xl font-bold tracking-tight">Nest Portfolio</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-bold transition-all shadow-sm"
                >
                    Logout
                </button>
            </nav>

            <main className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-100">Expenses</h2>
                        <p className="text-slate-100">Manage your financial records</p>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-all font-semibold flex items-center gap-2">
                        <span>+</span> Add Expense
                    </button>
                </div>

                {/* Tabela com proteção */}
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                    <Table
                        headers={tableHeaders}
                        items={expenses}
                        loading={loading}
                        showSearch={true}
                        showActions={true}
                        actionType="delete"
                        onAction={item => console.log('Apagar:', item.id)}
                    />
                </div>
            </main>
        </div>
    );
}
