import { type FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCookieValid, options } from "../../../utils";
import type { ReservaEdicao } from "./ReservaEdicao";

const apiURL = import.meta.env.VITE_API_URL;

interface ContinuarReservaProps {
  aberto: boolean;
  reserva: ReservaEdicao;
  aoFechar: () => void;
  aoSalvar: () => void;
}

function extrairPartesDataHora(valor: string) {
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(valor));
  const parte = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((item) => item.type === tipo)?.value ?? "";

  return {
    data: `${parte("year")}-${parte("month")}-${parte("day")}`,
    hora: `${parte("hour")}:${parte("minute")}`,
  };
}

export default function ContinuarReserva({
  aberto,
  reserva,
  aoFechar,
  aoSalvar,
}: ContinuarReservaProps) {
  const { token } = getCookieValid("ph_lg_tk_acc");
  const [dataCheckout, setDataCheckout] = useState("");
  const [horaCheckout, setHoraCheckout] = useState(
    () => extrairPartesDataHora(reserva.checkOut).hora,
  );
  const [valor, setValor] = useState("");
  const [observacao, setObservacao] = useState("");
  const checkInLocal = extrairPartesDataHora(reserva.checkOut);

  useEffect(() => {
    const dialog = document.getElementById(
      "continuar-reserva",
    ) as HTMLDialogElement | null;
    if (!dialog) return;

    if (aberto && !dialog.open) dialog.showModal();
    if (!aberto && dialog.open) dialog.close();
  }, [aberto]);

  function atualizarValor(valorInformado: string) {
    const centavos = Number(valorInformado.replace(/\D/g, ""));
    if (!centavos) {
      setValor("");
      return;
    }

    setValor(
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(centavos / 100),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const checkout = `${dataCheckout}T${horaCheckout}:00-03:00`;
    if (new Date(checkout).getTime() <= new Date(reserva.checkOut).getTime()) {
      toast.error("O checkout deve ser posterior ao checkout atual.");
      return;
    }

    const valorNumerico = Number(valor.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      toast.error("Informe um valor total válido.");
      return;
    }

    try {
      console.log({
        valor: valorNumerico,
        valorLiq: valorNumerico,
        checkIn: reserva.checkOut,
        checkOut: checkout,
        continuidadeId: reserva.id,
        tipoReserva: "Continuidade",
        obs: observacao.trim() || undefined,
      });
      // return true;
      const result = await fetch(
        `${apiURL}/reserva/continuidade`,
        options.post(
          {
            valor: valorNumerico,
            valorLiq: valorNumerico,
            checkIn: reserva.checkOut,
            checkOut: checkout,
            continuidadeId: reserva.id,
            tipoReserva: "Continuidade",
            obs: observacao.trim() || undefined,
          },
          token ?? "",
        ),
      );
      const data = await result.json();

      if (result.status !== 201) {
        toast.error(data.message ?? "Não foi possível criar a continuidade.");
        return;
      }

      toast.success("Continuidade criada com sucesso!");
      aoSalvar();
      (
        document.getElementById("continuar-reserva") as HTMLDialogElement
      ).close();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível criar a continuidade.");
    }
  }

  return (
    <dialog
      id="continuar-reserva"
      onClose={aoFechar}
      className="modal modal-bottom sm:modal-middle"
    >
      <form className="modal-box" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold">Continuidade de Reserva</h3>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)]">
          <fieldset className="fieldset min-w-0">
            <label
              className="label text-black"
              htmlFor="continuidade-checkout-data"
            >
              Nova data de Checkout <span className="text-red-500">*</span>
            </label>
            <input
              id="continuidade-checkout-data"
              type="date"
              className="input input-sm w-full"
              min={checkInLocal.data}
              value={dataCheckout}
              onChange={(event) => setDataCheckout(event.target.value)}
              required
            />
          </fieldset>
          <fieldset className="fieldset min-w-0">
            <label
              className="label text-black"
              htmlFor="continuidade-checkout-hora"
            >
              Horário <span className="text-red-500">*</span>
            </label>
            <input
              id="continuidade-checkout-hora"
              type="time"
              className="input input-sm w-full"
              min={
                dataCheckout === checkInLocal.data
                  ? checkInLocal.hora
                  : undefined
              }
              value={horaCheckout}
              onChange={(event) => setHoraCheckout(event.target.value)}
              required
            />
          </fieldset>
          <fieldset className="fieldset min-w-0">
            <label className="label text-black" htmlFor="continuidade-valor">
              Valor total <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              <span>R$</span>
              <input
                id="continuidade-valor"
                type="text"
                inputMode="decimal"
                className="input input-sm min-w-0 w-full"
                placeholder="R$"
                value={valor}
                onChange={(event) => atualizarValor(event.target.value)}
                required
              />
            </div>
          </fieldset>
        </div>

        <fieldset className="fieldset mt-3 w-full">
          <label className="label text-black" htmlFor="continuidade-observacao">
            Observação
          </label>
          <input
            id="continuidade-observacao"
            type="text"
            className="input input-sm w-full"
            placeholder="Opcional"
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
          />
        </fieldset>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() =>
              (
                document.getElementById(
                  "continuar-reserva",
                ) as HTMLDialogElement
              ).close()
            }
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Criar continuidade
          </button>
        </div>
      </form>
    </dialog>
  );
}
