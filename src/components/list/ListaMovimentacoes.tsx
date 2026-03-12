import { ReactElement, useEffect, useState } from 'react';
import EditarMovimentacao from '../EditarMovimentacao';
import image from '/none-result.svg';
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


export default function ListaMovimentacoes({ saas, movimentacoes, ids, children, tipo }: { saas: number, movimentacoes: Movimentacao[], ids: { id: number, index: number }[], children?: ReactElement, tipo: number }) {

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
    const [despesa, setDespesa] = useState<boolean>(false)
    const [ediObs, setEdiObs] = useState<string | null>(null)
    const [numPaginacao, setNumPaginacao] = useState<number>(10)

    const [download, setDownload] = useState(false)

    function formatarMoedaBrasileira(valorStr: string) {
        const valor = parseFloat(valorStr);
        if (isNaN(valor)) {
            return "Valor inválido";
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    /* console.log(arrayMovimentacoes.length)
    console.log(page)
    console.log(arrayMovimentacoes[page])
    console.log(arrayMovimentacoes.length > page && arrayMovimentacoes[page]?.length > 0) */

    useEffect(() => {
        const grupos = [];
        for (let i = 0; i < movimentacoes?.length; i += numPaginacao) {
            grupos.push(movimentacoes.slice(i, i + numPaginacao));
        }
        if (grupos?.length > 0)
            setArrayMovimentacoes(grupos);
        else
            setArrayMovimentacoes([[]]);
        setPage(0)
    }, [saas, movimentacoes, numPaginacao])

    function gerarEbaixarCSVMovimentacoes(movimentacoes: any) {
        const headers = ["Data", "Categoria", "Descrição", "Acomodação", "Valor Total", "Valor Líquido"];
        const linhas = [headers.join(",")];

        movimentacoes.forEach((m: any) => {
            const dataFormatada = m.data && m.data != '-' ? m.data.split('-').reverse().join('/') : '-';

            const categoria = m.categoria_financeiro
                ? m.categoria_financeiro.nome
                : m.nome.startsWith("Continuidade")
                    ? "Continuidade"
                    : m.nome.includes("Cancelamento")
                        ? "Cancelamento"
                        : "Diária";

            const descricao = m.reserva
                ? m.nome.replace(
                    m.nome.split('Reserva ')[1]?.split(' ')[0],
                    String(ids.find(i => i?.id == Number(m.reserva))?.index || '')
                )
                : m.nome;

            const linha = [
                dataFormatada,
                categoria,
                descricao || "",
                m.acomodacao?.nome || "",
                formatarMoedaBrasileira(String(m.valor || 0)),
                formatarMoedaBrasileira(String(m.valor_liq || 0))
            ];

            linhas.push(linha.map(valor => `"${String(valor).replace(/"/g, '""')}"`).join(","));
        });

        const csvContent = "\uFEFF" + linhas.join("\n"); // Adiciona BOM para Excel

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "movimentacoes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function gerarEbaixarExcelMovimentacoes(movimentacoes: any[]) {
        const XLSX = await import('xlsx');
        const dados = movimentacoes.map((e: any) => {
            // Formata data (ex: 2024-04-30 → 30/04/2024)
            const dataFormatada = e.data?.length === 1 ? e.data :
                `${e.data.split('-')[2]}/${e.data.split('-')[1]}/${e.data.split('-')[0]}`;

            // Define categoria com base nas regras da UI
            let categoria = '';
            if (e.categoria_financeiro) {
                categoria = e.categoria_financeiro.nome;
            } else if (e.nome.startsWith('Continuidade')) {
                categoria = 'Continuidade';
            } else if (e.nome.includes('Cancelamento')) {
                categoria = 'Cancelamento';
            } else {
                categoria = 'Diária';
            }

            // Usa a descrição original
            const descricao = e.nome;

            // Formata valores monetários
            const valorBruto = Number(e.valor || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            const valorLiquido = Number(e.valor_liq || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            return {
                'Data': dataFormatada,
                'Categoria': categoria,
                'Descrição': descricao,
                'Acomodação': e.acomodacao?.nome || '',
                'Valor Total': valorBruto,
                'Valor Líquido': valorLiquido
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimentações');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `movimentacoes_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <section className="w-full min-h-56 border border-zinc-300 rounded-lg bg-white px-4 py-4 mt-8">
                {editavel && <EditarMovimentacao
                    close={() => setEditavel(false)}
                    id={ediID}
                    despesa={despesa}
                    categoria={ediCategoria}
                    descricao={ediDescricao}
                    recebedor={ediRecebedor}
                    acomodacao={ediAcomodacao}
                    data={ediData}
                    tipo_despesa={tipoDespesa}
                    valor={ediValor}
                    pago={ediPago}
                    saas={saas}
                    obs={ediObs} />}
                <div
                    className="group relative flex items-end justify-between gap-5">
                    {download && <section className='absolute flex gap-5 -top-9 -right-7'>
                        <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={() => { setDownload(false) }}></div>
                        <button onClick={() => {
                            gerarEbaixarCSVMovimentacoes(movimentacoes)
                            setDownload(false)
                        }}
                            className="bg-white w-10 h-8 flex justify-center items-center rounded-lg hover:text-green-600 hover:duration-300 justify-self-end border-2 border-green-600 z-10"
                        >
                            .csv
                        </button>
                        <button onClick={() => {
                            gerarEbaixarExcelMovimentacoes(movimentacoes)
                            setDownload(false)
                        }}
                            className="bg-white w-10 h-8 flex justify-center items-center rounded-lg hover:text-green-600 hover:duration-300 justify-self-end border-2 border-green-600 z-10"
                        >
                            .xlsx
                        </button>
                    </section>}
                    <>{children}</>
                    <button onClick={() => { setDownload(true) }}
                        className="bg-white w-10 h-10 flex justify-center items-center rounded-lg hover:text-green-600 hover:translate-y-1 hover:duration-300 justify-self-end border-2 border-green-600"
                    >
                        <svg
                            className="w-6 h-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                            ></path>
                        </svg>
                    </button>
                </div>
                {movimentacoes?.length > 0 ? <table className="w-full mt-3 border border-zinc-200 rounded-lg">
                    <thead className="w-full">
                        <tr className="text-sm bg-green-100 h-12">
                            <th className="text-center">Data</th>
                            <th className="text-center">Categoria</th>
                            <th className="text-center">Descrição</th>
                            <th className="text-center">Acomodação</th>
                            {tipo != 2 && <th className="text-center">Valor Total</th>}
                            <th className="text-center">Valor Líquido</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {
                            arrayMovimentacoes.length > page && arrayMovimentacoes[page]?.length > 0 ?
                                arrayMovimentacoes[page].map((e) => {
                                    return <>
                                        <tr className={`text-xs bg-white h-12 border border-zinc-200 w-full hover:bg-[#FAFBFD]
                                                ${e.reserva == null && e.data != '-' ? 'cursor-pointer' : ''}`}
                                            onClick={() => {
                                                if (e.reserva == null && e.data != '-') {
                                                    setEditavel(true)
                                                    setTipoDespesa(e.tipo_despesa || null)
                                                    setDespesa(!e.receita)
                                                    setEdiID(e.id || null)
                                                    setEdiCategoria(e.categoria_financeiro?.id || null)
                                                    setEdiDescricao(e.nome || null)
                                                    setEdiRecebedor(e.recebedor || null)
                                                    setEdiAcomodacao(e.acomodacao?.id || null)
                                                    setEdiData(e.data || null)
                                                    setEdiValor(e.valor || null)
                                                    setEdiPago(e.pago || null)
                                                    setEdiObs(e.obs || null)
                                                }
                                            }}>
                                            <td className="text-center text-xs font-normal">{e.data?.length == 1 ? e.data : e.data.split('-')[2] + '/' + e.data.split('-')[1] + '/' + e.data.split('-')[0]}</td>
                                            <td className="text-xs font-normal capitalize flex items-center h-12 gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{
                                                    backgroundColor: e.categoria_financeiro ? e.categoria_financeiro.cor :
                                                        e.nome.split(' ')[0] == 'Continuidade' ? '#3CA6FC' : e.nome.includes('Cancelamento') ? '#EC8C17' : '#566DE7'
                                                }}></div>
                                                {e.categoria_financeiro ? e.categoria_financeiro?.nome :
                                                    e.nome.split(' ')[0] == 'Continuidade' ? 'Continuidade' : e.nome.includes('Cancelamento') ? 'Cancelamento' : 'Diária'}
                                            </td>
                                            <td className="text-center text-xs font-normal">{e.reserva
                                                ? e.nome.replace(
                                                    e.nome.split('Reserva ')[1]?.split(' ')?.[0],
                                                    String(
                                                        ids.find(i => {
                                                            return i?.id == Number(e.reserva?.id)
                                                        }
                                                        )?.index
                                                    )
                                                )
                                                : e.nome}
                                            </td>
                                            <td className="text-center text-xs font-normal">{e.acomodacao ? e.acomodacao.nome : ''}</td>
                                            {tipo != 2 && <td className="text-center text-xs font-normal">{!e.receita ? '--' : formatarMoedaBrasileira(String(e.valor))}</td>}
                                            <td className="text-center text-xs font-normal">{formatarMoedaBrasileira(String(e.valor_liq))}</td>
                                        </tr >
                                    </>
                                })
                                : null
                        }
                    </tbody>
                    <tfoot className="text-xs bg-green-100 h-12">
                        <tr >
                            <td className="text-center">
                                Mostrando {page != 0 ? (page * numPaginacao) + 1 : '1'}-{(arrayMovimentacoes.length > page && (arrayMovimentacoes[page].length) >= numPaginacao) ? (page * numPaginacao) + (arrayMovimentacoes.length > page ? arrayMovimentacoes[page].length : 0) :
                                    (page == 0 ? 0 : ((page) * numPaginacao)) + (arrayMovimentacoes.length > page ? arrayMovimentacoes[page].length : 0)} de {movimentacoes?.length} resultados</td>
                            <td className="text-center"></td>
                            <td className="text-center">
                                <select name="num-paginacao" id="num-paginacao"
                                    onChange={(e) => setNumPaginacao(Number(e.target.value))}>
                                    <option value="10">10</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                </select>
                            </td>
                            <td className="text-center"></td>
                            {tipo != 2 && <td className="text-center"></td>}
                            <td className="text-center flex items-center h-12 gap-4">
                                <button disabled={!(arrayMovimentacoes?.length > 1) || !((arrayMovimentacoes[page - 1]))}
                                    onClick={() => {
                                        if ((arrayMovimentacoes[page - 1])) {
                                            setPage(page - 1)
                                        }
                                    }}
                                    className={`px-2 py-1 disabled:cursor-no-drop bg-slate-200 border border-slate-300 rounded-md h-fit w-fit ${(!(arrayMovimentacoes?.length > 1) || !((arrayMovimentacoes[page - 1]))) && 'cursor-no-drop'}`}>&lt;</button>
                                <div className="px-2 py-1 bg-slate-200 border border-slate-300 rounded-md h-fit w-fit">
                                    {page + 1}
                                </div>
                                <button disabled={!(arrayMovimentacoes?.length > 1) || !((arrayMovimentacoes[page + 1]))}
                                    onClick={() => {
                                        if ((arrayMovimentacoes[page + 1])) {
                                            setPage(page + 1)
                                        }
                                    }}
                                    className={`px-2 py-1 disabled:cursor-no-drop bg-slate-200 border border-slate-300 rounded-md h-fit w-fit ${(!(arrayMovimentacoes?.length > 1) || !((arrayMovimentacoes[page + 1]))) && 'cursor-no-drop'}`}>&gt;</button>
                            </td>
                            {tipo == 2 && <td className="text-center w-6"></td>}
                        </tr>
                    </tfoot>
                </table> :
                    <section className="w-full mt-3 flex flex-col gap-3 items-center border bg-white border-zinc-200 rounded-lg py-5">
                        <img className='w-44 h-fit' src={image} alt="not found" />
                        <p className='text-center font-semibold text-xl'>Nenhuma movimentação encontrada<br />
                            para os filtros selecionados
                        </p>
                    </section>}
            </section>
        </>
    )
}