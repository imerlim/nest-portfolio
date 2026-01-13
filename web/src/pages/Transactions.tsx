import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../services/api.ts';
import Table from '../components/Table.tsx';
import CustomInput from '../components/CustomInput.tsx';
import CustomButton from '../components/CustomButton.tsx';
import CustomDatePicker from '../components/CustomDatePicker.tsx';

export interface Transaction {
    id?: number | string;
    description: string;
    amount: number;
    type?: 'EXPENSE' | 'INCOME'; // O campo novo e importante!
    month?: string;
    year?: number;
}

export default function Transactions() {
    const [transactionDate, setTransactionDate] = useState<Date | null>(new Date());
    const [itemsexpenses, setItemsExpenses] = useState<Transaction[]>([]);
    const [itemsIncomes, setItemsIncomes] = useState<Transaction[]>([]);
    const [month, setMonth] = useState<string>('January');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [addNumberLinesExpense, setAddNumberLinesExpense] = useState<number>(0);
    const [addNumberLinesIncome, setAddNumberLinesIncome] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const originalValue = useRef<number | string>(0);

    const formattedDateLabel = transactionDate
        ? transactionDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Select a date';

    const handleFocus = (val: number | string) => {
        originalValue.current = val;
    };

    // 1. Calculate Total Balance automatically
    const totalIncome = useMemo(() => {
        return itemsIncomes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    }, [itemsIncomes]);

    const totalExpense = useMemo(() => {
        return itemsexpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    }, [itemsexpenses]);

    const totalBalance = useMemo(() => {
        return totalIncome - totalExpense;
    }, [totalIncome, totalExpense]);

    // 2. Fetch and Fill logic
    const findAll = async (selectedMonth?: string, selectedYear?: number) => {
        try {
            setLoading(true);
            // 2. Fixed: Use params to filter by month/year in the backend
            const response = await api.get('/transactions', { params: { month: selectedMonth, year: selectedYear } });

            const data = Array.isArray(response.data) ? response.data : [];

            // 1. Separar os dados reais vindos da API por tipo
            const realExpenses = data.filter(item => item.type === 'EXPENSE');
            const realIncomes = data.filter(item => item.type === 'INCOME');

            // Função auxiliar para preencher até 50 linhas
            const fillToFifty = (currentArray: Transaction[], type: 'EXPENSE' | 'INCOME') => {
                const filledData: Transaction[] = [...currentArray];

                while (filledData.length < 50) {
                    filledData.push({
                        description: '',
                        amount: 0,
                        type: type, // Mantém o tipo correto na linha vazia
                        month: selectedMonth,
                        year: selectedYear,
                    });
                }
                return filledData;
            };

            // 2. Aplicar o preenchimento para cada categoria
            setItemsExpenses(fillToFifty(realExpenses, 'EXPENSE'));
            setItemsIncomes(fillToFifty(realIncomes, 'INCOME'));
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (transactionDate) {
            // Extrai o mês por extenso e o ano do objeto Date selecionado
            const selectedMonth = transactionDate.toLocaleString('en-US', { month: 'long' });
            const selectedYear = transactionDate.getFullYear();

            // Atualiza os estados de controle
            setMonth(selectedMonth);
            setYear(selectedYear);

            // Chama a API com os novos valores
            findAll(selectedMonth, selectedYear);
        }
    }, [transactionDate]);

    const handleAddLines = (qtd: number, type: 'EXPENSE' | 'INCOME') => {
        // 1. Explicitly type the array as Transaction[] to solve image_aa3902.png
        const blankLines: Transaction[] = [];

        for (let i = 0; i < qtd; i++) {
            blankLines.push({
                description: '',
                amount: 0,
                type: type,
                month: month,
                year: year,
            });
        }

        if (type == 'EXPENSE') {
            setItemsExpenses(prev => [...prev, ...blankLines]);

            setAddNumberLinesExpense(1);
        }
        if (type == 'INCOME') {
            setItemsIncomes(prev => [...prev, ...blankLines]);

            setAddNumberLinesIncome(1);
        }
    };

    // 3. Handle changes in the "Grid"
    const handleCellChange = (index: number, field: string, value: any, type: string) => {
        if (type == 'EXPENSE') {
            const newData = [...itemsexpenses];
            newData[index] = { ...newData[index], [field]: value };
            setItemsExpenses(newData);
        }
        if (type == 'INCOME') {
            const newData = [...itemsIncomes];
            newData[index] = { ...newData[index], [field]: value };
            setItemsIncomes(newData);
        }
    };

    // 4. Save logic (Triggers when user clicks outside the input)
    const handleSave = async (index: number, field: string, type: 'EXPENSE' | 'INCOME') => {
        const currentList = type === 'EXPENSE' ? itemsexpenses : itemsIncomes;
        const setTarget = type === 'EXPENSE' ? setItemsExpenses : setItemsIncomes;
        const item = currentList[index];

        // Se por algum motivo o item perder o type, tentamos recuperar do parâmetro da função
        if (!item.type) item.type = type;

        if (field === 'amount') {
            if (Number(item.amount) === Number(originalValue.current)) return;
        } else {
            if (item.description === originalValue.current) return;
        }

        try {
            if (item.id) {
                await api.patch(`/transactions/${item.id}`, item);
            } else {
                // Só salva se houver conteúdo
                if (!item.description && !item.amount) return;

                const response = await api.post('/transactions', item);
                const savedItem = response.data;

                setTarget(prev => {
                    const newArr = [...prev];
                    newArr[index] = { ...newArr[index], id: savedItem.id };
                    return newArr;
                });
            }
            originalValue.current = field === 'amount' ? item.amount : item.description;
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            if (field === 'description') {
                // O segredo está em garantir que o ID aqui bata com o ID do tableHeaders
                setTimeout(() => {
                    const targetId = `amount-${type}-${index}`;
                    const nextInput = document.getElementById(targetId);
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        console.warn(`Não encontrei o input com ID: ${targetId}`);
                    }
                }, 1);
            }
        }
    };

    const handleDelete = async (item: Transaction) => {
        // Objeto padrão para resetar a linha sem perder a inteligência dela
        const resetedItem = {
            description: '',
            amount: 0,
            type: item.type,
            month: item.month,
            year: item.year,
        };

        if (!item.id) {
            if (item.type === 'EXPENSE') {
                const index = itemsexpenses.findIndex(e => e === item);
                const updated = [...itemsexpenses];
                updated[index] = resetedItem; // Usa o objeto com type!
                setItemsExpenses(updated);
                return;
            }
            if (item.type === 'INCOME') {
                const index = itemsIncomes.findIndex(e => e === item);
                const updated = [...itemsIncomes];
                updated[index] = resetedItem;
                setItemsIncomes(updated);
                return;
            }
        }

        try {
            await api.delete(`/transactions/${item.id}`);

            if (item.type === 'EXPENSE') setItemsExpenses(prev => prev.map(exp => (exp.id === item.id ? resetedItem : exp)));

            if (item.type === 'INCOME') setItemsIncomes(prev => prev.map(inc => (inc.id === item.id ? resetedItem : inc)));
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const tableHeaders = [
        {
            label: 'Description',
            key: 'description',
            render: (item: Transaction, index: number) => (
                <CustomInput
                    id={`description-${item.type}-${index}`} // ID único: description-INCOME-0
                    value={item.description}
                    onFocus={() => handleFocus(item.description)}
                    onChange={val => handleCellChange(index, 'description', val.toString(), item.type!)}
                    onBlur={() => handleSave(index, 'description', item.type!)}
                    onKeyDown={e => e.key === 'Enter' && handleSave(index, 'description', item.type!)}
                    textSize="text-sm"
                    placeholder="Description..."
                />
            ),
        },
        {
            label: 'Value',
            key: 'amount',
            render: (item: Transaction, index: number) => (
                <CustomInput
                    id={`amount-${item.type}-${index}`} // ID único: description-INCOME-0
                    value={item.amount} // Ensure 'item' is defined in your render function
                    onFocus={() => handleFocus(item.amount)}
                    onChange={val => handleCellChange(index, 'amount', val, item.type!)}
                    onBlur={() => handleSave(index, 'amount', item.type!)}
                    onKeyDown={e => e.key === 'Enter' && handleSave(index, 'amount', item.type!)}
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
                        <div className="text-center md:text-right">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Income</p>
                            <p className="text-lg md:text-xl font-mono text-emerald-400">
                                $ {totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="text-center md:text-right border-l border-slate-700 lg:px-6 px-5">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Expense</p>
                            <p className="text-lg md:text-xl font-mono text-red-400">
                                $ {totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="text-center md:text-right bg-slate-800/50 p-2 rounded-lg px-4 border border-slate-700">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Balance</p>
                            <p className={`text-lg md:text-2xl font-mono ${totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                $ {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                            <div className="lg:col-span-6">
                                <header className="mb-8">
                                    <h2 className="lg:text-3xl md:text-2xl text-xl font-extrabold text-slate-100">
                                        Financial Worksheet Expenses
                                    </h2>
                                </header>
                                <header className="text-center">
                                    <h2 className="lg:text-3xl md:text-2xl text-xl font-extrabold text-slate-100">{formattedDateLabel}</h2>
                                </header>
                            </div>

                            <div className="lg:col-span-1">
                                <CustomDatePicker
                                    id="transaction-date"
                                    label="Transaction Date"
                                    selected={transactionDate}
                                    onChange={date => {
                                        console.log('Variável date:', date); // Mostra o objeto Date completo
                                        console.log('Tipo da variável:', typeof date); // Geralmente 'object'
                                        setTransactionDate(date);
                                    }}
                                    description="When did this transaction occur?"
                                />
                            </div>

                            <div className="lg:col-span-5 flex items-end lg:justify-end gap-2 mb-9">
                                <div className="w-40">
                                    <CustomInput
                                        value={addNumberLinesExpense}
                                        onChange={val => setAddNumberLinesExpense(Number(val))}
                                        type="number"
                                    />
                                </div>

                                <CustomButton onClick={() => handleAddLines(addNumberLinesExpense, 'EXPENSE')}>Add lines</CustomButton>
                            </div>

                            <div className="lg:col-span-6 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                                <Table
                                    headers={tableHeaders}
                                    items={itemsexpenses}
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
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 px-4 py-11 sm:px-6 lg:grid-cols-6 lg:px-8">
                            <div className="lg:col-span-6">
                                <header className="mb-8">
                                    <h2 className="lg:text-3xl md:text-2xl text-xl font-extrabold text-slate-100">
                                        Financial Worksheet Incomes
                                    </h2>
                                </header>
                            </div>

                            <div className="lg:col-span-6 flex items-end justify-center lg:justify-end gap-2">
                                <div className="w-40">
                                    <CustomInput
                                        value={addNumberLinesIncome}
                                        onChange={val => setAddNumberLinesIncome(Number(val))}
                                        type="number"
                                    />
                                </div>

                                <CustomButton onClick={() => handleAddLines(addNumberLinesIncome, 'INCOME')}>Add lines</CustomButton>
                            </div>

                            <div className="lg:col-span-6 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                                <Table
                                    headers={tableHeaders}
                                    items={itemsIncomes}
                                    loading={loading}
                                    showSearch={true}
                                    showActions={true}
                                    actionType="delete"
                                    onAction={item => handleDelete(item)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
