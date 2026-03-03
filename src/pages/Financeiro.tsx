import { useContext, useEffect, useMemo, useState, useCallback } from 'react'
import TopBar from '../components/TopBar'
import RegistrarDespesa from '../components/RegistrarDespesa'
import RegistrarReceita from '../components/RegistrarReceita'
import CadastrarCategoria from '../components/CadastrarCategoria'
import ListaMovimentacoes from '../components/list/ListaMovimentacoes'
import { SideBarContext } from '../contexts/SideBarMenuContext'
import Loader from '../components/Loader'
import SemPermissao from '../components/SemPermissao'

interface Movimentacao {
    id?: number
    acomodacao: { id: number | null, nome: string | null }
    categoria_financeiro: { id: number | null, nome: string | null, cor: string }
    data: string
    canal_reserva: { id: number | null, cor: string, nome: string }
    nome: string
    saas: { id: number | null }
    valor: string
    valor_liq: number
    valor_prop: number
    valor_gestor: number
    reserva: { id: number | null, continuidade: number | null }
    pago: boolean
    receita: boolean
    recebedor: null | string
    obs: null | string
    tipo_despesa: string | null
}

interface Acomodacao {
    id: number
    tipo: string
    comissao: number
    data_ini_ope: string
    descricao: string
    endereco: string
    check_in_p: string
    check_out_p: string
    foto: string
    nome: string
    numero_hospedes: number
    valor_imovel: number
    desativado: boolean
    saas: { id: number }
}

