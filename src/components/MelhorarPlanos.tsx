import { useContext, useEffect, useState } from "react";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import { InputMask } from "@react-input/mask";

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

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

export default function MelhorarPlanos({ upgrade }: { upgrade: boolean }) {
    const apiURL = 'https://api.prohost.net.br'
    const { dataToken } = useContext(SideBarContext)
    const [isAnnual, setIsAnnual] = useState(false);
    const [wait, setWait] = useState(false);
    const [selectedAccommodations, setSelectedAccommodations] = useState([1]);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [info, setInfo] = useState<{
        qtd_acomodacao: number
        valor_mes: string
        valor_ano: string
        cus: string
        trial_end: string
    } | null>(null);

    const getCurrentPlan = () => {
        return (
            plans.find((plan) => plan.accommodations === selectedAccommodations[0]) || plans[0]
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
            };
        }
        return {
            monthly: monthlyPrice.toFixed(2),
            total: (monthlyPrice * 10).toFixed(2),
            savings: ((monthlyPrice * 12) - (monthlyPrice * 10)).toFixed(2),
        };
    };

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        const closest = plans.reduce((prev, curr) => {
            return Math.abs(curr.accommodations - value) < Math.abs(prev.accommodations - value)
                ? curr
                : prev;
        });
        setSelectedAccommodations([closest.accommodations]);
    };

    async function updateAssinatura(updateBody: {
        saas: number, plano: {
            qtd_acomodacao: number,
            permicao: number,
            valor_mes: number,
            valor_ano: number,
        },
        assinatura: {
            assinatura: string
            pagamento: string
            forma_pagamento: string
            proxima_cobranca: string
        }
    }) {
        await fetch(`${apiURL}/plano/upgrade`, {
            method: 'POST',
            body: JSON.stringify(updateBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(data => {
                setWait(false)
                if (data.length > 1 && data[1] == 1)
                    location.reload()
                return data
            })
            .catch(err => console.log(err))
    }

    async function pagamentoCartao(pay: string, cartao: {
        card: '',
        date: '',
        cvc: ''
    }) {
        await fetch(`${apiURL}/assinatura/credit-card/${pay}`, {
            method: 'POST',
            body: JSON.stringify({
                cardForm: {
                    holderName: dataToken.nome,
                    number: cartao.card,
                    expiryMonth: cartao.date.split(' / ')[0],
                    expiryYear: cartao.date.split(' / ')[1],
                    ccv: cartao.cvc
                },
                saas: dataToken.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(async (data) => {
                if (data.id) {
                    if (upgrade)
                        await updateAssinatura({
                            "saas": dataToken.id,
                            "plano": {
                                "qtd_acomodacao": selectedAccommodations[0],
                                "permicao": 1,
                                "valor_mes": Number(price.monthly),
                                "valor_ano": Number(price.total)
                            },
                            "assinatura": {
                                "assinatura": data.subscription,
                                "pagamento": data.id,
                                "forma_pagamento": data.billingType,
                                "proxima_cobranca": data.dueDate
                            }
                        })
                    else
                        location.reload()
                }
            })
            .catch(err => console.log(err))
    }

    async function gerarPagamento(cartao?: any) {
        console.log({
                "saas": Number(dataToken.id),
                "price": isAnnual ?
                    ((Number(price.total) - Number(info?.valor_ano)) / 12) * (mesesAteDataFutura(info?.trial_end || '') > 0 ? mesesAteDataFutura(info?.trial_end || '') : 1)
                    : Number(price.monthly),
                "cycle": isAnnual ? 'YEARLY' : 'MONTHLY'
            })
        await fetch(`${apiURL}/assinatura/upgrade/`, {
            method: 'POST',
            body: JSON.stringify({
                "saas": Number(dataToken.id),
                "price": isAnnual ?
                    ((Number(price.total) - Number(info?.valor_ano)) / 12) * (mesesAteDataFutura(info?.trial_end || '') > 0 ? mesesAteDataFutura(info?.trial_end || '') : 1)
                    : Number(price.monthly),
                "cycle": isAnnual ? 'YEARLY' : 'MONTHLY'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.pagamento) {
                    pagamentoCartao(data.pagamento, cartao)
                }
            })
            .catch(err => console.log(err))
    }

    async function renovacaoAssinatura(cartao?: any) {
        let getPlano = null
        {
            await fetch(`${apiURL}/plano/${selectedAccommodations[0]}/${!isAnnual ? price.monthly : price.total}/${isAnnual ? 'YEARLY' : 'MONTHLY'}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(data => data.json())
                .then(async (data) => {
                    if (data.length > 0) {
                        getPlano = data[0]
                        getPlano = { ...getPlano, valor_ano: Number(getPlano.valor_ano), valor_mes: Number(getPlano.valor_mes), qtd_acomodacao: Number(getPlano.qtd_acomodacao) }
                    }
                    else {
                        await fetch(`${apiURL}/plano/`, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                "qtd_acomodacao": Number(selectedAccommodations[0]),
                                "permicao": 1,
                                "valor_mes": Number((Number(price.total) / 10).toFixed(2)),
                                "valor_ano": Number(price.total)
                            })
                        })
                            .then(data => data.json())
                            .then(data => {
                                getPlano = data
                                getPlano = { ...getPlano, valor_ano: Number(getPlano.valor_ano), valor_mes: Number(getPlano.valor_mes), qtd_acomodacao: Number(getPlano.qtd_acomodacao) }
                            })
                            .catch(err => console.log(err))
                    }
                })
        }
        await fetch(`${apiURL}/assinatura/renovacao/`, {
            method: 'POST',
            body: JSON.stringify({
                "saas": Number(dataToken.id),
                "plano": getPlano,
                "cycle": isAnnual ? 'YEARLY' : 'MONTHLY'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.pagamento) {
                    pagamentoCartao(data.pagamento, cartao)
                }
            })
            .catch(err => console.log(err))
    }

    async function getInfo() {
        await fetch(`${apiURL}/assinatura/upgrade/${dataToken.id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                setInfo(data)
            })
            .catch(err => console.log(err))
    }

    const currentPlan = getCurrentPlan();
    const price = calculatePrice(currentPlan);

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
            getInfo()
        }
        else {
            setInfo(null)
        }
    }, [isPaymentOpen])


    return (
        <div className="min-h-screen bg-[#F4F4F5] p-8">
            {upgrade && <p className="text-primary text-center text-3xl mb-5">Upgrade de plano</p>}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Plano Mensal */}
                <div className="bg-white rounded-2xl shadow p-8 relative">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#0E3447] mb-4">Plano Mensal</h2>
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

                        <div className="text-center text-sm text-gray-500">
                            EXPERIMENTE 15 DIAS GRÁTIS*
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
                                {(Number(price.savings) / (Number(price.monthly) * 12) * 100).toFixed(1)}% de desconto
                            </div>
                        </div>
                        <div className="text-xs uppercase tracking-wider mb-2 absolute left-1/2 -translate-x-1/2 top-40">Recomendado</div>
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
                            <p className="text-3xl font-bold">
                                {formatCurrency(Number(price.total))}
                            </p>
                            <p className="text-[#76EAB7] text-sm absolute left-1/2 -translate-x-1/2 top-[334px]">
                                (Economize {formatCurrency(Number(price.savings))})
                            </p>
                        </div>

                        <div className="text-center text-sm opacity-75">
                            EXPERIMENTE 15 DIAS GRÁTIS*
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

            {isPaymentOpen && info && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    {currentPlan.accommodations <= info.qtd_acomodacao && upgrade ?
                        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                            <h2 className="text-2xl font-bold text-[#0E3447] mb-6">
                                Seu plano atual é equivalente ou superior ao selecionado
                            </h2>
                            <button
                                className="flex-1 py-2 px-4 border rounded-lg"
                                onClick={() => {
                                    setIsPaymentOpen(false)
                                    setWait(false)
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                        :
                        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                            <h2 className="text-2xl font-bold text-[#0E3447] mb-6">
                                Complete sua Compra
                            </h2>

                            <div className="mb-6">
                                <div className="text-sm text-gray-600 mb-2">Plano Selecionado</div>
                                <div className="text-[#0E3447] font-semibold">
                                    {currentPlan.accommodations}{" "}
                                    {currentPlan.accommodations === 1 ? "Acomodação" : "Acomodações"} -{" "}
                                    {isAnnual ? "Anual" : "Mensal"}
                                </div>
                                <div className="text-2xl font-bold text-[#0E3447] mt-2">
                                    {
                                        formatCurrency(isAnnual ? (
                                            upgrade ?
                                                ((Number(price.total) - Number(info.valor_ano)) / 12) * (mesesAteDataFutura(info.trial_end) > 0 ? mesesAteDataFutura(info.trial_end) : 1)
                                                :
                                                Number(price.total)
                                        )
                                            : Number(price.monthly))
                                    }
                                </div>
                            </div>

                            {wait ?
                                <div className="space-y-4 mb-6 text-3xl text-center text-[#0E3447]">
                                    Aguarde . . .
                                </div> :
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-sm text-gray-600">Número do Cartão</label>
                                        <InputMask
                                            placeholder="0000 0000 0000 0000"
                                            mask="xxxx xxxx xxxx xxxx"
                                            replacement={{ x: /\d/ }}
                                            id='num-card' type="text"
                                            className='w-full mt-1 px-3 py-2 border rounded-md' />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600">Data de Validade</label>
                                            <InputMask
                                                placeholder="MM / AAAA"
                                                mask="xx / xxxx"
                                                replacement={{ x: /\d/ }} id='data-expiracao' type="text"
                                                className='w-full mt-1 px-3 py-2 border rounded-md' />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">CVC</label>
                                            <InputMask
                                                mask="xxx"
                                                replacement={{ x: /\d/ }}
                                                placeholder="000" id='cvc' type="text"
                                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>}

                            <div className="flex gap-4">
                                {!wait && <button
                                    className="flex-1 py-2 px-4 bg-[#76EAB7] hover:bg-[#79EECE] text-[#0E3447] rounded-lg font-semibold"
                                    onClick={async () => {
                                        const numCard = document.getElementById('num-card') as HTMLInputElement
                                        const dataValid = document.getElementById('data-expiracao') as HTMLInputElement
                                        const cvc = document.getElementById('cvc') as HTMLInputElement

                                        if (numCard.value.length == 19
                                            && dataValid.value.length == 9
                                            && cvc.value.length == 3
                                        ) {
                                            const card = {
                                                card: numCard.value,
                                                date: dataValid.value,
                                                cvc: cvc.value
                                            }
                                            upgrade ?
                                                gerarPagamento(card) :
                                                renovacaoAssinatura(card)
                                            setWait(true)
                                        }
                                    }}
                                >
                                    Pagar {formatCurrency(isAnnual ? (
                                        upgrade ?
                                            ((Number(price.total) - Number(info.valor_ano)) / 12) * (mesesAteDataFutura(info.trial_end) > 0 ? mesesAteDataFutura(info.trial_end) : 1)
                                            :
                                            Number(price.total)
                                    )
                                        : Number(price.monthly))}
                                </button>}
                                <button
                                    className="flex-1 py-2 px-4 border rounded-lg"
                                    onClick={() => {
                                        setIsPaymentOpen(false)
                                        setWait(false)
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                            <section className="mt-4 -mb-4">
                                <a href={`https://wa.me/5521995178020?text=${encodeURIComponent(`Olá!
Desejo continuar com o upgrade do meu plano para ${selectedAccommodations[0]} acomodações com outra forma de pagamento.
Poderia me ajudar?`)}`} target="_blank"
                                    className="underline text-primary">
                                    Deseja continuar com outra forma de pagamento?
                                </a>
                            </section>
                        </div>
                    }
                </div>
            )}
        </div>
    );
}