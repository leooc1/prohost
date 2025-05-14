import { useState } from "react";

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

export default function MelhorarPlanos() {
    const [isAnnual, setIsAnnual] = useState(false);
    const [selectedAccommodations, setSelectedAccommodations] = useState([1]);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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

    const currentPlan = getCurrentPlan();
    const price = calculatePrice(currentPlan);

    return (
        <div className="min-h-screen bg-[#F4F4F5] p-8">
            <p className="text-primary text-center text-3xl mb-5">Upgrade de plano</p>
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

            {isPaymentOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
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
                                {formatCurrency(Number(isAnnual ? price.total : price.monthly))}
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-sm text-gray-600">Número do Cartão</label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full mt-1 px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">Data de Validade</label>
                                    <input
                                        type="text"
                                        placeholder="MM/AA"
                                        className="w-full mt-1 px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full mt-1 px-3 py-2 border rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="flex-1 py-2 px-4 bg-[#76EAB7] hover:bg-[#79EECE] text-[#0E3447] rounded-lg font-semibold"
                                onClick={() => setIsPaymentOpen(false)}
                            >
                                Pagar {formatCurrency(Number(isAnnual ? price.total : price.monthly))}
                            </button>
                            <button
                                className="flex-1 py-2 px-4 border rounded-lg"
                                onClick={() => setIsPaymentOpen(false)}
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