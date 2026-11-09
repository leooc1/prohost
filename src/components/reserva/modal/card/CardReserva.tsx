import { useState } from "react";
import { CircleX } from "lucide-react";
import ContinuarReserva from "../ContinuarReserva";
import NovaReserva from "../NovaReserva";
import type { ReservaEdicao } from "../ReservaEdicao";
import Layout from "./Layout";
import useCardReserva from "./useCardReserva";

interface CardReservaProps {
  id: number | null;
  cancel: () => void;
  aoAtualizar: () => void;
}

export default function CardReserva(props: CardReservaProps) {
  const { reserva, carregando, deleteReserva } = useCardReserva(props.id);
  const [reservaParaEditar, setReservaParaEditar] =
    useState<ReservaEdicao | null>(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [reservaParaEstender, setReservaParaEstender] =
    useState<ReservaEdicao | null>(null);
  const [modalExtensaoAberto, setModalExtensaoAberto] = useState(false);

  async function excluirReserva() {
    if (props.id === null) return;
    const excluida = await deleteReserva(props.id);
    if (!excluida) return;

    (document.getElementById("card-reserva") as HTMLDialogElement).close();
    props.aoAtualizar();
  }

  function abrirEdicao() {
    if (!reserva) return;
    setReservaParaEditar(reserva);
    setModalEdicaoAberto(true);
    (document.getElementById("card-reserva") as HTMLDialogElement).close();
  }

  function abrirExtensao() {
    if (!reserva) return;
    setReservaParaEstender(reserva);
    setModalExtensaoAberto(true);
    (document.getElementById("card-reserva") as HTMLDialogElement).close();
  }

  return (
    <>
      <dialog
        id="card-reserva"
        onClose={props.cancel}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <div className="mb-2 flex justify-between">
            <h3 className="text-lg font-bold">{reserva?.tipoReserva}</h3>
            <form method="dialog">
              <button type="submit" className="cursor-pointer">
                <CircleX className="text-red-600" />
              </button>
            </form>
          </div>
          <div className="flex w-full flex-col gap-2">
            {carregando ? (
              <span className="loading loading-spinner loading-sm" />
            ) : reserva ? (
              <Layout tipoReserva={reserva.tipoReserva} reserva={reserva} />
            ) : null}
          </div>
          {reserva?.tipoReserva === "Reserva" && (
            <div className="modal-action flex flex-wrap justify-around">
              <button
                type="button"
                className="btn btn-sm btn-soft btn-error"
                onClick={excluirReserva}
              >
                Cancelar reserva
              </button>
              <button
                type="button"
                className="btn btn-sm btn-soft btn-info"
                onClick={abrirEdicao}
              >
                Editar reserva
              </button>
              <button
                type="button"
                className="btn btn-sm btn-soft btn-success"
                onClick={abrirExtensao}
              >
                Estender reserva
              </button>
            </div>
          )}
          {reserva?.tipoReserva === "Continuidade" && (
            <div className="modal-action flex flex-wrap justify-around">
              <button
                type="button"
                className="btn btn-sm btn-soft btn-error"
                onClick={excluirReserva}
              >
                Cancelar continuidade
              </button>
              <button
                type="button"
                className="btn btn-sm btn-soft btn-info"
                onClick={() => {}}
              >
                Editar continuidade
              </button>
            </div>
          )}
          {reserva?.tipoReserva === "Indisponibilidade" && (
            <div className="modal-action flex flex-wrap justify-around">
              <button
                type="button"
                className="btn btn-sm btn-soft btn-error"
                onClick={excluirReserva}
              >
                Excluir indisponibilidade
              </button>
            </div>
          )}
        </div>
      </dialog>
      {reservaParaEditar && (
        <NovaReserva
          aberto={modalEdicaoAberto}
          aoFechar={() => {
            setModalEdicaoAberto(false);
            setReservaParaEditar(null);
          }}
          aoSalvar={props.aoAtualizar}
          reservaInicial={reservaParaEditar}
          modalId="editar-reserva-dialog"
        />
      )}
      {reservaParaEstender && (
        <ContinuarReserva
          aberto={modalExtensaoAberto}
          reserva={reservaParaEstender}
          aoFechar={() => {
            setModalExtensaoAberto(false);
            setReservaParaEstender(null);
          }}
          aoSalvar={props.aoAtualizar}
        />
      )}
    </>
  );
}
