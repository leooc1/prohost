import { useEffect, useState } from "react"
import Loader from "./Loader"
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
interface propsEditar {
    id: number | null
    categoria: number | null
    descricao: string | null
    recebedor: string | null
    acomodacao: number | null
    data: string | null
    valor: string | null
    pago: boolean | null
    saas: number | null
    tipo_despesa: string | null
    obs: string | null
    close: () => void
}


export default function EditarMovimentacao(props: propsEditar) {
    const apiURL = 'https://api.prohost.net.br'
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
        await fetch(`${apiURL}/acomodacao/${props.saas}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setAcomodacao(data.filter((e => !e.desativado)))
            })
            .catch(err => console.log(err))
    }
    async function getCategorias() {
        await fetch(`${apiURL}/categoria_financeiro/${props.saas}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: CategoriaFinanceiro[]) => {
                setCategoriaF(data)
            })
            .catch(err => console.log(err))
    }
    async function editar(pbody: {
        id: number | null
        acomodacao: { id: number | null }
        categoria_financeiro: { id: number | null }
        data: string
        canal_reserva: { id: number | null }
        nome: string
        saas: { id: number | null }
        valor: number
        valor_liq: number
        valor_prop: number
        valor_gestor: number
        reserva: { id: number | null }
        pago: boolean | null
        receita: boolean
        tipo_despesa: string | null
        recebedor: string
        obs: string
    }) {
        await fetch(`${apiURL}/movimentacao/${props.id}`, {
            method: 'PUT',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    alert('Atualizado!')
                    close()
                    location.reload()
                }

            })
            .catch(err => console.log(err))
    }
    async function excluir(id: number) {
        await fetch(`${apiURL}/movimentacao/${id}`, {
            method: 'DELETE',
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    alert('Excluído!')
                    location.reload()
                }
                else {
                    alert('Algo deu errado, tente novamente.')
                }
            })
            .catch(err => console.log(err))
    }

    const [loaded, setLoaded] = useState<boolean>(false)
    const [err, setErr] = useState<[boolean, boolean, boolean]>([false, false, false])
    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [categoriaf, setCategoriaF] = useState<CategoriaFinanceiro[]>([])
    async function loadAll() {
        await getAcomodacoes()
        await getCategorias()
        setLoaded(true)
    }

    useEffect(() => {
        loadAll()
    }, [])

    return (
        loaded ?
            <div className='w-screen h-screen fixed z-10 top-0 right-0'>
                <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={props.close}></div>
                <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                    <h5 className="font-semibold text-2xl mb-2">Editar Movimentação</h5>
                    <section>
                        <span className="text-zinc-500 font-medium">Categoria</span>
                        <div className="mt-2 flex gap-2 flex-wrap">
                        <select name="categoria" id="categoria"
                            className={`${err[1] ? 'border-red-500' : 'border-zinc-300'} font-medium border rounded-md px-2 py-1 outline-none`} /* style={{ color: categoria[1] }} defaultValue={categoria[0]} */
                            /* onChange={(e) => {
                                const cat = categoriaf.find((c) => String(c.id) === e.target.value);
                                if (cat) {
                                    setCategoria([String(cat.id), cat.cor !== '#FFFFFF' ? cat.cor : '#000000']);
                                }
                            }} */>
                            <option value="" className="hidden" disabled selected></option>
                            {categoriaf.length > 0 &&
                                categoriaf.map(cat =>
                                    <option value={String(cat.id)} id={String(cat.id)}
                                        style={{ color: cat.cor != '#FFFFFF' ? cat.cor : '#000000' }}>
                                        {cat.nome}
                                    </option>
                                )}
                        </select>
                    </div>
                    </section>
                    <div className="grid gap-4 grid-cols-2">
                        <label htmlFor="descricao" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição<span className='text-red-500 font-bold'> *</span></span>
                            <input placeholder="Ex: Material de Limpeza" type="text" name="descricao" id="descricao" className={`border ${err[0] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} defaultValue={props.descricao || ''} />
                        </label>
                        <label htmlFor="recebedor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Recebedor</span>
                            <input placeholder="Ex: Mercado Paulista" type="text" name="recebedor" id="recebedor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" defaultValue={props.recebedor || ''} />
                        </label>
                    </div>
                    <label htmlFor="acomodacaoEdit" className={`flex flex-col`}>
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação (opicional)</span>
                        <select name="acomodacaoEdit" id="acomodacaoEdit" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none" defaultValue={props.acomodacao || 'null'}>
                            <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                            <option value="null"></option>
                            {acomodacao?.length > 0 &&
                                acomodacao?.map(a => <option value={a.id}>{a.nome}</option>)}
                        </select>
                    </label>
                    <div className="grid gap-3 items-center" style={{ gridTemplateColumns: '1fr 1fr 0.3fr' }}>
                        <label htmlFor="data" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Data<span className='text-red-500 font-bold'> *</span></span>
                            <input placeholder="dd/mm/aaaa" type="date" name="data" id="data" className={`border ${err[1] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} defaultValue={props.data || ''} />
                        </label>
                        <label htmlFor="valor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Valor<span className='text-red-500 font-bold'> *</span></span>
                            <input
                                onChange={(e) => {
                                    e.target.value = Number(e.target.value).toFixed(2)
                                }}
                                type="number" step={0.01} name="valor" placeholder="R$" id="valor" className={`border ${err[2] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none w-full`} defaultValue={props.valor || ''} />
                        </label>
                        <div className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-2 text-sm">Pago?</span>
                            <label className="switch">
                                <input type="checkbox" id="pago" defaultChecked={props.pago || true} />
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
                        <input placeholder="Opcional" type="text" name="observacao" id="observacao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" defaultValue={props.obs || ''} />
                    </label>
                    <section className="flex gap-3 justify-end mt-2">
                        <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={props.close}>Cancelar</button>
                        <button className="px-3 py-2 border bg-red-400 text-white rounded-lg" onClick={() => {
                            excluir(props.id || 0)
                        }}>Excluir</button>
                        <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                            onClick={async () => {
                                const categoriaInput = document.querySelectorAll('label:has(input[type="radio"]:checked)')[0] as HTMLLabelElement
                                const descricaoInput = document.getElementById('descricao') as HTMLInputElement
                                const acomodacaoInput = document.getElementById('acomodacaoEdit') as HTMLInputElement
                                const dataInput = document.getElementById('data') as HTMLInputElement
                                const valorInput = document.getElementById('valor') as HTMLInputElement
                                const recebedor = document.getElementById('recebedor') as HTMLInputElement
                                const observacaoInput = document.getElementById('observacao') as HTMLInputElement
                                const pago = document.getElementById('pago') as HTMLInputElement
                                let vProprietario: number = 0
                                let vGestor: number = 0
                                if (acomodacaoInput.value != 'null' && acomodacaoInput.value != '' && acomodacao.filter(e => e.id == Number(acomodacaoInput.value))[0].comissao) {
                                    const comissao = acomodacao.filter(a => a.id == Number(acomodacaoInput.value))[0].comissao
                                    vProprietario = ((100 - comissao) / 100) * Number(valorInput.value)
                                    vGestor = (comissao / 100) * Number(valorInput.value)
                                }
                                else {
                                    vProprietario = Number(valorInput.value)
                                    vGestor = Number(valorInput.value)
                                }
                                if ((Boolean(categoriaInput?.htmlFor) && descricaoInput.value.length > 0 && dataInput.value.length > 0 && valorInput.value.length > 0 && Number(valorInput.value) > 0)) {
                                    await editar({
                                        "id": props.id,
                                        "acomodacao": {
                                            "id": Number(acomodacaoInput.value) || null
                                        },
                                        "categoria_financeiro": {
                                            "id": Number(categoriaInput.htmlFor)
                                        },
                                        "data": dataInput.value,
                                        "canal_reserva": {
                                            "id": null
                                        },
                                        "nome": descricaoInput.value,
                                        "saas": {
                                            "id": props.saas
                                        },
                                        "valor": Number(valorInput.value),
                                        "valor_liq": Number(valorInput.value),
                                        "valor_prop": vProprietario,
                                        "valor_gestor": vGestor,
                                        "reserva": {
                                            "id": null
                                        },
                                        "pago": pago.checked,
                                        "receita": false,
                                        "tipo_despesa": props.tipo_despesa,
                                        "recebedor": recebedor.value,
                                        "obs": observacaoInput.value
                                    })
                                }
                                else {
                                    let error = err
                                    if (descricaoInput.value.length == 0) {
                                        error = (error.map((e, i) => i === 0 ? true : e) as [boolean, boolean, boolean]);
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 0 ? false : e) as [boolean, boolean, boolean]);
                                    }
                                    if (dataInput.value.length == 0) {
                                        error = (error.map((e, i) => i === 1 ? true : e) as [boolean, boolean, boolean]);
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 1 ? false : e) as [boolean, boolean, boolean]);
                                    }
                                    if (valorInput.value.length == 0) {
                                        error = (error.map((e, i) => i === 2 ? true : e) as [boolean, boolean, boolean]);
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 2 ? false : e) as [boolean, boolean, boolean]);
                                    }
                                    setErr(error)
                                    alert('Preenchimento incorreto')
                                }
                            }}
                        >Salvar Alterações</button>
                    </section>
                </form>
            </div >
            :
            <Loader />
    )
}
