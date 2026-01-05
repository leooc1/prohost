import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import FaturamentoCanalAc from '../components/chart/FaturamentoCanalAc';
import FaturamentoDespesas from '../components/chart/FaturamentoDespesas';
import OcupacaoMedia from '../components/chart/OcupacaoMedia';
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Notify from "../components/notify/Notify";

interface Acomodacao {
    id?: number
    tipo: string
    comissao: number | null
    data_ini_ope: string
    endereco: string | null
    check_in_p: string | null
    check_out_p: string | null
    foto: string | null
    nome: string
    numero_hospedes: number
    modelo: number
    taxa_limpeza: number
    valor_imovel: number
    desativado: boolean
    saas: { id: number }
}

export default function AcomodacoesDetalhes() {
    const apiURL = import.meta.env.VITE_API_URL
    const { dataToken } = useContext(SideBarContext)
    const [loaded, setLoaded] = useState(false)
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    function formatarMoedaBrasileira(valorStr: string) {
        const valor = parseFloat(valorStr);
        if (isNaN(valor)) {
            return "Valor inválido";
        }
        if (valor < 0)
            return (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    const date = new Date()
    const [dataBW, setDataBW] = useState<[string, string]>([`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`, `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`])
    const [deData, setDeData] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`)
    const [dataBar, setDataBar] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`)
    const [ateData, setAteData] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`)
    const [periodo, setPeriodo] = useState('m-atual')
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
                if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                    return 29;
                } else {
                    return 28;
                }
            default:
                return "Mês inválido";
        }
    }

    // const [reservaView, setReservaView] = useState(false)
    // const [novaIndisponibilidade, setNovaIndisponibilidade] = useState(false)
    // const [novaReserva, setNovaReserva] = useState(false)
    // const [evento, serEvento]: any = useState()
    const [sessao, setSessao] = useState(0)
    const [graf, setGraf] = useState(false)
    const { id } = useParams()
    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)

    useEffect(() => { document.title = `${acomodacao[0]?.nome} | Prohost` }, [acomodacao])


    async function getAcomodacao() {
        if (!dataToken || !dataToken.id) return

        await fetch(`${apiURL}/acomodacao/${dataToken.id}/${id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setAcomodacao(data)
                if (!identificador)
                    setIdentificador(data[0].nome)

                if (!modelo)
                    setModelo(data[0].modelo)

                if (!taxaLimpeza)
                    setTaxaLimpeza(data[0].taxa_limpeza)

                if (!status)
                    setStatus(data[0].tipo)

                if (!iniOpe)
                    setIniOpe(data[0].data_ini_ope)

                if (!pdCO)
                    setPdCO(data[0].check_out_p)

                if (!pdCI)
                    setPdCI(data[0].check_in_p)

                if (!endereco)
                    setEndereco(data[0].endereco)

                if (!valor)
                    setValor(data[0].valor_imovel)

                if (!comissao)
                    setComissao(data[0].comissao)

                if (!foto) {
                    setFoto(data[0].foto)

                }

                if (qtdMaxHospede == -1)
                    setQtdMaxHospede(data[0].numero_hospedes)

                setLoaded(true)
            })
            .catch(err => console.log(err))

    }

    async function dataDashs() {
        if (!dataToken || !dataToken.id) return

        {
            await fetch(`${apiURL}/movimentacao/${dataToken.id}/ocupacao-semana/${dataBW[0]}/${dataBW[1]}/${id}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    if (data.length > 0)
                        setTotalDiasIntervalo(data.map((d: any) => Number(d.total_dias_no_intervalo)).reduce((sum: any, value: any) => sum + value, 0))
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/reserva/${dataToken.id}/desempenho/${dataBW[0]}/${dataBW[1]}/${id}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    const reservadas = data.reservadas
                    setTaxaOcupacao(reservadas)
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/reserva/${dataToken.id}/ind-ope/${dataBW[0]}/${dataBW[1]}/${id}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    if (data.length > 0 && data[0].total_reserva)
                        setTotalReserva(Number(data[0].total_reserva))
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/movimentacao/${dataToken.id}/result-ac/${dataBW[0]}/${dataBW[1]}/${id}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    if (data.statusCode == 500 || data.length == 0)
                        setRentabilidade([{
                            comissao_plataforma: "0",
                            despesas: "0",
                            diaria_media: "0",
                            faturamento_bruto: "0",
                            faturamento_liquido: "0",
                            lucro: "0",
                            rentabilidade_imovel: "0",
                        }])
                    else
                        setRentabilidade(data)
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/movimentacao/${dataToken.id}/fat-canal/${dataBW[0]}/${dataBW[1]}/${id}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data: []) => {
                    setFaturamentoCanal(data)
                })
                .catch(err => console.log(err))
        }
        {

            await fetch(`${apiURL}/movimentacao/${dataToken.id}/fat-bar/${dataBar}/${id}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data: []) => {
                    setFaturamento(data)
                })
                .catch(err => console.log(err))
        }
        setGraf(true)
    }

    async function updateAcomodacao(pbody: Acomodacao) {
        await fetch(`${apiURL}/acomodacao/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected == 1) {
                    setNotify({ type: 1, text: 'Atualizado!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                }
            })
            .catch(err => console.log(err))
    }

    const [identificador, setIdentificador] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const [iniOpe, setIniOpe] = useState<string | null>(null)
    const [pdCO, setPdCO] = useState<string | null>(null)
    const [pdCI, setPdCI] = useState<string | null>(null)
    const [endereco, setEndereco] = useState<string | null>(null)
    const [valor, setValor] = useState<number | null>(null)
    const [modelo, setModelo] = useState<number | null>(null)
    const [taxaLimpeza, setTaxaLimpeza] = useState<number | null>(null)
    const [comissao, setComissao] = useState<number | null>(null)
    const [foto, setFoto] = useState<string | null>(null)
    const [qtdMaxHospede, setQtdMaxHospede] = useState<number>(-1)

    async function desativar(id: number, desativado: boolean) {
        await fetch(`${apiURL}/acomodacao/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ desativado: desativado }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected == 1) {
                    if (desativado) {
                        setNotify({ type: 1, text: 'Desativado!' })
                        setShowNotify(true)
                        setTimeout(() => {
                            setShowNotify(false);
                        }, 3000)
                    } else {
                        setNotify({ type: 1, text: 'Ativado!' })
                        setShowNotify(true)
                        setTimeout(() => {
                            setShowNotify(false);
                        }, 3000)
                    }
                    location.assign('/acomodacoes')
                }
            })
            .catch(err => console.log(err))
    }

    const [totalReserva, setTotalReserva] = useState<number>(0)
    const [rentabilidade, setRentabilidade] = useState<{
        comissao_plataforma: string
        despesas: string
        diaria_media: string
        faturamento_bruto: string
        faturamento_liquido: string
        lucro: string
        rentabilidade_imovel: string | number
    }[]>([])
    const [faturamento, setFaturamento] = useState<{
        mes: string
        receita: string
        despesas: string
        faturamento_liquido: string
        receita_ano_anterior: string
    }[]>([])
    const [taxaOcupacao, setTaxaOcupacao] = useState<number>(0)
    const [totalDiasIntervalo, setTotalDiasIntervalo] = useState<number>(0)
    const [faturamentoCanal, setFaturamentoCanal] = useState<{
        mes: string
        nome:string
        cor:string
        valor_liq:string
        ano: string
        despesas: string
        faturamento_liquido: string
    }[]>([])
    useEffect(() => {
        getAcomodacao()
        const input = document.getElementById('input-file') as HTMLInputElement | null;
        const preview = document.getElementById('preview') as HTMLImageElement | null;
        if (foto && preview) {
            preview?.classList.remove('hidden')
            input?.classList.add('hidden')
            preview.src = foto || ''
        } else {
            preview?.classList.add('hidden')
            input?.classList.remove('hidden')
        }
        dataDashs()
    }, [sessao, foto, dataToken, graf])

    useEffect(() => {
        {
            if (periodo == 'm-atual') {
                const de = `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`
                const ate = `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`
                setDataBW([de, ate])
                setDataBar(ate)
            }
            else if (periodo == 'm-passado') {
                const de = `${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}-${date.getMonth() == 0 ? 12 : (`0${date.getMonth()}`).slice(-2)}-01`
                const ate = `${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}-${date.getMonth() == 0 ? 12 : (`0${date.getMonth()}`).slice(-2)}-${getDaysInMonth(date.getMonth() == 0 ? 12 : date.getMonth(), date.getFullYear())}`
                setDataBW([de, ate])
                setDataBar(ate)
            }
            else if (periodo == 'a-atual') {
                const de = `${date.getFullYear()}-01-01`
                const ate = `${date.getFullYear()}-12-31`
                setDataBW([de, ate])
                setDataBar(ate)
            }
            else if (periodo == 'a-passado') {
                const de = `${date.getFullYear() - 1}-01-01`
                const ate = `${date.getFullYear() - 1}-12-31`
                setDataBW([de, ate])
                setDataBar(ate)
            }
            else {
                const de = deData
                const ate = ateData
                setDataBW([de, ate])
                setDataBar(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`)
            }
        }
        setGraf(false)
    }, [deData, ateData, periodo])

    useEffect(() => {

        if (localStorage.getItem('periodo_ph')) {
            setPeriodo(localStorage.getItem('periodo_ph') || 'm-atual')
            if (localStorage.getItem('periodo_ph') == 'personalizado') {
                setDeData(localStorage.getItem('datade') || '')
                setAteData(localStorage.getItem('dataate') || '')
            }
        }
    }, [])

    return (
        loaded ?
            <div className="w-main px-8">
                <div className="bg-white w-full p-5">
                    <a href="/acomodacoes" className="font-medium hover:text-blue-500">←  Voltar</a>
                    <div className="flex my-5">
                        <img className="w-16 h-16 object-cover rounded-md mr-8" src={foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} alt="" />
                        <div className="flex flex-col gap-2">
                            <p className="font-bold text-3xl">{acomodacao[0]?.nome}</p>
                            <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                <div className={`bg-[${acomodacao[0]?.tipo == 'proprio' ? '#1266B5' : '#3A8E71'}] w-2 h-2 rounded-full`}></div>
                                <div className={`uppercase text-xs font-semibold text-[${acomodacao[0]?.tipo == 'proprio' ? '#1266B5' : '#3A8E71'}]`} style={{ lineHeight: 'normal', fontSize: '10px' }}>{acomodacao[0]?.tipo}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6 ">
                        <button className={`hover:bg-slate-200 font-medium px-3 py-1 rounded-3xl text-sm transition-all flex gap-1 ${sessao == 0 && 'bg-slate-200'}`}
                            onClick={() => setSessao(0)}>
                            <svg className="w-4 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" ><g><path d="M64.671 146.502C27.711 188.049 3.457 241.62 0 300.62h60.76c3.259-42.488 20.112-81.161 46.32-111.709l-42.409-42.409zM249.305 332.188c-5.113 2.581-8.305 7.726-8.305 13.432.015 12.598 17.783 19.438 26.191 9.99l52.427-58.608-70.313 35.186zM85.882 125.291l42.409 42.409c30.548-26.208 70.221-43.061 112.709-46.32v-60c-59 3.456-113.57 26.951-155.118 63.911zM271 61.38v60c42.488 3.259 82.161 20.112 112.709 46.32l42.409-42.409C384.57 88.331 330 64.836 271 61.38zM447.329 146.502l-42.409 42.409c26.208 30.547 43.061 69.221 46.32 111.709H512c-3.457-59-27.711-112.571-64.671-154.118z" fill="#000000" opacity="1" data-original="#000000" ></path><path d="M450.731 330.62c-1.307 17.011-4.142 33.83-9.835 49.98a15.007 15.007 0 0 1-19.131 9.17c-7.822-2.754-11.924-11.323-9.17-19.131a165.1 165.1 0 0 0 9.404-55.02c0-45.487-18.501-86.733-48.375-116.611a.027.027 0 0 0-.007-.004l-.007-.011C343.733 169.12 301.487 150.62 256 150.62s-87.733 18.501-117.611 48.375l-.004.007-.011.007C108.501 228.886 90 270.133 90 315.62a165.1 165.1 0 0 0 9.404 55.02c2.754 7.808-1.348 16.377-9.17 19.131-7.749 2.739-16.362-1.362-19.131-9.17-5.693-16.15-8.527-32.968-9.835-49.98H0c2.146 36.632 11.7 67.637 25.107 95.464 7.178 14.897 22.939 24.536 40.151 24.536h381.468c17.227 0 32.988-9.639 40.181-24.551 13.239-27.556 23.031-60.256 25.093-95.449h-61.269zm-55.333-72.217L289.545 375.62c-27.25 30.48-78.545 11.411-78.545-30 0-17.124 9.525-32.536 24.838-40.23.02-.009.029-.029.049-.038l141.625-70.371c.049-.024.101-.016.15-.04 14.508-7.072 28.789 10.752 17.736 23.462z" fill="#000000" opacity="1" data-original="#000000" ></path></g></svg>
                            Painel de Resultados</button>
                        {/* <button className={`hover:bg-slate-200 font-medium px-3 py-1 rounded-3xl text-sm transition-all flex gap-1 ${sessao == 1 && 'bg-slate-200'}`}
                        onClick={() => setSessao(1)}>
                        <svg className="w-4 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" ><g><path d="M452 40h-24V0h-40v40H124V0H84v40H60C26.916 40 0 66.916 0 100v352c0 33.084 26.916 60 60 60h392c33.084 0 60-26.916 60-60V100c0-33.084-26.916-60-60-60zm20 412c0 11.028-8.972 20-20 20H60c-11.028 0-20-8.972-20-20V188h432v264zm0-304H40v-48c0-11.028 8.972-20 20-20h24v40h40V80h264v40h40V80h24c11.028 0 20 8.972 20 20v48z" fill="#000000" opacity="1" data-original="#000000" ></path><path d="M76 230h40v40H76zM156 230h40v40h-40zM236 230h40v40h-40zM316 230h40v40h-40zM396 230h40v40h-40zM76 310h40v40H76zM156 310h40v40h-40zM236 310h40v40h-40zM316 310h40v40h-40zM76 390h40v40H76zM156 390h40v40h-40zM236 390h40v40h-40zM316 390h40v40h-40zM396 310h40v40h-40z" fill="#000000" opacity="1" data-original="#000000" ></path></g></svg>
                        Calendário</button> */}
                        <button className={`hover:bg-slate-200 font-medium px-3 py-1 rounded-3xl text-sm transition-all flex gap-1 ${sessao == 2 && 'bg-slate-200'}`}
                            onClick={() => setSessao(2)}>
                            <svg className="w-4 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 511" ><g><path d="M405.332 256.484c-11.797 0-21.332 9.559-21.332 21.332v170.668c0 11.754-9.559 21.332-21.332 21.332H64c-11.777 0-21.332-9.578-21.332-21.332V149.816c0-11.754 9.555-21.332 21.332-21.332h170.668c11.797 0 21.332-9.558 21.332-21.332 0-11.777-9.535-21.336-21.332-21.336H64c-35.285 0-64 28.715-64 64v298.668c0 35.286 28.715 64 64 64h298.668c35.285 0 64-28.714 64-64V277.816c0-11.796-9.54-21.332-21.336-21.332zm0 0" fill="#000000" opacity="1" data-original="#000000" className=""></path><path d="M200.02 237.05a10.793 10.793 0 0 0-2.922 5.438l-15.082 75.438c-.703 3.496.406 7.101 2.922 9.64a10.673 10.673 0 0 0 7.554 3.114c.68 0 1.387-.063 2.09-.211l75.414-15.082c2.09-.43 3.988-1.43 5.461-2.926l168.79-168.79-75.415-75.41zM496.383 16.102c-20.797-20.801-54.633-20.801-75.414 0l-29.524 29.523 75.414 75.414 29.524-29.527C506.453 81.465 512 68.066 512 53.816s-5.547-27.648-15.617-37.714zm0 0" fill="#000000" opacity="1" data-original="#000000" className=""></path></g></svg>
                            Dados de Acomodação</button>
                    </div>
                </div>
                {showNotify && <Notify type={notify.type} text={notify.text} />}
                {sessao == 0 &&
                    <section className="my-10">
                        <h5 className="font-semibold text-2xl mb-2 px-4 pb-7">Painel de Resultados</h5>
                        <div className="flex flex-col gap-6 mb-8">
                            <div className='flex gap-4'>
                                <label htmlFor="periodo" className="flex flex-col text-zinc-600 font-medium text-sm">
                                    Período de Análise
                                    <select name="periodo" id="periodo" value={periodo} onChange={(e) => { setPeriodo(e.target.value) }} className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base">
                                        <option value="m-atual" className="text-black">Mês Atual</option>
                                        <option value="m-passado" className="text-black">Mês Passado</option>
                                        <option value="a-atual" className="text-black">Ano Atual</option>
                                        <option value="a-passado" className="text-black">Ano Passado</option>
                                        <option value="personalizado" className="text-black">Personalizado</option>
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
                            <div className='flex gap-2 items-center'>
                                <p className="text-zinc-600 font-medium text-sm">Exibindo resultados de</p>
                                {periodo == 'm-atual' ?
                                    <p className="text-zinc-900 font-medium text-sm">{`01 de ${meses[date.getMonth()]} de ${date.getFullYear()}`} até {`${getDaysInMonth(date.getMonth() + 1, date.getFullYear())} de ${meses[date.getMonth()]} de ${date.getFullYear()}`}</p>
                                    : null}
                                {periodo == 'm-passado' ?
                                    <p className="text-zinc-900 font-medium text-sm">{`01 de ${date.getMonth() == 0 ? meses[11] : meses[date.getMonth() - 1]} de ${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}`} até {`${getDaysInMonth(date.getMonth() == 0 ? 12 : date.getMonth(), date.getFullYear())} de ${date.getMonth() == 0 ? meses[11] : meses[date.getMonth() - 1]} de ${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}`}</p>
                                    : null}
                                {periodo == 'a-atual' ?
                                    <p className="text-zinc-900 font-medium text-sm">{`01 de ${meses[0]} de ${date.getFullYear()}`} até {`31 de ${meses[11]} de ${date.getFullYear()}`}</p>
                                    : null}
                                {periodo == 'a-passado' ?
                                    <p className="text-zinc-900 font-medium text-sm">{`01 de ${meses[0]} de ${date.getFullYear() - 1}`} até {`31 de ${meses[11]} de ${date.getFullYear() - 1}`}</p>
                                    : null}
                                {periodo == 'personalizado' ?
                                    <p className="text-zinc-900 font-medium text-sm">{`${deData.split('-')[2] ? deData.split('-')[2] + ' de' : ''} ${meses[Number(deData.split('-')[1]) - 1] ? meses[Number(deData.split('-')[1]) - 1] + ' de' : ''} ${deData.split('-')[0] || ''}`} até {`${ateData.split('-')[2] ? ateData.split('-')[2] + ' de' : ''} ${meses[Number(ateData.split('-')[1]) - 1] ? meses[Number(ateData.split('-')[1]) - 1] + ' de' : ''} ${ateData.split('-')[0] || ''}`}</p>
                                    : null}
                            </div>
                        </div>
                        {graf && <section className='grid grid-cols-3 bg-white border-zinc-300 border rounded-lg p-4 gap-4'>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#E6E9FD] rounded-md w-fit py-2 px-2 ml-4">
                                    <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6279F2"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 10H4V19H20V10ZM15.0355 11.136L16.4497 12.5503L11.5 17.5L7.96447 13.9645L9.37868 12.5503L11.5 14.6716L15.0355 11.136ZM7 5H4V8H20V5H17V6H15V5H9V6H7V5Z"></path></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Reservas</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-3xl">{totalReserva}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                                    <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#01AAFE"><path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Receita Bruta</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-nowrap text-xl">{formatarMoedaBrasileira(rentabilidade[0].faturamento_bruto)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                                    <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" ><g><path d="m93.9 29.7-.6-.1v-.4c-.1-1.1-.6-2-1.4-2.7s-1.8-1-2.9-.9L72.9 27l-60.8-7.7c-2.2-.3-4.2 1.3-4.5 3.5L6.3 33.1c-.9.2-1.7.6-2.3 1.3-.7.8-1 1.9-.9 2.9l1.1 12.1-1.6 13c-.1 1.1.2 2.1.8 3 .6.8 1.4 1.3 2.4 1.5L6.7 77c.2 2.1 1.9 3.6 4 3.6h.4l61-5.5 15.9 2h.5c2 0 3.7-1.5 4-3.5l.1-.4.8-.1c1.1-.1 2-.6 2.7-1.4s1-1.9.9-2.9L95.4 51l2.1-17c.2-2-1.4-4-3.6-4.3zM9.6 23.1c.1-1 1-1.8 2-1.8h.3l51.8 6.5-55.3 5zM5 64.1c-.3-.4-.5-1-.4-1.5l.5-3.8.5 5.8c-.2-.1-.4-.3-.6-.5zm83.2 11.1-6.8-.9 9.1-.8c-.2 1.1-1.2 1.8-2.3 1.7zm6.2-4.6c-.3.4-.8.7-1.3.7h-.3l-2 .2-18.6 1.7-9.5.8-51.9 4.6c-1.1.1-2.1-.7-2.2-1.8L7.7 67l-.2-2-1.3-15.5-.8-9.4-.3-3c0-.5.1-1 .5-1.5.1-.2.3-.3.4-.4.3-.1.6-.2.9-.2l1.2-.1 64.8-5.8 9.3-.8 7-.6h.2c.5 0 .9.2 1.3.5s.7.8.7 1.3l.2 2 1.8 19.7.8 9.4.8 8.7c-.1.3-.2.9-.6 1.3zm1-36.7-1 7.9-.9-10.1h.2c1.1.1 1.9 1.1 1.7 2.2z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M86.1 38.7c-1.5.1-3-.3-4.2-1.3s-1.9-2.3-2-3.9c0-.3-.2-.5-.4-.7s-.5-.3-.7-.2l-30.5 2.7L18 38c-.5.1-1 .5-.9 1.1.1 1.5-.3 3-1.3 4.2s-2.4 1.9-3.9 2c-.3 0-.5.2-.7.4s-.2.4-.2.7l1.7 19.3.1 1c0 .5.5 1 1.1.9 1.1-.1 2.2.1 3.1.6 1.7.9 2.9 2.5 3.1 4.6 0 .3.2.5.4.7s.4.2.6.2h.1L44 71.6l7.6-.7 1.7-.1L82 68.2c.3 0 .5-.2.7-.3.2-.2.3-.5.2-.7-.1-1.5.3-3 1.3-4.2s2.4-1.9 3.9-2c.3 0 .5-.2.7-.4s.3-.5.2-.7l-1.8-20.3c-.1-.6-.5-1-1.1-.9zm-3.4 23c-1.1 1.3-1.7 2.9-1.8 4.6L51.4 69l-7.3.7-9.3.8L22 71.6c-.2-1.1-.7-2.1-1.4-2.9-.8-1-1.8-1.9-3-2.4-.9-.4-1.9-.7-2.9-.7l-1.6-18.4c3.4-.8 5.9-3.7 6-7.2l29.5-2.7L78 34.6c.4 1.7 1.3 3.1 2.6 4.3 1.3 1.1 2.9 1.7 4.6 1.8l1.7 18.4c-1.6.4-3.1 1.3-4.2 2.6z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M49.9 52.1c-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3s.1-1 .5-1.4c.3-.4.8-.7 1.3-.7s1 .1 1.4.5c.4.3.7.8.7 1.3s.5 1 1.1.9c.6 0 1-.5.9-1.1-.1-1.1-.6-2-1.4-2.7-.5-.5-1.2-.7-1.9-.9l-.1-1.1c0-.5-.5-1-1.1-.9-.5 0-1 .5-.9 1.1l.1 1.1c-.7.2-1.2.6-1.7 1.2-.7.8-1 1.8-.9 2.9s.6 2 1.4 2.7 1.9 1 2.9.9c1.1-.1 2 .7 2.1 1.8 0 .5-.1 1-.5 1.4-.3.4-.8.7-1.3.7-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3 0-.6-.5-1-1.1-.9-.6 0-1 .5-.9 1.1.1 1.1.6 2 1.4 2.7.6.5 1.2.8 1.9.9l.1 1.1c0 .5.5.9 1 .9h.1c.5 0 1-.5.9-1.1l-.1-1.1c.7-.2 1.2-.6 1.7-1.2.7-.8 1-1.8.9-2.9s-.6-2-1.4-2.7c-.8-.6-1.8-1-2.9-.9z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M58.7 42.7c-2.8-2.3-6.3-3.4-9.9-3.1-7.5.7-13 7.3-12.3 14.8.3 3.6 2 6.9 4.8 9.2 2.5 2.1 5.5 3.2 8.7 3.2.4 0 .8 0 1.2-.1 7.1-.6 12.4-6.6 12.4-13.5V52c-.4-3.7-2.1-7-4.9-9.3zm-7.7 22c-3 .3-6.1-.7-8.4-2.7s-3.8-4.8-4.1-7.9c-.6-6.4 4.2-12 10.5-12.6h1.1c2.7 0 5.3.9 7.4 2.7 1.2 1 2.2 2.2 2.8 3.5.7 1.3 1.1 2.8 1.3 4.3.5 6.5-4.2 12.1-10.6 12.7zM20.9 50c-1.9 0-3.5 1.6-3.5 3.5S19 57 20.9 57s3.5-1.6 3.5-3.5c-.1-1.9-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5c-.1.8-.7 1.5-1.5 1.5zM79.1 50c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5S81 50 79.1 50zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S80 55 79.1 55z" fill="#01AAFE" opacity="1" data-original="#000000"></path></g></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Receita Líquida</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-nowrap text-xl">{formatarMoedaBrasileira(rentabilidade[0].faturamento_liquido)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#FEF0D0] rounded-md w-fit py-2 px-2 ml-4">
                                    <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FAB515"><path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z"></path></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Diária Média</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-nowrap text-xl">{formatarMoedaBrasileira(rentabilidade[0].diaria_media)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#F8DCDC] rounded-md w-fit py-2 px-2 ml-4">
                                    <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D94D52"><path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Despesas</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-nowrap text-xl">{formatarMoedaBrasileira(rentabilidade[0].despesas)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
                                <div className="bg-[#E0FEEA] rounded-md w-fit py-2 px-2 ml-4">
                                    <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 484.184 484.184" ><g><path d="M309.43 219.944c-19-10.5-39.2-18.5-59.2-26.8-11.6-4.8-22.7-10.4-32.5-18.2-19.3-15.4-15.6-40.4 7-50.3 6.4-2.8 13.1-3.7 19.9-4.1 26.2-1.4 51.1 3.4 74.8 14.8 11.8 5.7 15.7 3.9 19.7-8.4 4.2-13 7.7-26.2 11.6-39.3 2.6-8.8-.6-14.6-8.9-18.3-15.2-6.7-30.8-11.5-47.2-14.1-21.4-3.3-21.4-3.4-21.5-24.9-.1-30.3-.1-30.3-30.5-30.3-4.4 0-8.8-.1-13.2 0-14.2.4-16.6 2.9-17 17.2-.2 6.4 0 12.8-.1 19.3-.1 19-.2 18.7-18.4 25.3-44 16-71.2 46-74.1 94-2.6 42.5 19.6 71.2 54.5 92.1 21.5 12.9 45.3 20.5 68.1 30.6 8.9 3.9 17.4 8.4 24.8 14.6 21.9 18.1 17.9 48.2-8.1 59.6-13.9 6.1-28.6 7.6-43.7 5.7-23.3-2.9-45.6-9-66.6-19.9-12.3-6.4-15.9-4.7-20.1 8.6-3.6 11.5-6.8 23.1-10 34.7-4.3 15.6-2.7 19.3 12.2 26.6 19 9.2 39.3 13.9 60 17.2 16.2 2.6 16.7 3.3 16.9 20.1.1 7.6.1 15.3.2 22.9.1 9.6 4.7 15.2 14.6 15.4 11.2.2 22.5.2 33.7-.1 9.2-.2 13.9-5.2 13.9-14.5 0-10.4.5-20.9.1-31.3-.5-10.6 4.1-16 14.3-18.8 23.5-6.4 43.5-19 58.9-37.8 42.8-52 26.5-128.1-34.1-161.6z" fill="#61C365" opacity="1" data-original="#000000" ></path></g></svg>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <p className="flex flex-col text-zinc-400 font-medium text-sm">Lucro</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-nowrap text-xl">{formatarMoedaBrasileira(rentabilidade[0].lucro)}</span>
                                    </div>
                                </div>
                            </div>
                        </section>}
                        {graf && <section className='grid grid-cols-3 gap-4 mt-4'>
                            <div className="relative bg-white border-zinc-300 border rounded-lg flex flex-col h-56 justify-between items-center py-3">
                                <p className="flex flex-col text-zinc-400 font-medium text-sm mb-7">Rentabilidade do Imóvel</p>
                                <div className='flex justify-between gap-4 items-center'>
                                    <div className='bg-[#E3F8E9] flex justify-center items-center rounded-full w-28 h-28 text-3xl'>
                                        {(Number(rentabilidade[0].rentabilidade_imovel) * 100).toFixed(1)}%
                                    </div>
                                    <p className='text-[10px] text-wrap w-28'>
                                        <svg className='w-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path></svg>
                                        A rentabilidade é calculada pela razão entre o faturamento do período e valor estimado do imóvel ( R$ {valor ? Number(valor).toFixed(2) : 0} )
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center justify-between h-56 py-3">
                                <p className="flex flex-col text-zinc-400 font-medium text-sm mb-7">Faturamento por Canal</p>
                                <FaturamentoCanalAc labels={faturamentoCanal.map(e => e.nome)} dados={faturamentoCanal.map(e => e.valor_liq)} colors={faturamentoCanal.map(e => e.cor)} />
                            </div>
                            <div className="relative bg-white border-zinc-300 border rounded-lg flex flex-col h-56 justify-between items-center py-3">
                                <p className="flex flex-col text-zinc-400 font-medium text-sm">Taxa de Ocupação</p>
                                <OcupacaoMedia dados={taxaOcupacao ? [Number((taxaOcupacao / (totalDiasIntervalo * (1))) * 100).toFixed(1)] : [0]} />
                                <p className="text-3xl text-center font-bold bottom-3 text-zinc-500 mb-4">{taxaOcupacao ? Number((taxaOcupacao / (totalDiasIntervalo * (1))) * 100).toFixed(1) : 0}%</p>
                            </div>
                        </section>}
                        {graf && <section className='grid mt-4'>
                            <div className="bg-white border-zinc-300 border rounded-lg flex flex-col px-2 items-center" style={{ gridArea: 'en' }}>
                                <p className="flex flex-col text-zinc-400 font-medium text-sm mb-14 mt-3">Faturamento x Despesa</p>
                                {periodo == 'm-atual' && faturamento.length > 0 ? <FaturamentoDespesas
                                    dadosLucros={faturamento.slice(-12).map(fat => Number(fat.faturamento_liquido))}
                                    dadosDespesas={faturamento.slice(-12).map(fat => Number(fat.despesas))}
                                    mes={date.getMonth() + 1} /> : null}
                                {periodo == 'm-passado' && faturamento.length > 0 ? <FaturamentoDespesas
                                    dadosLucros={faturamento.slice(-12).map(fat => Number(fat.faturamento_liquido))}
                                    dadosDespesas={faturamento.slice(-12).map(fat => Number(fat.despesas))}
                                    mes={date.getMonth() == 0 && faturamento.length > 0 ? 12 : date.getMonth()} /> : null}
                                {periodo == 'a-atual' && faturamento.length > 0 ? <FaturamentoDespesas
                                    dadosLucros={faturamento.slice(-12).map(fat => Number(fat.faturamento_liquido))}
                                    dadosDespesas={faturamento.slice(-12).map(fat => Number(fat.despesas))}
                                    mes={12} /> : null}
                                {periodo == 'a-passado' && faturamento.length > 0 ? <FaturamentoDespesas
                                    dadosLucros={faturamento.slice(-12).map(fat => Number(fat.faturamento_liquido))}
                                    dadosDespesas={faturamento.slice(-12).map(fat => Number(fat.despesas))}
                                    mes={12} /> : null}
                                {periodo == 'personalizado' && faturamento.length > 0 ? <FaturamentoDespesas
                                    dadosLucros={faturamento.slice(-12).map(fat => Number(fat.faturamento_liquido))}
                                    dadosDespesas={faturamento.slice(-12).map(fat => Number(fat.despesas))}
                                    mes={new Date(new Date(ateData).setDate(new Date(ateData).getDate() + 1)).getMonth() + 1} /> : null}
                            </div>
                        </section>}
                    </section>}
                {/*
                sessao == 1 &&
                        <section className="my-10">
                            <div className='flex justify-between items-start'>
                                <h5 className="font-semibold text-2xl mb-2 px-4 pb-7">Calendário da Acomodação</h5>
                                <div className='flex gap-5'>
                                    <button className='px-3 py-2 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
                                        onClick={() => setNovaReserva(true)}>Nova Reserva</button>
                                    {novaReserva && <NovaReserva close={() => setNovaReserva(false)} />}
                                    <button className='px-3 py-2 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#F45C61] hover:bg-[#ED3E44] hover:shadow-md shadow-black'
                                        onClick={() => setNovaIndisponibilidade(true)}>Nova Indisponibilidade</button>
                                    {novaIndisponibilidade && <NovaIndisponibilidade close={() => setNovaIndisponibilidade(false)} />}
                                </div>
                            </div>
                            <div className="mx-4 mt-4 pt-2 border border-zinc-200 rounded-md">
                                <FullCalendar
                                    headerToolbar={{
                                        start: '',
                                        center: 'title',
                                        end: 'today prev,next'
                                    }}
                                    plugins={[dayGridPlugin, timeGridPlugin]}
                                    initialView="dayGridMonth"
                                    locale={ptBrLocale}
        
                                    //reservas que buscaria do banco
                                    events={[
                                        {
                                            resourceId: '1',
                                            title: 'leonardo',
                                            start: '2024-10-01T12:00:00',
                                            end: '2024-10-05T10:00:00',
                                            hospedes: 3,
                                            color: '#3B82F6',
                                            id: '1',
                                            tipo: 'Reserva',
                                            obs: '',
                                            bruto: 200.00,
                                            liquido: 150.00,
                                            comissao: 50.00
                                        },
                                        {
                                            resourceId: '1',
                                            title: 'leonardo',
                                            start: '2024-10-06T12:00:00',
                                            end: '2024-10-08T12:00:00',
                                            hospedes: 1,
                                            color: '#30C46D',
                                            id: '2',
                                            tipo: 'Continuidade',
                                            obs: '',
                                            bruto: 50.00,
                                            liquido: 50.00,
                                            comissao: 0.00
                                        },
                                        {
                                            resourceId: '1',
                                            title: 'adm',
                                            start: '2024-10-09T12:00:00',
                                            end: '2024-10-12T12:00:00',
                                            hospedes: 1,
                                            color: '#353535',
                                            id: '3',
                                            tipo: 'Indisponibilidade',
                                            obs: 'Problema de infiltração',
                                            bruto: 0.00,
                                            liquido: 0.00,
                                            comissao: 0.00
                                        }
                                    ]}
                                    eventClick={(e) => {
                                        setReservaView(true);
                                        serEvento(e);
                                    }}
                                    eventContent={function (arg) {
                                        const title = arg.event.title;
                                        const numGuests = arg.event.extendedProps.hospedes;
                                        const tipo = arg.event.extendedProps.tipo;
                                        const obs = arg.event.extendedProps.obs;
        
                                        if (tipo === 'Continuidade') {
                                            return {
                                                html: `
                        <div class='flex overflow-hidden items-center flex-nowrap p-1 h-full relative gap-4'>
                            <svg class="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 2.54 2.54" fillRule="#000000">
                                <g>
                                    <circle cx="1.27" cy="1.27" r="1.27" fill="#ffffff" opacity="1" data-original="#ffffff"></circle>
                                    <g fill="#000">
                                        <path d="M1.143 1.944V.674a.127.127 0 0 1 .254 0v1.27a.127.127 0 0 1-.254 0z" fill="#30C46D" opacity="1" data-original="#30C46D"></path>
                                        <path d="M.635 1.182h1.27a.127.127 0 0 1 0 .254H.635a.127.127 0 0 1 0-.254z" fill="#30C46D" opacity="1" data-original="#30C46D"></path>
                                    </g>
                                </g>
                            </svg>
                            <div class='gs-event-title'>${tipo}</div>
                        </div>
                        `
                                            };
                                        } else if (tipo === 'Indisponibilidade') {
                                            return {
                                                html: `
                        <div class='flex overflow-hidden items-center flex-nowrap p-1 h-full relative gap-4'>
                            <svg class="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 426.667 426.667" style="enable-background:new 0 0 512 512" xml:space="preserve">
                                <g>
                                    <path d="M213.333 0C95.467 0 0 95.467 0 213.333s95.467 213.333 213.333 213.333S426.667 331.2 426.667 213.333 331.2 0 213.333 0zM42.667 213.333c0-94.293 76.373-170.667 170.667-170.667 39.467 0 75.627 13.547 104.533 35.947L78.613 317.867c-22.4-28.907-35.946-65.067-35.946-104.534zM213.333 384c-39.467 0-75.627-13.547-104.533-35.947L348.053 108.8C370.453 137.707 384 173.867 384 213.333 384 307.627 307.627 384 213.333 384z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                </g>
                            </svg>
                            <div class='gs-event-title'>${obs}</div>
                        </div>
                        `
                                            };
                                        } else {
                                            return {
                                                html: `
                        <div class='flex overflow-hidden justify-between items-center flex-nowrap py-1 px-2 h-full relative gap-4'>
                            <div class='gs-event-title'>${title}</div>
                            <div class='flex'>
                                <svg class="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                                </svg>${numGuests}
                            </div>
                        </div>
                        `
                                            };
                                        }
                                    }}
                                />
                                {
                                    reservaView &&
                                    <ReservaCardView
                                        close={() => setReservaView(false)}
                                        hospede={evento.event.title}
                                        qtdhospede={evento.event.extendedProps.hospedes}
                                        chegada={String(evento.event.start)}
                                        partida={String(evento.event.end)}
                                        bruto={evento.event.extendedProps.bruto}
                                        liquido={evento.event.extendedProps.liquido}
                                        comissao={evento.event.extendedProps.comissao}
                                        tipo={evento.event.extendedProps.tipo}
                                        obs={evento.event.extendedProps.obs}
                                    />
                                }
                            </div>
                        </section>*/}

                {sessao == 2 &&
                    <section className="my-10">
                        <h5 className="font-semibold text-2xl mb-2 px-4 pb-7">Dados da Acomodação</h5>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                            }}
                            className="flex flex-col w-fit px-4 gap-5 rounded-md">
                            <label htmlFor="identificador" className="flex flex-col">
                                <span className="text-zinc-500 text-xs font-medium mb-1">Identificador
                                    <span className='text-red-500 font-bold'> *</span>
                                </span>
                                <input placeholder="Ex: Apartamento Guarujá" type="text" name="identificador" id="identificador" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" value={identificador || ''} onChange={(e) => setIdentificador(e.target.value)} />
                            </label>
                            <div className={`grid gap-4 items-center ${status == 'terceiro' ? 'grid-cols-5' : 'grid-cols-4'}`}>
                                <label htmlFor="status" className="flex flex-col">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Status
                                        <span className='text-red-500 font-bold'> *</span>
                                    </span>
                                    <select name="status" id="status" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                        value={status || ''} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="" selected disabled></option>
                                        <option value="terceiro">Terceiro</option>
                                        <option value="proprio">Próprio</option>
                                    </select>
                                </label>
                                {status == 'terceiro' && <label htmlFor="comissao" className="flex flex-col">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Comissão
                                        <span className='text-red-500 font-bold'> *</span>
                                    </span>
                                    <input type="number" step={0.01} name="comissao" id="comissao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder='%'
                                        value={comissao || ''} onChange={(e) => setComissao(Number(e.target.value))} />
                                </label>}
                                <label htmlFor="inicio-operacao" className="flex flex-col">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Início de Operação
                                        <span className='text-red-500 font-bold'> *</span>
                                    </span>
                                    <input type="date" name="inicio-operacao" id="inicio-operacao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                        value={iniOpe || ''} onChange={(e) => setIniOpe(e.target.value)} />
                                </label>
                                <label htmlFor="padrao-checkout" className="flex flex-col">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Horário Padrão de Checkout
                                        <span className='text-red-500 font-bold'> *</span>
                                    </span>
                                    <input type="time" name="padrao-checkout" id="padrao-checkout" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                        value={pdCO || ''} onChange={(e) => setPdCO(e.target.value)} />
                                </label>
                                <label htmlFor="padrao-checkin" className="flex flex-col">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Horário Padrão de Checkin
                                        <span className='text-red-500 font-bold'> *</span>
                                    </span>
                                    <input type="time" name="padrao-checkin" id="padrao-checkin" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                        value={pdCI || ''} onChange={(e) => setPdCI(e.target.value)} />
                                </label>
                            </div>
                            {/*  */}
                            <div className={`grid gap-4 items-center w-full ${modelo == 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                <label htmlFor="modelo-negocio" className={`flex flex-col ${status == 'terceiro' ? 'col-span-1' : 'col-span-1'}`}>
                                    <span className="text-zinc-500 font-medium mb-1 text-xs">Modelo {status == 'terceiro' ? 'da Comissão' : 'de Negócio'}
                                        <span className='text-red-500 font-bold'> *</span>
                                    </span>
                                    <select name="modelo-negocio" id="modelo-negocio" className={`border border-zinc-300 rounded-md px-2 py-1 outline-none`} value={String(modelo)} onChange={(e) => { setModelo(Number(e.target.value)) }}>
                                        <option value="1">Taxa de limpeza inclusa</option>
                                        <option value="2">Taxa de limpeza à parte</option>
                                    </select>
                                </label>
                                {modelo == 2 && <label htmlFor="taxa-limpeza" className={`flex flex-col col-span-1`}>
                                    <span className="text-zinc-500 font-medium mb-1 text-xs">Taxa Limpeza
                                        <span className='text-red-500 font-bold'> *</span>
                                    </span>
                                    <input defaultValue={String(taxaLimpeza)} type="text" name="taxa-limpeza" id="taxa-limpeza" className={`border border-zinc-300 rounded-md px-2 py-1 outline-none`} placeholder="R$"
                                        onChange={(e) => {
                                            if (e.target.value.replace(/[.,]/gm, '').length <= 3)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})/gm, '$1,$2')
                                            else if (e.target.value.replace(/[.,]/gm, '').length <= 4)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{2})(\d{2})/gm, '$1,$2')
                                            else if (e.target.value.replace(/[.,]/gm, '').length <= 5)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{3})(\d{2})/gm, '$1,$2')
                                            else if (e.target.value.replace(/[.,]/gm, '').length <= 6)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{3})(\d{2})/gm, '$1.$2,$3')
                                            else if (e.target.value.replace(/[.,]/gm, '').length <= 7)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{2})(\d{3})(\d{2})/gm, '$1.$2,$3')
                                            else if (e.target.value.replace(/[.,]/gm, '').length <= 8)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{3})(\d{3})(\d{2})/gm, '$1.$2,$3')
                                            else if (e.target.value.replace(/[.,]/gm, '').length <= 9)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
                                            else if (e.target.value.replace(/[.,]/gm, '').length <= 10)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{2})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
                                            else if (e.target.value.replace(/[.,]/gm, '').length <= 11)
                                                e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
                                            setTaxaLimpeza(Number(e.target.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) || 0)
                                        }} />
                                </label>}
                            </div>
                            {/*  */}
                            <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '2fr 1fr' }}>
                                <label htmlFor="endereco" className="flex flex-col">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Endereço
                                    </span>
                                    <input type="text" name="endereco" id="endereco" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                        value={endereco || ''} onChange={(e) => setEndereco(e.target.value)} />
                                </label>
                                <label htmlFor="valor-imovel" className="flex flex-col">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Valor do Imóvel
                                        <span className='text-red-500 font-bold'> *</span>
                                    </span>
                                    <input type="number" name="valor-imovel" id="valor-imovel" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                        value={valor || ''} onChange={(e) => setValor(Number(e.target.value))} />
                                </label>
                            </div>
                            <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <label htmlFor="imagem" className="flex flex-col">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Foto de Capa</span>
                                    <div id="input-file" className="w-64 h-28 cursor-pointer flex border border-zinc-300 rounded-md px-1 py-1 outline-none items-center">
                                        <svg className="w-28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#777777"><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                                        <p className="text-zinc-400">Clique ou arraste uma imagem aqui</p>
                                    </div>

                                    <img id="preview" src="" alt="Pré-Visualização da Imagem" className="hidden w-64 h-28 object-contain cursor-pointer border border-zinc-300 rounded-md px-1 py-1 outline-none" />
                                    <input type="file" name="imagem" id="imagem" accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng" className="hidden"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            const input = document.getElementById('input-file') as HTMLInputElement | null;
                                            const preview = document.getElementById('preview') as HTMLImageElement | null;
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) { // 2MB
                                                    setNotify({ type: 2, text: 'A imagem deve ter no máximo 2MB!' });
                                                    setShowNotify(true);
                                                    setTimeout(() => setShowNotify(false), 3000);
                                                    e.target.value = "";
                                                    preview?.classList.add('hidden');
                                                    input?.classList.remove('hidden');
                                                    return;
                                                }
                                                if (preview) {
                                                    preview.classList.remove('hidden')
                                                    input?.classList.add('hidden')
                                                    const reader = new FileReader();
                                                    reader.onload = (event: ProgressEvent<FileReader>) => {
                                                        if (event.target) {
                                                            preview.src = event.target.result as string;
                                                            setFoto(preview.src)
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            } else {
                                                preview?.classList.add('hidden')
                                                input?.classList.remove('hidden')
                                            }
                                        }} />
                                </label>
                                <label htmlFor="qtd-max-hospede" className="flex flex-col w-fit">
                                    <span className="text-zinc-500 text-xs font-medium mb-1">Qtd. Máxima de Hóspedes</span>
                                    <div className="flex justify-center gap-3 items-center">
                                        <button type='button' className="border border-zinc-300 rounded-md w-8 h-8 font-bold bg-white" onClick={() => {
                                            if (qtdMaxHospede <= 1)
                                                return
                                            else
                                                setQtdMaxHospede(qtdMaxHospede - 1)
                                        }}>-</button>
                                        <input type="number" name="qtd-max-hospede" id="qtd-max-hospede" className="border border-zinc-300 rounded-md px-2 py-1 outline-none max-w-20 text-center"
                                            onChange={(e) => setQtdMaxHospede(Number(e.target.value))} value={qtdMaxHospede} />
                                        <button type='button' className="border border-zinc-300 rounded-md w-8 h-8 font-bold bg-white" onClick={() => setQtdMaxHospede(qtdMaxHospede + 1)}>+</button>
                                    </div>
                                </label>
                            </div>
                            <section className="flex gap-3 justify-between mt-2">
                                <button
                                    onClick={() => {
                                        if (status?.length && iniOpe?.length && identificador?.length && valor) {
                                            const fotoi = document.getElementById('preview') as HTMLImageElement
                                            if (status == 'proprio')
                                                updateAcomodacao({
                                                    "tipo": status,
                                                    "comissao": null,
                                                    "data_ini_ope": iniOpe,
                                                    "endereco": endereco,
                                                    "taxa_limpeza": taxaLimpeza || 0,
                                                    "modelo": modelo || 1,
                                                    "check_in_p": pdCI,
                                                    "check_out_p": pdCO,
                                                    "foto": fotoi.classList.contains('hidden') ? null : foto,
                                                    "nome": identificador,
                                                    "numero_hospedes": qtdMaxHospede,
                                                    "valor_imovel": valor,
                                                    "desativado": false,
                                                    "saas": {
                                                        "id": dataToken.id
                                                    }
                                                })
                                            else if (status == 'terceiro' && String(comissao).length)
                                                updateAcomodacao({
                                                    "tipo": status,
                                                    "comissao": comissao,
                                                    "data_ini_ope": iniOpe,
                                                    "endereco": endereco,
                                                    "taxa_limpeza": taxaLimpeza || 0,
                                                    "modelo": modelo || 1,
                                                    "check_in_p": pdCI,
                                                    "check_out_p": pdCO,
                                                    "foto": fotoi.classList.contains('hidden') ? null : foto,
                                                    "nome": identificador,
                                                    "numero_hospedes": qtdMaxHospede,
                                                    "valor_imovel": valor,
                                                    "desativado": false,
                                                    "saas": {
                                                        "id": dataToken.id
                                                    }
                                                })
                                        }
                                    }}
                                    className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Salvar Alterações</button>
                                <button
                                    onClick={() => desativar(Number(id), true)}
                                    className="px-3 py-2 rounded-lg bg-red-100 text-red-500">Excluir Acomodação</button>
                            </section>
                        </form>
                    </section>}
            </div>
            :
            <Loader />
    )
}