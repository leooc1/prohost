import * as XLSX from 'xlsx';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AtualizarHospede from "../AtualizarHospede";
interface Hospede {
    id: number;
    saas: { id: number };
    nome: string;
    telefone: string | null;
    email: string | null;
}


export default function ListaHospede({ hospedes, atualizar, setAtualizar, permissao }: { hospedes: Hospede[], atualizar: [boolean, number], setAtualizar: Dispatch<SetStateAction<[boolean, number]>>, permissao: number }) {
    const apiURL = 'https://api.prohost.net.br'
    const [lhospedes, setLHospedes] = useState<Hospede[]>([])

    function Perfil(nome: string) {
        const array = nome.split(' ')
        const pnome = array[0][0]
        const unome = array[array.length - 1][0]
        if (array.length - 1 == 0)
            return pnome
        else
            return pnome + unome

    }

    async function excluir(idHospede: number) {
        await fetch(`${apiURL}/hospede/${idHospede}`,
            { method: 'DELETE' }
        )
            .then(data => data.json())
            .then(data => {
                if (data.affected == 1) {
                    alert('Excluído!')
                    location.reload()
                }
            })
            .catch(err => console.log(err))

    }

    function gerarEbaixarCSVHospedes(hospedes: any[]) {
        const headers = ["Perfil", "Nome", "E-mail", "Telefone"];
        const linhas = [headers.join(",")];

        function gerarPerfil(nome: string): string {
            if (!nome) return "";
            const partes = nome.trim().split(/\s+/); // Garante que múltiplos espaços não quebrem
            if (partes.length === 1) return partes[0][0].toUpperCase();
            return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
        }

        hospedes.forEach(h => {
            const linha = [
                gerarPerfil(h.nome),
                h.nome || "",
                h.email || "Não Informado",
                h.telefone || "Não Informado"
            ];
            linhas.push(linha.map(valor => `"${String(valor).replace(/"/g, '""')}"`).join(","));
        });

        const csvContent = "\uFEFF" + linhas.join("\n"); // BOM para Excel

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "hospedes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function gerarEbaixarExcelHospedes(hospedes: any[]) {
        function gerarPerfil(nome: string): string {
            if (!nome) return "";
            const partes = nome.trim().split(/\s+/);
            if (partes.length === 1) return partes[0][0].toUpperCase();
            return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
        }

        const dados = hospedes.map(h => ({
            "Perfil": gerarPerfil(h.nome),
            "Nome": h.nome || "",
            "E-mail": h.email || "Não Informado",
            "Telefone": h.telefone || "Não Informado"
        }));

        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hóspedes");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `hospedes_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    useEffect(() => {
        setLHospedes(hospedes)
    }, [hospedes])

    return (
        <section className="w-full min-h-56 border border-zinc-300 rounded-lg bg-white px-4 py-4 mt-8">
            <div className="flex justify-between">
                <label htmlFor="hospede" className="flex flex-col relative">
                    <svg className="w-4 h-fit absolute left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 56.966 56.966" ><g><path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" fill="#888888" opacity="1" data-original="#888888" ></path></g></svg>
                    <input type="text" name="hospede" id="hospede" placeholder="Buscar hóspede" className="pl-8 border border-zinc-300 rounded-md px-2 py-1 outline-none"
                        onChange={(e) => {
                            if (e.target.value.length == 0) {
                                setLHospedes(hospedes)
                            }
                            else {
                                setLHospedes(hospedes.filter((h) => h.nome.toLowerCase().includes(e.target.value.toLowerCase())))
                            }
                        }} />
                </label>
                <div
                    className="group relative flex items-end justify-end gap-5">
                    <button onClick={() => { gerarEbaixarCSVHospedes(hospedes) }}
                        className="bg-white w-10 h-10 flex justify-center items-center rounded-lg hover:text-green-600 hover:translate-y-1 hover:duration-300 justify-self-end"
                    >
                        <svg className="w-10 h-10" fill="#16a34a" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 585.918 585.918"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M357.396,535.325c0.776,0.052,1.542,0.114,2.329,0.114h177.39c20.75,0,37.627-16.883,37.627-37.627V86.597 c0-20.743-16.877-37.628-37.627-37.628h-177.39c-0.781,0-1.553,0.07-2.329,0.118V0L11.176,46.206v492.311l346.22,47.401V535.325z M357.396,361.212h57.407v21.511h-57.407V361.212z M357.396,358.524v-21.905h57.407v21.905H357.396z M357.396,333.931v-25.13 h57.407v25.13H357.396z M357.396,306.113v-28.131h57.407v28.131H357.396z M357.396,275.688V248.89h57.407v26.798H357.396z M357.396,246.591v-26.798h56.262h1.146v26.798H357.396z M359.726,70.476h177.39c8.893,0,16.125,7.236,16.125,16.126v411.22 c0,8.888-7.232,16.127-16.125,16.127h-177.39c-0.792,0-1.563-0.121-2.329-0.243V385.018h59.706v-0.005h130.669V214.811h-0.117 v-26.409h-65.848h-2.299h-65.85v0.005h-56.262V70.711C358.162,70.594,358.929,70.476,359.726,70.476z M545.083,219.788v162.532 h-25.092V227.635h-17.228v154.684H488.41V243.525h-17.228v138.794h-12.642V259.223h-17.229v123.096h-24.21V277.977v-2.294v-26.798 v-2.299v-26.798h62.4h2.304H545.083z M481.807,217.499v-26.796h63.55v24.108h-0.273v2.688H481.807z M479.508,217.499h-62.405 h-1.144v-26.796h63.544v26.796H479.508z M98.663,321.536c7.126,0.127,15.097-1.407,19.812-3.327l3.614,19.927 c-4.399,2.226-14.268,4.462-26.974,4.121c-35.293-0.94-53.019-24.741-53.019-55.626c0-36.998,24.302-58.227,55.329-59.043 c12.263-0.329,21.67,2.097,25.933,4.328l-4.882,20.282c-4.869-2.092-11.588-3.969-19.969-3.827 c-18.528,0.309-32.715,12.422-32.715,36.824C65.791,307.152,77.843,321.186,98.663,321.536z M164.763,344.119 c-12.567-0.341-24.829-4.03-30.909-7.711l4.956-21.087c6.595,3.634,16.809,7.36,27.425,7.537 c11.556,0.2,17.722-4.683,17.722-12.225c0-7.219-5.321-11.366-18.707-16.394c-18.228-6.667-29.961-17.096-29.961-33.555 c0-19.32,15.455-34.518,41.512-35.2c12.683-0.339,22.111,2.179,28.903,5.134l-5.771,21.399c-4.569-2.176-12.633-5.315-23.625-5.134 c-10.884,0.178-16.125,5.364-16.125,11.31c0,7.307,6.212,10.482,20.609,16.042c19.99,7.52,29.523,18.271,29.523,34.784 C210.307,328.654,195.525,344.938,164.763,344.119z M288.053,345.61l-32.086-0.829l-37.772-118.466l29.103-0.748l14.551,50.26 c4.128,14.224,7.895,27.957,10.772,42.97l0.548,0.01c3.063-14.436,6.874-28.725,11.058-42.528l15.772-52.055l30.277-0.769 L288.053,345.61z"></path> </g> </g></svg>
                    </button>
                    <button onClick={() => { gerarEbaixarExcelHospedes(hospedes) }}
                        className="bg-white w-10 h-10 flex justify-center items-center rounded-lg hover:text-green-600 hover:translate-y-1 hover:duration-300 justify-self-end"
                    >
                        <svg className="w-10 h-10" fill="#16a34a" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 588.601 588.6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M359.031,537.786c0.781,0.053,1.551,0.115,2.342,0.115h178.2c20.841,0,37.8-16.964,37.8-37.8V86.999 c0-20.838-16.959-37.8-37.8-37.8h-178.2c-0.791,0-1.561,0.076-2.342,0.124V0L11.228,46.417v494.564L359.031,588.6V537.786z M361.373,70.804h178.2c8.933,0,16.2,7.269,16.2,16.2v413.097c0,8.934-7.268,16.2-16.2,16.2h-178.2 c-0.802,0-1.571-0.11-2.342-0.232v-118.82h179.729V229.851H359.031V71.046C359.802,70.928,360.571,70.804,361.373,70.804z M443.818,356.749v35.1h-84.154v-35.1H443.818z M359.664,310.848V275.75h84.154v35.098H359.664z M533.361,275.75v35.098h-84.144 V275.75H533.361z M449.218,270.351V235.25h84.144v35.101H449.218z M533.361,356.749v35.1h-84.144v-35.1H533.361z M77.688,339.167 l-7.159-16.168c-2.906-6.181-4.77-10.758-6.961-15.853l-0.232-0.005c-1.616,5.01-3.57,9.486-5.967,15.467l-6.373,15.436 l-19.375-0.817l21.756-42.837l-20.994-42.124l19.514-0.545l6.719,15.66c2.294,5.255,4.023,9.5,5.875,14.401h0.221 c1.859-5.576,3.365-9.481,5.342-14.573l6.684-16.179l20.849-0.577l-22.734,43.563l23.955,46.032L77.688,339.167z M163.284,342.774 l-54.388-2.289v-90.337l19.251-0.54v74.271l35.137,1.019V342.774z M198.492,345.684c-10.832-0.464-21.347-3.744-26.552-6.908 l4.24-17.598c5.647,3.117,14.423,6.355,23.588,6.64c10.017,0.301,15.356-3.739,15.356-10.136c0-6.085-4.628-9.635-16.206-13.975 c-15.709-5.732-25.758-14.528-25.758-28.326c0-16.176,13.242-28.938,35.754-29.592c11.017-0.316,19.256,1.788,25.187,4.271 l-5.05,18.151c-3.986-1.849-11.021-4.522-20.574-4.369c-9.424,0.145-13.948,4.509-13.948,9.514c0,6.141,5.374,8.846,17.843,13.587 c17.418,6.46,25.769,15.636,25.769,29.646C238.151,333.25,225.224,346.839,198.492,345.684z M310.311,348.964l-10.035-19.195 c-4.063-7.33-6.661-12.751-9.73-18.789h-0.322c-2.251,5.911-4.986,11.185-8.34,18.246l-8.864,18.156l-26.892-1.128l30.201-50.352 l-29.138-49.599l27.092-0.752l9.368,18.457c3.204,6.199,5.605,11.211,8.192,17.004h0.324c2.587-6.597,4.693-11.219,7.465-17.247 l9.354-19.175l29.331-0.817l-31.957,51.706l33.677,54.729L310.311,348.964z"></path> </g> </g></svg>
                    </button>
                </div>
            </div>
            <table className="w-full mt-3 border border-zinc-200 rounded-lg">
                <thead className="w-full">
                    <tr className="text-sm bg-slate-50 h-12">
                        <th className="text-center px-3">Perfil</th>
                        <th className="text-start">Nome</th>
                        <th className="text-center">E-mail</th>
                        <th className="text-center">Telefone</th>
                        <th className="text-center"></th>
                    </tr>
                </thead>
                <tbody className="">
                    {
                        lhospedes.length > 0 ?
                            lhospedes.map((e) =>
                                <>
                                    {atualizar[0] && <AtualizarHospede id={atualizar[1]} close={() => setAtualizar([false, 0])} />}
                                    <tr onClick={() => {
                                        if (!(permissao >= 3)) { return }
                                        setAtualizar([true, e.id])
                                    }} className="cursor-pointer text-sm bg-white h-12 border border-zinc-200 w-full hover:bg-[#FAFBFD]">
                                        <td className="flex h-12 items-center justify-center text-sm font-medium">
                                            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-[#B1C2D9] text-white font-medium">{Perfil(e.nome)}</div>
                                        </td>
                                        <td className="text-start text-sm font-medium">{e.nome}</td>
                                        <td className="text-center text-sm font-medium">{e.email ? e.email : <span className="italic">Não Informado</span>}</td>
                                        <td className="text-center text-sm font-medium">{e.telefone ? e.telefone : <span className="italic">Não Informado</span>}</td>
                                        <td className="text-center text-sm font-medium cursor-pointer hover:bg-red-200 rounded-xl transition-all duration-300"
                                            onClick={(ex) => {
                                                if (!(permissao >= 4)) { return }
                                                let confirmDelete = false
                                                ex.stopPropagation()
                                                confirmDelete = confirm("Deseja deletar este hóspede?")
                                                if (confirmDelete)
                                                    excluir(e.id)
                                            }}>
                                            <svg className="h-fit w-5 m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9ZM9 12V18H11V12H9ZM13 12V18H15V12H13Z"></path></svg>
                                        </td>
                                    </tr>
                                </>
                            )
                            : null
                    }
                </tbody>
            </table>
        </section>
    )
}
