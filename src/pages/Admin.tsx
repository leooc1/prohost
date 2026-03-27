import { useEffect, useMemo, useState } from "react";
import AddTrialModal from "../components/admin/AddTrialModal";
import Notify from "../components/notify/Notify";
import { ModalAlert } from "../components/ModalAlert";
// import { SideBarContext } from "../contexts/SideBarMenuContext";

interface AdminUser {
    user_id: number;
    nome: string;
    email: string;
    celular: string;
    create_date: string | null;
    last_login: string | null;
    saas_id: number;
    trial_end: string;
    origin?: string;
    assinatura_status: string;
    sub: string;
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

type UserStatusFilter = 'paying-active' | 'trial-active' | 'paying-inactive' | 'inactive';

export default function Admin() {
    const apiURL = import.meta.env.VITE_API_URL
    // const { dataToken } = useContext(SideBarContext)
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
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<UserStatusFilter | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;

    // Confirmation Modal State
    const [confirmToSendEmail, setConfirmToSendEmail] = useState<string>("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        document.title = 'Admin | Prohost'
        const token = localStorage.getItem('ph_token_acc');
        if (!token) {
            window.location.href = '/auth';
            return;
        }
        fetchStats(token);
        fetchUsers(token);
    }, [])

    function openModalConfirmation(email: string) {
        setConfirmToSendEmail(email);
        setShowConfirmModal(true);
    }

    function closeModalConfirmation() {
        setConfirmToSendEmail("");
        setShowConfirmModal(false);
    }

    function confirmSendRecovery() {
        if (!confirmToSendEmail) return;
        sendRecovery(confirmToSendEmail);
        closeModalConfirmation();
    }

