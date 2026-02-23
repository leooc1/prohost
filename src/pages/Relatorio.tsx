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
                            colorButton="green"
                        />
                    )}
                    {isGenerating && <Loader />}
                    {!relatorio && (
                        <section className="max-w-7xl mx-auto px-4 pt-2">
                            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                <div className="col-span-full">
                                    <section className="w-full m-auto max-w-none lg:mx-0">
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
                                                            className={`relative rounded-xl border p-2 cursor-pointer transition-all duration-200 ${isSelected
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
            </SideBarProvider>
        </section>
    ) : (
        <Loader />
    );
}