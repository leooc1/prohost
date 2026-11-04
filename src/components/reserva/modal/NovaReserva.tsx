import { type FormEvent } from "react";
import { Info, Plus } from "lucide-react";
import useNovaReserva from "./useNovaReserva";

interface NovaReservaProps {
  aberto: boolean;
  aoFechar: () => void;
}

export default function NovaReserva({ aberto, aoFechar }: NovaReservaProps) {
  const {
    acomodacoes,
    canais,
    hospedes,
    reserva,
    atualizarCampo,
    selecionarAcomodacao,
    selecionarHospede,
    criarHospede,
    atualizarValor,
    criarReserva,
  } = useNovaReserva(aberto);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const criada = await criarReserva();
    if (criada) {
      (document.getElementById("criar-reserva") as HTMLDialogElement).close();
    }
  }

  return (
    <dialog
      id="criar-reserva"
      onClose={aoFechar}
      className="modal modal-bottom sm:modal-middle"
    >
      <form className="modal-box max-w-2xl" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold">Nova Reserva</h3>

        <fieldset className="fieldset mt-4 w-full">
          <label className="label text-black" htmlFor="reserva-acomodacao">
            Acomodação <span className="text-red-500">*</span>
          </label>
          <select
            id="reserva-acomodacao"
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
            <label className="label text-black" htmlFor="reserva-hospede">
              Hóspede <span className="text-red-500">*</span>
            </label>
            <div className="join w-full">
              <input
                id="reserva-hospede"
                type="text"
                list="reserva-hospedes"
                className="input input-sm join-item w-full"
                placeholder="Selecione um hóspede"
                value={reserva.hospedeNome}
                onChange={(event) => selecionarHospede(event.target.value)}
                required
              />
              <datalist id="reserva-hospedes">
                {hospedes.map((hospede) => (
                  <option key={hospede.id} value={hospede.nome} />
                ))}
              </datalist>
              <button
                type="button"
                className="btn btn-sm btn-primary join-item"
                aria-label="Cadastrar hóspede"
                title="Cadastrar hóspede"
                disabled={!reserva.hospedeNome.trim()}
                onClick={criarHospede}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <label className="label text-black" htmlFor="reserva-qtd-hospedes">
              Qtd. Hóspedes <span className="text-red-500">*</span>
            </label>
            <input
              id="reserva-qtd-hospedes"
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
            <label className="label text-black" htmlFor="reserva-checkin">
              Check-in <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="reserva-checkin"
                type="date"
                className="input input-sm min-w-0 flex-1"
                value={reserva.checkIn}
                onChange={(event) =>
                  atualizarCampo("checkIn", event.target.value)
                }
                required
              />
              <input
                type="time"
                aria-label="Horário do check-in"
                className="input input-sm w-24"
                value={reserva.horaCheckIn}
                onChange={(event) =>
                  atualizarCampo("horaCheckIn", event.target.value)
                }
                required
              />
            </div>
          </fieldset>
          <fieldset className="fieldset min-w-0">
            <label className="label text-black" htmlFor="reserva-checkout">
              Check-out <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="reserva-checkout"
                type="date"
                min={reserva.checkIn || undefined}
                className="input input-sm min-w-0 flex-1"
                value={reserva.checkOut}
                onChange={(event) =>
                  atualizarCampo("checkOut", event.target.value)
                }
                required
              />
              <input
                type="time"
                aria-label="Horário do check-out"
                className="input input-sm w-24"
                value={reserva.horaCheckOut}
                onChange={(event) =>
                  atualizarCampo("horaCheckOut", event.target.value)
                }
                required
              />
            </div>
          </fieldset>
        </div>

        <fieldset className="fieldset mt-3 w-full">
          <label className="label text-black" htmlFor="reserva-canal">
            Canal <span className="text-red-500">*</span>
          </label>
          <select
            id="reserva-canal"
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
            <label className="label text-black" htmlFor="reserva-valor">
              Valor Total <span className="text-red-500">*</span>
              <span title="Valor total da reserva">
                <Info className="size-3.5" aria-hidden="true" />
              </span>
            </label>
            <div className="flex items-center gap-1">
              <span>R$</span>
              <input
                id="reserva-valor"
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
            <label className="label text-black" htmlFor="reserva-comissao">
              Comissão <span className="text-red-500">*</span>
              <span title="Comissão do canal">
                <Info className="size-3.5" aria-hidden="true" />
              </span>
            </label>
            <div className="flex items-center gap-1">
              <span>R$</span>
              <input
                id="reserva-comissao"
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
            <label className="label text-black" htmlFor="reserva-valor-liquido">
              Valor Líquido <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              <span>R$</span>
              <input
                id="reserva-valor-liquido"
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

        <fieldset className="fieldset mt-3 w-full">
          <label className="label text-black" htmlFor="reserva-observacao">
            Observação
          </label>
          <input
            id="reserva-observacao"
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
                document.getElementById("criar-reserva") as HTMLDialogElement
              ).close();
            }}
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
