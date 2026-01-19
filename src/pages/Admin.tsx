import { useEffect, useState, useMemo, useContext } from "react";
import AddTrialModal from "../components/admin/AddTrialModal";
import Notify from "../components/notify/Notify";
import { SideBarContext } from "../contexts/SideBarMenuContext";

interface AdminUser {
    user_id: number;
    nome: string;
    email: string;
    celular: string;
    create_date: string | null;
    saas_id: number;
    trial_end: string;
    origin?: string;
    assinatura_status: string;
    ciclo: string;
    valor_pago: string;
    plano_qtd_acomodacao: number;
    acomodacoes_cadastradas: number;
    pagamentos_realizados: string | number;
    is_active_saas: boolean | number;
}

interface AdminStats {
    active_users: number;
    paying_active_users: number;
    total_users: number;
}

export default function Admin() {
    const apiURL = import.meta.env.VITE_API_URL
    const { dataToken } = useContext(SideBarContext)
    const [users, setUsers] = useState<AdminUser[]>([])
    const [stats, setStats] = useState<AdminStats>({ active_users: 0, paying_active_users: 0, total_users: 0 })
    const [trialModal, setTrialModal] = useState<{ open: boolean, saasId: number }>({ open: false, saasId: 0 })
    const [notify, setNotify] = useState({ type: 1, text: '' })
    const [showNotify, setShowNotify] = useState(false)

    // Filtering & Sorting State
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof AdminUser | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});
    const [showFilterDropdown, setShowFilterDropdown] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;

    useEffect(() => {
        document.title = 'Admin | Prohost'
        const token = localStorage.getItem('ph_token_acc');
        if (!token) {
             window.location.href = '/auth';
             return;
        }
        fetchStats();
        fetchUsers();
    }, [])

    async function fetchStats() {
        try {
            const res = await fetch(`${apiURL}/admin/stats`, { headers: { 'Content-Type': 'application/json' } });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    async function fetchUsers() {
        try {
            const res = await fetch(`${apiURL}/admin/users`, { headers: { 'Content-Type': 'application/json' } });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
                generateFilterOptions(data);
            } else if (res.status === 403 || res.status === 401) {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const generateFilterOptions = (data: AdminUser[]) => {
        const options: Record<string, Set<string>> = {
            origin: new Set(),
        };

        data.forEach(user => {
            options.origin.add(user.origin || 'N/A');
        });

        const finalOptions: Record<string, string[]> = {};
        Object.keys(options).forEach(key => {
            finalOptions[key] = Array.from(options[key]).sort();
        });
        setFilterOptions(finalOptions);
    }

    const handleSort = (key: keyof AdminUser) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilter = (key: string, value: string) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (value === '' || value === 'all') {
                delete newFilters[key];
            } else {
                newFilters[key] = value;
            }
            return newFilters;
        });
        setCurrentPage(1); 
    };

    const filteredAndSortedUsers = useMemo(() => {
        let result = [...users];

        // Global Search
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(u => 
                (u.nome && u.nome.toLowerCase().includes(lowerSearch)) ||
                (u.email && u.email.toLowerCase().includes(lowerSearch))
            );
        }

        // Specific Filters
        Object.keys(filters).forEach(key => {
            const filterValue = filters[key].toLowerCase();
            result = result.filter(user => {
                const userValue = String((user as any)[key] || 'N/A').toLowerCase();
                return userValue.includes(filterValue);
            });
        });

        // Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = (a as any)[sortConfig.key!] || '';
                const bValue = (b as any)[sortConfig.key!] || '';

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [users, filters, sortConfig, search]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = filteredAndSortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    async function impersonate(userId: number) {
        try {
            const res = await fetch(`${apiURL}/admin/users/${userId}/impersonate`, { method: 'POST' })
            const data = await res.json()
            if (data.token) {
                localStorage.setItem('ph_token_acc', data.token)
                window.location.href = '/dashboard'
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function sendRecovery(email: string) {
        if(!confirm(`Enviar email de recuperação para ${email}?`)) return;
        try {
            await fetch(`${apiURL}/admin/users/recover-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            setNotify({ type: 1, text: 'Email enviado!' })
            setShowNotify(true)
            setTimeout(() => setShowNotify(false), 3000)
        } catch (error) {
            console.error(error)
        }
    }

    async function getLink(userId: number) {
        try {
            const res = await fetch(`${apiURL}/admin/users/${userId}/recover-link`)
            const data = await res.json()
            if (data.link) {
                await navigator.clipboard.writeText(window.location.origin + data.link)
                setNotify({ type: 1, text: 'Link copiado!' })
                setShowNotify(true)
                setTimeout(() => setShowNotify(false), 3000)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getRowStyle = (user: AdminUser) => {
        const isActive = Boolean(user.is_active_saas);
        const payments = Number(user.pagamentos_realizados || 0);
        const status = user.assinatura_status;
        
        // Default: Inactive (Red)
        let style = 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500 text-red-900';

        if (isActive) {
            if (status === 'CONFIRMED' || status === 'ACTIVE' || status === 'RECEIVED' || payments > 0) {
                // Active & Paying (Green)
                style = 'bg-green-50 hover:bg-green-100 border-l-4 border-green-500 text-green-900';
            } else {
                // Trial Active (Blue)
                style = 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500 text-blue-900';
            }
        } else {
            if (status === 'CONFIRMED' || status === 'ACTIVE' || status === 'RECEIVED' || payments > 0) {
                // Paying but Inactive (Yellow)
                style = 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900';
            }
        }
        return style;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('pt-BR');
    }

    return (
        <div className="p-6 w-full bg-gray-50 min-h-screen overflow-hidden">
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            {trialModal.open && <AddTrialModal close={() => setTrialModal({ open: false, saasId: 0 })} saasId={trialModal.saasId} />}
            
            <div className="flex flex-col gap-4 max-w-[100vw]">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-800">Painel Admin</h1>
                        <div className="flex gap-3 text-xs font-semibold">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Ativo Pagante</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Trial Ativo</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Pagante Inativo</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Inativo</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 items-center w-full md:w-auto">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500">Usuários</span>
                            <span className="font-bold text-lg">{stats.total_users}</span>
                        </div>
                        <div className="flex flex-col items-end border-l pl-4">
                            <span className="text-xs text-gray-500">Ativos</span>
                            <span className="font-bold text-lg text-blue-600">{stats.active_users}</span>
                        </div>
                        <div className="flex flex-col items-end border-l pl-4">
                            <span className="text-xs text-gray-500">Pagantes</span>
                            <span className="font-bold text-lg text-green-600">{stats.paying_active_users}</span>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Pesquisar usuário..." 
                            className="border border-gray-300 rounded-lg px-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                <tr>
                                    {/* Columns mapping */}
                                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('nome')}>Nome</th>
                                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                                    <th className="px-4 py-3">Celular</th>
                                    
                                    {/* Origin with Filter */}
                                    <th className="px-4 py-3 relative">
                                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('origin')}>
                                            Origem
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(showFilterDropdown === 'origin' ? null : 'origin'); }}
                                                className="p-1 hover:bg-gray-300 rounded text-gray-500"
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" /></svg>
                                            </button>
                                        </div>
                                        {showFilterDropdown === 'origin' && (
                                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto min-w-[150px]" onClick={(e) => e.stopPropagation()}>
                                                <div className="p-2 border-b sticky top-0 bg-white">
                                                    <button className="text-xs text-blue-600 hover:underline" onClick={() => { handleFilter('origin', 'all'); setShowFilterDropdown(null); }}>Limpar Filtro</button>
                                                </div>
                                                {filterOptions['origin']?.map(opt => (
                                                    <div 
                                                        key={opt} 
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                                                        onClick={() => { handleFilter('origin', opt); setShowFilterDropdown(null); }}
                                                    >
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </th>

                                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('create_date')}>Criado Em</th>
                                    <th className="px-4 py-3 text-center">Pagamentos</th>
                                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('trial_end')}>Trial Até</th>
                                    <th className="px-4 py-3 text-center">Acomod.</th>
                                    <th className="px-4 py-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.user_id} className={`border-b transition-colors ${getRowStyle(user)}`}>
                                        <td className="px-4 py-3 font-semibold max-w-[180px] truncate" title={user.nome}>{user.nome}</td>
                                        <td className="px-4 py-3 max-w-[200px] truncate" title={user.email}>{user.email}</td>
                                        <td className="px-4 py-3">{user.celular}</td>
                                        <td className="px-4 py-3">{user.origin || '-'}</td>
                                        <td className="px-4 py-3">{formatDate(user.create_date)}</td>
                                        <td className="px-4 py-3 text-center font-bold">{user.pagamentos_realizados}</td>
                                        <td className="px-4 py-3 font-medium">
                                            {formatDate(user.trial_end)}
                                            <button 
                                                className="ml-2 text-current opacity-60 hover:opacity-100 hover:scale-110 transition-transform"
                                                onClick={() => setTrialModal({ open: true, saasId: user.saas_id })}
                                                title="Adicionar dias de Trial"
                                            >
                                                <b>+</b>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {user.acomodacoes_cadastradas} <span className="text-[10px] opacity-70">/ {user.plano_qtd_acomodacao || 1}</span>
                                        </td>
                                        <td className="px-4 py-3 flex justify-center gap-3">
                                            <button 
                                                onClick={() => impersonate(user.user_id)}
                                                className="text-current hover:text-purple-700 transition-colors"
                                                title="Acessar conta (Impersonate)"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                                            </button>
                                            <button 
                                                onClick={() => sendRecovery(user.email)}
                                                className="text-current hover:text-blue-700 transition-colors"
                                                title="Enviar email de recuperação de senha"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            </button>
                                            <button 
                                                onClick={() => getLink(user.user_id)}
                                                className="text-current hover:text-gray-700 transition-colors"
                                                title="Copiar link de redefinição de senha"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                        <span className="text-xs text-gray-500">
                            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedUsers.length)} - {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} de {filteredAndSortedUsers.length}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="px-3 py-1 text-xs font-medium self-center">Página {currentPage} de {totalPages || 1}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
