import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AtualizarHospede from "../AtualizarHospede";
import Notify from "../notify/Notify";
import { ModalAlert } from "../ModalAlert";

interface Hospede {
  id: number;
  saas: { id: number };
  nome: string;
  telefone: string | null;
  email: string | null;
}

export default function ListaHospede({
  saas,
  hospedes,
  atualizar,
  setAtualizar,
  permissao,
}: {
  saas: number;
  hospedes: Hospede[];
  atualizar: [boolean, number];
  setAtualizar: Dispatch<SetStateAction<[boolean, number]>>;
  permissao: number;
}) {
  const apiURL = import.meta.env.VITE_API_URL;
  const [lhospedes, setLHospedes] = useState<Hospede[]>([]);
  const [notify, setNotify] = useState({ type: 1, text: "Criado!" });
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [acomodacoes, setAcomodacoes] = useState<
    { hospede: number; acomodacoes: string[] }[]
  >([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hospedeToDelete, setHospedeToDelete] = useState<Hospede | null>(null);

  function Perfil(nome: string) {
    const array = nome.trim().split(" ");
    const pnome = array[0][0];
    const unome = array[array.length - 1][0];
    if (array.length - 1 == 0) return pnome || "";
    else return pnome + (unome ? unome : "");
  }

  async function excluir(idHospede: number) {
    await fetch(`${apiURL}/hospede/${idHospede}`, { method: "DELETE" })
      .then((data) => data.json())
      .then((data) => {
        if (data.affected == 1) {
          setNotify({ type: 1, text: "Excluído!" });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
            location.reload();
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  }

  async function arrayAcomodacao() {
    await fetch(`${apiURL}/hospede/acomodacao/${saas}`, { method: "GET" })
      .then((data) => data.json())
      .then((data) => {
        setLHospedes(hospedes);
        setAcomodacoes(data);
      })
      .catch((err) => console.log(err));
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

    hospedes.forEach((h) => {
      const linha = [
        gerarPerfil(h.nome),
        h.nome || "",
        h.email || "Não Informado",
        h.telefone || "Não Informado",
      ];
      linhas.push(
        linha
          .map((valor) => `"${String(valor).replace(/"/g, '""')}"`)
          .join(","),
      );
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

  async function gerarEbaixarExcelHospedes(hospedes: any[]) {
    const XLSX = await import("xlsx");
    function gerarPerfil(nome: string): string {
      if (!nome) return "";
      const partes = nome.trim().split(/\s+/);
      if (partes.length === 1) return partes[0][0].toUpperCase();
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }

    const dados = hospedes.map((h) => ({
      Perfil: gerarPerfil(h.nome),
      Nome: h.nome || "",
      "E-mail": h.email || "Não Informado",
      Telefone: h.telefone || "Não Informado",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hóspedes");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `hospedes_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function abrirModalExclusao(hospede: Hospede) {
    setHospedeToDelete(hospede);
    setShowDeleteModal(true);
  }

  function fecharModalExclusao() {
    setShowDeleteModal(false);
    setHospedeToDelete(null);
  }

  async function confirmarExclusao() {
    if (!hospedeToDelete) return;
    await excluir(hospedeToDelete.id);
    fecharModalExclusao();
  }

  const [download, setDownload] = useState(false);

  useEffect(() => {
    arrayAcomodacao();
  }, [hospedes]);

  return (
    <section className="w-full min-h-56 border border-zinc-300 rounded-lg bg-white px-4 py-4 mt-8 md:mb-0 mb-20">
      {atualizar[0] && (
        <AtualizarHospede
          id={atualizar[1]}
          close={() => setAtualizar([false, 0])}
        />
      )}
      {showNotify && <Notify type={notify.type} text={notify.text} />}
      {showDeleteModal && hospedeToDelete && (
        <ModalAlert
          title="Excluir hóspede"
          message={`Deseja excluir permanentemente "${hospedeToDelete.nome}"?`}
          onClose={fecharModalExclusao}
          onConfirm={confirmarExclusao}
          confirmText="Excluir"
          cancelText="Cancelar"
          colorButton="red"
        />
      )}
      <div className="flex justify-between md:gap-0 gap-2 flex-wrap">
        <label htmlFor="search-hospede" className="flex flex-col relative">
          <svg
            className="w-4 h-fit absolute left-2 top-1/2 -translate-y-1/2"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="512"
            height="512"
            x="0"
            y="0"
            viewBox="0 0 56.966 56.966"
          >
            <g>
              <path
                d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z"
                fill="#888888"
                opacity="1"
                data-original="#888888"
              ></path>
            </g>
          </svg>
          <input
            type="text"
            name="search-hospede"
            id="search-hospede"
            placeholder="Buscar hóspede"
            className="pl-8 border border-zinc-300 rounded-md px-2 py-1 outline-none"
            onChange={(e) => {
              if (e.target.value.length == 0) {
                setLHospedes(hospedes);
              } else {
                setLHospedes(
                  hospedes.filter((h) =>
                    h.nome.toLowerCase().includes(e.target.value.toLowerCase()),
                  ),
                );
              }
            }}
          />
        </label>
        <div className="group relative flex items-end justify-end gap-5">
          {download && (
            <section className="absolute flex gap-5 -top-9 -right-7">
              <div
                className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20"
                onClick={() => {
                  setDownload(false);
                }}
              ></div>
              <button
                onClick={() => {
                  gerarEbaixarCSVHospedes(hospedes);
                  setDownload(false);
                }}
                className="bg-white w-10 h-8 flex justify-center items-center rounded-lg hover:text-green-600 hover:duration-300 justify-self-end border-2 border-green-600 z-10"
              >
                .csv
              </button>
              <button
                onClick={() => {
                  gerarEbaixarExcelHospedes(hospedes);
                  setDownload(false);
                }}
                className="bg-white w-10 h-8 flex justify-center items-center rounded-lg hover:text-green-600 hover:duration-300 justify-self-end border-2 border-green-600 z-10"
              >
                .xlsx
              </button>
            </section>
          )}
          <button
            onClick={() => {
              setDownload(true);
            }}
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
                strokeLinecap="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-scroll">
        <table className="md:w-full mt-3 border border-zinc-200 rounded-lg grid w-[1100px]">
          <thead className="table table-fixed w-full">
            <tr className="text-sm bg-slate-50 h-12">
              <th className="text-center px-3">Perfil</th>
              <th className="text-start">Nome</th>
              {<th className="text-start">Hospedou-se em</th>}
              <th className="text-center">E-mail</th>
              <th className="text-center">Telefone</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll block md:max-h-[calc(100vh-150px)] max-h-[calc(100vh-250px)]">
            {lhospedes.length > 0
              ? lhospedes.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => {
                      if (!(permissao >= 3)) {
                        return;
                      }
                      setAtualizar([true, e.id]);
                    }}
                    className="text-xs bg-white h-12 border border-zinc-200 table table-fixed w-full"
                  >
                    <td className="flex h-12 items-center justify-center text-sm font-medium">
                      <div className="w-10 h-10 flex justify-center items-center rounded-full bg-[#B1C2D9] text-white font-medium">
                        {Perfil(e.nome)}
                      </div>
                    </td>
                    <td className="text-start text-sm font-medium">{e.nome}</td>
                    {
                      <td
                        className="text-start text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis max-w-60"
                        title={acomodacoes
                          .find((a) => a.hospede == e.id)
                          ?.acomodacoes.toString()
                          .replace(",", ", ")}
                      >
                        {acomodacoes
                          .find((a) => a.hospede == e.id)
                          ?.acomodacoes.toString()
                          .replace(",", ", ")}
                      </td>
                    }
                    <td className="text-center text-sm font-medium">
                      {e.email ? (
                        e.email
                      ) : (
                        <span className="italic">Não Informado</span>
                      )}
                    </td>
                    <td className="text-center text-sm font-medium">
                      {e.telefone ? (
                        e.telefone
                      ) : (
                        <span className="italic">Não Informado</span>
                      )}
                    </td>
                    <td
                      className="text-center text-sm font-medium cursor-pointer hover:bg-red-200 rounded-xl transition-all duration-300"
                      onClick={(ex) => {
                        if (!(permissao >= 4)) return;
                        ex.stopPropagation();
                        abrirModalExclusao(e);
                      }}
                    >
                      <svg
                        className="h-fit w-5 m-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#ED3E44"
                      >
                        <path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9ZM9 12V18H11V12H9ZM13 12V18H15V12H13Z"></path>
                      </svg>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
