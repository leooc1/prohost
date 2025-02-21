import { useContext, useEffect, useState } from "react"
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


export default function RegistrarReceita({ close, saas }: { close: () => void, saas: string }) {
    const apiURL = 'https://api.prohost.net.br'
    const { dataToken } = useContext(SideBarContext)

    const [categoria, setCategoria] = useState(['', '#000000'])
    async function getAcomodacoes() {
        await fetch(`${apiURL}/acomodacao/` + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setAcomodacao(data.filter((e => !e.desativado)))
            })
            .catch(err => console.log(err))
    }
    async function getCategorias() {
        await fetch(`${apiURL}/categoria_financeiro/` + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: CategoriaFinanceiro[]) => {
                setCategoriaF(data.filter(e => e.receita))
            })
            .catch(err => console.log(err))
    }
    async function create(pbody: any) {
        await fetch(`${apiURL}/movimentacao/`, {
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
    const [err, setErr] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false])

    useEffect(() => {
        getAcomodacoes()
        getCategorias()
    }, [dataToken])
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Registrar Receita</h5>

                <section>
                    <span className={`text-zinc-500 font-medium`}>Categoria<span className='text-red-500 font-bold'> *</span></span>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        <select name="categoria" id="categoria"
                            className={`${err[0] ? 'border-red-500' : 'border-zinc-300'} font-medium border rounded-md px-2 py-1 outline-none w-full`} style={{ color: categoria[1] }} defaultValue={categoria[0]}
                            onChange={(e) => {
                                const cat = categoriaf.find((c) => String(c.id) === e.target.value);
                                if (cat) {
                                    setCategoria([String(cat.id), cat.cor !== '#FFFFFF' ? cat.cor : '#000000']);
                                }
                            }}>
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
                <div className="grid">
                    <label htmlFor="descricao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição<span className='text-red-500 font-bold'> *</span></span>
                        <input placeholder="Ex: Sofá usado" type="text" name="descricao" id="descricao" className={`border ${err[1] ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} />
                    </label>
                </div>
                <label htmlFor="acomodacaoReceita" className={`flex flex-col`}>
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação</span>
                    <select name="acomodacaoReceita" id="acomodacaoReceita" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                        <option value="null" ></option>
                        {acomodacao?.length > 0 &&
                            acomodacao?.map(a => <option value={a.id}>{a.nome}</option>)}
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
                            const acomodacaoInput = document.getElementById('acomodacaoReceita') as HTMLInputElement
                            const dataInput = document.getElementById('data') as HTMLInputElement
                            const valorInput = document.getElementById('valor') as HTMLInputElement
                            const observacaoInput = document.getElementById('observacao') as HTMLInputElement
                            let vProprietario: number = 0
                            let vGestor: number = 0
                            if (acomodacaoInput.value != 'null' && acomodacao.filter(e => e.id == Number(acomodacaoInput.value))[0]?.comissao) {
                                const comissao = acomodacao.filter(a => a.id == Number(acomodacaoInput.value))[0]?.comissao
                                vProprietario = ((100 - comissao) / 100) * Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                                vGestor = (comissao / 100) * Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                            }
                            else {
                                vProprietario = Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                                vGestor = Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                            }
                            if ((Boolean(categoriaInput.value.length > 0) && descricaoInput.value.length > 0 && dataInput.value.length > 0 && valorInput.value.length > 0 && Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) > 0)) {
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
                                    "valor": Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                    "valor_liq": Number(valorInput.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                    "valor_prop": vProprietario,
                                    "valor_gestor": vGestor,
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
                                let error = err
                                if (!(categoriaInput.value.length > 0)) {
                                    error = (error.map((e, i) => i === 0 ? true : e) as [boolean, boolean, boolean, boolean]);
                                }
                                else {
                                    error = (error.map((e, i) => i === 0 ? false : e) as [boolean, boolean, boolean, boolean]);
                                }
                                if (descricaoInput.value.length == 0) {
                                    error = (error.map((e, i) => i === 1 ? true : e) as [boolean, boolean, boolean, boolean]);
                                }
                                else {
                                    error = (error.map((e, i) => i === 1 ? false : e) as [boolean, boolean, boolean, boolean]);
                                }
                                if (dataInput.value.length == 0) {
                                    error = (error.map((e, i) => i === 2 ? true : e) as [boolean, boolean, boolean, boolean]);
                                }
                                else {
                                    error = (error.map((e, i) => i === 2 ? false : e) as [boolean, boolean, boolean, boolean]);
                                }
                                if (valorInput.value.length == 0) {
                                    error = (error.map((e, i) => i === 3 ? true : e) as [boolean, boolean, boolean, boolean]);
                                }
                                else {
                                    error = (error.map((e, i) => i === 3 ? false : e) as [boolean, boolean, boolean, boolean]);
                                }
                                setErr(error)
                                alert('Preenchimento incorreto')
                            }
                        }}
                    >Registrar Movimentação</button>
                </section>
            </form>
        </div>
    )
}
