// Tour · Passo 0 · Boas-vindas
// Renderiza apenas o painel (cartão) do modal. Coloque dentro do overlay/modal
// que o ProHost já usa no tour.

import type { ReactNode } from "react";

type TourBoasVindasProps = {
  /** Caminho da logo (ex.: import logo from "@/assets/prohost-logo.png"). */
  logoSrc: string;
  /** Avança para o Passo 1. */
  onStart: () => void;
  /** Encerra o tour. */
  onSkip: () => void;
  guidedSetup?: ReactNode;
};

const PASSOS = [
  { titulo: "Cadastre uma acomodação", descricao: "Só o nome e a sua comissão." },
  { titulo: "Importe reservas de exemplo", descricao: "Um clique, sem digitar nada." },
  { titulo: "Emita o relatório", descricao: "Pronto para enviar ao proprietário." },
];

export function TourBoasVindas({
  logoSrc,
  onStart,
  onSkip,
  guidedSetup,
}: TourBoasVindasProps) {
  return (
    <div className="flex w-full max-w-[640px] flex-col overflow-hidden rounded-[20px] bg-white text-[#0B2B3A] shadow-xl">
      {/* Faixa de marca */}
      <div className="flex h-[168px] flex-col items-center justify-center gap-2.5 bg-[#003146] px-6 text-white">
        <img src={logoSrc} alt="ProHost" className="h-16 w-auto" />
        <p className="text-center text-[15px] text-[#D5E0E5]">
          Simplificando sua gestão e aumentando seus resultados
        </p>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-3.5 px-5 pb-3 pt-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#4A626D]">
          Bem-vindo ao ProHost
        </p>
        <h1 className="text-sm font-extrabold leading-[1.16] tracking-[-0.02em] sm:text-xl">
          Sua gestão, do jeito que o{" "}
          <span className="text-[#1DE9B6]">proprietário confia</span>
        </h1>
        <p className="sm:text-base text-sm leading-normal">
          Reservas, receitas, despesas e repasses em um só lugar, transformados em números
          claros para você decidir e prestar contas.
        </p>

        <ol className="mt-1 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {PASSOS.map((passo, i) => (
            <li
              key={passo.titulo}
              className="flex flex-col gap-1.5 rounded-lg border border-[#C9D3D8] p-3"
            >
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#003347] text-[13px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm font-bold">{passo.titulo}</span>
              <span className="text-[12.5px] leading-[1.4] text-[#4A626D]">
                {passo.descricao}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-col">
          <button
            type="button"
            onClick={onStart}
            className="h-[52px] rounded-md bg-[#067A55] text-[17px] font-bold text-white transition-colors hover:bg-[#056546] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#067A55]"
          >
            Começar o tour →
          </button>
          {guidedSetup}
          <button
            type="button"
            onClick={onSkip}
            className="h-11 text-sm text-[#5E737D] transition-colors hover:text-[#0B2B3A]"
          >
            Pular tour
          </button>
        </div>
      </div>
    </div>
  );
}
