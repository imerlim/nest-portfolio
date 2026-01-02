import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../services/api.ts';
import Table from '../components/Table';
import CustomInput from '../components/CustomInput.tsx';

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
    const originalValue = useRef<number | string>(0);

    const handleFocus = (val: number | string) => {
        originalValue.current = val;
    };

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
    const handleCellChange = (index: number, field: string, value: any) => {
        // Use 'expenses' instead of 'items' to match your actual state variable!
        const newData = [...expenses];
        newData[index] = { ...newData[index], [field]: value };
        setExpenses(newData);
    };

    // 4. Save logic (Triggers when user clicks outside the input)
    const handleSave = async (index: number) => {
        const currentValue = expenses[index].amount;
        if (currentValue === originalValue.current) {
            console.log('Nothing changed. Axios call canceled.');
            return;
        }
        const item = expenses[index];
        return console.log('ola2', item);
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
                <CustomInput
                    value={item.description}
                    onFocus={() => handleFocus(item.description)}
                    onChange={val => handleCellChange(index, 'description', val.toString())}
                    onBlur={() => handleSave(index)}
                    textSize="text-sm"
                    placeholder="Description..."
                />
            ),
        },
        {
            label: 'Value',
            key: 'amount',
            render: (item: Expense, index: number) => (
                <CustomInput
                    value={item.amount} // Ensure 'item' is defined in your render function
                    onFocus={() => handleFocus(item.amount)}
                    onChange={val => handleCellChange(index, 'amount', val)}
                    onBlur={() => handleSave(index)}
                    formatCurrency={true}
                    prepend="$"
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
