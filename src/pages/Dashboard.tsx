import { useState } from "react";
import Comparativo from "../components/Comparativo";
import DesempenhoDiarias from "../components/chart/DesempenhoDiarias";
import ReservasCanal from "../components/chart/ReservasCanal";
import OcupacaoMedia from "../components/chart/OcupacaoMedia";
import FaturamentoCanal from "../components/chart/FaturamentoCanal";
export default function Dashboard() {

  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  const date = new Date()
  const [periodo, setPeriodo] = useState('m-atual')
  const [sessao, setSessao] = useState(0)
  const [deData, setDeData] = useState('')
  const [ateData, setAteData] = useState('')
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
  function calcularPorcentagem(valor1: number, valor2: number, valor3: number) {
    const total = valor1 + valor2 + valor3;
    if (total === 0) {
      return 0;
    }
    const porcentagem = (valor1 / total) * 100;
    return porcentagem.toFixed(1);
  }
  console.log(deData, ateData)
  return (
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
        <button className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 0 ? 'bg-slate-200 text-blue-700' : 'text-zinc-700'}`} onClick={() => setSessao(0)}>Indicadores Operacionais</button>
        <button className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 1 ? 'bg-slate-200 text-blue-700' : 'text-zinc-700'}`} onClick={() => setSessao(1)}>Resultados das Acomodações</button>
        <button className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 2 ? 'bg-slate-200 text-blue-700' : 'text-zinc-700'}`} onClick={() => setSessao(2)}>Resultados do Gestor</button>
      </div>
      <h4 className="text-2xl font-semibold mb-6">
        {sessao == 0 ? 'Indicadores Operacionais' : null}
        {sessao == 1 ? 'Resultados das Acomodações' : null}
        {sessao == 2 ? 'Resultados do Gestor' : null}
      </h4>
      {sessao != 2 ? <div>
        <label htmlFor="acomodacao" className={`flex flex-col w-fit mb-8`}>
          <select name="acomodacao" id="acomodacao" className={`border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none`}>
            <option value="all" selected>Todas acomodações</option>
            <option value="1">Lorem.</option>
            <option value="2">Lorem.</option>
            <option value="3">Lorem.</option>
          </select>
        </label>
      </div> : null}
      {sessao == 0 ?
        <section className="grid gap-5 mb-10" style={{
          gridTemplateAreas:
            `'tr tr tr dr dr dr'
         'di di di th th th'
         'dd dd rc rc tom tom'`,
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 2fr'
        }}>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'tr' }}>
            <div className="bg-[#E6E9FD] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6279F2"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 10H4V19H20V10ZM15.0355 11.136L16.4497 12.5503L11.5 17.5L7.96447 13.9645L9.37868 12.5503L11.5 14.6716L15.0355 11.136ZM7 5H4V8H20V5H17V6H15V5H9V6H7V5Z"></path></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Total de Reservas</p>
              <div className="flex items-end gap-4">
                <span className="text-3xl">1</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'dr' }}>
            <div className="bg-[#E9F7FD] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#63C3F2"><path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z"></path></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Diárias reservadas</p>
              <div className="flex items-end gap-4">
                <span className="text-3xl">1</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'di' }}>
            <div className="bg-[#FDE3E4] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M9 3V1H7V3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H17V1H15V3H9ZM4 10H20V19H4V10ZM4 5H7V6H9V5H15V6H17V5H20V8H4V5ZM9.87862 10.9644L12 13.0858L14.1212 10.9644L15.5355 12.3785L13.4142 14.5001L15.5354 16.6212L14.1213 18.0354L12 15.9143L9.87855 18.0354L8.46442 16.6211L10.5857 14.5001L8.46436 12.3785L9.87862 10.9644Z"></path></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Reservas Indisponíveis</p>
              <div className="flex items-end gap-4">
                <span className="text-3xl">0</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'th' }}>
            <div className="bg-[#F2F2F2] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111827"><path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Total de Hóspedes</p>
              <div className="flex items-end gap-4">
                <span className="text-3xl">1</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-40 flex flex-col justify-between items-center py-1" style={{ gridArea: 'dd' }}>
            <p className="flex flex-col text-zinc-400 font-medium text-sm">Desempenho das Diárias</p>
            <DesempenhoDiarias dados={[1, 17, 0]} />
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-40 flex flex-col justify-between items-center py-1" style={{ gridArea: 'rc' }}>
            <p className="flex flex-col text-zinc-400 font-medium text-sm">Reservas por Canal</p>
            <ReservasCanal labels={['Indicação']} dados={[1]} colors={['#0074E0']} />
          </div>
          <div className="relative bg-white border-zinc-300 border rounded-lg h-40 flex flex-col justify-between items-center py-1" style={{ gridArea: 'tom' }}>
            <p className="flex flex-col text-zinc-400 font-medium text-sm">Taxa de Ocupação Média</p>
            <OcupacaoMedia dados={[1, 17, 0]} />
            <p className="absolute text-3xl font-bold bottom-3 text-zinc-500">{calcularPorcentagem(1, 17, 0)}%</p>
          </div>
        </section> : null}
      {sessao == 1 ?
        <section className="grid gap-5 mb-10" style={{
          gridTemplateAreas:
            `'fb fb cfl cfl cfl fc fc'
            'cp cp cfl cfl cfl fc fc'
            'fl fl cfl cfl cfl fc fc'
            'd d cfl cfl cfl fc fc'
            'la la cfl cfl cfl fc fc'
            'dm dm cfl cfl cfl fc fc'`,
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 0.2fr'
        }}>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'fb' }}>
            <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#01AAFE"><path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Faturamento Bruto</p>
              <div className="flex items-end gap-4">
                <span className="text-nowrap text-xl">R$ 1,00</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'cp' }}>
            <div className="bg-[#FCE0E1] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Comissão das Plataformas</p>
              <div className="flex items-end gap-4">
                <span className="text-nowrap text-xl">R$ 1,00</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'fl' }}>
            <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" ><g><path d="m93.9 29.7-.6-.1v-.4c-.1-1.1-.6-2-1.4-2.7s-1.8-1-2.9-.9L72.9 27l-60.8-7.7c-2.2-.3-4.2 1.3-4.5 3.5L6.3 33.1c-.9.2-1.7.6-2.3 1.3-.7.8-1 1.9-.9 2.9l1.1 12.1-1.6 13c-.1 1.1.2 2.1.8 3 .6.8 1.4 1.3 2.4 1.5L6.7 77c.2 2.1 1.9 3.6 4 3.6h.4l61-5.5 15.9 2h.5c2 0 3.7-1.5 4-3.5l.1-.4.8-.1c1.1-.1 2-.6 2.7-1.4s1-1.9.9-2.9L95.4 51l2.1-17c.2-2-1.4-4-3.6-4.3zM9.6 23.1c.1-1 1-1.8 2-1.8h.3l51.8 6.5-55.3 5zM5 64.1c-.3-.4-.5-1-.4-1.5l.5-3.8.5 5.8c-.2-.1-.4-.3-.6-.5zm83.2 11.1-6.8-.9 9.1-.8c-.2 1.1-1.2 1.8-2.3 1.7zm6.2-4.6c-.3.4-.8.7-1.3.7h-.3l-2 .2-18.6 1.7-9.5.8-51.9 4.6c-1.1.1-2.1-.7-2.2-1.8L7.7 67l-.2-2-1.3-15.5-.8-9.4-.3-3c0-.5.1-1 .5-1.5.1-.2.3-.3.4-.4.3-.1.6-.2.9-.2l1.2-.1 64.8-5.8 9.3-.8 7-.6h.2c.5 0 .9.2 1.3.5s.7.8.7 1.3l.2 2 1.8 19.7.8 9.4.8 8.7c-.1.3-.2.9-.6 1.3zm1-36.7-1 7.9-.9-10.1h.2c1.1.1 1.9 1.1 1.7 2.2z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M86.1 38.7c-1.5.1-3-.3-4.2-1.3s-1.9-2.3-2-3.9c0-.3-.2-.5-.4-.7s-.5-.3-.7-.2l-30.5 2.7L18 38c-.5.1-1 .5-.9 1.1.1 1.5-.3 3-1.3 4.2s-2.4 1.9-3.9 2c-.3 0-.5.2-.7.4s-.2.4-.2.7l1.7 19.3.1 1c0 .5.5 1 1.1.9 1.1-.1 2.2.1 3.1.6 1.7.9 2.9 2.5 3.1 4.6 0 .3.2.5.4.7s.4.2.6.2h.1L44 71.6l7.6-.7 1.7-.1L82 68.2c.3 0 .5-.2.7-.3.2-.2.3-.5.2-.7-.1-1.5.3-3 1.3-4.2s2.4-1.9 3.9-2c.3 0 .5-.2.7-.4s.3-.5.2-.7l-1.8-20.3c-.1-.6-.5-1-1.1-.9zm-3.4 23c-1.1 1.3-1.7 2.9-1.8 4.6L51.4 69l-7.3.7-9.3.8L22 71.6c-.2-1.1-.7-2.1-1.4-2.9-.8-1-1.8-1.9-3-2.4-.9-.4-1.9-.7-2.9-.7l-1.6-18.4c3.4-.8 5.9-3.7 6-7.2l29.5-2.7L78 34.6c.4 1.7 1.3 3.1 2.6 4.3 1.3 1.1 2.9 1.7 4.6 1.8l1.7 18.4c-1.6.4-3.1 1.3-4.2 2.6z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M49.9 52.1c-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3s.1-1 .5-1.4c.3-.4.8-.7 1.3-.7s1 .1 1.4.5c.4.3.7.8.7 1.3s.5 1 1.1.9c.6 0 1-.5.9-1.1-.1-1.1-.6-2-1.4-2.7-.5-.5-1.2-.7-1.9-.9l-.1-1.1c0-.5-.5-1-1.1-.9-.5 0-1 .5-.9 1.1l.1 1.1c-.7.2-1.2.6-1.7 1.2-.7.8-1 1.8-.9 2.9s.6 2 1.4 2.7 1.9 1 2.9.9c1.1-.1 2 .7 2.1 1.8 0 .5-.1 1-.5 1.4-.3.4-.8.7-1.3.7-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3 0-.6-.5-1-1.1-.9-.6 0-1 .5-.9 1.1.1 1.1.6 2 1.4 2.7.6.5 1.2.8 1.9.9l.1 1.1c0 .5.5.9 1 .9h.1c.5 0 1-.5.9-1.1l-.1-1.1c.7-.2 1.2-.6 1.7-1.2.7-.8 1-1.8.9-2.9s-.6-2-1.4-2.7c-.8-.6-1.8-1-2.9-.9z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M58.7 42.7c-2.8-2.3-6.3-3.4-9.9-3.1-7.5.7-13 7.3-12.3 14.8.3 3.6 2 6.9 4.8 9.2 2.5 2.1 5.5 3.2 8.7 3.2.4 0 .8 0 1.2-.1 7.1-.6 12.4-6.6 12.4-13.5V52c-.4-3.7-2.1-7-4.9-9.3zm-7.7 22c-3 .3-6.1-.7-8.4-2.7s-3.8-4.8-4.1-7.9c-.6-6.4 4.2-12 10.5-12.6h1.1c2.7 0 5.3.9 7.4 2.7 1.2 1 2.2 2.2 2.8 3.5.7 1.3 1.1 2.8 1.3 4.3.5 6.5-4.2 12.1-10.6 12.7zM20.9 50c-1.9 0-3.5 1.6-3.5 3.5S19 57 20.9 57s3.5-1.6 3.5-3.5c-.1-1.9-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5c-.1.8-.7 1.5-1.5 1.5zM79.1 50c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5S81 50 79.1 50zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S80 55 79.1 55z" fill="#01AAFE" opacity="1" data-original="#000000"></path></g></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Faturamento Líquido</p>
              <div className="flex items-end gap-4">
                <span className="text-nowrap text-xl">R$ 1,00</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'd' }}>
            <div className="bg-[#F8DCDC] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D94D52"><path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path></svg>            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Despesas (exceto negócio)</p>
              <div className="flex items-end gap-4">
                <span className="text-nowrap text-xl">R$ 1,00</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'la' }}>
            <div className="bg-[#E0FEEA] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 484.184 484.184" ><g><path d="M309.43 219.944c-19-10.5-39.2-18.5-59.2-26.8-11.6-4.8-22.7-10.4-32.5-18.2-19.3-15.4-15.6-40.4 7-50.3 6.4-2.8 13.1-3.7 19.9-4.1 26.2-1.4 51.1 3.4 74.8 14.8 11.8 5.7 15.7 3.9 19.7-8.4 4.2-13 7.7-26.2 11.6-39.3 2.6-8.8-.6-14.6-8.9-18.3-15.2-6.7-30.8-11.5-47.2-14.1-21.4-3.3-21.4-3.4-21.5-24.9-.1-30.3-.1-30.3-30.5-30.3-4.4 0-8.8-.1-13.2 0-14.2.4-16.6 2.9-17 17.2-.2 6.4 0 12.8-.1 19.3-.1 19-.2 18.7-18.4 25.3-44 16-71.2 46-74.1 94-2.6 42.5 19.6 71.2 54.5 92.1 21.5 12.9 45.3 20.5 68.1 30.6 8.9 3.9 17.4 8.4 24.8 14.6 21.9 18.1 17.9 48.2-8.1 59.6-13.9 6.1-28.6 7.6-43.7 5.7-23.3-2.9-45.6-9-66.6-19.9-12.3-6.4-15.9-4.7-20.1 8.6-3.6 11.5-6.8 23.1-10 34.7-4.3 15.6-2.7 19.3 12.2 26.6 19 9.2 39.3 13.9 60 17.2 16.2 2.6 16.7 3.3 16.9 20.1.1 7.6.1 15.3.2 22.9.1 9.6 4.7 15.2 14.6 15.4 11.2.2 22.5.2 33.7-.1 9.2-.2 13.9-5.2 13.9-14.5 0-10.4.5-20.9.1-31.3-.5-10.6 4.1-16 14.3-18.8 23.5-6.4 43.5-19 58.9-37.8 42.8-52 26.5-128.1-34.1-161.6z" fill="#61C365" opacity="1" data-original="#000000" ></path></g></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Lucro das Acomodações</p>
              <div className="flex items-end gap-4">
                <span className="text-nowrap text-xl">R$ 1,00</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" style={{ gridArea: 'dm' }}>
            <div className="bg-[#FEF0D0] rounded-md w-fit py-2 px-2 ml-4">
              <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FAB515"><path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z"></path></svg>
            </div>
            <div className="flex flex-col ml-4">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">Diária Média</p>
              <div className="flex items-end gap-4">
                <span className="text-nowrap text-xl">R$ 1,00</span>
                <Comparativo number={0} />
              </div>
            </div>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center" style={{ gridArea: 'cfl' }}>
            <p className="flex flex-col text-zinc-400 font-medium text-sm mb-7 mt-3">Comparativo de Faturamento Líquido</p>
          </div>
          <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center" style={{ gridArea: 'fc' }}>
            <p className="flex flex-col text-zinc-400 font-medium text-sm mb-7 mt-3">Faturamento por Canal</p>
            <FaturamentoCanal labels={['Indicação']} dados={[10]} colors={['#0074E0']} />
          </div>
        </section> : null}
      {sessao == 2 ?
        <section className="grid gap-5 mb-10" style={{
          gridTemplateAreas:
            `'lap lap lap en en en en'
         'cat cat cat en en en en'
         'dn dn dn en en en en'
         'lg lg lg en en en en'`,
          gridTemplateColumns: '1fr 1fr 0.2fr 1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr 1fr'
        }}>
          <div className="bg-white border-zinc-300 border rounded-lg h-20" style={{ gridArea: 'lap' }}></div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20" style={{ gridArea: 'cat' }}></div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20" style={{ gridArea: 'dn' }}></div>
          <div className="bg-white border-zinc-300 border rounded-lg h-20" style={{ gridArea: 'lg' }}></div>
          <div className="bg-white border-zinc-300 border rounded-lg" style={{ gridArea: 'en' }}></div>
        </section> : null}
    </div>
  )
}
