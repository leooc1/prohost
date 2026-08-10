import { useState, ChangeEvent, FormEvent, useContext, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SideBarContext } from "../contexts/SideBarMenuContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interfaces baseadas no seu sistema
interface Acomodacao {
  id: number;
  nome: string;
  desativado: boolean;
}

interface CanalReserva {
  id: number;
  nome: string;
}

// Interface para a linha do CSV, mais flexível
interface CsvRow {
  originalIndex: number;
  [key: string]: any; // Permite quaisquer outros campos do CSV
}

interface RowWithMissingFields extends CsvRow {
  camposFaltantes: string[];
  camposMapeados: { [key: string]: string };
}

interface Pendentes {
  [anuncio: string]: RowWithMissingFields[];
}

interface PopupData {
  anuncio: string;
  registros: RowWithMissingFields[];
}

// Mapeamento dos campos do CSV para os campos da Reserva
const campoMap: { [key: string]: string } = {
  "acomodacao": "Anúncio",
  "check_in": "Data de início",
  "check_out": "Data de término",
  "hospede": "Hóspede",
  "qtd_hospede": "Número de hóspedes",
  "valor": "Valor do pagamento", // ou "Total pago"
  "valor_liq": "Ganhos",
  "taxa_limpeza": "Taxa de limpeza",
  "comissao_ota": "Taxa de serviço do anfitrião",
};

