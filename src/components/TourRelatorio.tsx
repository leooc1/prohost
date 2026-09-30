import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import { useNavigate } from "react-router-dom";
import RelatorioCompleto from "../report/RelatorioCompleto";
const apiURL = import.meta.env.VITE_API_URL;

const mes = ("0" + (new Date().getUTCMonth() + 1)).slice(-2);
const ano = new Date().getUTCFullYear();
export default function TourRelatorio() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [tipo, setTipo] = useState<string>("terceiro");
  const [nome, setNome] = useState<string>("");
  const [idAcomodacao, setIdAcomodacao] = useState<number>();
  const { dataToken } = useContext(SideBarContext);
  const [hospede, setHospede] = useState<any[]>([]);
  const [idHospede, setIdHospede] = useState<number>();
  const [canalReserva, setCanalReserva] = useState<{
    nome: string;
    id: number;
    cor: string;
  }>({ nome: "", id: 0, cor: "" });

  const reservasParaImportar = [
    {
      acomodacao: {
        id: idAcomodacao,
      },
      check_in: `${ano}-${mes}-26 15:00:00`,
      check_out: `${ano}-${mes}-30 11:00:00`,
      taxa_limpeza: 0,
      canal_reserva: {
        id: canalReserva.id,
      },
      comissao_ota: 245.88,
      hospede: {
        id: idHospede,
      },
      qtd_hospede: 1,
      saas: {
        id: dataToken.id,
      },
      valor: 1350,
      valor_liq: 1104.12,
      valor_prop: 3680.4,
      valor_gestor: 3680.4,
      valor_liq_calculado: 1104.12,
      obs: "",
      tipo_reserva: "Reserva",
      continuidade: null,
    },
    {
      acomodacao: {
        id: idAcomodacao,
      },
      check_in: `${ano}-${mes}-09 15:00:00`,
      check_out: `${ano}-${mes}-12 11:00:00`,
      taxa_limpeza: 286,
      canal_reserva: {
        id: canalReserva.id,
      },
      comissao_ota: 234.04,
      hospede: {
        id: idHospede,
      },
      qtd_hospede: 1,
      saas: {
        id: dataToken.id,
      },
      valor: 999,
      valor_liq: 764.96,
      valor_prop: 2549.87,
      valor_gestor: 2549.87,
      valor_liq_calculado: 764.96,
      obs: "",
      tipo_reserva: "Reserva",
      continuidade: null,
    },
    {
      acomodacao: {
        id: idAcomodacao,
      },
      check_in: `${ano}-${mes}-03 15:00:00`,
      check_out: `${ano}-${mes}-07 11:00:00`,
      taxa_limpeza: 178.75,
      canal_reserva: {
        id: canalReserva.id,
      },
      comissao_ota: 314.15,
      hospede: {
        id: idHospede,
      },
      qtd_hospede: 1,
      saas: {
        id: dataToken.id,
      },
      valor: 1546.09,
      valor_liq: 1231.94,
      valor_prop: 4106.47,
      valor_gestor: 4106.47,
      valor_liq_calculado: 1231.94,
      obs: "",
      tipo_reserva: "Reserva",
      continuidade: null,
    },
  ];

  async function getHospede() {
    if (!dataToken || !dataToken.id) return;
    await fetch(`${apiURL}/hospede/${dataToken.id}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data: any[]) => {
        setHospede(data);
      })
      .catch((err) => console.log(err));
  }
  async function getCanalReserva() {
    try {
      const response = await fetch(`${apiURL}/canal_reserva/${dataToken?.id}`, {
        method: "GET",
      });
      const data = (await response.json()) as {
        nome: string;
        id: number;
        cor: string;
      }[];
      if (
        data.length > 0 &&
        data.filter((d) => d.nome.toLowerCase().includes("airbnb")).length > 0
      ) {
        setCanalReserva(
          data.filter((d) => d.nome.toLowerCase().includes("airbnb"))[0],
        );
      } else {
        const response = await fetch(`${apiURL}/canal_reserva/`, {
          method: "POST",
          body: JSON.stringify({
            cor: "#ff0000",
            nome: "Airbnb",
            saas: { id: dataToken.id },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = (await response.json()) as {
          nome: string;
          id: number;
          cor: string;
        };
        setCanalReserva(data);
      }
    } catch (error) {
      console.error("Erro ao buscar canais de reserva:", error);
    }
  }
  async function createHospede(pbody: any) {
    try {
      const response = await fetch(`${apiURL}/hospede/`, {
        method: "POST",
        body: JSON.stringify(pbody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return data.id ? data.id : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async function createAcomodacao(
    nome: string,
    tipo: string,
    comissao: number | null,
  ) {
    await fetch(`${apiURL}/acomodacao/`, {
      method: "POST",
      body: JSON.stringify({
        tipo: tipo,
        comissao: comissao,
        data_ini_ope: new Date().toISOString().split("T")[0],
        endereco: "",
        check_in_p: "15:00:00",
        check_out_p: "11:00:00",
        foto: null,
        modelo: 3,
        repasse: 2,
        nome: nome,
        taxa_limpeza: Number(100),
        numero_hospedes: Number(3),
        valor_imovel: Number(1),
        desativado: false,
        saas: {
          id: dataToken.id,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.id) {
          setIdAcomodacao(data.id);
          toast.success("Acomodação cadastrada");
          setStep(1);
        }
      })
      .catch((err) => console.log(err));
  }
  async function createReserva(pbody: any) {
    let retorno = 0;
    await fetch(`${apiURL}/reserva/`, {
      method: "POST",
      body: JSON.stringify(pbody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.id) {
          retorno = data.id;
          console.log(data);
          return data.id;
          // console.log("Adicionado: ", data.id);
        }
      })
      .catch((err) => console.error(err));
    return retorno;
  }

  useEffect(() => {
    getHospede();
    getCanalReserva();
    const tour = window.localStorage.getItem("tour") || "true";
    if (!JSON.parse(tour)) setStep(-1);
  }, []);

  return (
    <div
      className={`fixed z-50 pointer-events-none top-0 left-0 w-screen h-screen bg-primary/95 ${step === -1 && "hidden"} transition-all duration-300 
      ${step !== 5 && "pointer-events-none"}
      `}
    >
      <Toaster />
      {step == 0 && (
        <div className="pointer-events-auto scale-100 absolute bg-white left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-5 px-6 py-4 rounded-xl md:w-1/2 w-11/12">
          <h2 className="text-primary text-3xl font-bold">
            Vamos gerar seu{" "}
            <strong className="text-secondary">primeiro relatório</strong>
          </h2>
          <p className="font-light">
            O ProHost transforma reservas, hóspedes e movimentações financeiras
            em indicadores que ajudam você a tomar decisões melhores todos os
            dias
          </p>
          <form className="flex flex-col gap-1">
            {/* nome do imóvel */}
            <label htmlFor="identificador" className="flex flex-col">
              <span className="text-zinc-500 font-medium mb-1 text-xs">
                Identificador
                <span className="text-red-500 font-bold"> *</span>
              </span>
              <input
                placeholder="Ex: Apartamento Guarujá"
                type="text"
                name="identificador"
                id="identificador"
                className={`border ${false ? "border-red-500" : "border-zinc-300"} rounded-md px-2 py-1 outline-none`}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </label>
            {/* tipo */}
            <div
              className={`grid gap-4 items-center ${tipo == "terceiro" ? "grid-cols-2" : "grid-cols-1"}`}
            >
              <label htmlFor="status" className={`flex flex-col`}>
                <span className="text-zinc-500 font-medium mb-1 text-xs">
                  Status
                  <span className="text-red-500 font-bold"> *</span>
                </span>
                <select
                  name="status"
                  id="status"
                  className={`border ${false ? "border-red-500" : "border-zinc-300"} rounded-md px-2 py-1 outline-none`}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="proprio">Próprio</option>
                  <option value="terceiro">Terceiro</option>
                </select>
              </label>
              {tipo == "terceiro" && (
                <label htmlFor="comissao" className="flex flex-col relative">
                  <span className="text-zinc-500 font-medium mb-1 text-xs">
                    Comissão
                    <span className="text-red-500 font-bold"> *</span>
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="comissao"
                    id="comissao"
                    className="border border-zinc-300 rounded-md px-1 input-number py-1 outline-none"
                    placeholder="%"
                  />
                  <span className="absolute right-2 bottom-1">%</span>
                </label>
              )}
            </div>
          </form>
          <p className="font-light text-sm text-center">
            Você completa o restante do cadastro depois, quando quiser.
          </p>
          <div className="w-full flex justify-around">
            <button
              onClick={() => {
                {
                  setStep(step - 1);
                  window.localStorage.setItem("tour", "false");
                }
              }}
              className="border border-zinc-800 text-zinc-800 font-bold py-2 px-4 rounded-md"
            >
              Pular tour
            </button>
            <button
              onClick={async () => {
                let hospedeId;
                if (
                  hospede.filter(
                    (h) =>
                      h.nome.toLowerCase() == "Hóspede Padrão".toLowerCase(),
                  ).length > 0
                ) {
                  hospedeId =
                    hospede.filter(
                      (h) =>
                        h.nome.toLowerCase() == "Hóspede Padrão".toLowerCase(),
                    )[0].id || 0;
                } else {
                  hospedeId = await createHospede({
                    nome: "Hóspede Padrão",
                    email: null,
                    saas: { id: dataToken.id },
                    telefone: null,
                  });
                }
                setIdHospede(hospedeId);
                const cadastroAcomodacao = z.discriminatedUnion("tipo", [
                  z.object({
                    tipo: z.literal("proprio"),
                    nome: z
                      .string()
                      .min(
                        1,
                        "Nome da acomodação precisa ter no mínimo 1 caractere",
                      )
                      .max(20, "Coloque um nome com no máximo 20 caracteres"),

                    comissao: z.null(),
                  }),

                  z.object({
                    tipo: z.literal("terceiro"),
                    nome: z
                      .string()
                      .min(
                        1,
                        "Nome da acomodação precisa ter no mínimo 1 caractere",
                      )
                      .max(20, "Coloque um nome com no máximo 20 caracteres"),

                    comissao: z
                      .number({
                        error: "A comissão deve ser um número",
                      })
                      .min(0.01, "A comissão deve ser maior que zero"),
                  }),
                ]);

                const comissao =
                  tipo == "terceiro"
                    ? (document.getElementById("comissao") as HTMLInputElement)
                        .value
                    : null;

                const { success, error } = cadastroAcomodacao.safeParse({
                  nome,
                  tipo,
                  comissao: Number(comissao) > 0 ? Number(comissao) : null,
                });
                if (success) {
                  createAcomodacao(
                    nome,
                    tipo,
                    Number(comissao) > 0 ? Number(comissao) : null,
                  );
                } else {
                  error.issues.forEach((err) => toast.error(err.message));
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Vamos começar &rarr;
            </button>
          </div>
        </div>
      )}
      {step == 1 && (
        <div className="pointer-events-auto scale-100 absolute bg-white left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-5 px-6 py-4 rounded-xl md:w-1/2 w-11/12">
          <h2 className="text-primary text-3xl font-bold">
            Agora suba <strong className="text-secondary">suas reservas</strong>
          </h2>
          <p className="font-light">
            Use uma planilha de exemplo para visualizar o relatório. O histórico
            que você ja tem entra junto.
          </p>

          <div className="w-full flex flex-col-reverse gap-4 justify-around">
            <button
              onClick={() => {
                {
                  navigate("/reservas");
                  window.localStorage.setItem("tour", "false");
                }
              }}
              className="border border-zinc-800 text-zinc-800 font-bold py-2 px-4 rounded-md"
            >
              Pular e lançar manualmente
            </button>
            <button
              onClick={async () => {
                const retornos: string[] = [];
                await Promise.all(
                  reservasParaImportar.map(async (imp) => {
                    await createReserva(imp).then((res) => {
                      retornos.push(
                        `${res == 0 ? "Erro: " : "Adicionado: "}` +
                          `${imp.check_in.split("-")[2]}/${imp.check_in.split("-")[1]}/${imp.check_in.split("-")[0]} => ` +
                          `${imp.check_out.split("-")[2]}/${imp.check_out.split("-")[1]}/${imp.check_out.split("-")[0]}`,
                      );
                      res;
                    });
                  }),
                );
                // navigate("/relatorio");
                alert(retornos.join("\n"));
                localStorage.setItem("tour", "false");
                toast("Para sair deste tour, basta atualizar a página.");
                setStep(2);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Importar reservas de exemplo
            </button>
          </div>
          <p className="font-light text-sm text-center">
            {nome} cadastrado. <br />
            Falta um passo para o relatório ficar pronto.
          </p>
        </div>
      )}
      {step == 2 && (
        <div className="overflow-scroll pointer-events-auto absolute max-h-dvh w-dvw scroll-default">
          <RelatorioCompleto
            saas={Number(dataToken.id)}
            acomodacao={idAcomodacao as number}
            mes={Number(mes)}
            ano={ano}
            imagem={""}
            cores={{
              letra: "#ffffff",
              primario: "#003347",
              secundario: "#08fab8",
            }}
          />
        </div>
      )}
    </div>
  );
}
