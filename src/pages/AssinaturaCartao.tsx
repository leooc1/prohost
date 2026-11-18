import { FormEvent, useState } from "react";
import { useLocation } from "react-router-dom";

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
  message?: string | string[];
  errors?: { code?: string; description?: string }[];
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
          Assinatura criada. A primeira cobrança está prevista para daqui a 8
          dias.
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

        <label className="block text-sm font-medium text-zinc-700">
          Nome impresso no cartão
          <input
            required
            autoComplete="cc-name"
            value={cardForm.holderName}
            onChange={(event) =>
              setCardForm({ ...cardForm, holderName: event.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Número do cartão
          <input
            required
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={23}
            value={cardForm.number}
            onChange={(event) =>
              setCardForm({ ...cardForm, number: event.target.value })
            }
            placeholder="0000 0000 0000 0000"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-zinc-700">
            Mês de validade
            <input
              required
              inputMode="numeric"
              autoComplete="cc-exp-month"
              maxLength={2}
              value={cardForm.expiryMonth}
              onChange={(event) =>
                setCardForm({
                  ...cardForm,
                  expiryMonth: event.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="MM"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Ano de validade
            <input
              required
              inputMode="numeric"
              autoComplete="cc-exp-year"
              maxLength={4}
              value={cardForm.expiryYear}
              onChange={(event) =>
                setCardForm({
                  ...cardForm,
                  expiryYear: event.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="AAAA"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-zinc-700">
          Código de segurança
          <input
            required
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            value={cardForm.ccv}
            onChange={(event) =>
              setCardForm({
                ...cardForm,
                ccv: event.target.value.replace(/\D/g, ""),
              })
            }
            placeholder="CVV"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
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
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Processando..." : "Continuar"}
        </button>
      </form>
    </main>
  );
}
