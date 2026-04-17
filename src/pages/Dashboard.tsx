import { useContext, useEffect, useRef, useState } from "react";
import EvolucaoNegocio from "../components/chart/EvolucaoNegocio";
import Comparativo from "../components/Comparativo";
import IndicadoresOperacionais from "../components/dashboard/IndicadoresOperacionais";
import ResultadoDasAcomodacoes from "../components/dashboard/ResultadoDasAcomodacoes";
import Loader from "../components/Loader";
import IndicadoresOperacionaisSkeleton from "../components/skeleton/IndicadoresOperacionaisSkeleton";
import ResultadosAcomodacoesSkeleton from "../components/skeleton/ResultadosAcomodacoesSkeleton";
import ResultadosGestorSkeleton from "../components/skeleton/ResultadosGestorSkeleton";
import { SideBarContext } from "../contexts/SideBarMenuContext";
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
  function formatarMoedaBrasileira(valor: string | number | null | undefined) {
    const valorNumerico = parseFloat(String(valor));
    if (isNaN(valorNumerico)) {
      return "R$ 0,00";
    }
    if (valorNumerico < 0)
      return (0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    return valorNumerico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

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
  const [comparativoRG, setComparativoRG] = useState<{
    atual: {
      comissao_terceiros: string | null;
      despesas_negocio: string | null;
      lucro_acomodacoes: string | null;
      lucro_gestor: string | null;
      periodo: string | null;
    } | null;
    passado: {
      comissao_terceiros: string | null;
      despesas_negocio: string | null;
      lucro_acomodacoes: string | null;
      lucro_gestor: string | null;
      periodo: string | null;
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

    setResAc(true)
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

  async function resultGest([start, end]: [string, string]) {
    const base = `${apiURL}/movimentacao/${dataToken.id}`;
    const inicioDate = `${start.slice(0, 4)}-01-01`;
    const finalDate =
      periodo === "personalizado" ? end : `${end.slice(0, 4)}-12-31`;

    try {
      const [result, comparativo, lucroDespesa] = await Promise.all([
        fetchJson(`${base}/result-gestor/${start}/${end}`),
        fetchJson(`${base}/comparativo-result-gestor/${start}/${end}`),
        fetchJson(`${base}/lucroxdespesa/${inicioDate}/${finalDate}`),
      ]);

      setResultadoGestor(result);

      if (Array.isArray(comparativo) && comparativo.length > 0) {
        setComparativoRG({
          atual: comparativo.find((d: any) => d.periodo === "atual"),
          passado: comparativo.find((d: any) => d.periodo === "ano_anterior"),
        });
      }

      setLucroXDespesa(lucroDespesa);
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
              <section
                className="grid gap-5 mb-10"
                style={{
                  gridTemplateAreas: `'lap lap lap en en en en'
                'tl tl tl en en en en'
                'cat cat cat en en en en'
                'dn dn dn en en en en'
                'lg lg lg en en en en'
                `,
                  gridTemplateColumns: "1fr 0.8fr 0fr 1fr 1fr 1fr",
                  gridTemplateRows: "1fr 1fr 1fr 1fr",
                }}
              >
                <div
                  className="bg-white border-zinc-300 border rounded-lg flex items-center"
                  style={{ gridArea: "lap" }}
                >
                  <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                    <svg
                      className="w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#01AAFE"
                    >
                      <path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col ml-4">
                    <p className="flex flex-col text-zinc-400 font-medium text-sm">
                      Lucro das Acomodações Próprias
                    </p>
                    <div className="flex items-end gap-4">
                      <span className="text-nowrap text-xl">
                        {formatarMoedaBrasileira(
                          resultadoGestor[0]?.lucro_acomodacoes,
                        )}
                      </span>
                      <Comparativo
                        nome="LUCRO DAS ACOMODAÇÕES PRÓPRIAS"
                        data={dataBW}
                        formatarMoeda={formatarMoedaBrasileira}
                        passado={
                          Number(comparativoRG.passado?.lucro_acomodacoes) || 0
                        }
                        atual={
                          Number(comparativoRG.atual?.lucro_acomodacoes) || 0
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="bg-white border-zinc-300 border rounded-lg flex items-center"
                  style={{ gridArea: "cat" }}
                >
                  <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                    <svg
                      className="w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#6279F2"
                    >
                      <path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col ml-4">
                    <p className="flex flex-col text-zinc-400 font-medium text-sm">
                      Comissão das Acomodações de Terceiros
                    </p>
                    <div className="flex items-end gap-4">
                      <span className="text-nowrap text-xl">
                        {formatarMoedaBrasileira(
                          resultadoGestor[0]?.comissao_terceiros,
                        )}
                      </span>
                      <Comparativo
                        nome="COMISSÃO DAS ACOMODAÇÕES TERCEIRAS"
                        data={dataBW}
                        formatarMoeda={formatarMoedaBrasileira}
                        passado={
                          Number(comparativoRG.passado?.comissao_terceiros) || 0
                        }
                        atual={
                          Number(comparativoRG.atual?.comissao_terceiros) || 0
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="bg-white border-zinc-300 border rounded-lg flex items-center"
                  style={{ gridArea: "dn" }}
                >
                  <div className="bg-[#F8DCDC] rounded-md w-fit py-2 px-2 ml-4">
                    <svg
                      className="w-6 fill-[#D94D52]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48l45.5 0c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5L488 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-288.3 0c-11.5 0-21.4-8.2-23.6-19.5L170.7 288l288.5 0c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32L360 32l0 102.1 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-64 64c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23L312 32 120.1 32C111 12.8 91.6 0 69.5 0L24 0zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col ml-4">
                    <p className="flex flex-col text-zinc-400 font-medium text-sm">
                      Despesas de Negócio
                    </p>
                    <div className="flex items-end gap-4">
                      <span className="text-nowrap text-xl">
                        {formatarMoedaBrasileira(
                          resultadoGestor[0]?.despesas_negocio,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  style={{ gridArea: "tl" }}
                  className="bg-white border-zinc-300 border rounded-lg h-full flex items-center"
                >
                  <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                    <svg
                      className="w-6 h-fit"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="512"
                      height="512"
                      x="0"
                      y="0"
                      viewBox="0 0 480 480"
                    >
                      <g>
                        <path
                          d="M416 336h-12.528a56.806 56.806 0 0 0-25.312 5.976 40.799 40.799 0 0 1-36.32 0 56.604 56.604 0 0 0-14.4-4.8L343.032 216H360a8 8 0 0 0 8-8v-32a8 8 0 0 0-8-8h-32v-24a8 8 0 0 0-2.344-5.656L288 100.688V75.84l12.128-9.696 20.712 41.432 14.32-7.152-22.256-44.504L322.8 48H352a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8h-80c-39.744.048-71.952 32.256-72 72a8 8 0 0 0 8 8h16v20.688l-21.656 21.656A8 8 0 0 0 200 128v40h-16v-64a7.906 7.906 0 0 0-.584-2.888 8.263 8.263 0 0 0-.496-.904 8.911 8.911 0 0 0-.672-1.208L152 61.2V8a8 8 0 0 0-8-8H96a8 8 0 0 0-8 8v53.2L57.752 99c-.255.385-.48.789-.672 1.208-.184.291-.35.593-.496.904A7.906 7.906 0 0 0 56 104v64H24a8 8 0 0 0-8 8v32a8 8 0 0 0 8 8h16.968l31.096 241.024A8 8 0 0 0 80 464h188.32A47.862 47.862 0 0 0 304 480h12.528a56.806 56.806 0 0 0 25.312-5.976 40.799 40.799 0 0 1 36.32 0A56.806 56.806 0 0 0 403.472 480H416c26.499-.026 47.974-21.501 48-48v-48c-.026-26.499-21.501-47.974-48-48zM328 16h16v16h-16V16zm24 168v16H240v-16h112zM216.568 64c4.013-27.535 27.606-47.965 55.432-48h40v20.16L277.192 64h-60.624zM272 80v16h-32V80h32zm-56 51.312L235.312 112h41.376L312 147.312V168h-96v-36.688zM208 184h16v56a8 8 0 0 0 4.424 7.2l48 24a9.663 9.663 0 0 1 4.92 5.688 10.289 10.289 0 0 1-.8 8 9.343 9.343 0 0 1-12.531 4.194l-.021-.01-32.48-16.24A8 8 0 0 0 224 280v80c0 8.837-7.163 16-16 16v-72h-16v72h-16v-72h-16v72h-16v-72h-16v72c-8.837 0-16-7.163-16-16V184h96zM104 16h32v40h-32V16zm-4.16 56h40.32l19.2 24H80.64l19.2-24zM72 112h96v56H72v-56zm-40 88v-16h64v16H32zm224 184v48a47.818 47.818 0 0 0 2.8 16H87.032L57.096 216H96v144c0 17.673 14.327 32 32 32h80c17.673 0 32-14.327 32-32v-67.056l20.896 10.448c12.627 6.232 27.915 1.048 34.147-11.579l.077-.157a25.896 25.896 0 0 0 1.464-19.8 25.597 25.597 0 0 0-12.96-14.992L240 235.056V216h86.904l-15.488 120H304c-26.499.026-47.974 21.501-48 48zm192 48c0 17.673-14.327 32-32 32h-12.528a40.8 40.8 0 0 1-18.152-4.288 56.903 56.903 0 0 0-50.64 0A40.8 40.8 0 0 1 316.528 464H304c-17.673 0-32-14.327-32-32v-12.32A47.75 47.75 0 0 0 304 432h12.528a56.806 56.806 0 0 0 25.312-5.976 40.799 40.799 0 0 1 36.32 0A56.806 56.806 0 0 0 403.472 432H416a47.75 47.75 0 0 0 32-12.32V432zm-32-16h-12.528a40.8 40.8 0 0 1-18.152-4.288 56.903 56.903 0 0 0-50.64 0A40.8 40.8 0 0 1 316.528 416H304c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h12.528a40.8 40.8 0 0 1 18.152 4.288 56.935 56.935 0 0 0 50.64 0A40.8 40.8 0 0 1 403.472 352H416c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32z"
                          fill="#009ae7"
                          opacity="1"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M408 368h16v16h-16zM328 368h16v16h-16zM296 376h16v16h-16zM376 376h16v16h-16z"
                          fill="#009ae7"
                          opacity="1"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="flex flex-col ml-4">
                    <p className="flex flex-col text-zinc-400 font-medium text-sm">
                      Taxa de Limpeza
                    </p>
                    <div className="flex items-end gap-4">
                      <span className="text-nowrap text-xl">
                        {formatarMoedaBrasileira(
                          resultadoGestor[0]?.ajuste_comissao_ota,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-white border-zinc-300 border rounded-lg flex items-center"
                  style={{ gridArea: "lg" }}
                >
                  <div className="bg-[#E0FEEA] rounded-md w-fit py-2 px-2 ml-4">
                    <svg
                      className="w-6 h-fit"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="512"
                      height="512"
                      x="0"
                      y="0"
                      viewBox="0 0 484.184 484.184"
                    >
                      <g>
                        <path
                          d="M309.43 219.944c-19-10.5-39.2-18.5-59.2-26.8-11.6-4.8-22.7-10.4-32.5-18.2-19.3-15.4-15.6-40.4 7-50.3 6.4-2.8 13.1-3.7 19.9-4.1 26.2-1.4 51.1 3.4 74.8 14.8 11.8 5.7 15.7 3.9 19.7-8.4 4.2-13 7.7-26.2 11.6-39.3 2.6-8.8-.6-14.6-8.9-18.3-15.2-6.7-30.8-11.5-47.2-14.1-21.4-3.3-21.4-3.4-21.5-24.9-.1-30.3-.1-30.3-30.5-30.3-4.4 0-8.8-.1-13.2 0-14.2.4-16.6 2.9-17 17.2-.2 6.4 0 12.8-.1 19.3-.1 19-.2 18.7-18.4 25.3-44 16-71.2 46-74.1 94-2.6 42.5 19.6 71.2 54.5 92.1 21.5 12.9 45.3 20.5 68.1 30.6 8.9 3.9 17.4 8.4 24.8 14.6 21.9 18.1 17.9 48.2-8.1 59.6-13.9 6.1-28.6 7.6-43.7 5.7-23.3-2.9-45.6-9-66.6-19.9-12.3-6.4-15.9-4.7-20.1 8.6-3.6 11.5-6.8 23.1-10 34.7-4.3 15.6-2.7 19.3 12.2 26.6 19 9.2 39.3 13.9 60 17.2 16.2 2.6 16.7 3.3 16.9 20.1.1 7.6.1 15.3.2 22.9.1 9.6 4.7 15.2 14.6 15.4 11.2.2 22.5.2 33.7-.1 9.2-.2 13.9-5.2 13.9-14.5 0-10.4.5-20.9.1-31.3-.5-10.6 4.1-16 14.3-18.8 23.5-6.4 43.5-19 58.9-37.8 42.8-52 26.5-128.1-34.1-161.6z"
                          fill="#61C365"
                          opacity="1"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="flex flex-col ml-4">
                    <p className="flex flex-col text-zinc-400 font-medium text-sm">
                      Lucro do Gestor
                    </p>
                    <div className="flex items-end gap-4">
                      <span className="text-nowrap text-xl">
                        {formatarMoedaBrasileira(
                          resultadoGestor[0]?.lucro_gestor,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-white border-zinc-300 border rounded-lg flex flex-col px-2 items-center"
                  style={{ gridArea: "en" }}
                >
                  <p className="flex flex-col text-zinc-400 font-medium text-sm mb-14 mt-3">
                    Faturamento x Despesas do negócio
                  </p>
                  {periodo == "m-atual" && lucroXDespesa.length > 0 ? (
                    <EvolucaoNegocio
                      mes={new Date().getMonth()}
                      ano={Number(String(new Date().getFullYear()).slice(-2))}
                      dadosLucros={lucroXDespesa.map((d) =>
                        Number(d.lucro_acomodacoes),
                      )}
                      dadosDespesas={lucroXDespesa.map((d) =>
                        Number(d.despesas_negocio),
                      )}
                    />
                  ) : null}
                  {periodo == "m-passado" && lucroXDespesa.length > 0 ? (
                    <EvolucaoNegocio
                      mes={
                        new Date().getMonth() == 0
                          ? 11
                          : new Date().getMonth() - 1
                      }
                      ano={
                        new Date().getMonth() == 0
                          ? Number(String(new Date().getFullYear()).slice(-2)) -
                            1
                          : Number(String(new Date().getFullYear()).slice(-2))
                      }
                      dadosLucros={lucroXDespesa.map((d) =>
                        Number(d.lucro_acomodacoes),
                      )}
                      dadosDespesas={lucroXDespesa.map((d) =>
                        Number(d.despesas_negocio),
                      )}
                    />
                  ) : null}
                  {periodo == "a-atual" && lucroXDespesa.length > 0 ? (
                    <EvolucaoNegocio
                      mes={11}
                      ano={Number(String(new Date().getFullYear()).slice(-2))}
                      dadosLucros={lucroXDespesa.map((d) =>
                        Number(d.lucro_acomodacoes),
                      )}
                      dadosDespesas={lucroXDespesa.map((d) =>
                        Number(d.despesas_negocio),
                      )}
                    />
                  ) : null}
                  {periodo == "a-passado" && lucroXDespesa.length > 0 ? (
                    <EvolucaoNegocio
                      mes={11}
                      ano={
                        Number(String(new Date().getFullYear()).slice(-2)) - 1
                      }
                      dadosLucros={lucroXDespesa.map((d) =>
                        Number(d.lucro_acomodacoes),
                      )}
                      dadosDespesas={lucroXDespesa.map((d) =>
                        Number(d.despesas_negocio),
                      )}
                    />
                  ) : null}
                  {periodo == "personalizado" && lucroXDespesa.length > 0 ? (
                    <EvolucaoNegocio
                      mes={11}
                      ano={Number(String(new Date().getFullYear()).slice(-2))}
                      dadosLucros={lucroXDespesa.map((d) =>
                        Number(d.lucro_acomodacoes),
                      )}
                      dadosDespesas={lucroXDespesa.map((d) =>
                        Number(d.despesas_negocio),
                      )}
                    />
                  ) : null}
                </div>
              </section>
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
