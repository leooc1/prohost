import { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import posthog from "../posthog";
import RelatorioCompletoTour from "../report/RelatorioCompletoTour";
import PromocaoRelatorio from "./PromocaoRelatorio";
import { TourBoasVindas } from "./tour/TourBoasVindas";

const prohostLogo = "/prohost-logo.png";
const imgAC =
  "//af19a0c58ea3d8ff8c151e96f3e2400f.cdn.bubble.io/f1720121395037x748090676094426100/Francisco%20de%20Paula%20600%20BL%201%20ap%20502%20-%2005.jpg";
const apiURL = import.meta.env.VITE_API_URL;

const mes = ("0" + (new Date().getUTCMonth() + 1)).slice(-2);
const ano = new Date().getUTCFullYear();
const ONBOARDING_STEP_NAMES: Record<number, string> = {
  1: "Cadastro da acomodação",
  2: "Importar reservas",
  3: "Visualizar relatório",
};

type TourPassoCardProps = {
  stepLabel: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

function TourPassoCard({
  stepLabel,
  stepNumber,
  totalSteps,
  title,
  eyebrow,
  description,
  children,
  footer,
  className = "",
}: TourPassoCardProps) {
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <div
      className={`w-full max-w-[420px] overflow-hidden rounded-[18px] border border-[#d7dde1] bg-white shadow-[0_18px_40px_rgba(11,21,30,0.12)] ${className}`}
    >
      <div className="flex items-center justify-between bg-[#003347] px-4 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <img src={prohostLogo} alt="logo do prohost" />
          <span className="text-[28px] font-black leading-none tracking-[-0.05em]">
            prohost
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#bce8eb]">
            {stepLabel}
          </span>
          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#18E2B2] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#f4f7f8] px-4 pb-4 pt-5">
        {eyebrow && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#5d7680]">
            {eyebrow}
          </p>
        )}

        <h2 className="text-[17px] font-bold leading-tight tracking-[-0.03em] text-[#0f2a35]">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-sm leading-5 text-[#546c77]">{description}</p>
        )}

        <div className="mt-4">{children}</div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}

