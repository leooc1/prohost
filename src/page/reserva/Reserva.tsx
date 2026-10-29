import { CalendarCheck, List } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Link, Outlet } from 'react-router-dom';

export default function Reserva() {
  const [pageActive, setPageActive] = useState<'calendario' | 'lista'>(
    location.pathname == '/reserva/calendario' ? 'calendario' : 'lista',
  );

  return (
    <div className="min-h-dvh w-full py-20 bg-background">
      <Toaster />
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-semibold text-primary px-8">Reservas</h1>
        <div className="flex justify-around gap-2 px-2">
          <div className="join">
            <Link
            onClick={()=>setPageActive('calendario')}
              to={'/reserva/calendario'}
              className={`group hover:text-blue-500 btn lg:btn-md md:btn-sm btn-xs join-item ${pageActive == 'calendario' ? 'text-blue-500' : ''}`}
            >
              <CalendarCheck className={`size-5`} />
              Calendário
            </Link>
            <Link
            onClick={()=>setPageActive('lista')}
              to={'/reserva/lista'}
              className={`group hover:text-blue-500 btn lg:btn-md md:btn-sm btn-xs join-item ${pageActive == 'lista' ? 'text-blue-500' : ''}`}
            >
              <List className={`size-5`} />
              Lista
            </Link>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button className="btn lg:btn-md md:btn-sm btn-xs btn-outline">
              Canais de Reserva
            </button>
            <button className="btn lg:btn-md md:btn-sm btn-xs btn-error text-white">
              Nova Indisponibilidade
            </button>
            <button className="btn lg:btn-md md:btn-sm btn-xs btn-primary">
              Cadastrar
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
