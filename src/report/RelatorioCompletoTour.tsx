const open = (
  <svg
    id="eye-open"
    className="w-6 h-fit"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
  </svg>
);
const closed = (
  <svg
    id="eye-closed"
    className="w-6 h-fit"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path>
  </svg>
);

import { useEffect, useRef, useState } from "react";
import CalendarioEResumo from "./sections/CalendarioEResumo";
import ComparativoDoFaturamento from "./sections/ComparativoDoFaturamento";
import DetalheDespesa from "./sections/DetalheDespesa";
import DetalheReserva from "./sections/DetalheReserva";
import RentabilidadeDesempenho from "./sections/RentabilidadeDesempenho";
import ResultadoERepasse from "./sections/ResultadoERepasse";
import ph from "/prohost-logo.png";
import { useReactToPrint } from "react-to-print";
interface propsRelatorio {
  saas: number;
  acomodacao: number;
  mes: number;
  ano: number;
  imagem?: string;
  cores: { primario: string; secundario: string; letra: string };
  onReady?: () => void;
  onDataLoaded?: (hasReservations: boolean) => void;
}

export default function RelatorioCompletoTour(props: propsRelatorio) {
  const chart = (
    <svg
      className="w-10 h-fit"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="512"
      height="512"
      x="0"
      y="0"
      viewBox="0 0 512 512"
    >
      <g>
        <path
          fill-rule="evenodd"
          d="M411.867 151.37h68.62V439.5h-68.62zM72.5 439.499h68.62V329.594H72.5zm113.123 0h68.62V227.278h-68.62zm113.122 0h68.62V267.836h-68.62zM498.5 485.998c0-6.907-5.592-12.498-12.504-12.498H38.497V26.001c0-6.906-5.592-12.503-12.498-12.503s-12.498 5.597-12.498 12.503v459.997c0 6.901 5.597 12.503 12.498 12.503h459.997c6.912 0 12.504-5.602 12.504-12.503zM94.356 269.903l146.704-146.71 60.257 76.15a12.507 12.507 0 0 0 9.071 4.726 12.544 12.544 0 0 0 9.573-3.643L445.286 75.102l-1.927 13.47c-.982 6.833 3.77 13.164 10.597 14.14 6.833.982 13.174-3.77 14.151-10.603l7.229-50.605a12.477 12.477 0 0 0-3.337-10.412 12.51 12.51 0 0 0-10.259-3.796l-52.49 5.196c-6.869.681-11.891 6.801-11.21 13.67s6.801 11.875 13.67 11.204l17.699-1.748L312.21 172.821l-60.262-76.156a12.475 12.475 0 0 0-9.071-4.72 12.518 12.518 0 0 0-9.567 3.638L76.678 252.219c-4.879 4.884-4.879 12.794 0 17.683 2.439 2.439 5.639 3.659 8.839 3.659s6.394-1.22 8.839-3.659z"
          fill={props.cores.secundario}
          opacity="1"
          data-original="#000000"
          className=""
        ></path>
      </g>
    </svg>
  );

  const dash = (
    <svg
      className="w-32 h-fit"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="512"
      height="512"
      x="0"
      y="0"
      viewBox="0 0 512 512"
    >
      <g>
        <path
          fill-rule="evenodd"
          d="M411.867 151.37h68.62V439.5h-68.62zM72.5 439.499h68.62V329.594H72.5zm113.123 0h68.62V227.278h-68.62zm113.122 0h68.62V267.836h-68.62zM498.5 485.998c0-6.907-5.592-12.498-12.504-12.498H38.497V26.001c0-6.906-5.592-12.503-12.498-12.503s-12.498 5.597-12.498 12.503v459.997c0 6.901 5.597 12.503 12.498 12.503h459.997c6.912 0 12.504-5.602 12.504-12.503zM94.356 269.903l146.704-146.71 60.257 76.15a12.507 12.507 0 0 0 9.071 4.726 12.544 12.544 0 0 0 9.573-3.643L445.286 75.102l-1.927 13.47c-.982 6.833 3.77 13.164 10.597 14.14 6.833.982 13.174-3.77 14.151-10.603l7.229-50.605a12.477 12.477 0 0 0-3.337-10.412 12.51 12.51 0 0 0-10.259-3.796l-52.49 5.196c-6.869.681-11.891 6.801-11.21 13.67s6.801 11.875 13.67 11.204l17.699-1.748L312.21 172.821l-60.262-76.156a12.475 12.475 0 0 0-9.071-4.72 12.518 12.518 0 0 0-9.567 3.638L76.678 252.219c-4.879 4.884-4.879 12.794 0 17.683 2.439 2.439 5.639 3.659 8.839 3.659s6.394-1.22 8.839-3.659z"
          fill={props.cores.secundario}
          opacity="1"
          data-original="#000000"
          className=""
        ></path>
      </g>
    </svg>
  );

  const blue_print = (
    <svg
      className="w-32 h-fit"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="512"
      height="512"
      x="0"
      y="0"
      viewBox="0 0 512 512"
    >
      <g>
        <path
          d="M486.887 129.919h-92.08l59.755-59.755c7.448-7.444 7.452-19.597 0-27.044l-26.38-26.382c-7.458-7.455-19.587-7.455-27.044 0L287.957 129.919H118.322V63.718a7.258 7.258 0 0 0-7.259-7.259H59.572c-28.748 0-52.798 23.253-52.798 52.796v179.396c0 4.01 3.249 7.259 7.259 7.259s7.259-3.249 7.259-7.259V109.254c0-21.502 17.527-38.278 38.28-38.278h44.232v324.236H59.572c-14.897 0-28.699 6.308-38.28 16.425v-85.773c0-4.01-3.249-7.259-7.259-7.259s-7.259 3.249-7.259 7.259v122.144c0 29.14 23.684 52.845 52.798 52.845h427.316c10.111 0 18.339-8.228 18.339-18.341V148.26c-.001-10.114-8.228-18.341-18.34-18.341zM328.99 200.061v40.215h-45.877v-19.542l22.094-3.244c2.633-.386 4.404-2.503 4.889-2.859l14.57-14.57zm45.635 147.165h-38.377a7.258 7.258 0 0 0-7.259 7.259v42.441H183.712v-44.617h54.395a7.258 7.258 0 0 0 7.259-7.259v-43.072h54.237a7.258 7.258 0 0 0 7.259-7.259v-39.925h108.63v142.132h-71.985v-35.182h31.118c4.01 0 7.259-3.249 7.259-7.259s-3.249-7.259-7.259-7.259zm-112.46-138.089 4.117-28.05 23.606 23.604c.186.092.366.2.551.293zm-13.731 13.731a7.249 7.249 0 0 0 6.186 2.049l13.975-2.052v17.411h-45.877v-40.215h26.107l-2.439 16.621a7.247 7.247 0 0 0 2.048 6.186zm43.911 31.926v32.666h-54.237a7.258 7.258 0 0 0-7.259 7.259v43.072h-47.136v-82.997zm12.617-55.561-32.895-32.893 113.78-113.782 32.895 32.897zM444.297 59.899l-15.291 15.288-32.895-32.895 15.291-15.291c1.742-1.742 4.773-1.737 6.512 0l26.382 26.382a4.613 4.613 0 0 1 .001 6.516zm46.411 422.614a3.826 3.826 0 0 1-3.821 3.823H59.572c-21.108 0-38.28-17.193-38.28-38.327 0-21.502 17.527-38.278 38.28-38.278h51.491a7.258 7.258 0 0 0 7.259-7.259V144.437h155.117l-16.77 16.77c-.335.486-2.433 1.955-2.859 4.889l-2.854 19.447h-35.497a7.258 7.258 0 0 0-7.259 7.259v47.474h-31.746a7.258 7.258 0 0 0-7.259 7.259v156.65a7.258 7.258 0 0 0 7.259 7.259h246.299a7.258 7.258 0 0 0 7.259-7.259v-156.65a7.258 7.258 0 0 0-7.259-7.259h-79.244v-47.474c0-3.137-2-5.783-4.785-6.798l41.567-41.567h106.598a3.826 3.826 0 0 1 3.821 3.823v334.253z"
          fill={props.cores.secundario}
          opacity="1"
          data-original="#000000"
          className=""
        ></path>
      </g>
    </svg>
  );
  const apiURL = import.meta.env.VITE_API_URL;
  const [editPages, setEditPages] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [edit, setEdit] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [editCalendar, setEditCalendar] = useState([true, true, true, true]);
  function diasDoMes(month: number, year: number) {
    switch (month) {
      case 1: // Janeiro
      case 3: // Março
      case 5: // Maio
      case 7: // Julho
      case 8: // Agosto
      case 10: // Outubro
      case 12: // Dezembro
        return 31;
      case 4: // Abril
      case 6: // Junho
      case 9: // Setembro
      case 11: // Novembro
        return 30;
      case 2: // Fevereiro
        // Verifica se o ano é bissexto
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          return 29;
        } else {
          return 28;
        }
      default:
        return 0;
    }
  }
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const pdfRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: "relatorio.pdf",

    // Lógica para restaurar o DOM após a impressão (ou cancelamento)
    onAfterPrint: () => {
      // const relatorio_container = document.querySelector('#relatorio-container')
      // relatorio_container?.classList.remove('w-main')
      const button_report = document.querySelectorAll(".button-report");
      button_report.forEach((e) => e.classList.remove("hidden"));
      const elements = document.querySelectorAll(".opacity-30");
      elements.forEach((e) => e.classList.remove("hidden"));
      const olhos = document.querySelectorAll("svg#eye-open");
      olhos.forEach((e) => e.classList.remove("hidden"));
    },

    // Ajustes de estilo opcionais. Para PDF, 'landscape' é geralmente melhor.
    pageStyle: `@page { size: A4 landscape; margin: 0px; }
          
          @media print {
          body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
          }
  
          .no-print {
              display: none !important;
          }
  
          .force-print {
              display: block !important;
          }
      }`,
  });
  async function clearRelatorio() {
    const button_report = document.querySelectorAll(".button-report");
    button_report.forEach((e) => e.classList.add("hidden"));
    const elements = document.querySelectorAll(".opacity-30");
    elements.forEach((e) => e.classList.add("hidden"));
    const olhos = document.querySelectorAll("svg#eye-open");
    olhos.forEach((e) => e.classList.add("hidden"));

    await handlePrint();
  }

  const [loaded, setLoaded] = useState<boolean>(false);
  const [reportScale, setReportScale] = useState(1);
  const [nome, setNome] = useState<string>("");
  const [acIMG, setAcIMG] = useState<string>("");

  useEffect(() => {
    const updateReportScale = () => {
      setReportScale(Math.min(1, window.innerWidth / 1000));
    };

    updateReportScale();
    window.addEventListener("resize", updateReportScale);
    return () => window.removeEventListener("resize", updateReportScale);
  }, []);

  async function getJson<T>(url: string, fallback: T): Promise<T> {
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        console.log(`Erro ${response.status} em ${url}`);
        return fallback;
      }
      return await response.json();
    } catch (err) {
      console.log(err);
      return fallback;
    }
  }

  async function getAcomodacao() {
    const bySaas = await getJson<any>(
      `${apiURL}/acomodacao/${props.saas}/${props.acomodacao}`,
      null,
    );
    let acomodacaoData = Array.isArray(bySaas) ? bySaas[0] : bySaas;
    if (!acomodacaoData) {
      const byId = await getJson<any>(
        `${apiURL}/acomodacao/${props.acomodacao}`,
        null,
      );
      acomodacaoData = Array.isArray(byId) ? byId[0] : byId;
    }

    return acomodacaoData;
  }

  async function getData() {
    getAcomodacao().then((acomodacaoData) => {
      if (!acomodacaoData) return;

      setAcIMG(acomodacaoData.foto || "");
      setNome(acomodacaoData.nome || "");
    });

    setLoaded(true);
  }

  useEffect(() => {
    setLoaded(false);
    getData().finally(() => {
      props.onReady?.();
    });
  }, [props.saas, props.acomodacao, props.mes, props.ano]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center gap-10">
        <button
          onClick={() => clearRelatorio()}
          className="w-fit py-1 px-2 bg-red-300"
        >
          Baixar como PDF
        </button>
      </div>
      {loaded && (
        <div className="w-[1000px]" style={{ zoom: reportScale }}>
          <div
            id="relatorio-container"
            className="flex flex-col relative gap-1"
            ref={pdfRef}
          >
            {/* RELATORIO */}
            <section
              style={{ backgroundColor: props.cores.primario }}
              id="relatorio"
              className={`flex flex-col justify-between p-10 h-screen relative bg-[${props.cores.primario}]`}
            >
              <div
                onClick={() => {
                  const logos = document.querySelectorAll(".logo-ph");
                  if (logos[0].classList.contains("opacity-30"))
                    logos.forEach((l) => {
                      l.classList.remove("opacity-30");
                      l.classList.add("opacity-100");
                    });
                  else
                    logos.forEach((l) => {
                      l.classList.remove("opacity-100");
                      l.classList.add("opacity-30");
                    });
                }}
                className="flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer"
              >
                <img src={ph} alt="" className="w-4 h-fit drop-shadow" />
                <p className="text-white font-bold text-lg tracking-tight">
                  prohost
                </p>
              </div>
              <section className="grid grid-cols-2 h-[inherit]">
                <section className={`grid grid-rows-3`}>
                  <div className="flex items-center gap-4">
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-3xl`}
                    >
                      Relatório de Resultados
                    </p>
                    <span>{chart}</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p
                      style={{ color: props.cores.secundario }}
                      className={`text-[${props.cores.secundario}] text-3xl`}
                    >
                      {nome}
                    </p>
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-2xl`}
                    >
                      {meses[props.mes - 1]}.{props.ano}
                    </p>
                    <div className="flex justify-end">
                      <img
                        src={props.imagem}
                        className="max-w-56 max-h-28 h-28"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-xl`}
                    >
                      {("0" + new Date().getDate()).slice(-2)}.
                      {("0" + (new Date().getMonth() + 1)).slice(-2)}.
                      {new Date().getFullYear()}
                    </p>
                  </div>
                </section>
                <section className="flex items-center pl-5">
                  <img src={acIMG} alt={nome} className="h-fit max-h-[650px]" />
                </section>
              </section>
            </section>
            {/* AGENDA */}
            <section
              style={{ backgroundColor: props.cores.primario }}
              id="agenda"
              className={`flex flex-col justify-between p-10 h-screen relative bg-[${props.cores.primario}]`}
            >
              <div
                onClick={() => {
                  const logos = document.querySelectorAll(".logo-ph");
                  if (logos[0].classList.contains("opacity-30"))
                    logos.forEach((l) => {
                      l.classList.remove("opacity-30");
                      l.classList.add("opacity-100");
                    });
                  else
                    logos.forEach((l) => {
                      l.classList.remove("opacity-100");
                      l.classList.add("opacity-30");
                    });
                }}
                className="flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer"
              >
                <img src={ph} alt="" className="w-4 h-fit drop-shadow" />
                <p className="text-white font-bold text-lg tracking-tight">
                  prohost
                </p>
              </div>
              <p
                style={{ color: props.cores.letra }}
                className={`text-3xl text-[${props.cores.letra}]`}
              >
                Agenda
              </p>
              <div className="flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-10">
                <div
                  style={{ backgroundColor: props.cores.primario }}
                  className={`w-full h-px bg-[${props.cores.primario}]`}
                ></div>
                <img
                  src={props.imagem}
                  alt=""
                  className="bg-primary max-w-56 max-h-28 h-28"
                />
              </div>
              <section className="px-5 h-full mt-20 flex flex-col justify-center">
                <ul className="flex flex-col gap-4">
                  <li
                    className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[0] ? "opacity-100" : "opacity-30"}`}
                  >
                    <span
                      style={{ color: props.cores.secundario }}
                      className="font-black text-secondary text-2xl"
                    >
                      *
                    </span>
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-2xl`}
                    >
                      Calendário do mês e resumo das reservas
                    </p>
                    <button
                      className="absolute right-2 invert top-1/2 -translate-y-1/2"
                      onClick={() => {
                        let error = editPages;
                        error = error.map((e, i) => (i === 0 ? !e : e));
                        setEditPages(error);
                      }}
                    >
                      {editPages[0] ? open : closed}
                    </button>
                  </li>
                  <li
                    className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[1] ? "opacity-100" : "opacity-30"}`}
                  >
                    <span
                      style={{ color: props.cores.secundario }}
                      className="font-black text-secondary text-2xl"
                    >
                      *
                    </span>
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-2xl`}
                    >
                      Detalhamento das reservas
                    </p>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 invert"
                      onClick={() => {
                        let error = editPages;
                        error = error.map((e, i) => (i === 1 ? !e : e));
                        setEditPages(error);
                      }}
                    >
                      {editPages[1] ? open : closed}
                    </button>
                  </li>
                  <li
                    className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[2] ? "opacity-100" : "opacity-30"}`}
                  >
                    <span
                      style={{ color: props.cores.secundario }}
                      className="font-black text-secondary text-2xl"
                    >
                      *
                    </span>
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-2xl`}
                    >
                      Desempenho e rentabilidade do imóvel
                    </p>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 invert"
                      onClick={() => {
                        let error = editPages;
                        error = error.map((e, i) => (i === 2 ? !e : e));
                        setEditPages(error);
                      }}
                    >
                      {editPages[2] ? open : closed}
                    </button>
                  </li>
                  <li
                    className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[3] ? "opacity-100" : "opacity-30"}`}
                  >
                    <span
                      style={{ color: props.cores.secundario }}
                      className="font-black text-secondary text-2xl"
                    >
                      *
                    </span>
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-2xl`}
                    >
                      Comparativo do faturamento
                    </p>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 invert"
                      onClick={() => {
                        let error = editPages;
                        error = error.map((e, i) => (i === 3 ? !e : e));
                        setEditPages(error);
                      }}
                    >
                      {editPages[3] ? open : closed}
                    </button>
                  </li>
                  <li
                    className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[4] ? "opacity-100" : "opacity-30"}`}
                  >
                    <span
                      style={{ color: props.cores.secundario }}
                      className="font-black text-secondary text-2xl"
                    >
                      *
                    </span>
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-2xl`}
                    >
                      Detalhamento das despesas
                    </p>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 invert"
                      onClick={() => {
                        let error = editPages;
                        error = error.map((e, i) => (i === 4 ? !e : e));
                        setEditPages(error);
                      }}
                    >
                      {editPages[4] ? open : closed}
                    </button>
                  </li>
                  <li
                    className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[5] ? "opacity-100" : "opacity-30"}`}
                  >
                    <span
                      style={{ color: props.cores.secundario }}
                      className="font-black text-secondary text-2xl"
                    >
                      *
                    </span>
                    <p
                      style={{ color: props.cores.letra }}
                      className={`text-[${props.cores.letra}] text-2xl`}
                    >
                      Resultado da acomodação e repasse
                    </p>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 invert"
                      onClick={() => {
                        let error = editPages;
                        error = error.map((e, i) => (i === 5 ? !e : e));
                        setEditPages(error);
                      }}
                    >
                      {editPages[5] ? open : closed}
                    </button>
                  </li>
                </ul>
              </section>
            </section>
            {/* CALENDARIO DO MES E RESUMO DAS RESERVAS */}
            <CalendarioEResumo
              editPages={editPages}
              setEditPages={setEditPages}
              editCalendar={editCalendar}
              setEditCalendar={setEditCalendar}
              cores={props.cores}
              saas={props.saas}
              dataIni={`${props.ano}-${("0" + props.mes).slice(-2)}-01`}
              dataFim={`${props.ano}-${("0" + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}
              acomodacao={props.acomodacao}
              imagem={props.imagem}
            />
            {/* DETALHAMENTO DE RESERVAS */}
            <DetalheReserva
              editPages={editPages}
              setEditPages={setEditPages}
              cores={props.cores}
              saas={props.saas}
              dataIni={`${props.ano}-${("0" + props.mes).slice(-2)}-01`}
              dataFim={`${props.ano}-${("0" + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}
              acomodacao={props.acomodacao}
              imagem={props.imagem}
              onDataLoaded={props.onDataLoaded}
            />
            {/* DESEMPENHO E RENTABILIDADE DO IMOVEL */}
            <RentabilidadeDesempenho
              editPages={editPages}
              setEditPages={setEditPages}
              cores={props.cores}
              saas={props.saas}
              dataIni={`${props.ano}-${("0" + props.mes).slice(-2)}-01`}
              dataFim={`${props.ano}-${("0" + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}
              acomodacao={props.acomodacao}
              imagem={props.imagem}
            />
            {/* COMPARATIVO DO FATURAMENTO */}
            <ComparativoDoFaturamento
              editPages={editPages}
              setEditPages={setEditPages}
              cores={props.cores}
              saas={props.saas}
              dataIni={`${props.ano}-${("0" + props.mes).slice(-2)}-01`}
              dataFim={`${props.ano}-${("0" + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}
              acomodacao={props.acomodacao}
              imagem={props.imagem}
            />
            {/* DETALHAMENTO DAS DESPESAS */}
            <DetalheDespesa
              editPages={editPages}
              setEditPages={setEditPages}
              cores={props.cores}
              saas={props.saas}
              dataIni={`${props.ano}-${("0" + props.mes).slice(-2)}-01`}
              dataFim={`${props.ano}-${("0" + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}
              acomodacao={props.acomodacao}
              imagem={props.imagem}
            />
            {/* RESULTADO DA ACOMODACAO E REPASSE */}
            <ResultadoERepasse
              editPages={editPages}
              setEditPages={setEditPages}
              edit={edit}
              setEdit={setEdit}
              cores={props.cores}
              saas={props.saas}
              dataIni={`${props.ano}-${("0" + props.mes).slice(-2)}-01`}
              dataFim={`${props.ano}-${("0" + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}
              acomodacao={props.acomodacao}
              imagem={props.imagem}
            />
            {/* CONSIDERACOES FINAIS */}
            <div className={`relative ${!editPages[6] && "opacity-30"}`}>
              <button
                onClick={() => {
                  let error = editPages;
                  error = error.map((e, i) => (i === 6 ? !e : e));
                  setEditPages(error);
                }}
                className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${editPages[6] ? "bg-red-300" : "bg-green-300"} rounded-lg pointer-events-auto`}
              >
                {editPages[6] ? "Ocultar no relatório" : "Mostrar no relatório"}
              </button>
              <section
                style={{ backgroundColor: props.cores.primario }}
                id="final"
                className={`${!editPages[6] && "pointer-events-none opacity-30"} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}
              >
                <div
                  onClick={() => {
                    const logos = document.querySelectorAll(".logo-ph");
                    if (logos[0].classList.contains("opacity-30"))
                      logos.forEach((l) => {
                        l.classList.remove("opacity-30");
                        l.classList.add("opacity-100");
                      });
                    else
                      logos.forEach((l) => {
                        l.classList.remove("opacity-100");
                        l.classList.add("opacity-30");
                      });
                  }}
                  className="flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer"
                >
                  <img src={ph} alt="" className="w-4 h-fit drop-shadow" />
                  <p className="text-white font-bold text-lg tracking-tight">
                    prohost
                  </p>
                </div>
                <p
                  style={{ color: props.cores.letra }}
                  className={`text-3xl text-[${props.cores.letra}]`}
                >
                  Considerações finais
                </p>
                <div className="flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8">
                  <div
                    style={{ backgroundColor: props.cores.primario }}
                    className={`w-full h-px bg-[${props.cores.primario}]`}
                  ></div>
                  <img
                    src={props.imagem}
                    alt=""
                    className="bg-primary max-w-56 max-h-28 h-28"
                  />
                </div>
                <div className="h-[77%] grid col-span-2 gap-6">
                  <section className="flex justify-between bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-2xl">
                    <div className="h-full w-52 relative flex flex-col justify-around items-center">
                      {dash}
                      <p
                        style={{ color: props.cores.letra }}
                        className={`text-xl text-[${props.cores.letra}] text-center`}
                      >
                        Resumo e<br /> resultados
                      </p>
                    </div>
                    <textarea
                      style={{ whiteSpace: "pre-line" }}
                      className="resize-none h-full py-2 px-2 w-3/4 border border-black rounded-xl bg-slate-100 overflow-clip"
                    ></textarea>
                  </section>
                  <section className="flex justify-between  bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg">
                    <div className="h-full w-52 relative flex flex-col justify-around items-center">
                      {blue_print}
                      <p
                        style={{ color: props.cores.letra }}
                        className={`text-xl text-[${props.cores.letra}] text-center`}
                      >
                        Próximos
                        <br /> passos
                      </p>
                    </div>
                    <textarea
                      style={{ whiteSpace: "pre-line" }}
                      className="resize-none h-full py-2 px-2 w-3/4 border border-black rounded-xl bg-slate-100 overflow-clip"
                    ></textarea>
                  </section>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
