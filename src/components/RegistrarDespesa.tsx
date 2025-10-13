import { useCallback, ChangeEvent, useContext, useEffect, useState } from "react"
import { SideBarContext } from "../contexts/SideBarMenuContext"
import Notify from "./notify/Notify"

interface Acomodacao {
    id: number
    tipo: string
    comissao: number
    data_ini_ope: string
    descricao: string
    endereco: string
    check_in_p: string
    check_out_p: string
    foto: string
    nome: string
    numero_hospedes: number
    valor_imovel: number
    desativado: boolean
    saas: { id: number }
}

interface CategoriaFinanceiro {
    id?: number;
    cor: string;
    editavel: boolean;
    nome: string;
    receita: boolean
    tipo_despesa: string | null
    saas: { id: number };
}

export default function RegistrarDespesa({ close, saas, despesa, idNotify, onSuccess }: {
    close: () => void, saas: string, despesa?: null | {
        acomodacao: {
            id: string | null;
        };
        categoria_financeiro: {
            id: number | string;
        };
        data: string;
        canal_reserva: {
            id: number | null;
        };
        nome: string;
        saas: {
            id: number;
        };
        valor: number;
        valor_liq: number;
        valor_prop: number;
        valor_gestor: number;
        reserva: {
            id: number | null;
        };
        pago: boolean;
        receita: boolean;
        tipo_despesa: string;
        recebedor: string;
        obs: string;
    }, idNotify?: string | null, onSuccess?: () => void
}) {
    const apiURL = import.meta.env.VITE_API_URL
    const { dataToken } = useContext(SideBarContext)

    const [tipoDespesa, setTipoDespesa] = useState(despesa?.tipo_despesa || '')
    const [categoria, setCategoria] = useState<[string, string]>([despesa?.categoria_financeiro.id.toString() || '', '#000000'])
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)
    const [load, setLoad] = useState(false)
    const [err, setErr] = useState<boolean[]>(Array(6).fill(false))
    const [recorrencia, setRecorrencia] = useState(!!despesa)
    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [categoriaf, setCategoriaF] = useState<CategoriaFinanceiro[]>([])

    const getAcomodacoes = useCallback(async () => {
        if (!dataToken) return
        try {
            const response = await fetch(`${apiURL}/acomodacao/` + dataToken.id, {
                method: 'GET'
            })
            const data: Acomodacao[] = await response.json()
            setAcomodacao(data.filter(e => !e.desativado))
        } catch (error) {
            console.log(error)
        }
    }, [apiURL, dataToken])

    const getCategorias = useCallback(async () => {
        if (!dataToken) return
        try {
            const response = await fetch(`${apiURL}/categoria_financeiro/` + dataToken.id, {
                method: 'GET'
            })
            const data: CategoriaFinanceiro[] = await response.json()
            setCategoriaF(data.filter(e => !e.receita))
        } catch (error) {
            console.log(error)
        }
    }, [apiURL, dataToken])

    const getAll = useCallback(async () => {
        await getAcomodacoes()
        await getCategorias()
        setLoad(true)
    }, [getAcomodacoes, getCategorias])

    useEffect(() => {
        getAll()
    }, [dataToken, getAll])

    async function create(data: any) {
        try {
            const response = await fetch(`${apiURL}/movimentacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                setNotify({ type: 1, text: 'Despesa registrada com sucesso!' })
                setShowNotify(true)
                setTimeout(() => {
                    close()
                    if (onSuccess) onSuccess()
                }, 2000)
            } else {
                setNotify({ type: 2, text: 'Erro ao registrar despesa.' })
                setShowNotify(true)
            }
        } catch (error) {
            console.log(error)
            setNotify({ type: 2, text: 'Erro de conexão.' })
            setShowNotify(true)
        }
    }

    async function deleteRecorrencia(id: number, data: any) {
        try {
            const response = await fetch(`${apiURL}/recorrencia/` + id, {
                method: 'DELETE'
            })
            if (response.ok) {
                await create(data)
            } else {
                setNotify({ type: 2, text: 'Erro ao lidar com recorrência.' })
                setShowNotify(true)
            }
        } catch (error) {
            console.log(error)
            setNotify({ type: 2, text: 'Erro de conexão.' })
            setShowNotify(true)
        }
    }

    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={close}></div>
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            {load && <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute min-w-80 max-h-screen overflow-scroll scroll-default px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Registrar Despesa</h5>
                <label htmlFor="tipo-despesa" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Tipo de Despesa<span className='text-red-500 font-bold'> *</span></span>
                    <select name="tipo-despesa" id="tipo-despesa" className={`${tipoDespesa == '' ? 'text-zinc-400' : ''}  ${err[0] ? 'border-red-500' : 'border-zinc-300'} font-medium border rounded-md text-zinc-500 px-2 py-1 outline-none`} defaultValue={despesa?.tipo_despesa}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setTipoDespesa(e.target.value) }}>
                        <option value="" selected disabled className="hidden">Padrão</option>
                        <option value="Despesas do Negócio" className="text-black">Despesas do Negócio</option>
                        <option value="Despesas Fixas" className="text-black">Despesas Fixas</option>
                        <option value="Despesas Variáveis" className="text-black">Despesas Variáveis</option>
                    </select>
                </label>
                <section>
                    <span className={`text-zinc-500 font-medium`}>Categoria<span className='text-red-500 font-bold'> *</span></span>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        <select name="categoria" id="categoria"
                            className={`${err[1] ? 'border-red-500' : 'border-zinc-300'} font-medium border rounded-md px-2 py-1 outline-none`} style={{ color: categoria[1] }} defaultValue={despesa?.categoria_financeiro.id}
                            onChange={(e) => {
                                const cat = categoriaf.find((c: CategoriaFinanceiro) => String(c.id) === e.target.value);
                                if (cat) {
                                    setCategoria([String(cat.id), cat.cor !== '#FFFFFF' ? cat.cor : '#000000']);
                                }
                            }}>
                            <option value="" className="hidden" disabled ></option>
                            {categoriaf.length > 0 &&
                                categoriaf.map((cat: CategoriaFinanceiro) => {
                                    if (cat.tipo_despesa == tipoDespesa || cat.tipo_despesa == null || tipoDespesa == '')
                                        return <option value={String(cat.id)} id={String(cat.id)}
                                            style={{ color: cat.cor != '#FFFFFF' ? cat.cor : '#000000' }}>
                                            {cat.nome}
                                        </option>
                                    else return null
                                }
                                )}
                        </select>
                    </div>
                </section>
                <section className="flex justify-between">
                    <div className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-2 text-sm">Despesa recorrente?</span>
                        <label className="switch">
                            <input type="checkbox" id="recorrencia" onChange={(e) => { setRecorrencia(e.target.checked) }} defaultChecked={recorrencia} />
                            <div className="slider">
                                <div className="circle">
                                    <svg className="cross" viewBox="0 0 365.696 365.696" y="0" x="0" height="6" width="6" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                                        </g>
                                    </svg>
                                    <svg className="checkmark" viewBox="0 0 24 24" y="0" x="0" height="10" width="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path className="" data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </label>
                    </div>
                    {recorrencia && <div className="flex items-center gap-4">
                        <span className="text-zinc-500 font-medium mb-2 text-sm">A cada</span>
                        <input type="number" name="meses-recorrencia" id="meses-recorrencia"
                            className={`border border-zinc-300 rounded-md px-2 py-1 outline-none w-12`} placeholder="1" />
                        <span className="text-zinc-500 font-medium mb-2 text-sm">meses</span>
                    </div>}
                </section>
                <div className="grid gap-4 grid-cols-2">
                    <label htmlFor="descricao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição<span className='text-red-500 font-bold'> *</span></span>
                        <input placeholder="Ex: Manutenção ar condicionado" type="text" name="descricao" id="descricao" className={`border ${err[2] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} defaultValue={despesa?.nome} />
                    </label>
                    <label htmlFor="recebedor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Recebedor</span>
                        <input placeholder="Ex: Empresa de Refrigeração" type="text" name="recebedor" id="recebedor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" defaultValue={despesa?.recebedor} />
                    </label>
                </div>
                <label htmlFor="acomodacaoReceita" className={`flex flex-col ${(tipoDespesa == 'Despesas do Negócio') || despesa?.tipo_despesa == 'Despesas do Negócio' ? 'hidden' : ''}`}>
                    <span className="text-zinc-500 font-medium mb-1 text-sm">
                        Acomodação
                        {(tipoDespesa === 'Despesas Fixas' || tipoDespesa === 'Despesas Variáveis' || despesa?.tipo_despesa === 'Despesas Fixas' || despesa?.tipo_despesa === 'Despesas Variáveis') ? <span className='text-red-500 font-bold'> *</span> : <span className='text-zinc-400'> (Opcional)</span>}
                    </span>
                    <select
                        name="acomodacaoReceita"
                        id="acomodacaoReceita"
                        className={`border ${((tipoDespesa === 'Despesas Fixas' || tipoDespesa === 'Despesas Variáveis') && err[5]) ? 'border-red-500' : 'border-zinc-300'} rounded-md text-zinc-500 px-2 py-1 outline-none`}
                        defaultValue={String(despesa?.acomodacao?.id)}
                        required={tipoDespesa === 'Despesas Fixas' || tipoDespesa === 'Despesas Variáveis' || despesa?.tipo_despesa === 'Despesas Fixas' || despesa?.tipo_despesa === 'Despesas Variáveis'}
                    >
                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                        <option value="null"></option>
                        {acomodacao?.length > 0 &&
                            acomodacao?.map((a: Acomodacao) => <option value={a.id}>{a.nome}</option>)}
                    </select>
                    {((tipoDespesa === 'Despesas Fixas' || tipoDespesa === 'Despesas Variáveis') && err[5]) && (
                        <span className="text-red-500 text-xs mt-1">Obrigatório para despesas fixas ou variáveis.</span>
                    )}
                </label>
                <div className="grid gap-3 items-center" style={{ gridTemplateColumns: '1fr 1fr 0.3fr' }}>
                    <label htmlFor="data" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Data<span className='text-red-500 font-bold'> *</span></span>
                        <input placeholder="dd/mm/aaaa" type="date" name="data" id="data" className={`border ${err[3] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} defaultValue={despesa?.data} />
                    </label>
                    <label htmlFor="valor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Valor<span className='text-red-500 font-bold'> *</span></span>
                        <input
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                value = (Number(value) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                e.target.value = value;
                            }}
                            type="text" name="valor" placeholder="R$" id="valor" className={`border ${err[4] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none w-full`}
                            defaultValue={despesa?.valor}
                        />
                    </label>
                    <div className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-2 text-sm">Pago?</span>
                        <label className="switch">
                            <input type="checkbox" id="pago" defaultChecked />
                            <div className="slider">
                                <div className="circle">
                                    <svg className="cross" viewBox="0 0 365.696 365.696" y="0" x="0" height="6" width="6" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                                        </g>
                                    </svg>
                                    <svg className="checkmark" viewBox="0 0 24 24" y="0" x="0" height="10" width="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path className="" data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
                <label htmlFor="observacao" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Observação</span>
                    <input placeholder="Opcional" type="text" name="observacao" id="observacao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" defaultValue={despesa?.obs} />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                        onClick={async () => {
                            const categoriaInput = document.getElementById('categoria') as HTMLSelectElement
                            const descricaoInput = document.getElementById('descricao') as HTMLInputElement
                            const acomodacaoInput = document.getElementById('acomodacaoReceita') as HTMLSelectElement
                            const tipoDespesaInput = document.getElementById('tipo-despesa') as HTMLSelectElement
                            const dataInput = document.getElementById('data') as HTMLInputElement
                            const valorInput = document.getElementById('valor') as HTMLInputElement
                            const recebedor = document.getElementById('recebedor') as HTMLInputElement
                            const observacaoInput = document.getElementById('observacao') as HTMLInputElement
                            const pago = document.getElementById('pago') as HTMLInputElement

                            const valorFloat = parseFloat(valorInput.value.replace('.', '').replace(',', '.'))

                            let vProprietario: number = 0
                            let vGestor: number = 0
                            const selectedAcomodacao = acomodacao.find(e => e.id === Number(acomodacaoInput.value));

                            if (selectedAcomodacao && selectedAcomodacao.comissao) {
                                vProprietario = ((100 - selectedAcomodacao.comissao) / 100) * valorFloat
                                vGestor = (selectedAcomodacao.comissao / 100) * valorFloat
                            } else {
                                vProprietario = valorFloat
                                vGestor = valorFloat
                            }

                            const isFixaOuVariavel = tipoDespesaInput.value === 'Despesas Fixas' || tipoDespesaInput.value === 'Despesas Variáveis';
                            const acomodacaoValida = acomodacaoInput.value !== '' && acomodacaoInput.value !== 'null';

                            const newErr = Array(6).fill(false)
                            let valid = true

                            if (tipoDespesaInput.value.length === 0) { newErr[0] = true; valid = false }
                            if (categoriaInput.value.length === 0) { newErr[1] = true; valid = false }
                            if (descricaoInput.value.length === 0) { newErr[2] = true; valid = false }
                            if (dataInput.value.length === 0) { newErr[3] = true; valid = false }
                            if (valorInput.value.length === 0 || valorFloat <= 0) { newErr[4] = true; valid = false }
                            if (isFixaOuVariavel && !acomodacaoValida) { newErr[5] = true; valid = false }

                            setErr(newErr)

                            if (valid) {
                                const data = {
                                    "acomodacao": {
                                        "id": tipoDespesaInput.value === 'Despesas do Negócio' ? null : Number(acomodacaoInput.value) || null
                                    },
                                    "categoria_financeiro": {
                                        "id": categoriaInput.value
                                    },
                                    "data": dataInput.value,
                                    "canal_reserva": {
                                        "id": null
                                    },
                                    "nome": descricaoInput.value,
                                    "saas": {
                                        "id": saas
                                    },
                                    "valor": valorFloat,
                                    "valor_liq": valorFloat,
                                    "valor_prop": vProprietario,
                                    "valor_gestor": vGestor,
                                    "reserva": {
                                        "id": null
                                    },
                                    "pago": pago.checked,
                                    "receita": false,
                                    "tipo_despesa": tipoDespesaInput.value,
                                    "recebedor": recebedor.value,
                                    "obs": observacaoInput.value
                                }

                                if (idNotify) {
                                    await deleteRecorrencia(Number(idNotify), data)
                                } else {
                                    await create(data)
                                }
                            }
                            else {
                                setNotify({ type: 2, text: isFixaOuVariavel && !acomodacaoValida ? 'Selecione uma acomodação para este tipo de despesa!' : 'Preenchimento incorreto!' })
                                setShowNotify(true)
                                setTimeout(() => {
                                    setShowNotify(false);
                                }, 3000)
                            }
                        }}
                    >Registrar Movimentação</button>
                </section>
            </form>}
        </div>
    )
}
