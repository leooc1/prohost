import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCookieValid, options } from "../../../utils";
import type { ReservaEdicao } from "./ReservaEdicao";

const apiURL = import.meta.env.VITE_API_URL;

interface Acomodacao {
  id: number;
  nome: string;
  desativado: boolean;
  checkinPadrao: string | null;
  checkoutPadrao: string | null;
  modeloNegocio: number;
  taxaLimpeza: number | null;
}

interface CanalReserva {
  id: number;
  nome: string;
}

interface Hospede {
  id: number;
  nome: string;
  email?: string | null;
  telefone?: string | null;
}

interface NovaReservaForm {
  acomodacaoId: string;
  hospedeId: string;
  hospedeNome: string;
  qtdHospede: string;
  checkIn: string;
  horaCheckIn: string;
  checkOut: string;
  horaCheckOut: string;
  canalReservaId: string;
  valor: string;
  comissao: string;
  valorLiquido: string;
  taxaLimpeza: string;
  obs: string;
}

const estadoInicial: NovaReservaForm = {
  acomodacaoId: "",
  hospedeId: "",
  hospedeNome: "",
  qtdHospede: "1",
  checkIn: "",
  horaCheckIn: "15:00",
  checkOut: "",
  horaCheckOut: "15:00",
  canalReservaId: "",
  valor: "",
  comissao: "",
  valorLiquido: "",
  taxaLimpeza: "",
  obs: "",
};

function valorEmCentavos(valor: string) {
  return Number(valor.replace(/\D/g, "")) || 0;
}

function formatarValor(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor / 100);
}

function formatarDataHora(data: string, hora: string) {
  return `${data}T${hora}:00-03:00`;
}

