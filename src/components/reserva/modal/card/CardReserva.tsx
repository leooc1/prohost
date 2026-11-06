import { CircleX } from "lucide-react";
import Layout from "./Layout";
import useCardReserva from "./useCardReserva";

interface CardReservaProps {
  id: number | null;
  cancel: () => void;
  aoAtualizar: () => void;
}

export default function CardReserva(props: CardReservaProps) {
  const { reserva, carregando, deleteReserva } = useCardReserva(props.id);

  async function excluirReserva() {
    if (props.id === null) return;
    const excluida = await deleteReserva(props.id);
    if (!excluida) return;

    (document.getElementById("card-reserva") as HTMLDialogElement).close();
    props.aoAtualizar();
  }

  return (
    <dialog
      id="card-reserva"
      onClose={props.cancel}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <div className="flex justify-between mb-2">
          <h3 className="font-bold text-lg">{reserva?.tipoReserva}</h3>
          <form method="dialog">
            <button type="submit" className="cursor-pointer">
              <CircleX className="text-red-600" />
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {carregando ? (
            <span className="loading loading-spinner loading-sm" />
          ) : reserva ? (
            <Layout tipoReserva={reserva.tipoReserva} reserva={reserva} />
          ) : null}
        </div>
        {reserva?.tipoReserva === "Reserva" && (
          <div className="modal-action flex justify-around flex-wrap">
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
              onClick={() => {}}
            >
              Editar reserva
            </button>
            <button
              type="button"
              className="btn btn-sm btn-soft btn-success"
              onClick={() => {}}
            >
              Estender reserva
            </button>
          </div>
        )}
        {reserva?.tipoReserva === "Continuidade" && (
          <div className="modal-action flex justify-around flex-wrap">
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
          <div className="modal-action flex justify-around flex-wrap">
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
  );
}
