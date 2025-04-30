import * as XLSX from 'xlsx';
import { useContext, useEffect, useState } from 'react'
import image from '/none-result.svg'
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
    const apiURL = 'https://api.prohost.net.br'
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
        await fetch(`${apiURL}/reserva/index/${saas}`, {
            method: 'GET',
        })
            .then(data => data.json())
            .then((data) => {
                setIds(data)
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        getAll(dataToken?.id)
        const grupos = [];
        for (let i = 0; i < movimentacoes.length; i += 10) {
            grupos.push(movimentacoes.slice(i, i + 10));
        }
        if (grupos.length > 0)
            setArrayMovimentacoes(grupos);
        else
            setArrayMovimentacoes([[]]);
    }, [dataToken, movimentacoes])

    function gerarEbaixarCSVMovimentacoes(movimentacoes: any) {
        const headers = ["Data", "Categoria", "Descrição", "Acomodação", "Valor Bruto", "Valor Líquido"];
        const linhas = [headers.join(",")];

        movimentacoes.forEach((m: any) => {
            const dataFormatada = m.data && m.data !== '-' ? m.data.split('-').reverse().join('/') : '-';

            const categoria = m.categoria_financeiro
                ? m.categoria_financeiro.nome
                : m.nome?.startsWith("Continuidade")
                    ? "Continuidade"
                    : m.nome?.includes("Cancelamento")
                        ? "Cancelamento"
                        : "Diária";

            const descricao = m.reserva
                ? m.nome.replace(
                    m.nome.split('Reserva ')[1]?.split(' ')[0],
                    String(ids.find(i => i?.id == Number(m.nome.split('Reserva ')[1]?.split(' ')[0]))?.index || '')
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

    function gerarEbaixarExcelMovimentacoes(movimentacoes: any[]) {
        const dados = movimentacoes.map((e: any) => {
          // Formata data (ex: 2024-04-30 → 30/04/2024)
          const dataFormatada = e.data?.length === 1 ? e.data : 
            `${e.data.split('-')[2]}/${e.data.split('-')[1]}/${e.data.split('-')[0]}`;
      
          // Define categoria com base nas regras da UI
          let categoria = '';
          if (e.categoria_financeiro) {
            categoria = e.categoria_financeiro.nome;
          } else if (e.nome?.startsWith('Continuidade')) {
            categoria = 'Continuidade';
          } else if (e.nome?.includes('Cancelamento')) {
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
            'Valor Bruto': valorBruto,
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
                        <div
                            className="group relative flex items-end justify-end gap-5">
                            <button onClick={() => { gerarEbaixarCSVMovimentacoes(movimentacoes) }}
                                className="bg-white w-10 h-10 flex justify-center items-center rounded-lg hover:text-green-600 hover:translate-y-1 hover:duration-300 justify-self-end"
                            >
                                <svg className="w-10 h-10" fill="#16a34a" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 585.918 585.918"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M357.396,535.325c0.776,0.052,1.542,0.114,2.329,0.114h177.39c20.75,0,37.627-16.883,37.627-37.627V86.597 c0-20.743-16.877-37.628-37.627-37.628h-177.39c-0.781,0-1.553,0.07-2.329,0.118V0L11.176,46.206v492.311l346.22,47.401V535.325z M357.396,361.212h57.407v21.511h-57.407V361.212z M357.396,358.524v-21.905h57.407v21.905H357.396z M357.396,333.931v-25.13 h57.407v25.13H357.396z M357.396,306.113v-28.131h57.407v28.131H357.396z M357.396,275.688V248.89h57.407v26.798H357.396z M357.396,246.591v-26.798h56.262h1.146v26.798H357.396z M359.726,70.476h177.39c8.893,0,16.125,7.236,16.125,16.126v411.22 c0,8.888-7.232,16.127-16.125,16.127h-177.39c-0.792,0-1.563-0.121-2.329-0.243V385.018h59.706v-0.005h130.669V214.811h-0.117 v-26.409h-65.848h-2.299h-65.85v0.005h-56.262V70.711C358.162,70.594,358.929,70.476,359.726,70.476z M545.083,219.788v162.532 h-25.092V227.635h-17.228v154.684H488.41V243.525h-17.228v138.794h-12.642V259.223h-17.229v123.096h-24.21V277.977v-2.294v-26.798 v-2.299v-26.798h62.4h2.304H545.083z M481.807,217.499v-26.796h63.55v24.108h-0.273v2.688H481.807z M479.508,217.499h-62.405 h-1.144v-26.796h63.544v26.796H479.508z M98.663,321.536c7.126,0.127,15.097-1.407,19.812-3.327l3.614,19.927 c-4.399,2.226-14.268,4.462-26.974,4.121c-35.293-0.94-53.019-24.741-53.019-55.626c0-36.998,24.302-58.227,55.329-59.043 c12.263-0.329,21.67,2.097,25.933,4.328l-4.882,20.282c-4.869-2.092-11.588-3.969-19.969-3.827 c-18.528,0.309-32.715,12.422-32.715,36.824C65.791,307.152,77.843,321.186,98.663,321.536z M164.763,344.119 c-12.567-0.341-24.829-4.03-30.909-7.711l4.956-21.087c6.595,3.634,16.809,7.36,27.425,7.537 c11.556,0.2,17.722-4.683,17.722-12.225c0-7.219-5.321-11.366-18.707-16.394c-18.228-6.667-29.961-17.096-29.961-33.555 c0-19.32,15.455-34.518,41.512-35.2c12.683-0.339,22.111,2.179,28.903,5.134l-5.771,21.399c-4.569-2.176-12.633-5.315-23.625-5.134 c-10.884,0.178-16.125,5.364-16.125,11.31c0,7.307,6.212,10.482,20.609,16.042c19.99,7.52,29.523,18.271,29.523,34.784 C210.307,328.654,195.525,344.938,164.763,344.119z M288.053,345.61l-32.086-0.829l-37.772-118.466l29.103-0.748l14.551,50.26 c4.128,14.224,7.895,27.957,10.772,42.97l0.548,0.01c3.063-14.436,6.874-28.725,11.058-42.528l15.772-52.055l30.277-0.769 L288.053,345.61z"></path> </g> </g></svg>
                            </button>
                            <button onClick={() => { gerarEbaixarExcelMovimentacoes(movimentacoes) }}
                                className="bg-white w-10 h-10 flex justify-center items-center rounded-lg hover:text-green-600 hover:translate-y-1 hover:duration-300 justify-self-end"
                            >
                                <svg className="w-10 h-10" fill="#16a34a" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 588.601 588.6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M359.031,537.786c0.781,0.053,1.551,0.115,2.342,0.115h178.2c20.841,0,37.8-16.964,37.8-37.8V86.999 c0-20.838-16.959-37.8-37.8-37.8h-178.2c-0.791,0-1.561,0.076-2.342,0.124V0L11.228,46.417v494.564L359.031,588.6V537.786z M361.373,70.804h178.2c8.933,0,16.2,7.269,16.2,16.2v413.097c0,8.934-7.268,16.2-16.2,16.2h-178.2 c-0.802,0-1.571-0.11-2.342-0.232v-118.82h179.729V229.851H359.031V71.046C359.802,70.928,360.571,70.804,361.373,70.804z M443.818,356.749v35.1h-84.154v-35.1H443.818z M359.664,310.848V275.75h84.154v35.098H359.664z M533.361,275.75v35.098h-84.144 V275.75H533.361z M449.218,270.351V235.25h84.144v35.101H449.218z M533.361,356.749v35.1h-84.144v-35.1H533.361z M77.688,339.167 l-7.159-16.168c-2.906-6.181-4.77-10.758-6.961-15.853l-0.232-0.005c-1.616,5.01-3.57,9.486-5.967,15.467l-6.373,15.436 l-19.375-0.817l21.756-42.837l-20.994-42.124l19.514-0.545l6.719,15.66c2.294,5.255,4.023,9.5,5.875,14.401h0.221 c1.859-5.576,3.365-9.481,5.342-14.573l6.684-16.179l20.849-0.577l-22.734,43.563l23.955,46.032L77.688,339.167z M163.284,342.774 l-54.388-2.289v-90.337l19.251-0.54v74.271l35.137,1.019V342.774z M198.492,345.684c-10.832-0.464-21.347-3.744-26.552-6.908 l4.24-17.598c5.647,3.117,14.423,6.355,23.588,6.64c10.017,0.301,15.356-3.739,15.356-10.136c0-6.085-4.628-9.635-16.206-13.975 c-15.709-5.732-25.758-14.528-25.758-28.326c0-16.176,13.242-28.938,35.754-29.592c11.017-0.316,19.256,1.788,25.187,4.271 l-5.05,18.151c-3.986-1.849-11.021-4.522-20.574-4.369c-9.424,0.145-13.948,4.509-13.948,9.514c0,6.141,5.374,8.846,17.843,13.587 c17.418,6.46,25.769,15.636,25.769,29.646C238.151,333.25,225.224,346.839,198.492,345.684z M310.311,348.964l-10.035-19.195 c-4.063-7.33-6.661-12.751-9.73-18.789h-0.322c-2.251,5.911-4.986,11.185-8.34,18.246l-8.864,18.156l-26.892-1.128l30.201-50.352 l-29.138-49.599l27.092-0.752l9.368,18.457c3.204,6.199,5.605,11.211,8.192,17.004h0.324c2.587-6.597,4.693-11.219,7.465-17.247 l9.354-19.175l29.331-0.817l-31.957,51.706l33.677,54.729L310.311,348.964z"></path> </g> </g></svg>
                            </button>
                        </div>
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
                                                ${e.reserva == null && e.data != '-' ? 'cursor-pointer' : ''}`}
                                                    onClick={() => {
                                                        if (e.reserva == null && e.data != '-') {
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
                                                    <td className="text-center text-xs font-normal">{e.data.length == 1 ? e.data : e.data.split('-')[2] + '/' + e.data.split('-')[1] + '/' + e.data.split('-')[0]}</td>
                                                    <td className="text-xs font-normal capitalize flex items-center h-12 gap-3">
                                                        <div className="w-3 h-3 rounded-full" style={{
                                                            backgroundColor: e.categoria_financeiro ? e.categoria_financeiro.cor :
                                                                e.nome.split(' ')[0] == 'Continuidade' ? '#3CA6FC' : e.nome.includes('Cancelamento') ? '#EC8C17' : '#566DE7'
                                                        }}></div>
                                                        {e.categoria_financeiro ? e.categoria_financeiro.nome :
                                                            e.nome.split(' ')[0] == 'Continuidade' ? 'Continuidade' : e.nome.includes('Cancelamento') ? 'Cancelamento' : 'Diária'}
                                                    </td>
                                                    <td className="text-center text-xs font-normal">{e.reserva ? e.nome.replace(e.nome.split('Reserva ')[1].split(' ')[0], String(ids.filter(i => i?.id == Number(e.nome.split('Reserva ')[1].split(' ')[0]))[0].index)) : e.nome}</td>
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
