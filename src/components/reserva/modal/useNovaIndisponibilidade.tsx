import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCookieValid, options } from "../../../utils";

const apiURL = import.meta.env.VITE_API_URL;

interface Acomodacao {
  id: number;
  nome: string;
  desativado: boolean;
}

interface Indisponibilidade {
  acomodacaoId: string;
  checkIn: string;
  checkOut: string;
  motivo: string;
}

const estadoInicial: Indisponibilidade = {
  acomodacaoId: "",
  checkIn: "",
  checkOut: "",
  motivo: "",
};

export default function useNovaIndisponibilidade(aberto: boolean) {
  const { token } = getCookieValid("ph_lg_tk_acc");
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([]);
  const [indisponibilidade, setIndisponibilidade] =
    useState<Indisponibilidade>(estadoInicial);

  useEffect(() => {
    if (!aberto || !token) return;

    async function carregarAcomodacoes() {
      const result = await fetch(
        `${apiURL}/acomodacao`,
        options.get(token ?? ""),
      );

      if (!result.ok) {
        throw new Error("Não foi possível carregar as acomodações.");
      }

      const data: Acomodacao[] = await result.json();
      setAcomodacoes(data.filter((acomodacao) => !acomodacao.desativado));
    }

    carregarAcomodacoes().catch((error: unknown) => {
      console.error(error);
      toast.error("Não foi possível carregar as acomodações.");
    });
  }, [aberto, token]);

  function atualizarCampo(
    campo: keyof Indisponibilidade,
    valor: string,
  ) {
    setIndisponibilidade((atual) => ({ ...atual, [campo]: valor }));
  }

  async function criarIndisponibilidade() {
    if (
      indisponibilidade.checkOut &&
      indisponibilidade.checkIn &&
      indisponibilidade.checkOut <= indisponibilidade.checkIn
    ) {
      toast.error("A data de saída deve ser posterior à data de entrada.");
      return false;
    }

    try {
      const result = await fetch(
        `${apiURL}/reserva`,
        options.post(
          {
            acomodacaoId: Number(indisponibilidade.acomodacaoId),
            checkIn: indisponibilidade.checkIn+'T00:00:00-03:00',
            checkOut: indisponibilidade.checkOut+'T00:00:00-03:00',
            tipoReserva: "Indisponibilidade",
            obs: indisponibilidade.motivo.trim() || undefined,
          },
          token ?? "",
        ),
      );
      const data = await result.json();

      if (result.status !== 201) {
        toast.error(data.message ?? "Não foi possível cadastrar a indisponibilidade.");
        return false;
      }

      toast.success("Indisponibilidade cadastrada com sucesso!");
      setIndisponibilidade(estadoInicial);
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível cadastrar a indisponibilidade.");
      return false;
    }
  }

  return {
    acomodacoes,
    indisponibilidade,
    atualizarCampo,
    criarIndisponibilidade,
  };
}
