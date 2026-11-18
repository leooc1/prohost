import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import posthog from "../posthog";

type SubscriptionCycle = "MONTHLY" | "YEARLY";

interface CardForm {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

interface SubscriptionResponse {
  id?: unknown;
  token?: unknown;
  message?: string | string[];
  providerStatus?: number;
  errors?: { code?: string; description?: string }[];
}

interface SubscriptionQuote {
  value: number;
  planAccommodations: number;
  freeDays: number;
  nextDueDate: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value: string) {
  const [, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}`;
}

export default function AssinaturaCartao() {
  const apiURL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const saasId = Number(params.get("saasId"));
  const accommodations = Number(params.get("qtdAcomodacao"));
  const cycleParam = params.get("cycle")?.toUpperCase();
  const cycle: SubscriptionCycle | null =
    cycleParam === "MONTHLY" || cycleParam === "YEARLY" ? cycleParam : null;
  const validCheckout =
    Number.isInteger(saasId) &&
    saasId > 0 &&
    Number.isInteger(accommodations) &&
    accommodations >= 1 &&
    accommodations <= 30 &&
    Boolean(cycle);

  const [cardForm, setCardForm] = useState<CardForm>({
    holderName: "",
    number: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [quote, setQuote] = useState<SubscriptionQuote | null>(null);
  const [loginToken, setLoginToken] = useState("");
  const openedEventSent = useRef(false);

  useEffect(() => {
    if (!validCheckout || !cycle) return;

    if (!openedEventSent.current) {
      posthog.capture("credit_card_checkout_opened", {
        cycle,
        qtdAcomodacao: accommodations,
      });
      openedEventSent.current = true;
    }

    let active = true;
    const query = new URLSearchParams({
      qtdAcomodacao: String(accommodations),
      cycle,
    });
    fetch(
      `${apiURL}/assinatura/credit-card/subscription/quote?${query.toString()}`,
    )
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            typeof result.message === "string"
              ? result.message
              : "Não foi possível carregar o plano.",
          );
        }
        return result as SubscriptionQuote;
      })
      .then((result) => {
        if (
          active &&
          Number.isFinite(result.value) &&
          typeof result.nextDueDate === "string"
        ) {
          setQuote(result);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar o plano.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [accommodations, apiURL, cycle, validCheckout]);

  useEffect(() => {
    if (!success || !loginToken) return;

    const redirectTimer = window.setTimeout(() => {
      window.localStorage.setItem("ph_token_acc", loginToken);
      window.localStorage.setItem("tour-relatorio", "true");
      window.localStorage.setItem("tour", "true");
      window.localStorage.setItem("ph-checkout-start-tour", "true");
      window.location.assign("/dashboard");
    }, 1200);

    return () => window.clearTimeout(redirectTimer);
  }, [loginToken, success]);

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validCheckout || !cycle) {
      setError("O link de pagamento está incompleto ou inválido.");
      return;
    }

    const cardNumber = cardForm.number.replace(/\D/g, "");
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      setError("Confira o número do cartão.");
      return;
    }
    if (
      !/^\d{2}$/.test(cardForm.expiryMonth) ||
      Number(cardForm.expiryMonth) < 1 ||
      Number(cardForm.expiryMonth) > 12 ||
      !/^\d{4}$/.test(cardForm.expiryYear)
    ) {
      setError("Confira a validade do cartão.");
      return;
    }
    if (!/^\d{3,4}$/.test(cardForm.ccv)) {
      setError("Confira o código de segurança do cartão.");
      return;
    }

    if (!quote) {
      setError("Aguarde o carregamento do plano.");
      return;
    }

    posthog.capture("credit_card_checkout_submitted", {
      cycle,
      qtdAcomodacao: accommodations,
    });
    setSubmitting(true);
    try {
      const response = await fetch(
        `${apiURL}/assinatura/credit-card/subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: saasId,
            qtdAcomodacao: accommodations,
            cycle,
            cardForm: {
              ...cardForm,
              holderName: cardForm.holderName.trim(),
              number: cardNumber,
            },
          }),
        },
      );
      const responseText = await response.text();
      let result: SubscriptionResponse;
      try {
        result = JSON.parse(responseText) as SubscriptionResponse;
      } catch {
        throw new Error("O servidor retornou uma resposta inválida.");
      }

      if (!response.ok) {
        if (result.providerStatus && result.errors?.length) {
          posthog.capture("credit_card_declined", {
            providerStatus: result.providerStatus,
            errorCodes: result.errors.map((item) => item.code).filter(Boolean),
            cycle,
            qtdAcomodacao: accommodations,
          });
        }
        const providerErrors = Array.isArray(result.errors)
          ? result.errors
              .map((item) => item.description || item.code)
              .filter(Boolean)
              .join(" ")
          : "";
        const message = Array.isArray(result.message)
          ? result.message.join(" ")
          : result.message;
        throw new Error(
          providerErrors ||
            message ||
            "Não foi possível criar a assinatura. Tente novamente.",
        );
      }

      if (typeof result.id !== "string") {
        throw new Error("O servidor não retornou o ID da assinatura.");
      }
      if (typeof result.token !== "string") {
        throw new Error("O servidor não retornou o token de acesso.");
      }
      posthog.capture("credit_card_subscription_created", {
        cycle,
        qtdAcomodacao: accommodations,
        value: quote.value,
      });
      setLoginToken(result.token);
      setSuccess(true);
      setCardForm({
        holderName: "",
        number: "",
        expiryMonth: "",
        expiryYear: "",
        ccv: "",
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro de comunicação. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!validCheckout) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          Link de pagamento inválido. Confira o SaaS, a quantidade de
          acomodações e o ciclo.
        </p>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
        <p className="rounded-lg bg-emerald-50 p-4 text-emerald-800">
          Assinatura criada. Redirecionando você para o tour...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
      <form
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow"
        onSubmit={submitPayment}
      >
        <h1 className="text-xl font-semibold text-[#0E3447]">
          Dados do cartão
        </h1>
        {quote ? (
          <section className="space-y-1 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
            <p className="font-semibold text-[#0E3447]">
              Plano para até {quote.planAccommodations} acomodações ·{" "}
              {cycle === "YEARLY" ? "Anual" : "Mensal"}
            </p>
            <p className="text-xl font-bold text-[#0E3447]">
              {formatCurrency(quote.value)}
              {cycle === "MONTHLY" ? " / mês" : " / ano"}
            </p>
            <p>
              {quote.freeDays} dias grátis. A primeira cobrança é em{" "}
              {formatDate(quote.nextDueDate)}. Cancele quando quiser.
            </p>
          </section>
        ) : (
          <p role="status" className="text-sm text-zinc-600">
            Carregando plano e valor...
          </p>
        )}

        <label className="block text-sm font-medium text-zinc-700">
          Nome impresso no cartão
          <input
            required
            autoComplete="cc-name"
            className="ph-no-capture mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={cardForm.holderName}
            onChange={(event) =>
              setCardForm({ ...cardForm, holderName: event.target.value })
            }
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Número do cartão
          <input
            required
            inputMode="numeric"
            autoComplete="cc-number"
            className="ph-no-capture mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            maxLength={23}
            value={cardForm.number}
            onChange={(event) =>
              setCardForm({ ...cardForm, number: event.target.value })
            }
            placeholder="0000 0000 0000 0000"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-zinc-700">
            Mês de validade
            <input
              required
              inputMode="numeric"
              autoComplete="cc-exp-month"
              className="ph-no-capture mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
              maxLength={2}
              value={cardForm.expiryMonth}
              onChange={(event) =>
                setCardForm({
                  ...cardForm,
                  expiryMonth: event.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="MM"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Ano de validade
            <input
              required
              inputMode="numeric"
              autoComplete="cc-exp-year"
              className="ph-no-capture mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
              maxLength={4}
              value={cardForm.expiryYear}
              onChange={(event) =>
                setCardForm({
                  ...cardForm,
                  expiryYear: event.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="AAAA"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-zinc-700">
          Código de segurança
          <input
            required
            inputMode="numeric"
            autoComplete="cc-csc"
            className="ph-no-capture mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            maxLength={4}
            value={cardForm.ccv}
            onChange={(event) =>
              setCardForm({
                ...cardForm,
                ccv: event.target.value.replace(/\D/g, ""),
              })
            }
            placeholder="CVV"
          />
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !quote}
          className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Processando..." : "Continuar"}
        </button>
      </form>
    </main>
  );
}
