
export default function NovaIndisponibilidade() {
  return (
    <dialog
      id="criar-indisponibilidade"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">{"Criar Indisponibilidade"}</h3>
        <form className="flex flex-col gap-2 w-full"></form>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline">Cancelar</button>
          </form>
          <button className="btn btn-primary" onClick={() => console.log()}>
            Cadastrar
          </button>
        </div>
      </div>
    </dialog>
  );
}
