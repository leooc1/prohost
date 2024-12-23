import { useContext, useEffect, useState } from "react";
import Comparativo from "../components/Comparativo";
import DesempenhoDiarias from "../components/chart/DesempenhoDiarias";
import ReservasCanal from "../components/chart/ReservasCanal";
import OcupacaoMedia from "../components/chart/OcupacaoMedia";
import FaturamentoCanal from "../components/chart/FaturamentoCanal";
import FaturamentoLiquido from "../components/chart/FaturamentoLiquido";
import EvolucaoNegocio from "../components/chart/EvolucaoNegocio";
import QtdeHospede from "../components/chart/QtdeHospede";
import FaturamentoxDespesa from "../components/chart/FaturamentoxDespesa";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Loader from "../components/Loader";
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


export default function Dashboard() {
  const { dataToken } = useContext(SideBarContext)
  const [loaded, setLoaded] = useState(false)
  function formatarMoedaBrasileira(valorStr: string) {
    const valor = parseFloat(valorStr);
    if (isNaN(valor)) {
      return "Valor inválido";
    }
    if (valor < 0)
      return (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  const date = new Date()
  const [periodo, setPeriodo] = useState('m-atual')
  const [sessao, setSessao] = useState(0)
  const [deData, setDeData] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`)
  const [ateData, setAteData] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`)
  const [indicadores, setIndicadores] = useState<{
    total_reserva: string
    total_diaria: string | null
    duracao_media: string | null
    total_indisponivel: string | null
    total_hospede: string | null
  } | null>()
  const [resultadoAcomodacoes, setResultadoAcomodacoes] = useState<{
    comissao_plataforma: string
    despesas: string
    diaria_media: string
    faturamento_bruto: string
    faturamento_liquido: string
    lucro: string
    rentabilidade_imovel: string | number
  }[]>([])
  const [resultadoGestor, setResultadoGestor] = useState<{
    lucro_acomodacoes: string
    comissao_terceiros: string
    despesas_negocio: string
    lucro_gestor: string
  }[]>([])
  const [lucroXDespesa, setLucroXDespesa] = useState<{
    lucro_acomodacoes: string
    despesas_negocio: string
  }[]>([])
  const [reservaCanal, setReservaCanal] = useState<{
    canal_reserva: number
    nome: string
    cor: string
    num_reserva: string
  }[]>([])
  const [qtdHospede, setQtdHospede] = useState<{
    qtd_hospede: number
    qtd_reserva: string
  }[]>([])

  const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
  const [filterAC, setFilterAC] = useState<string>('all')
  const [movimentacao, setMovimentacao] = useState<{
    nome: string
    cor: string
    tipo_reserva: string
    valor_liq: number
  }[]>([])
  const [desempenhoDiarias, setDesempenhoDiarias] = useState<{
    reservadas: number,
    indisponiveis: number,
    ociosas: number
  }>()
  const [faturamento, setFaturamento] = useState<{
    mes: string
    receita: string
    despesa: string
    receita_ano_anterior: string
  }[]>([])
  const [taxaOcupacao, setTaxaOcupacao] = useState<{
    taxa_ocupacao: number
  }>()
  const [resAc, setResAc] = useState<boolean>(false)
  const [resGestor, setResGestor] = useState<boolean>(false)
  const [indiOpe, setIndiOpe] = useState<boolean>(false)

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

  async function acomodacoes() {
    await fetch(`http://localhost:3000/acomodacao/${dataToken.id}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then((data: Acomodacao[]) => {
        setAcomodacao(data.filter((e => !e.desativado)))
      })
      .catch(err => console.log(err))
  }

  async function resultAc() {
    if (filterAC == 'all') {
      await fetch(`http://localhost:3000/movimentacao/${dataToken.id}/fat-canal/${dataBW[0]}/${dataBW[1]}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data: []) => {
          setMovimentacao(data)
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/movimentacao/${dataToken.id}/fat-bar/${dataBar}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data: []) => {
          setFaturamento(data)
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/movimentacao/${dataToken.id}/result-ac/${dataBW[0]}/${dataBW[1]}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          if (data.statusCode == 500)
            setResultadoAcomodacoes([{
              comissao_plataforma: "0",
              despesas: "0",
              diaria_media: "0",
              faturamento_bruto: "0",
              faturamento_liquido: "0",
              lucro: "0",
              rentabilidade_imovel: 0,
            }])
          else
            setResultadoAcomodacoes(data)
        })
        .catch(err => console.log(err))

    }
    else {
      await fetch(`http://localhost:3000/movimentacao/${dataToken.id}/fat-canal/${dataBW[0]}/${dataBW[1]}/${filterAC}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data: []) => {
          setMovimentacao(data)
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/movimentacao/${dataToken.id}/fat-bar/${dataBar}/${filterAC}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data: []) => {
          setFaturamento(data)
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/movimentacao/${dataToken.id}/result-ac/${dataBW[0]}/${dataBW[1]}/${filterAC}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          if (data.statusCode == 500 || data.length == 0)
            setResultadoAcomodacoes([{
              comissao_plataforma: "0",
              despesas: "0",
              diaria_media: "0",
              faturamento_bruto: "0",
              faturamento_liquido: "0",
              lucro: "0",
              rentabilidade_imovel: 0,
            }])
          else
            setResultadoAcomodacoes(data)
        })
        .catch(err => console.log(err))
    }

    setResAc(true)
  }

  async function indicaOpe() {
    if (filterAC == 'all') {
      await fetch(`http://localhost:3000/reserva/${dataToken.id}/ind-ope/${dataBW[0]}/${dataBW[1]}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          if (data.length > 0)
            setIndicadores(data[0])
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/taxa-ocu/${dataBW[0]}/${dataBW[1]}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          if (data.length > 0)
            setTaxaOcupacao(data[0])
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/por-canal/${dataBW[0]}/${dataBW[1]}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          setReservaCanal(data)
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/qtd-hospede/${dataBW[0]}/${dataBW[1]}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          setQtdHospede(data)
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/desempenho/${dataBW[0]}/${dataBW[1]}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          setDesempenhoDiarias(data)
        })
        .catch(err => console.log(err))
    }
    else {

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/ind-ope/${dataBW[0]}/${dataBW[1]}/${filterAC}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          if (data.length > 0)
            setIndicadores(data[0])
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/taxa-ocu/${dataBW[0]}/${dataBW[1]}/${filterAC}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          if (data.length > 0)
            setTaxaOcupacao(data[0])
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/por-canal/${dataBW[0]}/${dataBW[1]}/${filterAC}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          setReservaCanal(data)
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/qtd-hospede/${dataBW[0]}/${dataBW[1]}/${filterAC}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          setQtdHospede(data)
        })
        .catch(err => console.log(err))

      await fetch(`http://localhost:3000/reserva/${dataToken.id}/desempenho/${dataBW[0]}/${dataBW[1]}/${filterAC}`, {
        method: 'GET'
      })
        .then(data => data.json())
        .then((data) => {
          setDesempenhoDiarias(data)
        })
        .catch(err => console.log(err))

    }

    setIndiOpe(true)
  }

  async function resultGest() {
    await fetch(`http://localhost:3000/movimentacao/${dataToken.id}/result-gestor/${dataBW[0]}/${dataBW[1]}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then((data: []) => {
        setResultadoGestor(data)
      })
      .catch(err => console.log(err))

    const inicioDate = dataBW[0].slice(0, 4) + '-01-01'
    const finalDate = periodo == 'personalizado' ? dataBW[1] : dataBW[1].slice(0, 4) + '-12-31'
    await fetch(`http://localhost:3000/movimentacao/${dataToken.id}/lucroxdespesa/${inicioDate}/${finalDate}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then((data: []) => {
        setLucroXDespesa(data)
      })
      .catch(err => console.log(err))

    setResGestor(true)
  }

  async function loadAll() {
    await acomodacoes()
    await resultAc()
    await resultGest()
    await indicaOpe()
    setLoaded(true)
  }
  const [dataBW, setDataBW] = useState<[string, string]>([`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`, `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`])
  const [dataBar, setDataBar] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`)

  useEffect(() => {
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

    setIndiOpe(false)
    setResAc(false)
    setResGestor(false)
  }, [periodo, deData, ateData, filterAC])

  useEffect(() => {
    if (location.search) {
      const ss = Number(location.search.replace('?ss=', ''))
      setSessao(ss)
    }
    loadAll()
  }, [resAc, indiOpe, resGestor, dataToken])

  return (
    loaded ?
      <div className="w-full px-8">
        <h3 className="text-3xl font-semibold mb-7 pt-2">Painel do Negócio</h3>
        <div className="flex flex-wrap gap-4 mb-8">
          <label htmlFor="periodo" className="flex flex-col text-zinc-600 font-medium text-sm">
            Período de Análise
            <select name="periodo" id="periodo" onChange={(e) => { setPeriodo(e.target.value) }} className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base">
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
              <input type="date" name="de" id="de" onChange={(e) => { setDeData(e.target.value) }} className="border border-zinc-300 rounded-md px-1 py-1 w-32 outline-none text-base" />
            </label>
            <label htmlFor="ate" className="flex flex-col text-zinc-600 font-medium text-sm">
              Até:
              <input type="date" name="ate" id="ate" onChange={(e) => { setAteData(e.target.value) }} className="border border-zinc-300 rounded-md px-1 py-1 w-32 outline-none text-base" />
            </label>
          </> : null}
          <div>
            <p className="text-zinc-600 font-medium text-sm">Exibindo resultados de</p>
            {periodo == 'm-atual' ?
              <p className="text-zinc-900 font-medium text-lg">{`01 de ${meses[date.getMonth()]} de ${date.getFullYear()}`} até {`${getDaysInMonth(date.getMonth() + 1, date.getFullYear())} de ${meses[date.getMonth()]} de ${date.getFullYear()}`}</p>
              : null}
            {periodo == 'm-passado' ?
              <p className="text-zinc-900 font-medium text-lg">{`01 de ${date.getMonth() == 0 ? meses[11] : meses[date.getMonth() - 1]} de ${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}`} até {`${getDaysInMonth(date.getMonth() == 0 ? 12 : date.getMonth(), date.getFullYear())} de ${date.getMonth() == 0 ? meses[11] : meses[date.getMonth() - 1]} de ${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}`}</p>
              : null}
            {periodo == 'a-atual' ?
              <p className="text-zinc-900 font-medium text-lg">{`01 de ${meses[0]} de ${date.getFullYear()}`} até {`31 de ${meses[11]} de ${date.getFullYear()}`}</p>
              : null}
            {periodo == 'a-passado' ?
              <p className="text-zinc-900 font-medium text-lg">{`01 de ${meses[0]} de ${date.getFullYear() - 1}`} até {`31 de ${meses[11]} de ${date.getFullYear() - 1}`}</p>
              : null}
            {periodo == 'personalizado' ?
              <p className="text-zinc-900 font-medium text-lg">{`${deData.split('-')[2] ? deData.split('-')[2] + ' de' : ''} ${meses[Number(deData.split('-')[1]) - 1] ? meses[Number(deData.split('-')[1]) - 1] + ' de' : ''} ${deData.split('-')[0] || ''}`} até {`${ateData.split('-')[2] ? ateData.split('-')[2] + ' de' : ''} ${meses[Number(ateData.split('-')[1]) - 1] ? meses[Number(ateData.split('-')[1]) - 1] + ' de' : ''} ${ateData.split('-')[0] || ''}`}</p>
              : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mb-6">
          <button className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 0 ? 'bg-slate-200 text-blue-700' : 'text-zinc-700'}`} onClick={() => { setSessao(0); location.search = 'ss=0' }}>Indicadores Operacionais</button>
          <button className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 1 ? 'bg-slate-200 text-blue-700' : 'text-zinc-700'}`} onClick={() => { setSessao(1); location.search = 'ss=1' }}>Resultados das Acomodações</button>
          <button className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 2 ? 'bg-slate-200 text-blue-700' : 'text-zinc-700'}`} onClick={() => { setSessao(2); location.search = 'ss=2' }}>Resultados do Gestor</button>
        </div>
        <h4 className="text-2xl font-semibold mb-6">
          {sessao == 0 ? 'Indicadores Operacionais' : null}
          {sessao == 1 ? 'Resultados das Acomodações' : null}
          {sessao == 2 ? 'Resultados do Gestor' : null}
        </h4>
        {sessao != 2 ? <div>
          <label htmlFor="acomodacao" className={`flex flex-col w-fit mb-8`}>
            <select name="acomodacao" id="acomodacao" className={`border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none`}
              onChange={(e) => {
                setFilterAC(e.target.value)
              }}>
              <option value="all" selected>Todas acomodações</option>
              {acomodacao.length ?
                acomodacao.map(e => <option value={`${e.id}`}>{e.nome}</option>)
                : null
              }
            </select>
          </label>
        </div> : null}
        {sessao == 0 && indiOpe ?
          <section className="grid gap-5 mb-24 grid-cols-3 grid-rows-5 h-[600px]">
            <div className="relative bg-white border-zinc-300 border rounded-lg flex flex-col justify-between items-center row-span-2 py-1 h-full">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Taxa de Ocupação Média</p>
              <div className="">
                <OcupacaoMedia dados={taxaOcupacao?.taxa_ocupacao ? [Number(taxaOcupacao?.taxa_ocupacao.toFixed(1))] : [0]} />
                <p className="text-3xl text-center font-bold bottom-3 text-zinc-500 mb-4">{taxaOcupacao?.taxa_ocupacao ? taxaOcupacao.taxa_ocupacao.toFixed(1) : 0}%</p>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center">
              <div className="bg-[#E6E9FD] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6279F2"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 10H4V19H20V10ZM15.0355 11.136L16.4497 12.5503L11.5 17.5L7.96447 13.9645L9.37868 12.5503L11.5 14.6716L15.0355 11.136ZM7 5H4V8H20V5H17V6H15V5H9V6H7V5Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Total de Reservas</p>
                <div className="flex items-end gap-4">
                  <span className="text-3xl">{indicadores?.total_reserva}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-44 flex flex-col justify-between items-center py-1 row-span-2" >
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Desempenho das Diárias</p>
              <DesempenhoDiarias dados={[desempenhoDiarias?.reservadas || 0, desempenhoDiarias?.ociosas || 0, desempenhoDiarias?.indisponiveis || 0]} />
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" >
              <div className="bg-[#E9F7FD] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#63C3F2"><path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Diárias reservadas</p>
                <div className="flex items-end gap-4">
                  <span className="text-3xl">{indicadores?.total_diaria ? indicadores?.total_diaria : 0}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="relative bg-white border-zinc-300 border rounded-lg h-80 flex flex-col justify-between items-center py-1 row-span-3">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Ocupação nos Dias da Semana</p>
              <section className="grid grid-rows-7 grid-cols-2 gap-4 mb-2 w-full px-9">
                <p>Segunda</p>
                <p className="text-end">10.0%</p>
                <p>Terça</p>
                <p className="text-end">10.0%</p>
                <p>Quarta</p>
                <p className="text-end">10.0%</p>
                <p>Quinta</p>
                <p className="text-end">10.0%</p>
                <p>Sexta</p>
                <p className="text-end">10.0%</p>
                <p>Sabado</p>
                <p className="text-end">10.0%</p>
                <p>Domingo</p>
                <p className="text-end">10.0%</p>
              </section>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" >
              <div className="bg-[#F7D3AB] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FEB158"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path></svg>            </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Duração Média das Reservas</p>
                <div className="flex items-end gap-4">
                  <span className="text-3xl">{indicadores?.duracao_media ? Number(indicadores?.duracao_media).toFixed(1) : 0}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-44 -translate-y-12 flex flex-col justify-between items-center py-1 row-span-2" >
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Reservas por Canal</p>
              <ReservasCanal labels={reservaCanal.length > 0 ? reservaCanal.map(r => r.nome) : []} dados={reservaCanal.length > 0 ? reservaCanal.map(r => Number(r.num_reserva)) : []} colors={reservaCanal.length > 0 ? reservaCanal.map(r => r.cor) : []} />
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" >
              <div className="bg-[#FDE3E4] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M9 3V1H7V3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H17V1H15V3H9ZM4 10H20V19H4V10ZM4 5H7V6H9V5H15V6H17V5H20V8H4V5ZM9.87862 10.9644L12 13.0858L14.1212 10.9644L15.5355 12.3785L13.4142 14.5001L15.5354 16.6212L14.1213 18.0354L12 15.9143L9.87855 18.0354L8.46442 16.6211L10.5857 14.5001L8.46436 12.3785L9.87862 10.9644Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Reservas Indisponíveis</p>
                <div className="flex items-end gap-4">
                  <span className="text-3xl">{indicadores?.total_indisponivel ? indicadores?.total_indisponivel : 0}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" >
              <div className="bg-[#F2F2F2] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111827"><path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Total de Hóspedes</p>
                <div className="flex items-end gap-4">
                  <span className="text-3xl">{indicadores?.total_hospede || 0}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-44 -translate-y-24 flex flex-col justify-between items-center py-1" >
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Quantidade de hospedes</p>
              <QtdeHospede labels={qtdHospede.map(h => String(h.qtd_hospede))} dados={qtdHospede.map(h => Number(h.qtd_reserva))} colors={['#9cdcde', '#88a9bc', '#d99e9a', '#d9bcb8', '#f6e4b6', '#f3e589', '#e674bc', '#f9b4ed', '#d9bffe', '#96d7ff', '#f1e2b9', '#f2b9c8', '#b9d7f1', '#baf2e9', '#b0f2b4']} />
            </div>
          </section> : null}
        {sessao == 1 && resAc ?
          <section className="grid gap-5 mb-10 grid-rows-10" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center h-full row-span-3 w-full">
              <p className="flex flex-col text-zinc-400 font-medium text-sm mb-7 mt-3">Faturamento por Canal</p>
              <FaturamentoCanal labels={movimentacao.map(m => m.nome)}
                dados={movimentacao.map(m => m.valor_liq)} colors={movimentacao.map(m => m.cor)} />
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center h-full row-span-5">
              <p className="flex flex-col text-zinc-400 font-medium text-sm mb-16 mt-3">Faturamento X Despesas</p>
              {periodo == 'm-atual' ? <FaturamentoxDespesa
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.despesa))} mes={date.getMonth()} /> : null}
              {periodo == 'm-passado' ? <FaturamentoxDespesa
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.despesa))} mes={date.getMonth() == 0 ? 11 : date.getMonth() - 1} /> : null}
              {periodo == 'a-atual' ? <FaturamentoxDespesa
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.despesa))} mes={11} /> : null}
              {periodo == 'a-passado' ? <FaturamentoxDespesa
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.despesa))} mes={11} /> : null}
              {periodo == 'personalizado' ? <FaturamentoxDespesa
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.despesa))} mes={date.getMonth()} /> : null}
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
              <div className="bg-[#D8D8D8] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#898989"><path d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C13.6418 20 15.1681 19.5054 16.4381 18.6571L17.5476 20.3214C15.9602 21.3818 14.0523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V13.5C22 15.433 20.433 17 18.5 17C17.2958 17 16.2336 16.3918 15.6038 15.4659C14.6942 16.4115 13.4158 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C13.1258 7 14.1647 7.37209 15.0005 8H17V13.5C17 14.3284 17.6716 15 18.5 15C19.3284 15 20 14.3284 20 13.5V12ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z"></path></svg>            </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Rentabilidade o Imóvel</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{Number(resultadoAcomodacoes[0].rentabilidade_imovel).toFixed(2)} %</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
              <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#01AAFE"><path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Faturamento Bruto</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoAcomodacoes[0].faturamento_bruto).toFixed(1))}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
              <div className="bg-[#FCE0E1] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Comissão das Plataformas</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoAcomodacoes[0].comissao_plataforma).toFixed(1))}</span>
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center h-full row-span-5">
              <p className="flex flex-col text-zinc-400 font-medium text-sm mb-16 mt-3">Comparativo de Faturamento Líquido</p>
              {periodo == 'm-atual' ? <FaturamentoLiquido
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.receita_ano_anterior))} mes={date.getMonth()} /> : null}
              {periodo == 'm-passado' ? <FaturamentoLiquido
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.receita_ano_anterior))} mes={date.getMonth() == 0 ? 11 : date.getMonth() - 1} /> : null}
              {periodo == 'a-atual' ? <FaturamentoLiquido
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.receita_ano_anterior))} mes={11} /> : null}
              {periodo == 'a-passado' ? <FaturamentoLiquido
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.receita_ano_anterior))} mes={11} /> : null}
              {periodo == 'personalizado' ? <FaturamentoLiquido
                dadosAtuais={faturamento.map(fat => Number(fat.receita))}
                dadosPassado={faturamento.map(fat => Number(fat.receita_ano_anterior))} mes={date.getMonth()} /> : null}
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
              <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" ><g><path d="m93.9 29.7-.6-.1v-.4c-.1-1.1-.6-2-1.4-2.7s-1.8-1-2.9-.9L72.9 27l-60.8-7.7c-2.2-.3-4.2 1.3-4.5 3.5L6.3 33.1c-.9.2-1.7.6-2.3 1.3-.7.8-1 1.9-.9 2.9l1.1 12.1-1.6 13c-.1 1.1.2 2.1.8 3 .6.8 1.4 1.3 2.4 1.5L6.7 77c.2 2.1 1.9 3.6 4 3.6h.4l61-5.5 15.9 2h.5c2 0 3.7-1.5 4-3.5l.1-.4.8-.1c1.1-.1 2-.6 2.7-1.4s1-1.9.9-2.9L95.4 51l2.1-17c.2-2-1.4-4-3.6-4.3zM9.6 23.1c.1-1 1-1.8 2-1.8h.3l51.8 6.5-55.3 5zM5 64.1c-.3-.4-.5-1-.4-1.5l.5-3.8.5 5.8c-.2-.1-.4-.3-.6-.5zm83.2 11.1-6.8-.9 9.1-.8c-.2 1.1-1.2 1.8-2.3 1.7zm6.2-4.6c-.3.4-.8.7-1.3.7h-.3l-2 .2-18.6 1.7-9.5.8-51.9 4.6c-1.1.1-2.1-.7-2.2-1.8L7.7 67l-.2-2-1.3-15.5-.8-9.4-.3-3c0-.5.1-1 .5-1.5.1-.2.3-.3.4-.4.3-.1.6-.2.9-.2l1.2-.1 64.8-5.8 9.3-.8 7-.6h.2c.5 0 .9.2 1.3.5s.7.8.7 1.3l.2 2 1.8 19.7.8 9.4.8 8.7c-.1.3-.2.9-.6 1.3zm1-36.7-1 7.9-.9-10.1h.2c1.1.1 1.9 1.1 1.7 2.2z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M86.1 38.7c-1.5.1-3-.3-4.2-1.3s-1.9-2.3-2-3.9c0-.3-.2-.5-.4-.7s-.5-.3-.7-.2l-30.5 2.7L18 38c-.5.1-1 .5-.9 1.1.1 1.5-.3 3-1.3 4.2s-2.4 1.9-3.9 2c-.3 0-.5.2-.7.4s-.2.4-.2.7l1.7 19.3.1 1c0 .5.5 1 1.1.9 1.1-.1 2.2.1 3.1.6 1.7.9 2.9 2.5 3.1 4.6 0 .3.2.5.4.7s.4.2.6.2h.1L44 71.6l7.6-.7 1.7-.1L82 68.2c.3 0 .5-.2.7-.3.2-.2.3-.5.2-.7-.1-1.5.3-3 1.3-4.2s2.4-1.9 3.9-2c.3 0 .5-.2.7-.4s.3-.5.2-.7l-1.8-20.3c-.1-.6-.5-1-1.1-.9zm-3.4 23c-1.1 1.3-1.7 2.9-1.8 4.6L51.4 69l-7.3.7-9.3.8L22 71.6c-.2-1.1-.7-2.1-1.4-2.9-.8-1-1.8-1.9-3-2.4-.9-.4-1.9-.7-2.9-.7l-1.6-18.4c3.4-.8 5.9-3.7 6-7.2l29.5-2.7L78 34.6c.4 1.7 1.3 3.1 2.6 4.3 1.3 1.1 2.9 1.7 4.6 1.8l1.7 18.4c-1.6.4-3.1 1.3-4.2 2.6z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M49.9 52.1c-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3s.1-1 .5-1.4c.3-.4.8-.7 1.3-.7s1 .1 1.4.5c.4.3.7.8.7 1.3s.5 1 1.1.9c.6 0 1-.5.9-1.1-.1-1.1-.6-2-1.4-2.7-.5-.5-1.2-.7-1.9-.9l-.1-1.1c0-.5-.5-1-1.1-.9-.5 0-1 .5-.9 1.1l.1 1.1c-.7.2-1.2.6-1.7 1.2-.7.8-1 1.8-.9 2.9s.6 2 1.4 2.7 1.9 1 2.9.9c1.1-.1 2 .7 2.1 1.8 0 .5-.1 1-.5 1.4-.3.4-.8.7-1.3.7-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3 0-.6-.5-1-1.1-.9-.6 0-1 .5-.9 1.1.1 1.1.6 2 1.4 2.7.6.5 1.2.8 1.9.9l.1 1.1c0 .5.5.9 1 .9h.1c.5 0 1-.5.9-1.1l-.1-1.1c.7-.2 1.2-.6 1.7-1.2.7-.8 1-1.8.9-2.9s-.6-2-1.4-2.7c-.8-.6-1.8-1-2.9-.9z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M58.7 42.7c-2.8-2.3-6.3-3.4-9.9-3.1-7.5.7-13 7.3-12.3 14.8.3 3.6 2 6.9 4.8 9.2 2.5 2.1 5.5 3.2 8.7 3.2.4 0 .8 0 1.2-.1 7.1-.6 12.4-6.6 12.4-13.5V52c-.4-3.7-2.1-7-4.9-9.3zm-7.7 22c-3 .3-6.1-.7-8.4-2.7s-3.8-4.8-4.1-7.9c-.6-6.4 4.2-12 10.5-12.6h1.1c2.7 0 5.3.9 7.4 2.7 1.2 1 2.2 2.2 2.8 3.5.7 1.3 1.1 2.8 1.3 4.3.5 6.5-4.2 12.1-10.6 12.7zM20.9 50c-1.9 0-3.5 1.6-3.5 3.5S19 57 20.9 57s3.5-1.6 3.5-3.5c-.1-1.9-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5c-.1.8-.7 1.5-1.5 1.5zM79.1 50c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5S81 50 79.1 50zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S80 55 79.1 55z" fill="#01AAFE" opacity="1" data-original="#000000"></path></g></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Faturamento Líquido</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoAcomodacoes[0].faturamento_liquido).toFixed(1))}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
              <div className="bg-[#F8DCDC] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D94D52"><path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path></svg>            </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Despesas (exceto negócio)</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoAcomodacoes[0].despesas).toFixed(1))}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
              <div className="bg-[#E0FEEA] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 484.184 484.184" ><g><path d="M309.43 219.944c-19-10.5-39.2-18.5-59.2-26.8-11.6-4.8-22.7-10.4-32.5-18.2-19.3-15.4-15.6-40.4 7-50.3 6.4-2.8 13.1-3.7 19.9-4.1 26.2-1.4 51.1 3.4 74.8 14.8 11.8 5.7 15.7 3.9 19.7-8.4 4.2-13 7.7-26.2 11.6-39.3 2.6-8.8-.6-14.6-8.9-18.3-15.2-6.7-30.8-11.5-47.2-14.1-21.4-3.3-21.4-3.4-21.5-24.9-.1-30.3-.1-30.3-30.5-30.3-4.4 0-8.8-.1-13.2 0-14.2.4-16.6 2.9-17 17.2-.2 6.4 0 12.8-.1 19.3-.1 19-.2 18.7-18.4 25.3-44 16-71.2 46-74.1 94-2.6 42.5 19.6 71.2 54.5 92.1 21.5 12.9 45.3 20.5 68.1 30.6 8.9 3.9 17.4 8.4 24.8 14.6 21.9 18.1 17.9 48.2-8.1 59.6-13.9 6.1-28.6 7.6-43.7 5.7-23.3-2.9-45.6-9-66.6-19.9-12.3-6.4-15.9-4.7-20.1 8.6-3.6 11.5-6.8 23.1-10 34.7-4.3 15.6-2.7 19.3 12.2 26.6 19 9.2 39.3 13.9 60 17.2 16.2 2.6 16.7 3.3 16.9 20.1.1 7.6.1 15.3.2 22.9.1 9.6 4.7 15.2 14.6 15.4 11.2.2 22.5.2 33.7-.1 9.2-.2 13.9-5.2 13.9-14.5 0-10.4.5-20.9.1-31.3-.5-10.6 4.1-16 14.3-18.8 23.5-6.4 43.5-19 58.9-37.8 42.8-52 26.5-128.1-34.1-161.6z" fill="#61C365" opacity="1" data-original="#000000" ></path></g></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Lucro das Acomodações</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoAcomodacoes[0].lucro).toFixed(1))}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
              <div className="bg-[#FEF0D0] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FAB515"><path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Diária Média</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoAcomodacoes[0].diaria_media).toFixed(1))}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
          </section> : null}
        {sessao == 2 && resGestor ?
          <section className="grid gap-5 mb-10" style={{
            gridTemplateAreas:
              `'lap lap lap en en en en'
         'cat cat cat en en en en'
         'dn dn dn en en en en'
         'lg lg lg en en en en'`,
            gridTemplateColumns: '1fr 0.8fr 0fr 1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr 1fr'
          }}>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'lap' }}>
              <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#01AAFE"><path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Lucro das Acomodações Proprias</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoGestor[0].lucro_acomodacoes).toFixed(1))}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'cat' }}>
              <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6279F2"><path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Comissão das Acomodações de Terceiros</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoGestor[0].comissao_terceiros).toFixed(1))}</span>
                  <Comparativo number={0} />
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'dn' }}>
              <div className="bg-[#F8DCDC] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6 fill-[#D94D52]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48l45.5 0c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5L488 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-288.3 0c-11.5 0-21.4-8.2-23.6-19.5L170.7 288l288.5 0c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32L360 32l0 102.1 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-64 64c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23L312 32 120.1 32C111 12.8 91.6 0 69.5 0L24 0zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" /></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Despesas de Negócio</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoGestor[0].despesas_negocio).toFixed(1))}</span>
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'lg' }}>
              <div className="bg-[#E0FEEA] rounded-md w-fit py-2 px-2 ml-4">
                <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 484.184 484.184" ><g><path d="M309.43 219.944c-19-10.5-39.2-18.5-59.2-26.8-11.6-4.8-22.7-10.4-32.5-18.2-19.3-15.4-15.6-40.4 7-50.3 6.4-2.8 13.1-3.7 19.9-4.1 26.2-1.4 51.1 3.4 74.8 14.8 11.8 5.7 15.7 3.9 19.7-8.4 4.2-13 7.7-26.2 11.6-39.3 2.6-8.8-.6-14.6-8.9-18.3-15.2-6.7-30.8-11.5-47.2-14.1-21.4-3.3-21.4-3.4-21.5-24.9-.1-30.3-.1-30.3-30.5-30.3-4.4 0-8.8-.1-13.2 0-14.2.4-16.6 2.9-17 17.2-.2 6.4 0 12.8-.1 19.3-.1 19-.2 18.7-18.4 25.3-44 16-71.2 46-74.1 94-2.6 42.5 19.6 71.2 54.5 92.1 21.5 12.9 45.3 20.5 68.1 30.6 8.9 3.9 17.4 8.4 24.8 14.6 21.9 18.1 17.9 48.2-8.1 59.6-13.9 6.1-28.6 7.6-43.7 5.7-23.3-2.9-45.6-9-66.6-19.9-12.3-6.4-15.9-4.7-20.1 8.6-3.6 11.5-6.8 23.1-10 34.7-4.3 15.6-2.7 19.3 12.2 26.6 19 9.2 39.3 13.9 60 17.2 16.2 2.6 16.7 3.3 16.9 20.1.1 7.6.1 15.3.2 22.9.1 9.6 4.7 15.2 14.6 15.4 11.2.2 22.5.2 33.7-.1 9.2-.2 13.9-5.2 13.9-14.5 0-10.4.5-20.9.1-31.3-.5-10.6 4.1-16 14.3-18.8 23.5-6.4 43.5-19 58.9-37.8 42.8-52 26.5-128.1-34.1-161.6z" fill="#61C365" opacity="1" data-original="#000000" ></path></g></svg>
              </div>
              <div className="flex flex-col ml-4">
                <p className="flex flex-col text-zinc-400 font-medium text-sm">Lucro do Gestor</p>
                <div className="flex items-end gap-4">
                  <span className="text-nowrap text-xl">{formatarMoedaBrasileira(Number(resultadoGestor[0].lucro_gestor).toFixed(1))}</span>
                </div>
              </div>
            </div>
            <div className="bg-white border-zinc-300 border rounded-lg flex flex-col px-2 items-center" style={{ gridArea: 'en' }}>
              <p className="flex flex-col text-zinc-400 font-medium text-sm mb-14 mt-3">Evolução do Negócio</p>
              {periodo == 'm-atual' ? <EvolucaoNegocio
                mes={new Date().getMonth()}
                ano={Number(String(new Date().getFullYear()).slice(-2))}
                dadosLucros={lucroXDespesa.map(d => Number(d.lucro_acomodacoes))} dadosDespesas={lucroXDespesa.map(d => Number(d.despesas_negocio))} /> : null}
              {periodo == 'm-passado' ? <EvolucaoNegocio
                mes={new Date().getMonth() == 0 ? 11 : new Date().getMonth() - 1}
                ano={new Date().getMonth() == 0 ? Number(String(new Date().getFullYear()).slice(-2)) - 1 : Number(String(new Date().getFullYear()).slice(-2))}
                dadosLucros={lucroXDespesa.map(d => Number(d.lucro_acomodacoes))} dadosDespesas={lucroXDespesa.map(d => Number(d.despesas_negocio))} /> : null}
              {periodo == 'a-atual' ? <EvolucaoNegocio
                mes={11}
                ano={Number(String(new Date().getFullYear()).slice(-2))}
                dadosLucros={lucroXDespesa.map(d => Number(d.lucro_acomodacoes))} dadosDespesas={lucroXDespesa.map(d => Number(d.despesas_negocio))} /> : null}
              {periodo == 'a-passado' ? <EvolucaoNegocio
                mes={11}
                ano={Number(String(new Date().getFullYear()).slice(-2)) - 1}
                dadosLucros={lucroXDespesa.map(d => Number(d.lucro_acomodacoes))} dadosDespesas={lucroXDespesa.map(d => Number(d.despesas_negocio))} /> : null}
              {periodo == 'personalizado' ? <EvolucaoNegocio
                mes={new Date().getMonth()}
                ano={Number(String(new Date().getFullYear()).slice(-2))}
                dadosLucros={lucroXDespesa.map(d => Number(d.lucro_acomodacoes))} dadosDespesas={lucroXDespesa.map(d => Number(d.despesas_negocio))} /> : null}
            </div>
          </section> : null}
      </div>
      :
      <Loader />
  )
}
