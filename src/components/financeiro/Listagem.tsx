interface ListagemProps {
  movimentacao: {
    id: number;
    receita: boolean;
    acomodacao?: string;
    cor: string;
    nome: string;
    categoria: string;
    data: string;
    valor: number;
    valorLiq: number;
  }[];
}

export default function Listagem(props: ListagemProps) {
  return (
    <div className="overflow-x-auto rounded-box border border-black/40 bg-zinc-100 max-h-100">
      <table className="table table-xs table-pin-rows">
        <thead>
          <tr>
            <th className="text-center">Data</th>
            <th className="text-center">Categoria</th>
            <th className="text-center">Descrição</th>
            <th className="text-center">Acomodação</th>
            <th className="text-center">Valor Total</th>
            <th className="text-center">Valor Líquido</th>
          </tr>
        </thead>
        <tbody>
          {props.movimentacao.map((r) => (
            <tr /* className="cursor-pointer" */ key={r.id}>
              <th className="text-center">{r.data}</th>
              <td className="text-center">
                <div
                  className={`badge badge-sm text-white`}
                  style={{ backgroundColor: r.cor }}
                >
                  {r.categoria}
                </div>
              </td>
              <td className="text-center">{r.nome}</td>
              <td className="text-center">{r.acomodacao}</td>
              <td className="text-center">
                {new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(r.valor)}
              </td>
              <td className="text-center">
                {new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(r.valorLiq)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary"></th>
            <th className="font-semibold text-center text-primary">
              R${" "}
              {new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(
                props.movimentacao.reduce(
                  (total, r) =>
                    r.receita ? total + (r.valor ?? 0) : total - (r.valor ?? 0),
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
                props.movimentacao.reduce(
                  (total, r) =>
                    r.receita
                      ? total + (r.valorLiq ?? 0)
                      : total - (r.valorLiq ?? 0),
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
