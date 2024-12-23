import { useEffect, useState } from "react"
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

//const apiURl = import.meta.env.VITE_baseURLAPI;

export default function RegistrarReceita({ close, saas }: { close: () => void, saas: string }) {
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
        await fetch('https://api.prohost.net.br/acomodacao/1', {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setAcomodacao(data.filter((e => !e.desativado)))
            })
            .catch(err => console.log(err))
    }
    async function getCategorias() {
        await fetch('https://api.prohost.net.br/categoria_financeiro/1', {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: CategoriaFinanceiro[]) => {
                setCategoriaF(data.filter(e => e.receita))
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
    }, [])
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Registrar Receita</h5>

                <section>
                    <span className="text-zinc-500 font-medium">Categoria</span>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {categoriaf.length > 0 &&
                            categoriaf.map(cat => <label htmlFor={String(cat.id)} onClick={() => setCategoria()} className="bg-slate-100 text-sm font-medium cursor-pointer flex items-center text-slate-500 rounded-2xl px-2 py-px">
                                <div className={`w-2 h-2 rounded-full mr-2 bg-[${cat.cor}]`}></div>
                                {cat.nome}
                                <input type="radio" name="categoria" id={String(cat.id)} className="hidden" />
                            </label>)
                        }
                    </div>
                </section>
                <div className="grid">
                    <label htmlFor="descricao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição</span>
                        <input placeholder="Ex: Material de Limpeza" type="text" name="descricao" id="descricao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
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
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Data</span>
                        <input placeholder="dd/mm/aaaa" type="date" name="data" id="data" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="valor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Valor</span>
                        <input
                            onChange={(e) => {
                                e.target.value = Number(e.target.value).toFixed(2)
                            }}
                            type="number" step={0.01} name="valor" placeholder="R$" id="valor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full" />
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
                            const categoriaInput = document.querySelectorAll('label:has(input[type="radio"]:checked)')[0] as HTMLLabelElement
                            const descricaoInput = document.getElementById('descricao') as HTMLInputElement
                            const acomodacaoInput = document.getElementById('acomodacaoReceita') as HTMLInputElement
                            const dataInput = document.getElementById('data') as HTMLInputElement
                            const valorInput = document.getElementById('valor') as HTMLInputElement
                            const observacaoInput = document.getElementById('observacao') as HTMLInputElement
                            let vProprietario: number = 0
                            let vGestor: number = 0
                            if (acomodacaoInput.value != 'null' && acomodacao.filter(e => e.id == Number(acomodacaoInput.value))[0].comissao) {
                                const comissao = acomodacao.filter(a => a.id == Number(acomodacaoInput.value))[0].comissao
                                vProprietario = ((100 - comissao) / 100) * Number(valorInput.value)
                                vGestor = (comissao / 100) * Number(valorInput.value)
                            }
                            else {
                                vProprietario = Number(valorInput.value)
                                vGestor = Number(valorInput.value)
                            }
                            if ((Boolean(categoriaInput?.htmlFor) && descricaoInput.value.length > 0 && dataInput.value.length > 0 && valorInput.value.length > 0 && Number(valorInput.value) > 0)) {
                                await create({
                                    "acomodacao": {
                                        "id": Number(acomodacaoInput.value)||null
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
                                    "valor": Number(valorInput.value),
                                    "valor_liq": Number(valorInput.value),
                                    "valor_prop": vProprietario,
                                    "valor_gestor": vGestor,
                                    "reserva": {
                                        "id": null
                                    },
                                    "pago": null,
                                    "receita": true,
                                    "obs": observacaoInput.value
                                })
                            }
                            else {
                                alert('Preenchimento incorreto')
                            }
                        }}
                    >Registrar Movimentação</button>
                </section>
            </form>
        </div>
    )
}
