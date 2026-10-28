import { useEffect, useMemo, useState } from 'react';
import { getCookieValid, options } from '../../utils';
import toast from 'react-hot-toast';

const apiURL = import.meta.env.VITE_API_URL;

interface Acomodacao {
  id: number;
  nome: string;
  tipo: 'terceiro' | 'proprio';
  desativado: boolean;
  foto: string | null;
}

export default function useAcomodacao() {
  const { token } = getCookieValid('ph_lg_tk_acc');

  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[] | null>(null);
  const [images, setImages] = useState<{ id: number; foto: string | null }[]>(
    [],
  );

  async function getAcomodacao() {
    const result = await fetch(
      `${apiURL}/acomodacao`,
      options.get(token ?? ''),
    );

    if (!result.ok) {
      throw new Error('Erro ao buscar acomodações');
    }

    const data: Acomodacao[] = await result.json();
    setAcomodacoes(data);
  }

  useEffect(() => {
    if (!token) return;

    getAcomodacao().catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!token || acomodacoes?.length === 0) return;

    async function getAcomodacaoImg() {
      const result = await fetch(
        `${apiURL}/acomodacao?img=true`,
        options.get(token ?? ''),
      );

      if (!result.ok) {
        throw new Error('Erro ao buscar imagens');
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

    return {
      proprio: lista.filter((a) => a.tipo === 'proprio' && !a.desativado),
      terceiro: lista.filter((a) => a.tipo === 'terceiro' && !a.desativado),
      desativado: lista.filter((a) => a.desativado),
    };
  }, [acomodacoes, images]);

  async function toggleActive(id: number) {
    const result = await fetch(
      `${apiURL}/acomodacao/toggle-active/${id}`,
      options.put({}, token ?? ''),
    );
    const data = await result.json();

    if (result.status !== 200) {
      toast.error(data.message);
      return;
    }
    toast.success(
      `${data.nome} foi ${data.desativado ? 'desativado' : 'ativado'} com sucesso!`,
    );
    await getAcomodacao();
  }

  async function deleteAcomodacao(id: number) {
    const result = await fetch(
      `${apiURL}/acomodacao/${id}`,
      options.delete(token ?? ''),
    );
    const data = await result.json();

    if (result.status !== 200) {
      toast.error(data.message);
      return;
    }
    toast.success(
      `${data.nome} foi excluída com sucesso!`,
    );
    await getAcomodacao();
  }

  return { todasAcomodacoes, getAcomodacao, toggleActive, deleteAcomodacao };
}
