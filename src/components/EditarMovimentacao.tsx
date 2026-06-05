import { useEffect, useState } from "react"
import Loader from "./Loader"
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
interface propsEditar {
    id: number | null
    categoria: number | null
    descricao: string | null
    recebedor: string | null
    acomodacao: number | null
    data: string | null
    valor: string | null
    pago: boolean 
    saas: number | null
    tipo_despesa: string | null
    obs: string | null
    despesa: boolean
    close: () => void
}


export default function EditarMovimentacao(props: propsEditar) {
    const apiURL = import.meta.env.VITE_API_URL
    async function getAcomodacoes() {
        await fetch(`${apiURL}/acomodacao/names/${props.saas}`, {
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
    async function editar(
        pbody: {
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
            comissao_ota: number
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
                    if (recorrencia) {
                        editarRecorrencia(pbody.data)
                    }
                    else {
                        setNotify({ type: 1, text: 'Atualizado!' })
                        setShowNotify(true)
                        setTimeout(() => {
                            setShowNotify(false);
                            location.reload()
                        }, 3000)
                    }
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
                    setNotify({ type: 1, text: 'Excluído!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                        location.reload()
                    }, 3000)
                }
                else {
                    setNotify({ type: 2, text: 'Algo deu errado, tente novamente.' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                }
            })
            .catch(err => console.log(err))
    }

    const [loaded, setLoaded] = useState<boolean>(false)
    const [err, setErr] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false])
    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [categoriaf, setCategoriaF] = useState<CategoriaFinanceiro[]>([])
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)
    const [mesRecorrencia, setMesRecorrencia] = useState<number>(1)
    const [recorrenciaP, setRecorrenciaP] = useState<boolean>(props.despesa ? true : false)
    const [tipoDespesa, setTipoDespesa] = useState<string>(props.tipo_despesa || '')

    const [recorrencia, setRecorrencia] = useState<null | {
        id: number
        meses_recorrencia: number
        data: string
        despesa: {
            id: number
        }
    }>(null)
    async function loadAll() {
        await getAcomodacoes()
        await getCategorias()
        setLoaded(true)
    }

    async function getNotify() {
        await fetch(`${apiURL}/recorrencia/` + props.id + '/despesa', {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: any[]) => {
                if (data.length > 0) {
                    setRecorrencia({
                        id: data[data.length - 1].id,
                        data: data[data.length - 1].data,
                        despesa: { id: data[data.length - 1].despesa.id },
                        meses_recorrencia: data[data.length - 1].meses_recorrencia
                    })
                    setMesRecorrencia(data[data.length - 1].meses_recorrencia)
                }
                else
                    setRecorrencia(null)
            })
            .catch(err => console.log(err))
    }

    async function editarRecorrencia(data: string) {
        await fetch(`${apiURL}/recorrencia/${recorrencia?.id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...recorrencia, data: data, meses_recorrencia: mesRecorrencia }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    setNotify({ type: 1, text: 'Atualizado!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                        location.reload()
                    }, 3000)
                }

            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        loadAll()
        getNotify()
    }, [])

    return (
        loaded ?
            <div className='w-screen h-screen fixed z-10 top-0 right-0'>
                <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={props.close}></div>
                {showNotify && <Notify type={notify.type} text={notify.text} />}
                <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2 max-h-[90vh] overflow-y-auto">
                    <h5 className="font-semibold text-2xl mb-2">Editar {props.despesa ? 'Despesa' : 'Receita'}</h5>
                    <section>
                        <span className="text-zinc-500 font-medium">Categoria</span>
                        <div className="mt-2 flex gap-2 flex-wrap">
                            <select name="categoria" id="categoria"
                                className={`border-zinc-300 font-medium border rounded-md px-2 py-1 outline-none`} defaultValue={String(props.categoria)}>
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

                    {/* SEÇÃO ESPECÍFICA PARA DESPESA */}
                    {props.despesa && (
                        <>
                            <section className="flex justify-between">
                                <div className="flex flex-col">
                                    <span className="text-zinc-500 font-medium mb-2 text-sm">Despesa recorrente?</span>
                                    <label className="switch">
                                        <input type="checkbox" id="recorrencia" onChange={(e) => { setRecorrenciaP(e.target.checked) }} defaultChecked={false} />
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
                                {recorrenciaP && <div className="flex items-center gap-4">
                                    <span className="text-zinc-500 font-medium mb-2 text-sm">A cada</span>
                                    <input type="number" name="meses-recorrencia" id="meses-recorrencia"
                                        className={`border border-zinc-300 rounded-md px-2 py-1 outline-none w-12`} placeholder="1" value={mesRecorrencia} onChange={(e) => {
                                            if (Number(e.target.value) < 1) {
                                                e.target.value = '1'
                                                setMesRecorrencia(1)
                                            } else {
                                                setMesRecorrencia(Number(e.target.value))
                                            }
                                        }} />
                                    <span className="text-zinc-500 font-medium mb-2 text-sm">meses</span>
                                </div>}
                            </section>

                            <label htmlFor="tipoDespesa" className="flex flex-col">
                                <span className="text-zinc-500 font-medium mb-1 text-sm">Tipo de Despesa<span className='text-red-500 font-bold'> *</span></span>
                                <select
                                    name="tipoDespesa"
                                    id="tipoDespesa"
                                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                    value={tipoDespesa}
                                    onChange={(e) => setTipoDespesa(e.target.value)}
                                >
                                    <option value="" disabled hidden>Selecione um tipo</option>
                                    <option value="Despesas do Negócio">Do Negócio</option>
                                    <option value="Despesas Fixas">Fixas</option>
                                    <option value="Despesas Variáveis">Variáveis</option>
                                </select>
                            </label>

                            {(tipoDespesa === 'Despesas Fixas' || tipoDespesa === 'Despesas Variáveis') && (
                                <label htmlFor="acomodacaoDespesa" className="flex flex-col">
                                    <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação<span className='text-red-500 font-bold'> *</span></span>
                                    <select name="acomodacaoDespesa" id="acomodacaoDespesa" className={`border ${err[3] ? 'border-red-500' : 'border-zinc-300'} rounded-md text-zinc-500 px-2 py-1 outline-none`} defaultValue={props.acomodacao || 'null'}>
                                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                                        {acomodacao?.length > 0 &&
                                            acomodacao?.map(a => <option value={a.id}>{a.nome}</option>)}
                                    </select>
                                </label>
                            )}
                        </>
                    )}

                    <div className="grid gap-4 grid-cols-2">
                        <label htmlFor="descricao" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição<span className='text-red-500 font-bold'> *</span></span>
                            <input placeholder={props.despesa ? "Ex: Material de Limpeza" : "Ex: Diária recebida"} type="text" name="descricao" id="descricao" className={`border ${err[0] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} defaultValue={props.descricao || ''} />
                        </label>
                        <label htmlFor="recebedor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm">{props.despesa ? 'Fornecedor' : 'Recebedor'}</span>
                            <input placeholder={props.despesa ? "Ex: Mercado Paulista" : "Ex: Hospede"} type="text" name="recebedor" id="recebedor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" defaultValue={props.recebedor || ''} />
                        </label>
                    </div>

                    {!props.despesa && (
                        <label htmlFor="acomodacaoEdit" className={`flex flex-col`}>
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação (opcional)</span>
                            <select name="acomodacaoEdit" id="acomodacaoEdit" className="border border-zinc-300 rounded-md text-zinc-500 px-2 py-1 outline-none" defaultValue={props.acomodacao || 'null'}>
                                <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                                <option value="null"></option>
                                {acomodacao?.length > 0 &&
                                    acomodacao?.map(a => <option value={a.id}>{a.nome}</option>)}
                            </select>
                        </label>
                    )}

                    <div className="grid gap-3 items-center" style={{ gridTemplateColumns: props.despesa ? '1fr 1fr 0.3fr' : '1fr 1fr 0.3fr' }}>
                        <label htmlFor="data" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Data<span className='text-red-500 font-bold'> *</span></span>
                            <input placeholder="dd/mm/aaaa" type="date" name="data" id="data" className={`border ${err[1] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} defaultValue={props.data || ''} />
                        </label>
                        <label htmlFor="valor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm">Valor<span className='text-red-500 font-bold'> *</span></span>
                            <input
                                onChange={(e) => {
                                    if (e.target.value.replace(/[.,]/gm, '').length <= 3)
                                        e.target.value = e.target.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})$/gm, '$1,$2')
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
                                type="text" name="valor" placeholder="R$" id="valor" className={`border ${err[2] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none w-full`} defaultValue={props.valor || ''} />
                        </label>
                        <div className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-2 text-sm">{props.despesa ? 'Pago?' : 'Recebido?'}</span>
                            <label className="switch">
                                <input type="checkbox" id="pago" defaultChecked={props.pago} />
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
                                const categoriaInput = document.getElementById('categoria') as HTMLInputElement
                                const descricaoInput = document.getElementById('descricao') as HTMLInputElement
                                const acomodacaoInput = document.getElementById('acomodacaoEdit') as HTMLInputElement
                                const acomodacaoDespesaInput = document.getElementById('acomodacaoDespesa') as HTMLInputElement
                                const dataInput = document.getElementById('data') as HTMLInputElement
                                const valorInput = document.getElementById('valor') as HTMLInputElement
                                const recebedor = document.getElementById('recebedor') as HTMLInputElement
                                const observacaoInput = document.getElementById('observacao') as HTMLInputElement
                                const pago = document.getElementById('pago') as HTMLInputElement
                                let vProprietario: number = 0
                                let vGestor: number = 0
                                const acomodacaoParaCalculo = acomodacaoDespesaInput?.value || acomodacaoInput?.value
                                if (acomodacaoParaCalculo && acomodacaoParaCalculo != 'null' && acomodacaoParaCalculo != '' && acomodacao.filter(e => e.id == Number(acomodacaoParaCalculo))[0]?.comissao) {
                                    const comissao = acomodacao.filter(a => a.id == Number(acomodacaoParaCalculo))[0].comissao
                                    vProprietario = ((100 - comissao) / 100) * Number(valorInput.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})$/gm, '$1.$2'))
                                    vGestor = (comissao / 100) * Number(valorInput.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})$/gm, '$1.$2'))
                                }
                                else {
                                    vProprietario = Number(valorInput.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})$/gm, '$1.$2'))
                                    vGestor = Number(valorInput.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})$/gm, '$1.$2'))
                                }
                                const isFixaOuVariavel = tipoDespesa === 'Despesas Fixas' || tipoDespesa === 'Despesas Variáveis'
                                if ((Boolean(categoriaInput.value.length) && descricaoInput.value.length > 0 && dataInput.value.length > 0 && valorInput.value.length > 0 && Number(valorInput.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})$/gm, '$1.$2')) > 0 && (!props.despesa || tipoDespesa.length > 0) && (!isFixaOuVariavel || (acomodacaoDespesaInput && acomodacaoDespesaInput.value != 'null' && acomodacaoDespesaInput.value != '')))) {
                                    await editar({
                                        "id": props.id,
                                        "acomodacao": {
                                            "id": tipoDespesa === 'Despesas do Negócio' ? null : (acomodacaoDespesaInput && acomodacaoDespesaInput.value != 'null' ? Number(acomodacaoDespesaInput.value) || null : (!props.despesa && acomodacaoInput ? Number(acomodacaoInput.value) || null : null))
                                        },
                                        "categoria_financeiro": {
                                            "id": Number(categoriaInput.value)
                                        },
                                        "data": dataInput.value,
                                        "canal_reserva": {
                                            "id": null
                                        },
                                        "nome": descricaoInput.value,
                                        "saas": {
                                            "id": props.saas
                                        },
                                        "valor": Number(valorInput.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})$/gm, '$1.$2')),
                                        "valor_liq": Number(valorInput.value.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})$/gm, '$1.$2')),
                                        "valor_prop": vProprietario,
                                        "valor_gestor": vGestor,
                                        "comissao_ota": 0,
                                        "reserva": {
                                            "id": null
                                        },
                                        "pago": pago.checked,
                                        "receita": !props.despesa,
                                        "tipo_despesa": props.despesa ? tipoDespesa : null,
                                        "recebedor": recebedor.value,
                                        "obs": observacaoInput.value
                                    })
                                }
                                else {
                                    let error = err
                                    if (descricaoInput.value.length == 0) {
                                        error = (error.map((e, i) => i === 0 ? true : e) as [boolean, boolean, boolean, boolean]);
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 0 ? false : e) as [boolean, boolean, boolean, boolean]);
                                    }
                                    if (dataInput.value.length == 0) {
                                        error = (error.map((e, i) => i === 1 ? true : e) as [boolean, boolean, boolean, boolean]);
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 1 ? false : e) as [boolean, boolean, boolean, boolean]);
                                    }
                                    if (valorInput.value.length == 0) {
                                        error = (error.map((e, i) => i === 2 ? true : e) as [boolean, boolean, boolean, boolean]);
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 2 ? false : e) as [boolean, boolean, boolean, boolean]);
                                    }
                                    if (isFixaOuVariavel && (!acomodacaoDespesaInput || acomodacaoDespesaInput.value === 'null' || acomodacaoDespesaInput.value === '')) {
                                        error = (error.map((e, i) => i === 3 ? true : e) as [boolean, boolean, boolean, boolean]);
                                        setNotify({ type: 2, text: 'Selecione uma acomodação para este tipo de despesa!' })
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 3 ? false : e) as [boolean, boolean, boolean, boolean]);
                                        setNotify({ type: 2, text: 'Preenchimento incorreto!' })
                                    }
                                    setErr(error)
                                    setShowNotify(true)
                                    setTimeout(() => {
                                        setShowNotify(false);
                                    }, 3000)
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
