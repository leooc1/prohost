import { useEffect, useMemo, useState } from "react";
import { getCookieValid, options } from "../../../utils";
import type { EventType } from "../../../components/reserva/calendario/CalendarioReservas";

const apiURL = import.meta.env.VITE_API_URL;

interface Acomodacao {
  id: number;
  nome: string;
  tipo: "terceiro" | "proprio";
  desativado: boolean;
  foto: string | null;
}

interface Reserva {
  id: number;
  acomodacao: {
    id: number;
    nome: string;
  };
  canalReserva: {
    id: number;
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
}

export default function useCalendario() {
  const { token } = getCookieValid("ph_lg_tk_acc");

  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[] | null>(null);
  const [reservas, setReservas] = useState<Reserva[] | null>(null);
  const [images, setImages] = useState<{ id: number; foto: string | null }[]>(
    [],
  );
  const [mes, setMes] = useState<string>(
    ("0" + (new Date().getMonth() + 1)).slice(-2),
  );
  const [ano, setAno] = useState<string>(String(new Date().getFullYear()));
  const [initialDate, setInitialDate] = useState<string>(
    String(new Date().getFullYear()) +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2) +
      "-" +
      "01",
  );

  async function getAcomodacao() {
    const result = await fetch(
      `${apiURL}/acomodacao`,
      options.get(token ?? ""),
    );

    if (!result.ok) {
      throw new Error("Erro ao buscar acomodações");
    }

    const data: Acomodacao[] = await result.json();
    setAcomodacoes(data);
  }

  async function getReservas() {
    const result = await fetch(
      `${apiURL}/reserva/calendario?mes=${mes}&ano=${ano}`,
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
    getAcomodacao().catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    getReservas().catch(console.error);
  }, [token, initialDate]);

  useEffect(() => {
    if (!token || acomodacoes?.length === 0) return;

    async function getAcomodacaoImg() {
      const result = await fetch(
        `${apiURL}/acomodacao?img=true`,
        options.get(token ?? ""),
      );

      if (!result.ok) {
        throw new Error("Erro ao buscar imagens");
      }

      const data: { id: number; foto: string | null }[] = await result.json();
      setImages(data);
    }

    getAcomodacaoImg().catch(console.error);
  }, [token, acomodacoes]);

  const todasAcomodacoes = useMemo(() => {
    const imagensPorId = new Map(images.map((img) => [img.id, img.foto]));
    if (!acomodacoes) return null;
    const lista = acomodacoes.map((acomodacao) => ({
      ...acomodacao,
      foto: imagensPorId.has(acomodacao.id)
        ? imagensPorId.get(acomodacao.id)!
        : acomodacao.foto,
    }));

    return lista.filter((a) => !a.desativado);
  }, [acomodacoes, images]);

  const todasReservas = useMemo(() => {
    if (reservas)
      return reservas.map((r) => ({
        id: String(r.id),
        resourceId: String(r.acomodacao.id),
        start: r.checkIn,
        end: r.checkOut,
        title: r.hospede ? r.hospede.nome : undefined,
        tipo: r.tipoReserva,
        hospedes: r.qtdHospede ?? undefined,
        color:
          r.canalReserva && r.tipoReserva == "Reserva"
            ? r.canalReserva.cor
            : undefined,
      }));
    return [];
  }, [reservas]);

  return {
    todasAcomodacoes,
    mes,
    setMes,
    ano,
    setAno,
    initialDate,
    setInitialDate,
    todasReservas,
  };
}
