import { useEffect, useRef, useState } from 'react';
import ReservaCardView from '../ReservaCardView';

export default function Calendario({ acomodacoes, reservas }: { acomodacoes: any[], reservas: any[] }) {
  const iframeRef = useRef(null);
  const altura = 200 + (60 * (acomodacoes.length - 1));
  const [reservaView, setReservaView] = useState(false)
  const [dados, setDados] = useState<any>()

  useEffect(() => {
    const iframe: any = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        const data = {
          resources: acomodacoes,
          events: reservas,
        };
        iframe.contentWindow.postMessage(data, '*');
      };
      iframe.addEventListener('load', handleLoad);

      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        src='../../../public/index.html'
        className={`w-full min-h-56 max-h-[440px] border border-zinc-300 rounded-lg`}
        style={{ height: `${altura}px` }}
      />
      <button className='hidden' id='bttn-log' onClick={(e: any) => {
        const value = e.target.getAttribute('data-value')
        setReservaView(true)
        setDados(JSON.parse(value))
      }}></button>
      {reservaView &&
        <ReservaCardView
          close={() => setReservaView(false)}
          hospede={dados.event.title}
          qtdhospede={dados.event.extendedProps.hospedes}
          chegada={dados.event.start}
          partida={dados.event.end}
          bruto={dados.event.extendedProps.bruto}
          liquido={dados.event.extendedProps.liquido}
          comissao={dados.event.extendedProps.comissao}
          tipo={dados.event.extendedProps.tipo}
          obs={dados.event.extendedProps.obs}
        />}
    </>
  );
}