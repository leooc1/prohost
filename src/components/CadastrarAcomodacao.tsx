import { ChangeEvent, useContext, useState } from "react";
import { SideBarContext } from "../contexts/SideBarMenuContext";
interface Acomodacao {
    id?: number
    tipo: string
    comissao: number | null
    data_ini_ope: string
    endereco: string
    check_in_p: string | null
    check_out_p: string | null
    foto: string | null
    nome: string
    numero_hospedes: number
    valor_imovel: number
    desativado: boolean
    saas: { id: number }
}

export default function CadastrarAcomodacao({ close }: { close: () => void }) {
    const apiURL = 'https://api.prohost.net.br'
    const { dataToken } = useContext(SideBarContext)
    const [qtdMaxHospede, setQtdMaxHospede] = useState(1)
    const [tipo, setTipo] = useState('')
    const [autoComplete, setAutoComplete] = useState([])
    const [err, setErr] = useState<[boolean, boolean, boolean, boolean, boolean, boolean, boolean]>([false, false, false, false, false, false, false])
    async function createAcomodacao(pbody: Acomodacao) {
        await fetch(`${apiURL}/acomodacao/`, {
            method: 'POST',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.id) {
                    alert('CRIADO COM SUCESSO!!')
                    close()
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    }

    async function enderecaoComplete(input: string) {
        await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5`)
            .then(data => data.json())
            .then(data => {
                setAutoComplete(data.features.map((feature: any) => ({
                    name: feature.properties.name,
                    city: feature.properties.city || "",
                    state: feature.properties.state || "",
                    country: feature.properties.country,
                })))
            })
            .catch(err => console.log(err))
    }

    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => { e.preventDefault() }} className="flex flex-col absolute min-w-80 max-w-[520px] px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white rounded-md">
                <h5 className="font-semibold text-2xl mb-2">Cadastrar Acomodação</h5>
                <label htmlFor="identificador" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-xs">Identificador
                        <span className='text-red-500 font-bold'> *</span>
                    </span>
                    <input placeholder="Ex: Apartamento Guarujá" type="text" name="identificador" id="identificador" className={`border ${err[0] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} />
                </label>
                <div className={`grid gap-4 items-center ${tipo == 'terceiro' ? 'grid-cols-6' : 'grid-cols-3'}`}>
                    <label htmlFor="status" className={`flex flex-col ${tipo == 'terceiro' ? 'col-span-3' : 'col-span-2'}`}>
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Status
                            <span className='text-red-500 font-bold'> *</span>
                        </span>
                        <select name="status" id="status" className={`border ${err[1] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="proprio">Próprio</option>
                            <option value="terceiro">Terceiro</option>
                        </select>
                    </label>

                    {tipo == 'terceiro' && <label htmlFor="comissao" className="flex flex-col relative">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Comissão
                            <span className='text-red-500 font-bold'> *</span>
                        </span>
                        <input type="number" step="0.01" name="comissao" id="comissao" className="border border-zinc-300 rounded-md px-1 input-number py-1 outline-none w-10" placeholder="%" />
                        <span className="absolute right-2 bottom-1">%</span>
                    </label>}

                    <label htmlFor="inicio-operacao" className={`flex flex-col ${tipo == 'terceiro' ? 'col-span-2' : ''}`}>
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Início de Operação
                            <span className='text-red-500 font-bold'> *</span>
                        </span>
                        <input type="date" name="inicio-operacao" id="inicio-operacao" className={`border ${err[2] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} />
                    </label>
                </div>
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    <label htmlFor="endereco" className="flex flex-col relative">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Endereço</span>
                        <input type="text" name="endereco" id="endereco" className={`border ${err[4] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} autoComplete="off"
                            onChange={(e) => {
                                if (e.target.value.length > 3) {
                                    enderecaoComplete(e.target.value)
                                }
                                else setAutoComplete([])
                            }}
                            onBlur={() => setAutoComplete([])} />
                        <ul className="absolute bg-white rounded-2xl overflow-hidden top-14 w-max z-50 shadow-xl shadow-zinc-400">
                            {autoComplete.filter(
                                (end: any, index, self) =>
                                    index ===
                                    self.findIndex(
                                        (e: any) =>
                                            e.name === end.name &&
                                            e.city === end.city &&
                                            e.state === end.state &&
                                            e.country === end.country
                                    )
                            ).map((end: any) => <li
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    const endereco = document.getElementById('endereco') as HTMLInputElement
                                    endereco.value = `${end.name}, ${end.city}, ${end.state}, ${end.country}`
                                    setAutoComplete([])
                                }}
                                className="border-y border-zinc-400 px-2 py-1 cursor-pointer">{end.name}, {end.city}, {end.state}, {end.country}</li>)}
                        </ul>
                    </label>
                    <label htmlFor="valor-imovel" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Valor do Imóvel
                            <span className='text-red-500 font-bold'> *</span>
                        </span>
                        <input type="text" name="valor-imovel" id="valor-imovel" className={`border ${err[3] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} placeholder="R$"
                            onChange={(e) => {
                                if (e.target.value.replace(/[.,]/gm, '').length <= 3)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})/gm, '$1,$2')
                                else if (e.target.value.replace(/[.,]/gm, '').length <= 4)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{2})(\d{2})/gm, '$1,$2')
                                else if (e.target.value.replace(/[.,]/gm, '').length <= 5)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{3})(\d{2})/gm, '$1,$2')
                                else if (e.target.value.replace(/[.,]/gm, '').length <= 6)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{3})(\d{2})/gm, '$1.$2,$3')
                                else if (e.target.value.replace(/[.,]/gm, '').length <= 7)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{2})(\d{3})(\d{2})/gm, '$1.$2,$3')
                                else if (e.target.value.replace(/[.,]/gm, '').length <= 8)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{3})(\d{3})(\d{2})/gm, '$1.$2,$3')
                                else if (e.target.value.replace(/[.,]/gm, '').length <= 9)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
                                else if (e.target.value.replace(/[.,]/gm, '').length <= 10)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{2})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
                                else if (e.target.value.replace(/[.,]/gm, '').length <= 11)
                                    e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
                            }} />
                    </label>
                </div>
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <label htmlFor="padrao-checkout" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Horário Padrão de Checkout
                            <span className='text-red-500 font-bold'> *</span>
                        </span>
                        <select name="padrao-checkout" id="padrao-checkout"
                            className={`border ${err[6] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} defaultValue={'11:00:00'}>
                            <option value="00:00:00">00:00</option>
                            <option value="00:30:00">00:30</option>
                            <option value="01:00:00">01:00</option>
                            <option value="01:30:00">01:30</option>
                            <option value="02:00:00">02:00</option>
                            <option value="02:30:00">02:30</option>
                            <option value="03:00:00">03:00</option>
                            <option value="03:30:00">03:30</option>
                            <option value="04:00:00">04:00</option>
                            <option value="04:30:00">04:30</option>
                            <option value="05:00:00">05:00</option>
                            <option value="05:30:00">05:30</option>
                            <option value="06:00:00">06:00</option>
                            <option value="06:30:00">06:30</option>
                            <option value="07:00:00">07:00</option>
                            <option value="07:30:00">07:30</option>
                            <option value="08:00:00">08:00</option>
                            <option value="08:30:00">08:30</option>
                            <option value="09:00:00">09:00</option>
                            <option value="09:30:00">09:30</option>
                            <option value="10:00:00">10:00</option>
                            <option value="10:30:00">10:30</option>
                            <option value="11:00:00">11:00</option>
                            <option value="11:30:00">11:30</option>
                            <option value="12:00:00">12:00</option>
                            <option value="12:30:00">12:30</option>
                            <option value="13:00:00">13:00</option>
                            <option value="13:30:00">13:30</option>
                            <option value="14:00:00">14:00</option>
                            <option value="14:30:00">14:30</option>
                            <option value="15:00:00">15:00</option>
                            <option value="15:30:00">15:30</option>
                            <option value="16:00:00">16:00</option>
                            <option value="16:30:00">16:30</option>
                            <option value="18:00:00">18:00</option>
                            <option value="18:30:00">18:30</option>
                            <option value="19:00:00">19:00</option>
                            <option value="19:30:00">19:30</option>
                            <option value="20:00:00">20:00</option>
                            <option value="20:30:00">20:30</option>
                            <option value="21:00:00">21:00</option>
                            <option value="21:30:00">21:30</option>
                            <option value="22:00:00">22:00</option>
                            <option value="22:30:00">22:30</option>
                            <option value="23:00:00">23:00</option>
                            <option value="23:30:00">23:30</option>
                        </select>
                    </label>
                    <label htmlFor="padrao-checkin" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Horário Padrão de Checkin
                            <span className='text-red-500 font-bold'> *</span>
                        </span>
                        <select name="padrao-checkin" id="padrao-checkin"
                            className={`border ${err[5] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} defaultValue={'15:00:00'}>
                            <option value="00:00:00">00:00</option>
                            <option value="00:30:00">00:30</option>
                            <option value="01:00:00">01:00</option>
                            <option value="01:30:00">01:30</option>
                            <option value="02:00:00">02:00</option>
                            <option value="02:30:00">02:30</option>
                            <option value="03:00:00">03:00</option>
                            <option value="03:30:00">03:30</option>
                            <option value="04:00:00">04:00</option>
                            <option value="04:30:00">04:30</option>
                            <option value="05:00:00">05:00</option>
                            <option value="05:30:00">05:30</option>
                            <option value="06:00:00">06:00</option>
                            <option value="06:30:00">06:30</option>
                            <option value="07:00:00">07:00</option>
                            <option value="07:30:00">07:30</option>
                            <option value="08:00:00">08:00</option>
                            <option value="08:30:00">08:30</option>
                            <option value="09:00:00">09:00</option>
                            <option value="09:30:00">09:30</option>
                            <option value="10:00:00">10:00</option>
                            <option value="10:30:00">10:30</option>
                            <option value="11:00:00">11:00</option>
                            <option value="11:30:00">11:30</option>
                            <option value="12:00:00">12:00</option>
                            <option value="12:30:00">12:30</option>
                            <option value="13:00:00">13:00</option>
                            <option value="13:30:00">13:30</option>
                            <option value="14:00:00">14:00</option>
                            <option value="14:30:00">14:30</option>
                            <option value="15:00:00">15:00</option>
                            <option value="15:30:00">15:30</option>
                            <option value="16:00:00">16:00</option>
                            <option value="16:30:00">16:30</option>
                            <option value="18:00:00">18:00</option>
                            <option value="18:30:00">18:30</option>
                            <option value="19:00:00">19:00</option>
                            <option value="19:30:00">19:30</option>
                            <option value="20:00:00">20:00</option>
                            <option value="20:30:00">20:30</option>
                            <option value="21:00:00">21:00</option>
                            <option value="21:30:00">21:30</option>
                            <option value="22:00:00">22:00</option>
                            <option value="22:30:00">22:30</option>
                            <option value="23:00:00">23:00</option>
                            <option value="23:30:00">23:30</option>
                        </select>
                    </label>
                </div>
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <label htmlFor="imagem" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Foto de Capa</span>
                        <div id="input-file" className="w-52 max-h-20 cursor-pointer flex border border-zinc-300 rounded-md px-1 py-1 outline-none items-center">
                            <svg className="w-28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#777777"><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                            <p className="text-zinc-400">Clique ou arraste uma imagem aqui</p>
                        </div>
                        <img id="preview" src="" alt="Pré-Visualização da Imagem" className="hidden w-52 max-h-20 object-contain cursor-pointer border border-zinc-300 rounded-md px-1 py-1 outline-none" />
                        <input type="file" name="imagem" id="imagem" accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng" className="absolute w-52 h-20 mt-10 opacity-0"
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
                        <span className="text-zinc-500 font-medium mb-1 text-xs text-center">Qtd. Máxima de Hóspedes</span>
                        <div className="flex justify-center gap-3 items-center">
                            <button className="border border-zinc-300 rounded-md w-8 h-8 font-bold" onClick={() => {
                                if (qtdMaxHospede <= 1)
                                    return
                                else
                                    setQtdMaxHospede(qtdMaxHospede - 1)
                            }}>-</button>
                            <input type="number" name="qtd-max-hospede" id="qtd-max-hospede" className="border border-zinc-300 rounded-md px-2 py-1 outline-none max-w-20 text-center"
                                onChange={(e) => setQtdMaxHospede(Number(e.target.value))} value={qtdMaxHospede} />
                            <button className="border border-zinc-300 rounded-md w-8 h-8 font-bold" onClick={() => setQtdMaxHospede(qtdMaxHospede + 1)}>+</button>
                        </div>
                    </label>
                </div>
                <section className="flex gap-3 justify-end mt-2">
                    <button type="button" className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button type="submit" className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                        onClick={() => {
                            const identificador = document.getElementById('identificador') as HTMLInputElement
                            const status = document.getElementById('status') as HTMLSelectElement
                            const iniOpe = document.getElementById('inicio-operacao') as HTMLInputElement
                            const pdCO = document.getElementById('padrao-checkout') as HTMLInputElement
                            const pdCI = document.getElementById('padrao-checkin') as HTMLInputElement
                            const endereco = document.getElementById('endereco') as HTMLInputElement
                            const valor = document.getElementById('valor-imovel') as HTMLInputElement
                            const comissao = document.getElementById('comissao') as HTMLInputElement
                            const foto = document.getElementById('preview') as HTMLImageElement
                            const qtdMaxHospede = document.getElementById('qtd-max-hospede') as HTMLInputElement

                            if (status.value?.length && iniOpe.value?.length && identificador.value?.length && valor.value) {
                                if (status.value == 'proprio')
                                    createAcomodacao({
                                        "tipo": status.value,
                                        "comissao": null,
                                        "data_ini_ope": iniOpe.value,
                                        "endereco": endereco.value,
                                        "check_in_p": pdCI.value,
                                        "check_out_p": pdCO.value,
                                        "foto": foto.classList.contains('hidden') ? null : foto.src,
                                        "nome": identificador.value,
                                        "numero_hospedes": Number(qtdMaxHospede.value),
                                        "valor_imovel": Number(valor.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                        "desativado": false,
                                        "saas": {
                                            "id": dataToken.id
                                        }
                                    })
                                else if (status.value == 'terceiro' && String(comissao.value).length)
                                    createAcomodacao({
                                        "tipo": status.value,
                                        "comissao": Number(comissao.value),
                                        "data_ini_ope": iniOpe.value,
                                        "endereco": endereco.value,
                                        "check_in_p": pdCI.value,
                                        "check_out_p": pdCO.value,
                                        "foto": foto.classList.contains('hidden') ? null : foto.src,
                                        "nome": identificador.value,
                                        "numero_hospedes": Number(qtdMaxHospede.value),
                                        "valor_imovel": Number(valor.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                        "desativado": false,
                                        "saas": {
                                            "id": dataToken.id
                                        }
                                    })
                            } else {
                                let error = err
                                if (identificador.value.length == 0) {
                                    error = (error.map((e, i) => i === 0 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean]);
                                }
                                else {
                                    error = (error.map((e, i) => i === 0 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean]);
                                }
                                if (status.value.length == 0) {
                                    error = (error.map((e, i) => i === 1 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean]);
                                }
                                else {
                                    error = (error.map((e, i) => i === 1 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean]);
                                }
                                if (iniOpe.value.length == 0) {
                                    error = (error.map((e, i) => i === 2 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean]);
                                }
                                else {
                                    error = (error.map((e, i) => i === 2 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean]);
                                }
                                if (valor.value.length == 0) {
                                    error = (error.map((e, i) => i === 3 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean]);
                                }
                                else {
                                    error = (error.map((e, i) => i === 3 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean]);
                                }
                                setErr(error)
                                alert('Erro ao cadastrar')
                            }
                        }
                        }
                    >Cadastrar</button>
                </section>
            </form>
        </div>
    )
}
