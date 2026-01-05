import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../services/api.ts';
import Table from '../components/Table';
import CustomInput from '../components/CustomInput.tsx';
import CustomButton from '../components/CustomButton.tsx';

export interface Expense {
    id?: number;
    description: string;
    amount: number;
    category?: string;
    createdAt?: string;
}

export default function Expenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [addNumberLines, setAddNumberLines] = useState<number>(1);
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
        const item = expenses[index];
        if (item.amount === originalValue.current) return;

        try {
            if (item.id) {
                await api.patch(`/expenses/${item.id}`, item);
            } else {
                const response = await api.post('/expenses', item);
                const savedItem = response.data;

                // ATUALIZAÇÃO SUTIL:
                setExpenses(prev => {
                    const newArr = [...prev];
                    newArr[index] = { ...newArr[index], id: savedItem.id }; // Mantém o que o usuário digitou, só injeta o ID
                    return newArr;
                });
            }
            originalValue.current = item.amount;
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const handleDelete = async (item: Expense) => {
        // 2. Se o item não tem ID, ele só existe na tela, basta limpar localmente
        if (!item.id) {
            const index = expenses.findIndex(e => e === item);
            const updated = [...expenses];
            updated[index] = { description: '', amount: 0 };
            setExpenses(updated);
            return;
        }

        try {
            // 3. Chamada ao Backend
            await api.delete(`/expenses/${item.id}`);

            // 4. Atualiza o estado: limpa os dados mantendo a linha na planilha
            setExpenses(prev => prev.map(exp => (exp.id === item.id ? { description: '', amount: 0 } : exp)));
        } catch (error) {
            console.error('Error deleting expense:', error);
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
                    onKeyDown={e => e.key === 'Enter' && handleSave(index)}
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
                    onKeyDown={e => e.key === 'Enter' && handleSave(index)}
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
            <nav className="sticky top-0 z-50 bg-slate-950 text-white shadow-lg 2xl:px-66 lg:px-29 px-4 py-4">
                {/* Container principal que decide se empilha ou fica em linha */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* PARTE 1: Logo e Botão de Sair (Mobile) */}
                    <div className="flex justify-between items-center w-full md:w-auto">
                        <h1 className="text-xl font-bold tracking-tight">Nest Project</h1>

                        {/* Este botão SÓ aparece no celular (md:hidden) */}
                        <button
                            onClick={handleLogout}
                            className="md:hidden bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md font-bold text-sm transition-all"
                        >
                            Logout
                        </button>
                    </div>

                    {/* PARTE 2: Saldo e Botão de Sair (Desktop) */}
                    <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t border-slate-800 pt-3 md:border-none md:pt-0">
                        {/* Display do Saldo */}
                        <div className="text-left md:text-right">
                            <p className="text-[10px] md:text-xs text-slate-400 uppercase font-bold leading-none mb-1">Total Balance</p>
                            <p className={`text-lg md:text-xl font-mono ${totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                $ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Este botão SÓ aparece no computador (hidden md:block) */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:block bg-red-500 hover:bg-red-600 px-5 py-2 rounded-md font-bold transition-all shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                <div className="relative isolate overflow-hidden text-white dark:text-slate-300 bg-slate-100 dark:bg-slate-900 min-h-screen sm:px-5 sm:pt-0">
                    <div className="container mx-auto sm:px-16">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-4 py-11 sm:px-6 lg:grid-cols-6 lg:px-8">
                            <div className="lg:col-span-3">
                                <header className="mb-8">
                                    <h2 className="lg:text-3xl text-xl font-extrabold text-slate-100">Financial Worksheet Expenses</h2>
                                    <p className="text-slate-400">Directly edit rows and press enter to save data</p>
                                </header>
                            </div>

                            <div className="lg:col-span-3 flex lg:justify-end self-end">
                                <CustomInput
                                    className="mr-2"
                                    value={addNumberLines}
                                    onChange={val => setAddNumberLines(Number(val))}
                                    type="number"
                                />
                                <CustomButton>Adicionar linhas</CustomButton>
                            </div>

                            <div className="lg:col-span-6 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                                <Table
                                    headers={tableHeaders}
                                    items={expenses}
                                    loading={loading}
                                    showSearch={true}
                                    showActions={true}
                                    actionType="delete"
                                    onAction={item => handleDelete(item)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto sm:px-16">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-4 py-11 sm:px-6 lg:grid-cols-6 lg:px-8">
                            <div className="lg:col-span-5">
                                <header className="mb-8">
                                    <h2 className="lg:text-3xl text-xl font-extrabold text-slate-100">Financial Worksheet Incomes</h2>
                                    <p className="text-slate-400">Directly edit rows and press enter to save data</p>
                                </header>
                            </div>

                            <div className="lg:col-span-1 flex lg:justify-end self-end">
                                <CustomButton>testes</CustomButton>
                            </div>

                            <div className="lg:col-span-6 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