export default function TourRelatorio() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const onboardingStarted = useRef(false);
  const previousStep = useRef(step);
  const [tipo, setTipo] = useState<string>("terceiro");
  const [nome, setNome] = useState<string>("");
  const [idAcomodacao, setIdAcomodacao] = useState<number>();
  const [idCategoria, setIdCategoria] = useState<number>();
  const { dataToken } = useContext(SideBarContext);
  const [hospede, setHospede] = useState<any[]>([]);
  const [idHospede, setIdHospede] = useState<number>();
  const [canalReserva, setCanalReserva] = useState<{
    nome: string;
    id: number;
    cor: string;
  }>({ nome: "", id: 0, cor: "" });

  const mesAtual = new Date().getUTCMonth() + 1;
  const anoAtual = new Date().getUTCFullYear();

  const ultimoMesDoArquivo = 9;
  const ultimoAnoDoArquivo = 2026;

  function trackStepCompleted(stepNumber: number) {
    posthog.capture("onboarding_passo_concluido", {
      numero_passo: stepNumber,
      nome_passo: ONBOARDING_STEP_NAMES[stepNumber],
    });
  }

  function trackOnboardingAbandoned(stepNumber: number) {
    if (!onboardingStarted.current) return;

    posthog.capture("onboarding_abandonado", {
      numero_passo: stepNumber,
      nome_passo:
        stepNumber === 0
          ? "Boas-vindas"
          : ONBOARDING_STEP_NAMES[stepNumber],
    });
  }

  function handleTourReportDataLoaded(hasReservations: boolean) {
    if (!hasReservations || !dataToken?.id) return;

    const firstReportKey = `ph-primeiro-relatorio-gerado-${dataToken.id}`;
    if (window.localStorage.getItem(firstReportKey)) return;

    posthog.capture("primeiro_relatorio_gerado");
    window.localStorage.setItem(firstReportKey, "true");
  }

  function deslocarData(data: string) {
    const [ano, mes, dia] = data.split("-").map(Number);

    const diferencaMeses =
      (anoAtual - ultimoAnoDoArquivo) * 12 + (mesAtual - ultimoMesDoArquivo);

    // Calcula o mês de destino e limita o dia ao último dia desse mês.
    const destino = new Date(Date.UTC(ano, mes - 1, 1));
    destino.setUTCMonth(destino.getUTCMonth() + diferencaMeses);

    const ultimoDia = new Date(
      Date.UTC(destino.getUTCFullYear(), destino.getUTCMonth() + 1, 0),
    ).getUTCDate();

    destino.setUTCDate(Math.min(dia, ultimoDia));

    const y = destino.getUTCFullYear();
    const m = String(destino.getUTCMonth() + 1).padStart(2, "0");
    const d = String(destino.getUTCDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  }

  const reservasBase = [
    {
      taxa_limpeza: 250.0,
      comissao_ota: 564.16,
      qtd_hospede: 1,
      valor: 3087.84,
      valor_liq: 2523.68,
      valor_liq_calculado: 2523.68,
      valor_prop: 3087.84,
      valor_gestor: 3087.84,
      check_in_source: "2024-10-03",
      check_out_source: "2024-10-06",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 770.89,
      qtd_hospede: 1,
      valor: 4219.32,
      valor_liq: 3448.43,
      valor_liq_calculado: 3448.43,
      valor_prop: 4219.32,
      valor_gestor: 4219.32,
      check_in_source: "2024-10-08",
      check_out_source: "2024-10-14",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 246.35,
      qtd_hospede: 1,
      valor: 1348.42,
      valor_liq: 1102.07,
      valor_liq_calculado: 1102.07,
      valor_prop: 1348.42,
      valor_gestor: 1348.42,
      check_in_source: "2024-10-14",
      check_out_source: "2024-10-17",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 673.78,
      qtd_hospede: 1,
      valor: 3687.81,
      valor_liq: 3014.03,
      valor_liq_calculado: 3014.03,
      valor_prop: 3687.81,
      valor_gestor: 3687.81,
      check_in_source: "2024-10-17",
      check_out_source: "2024-10-21",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 559.25,
      qtd_hospede: 1,
      valor: 3060.96,
      valor_liq: 2501.71,
      valor_liq_calculado: 2501.71,
      valor_prop: 3060.96,
      valor_gestor: 3060.96,
      check_in_source: "2024-10-22",
      check_out_source: "2024-10-27",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 1217.17,
      qtd_hospede: 1,
      valor: 6661.95,
      valor_liq: 5444.78,
      valor_liq_calculado: 5444.78,
      valor_prop: 6661.95,
      valor_gestor: 6661.95,
      check_in_source: "2024-10-27",
      check_out_source: "2024-11-03",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 293.43,
      qtd_hospede: 1,
      valor: 1606.04,
      valor_liq: 1312.61,
      valor_liq_calculado: 1312.61,
      valor_prop: 1606.04,
      valor_gestor: 1606.04,
      check_in_source: "2024-11-03",
      check_out_source: "2024-11-06",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 567.68,
      qtd_hospede: 1,
      valor: 3107.14,
      valor_liq: 2539.46,
      valor_liq_calculado: 2539.46,
      valor_prop: 3107.14,
      valor_gestor: 3107.14,
      check_in_source: "2024-11-07",
      check_out_source: "2024-11-10",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 1131.78,
      qtd_hospede: 1,
      valor: 6194.62,
      valor_liq: 5062.84,
      valor_liq_calculado: 5062.84,
      valor_prop: 6194.62,
      valor_gestor: 6194.62,
      check_in_source: "2024-11-11",
      check_out_source: "2024-11-17",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 477.13,
      qtd_hospede: 1,
      valor: 2611.47,
      valor_liq: 2134.34,
      valor_liq_calculado: 2134.34,
      valor_prop: 2611.47,
      valor_gestor: 2611.47,
      check_in_source: "2024-11-17",
      check_out_source: "2024-11-20",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 589.65,
      qtd_hospede: 1,
      valor: 3227.34,
      valor_liq: 2637.69,
      valor_liq_calculado: 2637.69,
      valor_prop: 3227.34,
      valor_gestor: 3227.34,
      check_in_source: "2024-11-22",
      check_out_source: "2024-11-25",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 221.62,
      qtd_hospede: 1,
      valor: 1213.02,
      valor_liq: 991.4,
      valor_liq_calculado: 991.4,
      valor_prop: 1213.02,
      valor_gestor: 1213.02,
      check_in_source: "2024-11-25",
      check_out_source: "2024-11-28",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 700.3,
      qtd_hospede: 1,
      valor: 3832.97,
      valor_liq: 3132.67,
      valor_liq_calculado: 3132.67,
      valor_prop: 3832.97,
      valor_gestor: 3832.97,
      check_in_source: "2024-11-28",
      check_out_source: "2024-12-01",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 714.31,
      qtd_hospede: 1,
      valor: 3909.67,
      valor_liq: 3195.36,
      valor_liq_calculado: 3195.36,
      valor_prop: 3909.67,
      valor_gestor: 3909.67,
      check_in_source: "2024-12-03",
      check_out_source: "2024-12-07",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 190.01,
      qtd_hospede: 1,
      valor: 1039.98,
      valor_liq: 849.97,
      valor_liq_calculado: 849.97,
      valor_prop: 1039.98,
      valor_gestor: 1039.98,
      check_in_source: "2024-12-07",
      check_out_source: "2024-12-08",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 511.89,
      qtd_hospede: 1,
      valor: 2801.69,
      valor_liq: 2289.8,
      valor_liq_calculado: 2289.8,
      valor_prop: 2801.69,
      valor_gestor: 2801.69,
      check_in_source: "2024-12-08",
      check_out_source: "2024-12-12",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 345.88,
      qtd_hospede: 1,
      valor: 1893.11,
      valor_liq: 1547.23,
      valor_liq_calculado: 1547.23,
      valor_prop: 1893.11,
      valor_gestor: 1893.11,
      check_in_source: "2024-12-12",
      check_out_source: "2024-12-15",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 394.39,
      qtd_hospede: 1,
      valor: 2158.62,
      valor_liq: 1764.23,
      valor_liq_calculado: 1764.23,
      valor_prop: 2158.62,
      valor_gestor: 2158.62,
      check_in_source: "2024-12-15",
      check_out_source: "2024-12-17",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 364.36,
      qtd_hospede: 1,
      valor: 1994.27,
      valor_liq: 1629.91,
      valor_liq_calculado: 1629.91,
      valor_prop: 1994.27,
      valor_gestor: 1994.27,
      check_in_source: "2024-12-18",
      check_out_source: "2024-12-21",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 797.82,
      qtd_hospede: 1,
      valor: 4366.68,
      valor_liq: 3568.86,
      valor_liq_calculado: 3568.86,
      valor_prop: 4366.68,
      valor_gestor: 4366.68,
      check_in_source: "2024-12-21",
      check_out_source: "2024-12-25",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 716.17,
      qtd_hospede: 1,
      valor: 3919.8,
      valor_liq: 3203.63,
      valor_liq_calculado: 3203.63,
      valor_prop: 3919.8,
      valor_gestor: 3919.8,
      check_in_source: "2024-12-25",
      check_out_source: "2024-12-28",
    },
    {
      taxa_limpeza: 150.0,
      comissao_ota: 3759.83,
      qtd_hospede: 1,
      valor: 18260.18,
      valor_liq: 14500.35,
      valor_liq_calculado: 14500.35,
      valor_prop: 18260.18,
      valor_gestor: 18260.18,
      check_in_source: "2024-12-28",
      check_out_source: "2025-01-03",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 836.97,
      qtd_hospede: 1,
      valor: 4581.03,
      valor_liq: 3744.06,
      valor_liq_calculado: 3744.06,
      valor_prop: 4581.03,
      valor_gestor: 4581.03,
      check_in_source: "2025-01-03",
      check_out_source: "2025-01-07",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 1278.9,
      qtd_hospede: 1,
      valor: 6999.86,
      valor_liq: 5720.96,
      valor_liq_calculado: 5720.96,
      valor_prop: 6999.86,
      valor_gestor: 6999.86,
      check_in_source: "2025-01-07",
      check_out_source: "2025-01-13",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 416.79,
      qtd_hospede: 1,
      valor: 2281.21,
      valor_liq: 1864.42,
      valor_liq_calculado: 1864.42,
      valor_prop: 2281.21,
      valor_gestor: 2281.21,
      check_in_source: "2025-01-13",
      check_out_source: "2025-01-16",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 868.18,
      qtd_hospede: 1,
      valor: 4751.82,
      valor_liq: 3883.64,
      valor_liq_calculado: 3883.64,
      valor_prop: 4751.82,
      valor_gestor: 4751.82,
      check_in_source: "2025-01-17",
      check_out_source: "2025-01-21",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 628.59,
      qtd_hospede: 1,
      valor: 3440.48,
      valor_liq: 2811.89,
      valor_liq_calculado: 2811.89,
      valor_prop: 3440.48,
      valor_gestor: 3440.48,
      check_in_source: "2025-01-22",
      check_out_source: "2025-01-26",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 822.76,
      qtd_hospede: 1,
      valor: 4503.22,
      valor_liq: 3680.46,
      valor_liq_calculado: 3680.46,
      valor_prop: 4503.22,
      valor_gestor: 4503.22,
      check_in_source: "2025-01-26",
      check_out_source: "2025-01-28",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 244.61,
      qtd_hospede: 1,
      valor: 1338.91,
      valor_liq: 1094.3,
      valor_liq_calculado: 1094.3,
      valor_prop: 1338.91,
      valor_gestor: 1338.91,
      check_in_source: "2025-01-28",
      check_out_source: "2025-02-01",
    },
    {
      taxa_limpeza: 0.0,
      comissao_ota: 274.5,
      qtd_hospede: 1,
      valor: 1555.5,
      valor_liq: 1281.0,
      valor_liq_calculado: 1281.0,
      valor_prop: 1555.5,
      valor_gestor: 1555.5,
      check_in_source: "2025-02-01",
      check_out_source: "2025-02-03",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 801.84,
      qtd_hospede: 1,
      valor: 4388.8,
      valor_liq: 3586.96,
      valor_liq_calculado: 3586.96,
      valor_prop: 4388.8,
      valor_gestor: 4388.8,
      check_in_source: "2025-02-03",
      check_out_source: "2025-02-08",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 959.07,
      qtd_hospede: 1,
      valor: 5249.32,
      valor_liq: 4290.25,
      valor_liq_calculado: 4290.25,
      valor_prop: 5249.32,
      valor_gestor: 5249.32,
      check_in_source: "2025-02-08",
      check_out_source: "2025-02-13",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 496.96,
      qtd_hospede: 1,
      valor: 2720.04,
      valor_liq: 2223.08,
      valor_liq_calculado: 2223.08,
      valor_prop: 2720.04,
      valor_gestor: 2720.04,
      check_in_source: "2025-02-13",
      check_out_source: "2025-02-16",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 1721.68,
      qtd_hospede: 1,
      valor: 9423.31,
      valor_liq: 7701.63,
      valor_liq_calculado: 7701.63,
      valor_prop: 9423.31,
      valor_gestor: 9423.31,
      check_in_source: "2025-02-16",
      check_out_source: "2025-02-25",
    },
    {
      taxa_limpeza: 150.0,
      comissao_ota: 3831.18,
      qtd_hospede: 1,
      valor: 20893.81,
      valor_liq: 17062.63,
      valor_liq_calculado: 17062.63,
      valor_prop: 20893.81,
      valor_gestor: 20893.81,
      check_in_source: "2025-02-26",
      check_out_source: "2025-03-03",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 3357.24,
      qtd_hospede: 1,
      valor: 18375.26,
      valor_liq: 15018.02,
      valor_liq_calculado: 15018.02,
      valor_prop: 18375.26,
      valor_gestor: 18375.26,
      check_in_source: "2025-03-04",
      check_out_source: "2025-03-10",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 1174.22,
      qtd_hospede: 1,
      valor: 6426.92,
      valor_liq: 5252.7,
      valor_liq_calculado: 5252.7,
      valor_prop: 6426.92,
      valor_gestor: 6426.92,
      check_in_source: "2025-03-12",
      check_out_source: "2025-03-19",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 450.15,
      qtd_hospede: 1,
      valor: 2463.85,
      valor_liq: 2013.7,
      valor_liq_calculado: 2013.7,
      valor_prop: 2463.85,
      valor_gestor: 2463.85,
      check_in_source: "2025-03-20",
      check_out_source: "2025-03-23",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 1338.57,
      qtd_hospede: 1,
      valor: 7326.45,
      valor_liq: 5987.88,
      valor_liq_calculado: 5987.88,
      valor_prop: 7326.45,
      valor_gestor: 7326.45,
      check_in_source: "2025-03-24",
      check_out_source: "2025-03-30",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 338.93,
      qtd_hospede: 1,
      valor: 1855.04,
      valor_liq: 1516.11,
      valor_liq_calculado: 1516.11,
      valor_prop: 1855.04,
      valor_gestor: 1855.04,
      check_in_source: "2025-04-01",
      check_out_source: "2025-04-04",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 387.74,
      qtd_hospede: 1,
      valor: 2122.26,
      valor_liq: 1734.52,
      valor_liq_calculado: 1734.52,
      valor_prop: 2122.26,
      valor_gestor: 2122.26,
      check_in_source: "2025-04-04",
      check_out_source: "2025-04-06",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 558.6,
      qtd_hospede: 1,
      valor: 3057.43,
      valor_liq: 2498.83,
      valor_liq_calculado: 2498.83,
      valor_prop: 3057.43,
      valor_gestor: 3057.43,
      check_in_source: "2025-04-09",
      check_out_source: "2025-04-13",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 449.34,
      qtd_hospede: 1,
      valor: 2459.44,
      valor_liq: 2010.1,
      valor_liq_calculado: 2010.1,
      valor_prop: 2459.44,
      valor_gestor: 2459.44,
      check_in_source: "2025-04-13",
      check_out_source: "2025-04-18",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 1222.71,
      qtd_hospede: 1,
      valor: 6692.29,
      valor_liq: 5469.58,
      valor_liq_calculado: 5469.58,
      valor_prop: 6692.29,
      valor_gestor: 6692.29,
      check_in_source: "2025-04-18",
      check_out_source: "2025-04-21",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1104.91,
      qtd_hospede: 1,
      valor: 5366.14,
      valor_liq: 4261.23,
      valor_liq_calculado: 4261.23,
      valor_prop: 5366.14,
      valor_gestor: 5366.14,
      check_in_source: "2025-04-22",
      check_out_source: "2025-04-30",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 2273.27,
      qtd_hospede: 1,
      valor: 11040.53,
      valor_liq: 8767.26,
      valor_liq_calculado: 8767.26,
      valor_prop: 11040.53,
      valor_gestor: 11040.53,
      check_in_source: "2025-04-30",
      check_out_source: "2025-05-07",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 495.94,
      qtd_hospede: 1,
      valor: 2408.69,
      valor_liq: 1912.75,
      valor_liq_calculado: 1912.75,
      valor_prop: 2408.69,
      valor_gestor: 2408.69,
      check_in_source: "2025-05-09",
      check_out_source: "2025-05-12",
    },
    {
      taxa_limpeza: 250.0,
      comissao_ota: 968.59,
      qtd_hospede: 1,
      valor: 5301.4,
      valor_liq: 4332.81,
      valor_liq_calculado: 4332.81,
      valor_prop: 5301.4,
      valor_gestor: 5301.4,
      check_in_source: "2025-05-12",
      check_out_source: "2025-05-16",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 415.99,
      qtd_hospede: 1,
      valor: 2020.29,
      valor_liq: 1604.3,
      valor_liq_calculado: 1604.3,
      valor_prop: 2020.29,
      valor_gestor: 2020.29,
      check_in_source: "2025-05-16",
      check_out_source: "2025-05-20",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1157.4,
      qtd_hospede: 1,
      valor: 5621.11,
      valor_liq: 4463.71,
      valor_liq_calculado: 4463.71,
      valor_prop: 5621.11,
      valor_gestor: 5621.11,
      check_in_source: "2025-05-20",
      check_out_source: "2025-05-30",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 546.4,
      qtd_hospede: 1,
      valor: 2653.61,
      valor_liq: 2107.21,
      valor_liq_calculado: 2107.21,
      valor_prop: 2653.61,
      valor_gestor: 2653.61,
      check_in_source: "2025-05-30",
      check_out_source: "2025-06-03",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 598.51,
      qtd_hospede: 1,
      valor: 2906.69,
      valor_liq: 2308.18,
      valor_liq_calculado: 2308.18,
      valor_prop: 2906.69,
      valor_gestor: 2906.69,
      check_in_source: "2025-06-05",
      check_out_source: "2025-06-08",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 326.81,
      qtd_hospede: 1,
      valor: 1587.19,
      valor_liq: 1260.38,
      valor_liq_calculado: 1260.38,
      valor_prop: 1587.19,
      valor_gestor: 1587.19,
      check_in_source: "2025-06-10",
      check_out_source: "2025-06-12",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 749.38,
      qtd_hospede: 1,
      valor: 3639.56,
      valor_liq: 2890.18,
      valor_liq_calculado: 2890.18,
      valor_prop: 3639.56,
      valor_gestor: 3639.56,
      check_in_source: "2025-06-12",
      check_out_source: "2025-06-16",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1573.18,
      qtd_hospede: 1,
      valor: 7640.37,
      valor_liq: 6067.19,
      valor_liq_calculado: 6067.19,
      valor_prop: 7640.37,
      valor_gestor: 7640.37,
      check_in_source: "2025-06-18",
      check_out_source: "2025-06-25",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 358.51,
      qtd_hospede: 1,
      valor: 1741.11,
      valor_liq: 1382.6,
      valor_liq_calculado: 1382.6,
      valor_prop: 1741.11,
      valor_gestor: 1741.11,
      check_in_source: "2025-06-27",
      check_out_source: "2025-06-29",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 936.89,
      qtd_hospede: 1,
      valor: 4550.16,
      valor_liq: 3613.27,
      valor_liq_calculado: 3613.27,
      valor_prop: 4550.16,
      valor_gestor: 4550.16,
      check_in_source: "2025-06-29",
      check_out_source: "2025-07-05",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 448.67,
      qtd_hospede: 1,
      valor: 2179.12,
      valor_liq: 1730.45,
      valor_liq_calculado: 1730.45,
      valor_prop: 2179.12,
      valor_gestor: 2179.12,
      check_in_source: "2025-07-05",
      check_out_source: "2025-07-10",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 777.92,
      qtd_hospede: 1,
      valor: 3778.08,
      valor_liq: 3000.16,
      valor_liq_calculado: 3000.16,
      valor_prop: 3778.08,
      valor_gestor: 3778.08,
      check_in_source: "2025-07-10",
      check_out_source: "2025-07-13",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 969.4,
      qtd_hospede: 1,
      valor: 4708.1,
      valor_liq: 3738.7,
      valor_liq_calculado: 3738.7,
      valor_prop: 4708.1,
      valor_gestor: 4708.1,
      check_in_source: "2025-07-15",
      check_out_source: "2025-07-21",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 461.22,
      qtd_hospede: 1,
      valor: 2239.97,
      valor_liq: 1778.75,
      valor_liq_calculado: 1778.75,
      valor_prop: 2239.97,
      valor_gestor: 2239.97,
      check_in_source: "2025-07-21",
      check_out_source: "2025-07-24",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 624.92,
      qtd_hospede: 1,
      valor: 3035.05,
      valor_liq: 2410.13,
      valor_liq_calculado: 2410.13,
      valor_prop: 3035.05,
      valor_gestor: 3035.05,
      check_in_source: "2025-07-25",
      check_out_source: "2025-07-28",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 587.23,
      qtd_hospede: 1,
      valor: 2851.96,
      valor_liq: 2264.73,
      valor_liq_calculado: 2264.73,
      valor_prop: 2851.96,
      valor_gestor: 2851.96,
      check_in_source: "2025-07-30",
      check_out_source: "2025-08-02",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1647.35,
      qtd_hospede: 1,
      valor: 8000.65,
      valor_liq: 6353.3,
      valor_liq_calculado: 6353.3,
      valor_prop: 8000.65,
      valor_gestor: 8000.65,
      check_in_source: "2025-08-02",
      check_out_source: "2025-08-09",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 266.1,
      qtd_hospede: 1,
      valor: 1194.77,
      valor_liq: 928.67,
      valor_liq_calculado: 928.67,
      valor_prop: 1194.77,
      valor_gestor: 1194.77,
      check_in_source: "2025-08-09",
      check_out_source: "2025-08-11",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1359.32,
      qtd_hospede: 1,
      valor: 6601.72,
      valor_liq: 5242.4,
      valor_liq_calculado: 5242.4,
      valor_prop: 6601.72,
      valor_gestor: 6601.72,
      check_in_source: "2025-08-11",
      check_out_source: "2025-08-18",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 267.73,
      qtd_hospede: 1,
      valor: 1202.23,
      valor_liq: 934.5,
      valor_liq_calculado: 934.5,
      valor_prop: 1202.23,
      valor_gestor: 1202.23,
      check_in_source: "2025-08-18",
      check_out_source: "2025-08-19",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 666.59,
      qtd_hospede: 1,
      valor: 2993.43,
      valor_liq: 2326.84,
      valor_liq_calculado: 2326.84,
      valor_prop: 2993.43,
      valor_gestor: 2993.43,
      check_in_source: "2025-08-19",
      check_out_source: "2025-08-22",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1472.78,
      qtd_hospede: 1,
      valor: 7152.83,
      valor_liq: 5680.05,
      valor_liq_calculado: 5680.05,
      valor_prop: 7152.83,
      valor_gestor: 7152.83,
      check_in_source: "2025-08-23",
      check_out_source: "2025-08-30",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 868.75,
      qtd_hospede: 1,
      valor: 3901.29,
      valor_liq: 3032.54,
      valor_liq_calculado: 3032.54,
      valor_prop: 3901.29,
      valor_gestor: 3901.29,
      check_in_source: "2025-08-30",
      check_out_source: "2025-09-03",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 399.55,
      qtd_hospede: 1,
      valor: 1794.2,
      valor_liq: 1394.65,
      valor_liq_calculado: 1394.65,
      valor_prop: 1794.2,
      valor_gestor: 1794.2,
      check_in_source: "2025-09-04",
      check_out_source: "2025-09-06",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 735.35,
      qtd_hospede: 1,
      valor: 3302.19,
      valor_liq: 2566.84,
      valor_liq_calculado: 2566.84,
      valor_prop: 3302.19,
      valor_gestor: 3302.19,
      check_in_source: "2025-09-06",
      check_out_source: "2025-09-10",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1090.72,
      qtd_hospede: 1,
      valor: 4898.03,
      valor_liq: 3807.31,
      valor_liq_calculado: 3807.31,
      valor_prop: 4898.03,
      valor_gestor: 4898.03,
      check_in_source: "2025-09-11",
      check_out_source: "2025-09-16",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1207.51,
      qtd_hospede: 1,
      valor: 5422.48,
      valor_liq: 4214.97,
      valor_liq_calculado: 4214.97,
      valor_prop: 5422.48,
      valor_gestor: 5422.48,
      check_in_source: "2025-09-17",
      check_out_source: "2025-09-22",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 950.71,
      qtd_hospede: 1,
      valor: 4269.28,
      valor_liq: 3318.57,
      valor_liq_calculado: 3318.57,
      valor_prop: 4269.28,
      valor_gestor: 4269.28,
      check_in_source: "2025-09-24",
      check_out_source: "2025-09-28",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 572.62,
      qtd_hospede: 1,
      valor: 2571.38,
      valor_liq: 1998.76,
      valor_liq_calculado: 1998.76,
      valor_prop: 2571.38,
      valor_gestor: 2571.38,
      check_in_source: "2025-10-03",
      check_out_source: "2025-10-06",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1070.37,
      qtd_hospede: 1,
      valor: 4806.63,
      valor_liq: 3736.26,
      valor_liq_calculado: 3736.26,
      valor_prop: 4806.63,
      valor_gestor: 4806.63,
      check_in_source: "2025-10-08",
      check_out_source: "2025-10-12",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1746.19,
      qtd_hospede: 1,
      valor: 7841.5,
      valor_liq: 6095.31,
      valor_liq_calculado: 6095.31,
      valor_prop: 7841.5,
      valor_gestor: 7841.5,
      check_in_source: "2025-10-12",
      check_out_source: "2025-10-19",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 485.92,
      qtd_hospede: 1,
      valor: 2182.08,
      valor_liq: 1696.16,
      valor_liq_calculado: 1696.16,
      valor_prop: 2182.08,
      valor_gestor: 2182.08,
      check_in_source: "2025-10-19",
      check_out_source: "2025-10-24",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1215.25,
      qtd_hospede: 1,
      valor: 5457.26,
      valor_liq: 4242.01,
      valor_liq_calculado: 4242.01,
      valor_prop: 5457.26,
      valor_gestor: 5457.26,
      check_in_source: "2025-10-24",
      check_out_source: "2025-10-28",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 492.36,
      qtd_hospede: 1,
      valor: 2211.01,
      valor_liq: 1718.65,
      valor_liq_calculado: 1718.65,
      valor_prop: 2211.01,
      valor_gestor: 2211.01,
      check_in_source: "2025-10-28",
      check_out_source: "2025-10-30",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 1151.24,
      qtd_hospede: 1,
      valor: 5169.76,
      valor_liq: 4018.52,
      valor_liq_calculado: 4018.52,
      valor_prop: 5169.76,
      valor_gestor: 5169.76,
      check_in_source: "2025-10-30",
      check_out_source: "2025-11-06",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 700.71,
      qtd_hospede: 1,
      valor: 3146.65,
      valor_liq: 2445.94,
      valor_liq_calculado: 2445.94,
      valor_prop: 3146.65,
      valor_gestor: 3146.65,
      check_in_source: "2025-11-06",
      check_out_source: "2025-11-10",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 384.3,
      qtd_hospede: 1,
      valor: 1725.66,
      valor_liq: 1341.36,
      valor_liq_calculado: 1341.36,
      valor_prop: 1725.66,
      valor_gestor: 1725.66,
      check_in_source: "2025-11-10",
      check_out_source: "2025-11-12",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1253.71,
      qtd_hospede: 1,
      valor: 5629.84,
      valor_liq: 4376.13,
      valor_liq_calculado: 4376.13,
      valor_prop: 5629.84,
      valor_gestor: 5629.84,
      check_in_source: "2025-11-14",
      check_out_source: "2025-11-20",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 923.57,
      qtd_hospede: 1,
      valor: 4147.43,
      valor_liq: 3223.86,
      valor_liq_calculado: 3223.86,
      valor_prop: 4147.43,
      valor_gestor: 4147.43,
      check_in_source: "2025-11-20",
      check_out_source: "2025-11-23",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 242.41,
      qtd_hospede: 1,
      valor: 1088.62,
      valor_liq: 846.21,
      valor_liq_calculado: 846.21,
      valor_prop: 1088.62,
      valor_gestor: 1088.62,
      check_in_source: "2025-11-23",
      check_out_source: "2025-11-25",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 914.64,
      qtd_hospede: 1,
      valor: 4107.38,
      valor_liq: 3192.74,
      valor_liq_calculado: 3192.74,
      valor_prop: 4107.38,
      valor_gestor: 4107.38,
      check_in_source: "2025-11-26",
      check_out_source: "2025-11-30",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1242.11,
      qtd_hospede: 1,
      valor: 5577.89,
      valor_liq: 4335.78,
      valor_liq_calculado: 4335.78,
      valor_prop: 5577.89,
      valor_gestor: 5577.89,
      check_in_source: "2025-12-06",
      check_out_source: "2025-12-10",
    },
    {
      taxa_limpeza: 0.0,
      comissao_ota: 140.68,
      qtd_hospede: 1,
      valor: 631.74,
      valor_liq: 491.06,
      valor_liq_calculado: 491.06,
      valor_prop: 631.74,
      valor_gestor: 631.74,
      check_in_source: "2025-12-10",
      check_out_source: "2025-12-18",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1058.09,
      qtd_hospede: 1,
      valor: 4751.51,
      valor_liq: 3693.42,
      valor_liq_calculado: 3693.42,
      valor_prop: 4751.51,
      valor_gestor: 4751.51,
      check_in_source: "2025-12-10",
      check_out_source: "2025-12-18",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1548.08,
      qtd_hospede: 1,
      valor: 6951.89,
      valor_liq: 5403.81,
      valor_liq_calculado: 5403.81,
      valor_prop: 6951.89,
      valor_gestor: 6951.89,
      check_in_source: "2025-12-18",
      check_out_source: "2025-12-27",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 5354.58,
      qtd_hospede: 1,
      valor: 26005.4,
      valor_liq: 20650.82,
      valor_liq_calculado: 20650.82,
      valor_prop: 26005.4,
      valor_gestor: 26005.4,
      check_in_source: "2025-12-27",
      check_out_source: "2026-01-02",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 6382.01,
      qtd_hospede: 1,
      valor: 30995.3,
      valor_liq: 24613.29,
      valor_liq_calculado: 24613.29,
      valor_prop: 30995.3,
      valor_gestor: 30995.3,
      check_in_source: "2026-01-02",
      check_out_source: "2026-01-23",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1299.25,
      qtd_hospede: 1,
      valor: 5834.45,
      valor_liq: 4535.2,
      valor_liq_calculado: 4535.2,
      valor_prop: 5834.45,
      valor_gestor: 5834.45,
      check_in_source: "2026-01-23",
      check_out_source: "2026-01-27",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 639.73,
      qtd_hospede: 1,
      valor: 2872.78,
      valor_liq: 2233.05,
      valor_liq_calculado: 2233.05,
      valor_prop: 2872.78,
      valor_gestor: 2872.78,
      check_in_source: "2026-01-28",
      check_out_source: "2026-01-28",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 2138.36,
      qtd_hospede: 1,
      valor: 9602.61,
      valor_liq: 7464.25,
      valor_liq_calculado: 7464.25,
      valor_prop: 9602.61,
      valor_gestor: 9602.61,
      check_in_source: "2026-01-28",
      check_out_source: "2026-02-08",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 628.11,
      qtd_hospede: 1,
      valor: 2820.62,
      valor_liq: 2192.51,
      valor_liq_calculado: 2192.51,
      valor_prop: 2820.62,
      valor_gestor: 2820.62,
      check_in_source: "2026-02-09",
      check_out_source: "2026-02-12",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 2785.65,
      qtd_hospede: 1,
      valor: 12509.31,
      valor_liq: 9723.66,
      valor_liq_calculado: 9723.66,
      valor_prop: 12509.31,
      valor_gestor: 12509.31,
      check_in_source: "2026-02-13",
      check_out_source: "2026-02-16",
    },
    {
      taxa_limpeza: 300.0,
      comissao_ota: 4993.96,
      qtd_hospede: 1,
      valor: 22426.06,
      valor_liq: 17432.1,
      valor_liq_calculado: 17432.1,
      valor_prop: 22426.06,
      valor_gestor: 22426.06,
      check_in_source: "2026-02-16",
      check_out_source: "2026-02-20",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1239.39,
      qtd_hospede: 1,
      valor: 5565.6,
      valor_liq: 4326.21,
      valor_liq_calculado: 4326.21,
      valor_prop: 5565.6,
      valor_gestor: 5565.6,
      check_in_source: "2026-02-20",
      check_out_source: "2026-02-25",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 711.46,
      qtd_hospede: 1,
      valor: 3194.94,
      valor_liq: 2483.48,
      valor_liq_calculado: 2483.48,
      valor_prop: 3194.94,
      valor_gestor: 3194.94,
      check_in_source: "2026-02-26",
      check_out_source: "2026-03-01",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 346.05,
      qtd_hospede: 1,
      valor: 1554.02,
      valor_liq: 1207.97,
      valor_liq_calculado: 1207.97,
      valor_prop: 1554.02,
      valor_gestor: 1554.02,
      check_in_source: "2026-03-01",
      check_out_source: "2026-03-03",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1212.2,
      qtd_hospede: 1,
      valor: 5443.52,
      valor_liq: 4231.32,
      valor_liq_calculado: 4231.32,
      valor_prop: 5443.52,
      valor_gestor: 5443.52,
      check_in_source: "2026-03-04",
      check_out_source: "2026-03-09",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 673.7,
      qtd_hospede: 1,
      valor: 3025.31,
      valor_liq: 2351.61,
      valor_liq_calculado: 2351.61,
      valor_prop: 3025.31,
      valor_gestor: 3025.31,
      check_in_source: "2026-03-09",
      check_out_source: "2026-03-13",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 788.18,
      qtd_hospede: 1,
      valor: 3539.47,
      valor_liq: 2751.29,
      valor_liq_calculado: 2751.29,
      valor_prop: 3539.47,
      valor_gestor: 3539.47,
      check_in_source: "2026-03-13",
      check_out_source: "2026-03-16",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 364.19,
      qtd_hospede: 1,
      valor: 1635.43,
      valor_liq: 1271.24,
      valor_liq_calculado: 1271.24,
      valor_prop: 1635.43,
      valor_gestor: 1635.43,
      check_in_source: "2026-03-16",
      check_out_source: "2026-03-19",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 806.54,
      qtd_hospede: 1,
      valor: 3621.86,
      valor_liq: 2815.32,
      valor_liq_calculado: 2815.32,
      valor_prop: 3621.86,
      valor_gestor: 3621.86,
      check_in_source: "2026-03-19",
      check_out_source: "2026-03-22",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 531.82,
      qtd_hospede: 1,
      valor: 2388.19,
      valor_liq: 1856.37,
      valor_liq_calculado: 1856.37,
      valor_prop: 2388.19,
      valor_gestor: 2388.19,
      check_in_source: "2026-03-22",
      check_out_source: "2026-03-26",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 805.89,
      qtd_hospede: 1,
      valor: 3618.91,
      valor_liq: 2813.02,
      valor_liq_calculado: 2813.02,
      valor_prop: 3618.91,
      valor_gestor: 3618.91,
      check_in_source: "2026-03-26",
      check_out_source: "2026-03-29",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 454.93,
      qtd_hospede: 1,
      valor: 2042.91,
      valor_liq: 1587.98,
      valor_liq_calculado: 1587.98,
      valor_prop: 2042.91,
      valor_gestor: 2042.91,
      check_in_source: "2026-03-29",
      check_out_source: "2026-04-02",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1095.68,
      qtd_hospede: 1,
      valor: 4920.32,
      valor_liq: 3824.64,
      valor_liq_calculado: 3824.64,
      valor_prop: 4920.32,
      valor_gestor: 4920.32,
      check_in_source: "2026-04-02",
      check_out_source: "2026-04-05",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1933.11,
      qtd_hospede: 1,
      valor: 8680.84,
      valor_liq: 6747.73,
      valor_liq_calculado: 6747.73,
      valor_prop: 8680.84,
      valor_gestor: 8680.84,
      check_in_source: "2026-04-05",
      check_out_source: "2026-04-14",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1161.26,
      qtd_hospede: 1,
      valor: 5214.74,
      valor_liq: 4053.48,
      valor_liq_calculado: 4053.48,
      valor_prop: 5214.74,
      valor_gestor: 5214.74,
      check_in_source: "2026-04-16",
      check_out_source: "2026-04-22",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 831.73,
      qtd_hospede: 1,
      valor: 3735.02,
      valor_liq: 2903.29,
      valor_liq_calculado: 2903.29,
      valor_prop: 3735.02,
      valor_gestor: 3735.02,
      check_in_source: "2026-04-23",
      check_out_source: "2026-04-27",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 425.89,
      qtd_hospede: 1,
      valor: 1912.57,
      valor_liq: 1486.68,
      valor_liq_calculado: 1486.68,
      valor_prop: 1912.57,
      valor_gestor: 1912.57,
      check_in_source: "2026-04-28",
      check_out_source: "2026-05-01",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1866.63,
      qtd_hospede: 1,
      valor: 8382.36,
      valor_liq: 6515.73,
      valor_liq_calculado: 6515.73,
      valor_prop: 8382.36,
      valor_gestor: 8382.36,
      check_in_source: "2026-05-01",
      check_out_source: "2026-05-08",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 448.95,
      qtd_hospede: 1,
      valor: 2016.05,
      valor_liq: 1567.1,
      valor_liq_calculado: 1567.1,
      valor_prop: 2016.05,
      valor_gestor: 2016.05,
      check_in_source: "2026-05-08",
      check_out_source: "2026-05-10",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 853.94,
      qtd_hospede: 1,
      valor: 3834.74,
      valor_liq: 2980.8,
      valor_liq_calculado: 2980.8,
      valor_prop: 3834.74,
      valor_gestor: 3834.74,
      check_in_source: "2026-05-13",
      check_out_source: "2026-05-17",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 381.02,
      qtd_hospede: 1,
      valor: 1710.98,
      valor_liq: 1329.96,
      valor_liq_calculado: 1329.96,
      valor_prop: 1710.98,
      valor_gestor: 1710.98,
      check_in_source: "2026-05-17",
      check_out_source: "2026-05-20",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1118.52,
      qtd_hospede: 1,
      valor: 5022.83,
      valor_liq: 3904.31,
      valor_liq_calculado: 3904.31,
      valor_prop: 5022.83,
      valor_gestor: 5022.83,
      check_in_source: "2026-05-21",
      check_out_source: "2026-05-28",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1019.72,
      qtd_hospede: 1,
      valor: 4579.19,
      valor_liq: 3559.47,
      valor_liq_calculado: 3559.47,
      valor_prop: 4579.19,
      valor_gestor: 4579.19,
      check_in_source: "2026-05-28",
      check_out_source: "2026-06-02",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1276.82,
      qtd_hospede: 1,
      valor: 5733.68,
      valor_liq: 4456.86,
      valor_liq_calculado: 4456.86,
      valor_prop: 5733.68,
      valor_gestor: 5733.68,
      check_in_source: "2026-06-04",
      check_out_source: "2026-06-07",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 822.47,
      qtd_hospede: 1,
      valor: 3693.41,
      valor_liq: 2870.94,
      valor_liq_calculado: 2870.94,
      valor_prop: 3693.41,
      valor_gestor: 3693.41,
      check_in_source: "2026-06-09",
      check_out_source: "2026-06-14",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 595.19,
      qtd_hospede: 1,
      valor: 2672.81,
      valor_liq: 2077.62,
      valor_liq_calculado: 2077.62,
      valor_prop: 2672.81,
      valor_gestor: 2672.81,
      check_in_source: "2026-06-18",
      check_out_source: "2026-06-21",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 383.25,
      qtd_hospede: 1,
      valor: 1721.08,
      valor_liq: 1337.83,
      valor_liq_calculado: 1337.83,
      valor_prop: 1721.08,
      valor_gestor: 1721.08,
      check_in_source: "2026-06-23",
      check_out_source: "2026-06-27",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1007.42,
      qtd_hospede: 1,
      valor: 4523.93,
      valor_liq: 3516.51,
      valor_liq_calculado: 3516.51,
      valor_prop: 4523.93,
      valor_gestor: 4523.93,
      check_in_source: "2026-06-27",
      check_out_source: "2026-07-03",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1504.87,
      qtd_hospede: 1,
      valor: 6757.81,
      valor_liq: 5252.94,
      valor_liq_calculado: 5252.94,
      valor_prop: 6757.81,
      valor_gestor: 6757.81,
      check_in_source: "2026-07-04",
      check_out_source: "2026-07-11",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 443.3,
      qtd_hospede: 1,
      valor: 1990.74,
      valor_liq: 1547.44,
      valor_liq_calculado: 1547.44,
      valor_prop: 1990.74,
      valor_gestor: 1990.74,
      check_in_source: "2026-07-12",
      check_out_source: "2026-07-15",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1054.67,
      qtd_hospede: 1,
      valor: 4736.13,
      valor_liq: 3681.46,
      valor_liq_calculado: 3681.46,
      valor_prop: 4736.13,
      valor_gestor: 4736.13,
      check_in_source: "2026-07-15",
      check_out_source: "2026-07-19",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 548.75,
      qtd_hospede: 1,
      valor: 2464.23,
      valor_liq: 1915.48,
      valor_liq_calculado: 1915.48,
      valor_prop: 2464.23,
      valor_gestor: 2464.23,
      check_in_source: "2026-07-19",
      check_out_source: "2026-07-23",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 638.69,
      qtd_hospede: 1,
      valor: 2868.11,
      valor_liq: 2229.42,
      valor_liq_calculado: 2229.42,
      valor_prop: 2868.11,
      valor_gestor: 2868.11,
      check_in_source: "2026-07-24",
      check_out_source: "2026-07-27",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 858.14,
      qtd_hospede: 1,
      valor: 3853.52,
      valor_liq: 2995.38,
      valor_liq_calculado: 2995.38,
      valor_prop: 3853.52,
      valor_gestor: 3853.52,
      check_in_source: "2026-07-27",
      check_out_source: "2026-08-01",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1121.92,
      qtd_hospede: 1,
      valor: 5038.07,
      valor_liq: 3916.15,
      valor_liq_calculado: 3916.15,
      valor_prop: 5038.07,
      valor_gestor: 5038.07,
      check_in_source: "2026-08-03",
      check_out_source: "2026-08-06",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 2158.98,
      qtd_hospede: 1,
      valor: 9695.2,
      valor_liq: 7536.22,
      valor_liq_calculado: 7536.22,
      valor_prop: 9695.2,
      valor_gestor: 9695.2,
      check_in_source: "2026-08-06",
      check_out_source: "2026-08-16",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 831.65,
      qtd_hospede: 1,
      valor: 3734.59,
      valor_liq: 2902.94,
      valor_liq_calculado: 2902.94,
      valor_prop: 3734.59,
      valor_gestor: 3734.59,
      check_in_source: "2026-08-17",
      check_out_source: "2026-08-21",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 691.36,
      qtd_hospede: 1,
      valor: 3104.64,
      valor_liq: 2413.28,
      valor_liq_calculado: 2413.28,
      valor_prop: 3104.64,
      valor_gestor: 3104.64,
      check_in_source: "2026-08-21",
      check_out_source: "2026-08-23",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 800.35,
      qtd_hospede: 1,
      valor: 3594.05,
      valor_liq: 2793.7,
      valor_liq_calculado: 2793.7,
      valor_prop: 3594.05,
      valor_gestor: 3594.05,
      check_in_source: "2026-08-23",
      check_out_source: "2026-08-27",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 648.67,
      qtd_hospede: 1,
      valor: 2912.96,
      valor_liq: 2264.29,
      valor_liq_calculado: 2264.29,
      valor_prop: 2912.96,
      valor_gestor: 2912.96,
      check_in_source: "2026-08-27",
      check_out_source: "2026-08-30",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1759.3,
      qtd_hospede: 1,
      valor: 7900.27,
      valor_liq: 6140.97,
      valor_liq_calculado: 6140.97,
      valor_prop: 7900.27,
      valor_gestor: 7900.27,
      check_in_source: "2026-08-30",
      check_out_source: "2026-09-07",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 755.56,
      qtd_hospede: 1,
      valor: 3392.94,
      valor_liq: 2637.38,
      valor_liq_calculado: 2637.38,
      valor_prop: 3392.94,
      valor_gestor: 3392.94,
      check_in_source: "2026-09-07",
      check_out_source: "2026-09-12",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 781.34,
      qtd_hospede: 1,
      valor: 3508.74,
      valor_liq: 2727.4,
      valor_liq_calculado: 2727.4,
      valor_prop: 3508.74,
      valor_gestor: 3508.74,
      check_in_source: "2026-09-12",
      check_out_source: "2026-09-17",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1045.09,
      qtd_hospede: 1,
      valor: 4693.11,
      valor_liq: 3648.02,
      valor_liq_calculado: 3648.02,
      valor_prop: 4693.11,
      valor_gestor: 4693.11,
      check_in_source: "2026-09-18",
      check_out_source: "2026-09-23",
    },
    {
      taxa_limpeza: 400.0,
      comissao_ota: 1584.37,
      qtd_hospede: 1,
      valor: 7114.83,
      valor_liq: 5530.46,
      valor_liq_calculado: 5530.46,
      valor_prop: 7114.83,
      valor_gestor: 7114.83,
      check_in_source: "2026-09-23",
      check_out_source: "2026-09-30",
    },
  ];

  const reservasParaImportar = reservasBase.map((reserva) => ({
    acomodacao: {
      id: idAcomodacao,
    },
    check_in: `${deslocarData(reserva.check_in_source)} 15:00:00`,
    check_out: `${deslocarData(reserva.check_out_source)} 11:00:00`,
    taxa_limpeza: reserva.taxa_limpeza,
    canal_reserva: {
      id: canalReserva.id,
    },
    comissao_ota: reserva.comissao_ota,
    hospede: {
      id: idHospede,
    },
    qtd_hospede: reserva.qtd_hospede,
    saas: {
      id: dataToken.id,
    },
    valor: reserva.valor,
    valor_liq: reserva.valor_liq,
    valor_prop: reserva.valor_prop,
    valor_gestor: reserva.valor_gestor,
    valor_liq_calculado: reserva.valor_liq_calculado,
    obs: "",
    tipo_reserva: "Reserva",
    continuidade: null,
  }));

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
        foto: imgAC,
        modelo: 3,
        repasse: 2,
        nome: nome,
        taxa_limpeza: Number(100),
        numero_hospedes: Number(3),
        valor_imovel: Number(500000),
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
          trackStepCompleted(1);
          setStep(2);
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
  async function adicionarDespesa() {
    async function categorias() {
      if (dataToken.id)
        await fetch(`${apiURL}/categoria_financeiro/${dataToken.id}`, {
          method: "GET",
        })
          .then((data) => data.json())
          .then(
            async (
              data: {
                cor: string;
                editavel: Boolean;
                receita: Boolean;
                nome: string;
                id: number;
                saas: number;
                tipo_despesa: null | string;
              }[],
            ) => {
              if (data.map((d) => d.nome.toLowerCase()).includes("luz")) {
                setIdCategoria(
                  (
                    data.find((d) => d.nome.toLowerCase().includes("luz")) as {
                      cor: string;
                      editavel: Boolean;
                      receita: Boolean;
                      nome: string;
                      id: number;
                      saas: number;
                      tipo_despesa: null | string;
                    }
                  ).id as number,
                );
              } else await createCategoria();
            },
          )
          .catch((err) => console.log(err));
    }
    async function createCategoria() {
      const body = {
        receita: false,
        saas: { id: dataToken.id },
        cor: "#820000",
        nome: "LUZ",
        tipo_despesa: "Despesas Fixas",
      };

      const response = await fetch(`${apiURL}/categoria_financeiro/`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        response.json().then((data) => setIdCategoria(data.id));
      }
    }
    categorias();
  }

  async function createDespesa() {
    const dateValue = [
      { data: "2026-09-10", valor: 230 },
      { data: "2026-08-10", valor: 400 },
      { data: "2026-07-10", valor: 500 },
      { data: "2026-06-10", valor: 310 },
      { data: "2026-05-10", valor: 340 },
      { data: "2026-04-10", valor: 370 },
    ];
    const despesas = dateValue.map((dv) => ({
      acomodacao: {
        id: idAcomodacao,
      },
      categoria_financeiro: {
        id: idCategoria,
      },
      data: deslocarData(dv.data),
      canal_reserva: {
        id: null,
      },
      nome: "Luz",
      saas: {
        id: dataToken.id,
      },
      valor: dv.valor,
      valor_liq: dv.valor,
      valor_prop: 0,
      valor_gestor: 0,
      comissao_ota: 0,
      reserva: {
        id: null,
      },
      pago: true,
      receita: false,
      tipo_despesa: "Despesas Fixas",
      recebedor: "",
      obs: "",
    }));

    despesas.forEach(async (d) => {
      await fetch(`${apiURL}/movimentacao/`, {
        method: "POST",
        body: JSON.stringify(d),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((data) => data.json())
        // .then((data) => {
        //   if (data.id) {
        //   }
        // })
        .catch((err) => console.log(err));
    });
  }

  useEffect(() => {
    getHospede();
    getCanalReserva();
    adicionarDespesa();
    if (!JSON.parse(window.localStorage.getItem("tour-relatorio") || "true"))
      setStep(-1);
  }, []);

  useEffect(() => {
    if (
      step === 0 &&
      !onboardingStarted.current &&
      JSON.parse(window.localStorage.getItem("tour-relatorio") || "true")
    ) {
      onboardingStarted.current = true;
      posthog.capture("onboarding_iniciado");
    }

    if (previousStep.current !== step) {
      if (step >= 1 && step <= 3) {
        posthog.capture("onboarding_passo_visto", {
          numero_passo: step,
          nome_passo: ONBOARDING_STEP_NAMES[step],
        });
      } else if (step === 4) {
        posthog.capture("oferta_vista", { percentual_desconto: 70 });
      }
      previousStep.current = step;
    }
  }, [step]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-primary/95 transition-all duration-300 ${step === -1 && "hidden"} ${step !== 5 && "pointer-events-auto"} overflow-y-auto`}
    >
      <Toaster />
      {step == 0 && (
        <div className="pointer-events-auto flex min-h-screen w-full items-center justify-center px-3 py-6 sm:px-4">
          <TourBoasVindas
            logoSrc={prohostLogo}
            onStart={() => {
              setStep(1);
            }}
            onSkip={() => {
              trackOnboardingAbandoned(0);
              window.localStorage.setItem("tour-relatorio", "false");
              window.localStorage.setItem("tour", "0");
              location.reload();
              setStep(-1);
            }}
          />
        </div>
      )}
      {step == 1 && (
        <div className="pointer-events-auto flex min-h-screen w-full items-center justify-center px-3 py-6 sm:px-4">
          <TourPassoCard
            stepLabel="Passo 1 de 3"
            stepNumber={1}
            totalSteps={3}
            title="Cadastro da acomodação"
            description="Vamos gerar seu primeiro relatório. Comece por um cadastro simples e em seguida continue quando quiser."
            footer={
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                  }}
                  className="text-sm font-medium text-[#526c76] underline underline-offset-2"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    let hospedeId;
                    if (
                      hospede.filter(
                        (h) =>
                          h.nome.toLowerCase() ==
                          "Hóspede Padrão".toLowerCase(),
                      ).length > 0
                    ) {
                      hospedeId =
                        hospede.filter(
                          (h) =>
                            h.nome.toLowerCase() ==
                            "Hóspede Padrão".toLowerCase(),
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
                          .max(
                            50,
                            "Coloque um nome com no máximo 50 caracteres",
                          ),

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
                          .max(
                            50,
                            "Coloque um nome com no máximo 50 caracteres",
                          ),

                        comissao: z
                          .number({
                            error: "A comissão deve ser um número",
                          })
                          .min(0.01, "A comissão deve ser maior que zero"),
                      }),
                    ]);

                    const comissao =
                      tipo == "terceiro"
                        ? (
                            document.getElementById(
                              "comissao",
                            ) as HTMLInputElement
                          ).value
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
                  className="flex-1 rounded-md bg-[#0d8d69] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0a7a5d]"
                >
                  Cadastrar e continuar
                </button>
              </div>
            }
          >
            <form className="flex flex-col gap-3">
              <label htmlFor="identificador" className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#546c77]">
                  Identificador
                  <span className="ml-1 text-[#df3b43]">*</span>
                </span>
                <input
                  placeholder="Ex: Apartamento Guarujá"
                  type="text"
                  name="identificador"
                  id="identificador"
                  className="rounded-md border border-[#d0d8dc] bg-white px-3 py-2 text-sm text-[#143644] outline-none transition focus:border-[#0f8a79] focus:ring-2 focus:ring-[#0dbf9d]/20"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </label>

              <div
                className={`grid items-start gap-3 ${tipo == "terceiro" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
              >
                <label htmlFor="status" className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#546c77]">
                    Status
                    <span className="ml-1 text-[#df3b43]">*</span>
                  </span>
                  <select
                    name="status"
                    id="status"
                    className="rounded-md border border-[#d0d8dc] bg-white px-3 py-2 text-sm text-[#143644] outline-none transition focus:border-[#0f8a79] focus:ring-2 focus:ring-[#0dbf9d]/20"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="proprio">Próprio</option>
                    <option value="terceiro">Terceiro</option>
                  </select>
                </label>

                {tipo == "terceiro" && (
                  <label
                    htmlFor="comissao"
                    className="relative flex flex-col gap-1.5"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#546c77]">
                      Comissão
                      <span className="ml-1 text-[#df3b43]">*</span>
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        name="comissao"
                        id="comissao"
                        className="w-full rounded-md border border-[#d0d8dc] bg-white px-3 py-2 pr-8 text-sm text-[#143644] outline-none transition focus:border-[#0f8a79] focus:ring-2 focus:ring-[#0dbf9d]/20"
                        placeholder="%"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#677d87]">
                        %
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </form>
          </TourPassoCard>
        </div>
      )}
      {step == 2 && (
        <div className="pointer-events-auto flex min-h-screen w-full items-center justify-center px-3 py-6 sm:px-4">
          <TourPassoCard
            stepLabel="Passo 2 de 3"
            stepNumber={2}
            totalSteps={3}
            title="Importar reservas"
            description="Use uma planilha de exemplo para visualizar o relatório. O histórico que você já tem entra junto."
            footer={
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={async (e) => {
                    e.currentTarget.disabled = true;
                    e.currentTarget.classList.add("cursor-wait");
                    e.currentTarget.classList.add("opacity-70");
                    const retornos: string[] = [];
                    await createDespesa();
                    const reservasImportadas = await Promise.all(
                      reservasParaImportar.map(async (imp) => {
                        const res = await createReserva(imp);
                        retornos.push(
                          `${res == 0 ? "Erro: " : "Adicionado: "}` +
                            `${imp.check_in.split("-")[2]}/${imp.check_in.split("-")[1]}/${imp.check_in.split("-")[0]} => ` +
                            `${imp.check_out.split("-")[2]}/${imp.check_out.split("-")[1]}/${imp.check_out.split("-")[0]}`,
                        );
                        return res;
                      }),
                    );
                    if (
                      reservasImportadas.length > 0 &&
                      reservasImportadas.every((id) => id > 0)
                    ) {
                      trackStepCompleted(2);
                    }
                    console.log(retornos.join("\n"));
                    setStep(3);
                  }}
                  className="w-full rounded-md bg-[#0d8d69] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0a7a5d]"
                >
                  Importar reservas de exemplo
                </button>

                <button
                  type="button"
                  onClick={() => {
                    trackOnboardingAbandoned(2);
                    navigate("/reservas");
                    window.localStorage.setItem("tour-relatorio", "false");
                    window.localStorage.setItem("tour", "0");
                    location.reload();
                  }}
                  className="text-sm font-medium text-[#526c76] underline underline-offset-2"
                >
                  Pular e lançar manualmente
                </button>
              </div>
            }
          >
            <div className="rounded-xl border border-[#dce4e7] bg-white p-3">
              <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[#526c76]">
                <span>Arquivo de exemplo</span>
                <span className="rounded-full bg-[#e7f8f2] px-2 py-0.5 text-[#0f8a79]">
                  Pronto
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-[#f4f7f8] p-3 text-sm text-[#143644]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#dfeef0] text-sm font-bold text-[#0f4a5a]">
                  📄
                </span>
                <div className="flex-1">
                  <p className="font-medium">Planilha de reservas de exemplo</p>
                  <p className="text-xs text-[#677d87]">
                    {nome || "Seu cadastro"} · próximo passo para o relatório
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-[#526c76]">
              {nome} cadastrado. <br />
              Falta um passo para o relatório ficar pronto.
            </p>
          </TourPassoCard>
        </div>
      )}
      {step == 3 && (
        <div className="pointer-events-auto flex min-h-screen w-full justify-center overflow-y-auto px-2 py-4 sm:px-4">
          <RelatorioCompletoTour
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
            onDataLoaded={handleTourReportDataLoaded}
          />
          <button
            className="bg-secondary text-primary top-10 right-5 px-2 py-1 rounded-md fixed h-min"
            onClick={() => {
              trackStepCompleted(3);
              setStep(4);
            }}
          >
            Avançar
          </button>
        </div>
      )}
      {step == 4 && (
        <div className="pointer-events-auto flex min-h-screen w-full justify-center overflow-y-auto px-3 py-6 sm:px-4 lg:px-6">
          <PromocaoRelatorio saas={dataToken.id} />
        </div>
      )}
    </div>
  );
}
