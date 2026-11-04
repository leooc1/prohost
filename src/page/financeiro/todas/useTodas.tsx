import { useEffect, useMemo, useState } from "react";
import { getCookieValid, options } from "../../../utils";

const apiURL = import.meta.env.VITE_API_URL;

interface Reserva {
  id: number;
  tipoReserva: string;
}

interface Acomodacao {
  id: number;
  nome: string;
}

interface CategoriaFinanceiro {
  id: number;
  cor: string;
  nome: string;
}

interface Movimentacao {
  id: number;
  data: string;
  categoriaFinanceiro: CategoriaFinanceiro | null;
  reserva: Reserva | null;
  nome: string;
  acomodacao: Acomodacao | null;
  valor: string;
  valorLiq: string;
  tipoDespesa: string | null;
  receita: boolean;
}

export default function useTodas() {
  const { token } = getCookieValid("ph_lg_tk_acc");

  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[] | null>(
    null,
  );

  const [dataInicio, setDataInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1 - 1, 1)
      .toISOString()
      .slice(0, 10),
  );
  const [dataFim, setDataFim] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      .toISOString()
      .slice(0, 10),
  );

  async function getMovimentacoes() {
    const result = await fetch(
      `${apiURL}/movimentacao?dataInicio=${dataInicio}&dataFim=${dataFim}&sortBy=data&order=asc`,
      options.get(token ?? ""),
    );

    if (!result.ok) {
      throw new Error("Erro ao buscar movimentações");
    }

    const data = await result.json();
    setMovimentacoes(data);
  }

  useEffect(() => {
    if (!token) return;
    getMovimentacoes().catch(console.error);
  }, [token]);

  const todasMovimentacoes = useMemo(() => {
    if (movimentacoes)
      return movimentacoes.map((m) => ({
        id: m.id,
        data: new Intl.DateTimeFormat("pt-BR").format(new Date(m.data.slice(0, 10)+'T00:00:00-03:00')),
        categoria: m.reserva
          ? m.reserva.tipoReserva === "Reserva"
            ? "Diária"
            : m.reserva.tipoReserva
          : (m.categoriaFinanceiro?.nome as string),
        nome: m.nome,
        cor: m.reserva
          ? m.reserva.tipoReserva === "Reserva"
            ? "#2563eb"
            : m.reserva.tipoReserva === "Continuidade"
              ? "#10b981"
              : "#f97316"
          : (m.categoriaFinanceiro?.cor as string),
        acomodacao: m.acomodacao?.nome ?? "",
        valor: Number(m.valor),
        valorLiq: Number(m.valorLiq),
      }));
    return [];
  }, [movimentacoes]);

  return {
    todasMovimentacoes,
  };
}
