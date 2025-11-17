import { useContext, useEffect, useState } from 'react'
import CanaisDeReserva from '../components/CanaisDeReserva'
import NovaIndisponibilidade from '../components/NovaIndisponibilidade'
import NovaReserva from '../components/NovaReserva'
import Calendario from '../components/chart/Calendario'
import ListaReserva from '../components/list/ListaReserva'
import { SideBarContext } from '../contexts/SideBarMenuContext'
import Loader from '../components/Loader'
import SemPermissao from '../components/SemPermissao'

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

interface Reserva {
  id?: number
  acomodacao: { id: number, foto: string, nome: string }
  check_in: string
  check_out: string
  canal_reserva: { id: number, cor: string, nome: string } | null
  comissao_ota: number
  continuidade: boolean
  hospede: { id: number, nome: string } | null
  qtd_hospede: number
  saas: { id: number }
  valor: number
  valor_liq: number
  valor_liq_calculado: number
  valor_prop: number
  valor_gestor: number
  tipo_reserva: string
  obs: string | null
}

export default function Reserva() {
  const apiURL = import.meta.env.VITE_API_URL
  useEffect(() => { document.title = 'Reservas | Prohost' }, [])


  const { dataToken } = useContext(SideBarContext)
  const [loaded, setLoaded] = useState(false)
  const [render, setRender] = useState(false)
  const [calendario, setCalendario] = useState(true)
  const [canaisReserva, setCanaisReserva] = useState(false)
  const [novaReserva, setNovaReserva] = useState(false)
  const [novaIndisponibilidade, setNovaIndisponibilidade] = useState(false)
  const [reserva, setReserva] = useState<Reserva[]>([])
  const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
  const [canais, setCanais] = useState<Acomodacao[]>([])
  const [ids, setIds] = useState<{ id: number, index: number }[]>([])

  async function getReserva() {
    if (!dataToken || !dataToken.id) return
    await fetch(`${apiURL}/reserva/${dataToken.id}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then((data: Reserva[]) => {
        setReserva(data)
        getAll(dataToken.id)
      })
      .catch(err => console.log(err))
  }

  async function getAcomodacoes() {
    if (!dataToken || !dataToken.id) return
    await fetch(`${apiURL}/acomodacao/${dataToken.id}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then((data: Acomodacao[]) => {
        setAcomodacao(data.filter((e => !e.desativado)))
      })
      .catch(err => console.log(err))
  }

  async function getCanais() {
    if (!dataToken || !dataToken.id) return
    await fetch(`${apiURL}/canal_reserva/${dataToken.id}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then((data) => {
        setCanais(data)
      })
      .catch(err => console.log(err))
  }

  async function getAll(saas: number) {
    await fetch(`${apiURL}/reserva/index/${saas}`, {
      method: 'GET',
    })
      .then(data => data.json())
      .then((data) => {
        setIds(data)
      })
      .catch(err => console.log(err))
  }

  const [permissao, setPermissao] = useState(0)
  async function permissoes() {
    if (!dataToken || !dataToken.idUsu) return
    await fetch(`${apiURL}/users/${dataToken.idUsu}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then(data => {
        if (data.reserva) {
          setPermissao(data.reserva)
        }
        else {
          setPermissao(0)
        }
      })
      .catch(err => console.log(err))
  }

  async function calendar() {
    if (!dataToken || !dataToken.id) return
    await getCanais()
    await getAcomodacoes()
    await getReserva()
    await permissoes()
    setRender(true)
    setLoaded(true)
  }

  function initial(): string | null {
    const dataInicial = localStorage.getItem('ph-cld-initial-date')
    if (dataInicial?.split(' ')[0].length == 10) {
      return dataInicial?.split(' ')[0] as string
    }
    else return null
  }



  useEffect(() => {
    if (dataToken && dataToken.id) calendar()
  }, [calendario, dataToken])

  return (
    loaded ?
      <div className='w-full px-8 min-h-screen'>
        {permissao == 0 && <SemPermissao />}
        <div className='mb-7 pt-2 flex gap-5 flex-wrap'>
          <h3 className="text-3xl font-semibold">Reservas</h3>
          <div className='flex border border-zinc-300 rounded-md items-center bg-white'>
            <button onClick={() => setCalendario(true)} className={`text-sm flex items-center h-full gap-1 px-2 border-r border-zinc-3  00 ${calendario ? 'text-[#6279F2]' : 'text-zinc-400'}`}>
              <svg className={`w-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 10H4V19H20V10ZM15.0355 11.136L16.4497 12.5503L11.5 17.5L7.96447 13.9645L9.37868 12.5503L11.5 14.6716L15.0355 11.136ZM7 5H4V8H20V5H17V6H15V5H9V6H7V5Z"></path></svg>
              Calendário</button>
            <button onClick={() => setCalendario(false)} className={`text-sm flex items-center h-full gap-1 px-2 border-l border-zinc-3 00 ${!calendario ? 'text-[#6279F2]' : 'text-zinc-400'}`}>
              <svg className={`w-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 4H21V6H8V4ZM3 3.5H6V6.5H3V3.5ZM3 10.5H6V13.5H3V10.5ZM3 17.5H6V20.5H3V17.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"></path></svg>
              Lista</button>
          </div>
          <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium  bg-[#FFFFFF] hover:shadow-md shadow-black'
            onClick={() => setCanaisReserva(true)}
            disabled={!(permissao >= 2)}>Canais de Reserva</button>
          {canaisReserva && <CanaisDeReserva close={() => setCanaisReserva(false)}
            permissao={permissao} />}
          <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#F45C61] hover:bg-[#ED3E44] hover:shadow-md shadow-black'
            onClick={() => {
              if (acomodacao.length == 0) location.assign('/acomodacoes')
              setNovaIndisponibilidade(true)
            }}
            disabled={!(permissao >= 2)}>Nova Indisponibilidade</button>
          {novaIndisponibilidade && <NovaIndisponibilidade close={() => setNovaIndisponibilidade(false)} />}
          <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
            onClick={() => {
              if (acomodacao.length == 0) location.assign('/acomodacoes')
              setNovaReserva(true)
            }}
            disabled={!(permissao >= 2)}>Nova Reserva</button>
          {novaReserva && <NovaReserva close={() => setNovaReserva(false)} />}
        </div>
        {render ?
          calendario ? <Calendario
            permissao={permissao}
            acomodacoes={acomodacao.map((a) => ({
              id: String(a ? a.id : null),
              title: a.nome,
              image: a.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'
            }))}

            reservas={reserva.filter(r => r.tipo_reserva != 'Cancelamento').map((r) => ({
              "resourceId": String(r.acomodacao ? r.acomodacao.id : null),
              "title": r.hospede?.nome || '',
              "start": (r.check_in),
              "end": (r.check_out),
              "hospedes": r.qtd_hospede,
              "color": r.tipo_reserva == 'Continuidade' ? '#30C46D'
                : r.tipo_reserva == 'Indisponibilidade' ? '#353535'
                  : r.canal_reserva?.cor || '',
              "id": String(r ? r.id : null),
              "tipo": r.tipo_reserva,
              "obs": r.obs || '',
              "bruto": r.valor,
              "liquido": r.valor_liq,
              "comissao": r.comissao_ota
            }))}
            initialDate={initial()}
          />
            : <ListaReserva
              ids={ids}
              reservas={reserva}
              acomodacoes={acomodacao}
              canaisReserva={canais}
              permissao={permissao}
            />
          : null}
      </div>
      :
      <Loader />
  )
}
