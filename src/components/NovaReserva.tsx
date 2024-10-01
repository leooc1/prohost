
export default function NovaReserva({ close }: { close: () => void }) {

    function parseCurrency(value: string) {
        return Number(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    }

    function formatCurrency(value: number) {
        return 'R$ ' + value.toFixed(2).replace('.', ',');
    }

    function checkNegativeAndApplyStyle() {
        var elements = [document.getElementById('tot'), document.getElementById('com'), document.getElementById('liq')];
        var hasNegative = false;

        elements.forEach((element: any) => {
            if (parseCurrency(element.value) < 0) {
                element.style.color = 'red';
                hasNegative = true;
            } else {
                element.style.color = 'black';
            }
        });

        toggleButtonState(hasNegative);
    }

    function toggleButtonState(disable: boolean) {
        var cadastroBtn = document.querySelector('#button-cadastrar') as HTMLButtonElement

        if (disable) {
            cadastroBtn.disabled = true;
            cadastroBtn.setAttribute('data-text', 'Corrija o número negativo');
            cadastroBtn.innerText = 'Corrija o número negativo';
            cadastroBtn.style.cursor = 'not-allowed';
        } else {
            cadastroBtn.disabled = false;
            cadastroBtn.setAttribute('data-text', 'Cadastrar');
            cadastroBtn.innerText = 'Cadastrar';
            cadastroBtn.style.cursor = 'pointer';
        }
    }

    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute min-w-80 px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
                <h5 className="font-semibold text-2xl mb-2">Nova Reserva</h5>
                <label htmlFor="acomodacao" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-xs">Acomodação</span>
                    <select name="acomodacao" id="acomodacao" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                        <option value="1">Lorem.</option>
                        <option value="2">Lorem.</option>
                        <option value="3">Lorem.</option>
                    </select>
                </label>
                <div className="grid gap-4" style={{ gridTemplateColumns: '3fr 1fr' }}>
                    <label htmlFor="hospede" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Hóspede</span>
                        <input type="text" placeholder="Selecione um hóspede" name="hospede" id="hospede" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="qtd-hospedes" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Qtd. Hóspedes</span>
                        <input type="number" defaultValue={1} min={1} onChange={(e) => { if (e.target.value.length > 0 && Number(e.target.value) < 1) e.target.value = '1' }} name="qtd-hospedes" id="qtd-hospedes" className="border border-zinc-300 rounded-md px-2 py-1 text-center outline-none max-w-32" />
                    </label>
                </div>
                <div className="grid gap-4 grid-cols-4">
                    <label htmlFor="checkin-date" className="flex flex-col justify-end">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Check-in</span>
                        <input type="date" name="checkin-date" id="checkin-date" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="checkin-hour" className="flex flex-col justify-end w-fit">
                        <input type="time" name="checkin-hour" id="checkin-hour" className="border border-zinc-300 max-w-24 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="checkout-date" className="flex flex-col justify-end">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Check-out</span>
                        <input type="date" name="checkout-date" id="checkout-date" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="checkout-hour" className="flex flex-col justify-end w-fit">
                        <input type="time" name="checkout-hour" id="checkout-hour" className="border border-zinc-300 max-w-24 rounded-md px-2 py-1 outline-none" />
                    </label>
                </div>
                <label htmlFor="canal-reserva" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-xs">Canal</span>
                    <select name="canal-reserva" id="canal-reserva" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                        <option value="" selected disabled className="hidden">Selecione um canal</option>
                        <option value="1">Indicação</option>
                    </select>
                </label>
                <div className="grid gap-4 grid-cols-3">
                    <label htmlFor="tot" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Valor Total</span>
                        <input type="text" placeholder="R$" name="tot" id="tot" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                            onInput={() => {
                                const total = document.getElementById('tot') as HTMLInputElement
                                const comissao = document.getElementById('com') as HTMLInputElement
                                const liquido = document.getElementById('liq') as HTMLInputElement

                                if (comissao.value.length == 0 && liquido.value.length == 0) {
                                    liquido.value = formatCurrency(parseCurrency(total.value) - parseCurrency(comissao.value));
                                } else if (comissao.value.length == 0 && liquido.value.length > 0) {
                                    comissao.value = formatCurrency(parseCurrency(total.value) - parseCurrency(liquido.value));
                                } else if (comissao.value.length > 0 && liquido.value.length == 0) {
                                    liquido.value = formatCurrency(parseCurrency(total.value) - parseCurrency(comissao.value));
                                } else {
                                    liquido.value = formatCurrency(parseCurrency(total.value) - parseCurrency(comissao.value));
                                }

                                total.value = formatCurrency(parseCurrency(total.value));
                                comissao.value = formatCurrency(parseCurrency(comissao.value));
                                liquido.value = formatCurrency(parseCurrency(liquido.value));

                                checkNegativeAndApplyStyle();
                            }} />
                    </label>
                    <label htmlFor="com" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Comissão</span>
                        <input type="text" placeholder="R$" name="com" id="com" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                            onInput={() => {
                                const total = document.getElementById('tot') as HTMLInputElement
                                const comissao = document.getElementById('com') as HTMLInputElement
                                const liquido = document.getElementById('liq') as HTMLInputElement
                            
                                if (liquido.value.length == 0 && total.value.length == 0) {
                                    return;
                                } else if (liquido.value.length == 0 && total.value.length > 0) {
                                    liquido.value = formatCurrency(parseCurrency(total.value) - parseCurrency(comissao.value));
                                } else if (liquido.value.length > 0 && total.value.length == 0) {
                                    total.value = formatCurrency(parseCurrency(comissao.value) + parseCurrency(liquido.value));
                                } else {
                                    liquido.value = formatCurrency(parseCurrency(total.value) - parseCurrency(comissao.value));
                                }
                            
                                total.value = formatCurrency(parseCurrency(total.value));
                                comissao.value = formatCurrency(parseCurrency(comissao.value));
                                liquido.value = formatCurrency(parseCurrency(liquido.value));
                            
                                checkNegativeAndApplyStyle();
                            }} />
                    </label>
                    <label htmlFor="liq" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Valor Líquido</span>
                        <input type="text" placeholder="R$" name="liq" id="liq" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                            onInput={() => {
                                const total = document.getElementById('tot') as HTMLInputElement
                                const comissao = document.getElementById('com') as HTMLInputElement
                                const liquido = document.getElementById('liq') as HTMLInputElement
                            
                                if (comissao.value.length == 0 && total.value.length == 0) {
                                    total.value = formatCurrency(parseCurrency(liquido.value) + parseCurrency(comissao.value));
                                } else if (comissao.value.length == 0 && total.value.length > 0) {
                                    comissao.value = formatCurrency(parseCurrency(total.value) - parseCurrency(liquido.value));
                                } else if (comissao.value.length > 0 && total.value.length == 0) {
                                    total.value = formatCurrency(parseCurrency(total.value) - parseCurrency(comissao.value));
                                } else {
                                    comissao.value = formatCurrency(parseCurrency(total.value) - parseCurrency(liquido.value));
                                }
                            
                                total.value = formatCurrency(parseCurrency(total.value));
                                comissao.value = formatCurrency(parseCurrency(comissao.value));
                                liquido.value = formatCurrency(parseCurrency(liquido.value));
                            
                                checkNegativeAndApplyStyle();
                            }} />
                    </label>
                </div>
                <label htmlFor="obs" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-xs">Observação</span>
                    <input type="text" name="obs" id="obs" placeholder="Opcional" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button id="button-cadastrar" className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Cadastrar</button>
                </section>
            </form>

        </div>
    )
}
