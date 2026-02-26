import { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  SideBarContext,
  SideBarProvider,
} from "../contexts/SideBarMenuContext";
import RelatorioCompleto from "../report/RelatorioCompleto";
import { ModalAlert } from "../components/ModalAlert";
import Loader from "../components/Loader";

export default function Relatorio() {
  const apiURL = import.meta.env.VITE_API_URL;
  const { dataToken } = useContext(SideBarContext);
  const [allAcomodacoes, setAllAcomodacoes] = useState<any>([]);
  const [acomodacoes, setAcomodacoes] = useState<any>([]);
  const [searchAcomodacao, setSearchAcomodacao] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [relatorio, setRelatorio] = useState<boolean>(false);
  const [chooseAc, setChooseAc] = useState<number | null>(null);
  const [chooseMes, setChooseMes] = useState<number>(new Date().getMonth() + 1);
  const [chooseAno, setChooseAno] = useState<number>(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

<<<<<<< HEAD
  const anos = Array.from(
    { length: new Date().getFullYear() - 2010 + 1 },
    (_, i) => new Date().getFullYear() - i,
  );
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalToAlert, setModalToAlert] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function getData() {
    setLoaded(false);
    await fetch(`${apiURL}/acomodacao/${dataToken.id}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data: any[]) => {
        const ativas = data.filter((e) => !e.desativado);
        setAllAcomodacoes(ativas);
        setAcomodacoes(ativas);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setLoaded(true);
      });
  }

  function handleSearchAcomodacao(value: string) {
    setSearchAcomodacao(value);
    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      setAcomodacoes(allAcomodacoes);
      return;
    }

    setAcomodacoes(
      allAcomodacoes.filter((acomodacao: any) =>
        acomodacao.nome.toLowerCase().includes(normalized),
      ),
=======
    const [corPrimaria, setCorPrimaria] = useState("#003347");
    const [corSecundaria, setCorSecundaria] = useState("#08fab8");
    const [corLetra, setCorLetra] = useState("#ffffff");

    const anos = Array.from(
        { length: new Date().getFullYear() - 2010 + 1 },
        (_, i) => new Date().getFullYear() - i,
>>>>>>> 604dd11b360ab5f007778bd55bc05a49c2944b0b
    );
  }

  useEffect(() => {
    if (dataToken) {
      getData();
      if (localStorage.getItem("previewFoto")) {
        setFoto(localStorage.getItem("previewFoto"));
      }
    }
  }, [dataToken, foto]);

  function abrirModalAlert(modalName: string) {
    setModalToAlert(modalName);
    setShowAlertModal(true);
  }

  function fecharModalAlert() {
    setShowAlertModal(false);
    setModalToAlert(null);
  }

  function confirmarModal() {
    if (!modalToAlert) return;
    fecharModalAlert();
  }

  return loaded ? (
    <section>
      <SideBarProvider>
        <>
          {showAlertModal && modalToAlert === "choose-acomodacao" && (
            <ModalAlert
              title="Nenhuma acomodação selecionada"
              message="Por favor, selecione uma acomodação para gerar o relatório."
              onClose={fecharModalAlert}
              onConfirm={confirmarModal}
              confirmText="Entendido"
              cancelText=''
              colorButton="green"
            />
          )}
          {isGenerating && <Loader />}
          {!relatorio && (
            <section className="max-w-7xl mx-auto px-4 pt-2">
              <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-8 xl:col-span-9">
                  <section className="w-full max-w-none lg:mx-0">
                    <p className="text-2xl font-semibold text-center flex justify-center lg:text-left text-[#0A3D66]">
                      Escolha a acomodação para gerar o relatório
                    </p>
                    <p className="flex justify-center text-center lg:text-left text-sm text-zinc-500 mt-1">
                      Use a busca para encontrar mais rápido pela identificação
                      da acomodação.
                    </p>
                    <label
                      htmlFor="search-acomodacao"
                      className="mt-5 relative block"
                    >
                      <svg
                        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 fill-zinc-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 56.966 56.966"
                      >
                        <path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" />
                      </svg>
                      <input
                        type="text"
                        name="search-acomodacao"
                        id="search-acomodacao"
                        placeholder={isSearchFocused ? "" : "Buscar acomodação"}
                        value={searchAcomodacao}
                        className="w-full h-11 pl-9 pr-16 border border-zinc-300 rounded-lg outline-none text-base bg-white text-center placeholder:text-center focus:border-[#0A4A73] focus:ring-2 focus:ring-[#0A4A73]/15 transition-all"
                        onChange={(event) =>
                          handleSearchAcomodacao(event.target.value)
                        }
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                      />
                      {searchAcomodacao.length > 0 && (
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-700 px-2 py-1 rounded"
                          onClick={() => handleSearchAcomodacao("")}
                        >
                          Limpar
                        </button>
                      )}
                    </label>
                  </section>
                </div>

                <div className="md:col-span-8 xl:col-span-9 md:row-start-2">
                  {acomodacoes.length ? (
                    <section className="pb-8">
                      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {acomodacoes.map((e: any) => {
                          const isSelected = e.id === chooseAc;

                          return (
                            <li
                              key={e.id}
                              className={`relative rounded-xl border p-2 cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? "border-[#003447] bg-white ring-2 ring-[#003447]/20"
                                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:-translate-y-0.5 hover:shadow-sm"
                              }`}
                              onClick={() => setChooseAc(e.id)}
                              role="button"
                              tabIndex={0}
                              aria-pressed={isSelected}
                              onKeyDown={(ev) => {
                                if (ev.key === "Enter" || ev.key === " ") {
                                  ev.preventDefault();
                                  setChooseAc(e.id);
                                }
                              }}
                            >
                              {isSelected && (
                                <span className="absolute right-2 top-2 z-10 h-5 w-5 rounded bg-[#003447] text-white text-xs flex items-center justify-center">
                                  ✓
                                </span>
                              )}
                              {e.foto ? (
                                <img
                                  src={e.foto}
                                  className="h-28 w-full rounded object-cover"
                                />
                              ) : (
                                <div className="h-28 w-full rounded border border-zinc-300 bg-zinc-100 flex items-center justify-center">
                                  <svg
                                    className="w-12 h-12"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="#777777"
                                  >
                                    <path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
                                  </svg>
                                </div>
                              )}

                              <p
                                className="mt-2 text-base font-semibold text-[#0A3D66] truncate"
                                title={e.nome}
                              >
                                {e.nome}
                              </p>

                              <button
                                type="button"
                                className={`mt-3 w-full rounded-md py-2 text-sm font-medium ${
                                  isSelected
                                    ? "bg-[#0A4A73] text-white"
                                    : "border border-zinc-300 bg-transparent text-[#1F2937]"
                                }`}
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  setChooseAc(e.id);
                                }}
                              >
                                {isSelected ? "Selecionado" : "Selecionar"}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ) : (
                    <section className="max-w-3xl">
                      <div className="w-full rounded-lg border border-zinc-200 bg-white p-5 text-center">
                        <p className="text-sm text-zinc-600">
                          {searchAcomodacao.trim().length > 0 ? (
                            <>
                              Nenhuma acomodação encontrada para{" "}
                              <span className="font-medium">
                                "{searchAcomodacao}"
                              </span>
                              .
                            </>
                          ) : (
                            <>Nenhuma acomodação disponível no momento.</>
                          )}
                        </p>
                      </div>
                    </section>
                  )}
                </div>

<<<<<<< HEAD
                <aside className="md:col-span-4 xl:col-span-3 md:row-start-2 rounded-xl border border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm lg:sticky lg:top-4">
                  <div className="px-4 py-3 border-b border-zinc-200">
                    <h2 className="text-xl font-semibold text-[#1B2B44]">
                      Painel de filtros
                    </h2>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-zinc-700 font-medium text-sm">
                        Logo da empresa (opcional)
                      </span>
                      <div className="flex gap-2 items-end">
                        <label
                          htmlFor="imagem"
                          className={`flex-1 flex flex-col gap-1`}
                        >
                          <div
                            id="input-file"
                            className={`${foto ? "hidden" : ""} w-full h-24 cursor-pointer flex border border-zinc-300 rounded-md px-1 py-1 outline-none items-center`}
                          >
                            <svg
                              className="w-24"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#777777"
                            >
                              <path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
                            </svg>
                            <p className="text-zinc-400 p-1 text-center text-sm">
                              Clique ou arraste uma imagem aqui
                            </p>
                          </div>
                          <img
                            id="preview"
                            src={foto || ""}
                            alt="Pré-Visualização da Imagem"
                            className={`${foto ? "" : "hidden"} w-full h-24 object-contain cursor-pointer border border-zinc-300 rounded-md px-1 py-1 outline-none`}
                          />
                          <input
                            type="file"
                            name="imagem"
                            id="imagem"
                            accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng"
                            className={"hidden"}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const input = document.getElementById(
                                "input-file",
                              ) as HTMLInputElement | null;
                              const preview = document.getElementById(
                                "preview",
                              ) as HTMLImageElement | null;
                              const file = e.target.files?.[0];
                              if (file) {
                                console.log(file);
                                if (preview) {
                                  preview.classList.remove("hidden");
                                  input?.classList.add("hidden");
                                  const reader = new FileReader();
                                  reader.onload = (
                                    event: ProgressEvent<FileReader>,
                                  ) => {
                                    if (event.target) {
                                      preview.src = event.target
                                        .result as string;
                                      localStorage.setItem(
                                        "previewFoto",
                                        preview.src,
                                      );
                                      setFoto(preview.src);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              } else {
                                preview?.classList.add("hidden");
                                input?.classList.remove("hidden");
                                localStorage.removeItem("previewFoto");
                                setFoto(null);
                              }
=======
                                                            <p
                                                                className="mt-2 text-base font-semibold text-[#0A3D66] truncate"
                                                                title={e.nome}
                                                            >
                                                                {e.nome}
                                                            </p>

                                                            <button
                                                                type="button"
                                                                className={`mt-3 w-full rounded-md py-2 text-sm font-medium ${isSelected
                                                                    ? "bg-[#0A4A73] text-white"
                                                                    : "border border-zinc-300 bg-transparent text-[#1F2937]"
                                                                    }`}
                                                                onClick={(ev) => {
                                                                    ev.stopPropagation();
                                                                    setChooseAc(e.id);
                                                                }}
                                                            >
                                                                {isSelected ? "Selecionado" : "Selecionar"}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </section>
                                    ) : (
                                        <section className="w-full flex justify-center">
                                            <div className="w-full rounded-lg border border-zinc-200 bg-white p-5 text-center">
                                                <p className="text-sm text-zinc-600">
                                                    {searchAcomodacao.trim().length > 0 ? (
                                                        <>
                                                            Nenhuma acomodação encontrada para{" "}
                                                            <span className="font-medium">
                                                                "{searchAcomodacao}"
                                                            </span>
                                                            .
                                                        </>
                                                    ) : (
                                                        <>Nenhuma acomodação disponível no momento.</>
                                                    )}
                                                </p>
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <aside className="md:col-span-4 xl:col-span-3 md:row-start-2 rounded-xl border border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm lg:sticky lg:top-4">
                                    <div className="px-4 py-3 border-b border-zinc-200">
                                        <h2 className="text-xl font-semibold text-[#1B2B44]">
                                            Painel de filtros
                                        </h2>
                                    </div>
                                    <div className="p-4 flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-zinc-700 font-medium text-sm">
                                                Logo da empresa (opcional)
                                            </span>
                                            <div className="flex gap-2 items-end">
                                                <label
                                                    htmlFor="imagem"
                                                    className={`flex-1 flex flex-col gap-1`}
                                                >
                                                    <div
                                                        id="input-file"
                                                        className={`${foto ? "hidden" : ""} w-full h-24 cursor-pointer flex border border-zinc-300 rounded-md px-1 py-1 outline-none items-center`}
                                                    >
                                                        <svg
                                                            className="w-24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="#777777"
                                                        >
                                                            <path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
                                                        </svg>
                                                        <p className="text-zinc-400 p-1 text-center text-sm">
                                                            Clique ou arraste uma imagem aqui
                                                        </p>
                                                    </div>
                                                    <img
                                                        id="preview"
                                                        src={foto || ""}
                                                        alt="Pré-Visualização da Imagem"
                                                        className={`${foto ? "" : "hidden"} w-full h-24 object-contain cursor-pointer border border-zinc-300 rounded-md px-1 py-1 outline-none`}
                                                    />
                                                    <input
                                                        type="file"
                                                        name="imagem"
                                                        id="imagem"
                                                        accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng"
                                                        className={"hidden"}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            const input = document.getElementById(
                                                                "input-file",
                                                            ) as HTMLInputElement | null;
                                                            const preview = document.getElementById(
                                                                "preview",
                                                            ) as HTMLImageElement | null;
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                console.log(file);
                                                                if (preview) {
                                                                    preview.classList.remove("hidden");
                                                                    input?.classList.add("hidden");
                                                                    const reader = new FileReader();
                                                                    reader.onload = (
                                                                        event: ProgressEvent<FileReader>,
                                                                    ) => {
                                                                        if (event.target) {
                                                                            preview.src = event.target
                                                                                .result as string;
                                                                            localStorage.setItem(
                                                                                "previewFoto",
                                                                                preview.src,
                                                                            );
                                                                            setFoto(preview.src);
                                                                        }
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            } else {
                                                                preview?.classList.add("hidden");
                                                                input?.classList.remove("hidden");
                                                                localStorage.removeItem("previewFoto");
                                                                setFoto(null);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <div className="flex flex-col justify-end gap-1 pb-1">
                                                    <button
                                                        onClick={() => {
                                                            const input = document.getElementById(
                                                                "imagem",
                                                            ) as HTMLInputElement | null;
                                                            input?.click();
                                                        }}
                                                    >
                                                        <svg
                                                            className="w-5 h-fit fill-blue-600"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            localStorage.removeItem("previewFoto");
                                                            setFoto(null);
                                                        }}
                                                    >
                                                        <svg
                                                            className="w-5 h-fit fill-red-600"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <label
                                            htmlFor="mes"
                                            className={`flex flex-col text-zinc-600 font-medium text-sm`}
                                        >
                                            Mês
                                            <select
                                                name="mes"
                                                id="mes"
                                                className={`border border-zinc-300 rounded-md px-2 py-1 h-12 outline-none text-base`}
                                                value={chooseMes}
                                                onChange={(e) => setChooseMes(Number(e.target.value))}
                                            >
                                                <option value="1">Janeiro</option>
                                                <option value="2">Fevereiro</option>
                                                <option value="3">Março</option>
                                                <option value="4">Abril</option>
                                                <option value="5">Maio</option>
                                                <option value="6">Junho</option>
                                                <option value="7">Julho</option>
                                                <option value="8">Agosto</option>
                                                <option value="9">Setembro</option>
                                                <option value="10">Outubro</option>
                                                <option value="11">Novembro</option>
                                                <option value="12">Dezembro</option>
                                            </select>
                                        </label>
                                        <label
                                            htmlFor="ano"
                                            className={`flex flex-col text-zinc-600 font-medium text-sm`}
                                        >
                                            Ano
                                            <select
                                                name="ano"
                                                id="ano"
                                                className={`border border-zinc-300 rounded-md px-2 py-1 h-12 outline-none text-base`}
                                                value={chooseAno}
                                                onChange={(e) => setChooseAno(Number(e.target.value))}
                                            >
                                                {anos.map((ano) => (
                                                    <option key={ano} value={ano}>
                                                        {ano}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <section className="max-w-md mx-auto p-6 rounded-2xl">

                                            <h2 className="text-base font-semibold text-gray-800 mb-4">
                                                Personalização de Cores
                                            </h2>

                                            <div className="flex items-center justify-between">
                                                <label htmlFor="cor-primaria" className="text-sm font-medium text-gray-700">
                                                    Cor Primária
                                                </label>
                                                <input
                                                    value={corPrimaria}
                                                    onChange={(e) => setCorPrimaria(e.target.value)}
                                                    type="color"
                                                    id="cor-primaria"
                                                    name="cor-primaria"
                                                    className="w-14 h-10 rounded-lg border border-gray-300 cursor-pointer scale-80 hover:scale-90 transition-transform duration-200"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <label htmlFor="cor-secundaria" className="text-sm font-medium text-gray-700">
                                                    Cor Secundária
                                                </label>
                                                <input
                                                    value={corSecundaria}
                                                    onChange={(e) => setCorSecundaria(e.target.value)}
                                                    type="color"
                                                    id="cor-secundaria"
                                                    name="cor-secundaria"
                                                    className="w-14 h-10 rounded-lg border border-gray-300 cursor-pointer scale-80 hover:scale-90 transition-transform duration-200"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <label htmlFor="cor-letra" className="text-sm font-medium text-gray-700">
                                                    Cor da Letra
                                                </label>
                                                <input
                                                    value={corLetra}
                                                    onChange={(e) => setCorLetra(e.target.value)}
                                                    type="color"
                                                    id="cor-letra"
                                                    name="cor-letra"
                                                    className="w-14 h-10 rounded-lg border border-gray-300 cursor-pointer scale-80 hover:scale-90 transition-transform duration-200"
                                                />
                                            </div>


                                        </section>
                                        <button
                                            className="w-full px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black h-12"
                                            onClick={() => {
                                                if (!chooseAc) {
                                                    abrirModalAlert("choose-acomodacao");
                                                    return;
                                                }

                                                setIsGenerating(true);
                                                setRelatorio(true);
                                            }}
                                        >
                                            Gerar relatório
                                        </button>
                                    </div>
                                </aside>
                            </section>
                        </section>
                    )}
                    {chooseAc && relatorio && (
                        <RelatorioCompleto
                            saas={Number(dataToken.id)}
                            acomodacao={chooseAc}
                            mes={chooseMes}
                            ano={chooseAno}
                            imagem={foto || ""}
                            onReady={() => setIsGenerating(false)}
                            cores={{
                                letra: corLetra,
                                primario: corPrimaria,
                                secundario: corSecundaria,
>>>>>>> 604dd11b360ab5f007778bd55bc05a49c2944b0b
                            }}
                          />
                        </label>
                        <div className="flex flex-col justify-end gap-1 pb-1">
                          <button
                            onClick={() => {
                              const input = document.getElementById(
                                "imagem",
                              ) as HTMLInputElement | null;
                              input?.click();
                            }}
                          >
                            <svg
                              className="w-5 h-fit fill-blue-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              localStorage.removeItem("previewFoto");
                              setFoto(null);
                            }}
                          >
                            <svg
                              className="w-5 h-fit fill-red-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <label
                      htmlFor="mes"
                      className={`flex flex-col text-zinc-600 font-medium text-sm`}
                    >
                      Mês
                      <select
                        name="mes"
                        id="mes"
                        className={`border border-zinc-300 rounded-md px-2 py-1 h-12 outline-none text-base`}
                        value={chooseMes}
                        onChange={(e) => setChooseMes(Number(e.target.value))}
                      >
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                      </select>
                    </label>
                    <label
                      htmlFor="ano"
                      className={`flex flex-col text-zinc-600 font-medium text-sm`}
                    >
                      Ano
                      <select
                        name="ano"
                        id="ano"
                        className={`border border-zinc-300 rounded-md px-2 py-1 h-12 outline-none text-base`}
                        value={chooseAno}
                        onChange={(e) => setChooseAno(Number(e.target.value))}
                      >
                        {anos.map((ano) => (
                          <option key={ano} value={ano}>
                            {ano}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="w-full px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black h-12"
                      onClick={() => {
                        if (!chooseAc) {
                          abrirModalAlert("choose-acomodacao");
                          return;
                        }

                        setIsGenerating(true);
                        setRelatorio(true);
                      }}
                    >
                      Gerar relatório
                    </button>
                  </div>
                </aside>
              </section>
            </section>
          )}
          {chooseAc && relatorio && (
            <RelatorioCompleto
              saas={Number(dataToken.id)}
              acomodacao={chooseAc}
              mes={chooseMes}
              ano={chooseAno}
              imagem={foto || ""}
              onReady={() => setIsGenerating(false)}
              cores={{
                letra: "#ffffff",
                primario: "#003347",
                secundario: "#08fab8",
              }}
              /* cores={{
                            letra: '#9fe6ff',
                            primario: '#000037',
                            secundario: '#5cb0ff'
                        }} */
            />
          )}
        </>
        {/* 
                <RelatorioCompleto
                    saas={Number(324)}
                    acomodacao={488}
                    mes={8}
                    ano={2025}
                    imagem="data:image/jpeg;base64,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"
                /> */}
      </SideBarProvider>
    </section>
  ) : (
    <Loader />
  );
}
