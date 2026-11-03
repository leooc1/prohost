import { useEffect, useMemo, useState } from "react";
import { getCookieValid, options } from "../../../utils";
import toast from "react-hot-toast";

const apiURL = import.meta.env.VITE_API_URL;

interface CanalReserva {
  id: number;
  nome: string;
  cor: string;
}

export default function useCanalReserva() {
  const { token } = getCookieValid("ph_lg_tk_acc");
  const [canaisReserva, setCanaisReserva] = useState<CanalReserva[] | null>(
    null,
  );

  async function getCanalReserva() {
    const result = await fetch(
      `${apiURL}/canal-reserva`,
      options.get(token ?? ""),
    );

    if (!result.ok) {
      throw new Error("Erro ao buscar acomodações");
    }

    const data: CanalReserva[] = await result.json();
    setCanaisReserva(data);
  }

  useEffect(() => {
    if (!token) return;

    getCanalReserva().catch(console.error);
  }, [token]);

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