function extrairDataHora(valor: string) {
  const partes = new Intl.DateTimeFormat("en-CA", {
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

function estadoInicialReserva(
  reservaInicial?: ReservaEdicao | null,
): NovaReservaForm {
  if (!reservaInicial) return estadoInicial;

  const checkIn = extrairDataHora(reservaInicial.checkIn);
  const checkOut = extrairDataHora(reservaInicial.checkOut);
  return {
    acomodacaoId: String(reservaInicial.acomodacao.id),
    hospedeId: reservaInicial.hospede?.id
      ? String(reservaInicial.hospede.id)
      : "",
    hospedeNome: reservaInicial.hospede?.nome ?? "",
    qtdHospede: String(reservaInicial.qtdHospede ?? 1),
    checkIn: checkIn.data,
    horaCheckIn: checkIn.hora,
    checkOut: checkOut.data,
    horaCheckOut: checkOut.hora,
    canalReservaId: reservaInicial.canalReserva?.id
      ? String(reservaInicial.canalReserva.id)
      : "",
    valor:
      reservaInicial.valor == null
        ? ""
        : formatarValor(Math.round(reservaInicial.valor * 100)),
    comissao:
      reservaInicial.comissaoOta == null
        ? ""
        : formatarValor(Math.round(reservaInicial.comissaoOta * 100)),
    valorLiquido:
      reservaInicial.valorLiq == null
        ? ""
        : formatarValor(Math.round(reservaInicial.valorLiq * 100)),
    taxaLimpeza:
      reservaInicial.taxaLimpeza == null
        ? ""
        : formatarValor(Math.round(reservaInicial.taxaLimpeza * 100)),
    obs: reservaInicial.obs ?? "",
  };
}

export default function useNovaReserva(
  aberto: boolean,
  reservaInicial?: ReservaEdicao | null,
) {
  const { token } = getCookieValid("ph_lg_tk_acc");
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([]);
  const [canais, setCanais] = useState<CanalReserva[]>([]);
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [reserva, setReserva] = useState<NovaReservaForm>(() =>
    estadoInicialReserva(reservaInicial),
  );

  useEffect(() => {
    if (!aberto || !token) return;

    async function carregarOpcoes() {
      const [acomodacoesResponse, canaisResponse, hospedesResponse] =
        await Promise.all([
          fetch(`${apiURL}/acomodacao`, options.get(token ?? "")),
          fetch(`${apiURL}/canal-reserva`, options.get(token ?? "")),
          fetch(`${apiURL}/hospede`, options.get(token ?? "")),
        ]);

      if (
        !acomodacoesResponse.ok ||
        !canaisResponse.ok ||
        !hospedesResponse.ok
      ) {
        throw new Error("Não foi possível carregar os dados da reserva.");
      }

      const [acomodacoesData, canaisData, hospedesData] = await Promise.all([
        acomodacoesResponse.json() as Promise<Acomodacao[]>,
        canaisResponse.json() as Promise<CanalReserva[]>,
        hospedesResponse.json() as Promise<Hospede[]>,
      ]);

      setAcomodacoes(
        acomodacoesData.filter(
          (acomodacao) =>
            !acomodacao.desativado ||
            acomodacao.id === reservaInicial?.acomodacao.id,
        ),
      );
      setCanais(canaisData);
      setHospedes(hospedesData);
    }

    carregarOpcoes().catch((error: unknown) => {
      console.error(error);
      toast.error("Não foi possível carregar os dados da reserva.");
    });
  }, [aberto, reservaInicial?.acomodacao.id, token]);

  function atualizarCampo(campo: keyof NovaReservaForm, valor: string) {
    setReserva((atual) => ({ ...atual, [campo]: valor }));
  }

  function atualizarDataHora(campo: "checkIn" | "checkOut", valor: string) {
    const [data, hora] = valor.split("T");
    const campoHora = campo === "checkIn" ? "horaCheckIn" : "horaCheckOut";
    setReserva((atual) => ({
      ...atual,
      [campo]: data || "",
      [campoHora]: hora || atual[campoHora],
    }));
  }

  function selecionarAcomodacao(id: string) {
    const acomodacao = acomodacoes.find((item) => String(item.id) === id);
    setReserva((atual) => ({
      ...atual,
      acomodacaoId: id,
      horaCheckIn: acomodacao?.checkinPadrao?.slice(0, 5) || "15:00",
      horaCheckOut: acomodacao?.checkoutPadrao?.slice(0, 5) || "15:00",
      taxaLimpeza:
        acomodacao?.taxaLimpeza == null
          ? ""
          : formatarValor(Math.round(acomodacao.taxaLimpeza * 100)),
    }));
  }

  function selecionarHospede(nome: string) {
    const hospede = hospedes.find(
      (item) =>
        item.nome.toLocaleLowerCase() === nome.trim().toLocaleLowerCase(),
    );
    setReserva((atual) => ({
      ...atual,
      hospedeNome: nome,
      hospedeId: hospede ? String(hospede.id) : "",
    }));
  }

  async function criarHospede(nomeInformado: string): Promise<string | null> {
    const nome = nomeInformado.trim();
    if (!nome) {
      toast.error("Informe o nome do hóspede.");
      return null;
    }

    const existente = hospedes.find(
      (item) => item.nome.toLocaleLowerCase() === nome.toLocaleLowerCase(),
    );
    if (existente) {
      setReserva((atual) => ({
        ...atual,
        hospedeNome: existente.nome,
        hospedeId: String(existente.id),
      }));
      return String(existente.id);
    }

    try {
      const result = await fetch(
        `${apiURL}/hospede`,
        options.post({ nome, email: null, telefone: null }, token ?? ""),
      );
      const data: Hospede = await result.json();

      if (result.status !== 201 || !data.id) {
        toast.error("Não foi possível cadastrar o hóspede.");
        return null;
      }

      setHospedes((atuais) => [...atuais, data]);
      setReserva((atual) => ({
        ...atual,
        hospedeNome: data.nome,
        hospedeId: String(data.id),
      }));
      toast.success(`${data.nome} foi cadastrado(a) com sucesso!`);
      return String(data.id);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível cadastrar o hóspede.");
      return null;
    }
  }

  function atualizarValor(
    campo: "valor" | "comissao" | "valorLiquido",
    valor: string,
  ) {
    const formatado = valor ? formatarValor(valorEmCentavos(valor)) : "";
    const total =
      campo === "valor"
        ? valorEmCentavos(formatado)
        : valorEmCentavos(reserva.valor);
    const comissao =
      campo === "comissao"
        ? valorEmCentavos(formatado)
        : valorEmCentavos(reserva.comissao);
    const liquido =
      campo === "valorLiquido"
        ? valorEmCentavos(formatado)
        : valorEmCentavos(reserva.valorLiquido);

    if (campo === "valor") {
      setReserva((atual) => ({
        ...atual,
        valor: formatado,
        valorLiquido: atual.comissao
          ? formatarValor(Math.max(total - comissao, 0))
          : atual.valorLiquido,
      }));
    } else if (campo === "comissao") {
      setReserva((atual) => ({
        ...atual,
        comissao: formatado,
        valorLiquido: atual.valor
          ? formatarValor(Math.max(total - comissao, 0))
          : atual.valorLiquido,
      }));
    } else {
      setReserva((atual) => ({
        ...atual,
        valorLiquido: formatado,
        comissao: atual.valor
          ? formatarValor(Math.max(total - liquido, 0))
          : atual.comissao,
      }));
    }
  }

  function atualizarTaxaLimpeza(valor: string) {
    const formatado = valor ? formatarValor(valorEmCentavos(valor)) : "";
    atualizarCampo("taxaLimpeza", formatado);
  }

  async function salvarReserva(idReserva?: number) {
    if (!reserva.hospedeNome.trim()) {
      toast.error("Informe o nome do hóspede.");
      return false;
    }

    const checkIn = `${reserva.checkIn}T${reserva.horaCheckIn}`;
    const checkOut = `${reserva.checkOut}T${reserva.horaCheckOut}`;
    if (checkOut <= checkIn) {
      toast.error("O check-out deve ser posterior ao check-in.");
      return false;
    }

    const valorCentavos = valorEmCentavos(reserva.valor);
    const comissaoCentavos = valorEmCentavos(reserva.comissao);
    const liquidoCentavos = valorEmCentavos(reserva.valorLiquido);
    if (
      !reserva.valor ||
      !reserva.comissao ||
      !reserva.valorLiquido ||
      valorCentavos <= 0 ||
      comissaoCentavos + liquidoCentavos !== valorCentavos
    ) {
      toast.error("Confira o valor total, a comissão e o valor líquido.");
      return false;
    }

    const valor = valorCentavos / 100;
    const comissao = comissaoCentavos / 100;
    const valorLiquido = liquidoCentavos / 100;
    const hospedeId =
      reserva.hospedeId || (await criarHospede(reserva.hospedeNome));
    if (!hospedeId) return false;

    try {
      const body = {
        acomodacaoId: Number(reserva.acomodacaoId),
        checkIn: formatarDataHora(reserva.checkIn, reserva.horaCheckIn),
        checkOut: formatarDataHora(reserva.checkOut, reserva.horaCheckOut),
        canalReservaId: Number(reserva.canalReservaId),
        comissaoOta: comissao,
        hospedeId: Number(hospedeId),
        qtdHospede: Number(reserva.qtdHospede),
        valor,
        valorLiq: valorLiquido,
        taxaLimpeza:
          acomodacoes.find(
            (acomodacao) => acomodacao.id === Number(reserva.acomodacaoId),
          )?.modeloNegocio !== 1 && reserva.taxaLimpeza
            ? valorEmCentavos(reserva.taxaLimpeza) / 100
            : undefined,
        tipoReserva: "Reserva",
        obs: reserva.obs.trim() || undefined,
      };
      const result = await fetch(
        idReserva ? `${apiURL}/reserva/${idReserva}` : `${apiURL}/reserva`,
        idReserva
          ? options.put(body, token ?? "")
          : options.post(body, token ?? ""),
      );
      const data = await result.json();

      if (result.status !== (idReserva ? 200 : 201)) {
        toast.error(
          data.message ??
            `Não foi possível ${idReserva ? "editar" : "cadastrar"} a reserva.`,
        );
        return false;
      }

      toast.success(
        `Reserva ${idReserva ? "atualizada" : "cadastrada"} com sucesso!`,
      );
      setReserva(estadoInicial);
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        `Não foi possível ${idReserva ? "editar" : "cadastrar"} a reserva.`,
      );
      return false;
    }
  }

  return {
    acomodacoes,
    canais,
    hospedes,
    reserva,
    atualizarCampo,
    atualizarDataHora,
    selecionarAcomodacao,
    selecionarHospede,
    atualizarValor,
    atualizarTaxaLimpeza,
    salvarReserva,
  };
}
