import posthog from "../posthog";

type OnboardingGuiadoCtaProps = {
  qtdAcomodacoes: number;
  origem: "boas_vindas" | "dashboard";
  variant?: "primary" | "secondary";
};

function getFaixaAcomodacoes(qtdAcomodacoes: number) {
  if (qtdAcomodacoes <= 20) return "10-20";
  if (qtdAcomodacoes <= 30) return "21-30";
  return "31+";
}

export default function OnboardingGuiadoCta({
  qtdAcomodacoes,
  origem,
  variant = "primary",
}: OnboardingGuiadoCtaProps) {
  const whatsappUrl = `https://wa.me/5521999164476?text=${encodeURIComponent(
    "Olá! Tenho interesse na configuração guiada do ProHost.",
  )}`;
  const className = `inline-flex max-w-full min-h-11 items-center justify-center whitespace-normal rounded-md border-2 px-4 py-2 text-center text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#067A55] ${
    variant === "secondary"
      ? "border-[#067A55] bg-white text-[#067A55] hover:bg-[#effaf6]"
      : "border-[#067A55] bg-[#067A55] text-white hover:bg-[#056546]"
  }`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        posthog.capture("onboarding_guiado_clicado", {
          faixa_acomodacoes: getFaixaAcomodacoes(qtdAcomodacoes),
          qtd_acomodacoes: qtdAcomodacoes,
          origem,
        });
      }}
    >
      Prefere que a gente configure com você? Fale pelo WhatsApp
    </a>
  );
}
