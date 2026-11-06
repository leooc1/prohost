import { type FormEvent } from "react";
import useNovaIndisponibilidade from "./useNovaIndisponibilidade";

interface NovaIndisponibilidadeProps {
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: () => void;
}

export default function NovaIndisponibilidade({
  aberto,
  aoFechar,
  aoSalvar,
}: NovaIndisponibilidadeProps) {
  const {
    acomodacoes,
    indisponibilidade,
    atualizarCampo,
    criarIndisponibilidade,
  } = useNovaIndisponibilidade(aberto);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const criada = await criarIndisponibilidade();
    if (criada) {
      aoSalvar();
      (
        document.getElementById(
          "criar-indisponibilidade",
        ) as HTMLDialogElement
      ).close();
    }
  }

  return (
    <dialog
      id="criar-indisponibilidade"
      onClose={aoFechar}
      className="modal modal-bottom sm:modal-middle"
    >
      <form className="modal-box" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold">Nova Indisponibilidade</h3>

        <fieldset className="fieldset mt-4 w-full">
          <label
            className="label text-black"
            htmlFor="indisponibilidade-acomodacao"
          >
            Acomodação <span className="text-red-500">*</span>
          </label>
          <select
            id="indisponibilidade-acomodacao"
            className="select select-sm w-full"
            value={indisponibilidade.acomodacaoId}
            onChange={(event) =>
              atualizarCampo("acomodacaoId", event.target.value)
            }
            required
          >
            <option value="" disabled>
              Selecione uma acomodação
            </option>
            {acomodacoes.map((acomodacao) => (
              <option key={acomodacao.id} value={acomodacao.id}>
                {acomodacao.nome}
              </option>
            ))}
          </select>
        </fieldset>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <fieldset className="fieldset w-full">
            <label
              className="label text-black"
              htmlFor="indisponibilidade-inicio"
            >
              De <span className="text-red-500">*</span>
            </label>
            <input
              id="indisponibilidade-inicio"
              type="date"
              className="input input-sm w-full"
              value={indisponibilidade.checkIn}
              onChange={(event) =>
                atualizarCampo("checkIn", event.target.value)
              }
              required
            />
          </fieldset>
          <fieldset className="fieldset w-full">
            <label
              className="label text-black"
              htmlFor="indisponibilidade-fim"
            >
              Até <span className="text-red-500">*</span>
            </label>
            <input
              id="indisponibilidade-fim"
              type="date"
              className="input input-sm w-full"
              value={indisponibilidade.checkOut}
              min={indisponibilidade.checkIn || undefined}
              onChange={(event) =>
                atualizarCampo("checkOut", event.target.value)
              }
              required
            />
          </fieldset>
        </div>

        <fieldset className="fieldset mt-3 w-full">
          <label
            className="label text-black"
            htmlFor="indisponibilidade-motivo"
          >
            Motivo
          </label>
          <input
            id="indisponibilidade-motivo"
            type="text"
            className="input input-sm w-full"
            placeholder="Opcional"
            value={indisponibilidade.motivo}
            onChange={(event) => atualizarCampo("motivo", event.target.value)}
          />
        </fieldset>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() =>
              (
                document.getElementById(
                  "criar-indisponibilidade",
                ) as HTMLDialogElement
              ).close()
            }
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Cadastrar
          </button>
        </div>
      </form>
    </dialog>
  );
}
