import { useCallback, useContext, useEffect, useState, ChangeEvent } from "react"
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
    saas: { id: number };
}

export default function RegistrarReceita({ close, saas, onSuccess }: { close: () => void, saas: string, onSuccess?: () => void }) {
    const apiURL = import.meta.env.VITE_API_URL
    const { dataToken } = useContext(SideBarContext)
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)
    const [categoria, setCategoria] = useState<[string, string]>(['', '#000000'])
    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [categoriaf, setCategoriaF] = useState<CategoriaFinanceiro[]>([])
    const [err, setErr] = useState<boolean[]>(Array(4).fill(false))

    const getAcomodacoes = useCallback(async () => {
        if (!dataToken) return
        try {
            const response = await fetch(`${apiURL}/acomodacao/` + dataToken.id, {
                method: 'GET'
            })
            const data: Acomodacao[] = await response.json()
            setAcomodacao(data.filter((e => !e.desativado)))
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
            setCategoriaF(data.filter(e => e.receita))
        } catch (error) {
            console.log(error)
        }
    }, [apiURL, dataToken])

    useEffect(() => {
        getAcomodacoes()
        getCategorias()
    }, [dataToken, getAcomodacoes, getCategorias])

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
                setNotify({ type: 1, text: 'Receita registrada com sucesso!' })
                setShowNotify(true)
                setTimeout(() => {
                    close()
                    if (onSuccess) onSuccess()
                }, 2000)
            } else {
                setNotify({ type: 2, text: 'Erro ao registrar receita.' })
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
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Registrar Receita</h5>

                <section>
                    <span className={`text-zinc-500 font-medium`}>Categoria<span className='text-red-500 font-bold'> *</span></span>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        <select name="categoria" id="categoria"
                            className={`${err[0] ? 'border-red-500' : 'border-zinc-300'} font-medium border rounded-md px-2 py-1 outline-none w-full`} style={{ color: categoria[1] }} defaultValue={categoria[0]}
                            onChange={(e) => {
                                const cat = categoriaf.find((c: CategoriaFinanceiro) => String(c.id) === e.target.value);
                                if (cat) {
                                    setCategoria([String(cat.id), cat.cor !== '#FFFFFF' ? cat.cor : '#000000']);
                                }
                            }}>
                            <option value="" className="hidden" disabled selected></option>
                            {categoriaf.length > 0 &&
                                categoriaf.map((cat: CategoriaFinanceiro) =>
                                    <option value={String(cat.id)} id={String(cat.id)}
                                        style={{ color: cat.cor != '#FFFFFF' ? cat.cor : '#000000' }}>
                                        {cat.nome}
                                    </option>
                                )}
                        </select>
                    </div>
                </section>
                <div className="grid">
                    <label htmlFor="descricao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição<span className='text-red-500 font-bold'> *</span></span>
                        <input placeholder="Ex: Sofá usado" type="text" name="descricao" id="descricao" className={`border ${err[1] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} />
                    </label>
                </div>
                <label htmlFor="acomodacaoReceita" className={`flex flex-col`}>
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação</span>
                    <select name="acomodacaoReceita" id="acomodacaoReceita" className="border border-zinc-300 rounded-md text-zinc-500 px-2 py-1 outline-none">
                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                        <option value="null" ></option>
                        {acomodacao?.length > 0 &&
                            acomodacao?.map((a: Acomodacao) => <option value={a.id}>{a.nome}</option>)}
                    </select>
                </label>
                <div className="grid gap-3 items-center grid-cols-2">
                    <label htmlFor="data" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Data<span className='text-red-500 font-bold'> *</span></span>
                        <input placeholder="dd/mm/aaaa" type="date" name="data" id="data" className={`border ${err[2] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} />
                    </label>
                    <label htmlFor="valor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Valor<span className='text-red-500 font-bold'> *</span></span>
                        <input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const { value } = e.target;
                                const isNegative = value.startsWith('-');
                                let numericValue = value.replace(/[^0-9]/g, '');

                                if (numericValue) {
                                    if (numericValue.length < 3) {
                                        numericValue = numericValue.padStart(3, '0');
                                    }
                                    let integerPart = numericValue.slice(0, -2);
                                    const decimalPart = numericValue.slice(-2);
                                    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                    e.target.value = `${isNegative ? '-' : ''}${integerPart || '0'},${decimalPart}`;
                                } else {
                                    e.target.value = isNegative ? '-' : '';
                                }
                            }}
                            type="text" name="valor" placeholder="R$" id="valor" className={`border ${err[3] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none w-full`} />
                    </label>
                </div>
                <label htmlFor="observacao" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Observação</span>
                    <input placeholder="Opcional" type="text" name="observacao" id="observacao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                        onClick={async () => {
                            const categoriaInput = document.getElementById('categoria') as HTMLSelectElement
                            const descricaoInput = document.getElementById('descricao') as HTMLInputElement
                            const acomodacaoInput = document.getElementById('acomodacaoReceita') as HTMLSelectElement
                            const dataInput = document.getElementById('data') as HTMLInputElement
                            const valorInput = document.getElementById('valor') as HTMLInputElement
                            const observacaoInput = document.getElementById('observacao') as HTMLInputElement

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

                            const newErr = Array(4).fill(false)
                            let valid = true

                            if (categoriaInput.value.length === 0) { newErr[0] = true; valid = false }
                            if (descricaoInput.value.length === 0) { newErr[1] = true; valid = false }
                            if (dataInput.value.length === 0) { newErr[2] = true; valid = false }
                            if (valorInput.value.length === 0 || valorFloat === 0) { newErr[3] = true; valid = false }

                            setErr(newErr)

                            if (valid) {
                                await create({
                                    "acomodacao": {
                                        "id": Number(acomodacaoInput.value) || null
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
                                    "comissao_ota": 0,
                                    "reserva": {
                                        "id": null
                                    },
                                    "pago": null,
                                    "receita": true,
                                    "tipo_despesa": Number(acomodacaoInput.value) ? null : 'Receita do Negócio',
                                    "obs": observacaoInput.value
                                })
                            }
                            else {
                                setNotify({ type: 2, text: 'Preenchimento incorreto!' })
                                setShowNotify(true)
                                setTimeout(() => {
                                    setShowNotify(false);
                                }, 3000)
                            }
                        }}
                    >Registrar Movimentação</button>
                </section>
            </form>
        </div>
    )
}