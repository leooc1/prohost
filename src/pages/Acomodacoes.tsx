import { useContext, useEffect, useState } from "react"
import CadastrarAcomodacao from "../components/CadastrarAcomodacao"
import { SideBarContext } from "../contexts/SideBarMenuContext"
import Loader from "../components/Loader"
import SemPermissao from "../components/SemPermissao"
import Notify from "../components/notify/Notify"

// dnd-kit
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

// 🔹 Item arrastável
function SortableItem({ id, children }: { id: number, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab"
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

export default function Acomodacoes() {
    const apiURL = import.meta.env.VITE_API_URL
    useEffect(() => { document.title = 'Acomodações | Prohost' }, [])

    const { dataToken } = useContext(SideBarContext)
    const [loaded, setLoaded] = useState(false)
    const [cadastrarAcomodacao, setCadastrarAcomodacao] = useState(false)
    const [proprio, setProprio] = useState<Acomodacao[]>([])
    const [terceiro, setTerceiro] = useState<Acomodacao[]>([])
    const [desativados, setDesativados] = useState<Acomodacao[]>([])
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)
    const [verifyAcomodacao, setVerifyAcomodacao] = useState<boolean>(false)

    async function acomodacoes() {
        await fetch(`${apiURL}/acomodacao/` + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(async (data: Acomodacao[]) => {
                const storage = localStorage.getItem("order_ac");
                let orderMap: any = null;

                if (storage) {
                    const store: [string, any][] = JSON.parse(storage || "[]");
                    const found = store.find(item => item[0] === dataToken.id);
                    console.log(found)
                    if (found) {
                        orderMap = found[1];
                    }
                }

                // 🔹 Filtra normalmente
                let proprioList: any = data.filter(e => e.tipo == "proprio" && !e.desativado);
                let terceiroList: any = data.filter(e => e.tipo == "terceiro" && !e.desativado);
                let desativadoList: any = data.filter(e => e.desativado);

                // 🔹 Reordena com base no localStorage
                if (orderMap) {
                    const reorder = (list: Acomodacao[], orderIds: number[]) => {
                        const map = new Map(list.map(item => [item.id, item]));
                        const ordered = orderIds.map(id => map.get(id)).filter(Boolean);
                        const leftovers = list.filter(i => !orderIds.includes(i.id));
                        return [...ordered, ...leftovers];
                    };

                    proprioList = reorder(proprioList, orderMap.proprio || []);
                    terceiroList = reorder(terceiroList, orderMap.terceiro || []);
                    desativadoList = reorder(desativadoList, orderMap.desativado || []);
                }
                setProprio(proprioList);
                setTerceiro(terceiroList);
                setDesativados(desativadoList);

                // 🔹 Validação de quantidade de acomodações no plano
                await fetch(`${apiURL}/assinatura/upgrade/${dataToken.id}`, {
                    method: 'GET'
                })
                    .then(verify => verify.json())
                    .then(v => {
                        if ((data.filter((e => !e.desativado)).length) < v.qtd_acomodacao)
                            setVerifyAcomodacao(true);
                        else
                            setVerifyAcomodacao(false);
                    })
                    .catch(err => console.log(err));

                setLoaded(true);
            })
            .catch(err => console.log(err));

        await permissoes();
    }


    const [permissao, setPermissao] = useState(0)
    async function permissoes() {
        await fetch(`${apiURL}/users/${dataToken.idUsu}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                if (data.acomodacoes) {
                    setPermissao(data.acomodacoes)
                }
                else {
                    setPermissao(0)
                }
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        acomodacoes()
    }, [dataToken])

    // 🔹 Config drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (
        event: any,
        list: Acomodacao[],
        setList: React.Dispatch<React.SetStateAction<Acomodacao[]>>
    ) => {
        const { active, over } = event;
        const storage = localStorage.getItem("order_ac");
        if (!over) return;

        if (active.id !== over.id) {
            setList((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newList = arrayMove(items, oldIndex, newIndex);

                // 🔹 Monta o objeto de ordem
                const result = {
                    proprio: proprio.map((i) => i.id),
                    terceiro: terceiro.map((i) => i.id),
                    desativado: desativados.map((i) => i.id),
                };

                // 🔹 Substitui a lista correta no `result`
                if (setList === setProprio) {
                    result.proprio = newList.map((i) => i.id);
                } else if (setList === setTerceiro) {
                    result.terceiro = newList.map((i) => i.id);
                } else if (setList === setDesativados) {
                    result.desativado = newList.map((i) => i.id);
                }

                // 🔹 Atualiza localStorage
                if (!storage) {
                    localStorage.setItem(
                        "order_ac",
                        JSON.stringify([[dataToken.id, result]])
                    );
                } else {
                    const store: [string, any][] = JSON.parse(storage || "[]");
                    let found = false;

                    store.forEach((item, index) => {
                        if (item[0] === dataToken.id) {
                            store[index][1] = result;
                            found = true;
                        }
                    });

                    if (!found) {
                        store.push([dataToken.id, result]);
                    }
                    localStorage.setItem("order_ac", JSON.stringify(store));
                }

                return newList;
            });
        }
    };


    return (
        loaded ?
            <div className="w-main px-8">
                {permissao == 0 && <SemPermissao />}
                <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                    <h3 className="text-3xl font-semibold">Acomodações</h3>
                    {showNotify && <Notify type={notify.type} text={notify.text} />}
                    <button
                        className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
                        onClick={() => {
                            if (verifyAcomodacao)
                                setCadastrarAcomodacao(true)
                            else {
                                setNotify({ type: 2, text: 'Seu plano não permite ter mais acomodações!' })
                                setShowNotify(true)
                                setTimeout(() => { setShowNotify(false) }, 3000)
                            }
                        }}
                        disabled={!(permissao >= 2)}
                    >
                        Cadastrar Acomodação
                    </button>
                    {cadastrarAcomodacao && <CadastrarAcomodacao close={() => setCadastrarAcomodacao(false)} />}
                </div>

                {(proprio.length == 0 && terceiro.length == 0 && desativados.length == 0) &&
                    <section className="px-10 bg-zinc-200 rounded-xl py-10">
                        <p className="text-3xl font-medium text-center ">
                            Cadastre sua primeira acomodação e tenha total controle das suas reservas e ganhos. 🚀
                        </p>
                    </section>
                }

                {/* 🔹 Próprias */}
                {proprio.length ?
                    <section className="pt-3">
                        <p className="text-2xl font-medium">Próprias</p>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEnd(e, proprio, setProprio)}
                        >
                            <SortableContext items={proprio.map(e => e.id)} strategy={horizontalListSortingStrategy}>
                                <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                                    {proprio.map((e) =>
                                        <SortableItem key={e.id} id={e.id}>
                                            <li className="bg-white min-w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer"
                                                onClick={() => location.assign(`/acomodacoes/${e.id}`)}>
                                                <img src={e.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} className="object-cover h-24 w-48 rounded-md" />
                                                <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                                <div className="mt-4 flex justify-between items-center">
                                                    <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                                        <div className="bg-[#1266B5] w-2 h-2 rounded-full"></div>
                                                        <div className="uppercase text-xs font-semibold text-[#1266B5]" style={{ lineHeight: 'normal', fontSize: '10px' }}>próprio</div>
                                                    </div>
                                                    <button className="hover:bg-red-200 bg-transparent p-1 rounded-lg transition-all duration-200" onClick={(event) => {
                                                        event.stopPropagation()
                                                        desativar(e.id, true)
                                                    }}
                                                        disabled={!(permissao >= 4)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgba(255,0,0,0)" stroke="currentColor" strokeWidth="1" stroke-linecap="undefined" stroke-linejoin="round" className="feather feather-trash w-7 h-fit" color="rgba(255,0,0,1)" pointer-events="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            </li>
                                        </SortableItem>
                                    )}
                                </ul>
                            </SortableContext>
                        </DndContext>
                    </section>
                    : null
                }

                {/* 🔹 Terceiras */}
                {terceiro.length ?
                    <section className="py-12">
                        <p className="text-2xl font-medium">Terceiras</p>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEnd(e, terceiro, setTerceiro)}
                        >
                            <SortableContext items={terceiro.map(e => e.id)} strategy={horizontalListSortingStrategy}>
                                <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                                    {terceiro.map((e) =>
                                        <SortableItem key={e.id} id={e.id}>
                                            <li className="bg-white min-w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer"
                                                onClick={() => location.assign(`/acomodacoes/${e.id}`)}>
                                                <img src={e.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} className="object-cover h-24 w-48 rounded-md" />
                                                <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                                <div className="mt-4 flex justify-between items-center">
                                                    <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                                        <div className="bg-[#3A8E71] w-2 h-2 rounded-full"></div>
                                                        <div className="uppercase text-xs font-semibold text-[#3A8E71]" style={{ lineHeight: 'normal', fontSize: '10px' }}>terceiro</div>
                                                    </div>
                                                    <button className="hover:bg-red-200 bg-transparent p-1 rounded-lg transition-all duration-200" onClick={(event) => {
                                                        event.stopPropagation()
                                                        desativar(e.id, true)
                                                    }}
                                                        disabled={!(permissao >= 4)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgba(255,0,0,0)" stroke="currentColor" strokeWidth="1" stroke-linecap="undefined" stroke-linejoin="round" className="feather feather-trash w-7 h-fit" color="rgba(255,0,0,1)" pointer-events="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            </li>
                                        </SortableItem>
                                    )}
                                </ul>
                            </SortableContext>
                        </DndContext>
                    </section>
                    : null
                }

                {/* 🔹 Desativadas */}
                {desativados.length ?
                    <section className="py-12">
                        <p className="text-2xl font-medium">Desativadas</p>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEnd(e, desativados, setDesativados)}
                        >
                            <SortableContext items={desativados.map(e => e.id)} strategy={horizontalListSortingStrategy}>
                                <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                                    {desativados.map((e) =>
                                        <SortableItem key={e.id} id={e.id}>
                                            <li className="bg-white min-w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer opacity-75 brightness-75">
                                                <img src={e.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} className="object-cover h-24 w-48 rounded-md" />
                                                <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                                <div className="mt-4 flex justify-between items-center">
                                                    <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                                        <div className={`bg-[${e?.tipo == 'proprio' ? '#1266B5' : '#3A8E71'}] w-2 h-2 rounded-full`}></div>
                                                        <div className={`uppercase text-xs font-semibold text-[${e?.tipo == 'proprio' ? '#1266B5' : '#3A8E71'}]`} style={{ lineHeight: 'normal', fontSize: '10px' }}>{e?.tipo}</div>
                                                    </div>
                                                    <button className="hover:bg-green-200 bg-transparent p-1 rounded-lg transition-all duration-200" onClick={async (event) => {
                                                        event.stopPropagation()
                                                        if (verifyAcomodacao)
                                                            desativar(e.id, false)
                                                        else {
                                                            setNotify({ type: 2, text: 'Seu plano não permite ter mais acomodações!' })
                                                            setShowNotify(true)
                                                            setTimeout(() => {
                                                                setShowNotify(false);
                                                            }, 3000)
                                                        }
                                                    }}
                                                        disabled={!(permissao >= 3)}>
                                                        <svg className="feather feather-trash w-7 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512"><g><path d="M497.36 69.995c-7.532-7.545-19.753-7.558-27.285-.032L238.582 300.845l-83.522-90.713c-7.217-7.834-19.419-8.342-27.266-1.126-7.841 7.217-8.343 19.425-1.126 27.266l97.126 105.481a19.273 19.273 0 0 0 13.784 6.22c.141.006.277.006.412.006a19.317 19.317 0 0 0 13.623-5.628L497.322 97.286c7.551-7.525 7.564-19.746.038-27.291z" fill="#00dd00" opacity="1" data-original="#000000"></path><path d="M492.703 236.703c-10.658 0-19.296 8.638-19.296 19.297 0 119.883-97.524 217.407-217.407 217.407-119.876 0-217.407-97.524-217.407-217.407 0-119.876 97.531-217.407 217.407-217.407 10.658 0 19.297-8.638 19.297-19.296C275.297 8.638 266.658 0 256 0 114.84 0 0 114.84 0 256c0 141.154 114.84 256 256 256 141.154 0 256-114.846 256-256 0-10.658-8.638-19.297-19.297-19.297z" fill="#00dd00" opacity="1" data-original="#000000"></path></g></svg>
                                                    </button>
                                                    <button className="hover:bg-red-200 bg-transparent p-1 rounded-lg transition-all duration-200" onClick={(event) => {
                                                        event.stopPropagation()
                                                        const confirmacao = confirm('Deseja excluir permanentemente essa acomodação e os dados referentes a ela?')
                                                        if (confirmacao) {
                                                            deletarAcomodacao(e.id)
                                                        }
                                                    }}
                                                        disabled={!(permissao >= 4)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgba(255,0,0,0)" stroke="currentColor" strokeWidth="1" stroke-linecap="undefined" stroke-linejoin="round" className="feather feather-trash w-7 h-fit" color="rgba(255,0,0,1)" pointer-events="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            </li>
                                        </SortableItem>
                                    )}
                                </ul>
                            </SortableContext>
                        </DndContext>
                    </section>
                    : null
                }
            </div>
            :
            <Loader />
    )
}
