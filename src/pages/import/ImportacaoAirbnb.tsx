import Papa from "papaparse";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { SideBarContext } from "../../contexts/SideBarMenuContext";

interface ImportacaoRow {
  data: string;
  qtd_noites: string;
  hospede: string;
  acomodacao: string;
  valor: string;
  taxa_servico: string;
  taxa_limpeza: string;
}

interface Acomodacao {
  id: string;
  nome: string;
  check_in_p: string;
  check_out_p: string;
  comissao: string;
  tipo: string;
  modelo: number;
}

export default function ImportacaoAirbnb() {
  const apiURL = import.meta.env.VITE_API_URL;
  const { dataToken } = useContext(SideBarContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para arquivo
  const [importacao, setImportacao] = useState<ImportacaoRow[]>([]);

  // Estados para filtro de anúncio
  const [anuncios, setAnuncios] = useState<string[]>([]);
  const [anuncioBuscado, setAnuncioBuscado] = useState<string>("");
  const [anuncioSelecionado, setAnuncioSelecionado] = useState<string>("");

  // Estados para acomodações
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([]);
  const [hospede, setHospede] = useState<any[]>([]);
  const [acomodacaoSelecionada, setAcomodacaoSelecionada] =
    useState<string>("");
  const [canalSelecionado, setCanalSelecionado] = useState<
    { nome: string; id: number; cor: string }[]
  >([]);
  const [carregandoAcomodacoes, setCarregandoAcomodacoes] = useState(false);
  const [botaoImportar, setBotaoImportar] = useState(true);

  // Estados para fluxo
  const [etapa, setEtapa] = useState<"upload" | "anuncio" | "acomodacao">(
    "upload",
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    if (isCSV) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const result = results.data
            .filter((r: any) => r.Tipo == "Reserva")
            .map((r: any) => ({
              data: `${r["Data de início"].split("/")[1]}/${r["Data de início"].split("/")[0]}/${r["Data de início"].split("/")[2]}`,
              qtd_noites: r.Noites,
              hospede: r.Hóspede,
              acomodacao: r.Anúncio,
              valor: r.Valor,
              taxa_servico: r["Taxa de serviço"],
              taxa_limpeza: r["Taxa de limpeza"],
            }));
          setImportacao(result);

          // Extrair anúncios únicos
          const anunciosUnicos = [...new Set(result.map((r) => r.acomodacao))];
          setAnuncios(anunciosUnicos);
          setEtapa("anuncio");

          // console.log("CSV Parsed:", result);
        },
        error: (error) => {
          console.error("CSV Parse Error:", error);
        },
      });
    } else if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);
        console.log("Excel Parsed:", rows);
      };
      reader.readAsBinaryString(file);
    } else {
      console.error("Formato não suportado. Use .csv ou .xlsx");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buscarAcomodacoes = async () => {
    if (!dataToken?.id) {
      console.error("ID do SaaS não encontrado");
      return;
    }

    setCarregandoAcomodacoes(true);
    try {
      const response = await fetch(
        `${apiURL}/acomodacao/names/${dataToken?.id}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      setAcomodacoes(data);
    } catch (error) {
      console.error("Erro ao buscar acomodações:", error);
    } finally {
      // setCarregandoAcomodacoes(false);
    }

    try {
      const response = await fetch(`${apiURL}/canal_reserva/${dataToken?.id}`, {
        method: "GET",
      });
      const data = (await response.json()) as {
        nome: string;
        id: number;
        cor: string;
      }[];
      setCanalSelecionado(
        data.filter((d) => d.nome.toLowerCase().includes("airbnb")),
      );
    } catch (error) {
      console.error("Erro ao buscar canais de reserva:", error);
    } finally {
      setCarregandoAcomodacoes(false);
    }
  };

  const handleProximoAnuncio = () => {
    if (anuncioSelecionado) {
      setEtapa("acomodacao");
      buscarAcomodacoes();
    }
  };

  const handleVoltarAnuncio = () => {
    setAnuncioSelecionado("");
    setAnuncioBuscado("");
    setEtapa("upload");
    setImportacao([]);
    setAnuncios([]);
  };

  const handleVoltarAcomodacao = () => {
    setAcomodacaoSelecionada("");
    setEtapa("anuncio");
  };
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
          return data.id;
          // console.log("Adicionado: ", data.id);
        }
      })
      .catch((err) => console.error(err));
    return retorno;
  }

  // Filtrar anúncios baseado na busca
  const anunciosFiltrados = anuncios.filter((a) =>
    a.toLowerCase().includes(anuncioBuscado.toLowerCase()),
  );

  useEffect(() => {
    // console.log(dataToken)
  }, [dataToken]);

  return (
    <div className="p-8 flex flex-col items-center max-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        Importador de Reservas (
        <span className="text-[#DE5057]/50">Airbnb</span>)
      </h1>

      {/* ETAPA 1: UPLOAD */}
      {etapa === "upload" && (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary/80">
            Passo 1: Selecione o arquivo
          </h2>
          <div className="flex gap-2 flex-col">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="px-4 py-2 border border-gray-300 rounded cursor-pointer hover:border-blue-500"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Selecionar arquivo
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Formatos suportados: CSV, XLSX, XLS
          </p>
        </div>
      )}

      {/* ETAPA 2: FILTRAR POR ANÚNCIO */}
      {etapa === "anuncio" && (
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary/80">
            Passo 2: Selecione um Anúncio
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-primary/80 mb-2">
              Buscar Anúncio
            </label>
            <input
              type="text"
              placeholder="Digite o nome do anúncio..."
              value={anuncioBuscado}
              onChange={(e) => setAnuncioBuscado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-primary/80 mb-2">
              Anúncios Disponíveis
            </label>
            <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
              {anunciosFiltrados.map((anuncio) => (
                <div
                  key={anuncio}
                  onClick={() => setAnuncioSelecionado(anuncio)}
                  className={`p-3 cursor-pointer border-b last:border-b-0 transition ${
                    anuncioSelecionado === anuncio
                      ? "bg-blue-100 border-l-4 border-l-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="anuncio"
                    value={anuncio}
                    checked={anuncioSelecionado === anuncio}
                    onChange={() => setAnuncioSelecionado(anuncio)}
                    className="mr-2"
                  />
                  <label className="cursor-pointer">{anuncio}</label>
                </div>
              ))}
            </div>
            {anunciosFiltrados.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">
                Nenhum anúncio encontrado
              </p>
            )}
          </div>

          {/*           <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium text-primary/80">
              Total de registros:{" "}
              <span className="font-bold">{importacao.length}</span>
            </p>
            {anuncioSelecionado && (
              <p className="text-sm text-gray-600 mt-2">
                Registros do anúncio "{anuncioSelecionado}":{" "}
                <span className="font-bold">
                  {
                    importacao.filter(
                      (i) => i.acomodacao === anuncioSelecionado,
                    ).length
                  }
                </span>
              </p>
            )}
          </div>
 */}
          <div className="flex gap-3">
            <button
              onClick={handleVoltarAnuncio}
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Voltar
            </button>
            <button
              onClick={handleProximoAnuncio}
              disabled={!anuncioSelecionado}
              className={`flex-1 px-4 py-2 rounded transition ${
                anuncioSelecionado
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 3: SELECIONAR ACOMODAÇÃO */}
      {etapa === "acomodacao" && (
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary/80">
            Passo 3: Selecione uma Acomodação
          </h2>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Anúncio selecionado:</span>{" "}
              {anuncioSelecionado}
            </p>
          </div>

          {carregandoAcomodacoes ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <label className="block text-sm font-medium text-primary/80 mb-2">
                Acomodações Cadastradas
              </label>
              <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto mb-6">
                {acomodacoes.length > 0 ? (
                  acomodacoes.map((acomodacao) => (
                    <div
                      key={acomodacao.id}
                      onClick={() => setAcomodacaoSelecionada(acomodacao.id)}
                      className={`p-3 cursor-pointer border-b last:border-b-0 transition ${
                        acomodacaoSelecionada === acomodacao.id
                          ? "bg-blue-100 border-l-4 border-l-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="acomodacao"
                        value={acomodacao.id}
                        checked={acomodacaoSelecionada === acomodacao.id}
                        onChange={() => setAcomodacaoSelecionada(acomodacao.id)}
                        className="mr-2"
                      />
                      <label className="cursor-pointer font-medium">
                        {acomodacao.nome}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Nenhuma acomodação cadastrada
                  </div>
                )}
              </div>

              {acomodacaoSelecionada && (
                <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">
                      Acomodação selecionada:
                    </span>{" "}
                    {
                      acomodacoes.find((a) => a.id === acomodacaoSelecionada)
                        ?.nome
                    }
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleVoltarAcomodacao}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Voltar
                </button>
                <button
                  disabled={!acomodacaoSelecionada && !botaoImportar}
                  className={`flex-1 px-4 py-2 rounded transition ${
                    acomodacaoSelecionada && botaoImportar
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={async () => {
                    console.log(
                      acomodacoes.find((a) => a.id == acomodacaoSelecionada),
                    );
                    setBotaoImportar(false);
                    const retornos: string[] = [];
                    await getHospede();

                    const reservasAgrupadas = new Map<string, ImportacaoRow>();

                    importacao
                      .filter((i) => i.acomodacao === anuncioSelecionado)
                      .forEach((imp) => {
                        const chave = [
                          imp.data,
                          imp.qtd_noites,
                          imp.hospede,
                          imp.acomodacao,
                        ].join("|");

                        const existente = reservasAgrupadas.get(chave);

                        if (!existente) {
                          reservasAgrupadas.set(chave, {
                            ...imp,
                          });
                          return;
                        }

                        const somar = (a: string, b: string) =>
                          (
                            Number(a.replace(",", ".")) +
                            Number(b.replace(",", "."))
                          ).toFixed(2);

                        reservasAgrupadas.set(chave, {
                          ...existente,
                          valor: somar(existente.valor, imp.valor),
                          taxa_servico: somar(
                            existente.taxa_servico,
                            imp.taxa_servico,
                          ),
                          taxa_limpeza: somar(
                            existente.taxa_limpeza,
                            imp.taxa_limpeza,
                          ),
                        });
                      });

                    const reservasParaImportar = [
                      ...reservasAgrupadas.values(),
                    ];
                    await Promise.all(
                      reservasParaImportar.map(async (imp) => {
                        imp = {
                          ...imp,
                          taxa_limpeza: imp.taxa_limpeza.replace(",", "."),
                          taxa_servico: imp.taxa_servico.replace(",", "."),
                          valor: imp.valor.replace(",", "."),
                        };
                        const [dia, mes, ano] = imp.data.split("/");

                        const checkOut = new Date(
                          Number(ano),
                          Number(mes) - 1,
                          Number(dia),
                        );
                        checkOut.setDate(
                          checkOut.getDate() + Number(imp.qtd_noites),
                        );
                        let hospedeId;
                        if (
                          hospede.filter(
                            (h) =>
                              h.nome.toLowerCase() == imp.hospede.toLowerCase(),
                          ).length > 0
                        ) {
                          hospedeId =
                            hospede.filter(
                              (h) =>
                                h.nome.toLowerCase() ==
                                imp.hospede.toLowerCase(),
                            )[0].id || 0;
                        } else {
                          hospedeId = await createHospede({
                            nome: imp.hospede,
                            email: null,
                            saas: { id: dataToken.id },
                            telefone: null,
                          });
                        }

                        await createReserva({
                          acomodacao: {
                            id: acomodacaoSelecionada,
                          },
                          check_in: `${imp.data.split("/")[2]}-${imp.data.split("/")[1]}-${imp.data.split("/")[0]} ${
                            acomodacoes.find(
                              (a) => a.id == acomodacaoSelecionada,
                            )?.check_in_p
                          }`,
                          check_out: `${checkOut.toISOString().split("T")[0]} ${
                            acomodacoes.find(
                              (a) => a.id == acomodacaoSelecionada,
                            )?.check_out_p
                          }`,
                          taxa_limpeza: Number(
                            (acomodacoes.find(
                              (a) => a.id == acomodacaoSelecionada,
                            )?.modelo == 1
                              ? 0
                              : Number(imp.taxa_limpeza)
                            ).toFixed(2),
                          ),
                          canal_reserva: {
                            id: canalSelecionado[0].id,
                          },
                          comissao_ota: Number(
                            Number(imp.taxa_servico).toFixed(2),
                          ),
                          hospede: {
                            id: hospedeId, //hospede padrao
                          },
                          qtd_hospede: 1,
                          saas: {
                            id: dataToken?.id,
                          },
                          valor: Number(
                            (
                              Number(imp.valor) -
                              (acomodacoes.find(
                                (a) => a.id == acomodacaoSelecionada,
                              )?.modelo == 1
                                ? 0
                                : Number(imp.taxa_limpeza)) +
                              Number(imp.taxa_servico)
                            ).toFixed(2),
                          ),
                          valor_liq: Number(
                            (
                              Number(imp.valor) -
                              (acomodacoes.find(
                                (a) => a.id == acomodacaoSelecionada,
                              )?.modelo == 1
                                ? 0
                                : Number(imp.taxa_limpeza))
                            ).toFixed(2),
                          ),
                          valor_prop:
                            acomodacoes.find(
                              (a) => a.id == acomodacaoSelecionada,
                            )?.tipo == "proprio"
                              ? Number(Number(imp.valor).toFixed(2))
                              : Number(
                                  (Number(
                                    acomodacoes.find(
                                      (a) => a.id == acomodacaoSelecionada,
                                    )?.comissao,
                                  ) > 1
                                    ? (Number(imp.valor) -
                                        (acomodacoes.find(
                                          (a) => a.id == acomodacaoSelecionada,
                                        )?.modelo == 1
                                          ? 0
                                          : Number(imp.taxa_limpeza))) /
                                      (Number(
                                        acomodacoes.find(
                                          (a) => a.id == acomodacaoSelecionada,
                                        )?.comissao,
                                      ) /
                                        100)
                                    : (Number(imp.valor) -
                                        (acomodacoes.find(
                                          (a) => a.id == acomodacaoSelecionada,
                                        )?.modelo == 1
                                          ? 0
                                          : Number(imp.taxa_limpeza))) /
                                        Number(
                                          acomodacoes.find(
                                            (a) =>
                                              a.id == acomodacaoSelecionada,
                                          )?.comissao,
                                        ) -
                                      Number(imp.valor) -
                                      (acomodacoes.find(
                                        (a) => a.id == acomodacaoSelecionada,
                                      )?.modelo == 1
                                        ? 0
                                        : Number(imp.taxa_limpeza))
                                  ).toFixed(2),
                                ),
                          valor_gestor:
                            acomodacoes.find(
                              (a) => a.id == acomodacaoSelecionada,
                            )?.tipo == "proprio"
                              ? 0
                              : Number(
                                  (Number(
                                    acomodacoes.find(
                                      (a) => a.id == acomodacaoSelecionada,
                                    )?.comissao,
                                  ) > 1
                                    ? (Number(imp.valor) -
                                        (acomodacoes.find(
                                          (a) => a.id == acomodacaoSelecionada,
                                        )?.modelo == 1
                                          ? 0
                                          : Number(imp.taxa_limpeza))) /
                                      (Number(
                                        acomodacoes.find(
                                          (a) => a.id == acomodacaoSelecionada,
                                        )?.comissao,
                                      ) /
                                        100)
                                    : (Number(imp.valor) -
                                        (acomodacoes.find(
                                          (a) => a.id == acomodacaoSelecionada,
                                        )?.modelo == 1
                                          ? 0
                                          : Number(imp.taxa_limpeza))) /
                                      Number(
                                        acomodacoes.find(
                                          (a) => a.id == acomodacaoSelecionada,
                                        )?.comissao,
                                      )
                                  ).toFixed(2),
                                ),
                          valor_liq_calculado: Number(
                            (
                              Number(imp.valor) -
                              (acomodacoes.find(
                                (a) => a.id == acomodacaoSelecionada,
                              )?.modelo == 1
                                ? 0
                                : Number(imp.taxa_limpeza))
                            ).toFixed(2),
                          ),
                          obs: "",
                          tipo_reserva: "Reserva",
                          continuidade: null,
                        }).then((res) => {
                          const dataFinal = checkOut
                            .toISOString()
                            .split("T")[0];
                          retornos.push(
                            `${res == 0 ? "Erro: " : "Adicionado: "}` +
                              `${imp.data} => ` +
                              `${dataFinal.split("-")[2]}/${dataFinal.split("-")[1]}/${dataFinal.split("-")[0]}`,
                          );
                          res;
                        });
                      }),
                    );
                    setBotaoImportar(true);
                    alert(retornos.join("\n"));
                    location.assign("/reservas");
                  }}
                >
                  Importar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
