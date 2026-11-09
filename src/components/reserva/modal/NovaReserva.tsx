import { type FormEvent, useEffect } from "react";
import { Info } from "lucide-react";
import type { ReservaEdicao } from "./ReservaEdicao";
import useNovaReserva from "./useNovaReserva";

interface NovaReservaProps {
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: () => void;
  reservaInicial?: ReservaEdicao | null;
  modalId?: string;
}

export default function NovaReserva({
  aberto,
  aoFechar,
  aoSalvar,
  reservaInicial = null,
  modalId = "criar-reserva",
}: NovaReservaProps) {
  const {
    acomodacoes,
    canais,
    hospedes,
    reserva,
    atualizarCampo,
    atualizarDataHora,
    selecionarAcomodacao,
    selecionarHospede,
    atualizarValor,
    atualizarTaxaLimpeza,
    salvarReserva,
  } = useNovaReserva(aberto, reservaInicial);
  const editando = reservaInicial !== null;
  const idPrefix = editando ? "editar-reserva" : "reserva";

  const acomodacaoSelecionada = acomodacoes.find(
    (acomodacao) => acomodacao.id === Number(reserva.acomodacaoId),
  );

  useEffect(() => {
    const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
    if (!dialog) return;

    if (aberto && !dialog.open) dialog.showModal();
    if (!aberto && dialog.open) dialog.close();
  }, [aberto, modalId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const salva = await salvarReserva(
      editando ? reservaInicial?.id : undefined,
    );
    if (salva) {
      aoSalvar();
      (document.getElementById(modalId) as HTMLDialogElement).close();
    }
  }

  return (
    <dialog
      id={modalId}
      onClose={aoFechar}
      className="modal modal-bottom sm:modal-middle"
    >
      <form className="modal-box max-w-2xl" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold">
          {editando ? "Editar Reserva" : "Nova Reserva"}
        </h3>

        <fieldset className="fieldset mt-4 w-full">
          <label
            className="label text-black"
            htmlFor={`${idPrefix}-acomodacao`}
          >
            Acomodação <span className="text-red-500">*</span>
          </label>
          <select
            id={`${idPrefix}-acomodacao`}
            className="select select-sm w-full"
            value={reserva.acomodacaoId}
            onChange={(event) => selecionarAcomodacao(event.target.value)}
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

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_7rem] gap-3">
          <fieldset className="fieldset min-w-0">
            <label className="label text-black" htmlFor={`${idPrefix}-hospede`}>
              Hóspede <span className="text-red-500">*</span>
            </label>
            <div className="join w-full">
              <input
                id={`${idPrefix}-hospede`}
                type="text"
                list={`${idPrefix}-hospedes`}
                className="input input-sm join-item w-full"
                placeholder="Selecione um hóspede"
                value={reserva.hospedeNome}
                onChange={(event) => selecionarHospede(event.target.value)}
                required
              />
              <datalist id={`${idPrefix}-hospedes`}>
                {hospedes.map((hospede) => (
                  <option key={hospede.id} value={hospede.nome} />
                ))}
              </datalist>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <label
              className="label text-black"
              htmlFor={`${idPrefix}-qtd-hospedes`}
            >
              Qtd. Hóspedes <span className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-qtd-hospedes`}
              type="number"
              min="1"
              className="input input-sm w-full text-center"
              value={reserva.qtdHospede}
              onChange={(event) =>
                atualizarCampo("qtdHospede", event.target.value)
              }
              required
            />
          </fieldset>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <fieldset className="fieldset min-w-0">
            <label
              className="label text-black"
              htmlFor={`${idPrefix}-checkin`}
            >
              Check-in <span className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-checkin`}
              type="datetime-local"
              className="input input-sm w-full"
              value={
                reserva.checkIn
                  ? `${reserva.checkIn}T${reserva.horaCheckIn}`
                  : ""
              }
              onChange={(event) =>
                atualizarDataHora("checkIn", event.target.value)
              }
              required
            />
          </fieldset>
          <fieldset className="fieldset min-w-0">
            <label
              className="label text-black"
              htmlFor={`${idPrefix}-checkout`}
            >
              Check-out <span className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-checkout`}
              type="datetime-local"
              min={
                reserva.checkIn
                  ? `${reserva.checkIn}T${reserva.horaCheckIn}`
                  : undefined
              }
              className="input input-sm w-full"
              value={
                reserva.checkOut
                  ? `${reserva.checkOut}T${reserva.horaCheckOut}`
                  : ""
              }
              onChange={(event) =>
                atualizarDataHora("checkOut", event.target.value)
              }
              required
            />
          </fieldset>
        </div>

        <fieldset className="fieldset mt-3 w-full">
          <label className="label text-black" htmlFor={`${idPrefix}-canal`}>
            Canal <span className="text-red-500">*</span>
          </label>
          <select
            id={`${idPrefix}-canal`}
            className="select select-sm w-full"
            value={reserva.canalReservaId}
            onChange={(event) =>
              atualizarCampo("canalReservaId", event.target.value)
            }
            required
          >
            <option value="" disabled>
              Selecione um canal
            </option>
            {canais.map((canal) => (
              <option key={canal.id} value={canal.id}>
                {canal.nome}
              </option>
            ))}
          </select>
        </fieldset>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <fieldset className="fieldset min-w-0">
            <label className="label text-black" htmlFor={`${idPrefix}-valor`}>
              Valor Total <span className="text-red-500">*</span>
              <span title="Valor total da reserva">
                <Info className="size-3.5" aria-hidden="true" />
              </span>
            </label>
            <div className="flex items-center gap-1">
              <span>R$</span>
              <input
                id={`${idPrefix}-valor`}
                type="text"
                inputMode="decimal"
                className="input input-sm min-w-0 w-full"
                placeholder="R$"
                value={reserva.valor}
                onChange={(event) =>
                  atualizarValor("valor", event.target.value)
                }
                required
              />
            </div>
          </fieldset>
          <fieldset className="fieldset min-w-0">
            <label
              className="label text-black"
              htmlFor={`${idPrefix}-comissao`}
            >
              Comissão <span className="text-red-500">*</span>
              <span title="Comissão do canal">
                <Info className="size-3.5" aria-hidden="true" />
              </span>
            </label>
            <div className="flex items-center gap-1">
              <span>R$</span>
              <input
                id={`${idPrefix}-comissao`}
                type="text"
                inputMode="decimal"
                className="input input-sm min-w-0 w-full"
                placeholder="R$"
                value={reserva.comissao}
                onChange={(event) =>
                  atualizarValor("comissao", event.target.value)
                }
                required
              />
            </div>
          </fieldset>
          <fieldset className="fieldset min-w-0">
            <label
              className="label text-black"
              htmlFor={`${idPrefix}-valor-liquido`}
            >
              Valor Líquido <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              <span>R$</span>
              <input
                id={`${idPrefix}-valor-liquido`}
                type="text"
                inputMode="decimal"
                className="input input-sm min-w-0 w-full"
                placeholder="R$"
                value={reserva.valorLiquido}
                onChange={(event) =>
                  atualizarValor("valorLiquido", event.target.value)
                }
                required
              />
            </div>
          </fieldset>
        </div>

        {acomodacaoSelecionada && acomodacaoSelecionada.modeloNegocio !== 1 && (
          <fieldset className="fieldset mt-3 w-full">
            <label
              className="label text-black"
              htmlFor={`${idPrefix}-taxa-limpeza`}
            >
              Taxa de limpeza
            </label>
            <div className="flex items-center gap-1">
              <span>R$</span>
              <input
                id={`${idPrefix}-taxa-limpeza`}
                type="text"
                inputMode="decimal"
                className="input input-sm w-full"
                placeholder="0,00"
                value={reserva.taxaLimpeza}
                onChange={(event) => atualizarTaxaLimpeza(event.target.value)}
              />
            </div>
          </fieldset>
        )}

        <fieldset className="fieldset mt-3 w-full">
          <label
            className="label text-black"
            htmlFor={`${idPrefix}-observacao`}
          >
            Observação
          </label>
          <input
            id={`${idPrefix}-observacao`}
            type="text"
            className="input input-sm w-full"
            placeholder="Opcional"
            value={reserva.obs}
            onChange={(event) => atualizarCampo("obs", event.target.value)}
          />
        </fieldset>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              (
                document.getElementById(modalId) as HTMLDialogElement
              ).close();
            }}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {editando ? "Salvar alterações" : "Cadastrar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
