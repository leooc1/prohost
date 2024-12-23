import { useContext, useEffect, useState } from 'react'
import image from '../../../public/none-result.svg'
import { SideBarContext } from '../../contexts/SideBarMenuContext'
import EditarMovimentacao from '../EditarMovimentacao'
interface Movimentacao {
    id?: number
    acomodacao: { id: number | null, nome: string | null }
    categoria_financeiro: { id: number | null, nome: string | null, cor: string }
    data: string
    canal_reserva: { id: number | null }
    nome: string
    saas: { id: number | null }
    valor: string
    valor_liq: number
    valor_prop: number
    valor_gestor: number
    reserva: { id: number | null }
    pago: boolean
    receita: boolean
    recebedor: null | string
    obs: null | string
    tipo_despesa: string | null
}

export default function ListaMovimentacoes({ movimentacoes }: { movimentacoes: Movimentacao[] }) {
    const { dataToken } = useContext(SideBarContext)
    const [arrayMovimentacoes, setArrayMovimentacoes] = useState<Movimentacao[][]>([])
    const [page, setPage] = useState<number>(0)
    const [editavel, setEditavel] = useState<boolean>(false)
    const [ediID, setEdiID] = useState<number | null>(null)
    const [ediCategoria, setEdiCategoria] = useState<number | null>(null)
    const [ediDescricao, setEdiDescricao] = useState<string | null>(null)
    const [tipoDespesa, setTipoDespesa] = useState<string | null>(null)
    const [ediRecebedor, setEdiRecebedor] = useState<string | null>(null)
    const [ediAcomodacao, setEdiAcomodacao] = useState<number | null>(null)
    const [ediData, setEdiData] = useState<string | null>(null)
    const [ediValor, setEdiValor] = useState<string | null>(null)
    const [ediPago, setEdiPago] = useState<boolean | null>(null)
    const [ediObs, setEdiObs] = useState<string | null>(null)

    function formatarMoedaBrasileira(valorStr: string) {
        const valor = parseFloat(valorStr);
        if (isNaN(valor)) {
            return "Valor inválido";
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    const [ids, setIds] = useState<{ id: number, index: number }[]>([])
    async function getAll(saas: number) {
        await fetch(`http://localhost:3000/reserva/index/${saas}`, {
            method: 'GET',
        })
            .then(data => data.json())
            .then((data) => {
                setIds(data)
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        getAll(dataToken.id)
        const grupos = [];
        for (let i = 0; i < movimentacoes.length; i += 10) {
            grupos.push(movimentacoes.slice(i, i + 10));
        }
        if (grupos.length > 0)
            setArrayMovimentacoes(grupos);
        else
            setArrayMovimentacoes([[]]);
    }, [dataToken, movimentacoes])

    console.log(arrayMovimentacoes)

    return (
        <>
            {
                movimentacoes.length > 0 && ids.length > 0 ?
                    <section className="w-full min-h-56 border border-zinc-300 rounded-lg bg-white px-4 py-4 mt-8">
                        {editavel && <EditarMovimentacao
                            close={() => setEditavel(false)}
                            id={ediID}
                            categoria={ediCategoria}
                            descricao={ediDescricao}
                            recebedor={ediRecebedor}
                            acomodacao={ediAcomodacao}
                            data={ediData}
                            tipo_despesa={tipoDespesa}
                            valor={ediValor}
                            pago={ediPago}
                            saas={dataToken.id}
                            obs={ediObs} />}
                        <table className="w-full mt-3 border border-zinc-200 rounded-lg">
                            <thead className="w-full">
                                <tr className="text-sm bg-slate-50 h-12">
                                    <th className="text-center">Data</th>
                                    <th className="text-center">Categoria</th>
                                    <th className="text-center">Descrição</th>
                                    <th className="text-center">Acomodação</th>
                                    <th className="text-center">Valor Bruto</th>
                                    <th className="text-center">Valor Líquido</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {
                                    arrayMovimentacoes[page].length > 0 ?
                                        arrayMovimentacoes[page].map((e) =>
                                            <>
                                                <tr className={`text-xs bg-white h-12 border border-zinc-200 w-full hover:bg-[#FAFBFD]
                                                ${e.reserva == null ? 'cursor-pointer' : ''}`}
                                                    onClick={() => {
                                                        if (e.reserva == null) {
                                                            setEditavel(true)
                                                            setTipoDespesa(e?.tipo_despesa || null)
                                                            setEdiID(e?.id || null)
                                                            setEdiCategoria(e?.categoria_financeiro?.id || null)
                                                            setEdiDescricao(e?.nome || null)
                                                            setEdiRecebedor(e?.recebedor || null)
                                                            setEdiAcomodacao(e?.acomodacao?.id || null)
                                                            setEdiData(e?.data || null)
                                                            setEdiValor(e?.valor || null)
                                                            setEdiPago(e?.pago || null)
                                                            setEdiObs(e?.obs || null)
                                                        }
                                                    }}>
                                                    <td className="text-center text-xs font-normal">{e.data.split('-')[2] + '/' + e.data.split('-')[1] + '/' + e.data.split('-')[0]}</td>
                                                    <td className="text-xs font-normal capitalize flex items-center h-12 gap-3">
                                                        <div className="w-3 h-3 rounded-full" style={{
                                                            backgroundColor: e.categoria_financeiro ? e.categoria_financeiro.cor :
                                                                e.nome.split(' ')[0] == 'Continuidade' ? '#3CA6FC' : '#566DE7'
                                                        }}></div>
                                                        {e.categoria_financeiro ? e.categoria_financeiro.nome :
                                                            e.nome.split(' ')[0] == 'Continuidade' ? 'Continuidade' : 'Diária'}
                                                    </td>
                                                    <td className="text-center text-xs font-normal">{e.reserva ? e.nome.replace(e.nome.split('Reserva ')[1].split(' ')[0], String(ids.filter(i => i.id == Number(e.nome.split('Reserva ')[1].split(' ')[0]))[0].index)) : e.nome}</td>
                                                    <td className="text-center text-xs font-normal">{e.acomodacao?.nome || ''}</td>
                                                    <td className="text-center text-xs font-normal">{formatarMoedaBrasileira(String(e.valor))}</td>
                                                    <td className="text-center text-xs font-normal">{formatarMoedaBrasileira(String(e.valor_liq))}</td>
                                                </tr >
                                            </>)
                                        : null
                                }
                            </tbody>
                            <tfoot className="text-xs bg-slate-50 h-12">
                                <tr >
                                    <td className="text-center">Mostrando {page != 0 ? page + '1' : '1'}-{(arrayMovimentacoes[page].length) >= 10 ? page + 1 + (arrayMovimentacoes[page].length).toString().slice(-1) :
                                        (page == 0 ? '' : page) + (arrayMovimentacoes[page].length).toString().slice(-1)} de {movimentacoes.length} resultados</td>
                                    <td className="text-center"></td>
                                    <td className="text-center"></td>
                                    <td className="text-center"></td>
                                    <td className="text-center"></td>
                                    <td className="text-center flex items-center h-12 gap-4">
                                        <button disabled={!(arrayMovimentacoes.length > 1) || !((arrayMovimentacoes[page - 1]))}
                                            onClick={() => {
                                                if ((arrayMovimentacoes[page - 1])) {
                                                    setPage(page - 1)
                                                }
                                            }}
                                            className={`px-2 py-1 disabled:cursor-no-drop bg-slate-200 border border-slate-300 rounded-md h-fit w-fit ${(!(arrayMovimentacoes.length > 1) || !((arrayMovimentacoes[page - 1]))) && 'cursor-no-drop'}`}>&lt;</button>
                                        <div className="px-2 py-1 bg-slate-200 border border-slate-300 rounded-md h-fit w-fit">
                                            {page + 1}
                                        </div>
                                        <button disabled={!(arrayMovimentacoes.length > 1) || !((arrayMovimentacoes[page + 1]))}
                                            onClick={() => {
                                                if ((arrayMovimentacoes[page + 1])) {
                                                    setPage(page + 1)
                                                }
                                            }}
                                            className={`px-2 py-1 disabled:cursor-no-drop bg-slate-200 border border-slate-300 rounded-md h-fit w-fit ${(!(arrayMovimentacoes.length > 1) || !((arrayMovimentacoes[page + 1]))) && 'cursor-no-drop'}`}>&gt;</button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </section > :
                    <section className="w-full mt-3 flex flex-col gap-3 items-center border bg-white border-zinc-200 rounded-lg py-5">
                        <img className='w-44 h-fit' src={image} alt="not found" />
                        <p className='text-center font-semibold text-xl'>Nenhuma movimentação encontrada<br />
                            para os filtros selecionados
                        </p>
                    </section>
            }
        </>
    )
}
