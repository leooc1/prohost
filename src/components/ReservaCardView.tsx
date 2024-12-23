import { useEffect, useState } from "react"
import NovaContinuidade from "./NovaContinuidade"
import EditarReserva from "./EditarReserva"
import CardCancelamento from "./CardCancelamento"

interface propsReserva {
    id: string
    close: () => void
}

interface Reserva {
    id?: number
    acomodacao: { id: number, foto: string, nome: string, comissao: number }
    check_in: string
    check_out: string
    canal_reserva: { id: number, cor: string, nome: string } | null
    comissao_ota: number
    continuidade: number | null
    hospede: { id: number, nome: string } | null
    qtd_hospede: number
    saas: { id: number }
    valor: number
    valor_liq: number
    valor_prop: number
    valor_gestor: number
    tipo_reserva: string
    obs: string | null
}


//const apiURl = import.meta.env.VITE_baseURLAPI;

export default function ReservaCardView(props: propsReserva) {
    const [reserva, setReserva] = useState<Reserva>()
    const [idR, setIdR] = useState<number>(0)
    const [continuidade, setContinuidade] = useState(false)
    const [editar, setEditar] = useState(false)
    const [cancelamento, setCancelamento] = useState(false)

    function formatDate(isoDateStr: string) {
        const date = new Date(isoDateStr);

        const day = ("0" + date.getDate()).slice(-2);
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);

        return `${day} ${month} ${year} ${hours}:${minutes}`;
    }

    function calcularDiasEntreDatas(dataInicio: string, dataFim: string): string {
        const inicio: Date = new Date(dataInicio);
        const fim: Date = new Date(dataFim);

        const diferencaMs: number = fim.getTime() - inicio.getTime();

        const diferencaDias: number = Math.round(diferencaMs / (1000 * 60 * 60 * 24));

        return diferencaDias === 1 ? `${diferencaDias} noite` : `${diferencaDias} noites`;
    }

    async function idContinuidade(idAcomodacao: number, idContinuidade: number) {
        await fetch(`https://api.prohost.net.br/reserva/1/${idAcomodacao}/ci/${idContinuidade}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: number) => {
                setIdR(data)
            })
            .catch(err => console.log(err))
    }

    async function idReserva(idReserva: number, idAcomodacao: number) {
        await fetch(`https://api.prohost.net.br/reserva/1/${idReserva}/${idAcomodacao}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: number) => {
                setIdR(data)
            })
            .catch(err => console.log(err))
    }

    async function getReserva(id: string) {
        await fetch(`https://api.prohost.net.br/reserva/1/${id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Reserva[]) => {
                setReserva(data[0])
                if (data[0].tipo_reserva != "Indisponibilidade" && data[0].tipo_reserva != "Continuidade")
                    idReserva(data[0].id || 0, data[0].acomodacao.id)
                else if (data[0].tipo_reserva == "Continuidade")
                    idContinuidade(data[0].acomodacao.id, data[0].continuidade || 0)
            })
            .catch(err => console.log(err))
    }

    async function deleteReserva(id: number) {
        await fetch(`https://api.prohost.net.br/reserva/${id}`, {
            method: 'DELETE'
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected == 1) {
                    alert('EXCLUÍDO!')
                    props.close()
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getReserva(props.id)
    }, [])

    return (
        <div className='w-screen min-h-screen fixed z-10 top-0 right-0'>
            {continuidade && <NovaContinuidade
                idReserva={props.id}
                close={() => setContinuidade(false)}
                checkinDate={reserva?.check_out || ''}
                acomodacao={reserva?.acomodacao.id || 0}
                canal={reserva?.canal_reserva?.id || 0}
                qtdHospede={reserva?.qtd_hospede || 0}
                hospede={reserva?.hospede?.id || 0}
                comissao={reserva?.acomodacao.comissao || null}
            />}

            {editar && <EditarReserva
                id={reserva?.id || 0}
                close={() => setEditar(false)}
                acomodacaoID={reserva?.acomodacao.id || 0}
                canalID={reserva?.canal_reserva?.id || 0}
                checkIn={reserva?.check_in || ''}
                checkOut={reserva?.check_out || ''}
                comissao={reserva?.comissao_ota || 0}
                hospedeNOME={reserva?.hospede?.nome || ''}
                obs={reserva?.obs || ''}
                qtdHospede={reserva?.qtd_hospede || 0}
                valorLiq={reserva?.valor_liq || 0}
                valorTotal={reserva?.valor || 0}
            />}
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={props.close}></div>
            <div className="flex rounded-md flex-col absolute min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white max-h-[calc(100vh-40px)] overflow-y-scroll scroll-default">
                <section className="flex items-center mt-2 gap-5">
                    <img className="w-14 h-14 rounded-full border-2 border-blue-600 object-cover" src={reserva?.acomodacao.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} />
                    <div className="flex flex-col gap-3 mt-2">
                        {reserva?.tipo_reserva == 'Indisponibilidade' ?
                            <h5 className="font-semibold text-2xl">{'Indisponibilidade'}</h5> :
                            <h5 className="font-semibold text-2xl">Reserva#{idR} {reserva?.tipo_reserva == 'Continuidade' ? <span className="text-[#008000]"><span className="text-black">-</span> C</span> : <></>}</h5>}
                        {reserva?.tipo_reserva != 'Indisponibilidade' && reserva?.tipo_reserva != 'Continuidade' ? <div className={`px-2 py-1 text-sm font-medium bg-[${reserva?.canal_reserva?.cor}] text-white rounded-md w-fit`}>{reserva?.canal_reserva?.nome}</div> : <></>}
                        {reserva?.tipo_reserva == 'Indisponibilidade' ? <div className="px-2 py-1 text-sm font-medium bg-[#353535] text-white rounded-md w-fit">Indisponibilidade</div> : <></>}
                        {reserva?.tipo_reserva == 'Continuidade' ? <div className="px-2 py-1 text-sm font-medium bg-[#30C46D] text-white rounded-md w-fit">Continuidade</div> : <></>}
                    </div>
                    <button className="absolute top-1 right-1" onClick={props.close}>
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                    </button>
                </section>
                <section className="flex flex-col gap-4">
                    {reserva?.tipo_reserva == 'Indisponibilidade' ? null : <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                        <svg className="absolute w-8 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(98,121,242,1)"><path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path></svg>
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Hóspede</span>
                        <p className="font-semibold text-sm">{reserva?.hospede?.nome}</p>
                    </div>}
                    <div className="grid gap-4"
                        style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-8 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 32 32" ><g><path d="M25 3.96h-1.5V3a1 1 0 1 0-2 0v.96h-11V3a1 1 0 1 0-2 0v.96H7c-2.757 0-5 2.243-5 5V25c0 2.757 2.243 5 5 5h18c2.757 0 5-2.243 5-5V8.96c0-2.757-2.243-5-5-5zm-21 5c0-1.654 1.346-3 3-3h1.5v.96a1 1 0 1 0 2 0v-.96h11v.96a1 1 0 1 0 2 0v-.96H25c1.654 0 3 1.346 3 3v1.01H4zM25 28H7c-1.654 0-3-1.346-3-3V11.97h24V25c0 1.654-1.346 3-3 3z" fill="#6279f2" opacity="1" data-original="#000000" ></path><path d="M20 18.985h-3v-3a1 1 0 1 0-2 0v3h-3a1 1 0 1 0 0 2h3v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2z" fill="#6279f2" opacity="1" data-original="#000000" ></path></g></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">{reserva?.tipo_reserva == 'Indisponibilidade' ? 'De:' : 'Chegada'}</span>
                            <p className="font-semibold text-sm">{formatDate(reserva?.check_in || '')}</p>
                        </div>
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-8 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 24 24"><g><path d="M18 3.75h-1.25V3a.75.75 0 0 0-1.5 0v.75h-6.5V3a.75.75 0 0 0-1.5 0v.75H6A3.383 3.383 0 0 0 2.25 7.5V18A3.383 3.383 0 0 0 6 21.75h12A3.383 3.383 0 0 0 21.75 18V7.5A3.383 3.383 0 0 0 18 3.75zM6 5.25h1.25V6a.75.75 0 0 0 1.5 0v-.75h6.5V6a.75.75 0 0 0 1.5 0v-.75H18c1.577 0 2.25.673 2.25 2.25v.75H3.75V7.5c0-1.577.673-2.25 2.25-2.25zm12 15H6c-1.577 0-2.25-.673-2.25-2.25V9.75h16.5V18c0 1.577-.673 2.25-2.25 2.25zm-2.97-7.45a.75.75 0 0 1 0 1.061L11.7 17.2a.748.748 0 0 1-1.06 0l-1.67-1.67a.75.75 0 0 1 1.06-1.06l1.137 1.136 2.8-2.8a.749.749 0 0 1 1.063-.006z" fill="#6279f2" opacity="1" data-original="#000000" ></path></g></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">{reserva?.tipo_reserva == 'Indisponibilidade' ? 'Até:' : 'Partida'}</span>
                            <p className="font-semibold text-sm">{formatDate(reserva?.check_out || '')}</p>
                        </div>
                    </div>
                    <div className="grid gap-4"
                        style={{ gridTemplateColumns: '2fr 1fr' }}>
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-8 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 460.298 460.297" ><g><path d="M230.149 120.939 65.986 256.274c0 .191-.048.472-.144.855-.094.38-.144.656-.144.852v137.041c0 4.948 1.809 9.236 5.426 12.847 3.616 3.613 7.898 5.431 12.847 5.431h109.63V303.664h73.097v109.64h109.629c4.948 0 9.236-1.814 12.847-5.435 3.617-3.607 5.432-7.898 5.432-12.847V257.981c0-.76-.104-1.334-.288-1.707L230.149 120.939z" fill="#6279f2" opacity="1" data-original="#000000" ></path><path d="M457.122 225.438 394.6 173.476V56.989c0-2.663-.856-4.853-2.574-6.567-1.704-1.712-3.894-2.568-6.563-2.568h-54.816c-2.666 0-4.855.856-6.57 2.568-1.711 1.714-2.566 3.905-2.566 6.567v55.673l-69.662-58.245c-6.084-4.949-13.318-7.423-21.694-7.423-8.375 0-15.608 2.474-21.698 7.423L3.172 225.438c-1.903 1.52-2.946 3.566-3.14 6.136-.193 2.568.472 4.811 1.997 6.713l17.701 21.128c1.525 1.712 3.521 2.759 5.996 3.142 2.285.192 4.57-.476 6.855-1.998L230.149 95.817l197.57 164.741c1.526 1.328 3.521 1.991 5.996 1.991h.858c2.471-.376 4.463-1.43 5.996-3.138l17.703-21.125c1.522-1.906 2.189-4.145 1.991-6.716-.195-2.563-1.242-4.609-3.141-6.132z" fill="#6279f2" opacity="1" data-original="#000000"></path></g></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação</span>
                            <p className="font-semibold text-sm">{reserva?.acomodacao.nome}</p>
                        </div>
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-8 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 312.999 312.999"><g><path d="M305.6 178.053c-3.2-.8-6.4 0-9.2 2-10.4 8.8-22.4 16-35.6 20.8-12.4 4.8-26 7.2-40.4 7.2-32.4 0-62-13.2-83.2-34.4-21.2-21.2-34.4-50.8-34.4-83.2 0-13.6 2.4-26.8 6.4-38.8 4.4-12.8 10.8-24.4 19.2-34.4 3.6-4.4 2.8-10.8-1.6-14.4-2.8-2-6-2.8-9.2-2-34 9.2-63.6 29.6-84.8 56.8-20.4 26.8-32.8 60-32.8 96.4 0 43.6 17.6 83.2 46.4 112s68.4 46.4 112 46.4c36.8 0 70.8-12.8 98-34 27.6-21.6 47.6-52.4 56-87.6 2-6-1.2-11.6-6.8-12.8zm-61.2 83.6c-23.2 18.4-52.8 29.6-85.2 29.6-38 0-72.4-15.6-97.2-40.4-24.8-24.8-40.4-59.2-40.4-97.2 0-31.6 10.4-60.4 28.4-83.6 12.4-16 28-29.2 46-38.4-2 4.4-4 8.8-5.6 13.6-5.2 14.4-7.6 29.6-7.6 45.6 0 38 15.6 72.8 40.4 97.6s59.6 40.4 97.6 40.4c16.8 0 32.8-2.8 47.6-8.4 5.2-2 10.4-4 15.2-6.4-9.6 18.4-22.8 34.8-39.2 47.6z" fill="#6279f2" opacity="1" data-original="#000000"></path></g></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Noites</span>
                            <p className="font-semibold text-sm">{calcularDiasEntreDatas(reserva?.check_in || '', reserva?.check_out || '')}</p>
                        </div>
                    </div>
                    {reserva?.tipo_reserva == 'Indisponibilidade' ? null : <div className="grid gap-4"
                        style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-8 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 80.13 80.13"><g><path d="M48.355 17.922c3.705 2.323 6.303 6.254 6.776 10.817a11.69 11.69 0 0 0 4.966 1.112c6.491 0 11.752-5.261 11.752-11.751 0-6.491-5.261-11.752-11.752-11.752-6.429.002-11.644 5.169-11.742 11.574zm-7.699 24.062c6.491 0 11.752-5.262 11.752-11.752s-5.262-11.751-11.752-11.751c-6.49 0-11.754 5.262-11.754 11.752s5.264 11.751 11.754 11.751zm4.985.801h-9.972c-8.297 0-15.047 6.751-15.047 15.048v12.195l.031.191.84.263c7.918 2.474 14.797 3.299 20.459 3.299 11.059 0 17.469-3.153 17.864-3.354l.785-.397h.084V57.833c.003-8.297-6.747-15.048-15.044-15.048zm19.443-12.132h-9.895a14.483 14.483 0 0 1-4.47 10.088c7.375 2.193 12.771 9.032 12.771 17.11v3.758c9.77-.358 15.4-3.127 15.771-3.313l.785-.398h.084V45.699c0-8.296-6.75-15.046-15.046-15.046zm-45.049-.8c2.299 0 4.438-.671 6.25-1.814a14.544 14.544 0 0 1 5.467-9.276c.012-.22.033-.438.033-.66 0-6.491-5.262-11.752-11.75-11.752-6.492 0-11.752 5.261-11.752 11.752 0 6.488 5.26 11.75 11.752 11.75zm10.554 10.888a14.492 14.492 0 0 1-4.467-10.032c-.367-.027-.73-.056-1.104-.056h-9.971C6.75 30.653 0 37.403 0 45.699v12.197l.031.188.84.265c6.352 1.983 12.021 2.897 16.945 3.185v-3.683c.002-8.078 5.396-14.915 12.773-17.11z" fill="#6279f2" opacity="1" data-original="#000000"></path></g></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Qtd. Hóspedes</span>
                            <p className="font-semibold text-sm">{reserva?.qtd_hospede} pessoas</p>
                        </div>
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-8 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 105.78"><defs></defs><title>scissors</title><path d="M95.36,19.84c11-5.17,20.18-5.08,27.52-.1l-65,37.45a12.92,12.92,0,0,1-7.22,3c-2.42.13-3.29-.56-5.39-.95a7.22,7.22,0,0,0-5.4,1l-1.71,1.56c-1.53,1.39-3.37,2.6-3.07,5,.2,1.58,1.55,2.91,3.69,4.06A15.4,15.4,0,0,1,42.56,76,17.92,17.92,0,0,1,44,82.5c-.39,7.55-3.92,14.07-12.41,19-9.68,6-17.86,5.27-25.18.86C2,98.93,0,94.82,0,90.16,0,83,3.41,77.26,8.73,72.78A73.68,73.68,0,0,1,20.66,65.1l14-10.95.25.85L95.36,19.84Zm0,66.1c11,5.17,20.18,5.08,27.52.1L69.16,55.09,55.53,62.78,95.36,85.94ZM42.29,46.56a7.4,7.4,0,0,1-2.41-1L38.17,44c-1.53-1.39-3.37-2.6-3.07-5,.2-1.59,1.55-2.92,3.69-4.06a15.44,15.44,0,0,0,3.77-5.2A17.86,17.86,0,0,0,44,23.29c-.39-7.55-3.92-14.08-12.41-19C21.93-1.63,13.75-.95,6.43,3.46,2,6.85,0,11,0,15.63,0,22.74,3.41,28.53,8.73,33a73,73,0,0,0,11.93,7.68L34.24,51.31l.6-.35.06-.18.12.08,7.27-4.3ZM32.85,30.43c3.91-2.55,4.31-6.85,2.87-10.95C34.57,16.19,32.1,13.35,28.4,11A21.36,21.36,0,0,0,15.88,7.77c-8.44.77-10,8.29-6.35,14.86a17.07,17.07,0,0,0,7.37,6.92A24.19,24.19,0,0,0,24.44,32a12.16,12.16,0,0,0,8.41-1.56ZM55.08,53.11a3.58,3.58,0,1,1-3.57-3.58,3.57,3.57,0,0,1,3.57,3.58ZM32.85,75.36c3.91,2.55,4.31,6.84,2.87,10.94-1.15,3.3-3.62,6.13-7.32,8.53A21.44,21.44,0,0,1,15.88,98c-8.44-.78-10-8.3-6.35-14.87a17,17,0,0,1,7.37-6.91,23.94,23.94,0,0,1,7.54-2.45,12.16,12.16,0,0,1,8.41,1.57Z" fill="#6279f2" /></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Comissão</span>
                            {reserva?.tipo_reserva != 'Continuidade' && <p className="font-semibold text-sm">R$ {Number(reserva?.comissao_ota).toFixed(2)}</p>}
                        </div>
                    </div>}
                    {reserva?.tipo_reserva == 'Indisponibilidade' ? null : <div className="grid gap-4"
                        style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-8 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 484.184 484.184" ><g><path d="M309.43 219.944c-19-10.5-39.2-18.5-59.2-26.8-11.6-4.8-22.7-10.4-32.5-18.2-19.3-15.4-15.6-40.4 7-50.3 6.4-2.8 13.1-3.7 19.9-4.1 26.2-1.4 51.1 3.4 74.8 14.8 11.8 5.7 15.7 3.9 19.7-8.4 4.2-13 7.7-26.2 11.6-39.3 2.6-8.8-.6-14.6-8.9-18.3-15.2-6.7-30.8-11.5-47.2-14.1-21.4-3.3-21.4-3.4-21.5-24.9-.1-30.3-.1-30.3-30.5-30.3-4.4 0-8.8-.1-13.2 0-14.2.4-16.6 2.9-17 17.2-.2 6.4 0 12.8-.1 19.3-.1 19-.2 18.7-18.4 25.3-44 16-71.2 46-74.1 94-2.6 42.5 19.6 71.2 54.5 92.1 21.5 12.9 45.3 20.5 68.1 30.6 8.9 3.9 17.4 8.4 24.8 14.6 21.9 18.1 17.9 48.2-8.1 59.6-13.9 6.1-28.6 7.6-43.7 5.7-23.3-2.9-45.6-9-66.6-19.9-12.3-6.4-15.9-4.7-20.1 8.6-3.6 11.5-6.8 23.1-10 34.7-4.3 15.6-2.7 19.3 12.2 26.6 19 9.2 39.3 13.9 60 17.2 16.2 2.6 16.7 3.3 16.9 20.1.1 7.6.1 15.3.2 22.9.1 9.6 4.7 15.2 14.6 15.4 11.2.2 22.5.2 33.7-.1 9.2-.2 13.9-5.2 13.9-14.5 0-10.4.5-20.9.1-31.3-.5-10.6 4.1-16 14.3-18.8 23.5-6.4 43.5-19 58.9-37.8 42.8-52 26.5-128.1-34.1-161.6z" fill="#6279f2" opacity="1" data-original="#000000" ></path></g></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Valor Bruto</span>
                            <p className="font-semibold text-sm">R$ {Number(reserva?.valor).toFixed(2)}</p>
                        </div>
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-9 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" ><g><path d="m93.9 29.7-.6-.1v-.4c-.1-1.1-.6-2-1.4-2.7s-1.8-1-2.9-.9L72.9 27l-60.8-7.7c-2.2-.3-4.2 1.3-4.5 3.5L6.3 33.1c-.9.2-1.7.6-2.3 1.3-.7.8-1 1.9-.9 2.9l1.1 12.1-1.6 13c-.1 1.1.2 2.1.8 3 .6.8 1.4 1.3 2.4 1.5L6.7 77c.2 2.1 1.9 3.6 4 3.6h.4l61-5.5 15.9 2h.5c2 0 3.7-1.5 4-3.5l.1-.4.8-.1c1.1-.1 2-.6 2.7-1.4s1-1.9.9-2.9L95.4 51l2.1-17c.2-2-1.4-4-3.6-4.3zM9.6 23.1c.1-1 1-1.8 2-1.8h.3l51.8 6.5-55.3 5zM5 64.1c-.3-.4-.5-1-.4-1.5l.5-3.8.5 5.8c-.2-.1-.4-.3-.6-.5zm83.2 11.1-6.8-.9 9.1-.8c-.2 1.1-1.2 1.8-2.3 1.7zm6.2-4.6c-.3.4-.8.7-1.3.7h-.3l-2 .2-18.6 1.7-9.5.8-51.9 4.6c-1.1.1-2.1-.7-2.2-1.8L7.7 67l-.2-2-1.3-15.5-.8-9.4-.3-3c0-.5.1-1 .5-1.5.1-.2.3-.3.4-.4.3-.1.6-.2.9-.2l1.2-.1 64.8-5.8 9.3-.8 7-.6h.2c.5 0 .9.2 1.3.5s.7.8.7 1.3l.2 2 1.8 19.7.8 9.4.8 8.7c-.1.3-.2.9-.6 1.3zm1-36.7-1 7.9-.9-10.1h.2c1.1.1 1.9 1.1 1.7 2.2z" fill="#6279f2" opacity="1" data-original="#000000"></path><path d="M86.1 38.7c-1.5.1-3-.3-4.2-1.3s-1.9-2.3-2-3.9c0-.3-.2-.5-.4-.7s-.5-.3-.7-.2l-30.5 2.7L18 38c-.5.1-1 .5-.9 1.1.1 1.5-.3 3-1.3 4.2s-2.4 1.9-3.9 2c-.3 0-.5.2-.7.4s-.2.4-.2.7l1.7 19.3.1 1c0 .5.5 1 1.1.9 1.1-.1 2.2.1 3.1.6 1.7.9 2.9 2.5 3.1 4.6 0 .3.2.5.4.7s.4.2.6.2h.1L44 71.6l7.6-.7 1.7-.1L82 68.2c.3 0 .5-.2.7-.3.2-.2.3-.5.2-.7-.1-1.5.3-3 1.3-4.2s2.4-1.9 3.9-2c.3 0 .5-.2.7-.4s.3-.5.2-.7l-1.8-20.3c-.1-.6-.5-1-1.1-.9zm-3.4 23c-1.1 1.3-1.7 2.9-1.8 4.6L51.4 69l-7.3.7-9.3.8L22 71.6c-.2-1.1-.7-2.1-1.4-2.9-.8-1-1.8-1.9-3-2.4-.9-.4-1.9-.7-2.9-.7l-1.6-18.4c3.4-.8 5.9-3.7 6-7.2l29.5-2.7L78 34.6c.4 1.7 1.3 3.1 2.6 4.3 1.3 1.1 2.9 1.7 4.6 1.8l1.7 18.4c-1.6.4-3.1 1.3-4.2 2.6z" fill="#6279f2" opacity="1" data-original="#000000"></path><path d="M49.9 52.1c-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3s.1-1 .5-1.4c.3-.4.8-.7 1.3-.7s1 .1 1.4.5c.4.3.7.8.7 1.3s.5 1 1.1.9c.6 0 1-.5.9-1.1-.1-1.1-.6-2-1.4-2.7-.5-.5-1.2-.7-1.9-.9l-.1-1.1c0-.5-.5-1-1.1-.9-.5 0-1 .5-.9 1.1l.1 1.1c-.7.2-1.2.6-1.7 1.2-.7.8-1 1.8-.9 2.9s.6 2 1.4 2.7 1.9 1 2.9.9c1.1-.1 2 .7 2.1 1.8 0 .5-.1 1-.5 1.4-.3.4-.8.7-1.3.7-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3 0-.6-.5-1-1.1-.9-.6 0-1 .5-.9 1.1.1 1.1.6 2 1.4 2.7.6.5 1.2.8 1.9.9l.1 1.1c0 .5.5.9 1 .9h.1c.5 0 1-.5.9-1.1l-.1-1.1c.7-.2 1.2-.6 1.7-1.2.7-.8 1-1.8.9-2.9s-.6-2-1.4-2.7c-.8-.6-1.8-1-2.9-.9z" fill="#6279f2" opacity="1" data-original="#000000"></path><path d="M58.7 42.7c-2.8-2.3-6.3-3.4-9.9-3.1-7.5.7-13 7.3-12.3 14.8.3 3.6 2 6.9 4.8 9.2 2.5 2.1 5.5 3.2 8.7 3.2.4 0 .8 0 1.2-.1 7.1-.6 12.4-6.6 12.4-13.5V52c-.4-3.7-2.1-7-4.9-9.3zm-7.7 22c-3 .3-6.1-.7-8.4-2.7s-3.8-4.8-4.1-7.9c-.6-6.4 4.2-12 10.5-12.6h1.1c2.7 0 5.3.9 7.4 2.7 1.2 1 2.2 2.2 2.8 3.5.7 1.3 1.1 2.8 1.3 4.3.5 6.5-4.2 12.1-10.6 12.7zM20.9 50c-1.9 0-3.5 1.6-3.5 3.5S19 57 20.9 57s3.5-1.6 3.5-3.5c-.1-1.9-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5c-.1.8-.7 1.5-1.5 1.5zM79.1 50c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5S81 50 79.1 50zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S80 55 79.1 55z" fill="#6279f2" opacity="1" data-original="#000000"></path></g></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Valor Líquido</span>
                            <p className="font-semibold text-sm">R$ {Number(reserva?.valor_liq).toFixed(2)}</p>
                        </div>
                    </div>}
                    {reserva?.obs ? <div className="grid gap-4">
                        <div className="border border-zinc-300 rounded-md px-3 py-2 flex flex-col justify-center relative pl-12">
                            <svg className="absolute w-9 h-fit left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 502.664 502.664" ><g><path d="M378.74 181.184c0-76.576-84.708-138.743-189.305-138.743C84.73 42.441 0 104.608 0 181.184c0 47.154 32.291 88.591 81.343 113.7l-47.024 89.389 101.987-70.515c16.955 3.645 34.6 6.234 53.129 6.234 104.618 0 189.305-62.146 189.305-138.808zM129.942 196.24H89.95v-40.014h39.992v40.014zM251.3 156.226h39.992v40.014H251.3v-40.014zm-80.675 0h39.971v40.014h-39.971v-40.014z" fill="#6279f2" data-original="#6279f2"></path><path d="M502.664 268.481c0-50.325-38.763-93.984-95.602-115.943 2.804 10.332 4.314 21.053 4.314 32.097 0 90.77-100.304 164.412-224.25 164.412-1.532 0-2.955-.324-4.465-.324 32.68 30.868 83.695 50.799 141.138 50.799 17.515 0 34.147-2.438 50.152-5.846l96.378 66.546-44.457-84.363c46.334-23.748 76.792-62.878 76.792-107.378z" fill="#6279f2" data-original="#6279f2" ></path></g></svg>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">{reserva.tipo_reserva == 'Indisponibilidade' ? 'Motivo' : 'Observações'}</span>
                            <p className="font-semibold text-sm ml-2">{reserva.obs}</p>
                        </div>
                    </div> : null}
                    {reserva?.tipo_reserva != 'Indisponibilidade' && reserva?.tipo_reserva != 'Continuidade' ? <div className="flex justify-between mt-3">
                        <button
                            onClick={() => {
                                /* const confirma = confirm('Tem certeza que deseja excluir esta reserva?')
                                if (confirma) {
                                    deleteReserva(Number(props.id))
                                } */
                                setCancelamento(true)
                            }}
                            className="px-2 py-1 text-sm font-medium bg-red-100 text-red-500 rounded-md">Cancelar Reserva</button>
                        <button
                            onClick={() => {
                                setEditar(true)
                            }}
                            className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-500 rounded-md">Editar Reserva</button>
                        <button
                            onClick={() => {
                                setContinuidade(true)
                            }}
                            className="px-2 py-1 text-sm font-medium bg-green-100 text-green-500 rounded-md">Extender Reserva</button>
                    </div> : null}
                    {reserva?.tipo_reserva == 'Continuidade' ? <div className="flex justify-between mt-3">
                        <button
                            onClick={() => {
                                /* const confirma = confirm('Tem certeza que deseja excluir esta reserva?')
                                if (confirma) {
                                    deleteReserva(Number(props.id))
                                } */
                                setCancelamento(true)
                            }}
                            className="px-2 py-1 text-sm font-medium bg-red-100 text-red-500 rounded-md">Cancelar Continuidade</button>
                    </div> : null}
                    {reserva?.tipo_reserva == 'Indisponibilidade' ? <div className="flex justify-between mt-3">
                        <button
                            onClick={() => {
                                const confirma = confirm('Tem certeza que deseja excluir esta reserva?')
                                if (confirma) {
                                    deleteReserva(Number(props.id))
                                }
                            }}
                            className="px-2 py-1 text-sm font-medium bg-red-100 text-red-500 rounded-md">Excluir Indisponibilidade</button>
                    </div> : null}
                </section>
            </div >
            {cancelamento &&
                <CardCancelamento
                    close={() => setCancelamento(false)}
                    id={reserva?.id || 0} />
            }
        </div >
    )
}
