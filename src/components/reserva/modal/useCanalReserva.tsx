import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getCookieValid, options } from "../../../utils";

const apiURL = import.meta.env.VITE_API_URL;

interface CanalReserva {
  id: number;
  nome: string;
  cor: string;
}

async function buscarCanaisReserva(token: string) {
  const result = await fetch(`${apiURL}/canal-reserva`, options.get(token));

  if (!result.ok) {
    throw new Error("Erro ao buscar canais de reserva.");
  }

  return (await result.json()) as CanalReserva[];
}

export default function useCanalReserva(aberto: boolean) {
  const { token } = getCookieValid("ph_lg_tk_acc");
  const [canaisReserva, setCanaisReserva] = useState<CanalReserva[] | null>(
    null,
  );

  async function getCanalReserva() {
    const data = await buscarCanaisReserva(token ?? "");
    setCanaisReserva(data);
  }

  useEffect(() => {
    if (!aberto || !token) return;
    const tokenAtual = token;

    async function carregarCanaisReserva() {
      setCanaisReserva(await buscarCanaisReserva(tokenAtual));
    }

    carregarCanaisReserva().catch(console.error);
  }, [aberto, token]);

  const todosCanais = useMemo(() => {
    if (!canaisReserva) return null;
    return canaisReserva;
  }, [canaisReserva]);

  async function deleteCanalReserva(id: number) {
    const result = await fetch(
      `${apiURL}/canal-reserva/${id}`,
      options.delete(token ?? ""),
    );
    const data = await result.json();

    if (result.status !== 200) {
      toast.error(`Não foi possível excluir o canal`);
      return;
    }
    toast.success(`${data.nome} foi excluída com sucesso!`);
    await getCanalReserva();
  }

  async function editCanalReserva(
    id: number,
    body: { nome: string; cor: string },
  ) {
    const result = await fetch(
      `${apiURL}/canal-reserva/${id}`,
      options.put(body, token ?? ""),
    );
    const data = await result.json();

    if (result.status !== 200) {
      toast.error(data.message);
      return;
    }
    toast.success(`${data.nome} foi editada com sucesso!`);
    await getCanalReserva();
    return true
  }

  async function createCanalReserva(body: { nome: string; cor: string }) {
    const result = await fetch(
      `${apiURL}/canal-reserva`,
      options.post(body, token ?? ""),
    );
    const data = await result.json();

    if (result.status !== 201) {
      toast.error(data.message);
      return false;
    }

    toast.success(`${data.nome} foi criado com sucesso!`);
    await getCanalReserva();
    return true;
  }

  return {
    todosCanais,
    getCanalReserva,
    deleteCanalReserva,
    editCanalReserva,
    createCanalReserva,
  };
}
