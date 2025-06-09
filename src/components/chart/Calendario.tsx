import React, { useEffect, useRef, useState } from 'react';
import ReservaCardView from '../ReservaCardView';

export default function Calendario({ acomodacoes, reservas, initialDate, permissao }:
  {
    acomodacoes: { id: string, title: string, image: string }[],
    reservas: {
      resourceId: string, title: string, start: string, end: string,
      hospedes: number, color: string, id: string, tipo: string, obs: string,
      bruto: number, liquido: number, comissao: number,
    }[],
    initialDate: null | string,
    permissao: number
  }) {
  const iframeRef = useRef(null);
  const altura = 200 + (60 * (acomodacoes.length - 1));
  const [reservaView, setReservaView] = useState(false)
  const [dados, setDados] = useState<{ event: { id: string } } | null>(null)

  useEffect(() => {
    localStorage.removeItem('ph-cld-initial-date')
    const iframe = iframeRef.current as HTMLIFrameElement | null
    if (iframe) {
      const handleLoad = () => {
        const data = {
          resources: acomodacoes,
          events: reservas,
          initialDate: initialDate
        };
        if (iframe.contentWindow)
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
        id='frame-calendar'
        ref={iframeRef}
        src='/calendar.html'
        className={`w-full min-h-56 max-h-full border border-zinc-300 rounded-lg`}
        style={{ height: `${altura}px` }}
      />
      <button className='hidden' id='bttn-log' onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        const value = e.currentTarget.getAttribute('data-value') as string
        setReservaView(true)
        setDados(JSON.parse(value))
      }}></button>
      {reservaView &&
        <ReservaCardView
          permissao={permissao}
          close={() => setReservaView(false)}
          id={dados?.event.id || '0'}
        />}
    </>
  );
}