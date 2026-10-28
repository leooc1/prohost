import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import z from 'zod';
import { getCookieValid, options } from '../../../utils';
const apiURL = import.meta.env.VITE_API_URL;

interface AcomodacaoResponse {
  tipo: 'proprio' | 'terceiro';
  comissao: number | null;
  dataIniOpe: string;
  endereco: string | null;
  foto: string | null;
  nome: string;
  modeloNegocio: number;
  repasse: number;
  checkinPadrao: string | null;
  checkoutPadrao: string | null;
  valorImovel: number | null;
  taxaLimpeza: number | null;
}

export default function useEditarAcomodacao(
  id: number,
  atualizarAcomodacoes?: () => Promise<void>,
  aberto = false,
) {
  const { token } = getCookieValid('ph_lg_tk_acc');

  const Acomodacao = z
    .object({
      tipo: z.enum(['proprio', 'terceiro']),
      comissao: z
        .number()
        .min(1, 'Comissão deve estar entre 1 e 100')
        .max(100, 'Comissão deve estar entre 1 e 100')
        .optional(),
      dataIniOpe: z.string().length(10, 'Data do início da operação inválida'),
      endereco: z
        .string()
        .max(200, 'O endereço deve ter no maximo 200 caracteres')
        .optional(),
      foto: z.string().optional(),
      nome: z
        .string()
        .min(1, 'Preencha o campo nome')
        .max(50, 'Preencha o nome com no máximo 50 caracteres'),
      valorImovel: z.number('Preencha o valor do imóvel').optional(),
      taxaLimpeza: z.number('Preencha a taxa de limpeza').optional(),
      modeloNegocio: z.enum(['1', '3']),
      repasse: z.enum(['1', '2', '3']),
      checkinPadrao: z.string().length(5, 'Checkin inválido'),
      checkoutPadrao: z.string().length(5, 'Checkout inválido'),
    })
    .superRefine((data, ctx) => {
      if (data.modeloNegocio === '3' && !data.taxaLimpeza) {
        ctx.addIssue({
          code: 'custom',
          path: ['taxaLimpeza'],
          message: 'Informe a taxa de limpeza',
        });
      }
      if (data.tipo === 'terceiro' && !data.comissao) {
        ctx.addIssue({
          code: 'custom',
          path: ['comissao'],
          message: 'Informe a comissão',
        });
      }
    });

  const [acomodacao, setAcomodacao] = useState<{
    tipo: 'terceiro' | 'proprio';
    comissao: string;
    dataIniOpe: string;
    endereco: string;
    foto: string;
    nome: string;
    valorImovel: string;
    taxaLimpeza: string;
    modeloNegocio: string;
    repasse: string;
    checkinPadrao: string;
    checkoutPadrao: string;
  }>({
    tipo: 'proprio',
    comissao: '',
    dataIniOpe: '',
    endereco: '',
    foto: '',
    nome: '',
    valorImovel: '',
    taxaLimpeza: '',
    modeloNegocio: '3',
    repasse: '3',
    checkinPadrao: '15:00',
    checkoutPadrao: '11:00',
  });

  function changeField(field: keyof typeof acomodacao, value: string) {
    setAcomodacao((prev) => ({ ...prev, [field]: value }));
  }

  function changeMoney(field: keyof typeof acomodacao, value: string) {
    const onlyNumber = value.replace(/\D/g, '');

    // Permite apagar todo o conteúdo
    if (!onlyNumber) {
      setAcomodacao((prev) => ({
        ...prev,
        [field]: '',
      }));
      return;
    }

    const numberFormat = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(onlyNumber) / 100);

    setAcomodacao((prev) => ({
      ...prev,
      [field]: numberFormat,
    }));
  }

  async function editarAcomodacao(body: Record<string, unknown>) {
    const result = await fetch(
      `${apiURL}/acomodacao/${id}`,
      options.put(body, token ?? ''),
    );
    const data = await result.json();

    if (result.status !== 200) {
      toast.error(data.message);
      return;
    }
    toast.success('Editado com sucesso!');
    await atualizarAcomodacoes?.();
    setAcomodacao({
      tipo: 'proprio',
      comissao: '',
      dataIniOpe: '',
      endereco: '',
      foto: '',
      nome: '',
      valorImovel: '',
      taxaLimpeza: '',
      modeloNegocio: '3',
      repasse: '3',
      checkinPadrao: '15:00',
      checkoutPadrao: '11:00',
    });
    (
      document.getElementById(`editar-acomodacao-${id}`) as HTMLDialogElement
    ).close();
  }

  function verifyFields() {
    const result = Acomodacao.safeParse({
      ...acomodacao,
      comissao:
        acomodacao.comissao.length > 0
          ? Number(acomodacao.comissao)
          : undefined,
      valorImovel: Number(acomodacao.valorImovel.replace(/\D/gm, '')) / 100,
      taxaLimpeza: Number(acomodacao.taxaLimpeza.replace(/\D/gm, '')) / 100,
    });
    if (!result.success)
      result.error.issues.forEach((err) => toast.error(err.message));
    else
      editarAcomodacao({
        ...acomodacao,
        modeloNegocio: Number(acomodacao.modeloNegocio),
        repasse: Number(acomodacao.repasse),
        foto: acomodacao.foto.length > 0 ? acomodacao.foto : null,
        comissao:
          acomodacao.comissao.length > 0 ? Number(acomodacao.comissao) : null,
        valorImovel: Number(acomodacao.valorImovel.replace(/\D/gm, '')) / 100,
        taxaLimpeza: Number(acomodacao.taxaLimpeza.replace(/\D/gm, '')) / 100,
      });
  }

  useEffect(() => {
    if (!aberto || !token) return;

    let active = true;

    async function buscarAcomodacao() {
      try {
        const result = await fetch(
          `${apiURL}/acomodacao/${id}`,
          options.get(token ?? ''),
        );
        const data = await result.json();
        if (result.status !== 200) {
          toast.error(data.message);
          return;
        }

        const acomodacaoBuscada: AcomodacaoResponse = data;
        if (!active) return;

        setAcomodacao({
          tipo: acomodacaoBuscada.tipo,
          comissao:
            acomodacaoBuscada.comissao == null
              ? ''
              : String(acomodacaoBuscada.comissao),
          dataIniOpe: acomodacaoBuscada.dataIniOpe.slice(0, 10),
          endereco: acomodacaoBuscada.endereco ?? '',
          foto: acomodacaoBuscada.foto ?? '',
          nome: acomodacaoBuscada.nome,
          valorImovel:
            acomodacaoBuscada.valorImovel == null
              ? ''
              : new Intl.NumberFormat('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(acomodacaoBuscada.valorImovel)),
          taxaLimpeza:
            acomodacaoBuscada.taxaLimpeza == null
              ? ''
              : new Intl.NumberFormat('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(acomodacaoBuscada.taxaLimpeza)),
          modeloNegocio: String(acomodacaoBuscada.modeloNegocio),
          repasse: String(acomodacaoBuscada.repasse),
          checkinPadrao: acomodacaoBuscada.checkinPadrao ?? '',
          checkoutPadrao: acomodacaoBuscada.checkoutPadrao ?? '',
        });
      } catch {
        toast.error('Não foi possível carregar a acomodação.');
      }
    }

    buscarAcomodacao();
    async function buscarImagem() {
      try {
        const result = await fetch(
          `${apiURL}/acomodacao/${id}?img=true`,
          options.get(token ?? ''),
        );
        const data = await result.json();
        if (result.status !== 200) {
          toast.error(data.message);
          return;
        }

        const imagem: { id: number; foto: string } = data;

        setAcomodacao((prev) => ({ ...prev, foto: imagem.foto }));
      } catch {
        toast.error('Não foi possível carregar a imagem.');
      }
    }
    buscarImagem();
    return () => {
      active = false;
    };
  }, [aberto, id, token]);

  return { acomodacao, changeField, changeMoney, verifyFields };
}