    async function fetchStats(token: string) {
        try {
            const res = await fetch(`${apiURL}/admin/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data)
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    async function fetchUsers(token: string) {
        try {
            const res = await fetch(`${apiURL}/admin/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
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

    const getWhatsappLink = (phone: string) => {
        const digits = phone.replace(/\D/g, '');

        if (!digits) return null;

        if (digits.length === 10 || digits.length === 11) {
            return `https://wa.me/55${digits}`;
        }

        if (digits.length === 12 || digits.length === 13) {
            return `https://wa.me/${digits}`;
        }

        return null;
    };

    const getUserStatus = (user: AdminUser): UserStatusFilter => {
        const isActive = Boolean(user.sub.length > 0);
        const status = user.assinatura_status;
        const last_login = user.last_login || user.create_date || new Date().toISOString();
        const trial_end = user.trial_end;

        if (isActive && (status === 'CONFIRMED' || status === 'ACTIVE' || status === 'RECEIVED')) {
            if ((new Date(last_login).getTime() >= new Date().setDate(new Date().getDate() - 15)) && (new Date(trial_end).getTime() >= new Date().getTime())) {
                return 'paying-active';
            }

            return 'paying-inactive';
        }

        if ((new Date(trial_end).getTime() >= new Date().getTime())) {
            return 'trial-active';
        }

        return 'inactive';
    };

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

        if (selectedStatusFilter) {
            result = result.filter(user => getUserStatus(user) === selectedStatusFilter);
        }

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
    }, [users, filters, sortConfig, search, selectedStatusFilter]);
    console.log((filteredAndSortedUsers[0]))

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = filteredAndSortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    // console.log(paginatedUsers)
    async function impersonate(userId: number) {
        try {
            const token = localStorage.getItem('ph_token_acc');
            const res = await fetch(`${apiURL}/admin/users/${userId}/impersonate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
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
        try {
            const token = localStorage.getItem('ph_token_acc');
            await fetch(`${apiURL}/admin/users/recover-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            const token = localStorage.getItem('ph_token_acc');
            const res = await fetch(`${apiURL}/admin/users/${userId}/recover-link`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
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
        const status = getUserStatus(user);

        if (status === 'paying-active') {
            return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-500 text-green-900';
        }

        if (status === 'trial-active') {
            return 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500 text-blue-900';
        }

        if (status === 'paying-inactive') {
            return 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900';
        }

        return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500 text-red-900';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('pt-BR');
    }

    const statusLegendItems: { key: UserStatusFilter; label: string; dotClassName: string }[] = [
        { key: 'paying-active', label: 'Ativo Pagante', dotClassName: 'bg-green-500' },
        { key: 'trial-active', label: 'Trial Ativo', dotClassName: 'bg-blue-500' },
        { key: 'paying-inactive', label: 'Pagante Inativo', dotClassName: 'bg-yellow-500' },
        { key: 'inactive', label: 'Inativo', dotClassName: 'bg-red-500' },
    ];

    return (
        <div className="p-6 w-full bg-gray-50 min-h-screen overflow-hidden">
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            {trialModal.open && <AddTrialModal close={() => setTrialModal({ open: false, saasId: 0 })} saasId={trialModal.saasId} />}
            {showConfirmModal && (
                <ModalAlert
                    title="Confirmar Envio"
                    onClose={closeModalConfirmation}
                    onConfirm={confirmSendRecovery}
                    message={`Tem certeza que deseja enviar o email de recuperação para ${confirmToSendEmail}?`}
                    cancelText='Cancelar'
                    colorButton="green"
                />
            )}
            <div className="flex flex-col gap-4 max-w-[100vw]">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-800">Painel Admin</h1>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            {statusLegendItems.map(item => {
                                const isSelected = selectedStatusFilter === item.key;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => {
                                            setSelectedStatusFilter(prev => prev === item.key ? null : item.key);
                                            setCurrentPage(1);
                                        }}
                                        className={`flex items-center gap-2 rounded-full border px-3 py-1 transition-colors ${isSelected
                                                ? 'border-gray-800 bg-gray-100 text-gray-900'
                                                : 'border-transparent bg-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${item.dotClassName}`}></div>
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                            {selectedStatusFilter && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedStatusFilter(null);
                                        setCurrentPage(1);
                                    }}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Limpar filtro
                                </button>
                            )}
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
                                                onClick={() => {
                                                    const whatsappLink = getWhatsappLink(user.celular);
                                                    if (whatsappLink) {
                                                        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
                                                    }
                                                }}
                                                className="text-current hover:text-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                title={getWhatsappLink(user.celular) ? "Abrir conversa no WhatsApp" : "Número inválido para WhatsApp"}
                                                disabled={!getWhatsappLink(user.celular)}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20.52 3.48A11.8 11.8 0 0012.07 0C5.56 0 .24 5.3.24 11.82c0 2.08.54 4.11 1.58 5.9L0 24l6.46-1.69a11.8 11.8 0 005.61 1.43h.01c6.51 0 11.83-5.3 11.83-11.82 0-3.16-1.23-6.13-3.39-8.44ZM12.08 21.74h-.01a9.77 9.77 0 01-4.98-1.36l-.36-.21-3.83 1 1.02-3.73-.24-.38a9.8 9.8 0 01-1.5-5.24C2.18 6.44 6.61 2 12.07 2c2.62 0 5.08 1.02 6.92 2.87a9.72 9.72 0 012.86 6.94c0 5.46-4.44 9.93-9.77 9.93Zm5.37-7.43c-.29-.15-1.71-.84-1.98-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.45-.86-.77-1.44-1.73-1.61-2.02-.17-.3-.02-.46.13-.61.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.19.05-.37-.02-.52-.07-.15-.66-1.59-.9-2.17-.24-.58-.48-.49-.66-.5h-.56c-.2 0-.52.08-.79.37-.27.3-1.04 1.01-1.04 2.46 0 1.45 1.07 2.85 1.21 3.05.15.2 2.1 3.21 5.08 4.5.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.09 1.71-.7 1.95-1.38.24-.68.24-1.27.17-1.38-.07-.12-.27-.2-.56-.35Z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => impersonate(user.user_id)}
                                                className="text-current hover:text-purple-700 transition-colors"
                                                title="Acessar conta (Impersonate)"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => openModalConfirmation(user.email)}
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