export default function ImportadorReservas() {
  const { dataToken } = useContext(SideBarContext);
  const [data, setData] = useState<CsvRow[]>([]);
  const [pendentes, setPendentes] = useState<Pendentes>({});
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([]);
  const [canais, setCanais] = useState<CanalReserva[]>([]);

  useEffect(() => {
    const fetchAssociacoes = async () => {
      if (dataToken?.id) {
        try {
          const [acomodacoesRes, canaisRes] = await Promise.all([
            api.get(`/acomodacao/${dataToken?.id}`),
            api.get(`/canal_reserva/${dataToken?.id}`)
          ]);
          setAcomodacoes(acomodacoesRes.data.filter((a: Acomodacao) => !a.desativado));
          setCanais(canaisRes.data);
        } catch (error) {
          toast.error("Falha ao buscar acomodações e canais.");
          console.error(error);
        }
      }
    };
    fetchAssociacoes();
  }, [dataToken]);


  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results:any) => {
        const registros = (results.data as any[])
          .map((r, index) => ({ ...r, originalIndex: index }))
          .filter(
            (r): r is CsvRow => r.Tipo === "Reserva" || r.Tipo === "Payout"
          );
        setData(registros);
        detectarPendentes(registros);
      },
    });
  };

  const detectarPendentes = (registros: CsvRow[]) => {
    // Campos obrigatórios para criar uma Reserva no seu sistema
    const obrigatoriosSistema = [
      "acomodacao", "check_in", "check_out", "hospede", "qtd_hospede",
      "valor", "valor_liq", "comissao_ota", "canal_reserva"
    ];

    const pend: RowWithMissingFields[] = [];

    registros.forEach((r) => {
      if (r.Tipo === "Reserva") {
        const camposMapeados: { [key: string]: string } = {};
        const camposFaltantes: string[] = [];

        obrigatoriosSistema.forEach(campoSistema => {
          const campoCsv = campoMap[campoSistema];
          if (campoCsv && r[campoCsv]) {
            camposMapeados[campoSistema] = r[campoCsv];
          } else if (campoSistema === 'canal_reserva') {
            // Tenta encontrar o canal "AirBnB" automaticamente
            const canalAirBnB = canais.find(c => c.nome.toLowerCase().includes('airbnb'));
            if (canalAirBnB) {
              camposMapeados[campoSistema] = canalAirBnB.id.toString();
            } else {
              camposFaltantes.push(campoSistema);
            }
          }
          else {
            camposFaltantes.push(campoSistema);
          }
        });

        if (camposFaltantes.length > 0) {
          pend.push({ ...r, camposFaltantes, camposMapeados } as RowWithMissingFields);
        }
      }
    });

    const agrupados = pend.reduce((acc: Pendentes, p) => {
      const anuncio = p["Anúncio"] || "Sem Anúncio";
      if (!acc[anuncio]) {
        acc[anuncio] = [];
      }
      acc[anuncio].push(p);
      return acc;
    }, {});

    setPendentes(agrupados);
  };

  const abrirPopup = (anuncio: string) => {
    if (pendentes[anuncio]) {
      setPopupData({ anuncio, registros: pendentes[anuncio] });
    }
  };

  const preencherCampos = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const preenchidos = Object.fromEntries(form.entries());

    const novosDados = data.map((r) => {
      const keyPrefix = `reserva-${r.originalIndex}-`;
      const camposParaEstaReserva: { [key: string]: string } = {};

      let mudou = false;
      for (const key in preenchidos) {
        if (key.startsWith(keyPrefix)) {
          const campoNome = key.replace(keyPrefix, "");
          camposParaEstaReserva[campoNome] = preenchidos[key] as string;
          mudou = true;
        }
      }

      if (mudou) {
        return { ...r, ...camposParaEstaReserva };
      }
      return r;
    });

    setData(novosDados);
    detectarPendentes(novosDados);
    setPopupData(null);
    toast.success("Dados preenchidos com sucesso!");
  };

  const handleEnviarDados = async () => {
    const temPendentes = Object.values(pendentes).some(p => p.length > 0);
    if (temPendentes) {
      toast.error("Ainda existem registros com campos pendentes. Por favor, preencha-os antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reservasParaEnviar = data
        .filter((r) => r.Tipo === "Reserva")
        .map(r => {
          // Mapeia e transforma os dados para o formato da API
          return {
            acomodacao: { id: r.acomodacao },
            check_in: r.check_in,
            check_out: r.check_out,
            hospede: { nome: r.hospede }, // Assumindo que a API pode criar/encontrar hóspede pelo nome
            qtd_hospede: Number(r.qtd_hospede),
            valor: Number(String(r.valor).replace(/[^0-9,-]/g, '').replace(',', '.')),
            valor_liq: Number(String(r.valor_liq).replace(/[^0-9,-]/g, '').replace(',', '.')),
            comissao_ota: Number(String(r.comissao_ota).replace(/[^0-9,-]/g, '').replace(',', '.')),
            taxa_limpeza: Number(String(r.taxa_limpeza || '0').replace(/[^0-9,-]/g, '').replace(',', '.')),
            canal_reserva: { id: r.canal_reserva },
            obs: `Importado do AirBnB. Código: ${r["Código de Confirmação"]}`,
            saas: { id: dataToken?.id },
            tipo_reserva: "Reserva",
          };
        });

      const movimentacoes = data.filter((r) => r.Tipo === "Payout");

      if (reservasParaEnviar.length > 0) {
        await api.post("/reserva/import-bulk", { data: reservasParaEnviar });
        toast.success(`${reservasParaEnviar.length} reservas importadas com sucesso!`);
      }

      if (movimentacoes.length > 0) {
        // Ajustar endpoint e payload para movimentações se necessário
        // await api.post("/movimentacao/import", { data: movimentacoes });
        toast.info(`${movimentacoes.length} movimentações prontas para importação (endpoint pendente).`);
      }

      if (reservasParaEnviar.length === 0 && movimentacoes.length === 0) {
        toast.info("Nenhum registro para importar.");
      }
      setPendentes({});
      setData([]);

    } catch (error: any) {
      console.error("Erro ao enviar dados:", error);
      const msg = error.response?.data?.message || "Falha ao enviar os dados para o servidor.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const temPendentesGeral = Object.values(pendentes).some(p => p.length > 0);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Importador de Reservas & Movimentações (AirBnB)</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4 block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {data.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleEnviarDados}
            disabled={isSubmitting || temPendentesGeral}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar Dados para o Sistema"}
          </button>
          {temPendentesGeral && (
            <p className="text-red-500 text-sm mt-2">Preencha os campos pendentes para poder enviar.</p>
          )}
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <h3 className="font-semibold">Registros Importados</h3>
        <table className="w-full mt-2 border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Código</th>
              <th className="p-2 border">Hóspede</th>
              <th className="p-2 border">Acomodacação</th>
              <th className="p-2 border">Campos Faltantes</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => {
              const registroPendente = Object.values(pendentes).flat().find(p => p.originalIndex === r.originalIndex);
              return (
                <tr key={r.originalIndex} className="border-t">
                  <td className="p-2 border">{r["Código de Confirmação"]}</td>
                  <td className="p-2 border">{r.Hóspede}</td>
                  <td className="p-2 border">{r.Anúncio}</td>
                  <td className="p-2 border">
                    {registroPendente ? (
                      <span className="text-red-600">{registroPendente.camposFaltantes.join(', ')}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {registroPendente ? (
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => abrirPopup(r.Anúncio)}
                      >
                        Preencher
                      </button>
                    ) : (
                      <span className="text-green-600 font-bold">OK</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {popupData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              Campos faltantes para: {popupData.anuncio}
            </h2>
            <form onSubmit={preencherCampos} className="space-y-4">
              {popupData.registros.map((r) => (
                <div key={r.originalIndex} className="p-3 border rounded-md">
                  <p className="font-semibold text-md mb-2">Reserva: <span className="font-normal">{r["Código de Confirmação"]}</span></p>
                  {r.camposFaltantes.map((campo) => (
                    <div key={campo} className="mt-2">
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {campo.replace(/_/g, ' ')}
                      </label>
                      {campo === 'acomodacao' ? (
                        <select
                          name={`reserva-${r.originalIndex}-${campo}`}
                          className="border w-full p-2 rounded"
                          required
                        >
                          <option value="">Selecione a acomodação no sistema</option>
                          {acomodacoes.map(ac => (
                            <option key={ac.id} value={ac.id}>{ac.nome}</option>
                          ))}
                        </select>
                      ) : campo === 'canal_reserva' ? (
                        <select
                          name={`reserva-${r.originalIndex}-${campo}`}
                          className="border w-full p-2 rounded"
                          required
                        >
                          <option value="">Selecione o canal no sistema</option>
                          {canais.map(cn => (
                            <option key={cn.id} value={cn.id}>{cn.nome}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={`reserva-${r.originalIndex}-${campo}`}
                          placeholder={`Preencher ${campo.replace(/_/g, ' ')}`}
                          className="border w-full p-2 rounded"
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setPopupData(null)}
                  className="px-3 py-1 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Salvar e Aplicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}