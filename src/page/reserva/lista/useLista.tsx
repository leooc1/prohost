import { useEffect, useMemo, useState } from "react";
import { countDiaria, getCookieValid, options } from "../../../utils";
import type { EventType } from "../../../components/reserva/calendario/CalendarioReservas";

const apiURL = import.meta.env.VITE_API_URL;

interface Reserva {
  id: number;
  acomodacao: {
    id: number;
    nome: string;
  };
  canalReserva: {
    id: number;
    nome: string;
    cor: string;
  };
  hospede: {
    id: number;
    nome: string;
  };
  qtdHospede: number;
  checkIn: string;
  checkOut: string;
  tipoReserva: EventType;
  valor: number;
  valorLiq: number;
}

export default function useLista() {
  const { token } = getCookieValid("ph_lg_tk_acc");

  const [reservas, setReservas] = useState<Reserva[] | null>(null);

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

  const [periodo, setPeriodo] = useState<
    | "mes-atual"
    | "mes-anterior"
    | "ano-atual"
    | "ano-anterior"
    | "personalizado"
  >("mes-atual");

  useEffect(() => {
    switch (periodo) {
      case "mes-atual":
        setDataInicio(
          new Date(new Date().getFullYear(), new Date().getMonth() + 1 - 1, 1)
            .toISOString()
            .slice(0, 10),
        );
        setDataFim(
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            .toISOString()
            .slice(0, 10),
        );
        break;
      case "mes-anterior":
        setDataInicio(
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
            .toISOString()
            .slice(0, 10),
        );
        setDataFim(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString()
            .slice(0, 10),
        );
        break;
      case "ano-atual":
        setDataInicio(
          new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
        );
        setDataFim(
          new Date(new Date().getFullYear() + 1, 0, 1)
            .toISOString()
            .slice(0, 10),
        );
        break;
      case "ano-anterior":
        setDataInicio(
          new Date(new Date().getFullYear() - 1, 0, 1)
            .toISOString()
            .slice(0, 10),
        );
        setDataFim(
          new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
        );
        break;
      case "personalizado":
        setDataInicio(
          new Date(new Date().getFullYear(), new Date().getMonth() + 1 - 1, 1)
            .toISOString()
            .slice(0, 10),
        );
        setDataFim(
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            .toISOString()
            .slice(0, 10),
        );
        break;
    }
  }, [periodo]);

  async function getReservas() {
    const result = await fetch(
      `${apiURL}/reserva?dataInicio=${dataInicio}&dataFim=${dataFim}`,
      options.get(token ?? ""),
    );

    if (!result.ok) {
      throw new Error("Erro ao buscar reservas");
    }

    const data = await result.json();
    setReservas(data);
  }

  useEffect(() => {
    if (!token) return;
    getReservas().catch(console.error);
  }, [token, dataInicio, dataFim]);

  const todasReservas = useMemo(() => {
    if (reservas)
      return reservas.map((r) => ({
        id: r.id,
        acomodacao: r.acomodacao.nome,
        cor:
          r.tipoReserva == "Indisponibilidade"
            ? "#000000"
            : r.tipoReserva == "Continuidade"
              ? "#33cc33"
              : r.canalReserva.cor,
        canalReserva:
          r.tipoReserva == "Reserva" ? r.canalReserva.nome : r.tipoReserva,
        hospede: r.hospede?.nome ?? undefined,
        qtdHospede: r.qtdHospede,
        checkIn: new Intl.DateTimeFormat("pt-BR", {}).format(
          new Date(r.checkIn),
        ),
        checkOut: new Intl.DateTimeFormat("pt-BR", {}).format(
          new Date(r.checkOut),
        ),
        diarias: countDiaria(r.checkIn, r.checkOut),
        valor:
          r.tipoReserva == "Indisponibilidade"
            ? undefined
            : new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(r.valor),
        valorLiq:
          r.tipoReserva == "Indisponibilidade"
            ? undefined
            : new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(r.valorLiq),
        tipoReserva: r.tipoReserva,
      }));
    return [];
  }, [reservas]);

  return {
    todasReservas,
    periodo,
    setPeriodo,
    setDataInicio,
    setDataFim,
  };
}
