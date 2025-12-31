import { useState, useEffect, useMemo } from 'react';
import api from '../services/api.ts';
import Table from '../components/Table';

export interface Expense {
    id?: number;
    description: string;
    amount: number;
    category?: string;
    createdAt?: string;
}

export default function Expenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Calculate Total Balance automatically
    const totalBalance = useMemo(() => {
        return expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    }, [expenses]);

    // 2. Fetch and Fill logic
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get('/expenses');
                const data = Array.isArray(response.data) ? response.data : [];

                // Fill up to 50 lines with empty objects if data is short
                const filledData = [...data];
                while (filledData.length < 50) {
                    filledData.push({ description: '', amount: 0 });
                }

                setExpenses(filledData);
            } catch (error) {
                console.error('Error fetching:', error);
                // Even on error, show 50 empty lines
                setExpenses(
                    Array(50)
                        .fill(null)
                        .map(() => ({ description: '', amount: 0 }))
                );
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    // 3. Handle changes in the "Grid"
    const handleCellChange = (index: number, field: keyof Expense, value: string | number) => {
        const updated = [...expenses];
        updated[index] = { ...updated[index], [field]: value };
        setExpenses(updated);
    };

    // 4. Save logic (Triggers when user clicks outside the input)
    const handleSave = async (index: number) => {
        const item = expenses[index];
        if (!item.description && !item.amount) return; // Don't save empty rows

        try {
            if (item.id) {
                await api.put(`/expenses/${item.id}`, item);
            } else {
                const response = await api.post('/expenses', item);
                const updated = [...expenses];
                updated[index] = response.data;
                setExpenses(updated);
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const tableHeaders = [
        {
            label: 'Description',
            key: 'description',
            render: (item: Expense, index: number) => (
                <input
                    className="w-full bg-transparent border-none focus:ring-1 focus:ring-emerald-500 rounded p-1 text-slate-900"
                    value={item.description}
                    placeholder="Type description..."
                    onChange={e => handleCellChange(index, 'description', e.target.value)}
                    onBlur={() => handleSave(index)}
                />
            ),
        },
        {
            label: 'Value',
            key: 'amount',
            render: (item: Expense, index: number) => (
                <input
                    type="number"
                    className="w-full bg-transparent border-none focus:ring-1 focus:ring-emerald-500 rounded p-1 text-slate-900"
                    value={item.amount === 0 ? '' : item.amount}
                    placeholder="0.00"
                    onChange={e => handleCellChange(index, 'amount', Number(e.target.value))}
                    onBlur={() => handleSave(index)}
                />
            ),
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-900">
            <nav className="flex justify-between items-center px-10 py-4 bg-slate-950 text-white shadow-lg">
                <h1 className="text-xl font-bold tracking-tight">Nest Portfolio</h1>
                <div className="flex items-center gap-6">
                    {/* Total Display */}
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase font-bold">Total Balance</p>
                        <p className={`text-xl font-mono ${totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            $ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-bold transition-all shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-7xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-100">Financial Worksheet</h2>
                    <p className="text-slate-400">Directly edit rows to save data</p>
                </header>

                <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                    <Table
                        headers={tableHeaders}
                        items={expenses}
                        loading={loading}
                        showSearch={false}
                        showActions={true}
                        actionType="delete"
                        onAction={item => console.log('Apagar:', item.id)}
                    />
                </div>
            </main>
        </div>
    );
}
