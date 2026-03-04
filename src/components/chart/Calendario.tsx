import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    permissao: number,
  }) {
  const iframeRef = useRef(null);
  const altura = 200 + (56 * (acomodacoes.length));
  const [reservaView, setReservaView] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [dados, setDados] = useState<{ event: { id: string } } | null>(null)

  useEffect(() => {
    localStorage.removeItem('ph-cld-initial-date')
    const iframe = iframeRef.current as HTMLIFrameElement | null
    if (iframe) {
      iframe.classList.add('hidden')
      const handleLoad = () => {
        const data = {
          resources: acomodacoes,
          events: reservas,
          initialDate: initialDate
        };
        if (iframe.contentWindow)
          iframe.contentWindow.postMessage(data, '*');
      };
      iframe.classList.remove('hidden')
      iframe.addEventListener('load', handleLoad);

      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }

  }, [acomodacoes]);

  const iframeKey = useMemo(() => {
  return JSON.stringify(acomodacoes.map(a => a.image))
}, [acomodacoes])

  return (
    <div className='relative'>
      <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black absolute'
        onClick={() => {
          setExpanded(!expanded)
        }}>{`${expanded ? 'Comprimir' : 'Expandir'}`} Calendário</button>
      <iframe
        id='frame-calendar'
        key={iframeKey}
        ref={iframeRef}
        src='/calendar.html'
        className={`w-full min-h-[450px] max-h-full border border-zinc-300 rounded-lg mb-24 transition-all duration-500`}
        style={{ height: `${!expanded ? 450 : altura}px` }}
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
    </div>
  );
}