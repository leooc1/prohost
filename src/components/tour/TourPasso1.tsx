// Tour · Passo 1 · Cadastro da acomodação
// Renderiza apenas o painel (cartão) do modal. Coloque dentro do overlay/modal
// que o ProHost já usa no tour.

import { useState, type FormEvent } from "react";

// AJUSTAR: use os mesmos valores de status que o cadastro de acomodação do sistema espera.
export type StatusAcomodacao = "TERCEIRO" | "PROPRIO";

export type DadosAcomodacaoTour = {
  identificador: string;
  status: StatusAcomodacao;
  /** Percentual de comissão, de 0 a 100. */
  comissao: number;
};

type TourPasso1Props = {
  /** Caminho da logo (ex.: import logo from "@/assets/prohost-logo.png"). */
  logoSrc: string;
  /** Chamado com os dados válidos. Ligue aqui o cadastro que o tour atual já faz. */
  // onSubmit: (dados: DadosAcomodacaoTour) => void | Promise<void>;
  /** Volta para a tela de boas-vindas. */
  // onBack: () => void;
  /** Encerra o tour. */
  // onSkip: () => void;
  totalPassos?: number;
};

const PASSO_ATUAL = 1;

const inputBase =
  "h-[46px] w-full rounded-md border bg-white px-3 text-base text-[#0B2B3A] placeholder:text-[#8A9BA3] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#067A55]";

export function TourPasso1({
  logoSrc,
  // onSubmit,
  // onBack,
  // onSkip,
  totalPassos = 3,
}: TourPasso1Props) {
  const [identificador, setIdentificador] = useState("");
  const [status, setStatus] = useState<StatusAcomodacao>("TERCEIRO");
  const [comissao, setComissao] = useState("");
  const [erros, setErros] = useState<{ identificador?: string; comissao?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  /* async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nome = identificador.trim();
    const valorComissao = Number(comissao.replace(",", "."));
    const novosErros: typeof erros = {};

    if (!nome) novosErros.identificador = "Informe um nome para a acomodação.";
    if (comissao.trim() === "" || Number.isNaN(valorComissao)) {
      novosErros.comissao = "Informe a sua comissão.";
    } else if (valorComissao < 0 || valorComissao > 100) {
      novosErros.comissao = "A comissão deve ficar entre 0 e 100.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setErroEnvio(null);
    setEnviando(true);
    try {
      await onSubmit({ identificador: nome, status, comissao: valorComissao });
    } catch {
      setErroEnvio("Não foi possível cadastrar a acomodação. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  } */

  return (
    <div className="flex w-full max-w-[640px] flex-col overflow-hidden rounded-[20px] bg-white text-[#0B2B3A] shadow-xl">
      {/* Faixa de marca + progresso */}
      <div className="flex h-[76px] items-center justify-between bg-[#003146] px-5 text-white sm:px-8">
        <img src={logoSrc} alt="ProHost" className="h-[34px] w-auto" />
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-[#D5E0E5]">
            Passo {PASSO_ATUAL} de {totalPassos}
          </span>
          <div className="flex gap-[5px]" aria-hidden="true">
            {Array.from({ length: totalPassos }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 w-9 rounded-full ${
                  i < PASSO_ATUAL ? "bg-[#1DE9B6]" : "bg-[#2C5A6C]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <form
        // onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-3.5 px-5 pb-3 pt-6 sm:px-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#4A626D]">
          Cadastre uma acomodação
        </p>
        <h1 className="text-[26px] font-extrabold leading-[1.16] tracking-[-0.02em] sm:text-[30px]">
          Vamos gerar seu <span className="text-[#1DE9B6]">primeiro relatório</span>
        </h1>
        <p className="text-base leading-normal">
          Comece por uma acomodação que você administra. São só três campos para o relatório
          sair com o nome e a comissão certos.
        </p>

        <div className="mt-1 flex flex-col gap-1.5">
          <label htmlFor="tour-identificador" className="text-sm font-semibold">
            Identificador <span className="text-[#C62828]">*</span>
          </label>
          <input
            id="tour-identificador"
            type="text"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            placeholder="Ex: Apartamento Guarujá"
            aria-invalid={Boolean(erros.identificador)}
            aria-describedby={erros.identificador ? "tour-identificador-erro" : undefined}
            className={`${inputBase} ${
              erros.identificador ? "border-[#C62828]" : "border-[#B8C7CF]"
            }`}
          />
          {erros.identificador && (
            <p id="tour-identificador-erro" className="text-[13px] text-[#C62828]">
              {erros.identificador}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tour-status" className="text-sm font-semibold">
              Status <span className="text-[#C62828]">*</span>
            </label>
            <select
              id="tour-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusAcomodacao)}
              className={`${inputBase} border-[#B8C7CF]`}
            >
              <option value="TERCEIRO">Terceiro</option>
              <option value="PROPRIO">Próprio</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tour-comissao" className="text-sm font-semibold">
              Comissão <span className="text-[#C62828]">*</span>
            </label>
            <div className="relative">
              <input
                id="tour-comissao"
                type="text"
                inputMode="decimal"
                value={comissao}
                onChange={(e) => setComissao(e.target.value)}
                placeholder="Ex: 20"
                aria-invalid={Boolean(erros.comissao)}
                aria-describedby={erros.comissao ? "tour-comissao-erro" : undefined}
                className={`${inputBase} pr-9 ${
                  erros.comissao ? "border-[#C62828]" : "border-[#B8C7CF]"
                }`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base font-semibold text-[#4A626D]">
                %
              </span>
            </div>
            {erros.comissao && (
              <p id="tour-comissao-erro" className="text-[13px] text-[#C62828]">
                {erros.comissao}
              </p>
            )}
          </div>
        </div>

        <p className="text-[13px] leading-[1.45] text-[#4A626D]">
          Você completa o restante do cadastro depois, quando quiser.
        </p>

        {erroEnvio && (
          <p role="alert" className="text-[13px] text-[#C62828]">
            {erroEnvio}
          </p>
        )}

        <div className="mt-4 flex flex-col">
          <button
            type="submit"
            disabled={enviando}
            className="h-[52px] rounded-md bg-[#067A55] text-[17px] font-bold text-white transition-colors hover:bg-[#056546] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#067A55] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Cadastrando…" : "Cadastrar e continuar →"}
          </button>
          <div className="flex items-center justify-between">
            <button
              type="button"
              // onClick={onBack}
              className="h-11 pr-2 text-sm font-semibold text-[#0B2B3A] hover:underline"
            >
              ← Voltar
            </button>
            <button
              type="button"
              // onClick={onSkip}
              className="h-11 pl-2 text-sm text-[#5E737D] transition-colors hover:text-[#0B2B3A]"
            >
              Pular tour
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
