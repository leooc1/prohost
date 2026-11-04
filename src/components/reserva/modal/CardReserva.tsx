interface CardReservaProps {
  id: number|null;
  cancel: () => void;
}

export default function CardReserva(props: CardReservaProps) {
  return (
    <dialog id="card-reserva" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reserva #{props.id}</h3>
        <form className="flex flex-col gap-2 w-full"></form>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline" onClick={props.cancel}>
              Cancelar
            </button>
          </form>
          <button className="btn btn-primary" onClick={() => console.log(props.id)}>
            Cadastrar
          </button>
        </div>
      </div>
    </dialog>
  );
}
