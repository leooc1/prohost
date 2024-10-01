import { ChangeEvent, useState } from "react";

export default function CadastrarAcomodacao({ close }: { close: () => void }) {
    const [qtdMaxHospede, setQtdMaxHospede] = useState(1)
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => { e.preventDefault() }} className="flex flex-col absolute min-w-80 max-w-[520px] px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white rounded-md">
                <h5 className="font-semibold text-2xl mb-2">Cadastrar Acomodação</h5>
                <label htmlFor="identificador" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Identificador</span>
                    <input placeholder="Ex: Apartamento Guarujá" type="text" name="identificador" id="identificador" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    <label htmlFor="status" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Status</span>
                        <select name="status" id="status" className="border border-zinc-300 rounded-md px-2 py-1 outline-none">
                            <option value="" selected disabled></option>
                            <option value="terceiro">Terceiro</option>
                            <option value="proprio">Próprio</option>
                        </select>
                    </label>

                    <label htmlFor="inicio-operacao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Início de Operação</span>
                        <input type="date" name="inicio-operacao" id="inicio-operacao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                </div>
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    <label htmlFor="endereco" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Endereço</span>
                        <input type="text" name="endereco" id="endereco" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="valor-imovel" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Valor do Imóvel</span>
                        <input type="number" name="valor-imovel" id="valor-imovel" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                </div>
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <label htmlFor="padrao-checkout" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Horário Padrão de Checkout</span>
                        <input type="time" name="padrao-checkout" id="padrao-checkout" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="padrao-checkin" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Horário Padrão de Checkin</span>
                        <input type="time" name="padrao-checkin" id="padrao-checkin" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                </div>
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <label htmlFor="imagem" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Foto de Capa</span>
                        <div id="input-file" className="w-52 max-h-20 cursor-pointer flex border border-zinc-300 rounded-md px-1 py-1 outline-none items-center">
                            <svg className="w-28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#777777"><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                            <p className="text-zinc-400">Clique ou arraste uma imagem aqui</p>
                        </div>
                        <img id="preview" src="" alt="Pré-Visualização da Imagem" className="hidden w-52 max-h-20 object-contain cursor-pointer border border-zinc-300 rounded-md px-1 py-1 outline-none" />
                        <input type="file" name="imagem" id="imagem" accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng" className="hidden"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const input = document.getElementById('input-file') as HTMLInputElement | null;
                                const preview = document.getElementById('preview') as HTMLImageElement | null;
                                const file = e.target.files?.[0];
                                if (file && preview) {
                                    preview.classList.remove('hidden')
                                    input?.classList.add('hidden')
                                    const reader = new FileReader();
                                    reader.onload = (event: ProgressEvent<FileReader>) => {
                                        if (event.target) {
                                            preview.src = event.target.result as string;
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                } else {
                                    preview?.classList.add('hidden')
                                    input?.classList.remove('hidden')
                                }
                            }} />
                    </label>
                    <label htmlFor="qtd-max-hospede" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Qtd. Máxima de Hóspedes</span>
                        <div className="flex justify-center gap-3 items-center">
                            <button className="border border-zinc-300 rounded-md w-8 h-8 font-bold" onClick={() => {
                                if (qtdMaxHospede <= 1)
                                    return
                                else
                                    setQtdMaxHospede(qtdMaxHospede - 1)
                            }}>-</button>
                            <input type="number" name="qtd-max-hospede" id="qtd-max-hospede" className="border border-zinc-300 rounded-md px-2 py-1 outline-none max-w-20 text-center" 
                            onChange={(e)=>setQtdMaxHospede(Number(e.target.value))} value={qtdMaxHospede} />
                            <button className="border border-zinc-300 rounded-md w-8 h-8 font-bold" onClick={() => setQtdMaxHospede(qtdMaxHospede + 1)}>+</button>
                        </div>
                    </label>
                </div>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Cadastrar</button>
                </section>
            </form>
        </div>
    )
}
