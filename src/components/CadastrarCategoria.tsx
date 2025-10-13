import { useCallback, useContext, useEffect, useState } from "react"
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Notify from "./notify/Notify";

interface CategoriaFinanceiro {
    id?: number;
    cor: string;
    editavel: boolean;
    nome: string;
    receita: boolean
    tipo_despesa: string | null
    saas: { id: number };
}

const CORES = [
    '#ffffff', '#bdc3c7', '#f1c40f', '#f39c12', '#e74c3c', '#1abc9c',
    '#17d9fd', '#0000ff', '#2980b9', '#9b59b6', '#000000', '#f2354b'
];

export default function CadastrarCategoria({ close, permissao }: { close: () => void, permissao: number }) {
    const apiURL = import.meta.env.VITE_API_URL
    const { dataToken } = useContext(SideBarContext)
    const [mov, setMov] = useState(false)
    const [color, setColor] = useState<string>('#bdc3c7')
    const [receitas, setReceitas] = useState<CategoriaFinanceiro[]>([])
    const [despesas, setDespesas] = useState<CategoriaFinanceiro[]>([])
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)
    const [editingColorId, setEditingColorId] = useState<number | null>(null) // id da categoria com seletor de cor aberto

    const getCategorias = useCallback(async () => {
        await fetch(`${apiURL}/categoria_financeiro/` + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: CategoriaFinanceiro[]) => {
                setDespesas(data.filter(e => !e.receita))
                setReceitas(data.filter(e => e.receita))
            })
            .catch(err => console.log(err))
    }, [apiURL, dataToken.id])

    async function createCategorias(pbody: CategoriaFinanceiro) {
        await fetch(`${apiURL}/categoria_financeiro/`, {
            method: 'POST',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data: CategoriaFinanceiro) => {
                if (data.id) {
                    setNotify({ type: 1, text: 'Criado!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 1200)
                    setColor('#bdc3c7');
                    (document.getElementById('nome') as HTMLInputElement).value = ''
                    getCategorias()
                }
            })
            .catch(err => console.log(err))
    }

    async function deleteCategorias(id: number) {
        await fetch(`${apiURL}/categoria_financeiro/${id}`, {
            method: 'DELETE',
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    setNotify({ type: 1, text: 'Excluído!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                        getCategorias()
                    }, 1200)
                }
            })
            .catch(err => console.log(err))
    }

    async function updateCategorias(id: number, pbody: { cor: string, nome: string }) {
        await fetch(`${apiURL}/categoria_financeiro/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    getCategorias()
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getCategorias()
    }, [dataToken, getCategorias])

    // Fecha o seletor de cor ao clicar fora
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest('.color-selector-popover')) setEditingColorId(null);
        }
        if (editingColorId !== null) {
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }
    }, [editingColorId]);

    function renderCategoriaList(categorias: CategoriaFinanceiro[]) {
        return categorias.map((e) => (
            <li key={e.id} className="flex items-center border border-zinc-200 pr-2 py-1 rounded-md pl-6 relative">
                <button
                    type="button"
                    className="mr-5 w-5 h-5 rounded-full border border-zinc-400"
                    style={{ background: e.cor }}
                    onClick={() => setEditingColorId(editingColorId === e.id ? null : (e.id!))}
                    disabled={!e.editavel || !(permissao >= 3)}
                    title="Editar cor"
                />
                {editingColorId === e.id && (
                    <div className="color-selector-popover absolute z-50 left-0 top-8 bg-white border border-zinc-300 rounded-lg p-2 flex flex-wrap gap-2 shadow-lg">
                        {CORES.map(cor => (
                            <button
                                key={cor}
                                type="button"
                                className="w-6 h-6 rounded-full border border-zinc-400 flex items-center justify-center"
                                style={{ background: cor }}
                                onClick={() => {
                                    updateCategorias(e.id || 0, { cor, nome: e.nome });
                                    setEditingColorId(null);
                                }}
                            >
                                {e.cor === cor ? <span className="text-xs">✔</span> : null}
                            </button>
                        ))}
                    </div>
                )}
                <input
                    type="text"
                    id={`nome-${e.id}`}
                    defaultValue={e.nome}
                    disabled={!e.editavel || !(permissao >= 3)}
                    className="outline-none border-none bg-transparent focus:bg-zinc-200 rounded-md px-1"
                    onBlur={el => {
                        if (el.target.value.length && el.target.value !== e.nome) {
                            updateCategorias(e.id || 0, { cor: e.cor, nome: el.target.value });
                        }
                    }}
                />
                {e.editavel && permissao >= 4 && (
                    <button
                        onClick={() => {
                            const excluir = confirm("Tem certeza que deseja excluir a categoria?");
                            if (excluir) deleteCategorias(e.id || 0);
                        }}
                        className="px-1 py-1 rounded-md transition-all duration-200 hover:bg-red-100 ml-2"
                        type="button"
                    >
                        <svg className="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,109,109,1)"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                    </button>
                )}
            </li>
        ));
    }

    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}> </div>
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            <section className="flex flex-col max-h-screen overflow-scroll scroll-default absolute min-w-80 max-w-[470px] px-4 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md py-4">
                <h5 className="font-semibold text-2xl mb-2">Categorias</h5>
                <section className="flex gap-5">
                    <label htmlFor="receita" className="flex gap-2">
                        <input type="radio" name="mov" id="receita" checked={!mov} onChange={() => setMov(false)} />
                        Receita
                    </label>
                    <label htmlFor="despesa" className="flex gap-2">
                        <input type="radio" name="mov" id="despesa" checked={mov} onChange={() => setMov(true)} />
                        Despesa
                    </label>
                </section>
                <ul className="flex flex-col gap-1 ">
                    {!mov && receitas.length ? renderCategoriaList(receitas) : null}
                    {mov && despesas.length ? renderCategoriaList(despesas) : null}
                </ul>
                <hr className='my-5' />
                <form onSubmit={e => { e.preventDefault() }}>
                    <h5 className="font-semibold text-xl mb-4">Cadastrar nova Categoria</h5>
                    <div className='flex gap-3 items-center'>
                        <label htmlFor="nome" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Nome</span>
                            <input type="text" name="nome" id="nome" className="border border-zinc-300 max-w-40 rounded-md px-2 py-1 outline-none" />
                        </label>
                        {mov && <label htmlFor="tipo-despesa" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Tipo</span>
                            <select name="tipo-despesa" id="tipo-despesa" className={`outline outline-zinc-300 border2 border-white text-sm rounded-md px-1 py-1 outline-none`}>
                                <option value={'null'} disabled className="hidden">Padrão</option>
                                <option value="Despesas do Negócio" className="text-black">Despesas do Negócio</option>
                                <option value="Despesas Fixas" className="text-black">Despesas Fixas</option>
                                <option value="Despesas Variáveis" className="text-black">Despesas Variáveis</option>
                            </select>
                        </label>}
                        <label htmlFor="cor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Cor</span>
                            <div className="flex gap-2 mt-1 grid-cols-4 grid-rows-3">
                                {/* {CORES.map(cor => (
                                    <button
                                        key={cor}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${color === cor ? 'border-primary' : 'border-zinc-300'}`}
                                        style={{ background: cor }}
                                        onClick={() => setColor(cor)}
                                        aria-label={`Selecionar cor ${cor}`}
                                    >
                                        {color === cor && (
                                            <span className="text-xs text-white">✔</span>
                                        )}
                                    </button>
                                ))} */}
                                <input
                                    type="color"
                                    id="cor"
                                    name="cor"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    list="preset-colors"
                                    className="w-8 h-8 border-none rounded-md p-0 bg-transparent"
                                    style={{ cursor: "pointer" }}
                                />
                                <datalist id="preset-colors">
                                    {CORES.map(cor => (
                                        <option key={cor} value={cor} />
                                    ))}
                                </datalist>
                            </div>
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const nome = document.getElementById('nome') as HTMLInputElement
                            const tipoDespesa = document.getElementById('tipo-despesa') as HTMLInputElement
                            if (nome.value.length)
                                createCategorias({
                                    "cor": color,
                                    "editavel": true,
                                    "receita": !mov,
                                    "nome": nome.value,
                                    "tipo_despesa": (tipoDespesa && tipoDespesa?.value != 'null') ? tipoDespesa.value : null,
                                    "saas": {
                                        "id": dataToken.id
                                    }
                                })
                        }}
                        className="w-full mt-4 h-9 flex justify-center items-center font-semibold border border-zinc-300 rounded-lg text-white bg-primary self-end">
                        Cadastrar Categoria
                    </button>
                </form>
            </section>
        </div>
    )
}
