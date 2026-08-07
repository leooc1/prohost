import { useContext, useEffect, useRef, useState } from "react";
import IndicadoresOperacionais from "../components/dashboard/IndicadoresOperacionais";
import ResultadoDasAcomodacoes from "../components/dashboard/ResultadoDasAcomodacoes";
import ResultadoDoGestor from "../components/dashboard/ResultadoDoGestor";
import Loader from "../components/Loader";
import IndicadoresOperacionaisSkeleton from "../components/skeleton/IndicadoresOperacionaisSkeleton";
import ResultadosAcomodacoesSkeleton from "../components/skeleton/ResultadosAcomodacoesSkeleton";
import ResultadosGestorSkeleton from "../components/skeleton/ResultadosGestorSkeleton";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Tour from "../components/Tour";
interface Acomodacao {
  id: number;
  tipo: string;
  comissao: number;
  data_ini_ope: string;
  descricao: string;
  endereco: string;
  check_in_p: string;
  check_out_p: string;
  foto: string;
  nome: string;
  numero_hospedes: number;
  valor_imovel: number;
  desativado: boolean;
  saas: { id: number };
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

const getPeriodoDates = (
  periodo: string,
  deData: string,
  ateData: string,
  date: Date,
) => {
  const ano: any = date.getFullYear();
  const mes = date.getMonth() + 1;

  const pad = (n: number) => `${n}`.padStart(2, "0");
  const firstDay = `${ano}-${pad(mes)}-01`;
  const lastDay = `${ano}-${pad(mes)}-${getDaysInMonth(mes, ano)}`;

  const lastMonth = date.getMonth() === 0 ? 12 : date.getMonth();
  const anoPassado = date.getMonth() === 0 ? ano - 1 : ano;
  const lastMonthFirst = `${anoPassado}-${pad(lastMonth)}-01`;
  const lastMonthLast = `${anoPassado}-${pad(lastMonth)}-${getDaysInMonth(lastMonth, anoPassado)}`;

  switch (periodo) {
    case "m-atual":
      return { de: firstDay, ate: lastDay };
    case "m-passado":
      return { de: lastMonthFirst, ate: lastMonthLast };
    case "a-atual":
      return { de: `${ano}-01-01`, ate: `${ano}-12-31` };
    case "a-passado":
      return { de: `${ano - 1}-01-01`, ate: `${ano - 1}-12-31` };
    case "personalizado":
      return { de: deData, ate: ateData };
    default:
      return { de: firstDay, ate: lastDay };
  }
};

const updateQueryParams = (params: Record<string, string>) => {
  const url = new URL(window.location.href);
  for (const key in params) url.searchParams.set(key, params[key]);
  window.history.replaceState({}, "", url);
};

export default function Dashboard() {
  const apiURL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    document.title = "Dashboard | Prohost";
  }, []);

  const { dataToken } = useContext(SideBarContext);

  const [loaded, setLoaded] = useState(false);

  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const date = new Date();
  const [periodo, setPeriodo] = useState(
    localStorage.getItem("periodo_ph") || "m-atual",
  );
  const [sessao, setSessao] = useState(0);
  const [deData, setDeData] = useState(
    `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-01`,
  );
  const [ateData, setAteData] = useState(
    `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`,
  );
  const [resultadoGestor, setResultadoGestor] = useState<
    {
      lucro_acomodacoes: string;
      comissao_terceiros: string;
      despesas_negocio: string;
      lucro_gestor: string;
      ajuste_comissao_ota: string;
    }[]
  >([]);
  const [lucroXDespesa, setLucroXDespesa] = useState<
    {
      lucro_acomodacoes: string;
      despesas_negocio: string;
    }[]
  >([]);
  const [reservaCanal, setReservaCanal] = useState<
    {
      canal_reserva: number;
      nome: string;
      cor: string;
      num_reserva: string;
    }[]
  >([]);
  const [qtdHospede, setQtdHospede] = useState<
    {
      qtd_hospede: number;
      qtd_reserva: string;
    }[]
  >([]);
  const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([]);
  const [filterAC, setFilterAC] = useState<string>("all");
  const [fatProCanal, setFatPorCanal] = useState<
    {
      nome: string;
      cor: string;
      tipo_reserva: string;
      valor_liq: number;
    }[]
  >([]);
  const [faturamentoGrafic, setFaturamentoGrafic] = useState<
    {
      mes: string;
      ano: string;
      despesas: string;
      faturamento_liquido: string;
    }[]
  >([]);
  const [resAc, setResAc] = useState<boolean>(false);
  const [resGestor, setResGestor] = useState<boolean>(false);
  const [indiOpe, setIndiOpe] = useState<boolean>(false);
  const [ocupacaoSemana, setOcupacaoSemana] = useState<[][][]>([]);
  async function acomodacoes() {
    if (!dataToken?.id) return;
    try {
      const data: Acomodacao[] = await fetchJson(
        `${apiURL}/acomodacao/names/${dataToken.id}`,
      );
      setAcomodacao(
        data.filter((e) => !e.desativado).length > 0
          ? data.filter((e) => !e.desativado)
          : [
              {
                id: 0,
                tipo: "",
                comissao: 0,
                data_ini_ope: "",
                descricao: "",
                endereco: "",
                check_in_p: "",
                check_out_p: "",
                foto: "",
                nome: "",
                numero_hospedes: 0,
                valor_imovel: 0,
                desativado: false,
                saas: { id: 0 },
              },
            ],
      );
    } catch (err) {
      console.error("Erro ao carregar acomodações:", err);
    }
  }

  const [comparativoRA, setComparativoRA] = useState<{
    atual: {
      comissao_plataforma: any;
      despesas: any;
      diaria_media: any;
      diaria_media_bruta: any;
      faturamento_bruto: any;
      faturamento_liquido: any;
      lucro: any;
      taxa_limpeza: any;
      rentabilidade_imovel: any;
      comissao_reservas: any;
      comissao_taxa_limpeza: any;
      repasse: any;
    } | null;
    passado: {
      comissao_plataforma: any;
      despesas: any;
      diaria_media: any;
      diaria_media_bruta: any;
      faturamento_bruto: any;
      faturamento_liquido: any;
      lucro: any;
      taxa_limpeza: any;
      rentabilidade_imovel: any;
      comissao_reservas: any;
      comissao_taxa_limpeza: any;
      repasse: any;
    } | null;
  }>({ atual: null, passado: null });

  const [comparativoIO, setComparativoIO] = useState<{
    atual: {
      duracao_media: string | null;
      periodo: string | null;
      total_diaria: string | null;
      total_hospede: string | null;
      total_indisponivel: string | null;
      total_reserva: string | null;
    } | null;
    passado: {
      duracao_media: string | null;
      periodo: string | null;
      total_diaria: string | null;
      total_hospede: string | null;
      total_indisponivel: string | null;
      total_reserva: string | null;
    } | null;
  }>({ atual: null, passado: null });
  const fetchJson = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao buscar: ${url}`);
    return response.json();
  };

  const [showIO, setShowIO] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  async function indicaOpe([start, end]: [string, string]) {
    const suffix = filterAC === "all" ? "" : `/${filterAC}`;
    const base = `${apiURL}/dashboard/${dataToken.id}`;

    setIndiOpe(true);
    try {
      fetch(`${base}/indicadores/${start}/${end}${suffix}`)
        .then((res) => res.json())
        .then((data) => {
          setComparativoIO({
            atual: data.indicadoresAtual[0],
            passado: null,
          });
          setShowIO((prev) => [true, prev[1], prev[2]]);
        })
        .catch((err) =>
          console.error(
            "Erro ao buscar indicadores operacionais seção 1:",
            err,
          ),
        );

      fetch(`${base}/ocupacao/${start}/${end}${suffix}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const taxaPorDia = data.map((d: any) => {
              const totalDias =
                Number(d.total_dias_no_intervalo) *
                (filterAC === "all" ? acomodacao.length : 1);
              const disponiveis =
                totalDias - Number(d.total_indisponibilidades);
              const taxa =
                disponiveis > 0
                  ? (Number(d.total_movimentacoes) / disponiveis) * 100
                  : 0;
              return [d.dia_da_semana, taxa];
            });
            setOcupacaoSemana(taxaPorDia);
          }
          setShowIO((prev) => [prev[0], true, prev[2]]);
        })
        .catch((err) =>
          console.error(
            "Erro ao buscar indicadores operacionais seção 2:",
            err,
          ),
        );

      fetch(`${base}/por-canal-qtd-hospede/${start}/${end}${suffix}`)
        .then((res) => res.json())
        .then((data) => {
          setReservaCanal(data.reservasPorCanal);
          setQtdHospede(data.qtdHospede);
          setShowIO((prev) => [prev[0], prev[1], true]);
        })
        .catch((err) =>
          console.error(
            "Erro ao buscar indicadores operacionais seção 3:",
            err,
          ),
        );
    } catch (err) {
      console.error("Erro em indicaOpe:", err);
    } finally {
      setIndiOpe(true);
    }
  }

  const [showRA, setShowRA] = useState<[boolean, boolean, boolean, boolean]>([
    false,
    false,
    false,
    false,
  ]);
  async function resultAc([start, end]: [string, string]) {
    const base = `${apiURL}/dashboard/${dataToken.id}`;
    const suffix = filterAC === "all" ? "" : `/${filterAC}`;

    setResAc(true);
    try {
      fetch(`${base}/fat-canal/${start}/${end}${suffix}`)
        .then((res) => res.json())
        .then((data) => {
          setFatPorCanal(data);
          setShowRA((prev) => [true, prev[1], prev[2], prev[3]]);
        })
        .catch((err) => console.error("", err));

      fetch(`${base}/fat-grafic/${end}${suffix}`)
        .then((res) => res.json())
        .then((data) => {
          setFaturamentoGrafic(data);
          setShowRA((prev) => [prev[0], prev[1], true, prev[3]]);
        })
        .catch((err) => console.error("", err));

      fetch(`${base}/resultado-acomodacoes/${start}/${end}${suffix}`)
        .then((res) => res.json())
        .then((data) => {
          const resultadoDasAcomodacoes =
            Array.isArray(data) && data.length > 0
              ? {
                  atual: data.map((d: any) => ({
                    comissao_plataforma: d.comissao_plataforma ?? "0",
                    despesas: d.despesas ?? "0",
                    diaria_media: d.diaria_media ?? "0",
                    diaria_media_bruta: d.diaria_media_bruta ?? "0",
                    faturamento_bruto: d.faturamento_bruto ?? "0",
                    faturamento_liquido: d.faturamento_liquido ?? "0",
                    lucro: d.lucro ?? "0",
                    taxa_limpeza: d.taxa_limpeza ?? "0",
                    rentabilidade_imovel: d.rentabilidade_imovel ?? 0,
                    comissao_reservas: d.comissao_reservas ?? 0,
                    comissao_taxa_limpeza: d.comissao_taxa_limpeza ?? 0,
                    repasse: d.repasse ?? 0,
                  }))[0],
                  passado: null,
                }
              : {
                  atual: {
                    comissao_plataforma: "0",
                    despesas: "0",
                    diaria_media: "0",
                    diaria_media_bruta: "0",
                    faturamento_bruto: "0",
                    faturamento_liquido: "0",
                    lucro: "0",
                    taxa_limpeza: "0",
                    rentabilidade_imovel: 0,
                    comissao_reservas: 0,
                    comissao_taxa_limpeza: 0,
                    repasse: 0,
                  },
                  passado: null,
                };

          setComparativoRA(resultadoDasAcomodacoes);
          setShowRA((prev) => [prev[0], true, prev[2], prev[3]]);
        })
        .catch((err) => console.error("", err));
    } catch (err) {
      console.error("Erro em resultAc:", err);
    } finally {
      setResAc(true);
    }
  }

  const [showRG, setShowRG] = useState<[boolean, boolean]>([false, false]);
  async function resultGest([start, end]: [string, string]) {
    const base = `${apiURL}/dashboard/${dataToken.id}`;
    const inicioDate = `${start.slice(0, 4)}-01-01`;
    const finalDate =
      periodo === "personalizado" ? end : `${end.slice(0, 4)}-12-31`;

    setResGestor(true);
    try {
      fetch(`${base}/result-gestor/${start}/${end}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setResultadoGestor(data);
          setShowRG((prev) => [true, prev[1]]);
        })
        .catch((err) => console.log("", err));

      fetch(`${base}/lucro-despesa/${inicioDate}/${finalDate}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setLucroXDespesa(data);
          setShowRG((prev) => [prev[0], true]);
        })
        .catch((err) => console.log("", err));

      // setResultadoGestor(result);
      //
      // setLucroXDespesa(lucroDespesa);
    } catch (err) {
      console.error("Erro em resultGest:", err);
    } finally {
      setResGestor(true);
    }
  }
  const [permissao, setPermissao] = useState({
    indiOpe: 0,
    resultAc: 0,
    resultGestor: 0,
  });
  async function permissoes() {
    setLoaded(true);
    try {
      const data = await fetchJson(`${apiURL}/users/${dataToken.idUsu}`);
      setPermissao(
        data.dashboard || { indiOpe: 0, resultAc: 0, resultGestor: 0 },
      );
    } catch (err) {
      console.error("Erro ao carregar permissões:", err);
      setPermissao({ indiOpe: 0, resultAc: 0, resultGestor: 0 });
    }
  }

  const [dataBW, setDataBW] = useState<[string, string]>(["", ""]);
  const runningRef = useRef(false);
  const loadAll = async (databw: [string, string]) => {
    const params = new URLSearchParams(window.location.search);
    const ss = Number(params.get("ss"));
    if (!dataToken?.id || runningRef.current) return;
    runningRef.current = true;
    try {
      await permissoes();
      if (ss == 0) {
        await indicaOpe(databw);
        setShowIO([false, false, false]);
      }
      if (ss == 1) {
        await resultAc(databw);
        setShowRA([false, false, false, false]);
      }
      if (ss == 2) {
        await resultGest(databw);
        setShowRG([false, false]);
      }
    } finally {
      runningRef.current = false;
    }
  };

  useEffect(() => {
    const { de, ate } = getPeriodoDates(periodo, deData, ateData, new Date());
    updateQueryParams({ datade: de, dataate: ate, acfil: filterAC });
    setDataBW([de, ate]);
  }, [periodo, deData, ateData, filterAC]);

  useEffect(() => {
    if (dataToken) {
      if (acomodacao.length > 0) {
        const params = new URLSearchParams(window.location.search);
        const ss = Number(params.get("ss"));
        setSessao(isNaN(ss) ? 0 : ss);
        const { de, ate } = getPeriodoDates(
          localStorage.getItem("periodo_ph") || "m-atual",
          deData,
          ateData,
          new Date(),
        );
        setDataBW([de, ate]);
        setIndiOpe(false);
        setResAc(false);
        setResGestor(false);
        loadAll([de, ate]);
      } else {
        acomodacoes();
      }
    }
  }, [filterAC, dataToken, periodo, deData, ateData, acomodacao, sessao]);

  useEffect(() => {
    const storedAc = localStorage.getItem("acfil");
    const storedPeriodo = localStorage.getItem("periodo_ph");
    if (storedAc) setFilterAC(storedAc);
    if (storedPeriodo) {
      setPeriodo(storedPeriodo);
      if (storedPeriodo === "personalizado") {
        setDeData(localStorage.getItem("datade") || "");
        setAteData(localStorage.getItem("dataate") || "");
      }
    }
  }, []);

  return loaded ? (
    <div className="w-full px-8">
      {acomodacao[0].id == 0 && <Tour />}
      <h3 className="text-3xl font-semibold mb-7 pt-2">Painel do Negócio</h3>
      <div className="flex flex-wrap gap-4 mb-8">
        <label
          htmlFor="periodo"
          className="flex flex-col text-zinc-600 font-medium text-sm"
        >
          Período de Análise
          <select
            name="periodo"
            id="periodo"
            value={periodo}
            onChange={(e) => {
              setPeriodo(e.target.value);
              localStorage.setItem("periodo_ph", e.target.value);
            }}
            className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base"
          >
            <option value="m-atual" className="text-black">
              Mês Atual
            </option>
            <option value="m-passado" className="text-black">
              Mês Passado
            </option>
            <option value="a-atual" className="text-black">
              Ano Atual
            </option>
            <option value="a-passado" className="text-black">
              Ano Passado
            </option>
            <option value="personalizado" className="text-black">
              Personalizado
            </option>
          </select>
        </label>
        {periodo == "personalizado" ? (
          <>
            <label
              htmlFor="de"
              className="flex flex-col text-zinc-600 font-medium text-sm"
            >
              De:
              <input
                type="date"
                name="de"
                id="de"
                defaultValue={deData}
                className="border border-zinc-300 rounded-md px-1 py-1 w-32 outline-none text-base"
              />
            </label>
            <label
              htmlFor="ate"
              className="flex flex-col text-zinc-600 font-medium text-sm"
            >
              Até:
              <input
                type="date"
                name="ate"
                id="ate"
                defaultValue={ateData}
                className="border border-zinc-300 rounded-md px-1 py-1 w-32 outline-none text-base"
              />
            </label>
            <button
              className="px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 h-9 self-end font-medium text-white bg-primary hover:shadow-md shadow-black"
              onClick={() => {
                const inputDe = document.getElementById(
                  "de",
                ) as HTMLInputElement;
                const inputAte = document.getElementById(
                  "ate",
                ) as HTMLInputElement;

                const dataDe = new Date(inputDe.value);
                const dataAte = new Date(inputAte.value);

                const anos = dataAte.getFullYear() - dataDe.getFullYear();
                const meses = dataAte.getMonth() - dataDe.getMonth();
                const diffMeses = anos * 12 + meses;

                if (diffMeses > 12) {
                  const novaDataDe = new Date(dataAte);
                  novaDataDe.setMonth(novaDataDe.getMonth() - 12);
                  const dataFormatada = novaDataDe.toISOString().split("T")[0];
                  inputDe.value = dataFormatada;
                  setDeData(dataFormatada);
                  setAteData(inputAte.value);
                  localStorage.setItem("datade", dataFormatada);
                  localStorage.setItem("dataate", inputAte.value);
                  alert(
                    'Neste filtro, as datas são limitadas em 12 meses. A data "De" foi ajustada automaticamente.',
                  );
                  return;
                }

                if (dataDe >= dataAte) {
                  const newDate = new Date(dataDe);
                  newDate.setDate(newDate.getDate() + 1);
                  const dataFormatada = newDate.toISOString().split("T")[0];
                  setDeData(inputDe.value);
                  inputAte.value = dataFormatada;
                  setAteData(dataFormatada);
                  localStorage.setItem("datade", inputDe.value);
                  localStorage.setItem("dataate", dataFormatada);
                } else {
                  setDeData(inputDe.value);
                  setAteData(inputAte.value);
                  localStorage.setItem("datade", inputDe.value);
                  localStorage.setItem("dataate", inputAte.value);
                }
              }}
            >
              Aplicar filtro
            </button>
          </>
        ) : null}
        <div>
          <p className="text-zinc-600 font-medium text-sm">
            Exibindo resultados de
          </p>
          {periodo == "m-atual" ? (
            <p className="text-zinc-900 font-medium text-lg">
              {`01 de ${meses[date.getMonth()]} de ${date.getFullYear()}`} até{" "}
              {`${getDaysInMonth(date.getMonth() + 1, date.getFullYear())} de ${meses[date.getMonth()]} de ${date.getFullYear()}`}
            </p>
          ) : null}
          {periodo == "m-passado" ? (
            <p className="text-zinc-900 font-medium text-lg">
              {`01 de ${date.getMonth() == 0 ? meses[11] : meses[date.getMonth() - 1]} de ${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}`}{" "}
              até{" "}
              {`${getDaysInMonth(date.getMonth() == 0 ? 12 : date.getMonth(), date.getFullYear())} de ${date.getMonth() == 0 ? meses[11] : meses[date.getMonth() - 1]} de ${date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear()}`}
            </p>
          ) : null}
          {periodo == "a-atual" ? (
            <p className="text-zinc-900 font-medium text-lg">
              {`01 de ${meses[0]} de ${date.getFullYear()}`} até{" "}
              {`31 de ${meses[11]} de ${date.getFullYear()}`}
            </p>
          ) : null}
          {periodo == "a-passado" ? (
            <p className="text-zinc-900 font-medium text-lg">
              {`01 de ${meses[0]} de ${date.getFullYear() - 1}`} até{" "}
              {`31 de ${meses[11]} de ${date.getFullYear() - 1}`}
            </p>
          ) : null}
          {periodo == "personalizado" ? (
            <p className="text-zinc-900 font-medium text-lg">
              {`${deData.split("-")[2] ? deData.split("-")[2] + " de" : ""} ${meses[Number(deData.split("-")[1]) - 1] ? meses[Number(deData.split("-")[1]) - 1] + " de" : ""} ${deData.split("-")[0] || ""}`}{" "}
              até{" "}
              {`${ateData.split("-")[2] ? ateData.split("-")[2] + " de" : ""} ${meses[Number(ateData.split("-")[1]) - 1] ? meses[Number(ateData.split("-")[1]) - 1] + " de" : ""} ${ateData.split("-")[0] || ""}`}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mb-6">
        {!(permissao.indiOpe == 0) && (
          <button
            className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 0 ? "bg-slate-200 text-blue-700" : "text-zinc-700"}`}
            onClick={() => {
              setSessao(0);
              updateQueryParams({ ss: "0" });
            }}
          >
            Indicadores Operacionais
          </button>
        )}
        {!(permissao.resultAc == 0) && (
          <button
            className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 1 ? "bg-slate-200 text-blue-700" : "text-zinc-700"}`}
            onClick={() => {
              setSessao(1);
              updateQueryParams({ ss: "1" });
            }}
          >
            Resultados das Acomodações
          </button>
        )}
        {!(permissao.resultGestor == 0) && (
          <button
            className={`hover:bg-slate-200 hover:text-blue-700 font-medium px-4 py-1 rounded-3xl text-lg transition-all ${sessao == 2 ? "bg-slate-200 text-blue-700" : "text-zinc-700"}`}
            onClick={() => {
              setSessao(2);
              updateQueryParams({ ss: "2" });
            }}
          >
            Resultados do Gestor
          </button>
        )}
      </div>
      <h4 className="text-2xl font-semibold mb-6">
        {sessao == 0 ? "Indicadores Operacionais" : null}
        {sessao == 1 ? "Resultados das Acomodações" : null}
        {sessao == 2 ? "Resultados do Gestor" : null}
      </h4>
      {sessao != 2 ? (
        <div>
          <label htmlFor="acomodacao" className={`flex flex-col w-fit mb-8`}>
            <select
              name="acomodacao"
              id="acomodacao"
              className={`border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none`}
              defaultValue={filterAC}
              onChange={(e) => {
                setFilterAC(e.target.value);
                localStorage.setItem("acfil", e.target.value);
              }}
            >
              <option value="all">Todas acomodações</option>
              {acomodacao.length
                ? acomodacao.map((e) => (
                    <option key={e.id} value={`${e.id}`}>
                      {e.nome}
                    </option>
                  ))
                : null}
            </select>
          </label>
        </div>
      ) : null}
      {sessao == 0 &&
        (permissao.indiOpe == 0 ? (
          <div className="bg-gray-300 bg-opacity-50 backdrop-blur-md z-50">
            <span className=" flex flex-col justify-center items-center">
              <svg
                className="w-20 h-fit"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(0,0,0,1)"
              >
                <path d="M6 8V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6ZM19 10H5V20H19V10ZM11 15.7324C10.4022 15.3866 10 14.7403 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 14.7403 13.5978 15.3866 13 15.7324V18H11V15.7324ZM8 8H16V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8Z"></path>
              </svg>
              <p className="text-black text-2xl">
                SEM PERMISSÃO DE VISUALIZAR ESTA PÁGINA
              </p>
            </span>
          </div>
        ) : (
          <>
            {indiOpe ? (
              <IndicadoresOperacionais
                ocupacaoSemana={ocupacaoSemana}
                comparativoIO={comparativoIO}
                qtdHospede={qtdHospede}
                reservaCanal={reservaCanal}
                dataBW={dataBW}
                show={showIO}
              />
            ) : (
              <IndicadoresOperacionaisSkeleton />
            )}
          </>
        ))}
      {sessao == 1 &&
        (permissao.resultAc == 0 ? (
          <div className="bg-gray-300 bg-opacity-50 backdrop-blur-md z-50">
            <span className=" flex flex-col justify-center items-center">
              <svg
                className="w-20 h-fit"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(0,0,0,1)"
              >
                <path d="M6 8V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6ZM19 10H5V20H19V10ZM11 15.7324C10.4022 15.3866 10 14.7403 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 14.7403 13.5978 15.3866 13 15.7324V18H11V15.7324ZM8 8H16V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8Z"></path>
              </svg>
              <p className="text-black text-2xl">
                SEM PERMISSÃO DE VISUALIZAR ESTA PÁGINA
              </p>
            </span>
          </div>
        ) : (
          <>
            {resAc ? (
              <ResultadoDasAcomodacoes
                comparativoRA={comparativoRA}
                fatGrafic={faturamentoGrafic}
                fatPorCanal={fatProCanal}
                dataBW={dataBW}
                filterAC={filterAC}
                periodo={periodo}
                show={showRA}
              />
            ) : (
              <ResultadosAcomodacoesSkeleton />
            )}
          </>
        ))}
      {sessao == 2 &&
        (permissao.resultGestor == 0 ? (
          <div className="bg-gray-300 bg-opacity-50 backdrop-blur-md z-50">
            <span className=" flex flex-col justify-center items-center">
              <svg
                className="w-20 h-fit"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(0,0,0,1)"
              >
                <path d="M6 8V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6ZM19 10H5V20H19V10ZM11 15.7324C10.4022 15.3866 10 14.7403 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 14.7403 13.5978 15.3866 13 15.7324V18H11V15.7324ZM8 8H16V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8Z"></path>
              </svg>
              <p className="text-black text-2xl">
                SEM PERMISSÃO DE VISUALIZAR ESTA PÁGINA
              </p>
            </span>
          </div>
        ) : (
          <>
            {resGestor ? (
              <ResultadoDoGestor
                lucroXDespesa={lucroXDespesa}
                resultadoGestor={resultadoGestor[0]}
                show={showRG}
                periodo={periodo}
              />
            ) : (
              <ResultadosGestorSkeleton />
            )}
          </>
        ))}
    </div>
  ) : (
    <Loader />
  );
}
