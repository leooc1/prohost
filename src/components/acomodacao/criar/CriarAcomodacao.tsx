import { Toaster } from 'react-hot-toast';
import Modal from '../modal/Modal';
interface CriarAcomodacaoProps {
  atualizar?: () => Promise<void>;
}

export default function CriarAcomodacao(props: CriarAcomodacaoProps) {
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() =>
          (
            document.getElementById('criar-acomodacao') as HTMLDialogElement
          ).showModal()
        }
      >
        Cadastrar
      </button>
      <dialog
        id="criar-acomodacao"
        className="modal modal-bottom sm:modal-middle"
      >
        <Toaster />
        <Modal
          title={'Cadastrar Acomodação'}
          type="post"
          atualizar={props.atualizar}
        />
      </dialog>
    </div>
  );
}
