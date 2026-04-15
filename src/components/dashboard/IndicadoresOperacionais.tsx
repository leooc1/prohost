import OcupacaoMedia from "../chart/OcupacaoMedia";
import QtdeHospede from "../chart/QtdeHospede";
import ReservasCanal from "../chart/ReservasCanal";

type IndicadoresOperacionaisProps = {
  show: [boolean,boolean,boolean]
  ocupacaoSemana: any[]
  reservaCanal: any[]
  qtdHospede: any[]
  comparativoIO: any
  dataBW: [string, string]
}

export default function IndicadoresOperacionais(props: IndicadoresOperacionaisProps) {
  return (
    <section className="grid gap-5 mb-24 grid-cols-3 grid-rows-5 h-[600px]">
                    {props.show[1]?<div className="relative bg-white border-zinc-300 border rounded-lg flex flex-col justify-between items-center row-span-2 py-1 h-full">
                      <p className="flex flex-col text-zinc-400 font-medium text-sm">Taxa de Ocupação Média</p>
                      <div className="">
                        <OcupacaoMedia dados={[(props.ocupacaoSemana.map((d) => d[1])
                          .reduce((a: any, b: any) => a + b, 0)) / 7]} />
                        <p className="text-3xl text-center font-bold bottom-3 text-zinc-500 mb-4">{((props.ocupacaoSemana.map((d) => d[1])
                          .reduce((a: any, b: any) => a + b, 0)) / 7).toFixed(2)}%</p>
                      </div>
                    </div>:
                    <div className="relative skeleton-load border-white border rounded-lg flex flex-col justify-between items-center row-span-2 py-1 h-full">
            		</div>}
                    {props.show[0]?<div className="bg-white border-zinc-300 border rounded-lg flex items-center">
                      <div className="bg-[#E6E9FD] rounded-md w-fit py-2 px-2 ml-4">
                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6279F2"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 10H4V19H20V10ZM15.0355 11.136L16.4497 12.5503L11.5 17.5L7.96447 13.9645L9.37868 12.5503L11.5 14.6716L15.0355 11.136ZM7 5H4V8H20V5H17V6H15V5H9V6H7V5Z"></path></svg>
                      </div>
                      <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">Total de Reservas</p>
                        <div className="flex items-end gap-4">
                          <span className="text-3xl">{props.comparativoIO.atual?.total_reserva ? Number(props.comparativoIO.atual?.total_reserva) : 0}</span>
                          {/* <Comparativo nome="TOTAL DE RESERVAS" data={props.dataBW} passado={props.comparativoIO.passado?.total_reserva ? Number(props.comparativoIO.passado?.total_reserva) : 0}
                            atual={props.comparativoIO.atual?.total_reserva ? Number(props.comparativoIO.atual?.total_reserva) : 0} /> */}
                        </div>
                      </div>
                    </div>:<div className="skeleton-load border-white border rounded-lg flex items-center">
            		</div>}
                    {/* Reserva por canal */}
                    {props.show[2]?<div className="bg-white border-zinc-300 border rounded-lg h-64 -translate-y-0 flex flex-col justify-between items-center py-1 row-span-3" >
                      <p className="flex flex-col text-zinc-400 font-medium text-sm">Reservas por Canal</p>
                      <ReservasCanal labels={props.reservaCanal.length > 0 ? props.reservaCanal.map(r => r.nome) : ['']} dados={props.reservaCanal.length > 0 ? props.reservaCanal.map(r => Number(r.num_reserva)) : [1]} colors={props.reservaCanal.length > 0 ? props.reservaCanal.map(r => r.cor) : ['#cccccc']} />
                    </div>:<div className="skeleton-load border-white border rounded-lg h-64 -translate-y-0 flex flex-col justify-between items-center py-1 row-span-3" >
            </div>}
                    {props.show[0]?<div className="bg-white border-zinc-300 border rounded-lg flex items-center" >
                      <div className="bg-[#E9F7FD] rounded-md w-fit py-2 px-2 ml-4">
                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#63C3F2"><path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z"></path></svg>
                      </div>
                      <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">Diárias reservadas</p>
                        <div className="flex items-end gap-4">
                          <span className="text-3xl">{props.comparativoIO.atual?.total_diaria ? Number(props.comparativoIO.atual?.total_diaria) : 0}</span>
                          {/* <Comparativo nome="DIÁRIAS RESERVADAS" data={props.dataBW} passado={props.comparativoIO.passado?.total_diaria ? Number(props.comparativoIO.passado?.total_diaria) : 0}
                            atual={props.comparativoIO.atual?.total_diaria ? Number(props.comparativoIO.atual?.total_diaria) : 0} /> */}
                        </div>
                      </div>
                    </div>:<div className="skeleton-load border-white border rounded-lg flex items-center" >
            </div>}
                    {props.show[1]?<div className="relative bg-white border-zinc-300 border rounded-lg h-80 flex flex-col justify-between items-center py-1 row-span-3">
                      <p className="flex flex-col text-zinc-400 font-medium text-sm">Ocupação nos Dias da Semana</p>
                      {props.ocupacaoSemana.length > 0 && (
                        <section className="grid grid-rows-7 grid-cols-2 gap-4 mb-2 w-full px-9">
                          <p>{props.ocupacaoSemana[1][0]}</p>
                          <p className="text-end">{Number(props.ocupacaoSemana[1][1]).toFixed(2)}%</p>
                          <p>{props.ocupacaoSemana[2][0]}</p>
                          <p className="text-end">{Number(props.ocupacaoSemana[2][1]).toFixed(2)}%</p>
                          <p>{props.ocupacaoSemana[3][0]}</p>
                          <p className="text-end">{Number(props.ocupacaoSemana[3][1]).toFixed(2)}%</p>
                          <p>{props.ocupacaoSemana[4][0]}</p>
                          <p className="text-end">{Number(props.ocupacaoSemana[4][1]).toFixed(2)}%</p>
                          <p>{props.ocupacaoSemana[5][0]}</p>
                          <p className="text-end">{Number(props.ocupacaoSemana[5][1]).toFixed(2)}%</p>
                          <p>{props.ocupacaoSemana[6][0]}</p>
                          <p className="text-end">{Number(props.ocupacaoSemana[6][1]).toFixed(2)}%</p>
                          <p>{props.ocupacaoSemana[0][0]}</p>
                          <p className="text-end">{Number(props.ocupacaoSemana[0][1]).toFixed(2)}%</p>
                        </section>
                      )}
                    </div>:<div className="relative skeleton-load border-white border rounded-lg h-80 flex flex-col justify-between items-center py-1 row-span-3">
            </div>}
                    {props.show[0]?<div className="bg-white border-zinc-300 border rounded-lg flex items-center" >
                      <div className="bg-[#F7D3AB] rounded-md w-fit py-2 px-2 ml-4">
                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FEB158"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path></svg>            </div>
                      <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">Duração Média das Reservas</p>
                        <div className="flex items-end gap-4">
                          <span className="text-3xl">{props.comparativoIO.atual?.duracao_media ? Number(props.comparativoIO.atual?.duracao_media).toFixed(1) : 0}</span>
                          {/* <Comparativo nome="DURAÇÃO MÉDIA DAS RESERVAS" data={props.dataBW} passado={props.comparativoIO.passado?.duracao_media ? Number(props.comparativoIO.passado?.duracao_media) : 0}
                            atual={props.comparativoIO.atual?.duracao_media ? Number(props.comparativoIO.atual?.duracao_media) : 0} /> */}
                        </div>
                      </div>
                    </div>:<div className="skeleton-load border-white border rounded-lg flex items-center" >
            </div>}
                    {props.show[0]?<div className="bg-white border-zinc-300 border rounded-lg flex items-center" >
                      <div className="bg-[#FDE3E4] rounded-md w-fit py-2 px-2 ml-4">
                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M9 3V1H7V3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H17V1H15V3H9ZM4 10H20V19H4V10ZM4 5H7V6H9V5H15V6H17V5H20V8H4V5ZM9.87862 10.9644L12 13.0858L14.1212 10.9644L15.5355 12.3785L13.4142 14.5001L15.5354 16.6212L14.1213 18.0354L12 15.9143L9.87855 18.0354L8.46442 16.6211L10.5857 14.5001L8.46436 12.3785L9.87862 10.9644Z"></path></svg>
                      </div>
                      <div className="flex flex-col ml-4">
                      <p className="flex flex-col text-zinc-400 font-medium text-sm">Diárias Indisponíveis</p>
                        <div className="flex items-end gap-4">
                          <span className="text-3xl">{props.comparativoIO.atual?.total_indisponivel ? Number(props.comparativoIO.atual?.total_indisponivel) : 0}</span>
                          {/* <Comparativo nome="DIÁRIAS INDISPONÍVEIS" data={props.dataBW} passado={props.comparativoIO.passado?.total_indisponivel ? Number(props.comparativoIO.passado?.total_indisponivel) : 0}
                            atual={props.comparativoIO.atual?.total_indisponivel ? Number(props.comparativoIO.atual?.total_indisponivel) : 0} /> */}
                        </div>
                      </div>
                    </div>:<div className="skeleton-load border-white border rounded-lg flex items-center" >
            </div>}
                    {/* Quantidade de hospede */}
                    {props.show[2]?<div className="bg-white border-zinc-300 border rounded-lg h-64 -translate-y-14 flex flex-col justify-between items-center py-1 row-span-3" >
                      <p className="flex flex-col text-zinc-400 font-medium text-sm">Quantidade de hospedes</p>
                      <QtdeHospede labels={props.qtdHospede.length > 0 ? props.qtdHospede.map(h => String(h.qtd_hospede)) : ['']} dados={props.qtdHospede.length > 0 ? props.qtdHospede.map(h => Number(h.qtd_reserva)) : [1]} colors={props.qtdHospede.length > 0 ? ['#5ec8de', '#5c89b4', '#e36a5f', '#e59b96', '#f5cf69', '#f1d334', '#da2e97', '#f46bd6', '#c169fe', '#43b9ff', '#efc25d', '#f06788', '#69b2f0', '#5ef1db', '#51e853']
                        : ['#cccccc']} />
                    </div>:<div className="skeleton-load border-white border rounded-lg h-64 -translate-y-14 flex flex-col justify-between items-center py-1 row-span-3" >
            </div>}
                    {props.show[0]?<div className="bg-white border-zinc-300 border rounded-lg h-20 flex items-center" >
                      <div className="bg-[#F2F2F2] rounded-md w-fit py-2 px-2 ml-4">
                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111827"><path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path></svg>
                      </div>
                      <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">Total de Hóspedes</p>
                        <div className="flex items-end gap-4">
                          <span className="text-3xl">{props.comparativoIO.atual?.total_hospede ? Number(props.comparativoIO.atual?.total_hospede) : 0}</span>
                          {/* <Comparativo nome="TOTAL DE HÓSPEDES" data={props.dataBW} passado={props.comparativoIO.passado?.total_hospede ? Number(props.comparativoIO.passado?.total_hospede) : 0}
                            atual={props.comparativoIO.atual?.total_hospede ? Number(props.comparativoIO.atual?.total_hospede) : 0} /> */}
                        </div>
                      </div>
                    </div>:<div className="skeleton-load border-white border rounded-lg flex items-center" >
            </div>}
    </section>
  )
}
