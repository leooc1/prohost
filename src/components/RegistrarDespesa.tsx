import { ChangeEvent, useContext, useEffect, useState } from "react"
import { SideBarContext } from "../contexts/SideBarMenuContext"
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


export default function RegistrarDespesa({ close, saas }: { close: () => void, saas: string }) {
    const { dataToken } = useContext(SideBarContext)

    const [tipoDespesa, setTipoDespesa] = useState('')
    const setCategoria = () => {
        const categorias = document.querySelectorAll('label:has(input[type="radio"])')
        categorias.forEach((e: any) => {
            if (e.children[1].checked) {
                e.classList.add('outline')
                e.classList.add('outline-2')
                e.classList.add('outline-slate-700')
                e.classList.add('bg-slate-300')
                e.classList.remove('bg-slate-100')
            }
            else {
                e.classList.remove('outline')
                e.classList.remove('outline-2')
                e.classList.remove('outline-slate-700')
                e.classList.remove('bg-slate-300')
                e.classList.add('bg-slate-100')
            }
        })
    }
    async function getAcomodacoes() {
        await fetch('https://api.prohost.net.br/acomodacao/' + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setAcomodacao(data.filter((e => !e.desativado)))
            })
            .catch(err => console.log(err))
    }
    async function getCategorias() {
        await fetch('https://api.prohost.net.br/categoria_financeiro/' + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: CategoriaFinanceiro[]) => {
                setCategoriaF(data.filter(e => !e.receita))
            })
            .catch(err => console.log(err))
    }
    async function create(pbody: any) {
        await fetch(`https://api.prohost.net.br/movimentacao/`, {
            method: 'POST',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.id) {
                    alert('CRIADO!')
                    close()
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    }

    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [categoriaf, setCategoriaF] = useState<CategoriaFinanceiro[]>([])

    useEffect(() => {
        getAcomodacoes()
        getCategorias()
    }, [dataToken])
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Registrar Despesa</h5>
                <label htmlFor="tipo-despesa" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Tipo de Despesa</span>
                    <select name="tipo-despesa" id="tipo-despesa" className={`${tipoDespesa == '' ? 'text-zinc-400' : ''} font-medium border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none`}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setTipoDespesa(e.target.value) }}>
                        <option value="" selected disabled className="hidden">Padrão</option>
                        <option value="Despesas do Negócio" className="text-black">Despesas do Negócio</option>
                        <option value="Despesas Fixas" className="text-black">Despesas Fixas</option>
                        <option value="Despesas Variáveis" className="text-black">Despesas Variáveis</option>
                    </select>
                </label>
                <section>
                    <span className="text-zinc-500 font-medium">Categoria</span>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {categoriaf.length > 0 &&
                            categoriaf.map(cat => <label htmlFor={String(cat.id)} onClick={() => setCategoria()} className="bg-slate-100 text-sm font-medium cursor-pointer flex items-center text-slate-500 rounded-2xl px-2 py-px">
                                <div className={`w-2 h-2 rounded-full mr-2 bg-[${cat.cor}]`}></div>
                                {cat.nome}
                                <input type="radio" name="categoria" id={String(cat.id)} className="hidden" />
                            </label>)}
                    </div>
                </section>
                <div className="grid gap-4 grid-cols-2">
                    <label htmlFor="descricao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição</span>
                        <input placeholder="Ex: Sofá usado" type="text" name="descricao" id="descricao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="recebedor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Recebedor</span>
                        <input placeholder="Ex: Mercado Paulista" type="text" name="recebedor" id="recebedor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                </div>
                <label htmlFor="acomodacaoReceita" className={`flex flex-col ${tipoDespesa == 'Despesas do Negócio' ? 'hidden' : null}`}>
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação (opicional)</span>
                    <select name="acomodacaoReceita" id="acomodacaoReceita" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                        <option value="null"></option>
                        {acomodacao?.length > 0 &&
                            acomodacao?.map(a => <option value={a.id}>{a.nome}</option>)}
                    </select>
                </label>
                <div className="grid gap-3 items-center" style={{ gridTemplateColumns: '1fr 1fr 0.3fr' }}>
                    <label htmlFor="data" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Data</span>
                        <input placeholder="dd/mm/aaaa" type="date" name="data" id="data" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="valor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Valor</span>
                        <input
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
                            }}
                            type="text" name="valor" placeholder="R$" id="valor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full" />
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
                    <input placeholder="Opcional" type="text" name="observacao" id="observacao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                        onClick={async () => {
                            const categoriaInput = document.querySelectorAll('label:has(input[type="radio"]:checked)')[0] as HTMLLabelElement
                            const descricaoInput = document.getElementById('descricao') as HTMLInputElement
                            const acomodacaoInput = document.getElementById('acomodacaoReceita') as HTMLInputElement
                            const tipoDespesa = document.getElementById('tipo-despesa') as HTMLInputElement
                            const dataInput = document.getElementById('data') as HTMLInputElement
                            const valorInput = document.getElementById('valor') as HTMLInputElement
                            const recebedor = document.getElementById('recebedor') as HTMLInputElement
                            const observacaoInput = document.getElementById('observacao') as HTMLInputElement
                            const pago = document.getElementById('pago') as HTMLInputElement
                            let vProprietario: number = 0
                            let vGestor: number = 0
                            if (acomodacaoInput.value != 'null' && acomodacaoInput.value != '' && acomodacao.filter(e => e.id == Number(acomodacaoInput.value))[0].comissao) {
                                const comissao = acomodacao.filter(a => a.id == Number(acomodacaoInput.value))[0].comissao
                                vProprietario = ((100 - comissao) / 100) * Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                                vGestor = (comissao / 100) * Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                            }
                            else {
                                vProprietario = Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                                vGestor = Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                            }
                            if ((Boolean(categoriaInput?.htmlFor) && descricaoInput.value.length > 0 && dataInput.value.length > 0 && tipoDespesa.value.length > 0 && valorInput.value.length > 0 && Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) > 0)) {
                                await create({
                                    "acomodacao": {
                                        "id": tipoDespesa.value == 'Despesas do Negócio' ? null : Number(acomodacaoInput.value) || null
                                    },
                                    "categoria_financeiro": {
                                        "id": categoriaInput.htmlFor
                                    },
                                    "data": dataInput.value,
                                    "canal_reserva": {
                                        "id": null
                                    },
                                    "nome": descricaoInput.value,
                                    "saas": {
                                        "id": saas
                                    },
                                    "valor": Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                    "valor_liq": Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                    "valor_prop": vProprietario,
                                    "valor_gestor": vGestor,
                                    "reserva": {
                                        "id": null
                                    },
                                    "pago": pago.checked,
                                    "receita": false,
                                    "tipo_despesa": tipoDespesa.value,
                                    "recebedor": recebedor.value,
                                    "obs": observacaoInput.value
                                })
                            }
                            else {
                                if (!(categoriaInput?.htmlFor)) {
                                    alert('Selecione uma categoria')
                                } else
                                    alert('Preenchimento incorreto')
                            }
                        }}
                    >Registrar Movimentação</button>
                </section>
            </form>
        </div>
    )
}
