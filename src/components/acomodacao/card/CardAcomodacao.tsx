import notImage from '../../../assets/not-image.jpg';
import { useState } from 'react';
import EditarAcomodacao from '../editar/EditarAcomodacao';
interface CardAcomodacaoProps {
  id: number;
  img?: string | null;
  nome: string;
  tipo: string;
  desativado: boolean;
  toggleActive: (id: number) => void;
  delete: (id: number) => void;
  buscarAcomodacoes?: () => Promise<void>;
}

export default function CardAcomodacao(props: CardAcomodacaoProps) {
  const [modalAberto, setModalAberto] = useState(false);

  function openModal() {
    (
      document.getElementById(
        `editar-acomodacao-${props.id}`,
      ) as HTMLDialogElement
    ).showModal();
    setModalAberto(true);
  }

  return (
    <>
      <EditarAcomodacao
        id={props.id}
        atualizar={props.buscarAcomodacoes}
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
      />
      <div
        className={`card bg-base-100 min-w-52 w-52 shadow-sm transition-all ${props.desativado ? 'cursor-no-drop' : 'hover:scale-105 cursor-pointer'}`}
        onClick={() => {
          if (props.desativado) return;
          openModal();
        }}
      >
        <figure className="px-5 pt-5">
          <img
            src={props.img ?? notImage}
            alt={props.nome}
            className="rounded-xl object-cover h-28 w-full"
          />
        </figure>
        <div className="card-body items-center text-center p-4">
          <h2 className="card-title">{props.nome}</h2>
          <div
            className={`badge badge-soft badge-xs font-medium ${props.tipo == 'proprio' ? 'badge-info' : 'badge-success'}`}
          >
            {props.tipo == 'proprio' ? 'PRÓPRIO' : 'TERCEIRO'}
          </div>
          {!props.desativado ? (
            <div className="card-actions flex justify-between">
              <button
                className="btn btn-error btn-sm btn-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  props.toggleActive(props.id);
                }}
              >
                Suspender
              </button>
            </div>
          ) : (
            <div className="card-actions flex justify-between">
              <button
                className="btn btn-success btn-sm btn-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  props.toggleActive(props.id);
                }}
              >
                Ativar
              </button>
              <button
                className="btn btn-error btn-sm btn-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  props.delete(props.id);
                }}
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
