import Modal from '../modal/Modal';
interface EditarAcomodacaoProps {
  atualizar?: () => Promise<void>;
  id: number;
  aberto: boolean;
  aoFechar: () => void;
}

export default function EditarAcomodacao(props: EditarAcomodacaoProps) {
  return (
    <div>
      <dialog
        id={`editar-acomodacao-${props.id}`}
        className="modal modal-bottom sm:modal-middle"
        onClose={props.aoFechar}
      >
        <Modal
          title={'Editar Acomodação'}
          type="put"
          atualizar={props.atualizar}
          id={props.id}
          aberto={props.aberto}
        />
      </dialog>
    </div>
  );
}
