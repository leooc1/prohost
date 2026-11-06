import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCookieValid, options } from "../../../../utils";

const apiURL = import.meta.env.VITE_API_URL;

interface Reserva {
  id: number;
  acomodacao: { id: number; nome: string };
  canalReserva?: { id: number; nome: string };
  hospede?: { id: number; nome: string };
  qtdHospede?: number;
  checkIn: string;
  checkOut: string;
  tipoReserva: "Reserva" | "Indisponibilidade" | "Continuidade";
  valor?: number;
  valorLiq?: number;
  obs?: string | null;
}

export default function useCardReserva(id: number | null) {
  const { token } = getCookieValid("ph_lg_tk_acc");
  const [dados, setDados] = useState<{ id: number; reserva: Reserva } | null>(
    null,
  );
  const [idCarregando, setIdCarregando] = useState<number | null>(null);

  useEffect(() => {
    if (id === null || !token) return;

    let ativo = true;
    const idAtual = id;
    const tokenAtual = token;

    async function carregarReserva() {
      setIdCarregando(idAtual);
      setDados(null);

      try {
        const result = await fetch(
          `${apiURL}/reserva/${idAtual}`,
          options.get(tokenAtual),
        );

        if (!result.ok) {
          throw new Error("Não foi possível carregar os dados da reserva.");
        }

        const data: Reserva = await result.json();
        if (ativo) setDados({ id: idAtual, reserva: data });
      } catch (error) {
        if (ativo) {
          console.error(error);
          toast.error("Não foi possível carregar os dados da reserva.");
        }
      } finally {
        if (ativo) setIdCarregando(null);
      }
    }

    carregarReserva();
    return () => {
      ativo = false;
    };
  }, [id, token]);

  async function deleteReserva(id: number) {
    const result = await fetch(
      `${apiURL}/reserva/${id}`,
      options.delete(token ?? ""),
    );
    const data = await result.json().catch(() => null);

    if (result.status !== 200) {
      toast.error(data?.message ?? "Não foi possível excluir.");
      return false;
    }
    toast.success(`${data?.tipoReserva ?? "Reserva"} foi excluída com sucesso!`);
    return true;
  }

  const reserva = id !== null && dados?.id === id ? dados.reserva : null;
  const carregando = id !== null && idCarregando === id;

  return { reserva, carregando, deleteReserva };
}