export default function Financeiro() {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
        key: 'data',
        direction: 'descending'
    });
    const apiURL = import.meta.env.VITE_API_URL
    useEffect(() => { document.title = `Financeiro | Prohost` }, [])
    const [novaReceita, setNovaReceita] = useState(false)
    const [novaDespesa, setNovaDespesa] = useState(false)
    const [vz, setVz] = useState(true)
    const [cadastrarCategoria, setCadastrarCategoria] = useState(false)
    const [session, setSession] = useState(0)
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const date = new Date()
    const [periodo, setPeriodo] = useState('m-atual')
    const [deData, setDeData] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`)
    const [ateData, setAteData] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`)
    const [dataBW, setDataBW] = useState<[string, string]>([`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`, `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`])
    const [listagem, setListagem] = useState(false)

    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
    const [lDespesa, setLDespesa] = useState<string>('')
    const [filterAC, setFilterAC] = useState<string>('all')
    const [ids, setIds] = useState<{ id: number, index: number }[]>([])

    const { dataToken } = useContext(SideBarContext)
    const [loaded, setLoaded] = useState(false)
    const [tipoDespesaFilter, setTipoDespesaFilter] = useState<string>('all');

    function formatarMoedaBrasileira(valorStr: string) {
        const valor = parseFloat(valorStr);
        if (isNaN(valor)) {
            return "Valor inválido";
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const agruparMovimentacoes = useCallback((dados: Movimentacao[]) => {

        const agrupados: { [key: string]: any } = {};
        const outrasReceitasAgrupadas: any = {
            id: null,
            data: "-",
            nome: "Outras Receitas",
            tipo_despesa: "",
            obs: "",
            recebedor: "",
            valor: 0.0,
            valor_liq: 0.0,
            valor_prop: 0.0,
            valor_gestor: 0.0,
            pago: false,
            receita: true,
            acomodacao: null,
            categoria_financeiro: null,
            reserva: [],
            canal_reserva: null,
        };

        dados.forEach((item) => {
            if (item.reserva === null) {
                outrasReceitasAgrupadas.valor += parseFloat(String(item.valor));
                outrasReceitasAgrupadas.valor_liq += parseFloat(String(item.valor_liq));
                outrasReceitasAgrupadas.valor_prop += parseFloat(String(item.valor_prop));
                outrasReceitasAgrupadas.valor_gestor += parseFloat(String(item.valor_gestor));
                outrasReceitasAgrupadas.pago = outrasReceitasAgrupadas.pago || item.pago;

                if (!outrasReceitasAgrupadas.categoria_financeiro && item.categoria_financeiro) {
                    outrasReceitasAgrupadas.categoria_financeiro = {
                        ...item.categoria_financeiro,
                        nome: "Outras Receitas",
                        cor: "#0000ff",
                    };
                }

                if (item.reserva) {
                    outrasReceitasAgrupadas.reserva.push(item.reserva);
                }
                return;
            }

            const reservaId = item.reserva?.id;
            const continuidadeId = item.reserva?.continuidade;
            const chave = String(continuidadeId || reservaId);

            if (!agrupados[chave]) {
                agrupados[chave] = {
                    id: item.id,
                    data: item.data,
                    nome: item.nome.split("•")[0].trim(),
                    tipo_despesa: item.tipo_despesa,
                    obs: item.obs,
                    recebedor: item.recebedor,
                    valor: 0.0,
                    valor_liq: 0.0,
                    valor_prop: 0.0,
                    valor_gestor: 0.0,
                    pago: item.pago,
                    receita: item.receita,
                    acomodacao: item.acomodacao,
                    categoria_financeiro: item.categoria_financeiro,
                    reserva: item.reserva,
                    canal_reserva: item.canal_reserva,
                    cor: item?.canal_reserva?.cor || ''
                };
            }

            agrupados[chave].valor += parseFloat(String(item.valor));
            agrupados[chave].valor_liq += parseFloat(String(item.valor_liq));
            agrupados[chave].valor_prop += parseFloat(String(item.valor_prop));
            agrupados[chave].valor_gestor += parseFloat(String(item.valor_gestor));
        });

        const arrayAgroup = Object.values(agrupados) as Movimentacao[];
        const movimentacoesFinal = arrayAgroup.map((item) => {
            if (item.canal_reserva) {
                return {
                    ...item,
                    categoria_financeiro: {
                        ...item.categoria_financeiro,
                        cor: item.canal_reserva.cor,
                        nome: item.canal_reserva.nome
                    }
                };
            } else {
                return {
                    ...item,
                    nome: 'Outras Receitas',
                    categoria_financeiro: {
                        ...item.categoria_financeiro,
                        nome: 'Outras Receitas',
                        cor: '#0000ff',
                        id: null,
                    },
                };
            }
        });

        if (outrasReceitasAgrupadas.valor > 0) {
            movimentacoesFinal.unshift(outrasReceitasAgrupadas);
        }

        return movimentacoesFinal;
    }, []);

    const updateQueryParam = (key: string, value: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.replaceState({}, "", url);
    };

    function getDaysInMonth(month: number, year: number) {
        switch (month) {
            case 1: // Janeiro
            case 3: // Março
            case 5: // Maio
            case 7: // Julho
            case 8: // Agosto
            case 10: // Outubro
            case 12: // Dezembro
                return 31;
            case 4: // Abril
            case 6: // Junho
            case 9: // Setembro
            case 11: // Novembro
                return 30;
            case 2: // Fevereiro
                // Verifica se o ano é bissexto
                if ((year % 4 == 0 && year % 100 !== 0) || (year % 400 == 0)) {
                    return 29;
                } else {
                    return 28;
                }
            default:
                return "Mês inválido";
        }
    }

    async function acomodacoes() {
        if (dataToken.id)
            await fetch(`${apiURL}/acomodacao/names/${dataToken.id}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data: Acomodacao[]) => {
                    setAcomodacao(data.filter((e => !e.desativado)))
                })
                .catch(err => console.log(err))
    }

    async function getMovimentacao() {
        if (dataToken.id)
            await fetch(`${apiURL}/movimentacao/${dataToken.id}/${dataBW[0]}/${dataBW[1]}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data: any[]) => {
                    setMovimentacoes(data.map(m => ({ ...m, data: m.data.slice(0, 10) })))
                    setLDespesa('')
                    setListagem(true)
                })
                .catch(err => console.log(err))
    }

    const [permissao, setPermissao] = useState(0)
    async function permissoes() {
        if (dataToken.id)
            await fetch(`${apiURL}/users/${dataToken.idUsu}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then(data => {
                    if (data.financeiro) {
                        setPermissao(data.financeiro)
                    }
                    else {
                        setPermissao(0)
                    }
                })
                .catch(err => console.log(err))
    }

    async function loadAll() {
        await acomodacoes()
        await getMovimentacao()
        await permissoes()
        await fetch(`${apiURL}/reserva/index/${dataToken?.id}/${dataBW[0]}/${dataBW[1]}`, {
            method: 'GET',
        })
            .then(data => data.json())
            .then((data) => {
                setIds(data)
            })
            .catch(err => console.log(err))
        setLoaded(true)
    }

    useEffect(() => {
        if (periodo == 'm-atual') {
            const de = `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`
            const ate = `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`
            updateQueryParam("datade", de);
            updateQueryParam("dataate", ate);
            updateQueryParam("acfil", filterAC);
            setDataBW([de, ate])
        }
        else if (periodo == 'm-passado') {
            const de = `${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}-${date.getMonth() == 0 ? 12 : (`0${date.getMonth()}`).slice(-2)}-01`
            const ate = `${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}-${date.getMonth() == 0 ? 12 : (`0${date.getMonth()}`).slice(-2)}-${getDaysInMonth(date.getMonth() == 0 ? 12 : date.getMonth(), date.getFullYear())}`
            updateQueryParam("datade", de);
            updateQueryParam("dataate", ate);
            updateQueryParam("acfil", filterAC);
            setDataBW([de, ate])
        }
        else if (periodo == 'a-atual') {
            const de = `${date.getFullYear()}-01-01`
            const ate = `${date.getFullYear()}-12-31`
            updateQueryParam("datade", de);
            updateQueryParam("dataate", ate);
            updateQueryParam("acfil", filterAC);
            setDataBW([de, ate])
        }
        else if (periodo == 'a-passado') {
            const de = `${date.getFullYear() - 1}-01-01`
            const ate = `${date.getFullYear() - 1}-12-31`
            updateQueryParam("datade", de);
            updateQueryParam("dataate", ate);
            updateQueryParam("acfil", filterAC);
            setDataBW([de, ate])
        }
        else {
            const de = deData
            const ate = ateData
            updateQueryParam("datade", de);
            updateQueryParam("dataate", ate);
            updateQueryParam("acfil", filterAC);
            setDataBW([de, ate])
        }
        setListagem(false)

    }, [periodo, deData, ateData])

    useEffect(() => {
        loadAll()
    }, [listagem, dataToken])

    useEffect(() => {
        setTipoDespesaFilter('all')
    }, [session])

    useEffect(() => {
        if (localStorage.getItem('acfil')) {
            setFilterAC(localStorage.getItem('acfil') || 'all')
        }
        if (localStorage.getItem('periodo_ph')) {
            setPeriodo(localStorage.getItem('periodo_ph') || 'm-atual')
            if (localStorage.getItem('periodo_ph') == 'personalizado') {
                setDeData(localStorage.getItem('datade') || '')
                setAteData(localStorage.getItem('dataate') || '')
            }
        }
    }, [])


    const processedMovimentacoes = useMemo(() => {
        let items = movimentacoes.filter(a => filterAC === 'all' || a?.acomodacao?.id === Number(filterAC)).filter(m => new Date(m.data) >= new Date(dataBW[0]) && new Date(m.data) <= new Date(dataBW[1]));
        if (session === 1) { // Receitas
            const receitas = items.filter(m => m.receita);
            items = vz ? receitas : agruparMovimentacoes(receitas);
        } else if (session === 2) { // Despesas
            items = items.filter(m =>
                !m.receita &&
                m.nome.toLowerCase().includes(lDespesa.toLowerCase()) &&
                (tipoDespesaFilter === 'all' || m.tipo_despesa === tipoDespesaFilter)
            );
        }

        if (sortConfig.key) {
            return [...items].sort((a, b) => {
                if (a === null || b === null) return 0;
                let aValue: any, bValue: any;

                switch (sortConfig.key) {
                    case 'categoria': aValue = a.categoria_financeiro?.nome ?? ''; bValue = b.categoria_financeiro?.nome ?? ''; break;
                    case 'acomodacao': aValue = a.acomodacao?.nome ?? ''; bValue = b.acomodacao?.nome ?? ''; break;
                    default: aValue = a[sortConfig.key as keyof Movimentacao]; bValue = b[sortConfig.key as keyof Movimentacao];
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
                }
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [movimentacoes, filterAC, session, vz, lDespesa, sortConfig, agruparMovimentacoes, tipoDespesaFilter]);
    return (
        loaded ?
            <div className='w-full'>
                {permissao == 0 && <SemPermissao />}
                <TopBar>
                    <section className='ml-5 flex gap-5'>
                        <button onClick={() => setSession(0)} className={`h-full text-sm flex items-center gap-2 border-b-2 ${session == 0 ? 'border-primary' : 'border-transparent'} hover:border-primary px-2`}>
                            <svg className='w-3 h-fit' xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 438.536 438.536"><g><path d="M414.41 24.123C398.333 8.042 378.963 0 356.315 0H82.228C59.58 0 40.21 8.042 24.126 24.123 8.045 40.207.003 59.576.003 82.225v274.084c0 22.647 8.042 42.018 24.123 58.102 16.084 16.084 35.454 24.126 58.102 24.126h274.084c22.648 0 42.018-8.042 58.095-24.126 16.084-16.084 24.126-35.454 24.126-58.102V82.225c-.001-22.649-8.043-42.021-24.123-58.102z" fill="#adcdfa" opacity="1" data-original="#000000"></path></g></svg>
                            Todas movimentações</button>
                        <button onClick={() => setSession(1)} className={`h-full text-sm flex items-center gap-2 border-b-2 ${session == 1 ? 'border-primary' : 'border-transparent'} hover:border-primary px-2`}>
                            <svg className='w-3 h-fit' xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 438.536 438.536" ><g><path d="M414.41 24.123C398.333 8.042 378.963 0 356.315 0H82.228C59.58 0 40.21 8.042 24.126 24.123 8.045 40.207.003 59.576.003 82.225v274.084c0 22.647 8.042 42.018 24.123 58.102 16.084 16.084 35.454 24.126 58.102 24.126h274.084c22.648 0 42.018-8.042 58.095-24.126 16.084-16.084 24.126-35.454 24.126-58.102V82.225c-.001-22.649-8.043-42.021-24.123-58.102zm-48.961 213.416c0 4.948-1.811 9.236-5.421 12.847-3.621 3.614-7.905 5.428-12.854 5.428H255.82v91.358c0 4.948-1.817 9.232-5.432 12.847-3.61 3.62-7.897 5.427-12.847 5.427h-36.543c-4.948 0-9.231-1.807-12.847-5.427-3.617-3.614-5.426-7.898-5.426-12.847v-91.358H91.363c-4.948 0-9.229-1.813-12.847-5.428-3.615-3.61-5.424-7.898-5.424-12.847v-36.547c0-4.948 1.809-9.231 5.424-12.847 3.617-3.617 7.898-5.426 12.847-5.426h91.363V91.36c0-4.949 1.809-9.233 5.426-12.847 3.616-3.618 7.898-5.428 12.847-5.428h36.543c4.949 0 9.236 1.81 12.847 5.428 3.614 3.614 5.432 7.898 5.432 12.847v91.36h91.354c4.948 0 9.232 1.809 12.854 5.426 3.613 3.615 5.421 7.898 5.421 12.847v36.546z" fill="#43df6a" opacity="1" data-original="#000000"></path></g></svg>
                            Receitas</button>
                        <button onClick={() => setSession(2)} className={`h-full text-sm flex items-center gap-2 border-b-2 ${session == 2 ? 'border-primary' : 'border-transparent'} hover:border-primary px-2`}>
                            <svg className='w-3 h-fit' xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 32 32"><g><path fill="#ed6262" d="M29 1H3a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h26a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z" opacity="1" data-original="#b41b13"></path><path fill="#98120a" d="M29 1H3a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h26a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 28H3V3h26z" opacity="1" data-original="#98120a"></path><path fill="#ffffff" d="M24 13H8a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" opacity="1" data-original="#ffffff"></path></g></svg>
                            Despesas</button>
                    </section>
                </TopBar>
                <div className='w-full px-8 pt-4 pb-10'>
                    {session == 0 && <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                        <h3 className="text-3xl font-semibold">Movimentações</h3>
                        <div className='flex gap-3'>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-black bg-white hover:shadow-md shadow-black'
                                onClick={() => { setCadastrarCategoria(true) }}
                                disabled={!(permissao >= 2)}>Gerenciar Categorias</button>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#35D15C] hover:shadow-md shadow-black'
                                onClick={() => { setNovaReceita(true) }}
                                disabled={!(permissao >= 2)}>+ Nova Receita</button>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#F45C61] hover:bg-[#ED3E44] hover:shadow-md shadow-black'
                                onClick={() => { setNovaDespesa(true) }}
                                disabled={!(permissao >= 2)}>+ Nova Despesa</button>
                        </div>
                    </div>}
                    {session == 1 && <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                        <h3 className="text-3xl font-semibold">Receitas</h3>
                        <div className='flex gap-3'>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-black bg-white hover:shadow-md shadow-black'
                                onClick={() => { setCadastrarCategoria(true) }}
                                disabled={!(permissao >= 2)}>Gerenciar Categorias</button>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#35D15C] hover:shadow-md shadow-black'
                                onClick={() => { setNovaReceita(true) }}
                                disabled={!(permissao >= 2)}>+ Nova Receita</button>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#F45C61] hover:bg-[#ED3E44] hover:shadow-md shadow-black'
                                onClick={() => { setNovaDespesa(true) }}
                                disabled={!(permissao >= 2)}>+ Nova Despesa</button>
                        </div>
                    </div>}

                    {session == 2 && <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                        <h3 className="text-3xl font-semibold">Despesas</h3>
                        <div className='flex gap-3'>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-black bg-white hover:shadow-md shadow-black'
                                onClick={() => { setCadastrarCategoria(true) }}
                                disabled={!(permissao >= 2)}>Gerenciar Categorias</button>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#35D15C] hover:shadow-md shadow-black'
                                onClick={() => { setNovaReceita(true) }}
                                disabled={!(permissao >= 2)}>+ Nova Receita</button>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#F45C61] hover:bg-[#ED3E44] hover:shadow-md shadow-black'
                                onClick={() => { setNovaDespesa(true) }}
                                disabled={!(permissao >= 2)}>+ Nova Despesa</button>
                        </div>
                    </div>}

                    <div className="flex flex-col gap-6 mb-8">
                        <div className='flex gap-4 mt-5'>
                            <label htmlFor="periodo" className="flex flex-col text-zinc-600 font-medium text-sm">
                                Período de Análise
                                <select name="periodo" id="periodo" value={periodo} onChange={(e) => {
                                    setPeriodo(e.target.value)
                                    localStorage.setItem('periodo_ph', e.target.value)
                                }} className="border border-zinc-300 rounded-md px-2 py-1 h-9 outline-none text-base">
                                    <option value="m-atual" className="text-black">Mês Atual</option>
                                    <option value="m-passado" className="text-black">Mês Passado</option>
                                    <option value="a-atual" className="text-black">Ano Atual</option>
                                    <option value="a-passado" className="text-black">Ano Passado</option>
                                    <option value="personalizado" className="text-black">Personalizado</option>
                                </select>
                            </label>
                            {session == 2 && <label htmlFor="despesas-tipo" className={`flex flex-col text-zinc-600 font-medium text-sm`}>
                                Tipo:
                                <select name="despesas-tipo" id="despesas-tipo" value={tipoDespesaFilter} className={`border border-zinc-300 rounded-md px-2 py-1 h-9 outline-none text-base`} onChange={(e) => {
                                    if (e.target.value == 'Despesas do Negócio') {
                                        setFilterAC('all')
                                    }
                                    setTipoDespesaFilter(e.target.value)
                                }}>
                                    <option value="all">Todas</option>
                                    <option value="Despesas do Negócio">Do Negócio</option>
                                    <option value="Despesas Fixas">Fixas</option>
                                    <option value="Despesas Variáveis">Variáveis</option>
                                </select>
                            </label>}
                            <label htmlFor="acomodacao" className={`flex flex-col text-zinc-600 font-medium text-sm`}>
                                Acomodação
                                <select name="acomodacao" id="acomodacao" className={`border border-zinc-300 rounded-md px-2 py-1 h-9 outline-none text-base`} value={(tipoDespesaFilter == 'Despesas do Negócio' && session == 2) ? 'all' : filterAC} disabled={(tipoDespesaFilter == 'Despesas do Negócio' && session == 2)}
                                    onChange={(e) => {
                                        setFilterAC(e.target.value)
                                        localStorage.setItem("acfil", e.target.value);
                                    }}>
                                    <option value="all" selected>Todas</option>
                                    {acomodacao.map(a => <option value={`${a.id}`}>{a.nome}</option>)}
                                </select>
                            </label>
                            {periodo == 'personalizado' ? <>
                                <label htmlFor="de" className="flex flex-col text-zinc-600 font-medium text-sm">
                                    De:
                                    <input type="date" name="de" id="de" defaultValue={deData} className="border border-zinc-300 rounded-md px-1 py-1 w-32 outline-none text-base" />
                                </label>
                                <label htmlFor="ate" className="flex flex-col text-zinc-600 font-medium text-sm">
                                    Até:
                                    <input type="date" name="ate" id="ate" defaultValue={ateData} className="border border-zinc-300 rounded-md px-1 py-1 w-32 outline-none text-base" />
                                </label>
                                <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 h-9 self-end font-medium text-white bg-primary hover:shadow-md shadow-black'
                                    onClick={() => {
                                        const inputDe = document.getElementById('de') as HTMLInputElement
                                        const inputAte = document.getElementById('ate') as HTMLInputElement
                                        if (new Date(inputDe.value) >= new Date(inputAte.value)) {
                                            const newDate = new Date(inputDe.value)
                                            newDate.setDate(newDate.getDate() + 1)
                                            const dataFormatada = newDate.toISOString().split('T')[0]
                                            setDeData(inputDe.value)
                                            inputAte.value = dataFormatada
                                            setAteData(dataFormatada)
                                            localStorage.setItem("datade", inputDe.value);
                                            localStorage.setItem("dataate", dataFormatada);
                                        } else {
                                            setDeData(inputDe.value)
                                            setAteData(inputAte.value)
                                            localStorage.setItem("datade", inputDe.value);
                                            localStorage.setItem("dataate", inputAte.value);
                                        }
                                    }}>Aplicar filtro</button>
                            </> : null}

                        </div>
                        <div className=''>
                            <p className="text-zinc-600 font-medium text-sm">Exibindo resultados de</p>
                            {periodo == 'm-atual' ?
                                <p className="text-zinc-900 font-medium text-md">{`01 de ${meses[date.getMonth()]} de ${date.getFullYear()}`} até {`${getDaysInMonth(date.getMonth() + 1, date.getFullYear())} de ${meses[date.getMonth()]} de ${date.getFullYear()}`}</p>
                                : null}
                            {periodo == 'm-passado' ?
                                <p className="text-zinc-900 font-medium text-md">{`01 de ${date.getMonth() == 0 ? meses[11] : meses[date.getMonth() - 1]} de ${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}`} até {`${getDaysInMonth(date.getMonth() == 0 ? 12 : date.getMonth(), date.getFullYear())} de ${date.getMonth() == 0 ? meses[11] : meses[date.getMonth() - 1]} de ${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}`}</p>
                                : null}
                            {periodo == 'a-atual' ?
                                <p className="text-zinc-900 font-medium text-md">{`01 de ${meses[0]} de ${date.getFullYear()}`} até {`31 de ${meses[11]} de ${date.getFullYear()}`}</p>
                                : null}
                            {periodo == 'a-passado' ?
                                <p className="text-zinc-900 font-medium text-md">{`01 de ${meses[0]} de ${date.getFullYear() - 1}`} até {`31 de ${meses[11]} de ${date.getFullYear() - 1}`}</p>
                                : null}
                            {periodo == 'personalizado' ?
                                <p className="text-zinc-900 font-medium text-md">{`${deData.split('-')[2] ? deData.split('-')[2] + ' de' : ''} ${meses[Number(deData.split('-')[1]) - 1] ? meses[Number(deData.split('-')[1]) - 1] + ' de' : ''} ${deData.split('-')[0] || ''}`} até {`${ateData.split('-')[2] ? ateData.split('-')[2] + ' de' : ''} ${meses[Number(ateData.split('-')[1]) - 1] ? meses[Number(ateData.split('-')[1]) - 1] + ' de' : ''} ${ateData.split('-')[0] || ''}`}</p>
                                : null}
                        </div>
                    </div>
                    {cadastrarCategoria && <CadastrarCategoria close={() => setCadastrarCategoria(false)}
                        permissao={permissao} />}
                    {novaDespesa && <RegistrarDespesa close={() => setNovaDespesa(false)} saas={dataToken?.id ? dataToken.id : ''} onSuccess={() => { setNovaDespesa(false); getMovimentacao(); }} />}
                    {novaReceita && <RegistrarReceita close={() => setNovaReceita(false)} saas={dataToken?.id ? dataToken.id : ''} />}
                    {session == 1 &&
                        <div className='grid grid-cols-3 gap-3'>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex flex-col justify-center items-center px-3 gap-2">
                                <p className="text-zinc-400 font-medium text-sm">Visualização</p>
                                <section className="flex gap-5">
                                    <label htmlFor="compacta" className="flex gap-2 text-sm">
                                        <input type="radio" name="Vz" id="compacta" checked={!vz} onChange={(e) => {
                                            if (e.target.value == 'on')
                                                setVz(false)
                                        }} />
                                        Compacta
                                    </label>
                                    <label htmlFor="detalhada" className="flex gap-2 text-sm">
                                        <input type="radio" name="Vz" id="detalhada" checked={vz} onChange={(e) => {
                                            if (e.target.value == 'on')
                                                setVz(true)
                                        }} />
                                        Detalhada
                                    </label>
                                </section>
                            </div>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#E6E9FD] rounded-md w-fit h-fit py-2 px-2 ml-4">
                                    <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6279F2"><path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Receita Total</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-xl">{formatarMoedaBrasileira((movimentacoes.filter(a => filterAC == 'all' || a?.acomodacao?.id == Number(filterAC))
                                            .map(mov => mov.receita ? Number(mov.valor) : 0)
                                            .reduce((acc, valor) => Number(acc) + Number(valor), 0)).toFixed(1))}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#D1F0FF] rounded-md w-fit h-fit py-2 px-2 ml-4">
                                    <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" ><g><path d="m93.9 29.7-.6-.1v-.4c-.1-1.1-.6-2-1.4-2.7s-1.8-1-2.9-.9L72.9 27l-60.8-7.7c-2.2-.3-4.2 1.3-4.5 3.5L6.3 33.1c-.9.2-1.7.6-2.3 1.3-.7.8-1 1.9-.9 2.9l1.1 12.1-1.6 13c-.1 1.1.2 2.1.8 3 .6.8 1.4 1.3 2.4 1.5L6.7 77c.2 2.1 1.9 3.6 4 3.6h.4l61-5.5 15.9 2h.5c2 0 3.7-1.5 4-3.5l.1-.4.8-.1c1.1-.1 2-.6 2.7-1.4s1-1.9.9-2.9L95.4 51l2.1-17c.2-2-1.4-4-3.6-4.3zM9.6 23.1c.1-1 1-1.8 2-1.8h.3l51.8 6.5-55.3 5zM5 64.1c-.3-.4-.5-1-.4-1.5l.5-3.8.5 5.8c-.2-.1-.4-.3-.6-.5zm83.2 11.1-6.8-.9 9.1-.8c-.2 1.1-1.2 1.8-2.3 1.7zm6.2-4.6c-.3.4-.8.7-1.3.7h-.3l-2 .2-18.6 1.7-9.5.8-51.9 4.6c-1.1.1-2.1-.7-2.2-1.8L7.7 67l-.2-2-1.3-15.5-.8-9.4-.3-3c0-.5.1-1 .5-1.5.1-.2.3-.3.4-.4.3-.1.6-.2.9-.2l1.2-.1 64.8-5.8 9.3-.8 7-.6h.2c.5 0 .9.2 1.3.5s.7.8.7 1.3l.2 2 1.8 19.7.8 9.4.8 8.7c-.1.3-.2.9-.6 1.3zm1-36.7-1 7.9-.9-10.1h.2c1.1.1 1.9 1.1 1.7 2.2z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M86.1 38.7c-1.5.1-3-.3-4.2-1.3s-1.9-2.3-2-3.9c0-.3-.2-.5-.4-.7s-.5-.3-.7-.2l-30.5 2.7L18 38c-.5.1-1 .5-.9 1.1.1 1.5-.3 3-1.3 4.2s-2.4 1.9-3.9 2c-.3 0-.5.2-.7.4s-.2.4-.2.7l1.7 19.3.1 1c0 .5.5 1 1.1.9 1.1-.1 2.2.1 3.1.6 1.7.9 2.9 2.5 3.1 4.6 0 .3.2.5.4.7s.4.2.6.2h.1L44 71.6l7.6-.7 1.7-.1L82 68.2c.3 0 .5-.2.7-.3.2-.2.3-.5.2-.7-.1-1.5.3-3 1.3-4.2s2.4-1.9 3.9-2c.3 0 .5-.2.7-.4s.3-.5.2-.7l-1.8-20.3c-.1-.6-.5-1-1.1-.9zm-3.4 23c-1.1 1.3-1.7 2.9-1.8 4.6L51.4 69l-7.3.7-9.3.8L22 71.6c-.2-1.1-.7-2.1-1.4-2.9-.8-1-1.8-1.9-3-2.4-.9-.4-1.9-.7-2.9-.7l-1.6-18.4c3.4-.8 5.9-3.7 6-7.2l29.5-2.7L78 34.6c.4 1.7 1.3 3.1 2.6 4.3 1.3 1.1 2.9 1.7 4.6 1.8l1.7 18.4c-1.6.4-3.1 1.3-4.2 2.6z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M49.9 52.1c-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3s.1-1 .5-1.4c.3-.4.8-.7 1.3-.7s1 .1 1.4.5c.4.3.7.8.7 1.3s.5 1 1.1.9c.6 0 1-.5.9-1.1-.1-1.1-.6-2-1.4-2.7-.5-.5-1.2-.7-1.9-.9l-.1-1.1c0-.5-.5-1-1.1-.9-.5 0-1 .5-.9 1.1l.1 1.1c-.7.2-1.2.6-1.7 1.2-.7.8-1 1.8-.9 2.9s.6 2 1.4 2.7 1.9 1 2.9.9c1.1-.1 2 .7 2.1 1.8 0 .5-.1 1-.5 1.4-.3.4-.8.7-1.3.7-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3 0-.6-.5-1-1.1-.9-.6 0-1 .5-.9 1.1.1 1.1.6 2 1.4 2.7.6.5 1.2.8 1.9.9l.1 1.1c0 .5.5.9 1 .9h.1c.5 0 1-.5.9-1.1l-.1-1.1c.7-.2 1.2-.6 1.7-1.2.7-.8 1-1.8.9-2.9s-.6-2-1.4-2.7c-.8-.6-1.8-1-2.9-.9z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M58.7 42.7c-2.8-2.3-6.3-3.4-9.9-3.1-7.5.7-13 7.3-12.3 14.8.3 3.6 2 6.9 4.8 9.2 2.5 2.1 5.5 3.2 8.7 3.2.4 0 .8 0 1.2-.1 7.1-.6 12.4-6.6 12.4-13.5V52c-.4-3.7-2.1-7-4.9-9.3zm-7.7 22c-3 .3-6.1-.7-8.4-2.7s-3.8-4.8-4.1-7.9c-.6-6.4 4.2-12 10.5-12.6h1.1c2.7 0 5.3.9 7.4 2.7 1.2 1 2.2 2.2 2.8 3.5.7 1.3 1.1 2.8 1.3 4.3.5 6.5-4.2 12.1-10.6 12.7zM20.9 50c-1.9 0-3.5 1.6-3.5 3.5S19 57 20.9 57s3.5-1.6 3.5-3.5c-.1-1.9-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5c-.1.8-.7 1.5-1.5 1.5zM79.1 50c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5S81 50 79.1 50zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S80 55 79.1 55z" fill="#01AAFE" opacity="1" data-original="#000000"></path></g></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Receita Líquida</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-xl">{formatarMoedaBrasileira((movimentacoes.filter(a => filterAC == 'all' || a?.acomodacao?.id == Number(filterAC))
                                            .map(mov => mov.receita ? Number(mov.valor_liq) : 0)
                                            .reduce((acc, valor) => Number(acc) + Number(valor), 0)).toFixed(1))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    {session == 2 &&
                        <div className='grid grid-cols-3 gap-3'>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#F8DCDC] rounded-md w-fit h-fit py-2 px-2 ml-4">
                                    <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" ><g><path d="m93.9 29.7-.6-.1v-.4c-.1-1.1-.6-2-1.4-2.7s-1.8-1-2.9-.9L72.9 27l-60.8-7.7c-2.2-.3-4.2 1.3-4.5 3.5L6.3 33.1c-.9.2-1.7.6-2.3 1.3-.7.8-1 1.9-.9 2.9l1.1 12.1-1.6 13c-.1 1.1.2 2.1.8 3 .6.8 1.4 1.3 2.4 1.5L6.7 77c.2 2.1 1.9 3.6 4 3.6h.4l61-5.5 15.9 2h.5c2 0 3.7-1.5 4-3.5l.1-.4.8-.1c1.1-.1 2-.6 2.7-1.4s1-1.9.9-2.9L95.4 51l2.1-17c.2-2-1.4-4-3.6-4.3zM9.6 23.1c.1-1 1-1.8 2-1.8h.3l51.8 6.5-55.3 5zM5 64.1c-.3-.4-.5-1-.4-1.5l.5-3.8.5 5.8c-.2-.1-.4-.3-.6-.5zm83.2 11.1-6.8-.9 9.1-.8c-.2 1.1-1.2 1.8-2.3 1.7zm6.2-4.6c-.3.4-.8.7-1.3.7h-.3l-2 .2-18.6 1.7-9.5.8-51.9 4.6c-1.1.1-2.1-.7-2.2-1.8L7.7 67l-.2-2-1.3-15.5-.8-9.4-.3-3c0-.5.1-1 .5-1.5.1-.2.3-.3.4-.4.3-.1.6-.2.9-.2l1.2-.1 64.8-5.8 9.3-.8 7-.6h.2c.5 0 .9.2 1.3.5s.7.8.7 1.3l.2 2 1.8 19.7.8 9.4.8 8.7c-.1.3-.2.9-.6 1.3zm1-36.7-1 7.9-.9-10.1h.2c1.1.1 1.9 1.1 1.7 2.2z" fill="#D94D52" opacity="1" data-original="#000000"></path><path d="M86.1 38.7c-1.5.1-3-.3-4.2-1.3s-1.9-2.3-2-3.9c0-.3-.2-.5-.4-.7s-.5-.3-.7-.2l-30.5 2.7L18 38c-.5.1-1 .5-.9 1.1.1 1.5-.3 3-1.3 4.2s-2.4 1.9-3.9 2c-.3 0-.5.2-.7.4s-.2.4-.2.7l1.7 19.3.1 1c0 .5.5 1 1.1.9 1.1-.1 2.2.1 3.1.6 1.7.9 2.9 2.5 3.1 4.6 0 .3.2.5.4.7s.4.2.6.2h.1L44 71.6l7.6-.7 1.7-.1L82 68.2c.3 0 .5-.2.7-.3.2-.2.3-.5.2-.7-.1-1.5.3-3 1.3-4.2s2.4-1.9 3.9-2c.3 0 .5-.2.7-.4s.3-.5.2-.7l-1.8-20.3c-.1-.6-.5-1-1.1-.9zm-3.4 23c-1.1 1.3-1.7 2.9-1.8 4.6L51.4 69l-7.3.7-9.3.8L22 71.6c-.2-1.1-.7-2.1-1.4-2.9-.8-1-1.8-1.9-3-2.4-.9-.4-1.9-.7-2.9-.7l-1.6-18.4c3.4-.8 5.9-3.7 6-7.2l29.5-2.7L78 34.6c.4 1.7 1.3 3.1 2.6 4.3 1.3 1.1 2.9 1.7 4.6 1.8l1.7 18.4c-1.6.4-3.1 1.3-4.2 2.6z" fill="#D94D52" opacity="1" data-original="#000000"></path><path d="M49.9 52.1c-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3s.1-1 .5-1.4c.3-.4.8-.7 1.3-.7s1 .1 1.4.5c.4.3.7.8.7 1.3s.5 1 1.1.9c.6 0 1-.5.9-1.1-.1-1.1-.6-2-1.4-2.7-.5-.5-1.2-.7-1.9-.9l-.1-1.1c0-.5-.5-1-1.1-.9-.5 0-1 .5-.9 1.1l.1 1.1c-.7.2-1.2.6-1.7 1.2-.7.8-1 1.8-.9 2.9s.6 2 1.4 2.7 1.9 1 2.9.9c1.1-.1 2 .7 2.1 1.8 0 .5-.1 1-.5 1.4-.3.4-.8.7-1.3.7-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3 0-.6-.5-1-1.1-.9-.6 0-1 .5-.9 1.1.1 1.1.6 2 1.4 2.7.6.5 1.2.8 1.9.9l.1 1.1c0 .5.5.9 1 .9h.1c.5 0 1-.5.9-1.1l-.1-1.1c.7-.2 1.2-.6 1.7-1.2.7-.8 1-1.8.9-2.9s-.6-2-1.4-2.7c-.8-.6-1.8-1-2.9-.9z" fill="#D94D52" opacity="1" data-original="#000000"></path><path d="M58.7 42.7c-2.8-2.3-6.3-3.4-9.9-3.1-7.5.7-13 7.3-12.3 14.8.3 3.6 2 6.9 4.8 9.2 2.5 2.1 5.5 3.2 8.7 3.2.4 0 .8 0 1.2-.1 7.1-.6 12.4-6.6 12.4-13.5V52c-.4-3.7-2.1-7-4.9-9.3zm-7.7 22c-3 .3-6.1-.7-8.4-2.7s-3.8-4.8-4.1-7.9c-.6-6.4 4.2-12 10.5-12.6h1.1c2.7 0 5.3.9 7.4 2.7 1.2 1 2.2 2.2 2.8 3.5.7 1.3 1.1 2.8 1.3 4.3.5 6.5-4.2 12.1-10.6 12.7zM20.9 50c-1.9 0-3.5 1.6-3.5 3.5S19 57 20.9 57s3.5-1.6 3.5-3.5c-.1-1.9-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5c-.1.8-.7 1.5-1.5 1.5zM79.1 50c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5S81 50 79.1 50zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S80 55 79.1 55z" fill="#D94D52" opacity="1" data-original="#000000"></path></g></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Despesa Total</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-xl">{formatarMoedaBrasileira((processedMovimentacoes.filter(a => filterAC == 'all' || a?.acomodacao?.id == Number(filterAC))
                                            .map(mov => !mov.receita ? Number(mov.valor_liq) : 0)
                                            .reduce((acc, valor) => Number(acc) + Number(valor), 0)).toFixed(1))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    {session == 0 && (
                        <div style={{ position: "relative" }}>
                            {!listagem && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
                                    <Loader />
                                </div>
                            )}
                            <ListaMovimentacoes tipo={0} ids={ids} saas={dataToken?.id} movimentacoes={processedMovimentacoes} >
                                <div className='flex flex-wrap gap-4 items-end'>
                                    {/* Ordenação */}
                                    <div className="flex flex-col min-w-[220px]">
                                        <span className="text-zinc-600 font-medium text-sm">Ordenação</span>
                                        <div className="flex gap-2">
                                            <label htmlFor="sort-key" className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                                                <select
                                                    id="sort-key"
                                                    value={sortConfig.key}
                                                    onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
                                                    className="border border-zinc-300 rounded-md px-2 py-1 h-8 outline-none text-base font-normal"
                                                >
                                                    <option value="data">Data</option>
                                                    <option value="nome">Descrição</option>
                                                    <option value="categoria">Categoria</option>
                                                    <option value="acomodacao">Acomodação</option>
                                                    <option value="valor_liq">Valor Líquido</option>
                                                    <option value="pago">Status Pagamento</option>
                                                </select>
                                            </label>
                                            <label htmlFor="sort-direction" className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                                                <select
                                                    id="sort-direction"
                                                    value={sortConfig.direction}
                                                    onChange={(e) => setSortConfig({ ...sortConfig, direction: e.target.value as 'ascending' | 'descending' })}
                                                    className="border border-zinc-300 rounded-md px-2 py-1 h-8 outline-none text-base font-normal"
                                                >
                                                    <option value="descending">Decrescente</option>
                                                    <option value="ascending">Crescente</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </ListaMovimentacoes>
                        </div>
                    )}
                    {session == 1 && (
                        <div style={{ position: "relative" }}>
                            {!listagem && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
                                    <Loader />
                                </div>
                            )}
                            <ListaMovimentacoes tipo={1} ids={ids} saas={dataToken?.id} movimentacoes={processedMovimentacoes} >
                                <div className='flex flex-wrap gap-4 items-end'>
                                    {/* Ordenação */}
                                    <div className="flex flex-col min-w-[220px]">
                                        <span className="text-zinc-600 font-medium text-sm">Ordenação</span>
                                        <div className="flex gap-2">
                                            <label htmlFor="sort-key" className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                                                <select
                                                    id="sort-key"
                                                    value={sortConfig.key}
                                                    onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
                                                    className="border border-zinc-300 rounded-md px-2 py-1 h-8 outline-none text-base font-normal"
                                                >
                                                    <option value="data">Data</option>
                                                    <option value="nome">Descrição</option>
                                                    <option value="categoria">Categoria</option>
                                                    <option value="acomodacao">Acomodação</option>
                                                    <option value="valor_liq">Valor Líquido</option>
                                                    <option value="pago">Status Pagamento</option>
                                                </select>
                                            </label>
                                            <label htmlFor="sort-direction" className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                                                <select
                                                    id="sort-direction"
                                                    value={sortConfig.direction}
                                                    onChange={(e) => setSortConfig({ ...sortConfig, direction: e.target.value as 'ascending' | 'descending' })}
                                                    className="border border-zinc-300 rounded-md px-2 py-1 h-8 outline-none text-base font-normal"
                                                >
                                                    <option value="descending">Decrescente</option>
                                                    <option value="ascending">Crescente</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </ListaMovimentacoes>
                        </div>
                    )}
                    {session == 2 && (
                        <div className='mt-4' style={{ position: "relative" }}>
                            {!listagem && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
                                    <Loader />
                                </div>
                            )}
                            {/* ...existing code for cards if session==2... */}
                            <ListaMovimentacoes tipo={2} ids={ids} saas={dataToken?.id} movimentacoes={processedMovimentacoes} >
                                <div className='flex flex-wrap gap-4 items-end'>
                                    {/* Ordenação */}
                                    <div className="flex flex-col min-w-[220px]">
                                        <span className="text-zinc-600 font-medium text-sm">Ordenação</span>
                                        <div className="flex gap-2">
                                            <label htmlFor="sort-key" className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                                                <select
                                                    id="sort-key"
                                                    value={sortConfig.key}
                                                    onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
                                                    className="border border-zinc-300 rounded-md px-2 py-1 h-8 outline-none text-base font-normal"
                                                >
                                                    <option value="data">Data</option>
                                                    <option value="nome">Descrição</option>
                                                    <option value="categoria">Categoria</option>
                                                    <option value="acomodacao">Acomodação</option>
                                                    <option value="valor_liq">Valor Líquido</option>
                                                    <option value="pago">Status Pagamento</option>
                                                </select>
                                            </label>
                                            <label htmlFor="sort-direction" className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                                                <select
                                                    id="sort-direction"
                                                    value={sortConfig.direction}
                                                    onChange={(e) => setSortConfig({ ...sortConfig, direction: e.target.value as 'ascending' | 'descending' })}
                                                    className="border border-zinc-300 rounded-md px-2 py-1 h-8 outline-none text-base font-normal"
                                                >
                                                    <option value="descending">Decrescente</option>
                                                    <option value="ascending">Crescente</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </ListaMovimentacoes>
                        </div>)}
                </div>
            </div> :
            <Loader />
    )
}