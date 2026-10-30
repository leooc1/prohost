import { useState } from "react";
import CardReserva from "../modal/CardReserva";

interface ListagemProps {
  reservas: {
    id: number;
    acomodacao: string;
    cor: string;
    canalReserva: string;
    hospede?: string;
    qtdHospede?: number;
    checkIn: string;
    checkOut: string;
    diarias: number;
    valor?: string;
    valorLiq?: string;
  }[];
}

export default function Listagem(props: ListagemProps) {
  const [idReserva, setIdReserva] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto rounded-box border border-black/40 bg-zinc-100 max-h-100">
      <CardReserva cancel={() => setIdReserva(null)} id={idReserva} />
      <table className="table table-xs table-pin-rows">
        <thead>
          <tr>
            <th className="text-center">Acomodação</th>
            <th className="text-center">Canal</th>
            <th className="text-center">Hóspede</th>
            <th className="text-center">Qtd.Hóspede</th>
            <th className="text-center">Check-in</th>
            <th className="text-center">Check-out</th>
            <th className="text-center">Diárias</th>
            <th className="text-center">Valor Total</th>
            <th className="text-center">Valor Líquido</th>
          </tr>
        </thead>
        <tbody>
          {props.reservas.map((r) => (
            <tr
              className="cursor-pointer"
              onClick={() => {
                (
                  document.getElementById(`card-reserva`) as HTMLDialogElement
                ).showModal();
                setIdReserva(r.id);
              }}
            >
              <th className="text-center">{r.acomodacao}</th>
              <td className="text-center">
                <div
                  className={`badge badge-sm text-white`}
                  style={{ backgroundColor: r.cor }}
                >
                  {r.canalReserva}
                </div>
              </td>
              <td className="text-center">{r.hospede}</td>
              <td className="text-center">
                {r.canalReserva == "Indisponibilidade" ? null : r.qtdHospede}
              </td>
              <td className="text-center">{r.checkIn}</td>
              <td className="text-center">{r.checkOut}</td>
              <td className="text-center">{r.diarias}</td>
              <td className="text-center">{r.valor}</td>
              <td className="text-center">{r.valorLiq}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary">
              {props.reservas.reduce(
                (total, r) => total + (r.qtdHospede ?? 0),
                0,
              )}
            </th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary">
              {props.reservas.reduce((total, r) => total + r.diarias, 0)}
            </th>
            <th className="font-semibold text-center text-primary">
              R${" "}
              {new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(
                props.reservas.reduce(
                  (total, r) =>
                    total + (Number(r.valor?.replace(/\D/gm, "")) ?? 0) / 100,
                  0,
                ),
              )}
            </th>
            <th className="font-semibold text-center text-primary">
              R${" "}
              {new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(
                props.reservas.reduce(
                  (total, r) =>
                    total + (Number(r.valorLiq?.replace(/\D/gm, "")) ?? 0) / 100,
                  0,
                ),
              )}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
