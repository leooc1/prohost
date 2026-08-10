import { useContext, useEffect, useState } from "react";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import { InputMask } from "@react-input/mask";
import { intervalToDuration } from "date-fns";
import Notify from "./notify/Notify";

interface Plan {
  accommodations: number;
  monthlyPrice: number;
}

const plans: Plan[] = [
  { accommodations: 1, monthlyPrice: 24.9 },
  { accommodations: 3, monthlyPrice: 39.9 },
  { accommodations: 5, monthlyPrice: 54.9 },
  { accommodations: 10, monthlyPrice: 79.9 },
  { accommodations: 20, monthlyPrice: 129.9 },
  { accommodations: 30, monthlyPrice: 179.9 },
];

const cupons = [
  {
    name: "CUPOMPH10",
    discount: 0.1,
    until: new Date("2026-04-25"),
  },
  {
    name: "3R10",
    discount: 0.1,
    until: new Date("2026-05-23"),
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function MelhorarPlanos({ upgrade }: { upgrade: boolean }) {
  const apiURL = import.meta.env.VITE_API_URL;
  const { dataToken } = useContext(SideBarContext);
  const [isAnnual, setIsAnnual] = useState(false);
  const [wait, setWait] = useState(false);
  const [selectedAccommodations, setSelectedAccommodations] = useState([1]);
  const [acomodacoesAtivas, setAcomodacoesAtivas] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [info, setInfo] = useState<{
    qtd_acomodacao: number;
    valor_mes: string;
    valor_ano: string;
    cus: string;
    trial_end: string;
  } | null>(null);

  // Estados para PIX
  const [copypastepix, setCopypastepix] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const initialExpireDate = localStorage.getItem("expireDate") || "";
  const [expireDate, setExpireDate] = useState(initialExpireDate);
  const [qr, setQr] = useState("");
  const [notify, setNotify] = useState({ type: 1, text: "" });
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [pixLoading, setPixLoading] = useState(false);

  const calculateExpirationTime = () => {
    if (!expireDate) return { hours: 0, minutes: 0, seconds: 0 };
    const expiry = new Date(expireDate);
    const now = new Date();
    const diff = intervalToDuration({ start: now, end: expiry });
    return diff;
  };
  const [expirationTime, setExpirationTime] = useState(
    calculateExpirationTime(),
  );

  const getCurrentPlan = () => {
    return (
      plans.find((plan) => plan.accommodations === selectedAccommodations[0]) ||
      plans[0]
    );
  };

  const calculatePrice = (plan: Plan) => {
    const monthlyPrice = plan.monthlyPrice;
    if (isAnnual) {
      const annualPrice = monthlyPrice * 10;
      const savings = monthlyPrice * 12 - annualPrice;
      return {
        monthly: (annualPrice / 10).toFixed(2),
        total: annualPrice.toFixed(2),
        savings: savings.toFixed(2),
        antigo: (0).toFixed(2),
      };
    }
    return {
      monthly: monthlyPrice.toFixed(2),
      total: (monthlyPrice * 10).toFixed(2),
      savings: (monthlyPrice * 12 - monthlyPrice * 10).toFixed(2),
      antigo: (0).toFixed(2),
    };
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const closest = plans.reduce((prev, curr) => {
      return Math.abs(curr.accommodations - value) <
        Math.abs(prev.accommodations - value)
        ? curr
        : prev;
    });
    setSelectedAccommodations([closest.accommodations]);
  };

  async function updateAssinatura(updateBody: {
    saas: number;
    plano: {
      qtd_acomodacao: number;
      permicao: number;
      valor_mes: number;
      valor_ano: number;
    };
    assinatura: {
      assinatura: string;
      pagamento: string;
      forma_pagamento: string;
      proxima_cobranca: string;
    };
  }) {
    await fetch(`${apiURL}/plano/upgrade`, {
      method: "POST",
      body: JSON.stringify(updateBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setWait(false);
        if (data.length > 1 && data[1] == 1) location.reload();
        return data;
      })
      .catch((err) => console.log(err));
  }

  async function pagamentoCartao(
    pay: string,
    cartao: {
      card: "";
      date: "";
      cvc: "";
    },
  ) {
    if (!dataToken || !dataToken?.id) return;
    await fetch(`${apiURL}/assinatura/credit-card/${pay}`, {
      method: "POST",
      body: JSON.stringify({
        cardForm: {
          holderName: dataToken.nome,
          number: cartao.card,
          expiryMonth: cartao.date.split(" / ")[0],
          expiryYear: cartao.date.split(" / ")[1],
          ccv: cartao.cvc,
        },
        saas: dataToken?.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(async (data) => {
        if (data.id) {
          if (upgrade) {
            await updateAssinatura({
              saas: dataToken?.id,
              plano: {
                qtd_acomodacao: selectedAccommodations[0],
                permicao: 1,
                valor_mes: isAnnual
                  ? Number((Number(price.total) / 10).toFixed(2))
                  : Number(price.monthly),
                valor_ano: Number(price.total),
              },
              assinatura: {
                assinatura: data.subscription,
                pagamento: data.id,
                forma_pagamento: data.billingType,
                proxima_cobranca: data.dueDate,
              },
            });
          } else {
            location.reload();
          }
        } else {
          // Erro retornado pela API (ex: cartão recusado)
          setWait(false);
          setNotify({
            type: 2,
            text:
              data.error || "Pagamento recusado. Verifique os dados do cartão.",
          });
          setShowNotify(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setWait(false);
        setNotify({ type: 2, text: "Erro de comunicação. Tente novamente." });
        setShowNotify(true);
      });
  }

  async function gerarPagamento(cartao?: any) {
    if (!dataToken || !dataToken?.id) return;
    await fetch(`${apiURL}/assinatura/upgrade/`, {
      method: "POST",
      body: JSON.stringify({
        saas: Number(dataToken?.id),
        price: isAnnual
          ? upgrade
            ? ((Number(price.total) - Number(info?.valor_ano)) / 12) *
              (mesesAteDataFutura(info?.trial_end || "") > 0
                ? mesesAteDataFutura(info?.trial_end || "")
                : 1)
            : Number(info?.valor_ano)
          : Number(price.monthly),
        cycle: isAnnual ? "YEARLY" : "MONTHLY",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.pagamento) {
          pagamentoCartao(data.pagamento, cartao);
        }
      })
      .catch((err) => {
        console.log(err);
        setWait(false);
        setNotify({
          type: 2,
          text: "Erro ao gerar cobrança. Tente novamente.",
        });
        setShowNotify(true);
      });
  }

  async function renovacaoAssinatura(cartao?: any) {
    let getPlano = null;
    {
      await fetch(
        `${apiURL}/plano/${selectedAccommodations[0]}/${!isAnnual ? price.monthly : price.total}/${isAnnual ? "YEARLY" : "MONTHLY"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
        .then((data) => data.json())
        .then(async (data) => {
          if (data.length > 0) {
            getPlano = data[0];
            getPlano = {
              ...getPlano,
              valor_ano: Number(getPlano.valor_ano),
              valor_mes: Number(getPlano.valor_mes),
              qtd_acomodacao: Number(getPlano.qtd_acomodacao),
            };
          } else {
            await fetch(`${apiURL}/plano/`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                qtd_acomodacao: Number(selectedAccommodations[0]),
                permicao: 1,
                valor_mes: Number((Number(price.total) / 10).toFixed(2)),
                valor_ano: Number(price.total),
              }),
            })
              .then((data) => data.json())
              .then((data) => {
                getPlano = data;
                getPlano = {
                  ...getPlano,
                  valor_ano: Number(getPlano.valor_ano),
                  valor_mes: Number(getPlano.valor_mes),
                  qtd_acomodacao: Number(getPlano.qtd_acomodacao),
                };
              })
              .catch((err) => console.log(err));
          }
        });
    }
    if (!dataToken || !dataToken?.id) return;
    await fetch(`${apiURL}/assinatura/renovacao/`, {
      method: "POST",
      body: JSON.stringify({
        saas: Number(dataToken?.id),
        plano: getPlano,
        cycle: isAnnual ? "YEARLY" : "MONTHLY",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.pagamento) {
          pagamentoCartao(data.pagamento, cartao);
        }
      })
      .catch((err) => console.log(err));
  }

  // Função para gerar PIX
  async function gerarPix() {
    setPixLoading(true);
    try {
      console.log("Iniciando geração de PIX...");

      const paymentResponse = await fetch(`${apiURL}/assinatura/upgrade/`, {
        method: "POST",
        body: JSON.stringify({
          saas: Number(dataToken?.id),
          price: isAnnual
            ? upgrade
              ? ((Number(price.total) - Number(info?.valor_ano)) / 12) *
                (mesesAteDataFutura(info?.trial_end || "") > 0
                  ? mesesAteDataFutura(info?.trial_end || "")
                  : 1)
              : Number(info?.valor_ano)
            : Number(price.monthly),
          cycle: isAnnual ? "YEARLY" : "MONTHLY",
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((data) => data.json())
        .then((data) => {
          return data;
        })
        .catch((err) => console.log(err));
      const paymentData = await paymentResponse;
      console.log("Payment Data:", paymentData);
      console.log("Payment ID recebido:", paymentData.pagamento);
      console.log(
        "Payment ID é válido:",
        paymentData.pagamento && paymentData.pagamento.length > 0,
      );

      if (paymentData.pagamento) {
        // console.log('Payment ID:', paymentData.pagamento);

        // 2. Gerar QR Code PIX diretamente com o paymentId retornado
        const qrResponse = await fetch(
          `${apiURL}/assinatura/pix/${paymentData.pagamento}`,
        );
        const qrData = await qrResponse.json();
        // console.log('QR Data:', qrData);

        if (qrData.success) {
          console.log("QR Code gerado com sucesso");
          setQr(qrData.encodedImage);
          localStorage.setItem("expireDate", qrData.expirationDate);
          setExpireDate(qrData.expirationDate);
          setCopypastepix(qrData.payload);
          setPaymentId(paymentData.pagamento);
          setShowPixPayment(true);
        } else {
          console.error("Erro ao gerar QR Code:", qrData);
          setNotify({
            type: 2,
            text: "Erro ao gerar QR Code PIX. Tente novamente.",
          });
          setShowNotify(true);
        }
      } else {
        console.error("Nenhum payment ID recebido:", paymentData);
        setNotify({
          type: 2,
          text: "Erro ao gerar pagamento. Tente novamente.",
        });
        setShowNotify(true);
      }
    } catch (err) {
      console.error("Erro na geração de PIX:", err);
      setNotify({ type: 2, text: "Erro ao gerar PIX. Tente novamente." });
      setShowNotify(true);
    } finally {
      setPixLoading(false);
    }
  }

  // Polling para verificar status do pagamento PIX
  useEffect(() => {
    if (!paymentId || !showPixPayment) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `${apiURL}/assinatura/status/${paymentId}`,
        );
        const data = await response.json();

        if (data.status === "CONFIRMED") {
          setNotify({
            type: 1,
            text: "Pagamento confirmado! Atualizando plano...",
          });
          setShowNotify(true);

          // Atualizar assinatura após confirmação
          if (upgrade) {
            await updateAssinatura({
              saas: dataToken?.id,
              plano: {
                qtd_acomodacao: selectedAccommodations[0],
                permicao: 1,
                valor_mes: Number(price.monthly),
                valor_ano: Number(price.total),
              },
              assinatura: {
                assinatura: data.subscription || paymentId,
                pagamento: paymentId,
                forma_pagamento: "PIX",
                proxima_cobranca: new Date().toISOString(),
              },
            });
          }

          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error("Erro ao verificar status do pagamento:", error);
      }
    };

    const statusIntervalId = setInterval(checkStatus, 5000);
    return () => clearInterval(statusIntervalId);
  }, [paymentId, showPixPayment]);

  // Contador regressivo para PIX
  useEffect(() => {
    if (!showPixPayment) return;

    const intervalId = setInterval(() => {
      const time = calculateExpirationTime();
      setExpirationTime({
        hours: time.hours || 0,
        minutes: time.minutes || 0,
        seconds: time.seconds || 0,
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showPixPayment]);

  async function getInfo() {
    await fetch(`${apiURL}/assinatura/upgrade/${dataToken?.id}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => {
        setInfo(data);
      })
      .catch((err) => console.log(err));
    await fetch(`${apiURL}/acomodacao/names/${dataToken?.id}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data: any[]) => {
        setAcomodacoesAtivas(data.filter((e) => !e.desativado).length);
      })
      .catch((err) => console.log(err));
  }

  const currentPlan = getCurrentPlan();
  const [price, setPrice] = useState<{
    monthly: string;
    total: string;
    savings: string;
    antigo: string;
  }>(calculatePrice(currentPlan));
  // let price = calculatePrice(currentPlan);

  function mesesAteDataFutura(dataFuturaStr: string): number {
    const hoje = new Date();
    const dataFutura = new Date(dataFuturaStr);

    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth(); // 0 a 11

    const anoFuturo = dataFutura.getFullYear();
    const mesFuturo = dataFutura.getMonth();

    const mesesTotais = (anoFuturo - anoAtual) * 12 + (mesFuturo - mesAtual);

    if (dataFutura.getDate() < hoje.getDate()) {
      return mesesTotais - 1;
    }

    return mesesTotais;
  }

  useEffect(() => {
    if (isPaymentOpen) {
      getInfo();
    } else {
      setInfo(null);
    }
  }, [isPaymentOpen]);

  // Timeout para o notify
  useEffect(() => {
    if (showNotify) {
      const timer = setTimeout(() => {
        setShowNotify(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotify]);

  useEffect(() => {
    setPrice(calculatePrice(getCurrentPlan()));
  }, [selectedAccommodations]);

  return (
    <div className="min-h-screen bg-[#F4F4F5] p-8">
      {showNotify && <Notify type={notify.type} text={notify.text} />}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Plano Mensal */}
        <div className="bg-white rounded-2xl shadow p-8 relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0E3447] mb-4">
              Plano Mensal
            </h2>
            <p className="text-gray-600 mb-2">Preço por acomodação:</p>
            <div className="bg-gray-200 py-2 px-4 rounded-md inline-block">
              sem desconto
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[#0E3447] text-sm font-medium mb-2">
                Acomodações: Até {selectedAccommodations[0]} acomodações
              </label>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={selectedAccommodations[0]}
                onChange={handleSliderChange}
                className="w-full"
              />
            </div>

            <div className="text-center">
              <p className="text-lg mb-2">Preço Mensal:</p>
              <p className="text-3xl font-bold text-[#0E3447]">
                {formatCurrency(Number(price.monthly))}
              </p>
            </div>

            <button
              className="w-full py-2 px-4 bg-[#76EAB7] hover:bg-[#79EECE] text-[#0E3447] rounded-lg font-semibold"
              onClick={() => {
                setIsAnnual(false);
                setIsPaymentOpen(true);
              }}
            >
              Adquirir pacote mensal
            </button>
          </div>
        </div>

        {/* Plano Anual */}
        <div className="bg-[#0E3447] rounded-2xl shadow p-8 text-white relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Plano Anual</h2>
            <div className="mb-4">
              <p className="mb-2">Preço por acomodação:</p>
              <div className="bg-[#76EAB7] text-[#0E3447] py-2 px-4 rounded-md inline-block">
                {(
                  (Number(price.savings) / (Number(price.monthly) * 12)) *
                  100
                ).toFixed(1)}
                % de desconto
              </div>
            </div>
            <div className="text-xs uppercase tracking-wider mb-2 absolute left-1/2 -translate-x-1/2 top-40">
              Recomendado
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Acomodações: Até {selectedAccommodations[0]} acomodações
              </label>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={selectedAccommodations[0]}
                onChange={handleSliderChange}
                className="w-full"
              />
            </div>

            <div className="text-center">
              <p className="text-lg mb-2">Preço Anual:</p>
              {Number(price.antigo) > 0 && (
                <span className="absolute right-2 -translate-y-4 line-through">
                  {formatCurrency(Number(price.antigo))}
                </span>
              )}
              <p className="text-3xl font-bold">
                {formatCurrency(Number(price.total))}
              </p>
              <p className="text-[#76EAB7] text-sm absolute left-1/2 -translate-x-1/2 top-[334px]">
                (Economize {formatCurrency(Number(price.savings))})
              </p>
            </div>

            <button
              className="w-full py-2 px-4 bg-[#76EAB7] hover:bg-[#79EECE] text-[#0E3447] rounded-lg font-semibold"
              onClick={() => {
                setIsAnnual(true);
                setIsPaymentOpen(true);
              }}
            >
              Adquirir pacote anual
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Forma de Pagamento */}
      {isPaymentOpen && info && !showPaymentMethod && !showPixPayment && (
        <>
          {(upgrade && info.qtd_acomodacao >= currentPlan.accommodations) ||
          acomodacoesAtivas > currentPlan.accommodations ? (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl text-center font-bold text-[#0E3447] mb-6">
                  {!upgrade
                    ? "Você tem mais acomodações ativas do que o plano selecionado permite."
                    : "Seu plano atual já contempla essa quantidade de acomodações."}
                </h2>

                <div className="flex gap-4">
                  <button
                    className="flex-1 py-2 px-4 border rounded-lg"
                    onClick={() => {
                      setIsPaymentOpen(false);
                      setWait(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-[#0E3447] mb-6">
                  Escolha a forma de pagamento
                </h2>
                {isAnnual && !upgrade && (
                  <section className="relative flex justify-between gap-2">
                    <p
                      id="cupom-info"
                      className="absolute text-sm -top-5 text-zinc-500"
                    ></p>
                    <input
                      placeholder="CUPOM"
                      type="text"
                      name="cupom"
                      id="cupom"
                      className="uppercase border rounded-xl pl-1"
                    />
                    <button
                      className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                      onClick={() => {
                        const cupomInput = document.getElementById(
                          "cupom",
                        ) as HTMLInputElement;
                        const cupomInfo = document.getElementById(
                          "cupom-info",
                        ) as HTMLInputElement;
                        if (
                          cupons.some(
                            (c) =>
                              c.name === cupomInput.value.toUpperCase() &&
                              c.until >= new Date(),
                          )
                        ) {
                          document
                            .getElementById("cupom")
                            ?.classList.remove("border-red-500");
                          document
                            .getElementById("cupom")
                            ?.classList.add("border-green-500");
                          cupomInfo.textContent = `${Number(cupons.find((c) => c.name === cupomInput.value.toUpperCase())?.discount || 0) * 100}% de desconto aplicados`;
                          setPrice({
                            monthly: calculatePrice(currentPlan).monthly,
                            savings: calculatePrice(currentPlan).savings,
                            total: (
                              Number(calculatePrice(currentPlan).total) -
                              Number(calculatePrice(currentPlan).total) *
                                (cupons.find(
                                  (c) =>
                                    c.name === cupomInput.value.toUpperCase(),
                                )?.discount || 0)
                            ).toFixed(2),
                            antigo: calculatePrice(currentPlan).total,
                          });
                        } else {
                          cupomInfo.textContent = "Cupom inválido ou expirado";
                          document
                            .getElementById("cupom")
                            ?.classList.remove("border-green-500");
                          document
                            .getElementById("cupom")
                            ?.classList.add("border-red-500");
                          setPrice({
                            monthly: calculatePrice(currentPlan).monthly,
                            savings: calculatePrice(currentPlan).savings,
                            total: calculatePrice(currentPlan).total,
                            antigo: (0).toFixed(2),
                          });
                        }
                      }}
                    >
                      APLICAR
                    </button>
                  </section>
                )}
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Plano Selecionado
                  </div>
                  <div className="text-[#0E3447] font-semibold">
                    {currentPlan.accommodations}{" "}
                    {currentPlan.accommodations === 1
                      ? "Acomodação"
                      : "Acomodações"}{" "}
                    - {isAnnual ? "Anual" : "Mensal"}
                  </div>
                  {Number(price.antigo) > 0 && (
                    <p className="text-base text-red-500 line-through -mb-2">
                      {formatCurrency(Number(price.antigo))}
                    </p>
                  )}
                  <div className="text-2xl font-bold text-[#0E3447] mt-2">
                    {formatCurrency(
                      isAnnual
                        ? upgrade
                          ? ((Number(price.total) - Number(info.valor_ano)) /
                              12) *
                            (mesesAteDataFutura(info.trial_end) > 0
                              ? mesesAteDataFutura(info.trial_end)
                              : 1)
                          : Number(price.total)
                        : Number(price.monthly),
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="rounded-3xl border border-blue-200 bg-[linear-gradient(135deg,#1d4ed8_0%,#2563eb_45%,#60a5fa_100%)] p-5 text-white shadow-[0_20px_45px_-20px_rgba(37,99,235,0.7)]">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-white/15 p-3">
                        <svg
                          className="w-6 h-6 fill-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-50">
                          Recomendado
                        </span>
                        <p className="mt-3 text-xl font-semibold">
                          Cartão de Crédito
                        </p>
                        <p className="mt-2 text-sm leading-6 text-blue-50/90">
                          Liberação mais rápida da assinatura e cobrança
                          recorrente sem precisar refazer o pagamento.
                        </p>
                      </div>
                    </div>
                    <button
                      className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                      onClick={() => setShowPaymentMethod(true)}
                    >
                      Continuar com cartão
                    </button>
                  </div>
                  <button
                    className="hidden"
                    onClick={() => setShowPaymentMethod(true)}
                  >
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path>
                    </svg>
                    Cartão de Crédito
                  </button>
                  <details className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-[#0E3447]">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-gray-600">
                      Ver outras formas de pagamento
                    </summary>
                    <button
                      className="mt-4 w-full py-3 px-4 border border-gray-300 rounded-2xl bg-white hover:bg-gray-50 flex items-center gap-3"
                      onClick={() => {
                        setShowPixPayment(true);
                        gerarPix();
                      }}
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M5.38545 18.1135L9.52498 22.253C10.8918 23.6199 13.1079 23.6199 14.4747 22.253L18.6143 18.1135C17.5088 18.1824 16.3802 17.7945 15.5354 16.9497L12.5302 13.9445C12.2373 13.6516 11.7624 13.6516 11.4695 13.9445L8.46432 16.9497C7.61954 17.7945 6.49092 18.1824 5.38545 18.1135ZM20.4851 16.2426L22.2529 14.4748C23.6197 13.108 23.6197 10.8919 22.2529 9.5251L20.4851 7.75734C19.3136 6.58576 17.4141 6.58576 16.2425 7.75734L13.2373 10.7625C12.5539 11.446 11.4458 11.446 10.7624 10.7625L7.75721 7.75734C6.58564 6.58576 4.68615 6.58576 3.51457 7.75734L1.74681 9.5251C0.37997 10.8919 0.37997 13.108 1.74681 14.4748L3.51457 16.2426C4.68615 17.4142 6.58564 17.4142 7.75721 16.2426L10.7624 13.2374C11.4458 12.554 12.5539 12.554 13.2373 13.2374L16.2425 16.2426C17.4141 17.4142 19.3136 17.4142 20.4851 16.2426ZM5.38545 5.88646C6.49092 5.81753 7.61954 6.20545 8.46432 7.05023L11.4695 10.0554C11.7624 10.3483 12.2373 10.3483 12.5302 10.0554L15.5354 7.05023C16.3802 6.20545 17.5088 5.81753 18.6143 5.88646L14.4747 1.74693C13.1079 0.380092 10.8918 0.380092 9.52498 1.74693L5.38545 5.88646Z"></path>
                      </svg>
                      PIX
                    </button>
                  </details>
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 py-2 px-4 border rounded-lg"
                    onClick={() => {
                      setIsPaymentOpen(false);
                      setWait(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de Pagamento com Cartão */}
      {showPaymentMethod && info && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-[#0E3447] mb-6">
              Complete sua Compra
            </h2>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">
                Plano Selecionado
              </div>
              <div className="text-[#0E3447] font-semibold">
                {currentPlan.accommodations}{" "}
                {currentPlan.accommodations === 1
                  ? "Acomodação"
                  : "Acomodações"}{" "}
                - {isAnnual ? "Anual" : "Mensal"}
              </div>
              <div className="text-2xl font-bold text-[#0E3447] mt-2">
                {formatCurrency(
                  isAnnual
                    ? upgrade
                      ? ((Number(price.total) - Number(info.valor_ano)) / 12) *
                        (mesesAteDataFutura(info.trial_end) > 0
                          ? mesesAteDataFutura(info.trial_end)
                          : 1)
                      : Number(price.total)
                    : Number(price.monthly),
                )}
              </div>
            </div>

            {wait ? (
              <div className="space-y-4 mb-6 text-3xl text-center text-[#0E3447]">
                Aguarde . . .
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600">
                    Número do Cartão
                  </label>
                  <InputMask
                    placeholder="0000 0000 0000 0000"
                    mask="xxxx xxxx xxxx xxxx"
                    replacement={{ x: /\d/ }}
                    id="num-card"
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">
                      Data de Validade
                    </label>
                    <InputMask
                      placeholder="MM / AAAA"
                      mask="xx / xxxx"
                      replacement={{ x: /\d/ }}
                      id="data-expiracao"
                      type="text"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">CVC</label>
                    <InputMask
                      mask="xxx"
                      replacement={{ x: /\d/ }}
                      placeholder="000"
                      id="cvc"
                      type="text"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {!wait && (
                <button
                  className="flex-1 py-2 px-4 bg-[#76EAB7] hover:bg-[#79EECE] text-[#0E3447] rounded-lg font-semibold"
                  onClick={async () => {
                    const numCard = document.getElementById(
                      "num-card",
                    ) as HTMLInputElement;
                    const dataValid = document.getElementById(
                      "data-expiracao",
                    ) as HTMLInputElement;
                    const cvc = document.getElementById(
                      "cvc",
                    ) as HTMLInputElement;

                    if (
                      numCard.value.length == 19 &&
                      dataValid.value.length == 9 &&
                      cvc.value.length == 3
                    ) {
                      const card = {
                        card: numCard.value,
                        date: dataValid.value,
                        cvc: cvc.value,
                      };
                      upgrade
                        ? gerarPagamento(card)
                        : renovacaoAssinatura(card);
                      setWait(true);
                    }
                  }}
                >
                  Pagar{" "}
                  {formatCurrency(
                    isAnnual
                      ? upgrade
                        ? ((Number(price.total) - Number(info.valor_ano)) /
                            12) *
                          (mesesAteDataFutura(info.trial_end) > 0
                            ? mesesAteDataFutura(info.trial_end)
                            : 1)
                        : Number(price.total)
                      : Number(price.monthly),
                  )}
                </button>
              )}
              <button
                className="flex-1 py-2 px-4 border rounded-lg"
                onClick={() => {
                  setShowPaymentMethod(false);
                  setWait(false);
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento com PIX */}
      {showPixPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-[#0E3447] mb-6">
              Pagamento com PIX
            </h2>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">
                Plano Selecionado
              </div>
              <div className="text-[#0E3447] font-semibold">
                {currentPlan.accommodations}{" "}
                {currentPlan.accommodations === 1
                  ? "Acomodação"
                  : "Acomodações"}{" "}
                - {isAnnual ? "Anual" : "Mensal"}
              </div>
              <div className="text-2xl font-bold text-[#0E3447] mt-2">
                {formatCurrency(
                  isAnnual
                    ? upgrade
                      ? ((Number(price.total) - Number(info?.valor_ano)) / 12) *
                        (mesesAteDataFutura(info?.trial_end || "") > 0
                          ? mesesAteDataFutura(info?.trial_end || "")
                          : 1)
                      : Number(price.total)
                    : Number(price.monthly),
                )}
              </div>
            </div>

            {pixLoading ? (
              <div className="text-center mb-6">
                <div className="text-3xl text-center text-[#0E3447] mb-4">
                  Gerando PIX...
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : qr ? (
              <div className="text-center mb-6">
                <img
                  className="h-48 w-fit mx-auto mb-4"
                  src={`data:image/png;base64,${qr}`}
                  alt="QR Pagamento"
                />
                <p className="text-center text-lg font-semibold mb-2">
                  Validade do pagamento
                </p>
                <p className="text-center text-gray-600 mb-4">
                  {String(expirationTime.minutes).padStart(2, "0")}:
                  {String(expirationTime.seconds).padStart(2, "0")}
                </p>
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors duration-200"
                  onClick={() => navigator.clipboard.writeText(copypastepix)}
                >
                  Copiar código PIX
                </button>
              </div>
            ) : (
              <div className="text-center mb-6">
                <p className="text-gray-600">Erro ao gerar QR Code</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                className="flex-1 py-2 px-4 border rounded-lg"
                onClick={() => {
                  setShowPixPayment(false);
                  setQr("");
                  setCopypastepix("");
                  setPaymentId("");
                  setPixLoading(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
