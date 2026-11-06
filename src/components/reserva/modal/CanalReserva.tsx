import { useState, type FormEvent } from "react";
import { Save, Trash } from "lucide-react";
import useCanalReserva from "./useCanalReserva";

interface CanalReservaEdicao {
  nome: string;
  cor: string;
}

interface CanalReservaProps {
  aberto: boolean;
  aoFechar: () => void;
  atualizar: () => void;
}

export default function CanalReserva({
  aberto,
  aoFechar,
  atualizar,
}: CanalReservaProps) {
  const {
    todosCanais,
    deleteCanalReserva,
    editCanalReserva,
    createCanalReserva,
  } = useCanalReserva(aberto);
  const [edicoes, setEdicoes] = useState<Record<number, CanalReservaEdicao>>(
    {},
  );
  const [novoCanal, setNovoCanal] = useState({ nome: "", cor: "#000000" });

  async function handleCriarCanal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = novoCanal.nome.trim();
    if (!nome) return;

    const criado = await createCanalReserva({ ...novoCanal, nome });
    if (criado) {
      setNovoCanal({ nome: "", cor: "#000000" });
      atualizar();
    }
  }

  return (
    <dialog
      id="canal-reserva"
      onClose={aoFechar}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">{"Canais de Reserva"}</h3>
        <ul className="mt-4 flex flex-col gap-2">
          {todosCanais?.map((canal) => {
            const edicao = edicoes[canal.id] ?? {
              nome: canal.nome,
              cor: canal.cor,
            };
            const alterado =
              edicao.nome !== canal.nome || edicao.cor !== canal.cor;

            return (
              <li
                key={canal.id}
                className="flex justify-between items-center border border-zinc-300 rounded-md pl-2"
              >
                <input
                  type="color"
                  className="size-4 rounded-full border cursor-pointer"
                  value={edicao.cor}
                  onChange={(event) =>
                    setEdicoes((anteriores) => ({
                      ...anteriores,
                      [canal.id]: { ...edicao, cor: event.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  value={edicao.nome}
                  className="input input-ghost"
                  onChange={(event) =>
                    setEdicoes((anteriores) => ({
                      ...anteriores,
                      [canal.id]: { ...edicao, nome: event.target.value },
                    }))
                  }
                />
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  aria-label={`Salvar alterações de ${canal.nome}`}
                  disabled={!alterado}
                  onClick={async () => {
                    const editado = await editCanalReserva(canal.id, edicao);
                    if (editado) {
                      atualizar();
                    }
                  }}
                >
                  <Save className="size-4" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-error btn-outline hover:bg-error hover:text-white"
                  onClick={() => deleteCanalReserva(canal.id)}
                >
                  <Trash className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={handleCriarCanal}
        >
          <input
            type="color"
            aria-label="Cor do novo canal"
            className="size-8 rounded border cursor-pointer"
            value={novoCanal.cor}
            onChange={(event) =>
              setNovoCanal((canal) => ({ ...canal, cor: event.target.value }))
            }
          />
          <input
            type="text"
            aria-label="Nome do novo canal"
            className="input input-bordered flex-1"
            placeholder="Nome do canal"
            value={novoCanal.nome}
            onChange={(event) =>
              setNovoCanal((canal) => ({ ...canal, nome: event.target.value }))
            }
            required
          />
          <button type="submit" className="btn btn-primary">
            Cadastrar
          </button>
        </form>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline">Cancelar</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
