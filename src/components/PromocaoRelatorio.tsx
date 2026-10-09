import { useState } from "react";
import { plans } from "./MelhorarPlanos";

const promocao = {
  percentualDesconto: 70,
  mesesComDesconto: 3,
  mesRelatorio: "outubro",
  competenciaRelatorio: "Out.2026",
  quantidadePaginas: 9,
  taxaOcupacao: 95,
  faturamento: 12750,
  repasse: 9900,
  horaEnvio: "09:12",
  horaResposta: "09:15",
  quantidadeAcomodacoesSelecionada: 1,
  mesInicioPrecoCheio: 4,
};

const proprietario = {
  nome: "Marcos",
  acomodacao: "Apto Guarujá",
  resposta: "Que resultado! Obrigado pelo relatório, ficou tudo claro.",
};

const formatarMoeda = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface PromocaoRelatorioProps {
  saas: number;
}

export default function PromocaoRelatorio(props: PromocaoRelatorioProps) {
  const apiURL = import.meta.env.VITE_API_URL;

  const [quantidadeAcomodacoes, setQuantidadeAcomodacoes] = useState(
    promocao.quantidadeAcomodacoesSelecionada,
  );
  const planoSelecionado =
    plans.find((plan) => plan.accommodations === quantidadeAcomodacoes) ??
    plans[0];
  const valorMensal = planoSelecionado.monthlyPrice;
  const valorDesconto = (valorMensal * promocao.percentualDesconto) / 100;
  const valorPromocional = valorMensal - valorDesconto;

  return (
    <div className="w-full min-w-0 max-w-[1220px] overflow-hidden rounded-[18px] border border-[#dfe5e7] bg-[#f3f5f4] shadow-[0_20px_50px_rgba(15,29,36,0.12)]">
      <div className="flex flex-col gap-3 bg-[#003347] px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-black leading-none tracking-[-0.05em] sm:text-[28px]">
            prohost
          </span>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 bg-[#eef1f0] p-3 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
        <div className="min-w-0 space-y-5">
          <div className="min-w-0 rounded-[18px] border border-[#dfe5e7] bg-[#f4f6f5] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] sm:p-4">
            <h2 className="max-w-[540px] text-[26px] font-black leading-[1.04] tracking-[-0.06em] text-[#0b2d3b] sm:text-[34px] md:text-[46px]">
              Gostou do relatório? <br />
              Assine com{" "}
              <span className="text-[#0f4a5a]">
                {promocao.percentualDesconto}%
              </span>{" "}
              de desconto
            </h2>

            <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-[#4d646d]">
              Em 3 passos você gerou o relatório que seus proprietários
              gostariam de receber todo mês. Assine agora e garanta o desconto
              de {promocao.percentualDesconto}% nos {promocao.mesesComDesconto}{" "}
              primeiros meses.
            </p>

            <div className="mt-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#556d76]">
                Prestação de contas como o proprietário recebe
              </p>

              <div className="w-full max-w-[560px] overflow-hidden rounded-[12px] border border-[#dfe5e7] bg-[#f1f1ef] p-0 shadow-[0_6px_18px_rgba(15,26,30,0.08)]">
                <div className="flex items-center gap-3 bg-[#003347] px-4 py-3 text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f3f5] text-[18px] font-bold text-[#0b2d3b]">
                    M
                  </div>
                  <div className="leading-none">
                    <p className="text-[18px] font-bold tracking-[-0.04em]">
                      {proprietario.nome}
                    </p>
                    <p className="mt-1 text-[12px] text-[#d7edf1]">
                      Proprietário · {proprietario.acomodacao}
                    </p>
                  </div>
                </div>

                <div className="bg-[#e9e9e6] px-4 pb-3 pt-4">
                  <div className="rounded-[10px] border border-[#d4e6d7] bg-[#dff0dc] p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#d53f2e] text-[15px] font-black text-white shadow-sm">
                        PDF
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[16px] font-bold tracking-[-0.03em] text-[#0d2f3d]">
                          Relatório{" "}
                          {proprietario.acomodacao.replace("Apto ", "")}{" "}
                          {promocao.competenciaRelatorio}.pdf
                        </p>
                        <p className="mt-1 text-[12px] text-[#5d7179]">
                          {promocao.quantidadePaginas} páginas · PDF
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pl-2 text-[13px] leading-6 text-[#1b3a4c]">
                      <p>
                        Oi, {proprietario.nome}! Segue o relatório de{" "}
                        {promocao.mesRelatorio}:
                      </p>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        <li>Taxa de ocupação: {promocao.taxaOcupacao}%</li>
                        <li>
                          Faturamento: R$ {formatarMoeda(promocao.faturamento)}
                        </li>
                        <li>Repasse: R$ {formatarMoeda(promocao.repasse)}</li>
                      </ul>
                    </div>

                    <div className="mt-3 text-right text-[10px] font-semibold tracking-[0.12em] text-[#5a6d76]">
                      {promocao.horaEnvio}
                    </div>
                  </div>

                  <div className="mt-4 max-w-[90%] rounded-[12px] border border-[#dadfe1] bg-[#f3f3f2] px-4 py-3 text-[16px] leading-6 text-[#1e3b4a]">
                    <p>{proprietario.resposta}</p>
                    <div className="mt-2 text-right text-[10px] font-semibold tracking-[0.12em] text-[#5d7077]">
                      {promocao.horaResposta}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="min-w-0 rounded-[18px] border border-[#dfe5e7] bg-[#f4f6f5] p-3 shadow-[0_10px_30px_rgba(11,21,30,0.06)] sm:p-4">
          <h3 className="text-[24px] font-bold tracking-[-0.05em] text-[#0b2d3b] sm:text-[28px]">
            Resumo da sua assinatura
          </h3>
          <p className="mt-2 text-[13px] text-[#546d77]">
            Acomodações que você administra
          </p>

          <select
            value={quantidadeAcomodacoes}
            onChange={(event) =>
              setQuantidadeAcomodacoes(Number(event.target.value))
            }
            className="mt-3 w-full rounded-[10px] border border-[#cfd9dd] bg-white px-3 py-3 text-[16px] text-[#0d2f3d] outline-none ring-0"
          >
            {plans.map((plan) => (
              <option key={plan.accommodations} value={plan.accommodations}>
                Até {plan.accommodations} acomoda
                {plan.accommodations === 1 ? "ção" : "ções"}
              </option>
            ))}
          </select>

          <div className="mt-5 space-y-3 border-b border-[#dfe5e7] pb-4 text-[15px] text-[#4e6770]">
            <div className="flex items-start justify-between gap-3">
              <span>Plano mensal</span>
              <span className="whitespace-nowrap font-medium text-[#0b2d3b]">
                R$ {formatarMoeda(valorMensal)}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                Desconto de {promocao.percentualDesconto}% ·{" "}
                {promocao.mesesComDesconto} primeiros meses
              </span>
              <span className="whitespace-nowrap font-medium text-[#0a8b73]">
                - R$ {formatarMoeda(valorDesconto)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <span className="text-[16px] font-medium text-[#4d646d]">
              Você paga
            </span>
            <div className="flex min-w-0 flex-wrap items-end gap-x-1 gap-y-1">
              <span className="text-[18px] font-black tracking-[-0.06em] text-[#0b2d3b] sm:text-[20px]">
                R$
              </span>
              <span className="whitespace-nowrap text-[clamp(2rem,11vw,3.375rem)] font-black leading-none tracking-[-0.08em] text-[#0b2d3b] sm:text-[54px]">
                {formatarMoeda(valorPromocional)}
              </span>
              <span className="whitespace-nowrap pb-1 text-[16px] font-medium text-[#4d646d] sm:pb-2 sm:text-[18px]">
                / mês
              </span>
            </div>
          </div>

          <p className="mt-4 text-[14px] leading-6 text-[#4d646d]">
            A partir do {promocao.mesInicioPrecoCheio}º mês, R${" "}
            {formatarMoeda(valorMensal)}/mês. Esta condição aparece uma única
            vez, ao final do tour, e não volta depois que o contador zerar.
          </p>

          <button
            type="button"
            className="mt-5 w-full rounded-[12px] bg-[#0d8d69] px-4 py-4 text-[16px] font-black tracking-[-0.04em] text-white transition hover:bg-[#0a7a5d]"
            onClick={async () => {
              const result = await fetch(`${apiURL}/assinatura/pos`, {
                method: "POST",
                body: JSON.stringify({
                  saas: props.saas,
                  value: valorDesconto,
                  qtdAcomodacao: quantidadeAcomodacoes,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }).then((data) => data.json());
              console.log(result);
              if (result.invoiceUrl) {
                window.localStorage.setItem("tour", "false");
                window.open(result.invoiceUrl, "_blank");
                window.location.reload();
              }
            }}
          >
            Garantir meus {promocao.percentualDesconto}% de desconto →
          </button>

          <button
            type="button"
            className="mt-3 w-full rounded-[12px] border border-[#d4dfe3] bg-white px-4 py-3 text-[15px] font-medium text-[#49616b]"
            onClick={() => {
              window.localStorage.setItem("tour", "false");
              window.location.reload();
            }}
          >
            Deixar para depois
          </button>
        </aside>
      </div>
    </div>
  );
}
