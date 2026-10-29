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
  return (
    <div className="overflow-x-auto rounded-box border border-black/40 bg-zinc-100 max-h-100">
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
            <tr>
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
                {r.canalReserva == 'Indisponibilidade' ? null : r.qtdHospede}
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
            <th className="font-semibold text-center text-primary">2</th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary">20</th>
            <th className="font-semibold text-center text-primary">
              R$ 20.000,00
            </th>
            <th className="font-semibold text-center text-primary">
              R$ 20.000,00
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
