import EvolucaoNegocio from "../chart/EvolucaoNegocio";

type ResultadoGestorProps = {
    resultadoGestor: any;
    lucroXDespesa: any[];
    show: [boolean, boolean];
    periodo: string;
};

export default function ResultadoDoGestor(props: ResultadoGestorProps) {
    function formatarMoedaBrasileira(
        valor: string | number | null | undefined,
    ) {
        const valorNumerico = parseFloat(String(valor));
        if (isNaN(valorNumerico)) {
            return "R$ 0,00";
        }
        if (valorNumerico < 0)
            return (0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });
        return valorNumerico.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <section
            className="grid gap-5 mb-10"
            style={{
                gridTemplateAreas: `'lap lap lap en en en en'
                    'tl tl tl en en en en'
                    'cat cat cat en en en en'
                    'dn dn dn en en en en'
                    'lg lg lg en en en en'
                    `,
                gridTemplateColumns: "1fr 0.8fr 0fr 1fr 1fr 1fr",
                gridTemplateRows: "1fr 1fr 1fr 1fr",
            }}
        >
            {props.show[0] ? (
                <div
                    className="bg-white border-zinc-300 border rounded-lg flex items-center"
                    style={{ gridArea: "lap" }}
                >
                    <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#01AAFE"
                        >
                            <path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">
                            Lucro das Acomodações Próprias
                        </p>
                        <div className="flex items-end gap-4">
                            <span className="text-nowrap text-xl">
                                {formatarMoedaBrasileira(
                                    props.resultadoGestor?.lucro_acomodacoes,
                                )}
                            </span>
                            {/* <Comparativo
                            nome="LUCRO DAS ACOMODAÇÕES PRÓPRIAS"
                            data={dataBW}
                            formatarMoeda={formatarMoedaBrasileira}
                            passado={
                                Number(
                                    comparativoRG.passado?.lucro_acomodacoes,
                                ) || 0
                            }
                            atual={
                                Number(
                                    comparativoRG.atual?.lucro_acomodacoes,
                                ) || 0
                            }
                        /> */}
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="skeleton-load border-white border rounded-lg flex items-center h-16"
                    style={{ gridArea: "lap" }}
                ></div>
            )}
            {props.show[0] ? (
                <div
                    className="bg-white border-zinc-300 border rounded-lg flex items-center"
                    style={{ gridArea: "cat" }}
                >
                    <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#6279F2"
                        >
                            <path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">
                            Comissão das Acomodações de Terceiros
                        </p>
                        <div className="flex items-end gap-4">
                            <span className="text-nowrap text-xl">
                                {formatarMoedaBrasileira(
                                    props.resultadoGestor?.comissao_terceiros,
                                )}
                            </span>
                            {/* <Comparativo
                            nome="COMISSÃO DAS ACOMODAÇÕES TERCEIRAS"
                            data={dataBW}
                            formatarMoeda={formatarMoedaBrasileira}
                            passado={
                                Number(
                                    comparativoRG.passado?.comissao_terceiros,
                                ) || 0
                            }
                            atual={
                                Number(
                                    comparativoRG.atual?.comissao_terceiros,
                                ) || 0
                            }
                        /> */}
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="skeleton-load border-white border rounded-lg flex items-center h-16"
                    style={{ gridArea: "cat" }}
                ></div>
            )}
            {props.show[0] ? (
                <div
                    className="bg-white border-zinc-300 border rounded-lg flex items-center"
                    style={{ gridArea: "dn" }}
                >
                    <div className="bg-[#F8DCDC] rounded-md w-fit py-2 px-2 ml-4">
                        <svg
                            className="w-6 h-6 fill-[#D94D52]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                        >
                            <path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48l45.5 0c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5L488 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-288.3 0c-11.5 0-21.4-8.2-23.6-19.5L170.7 288l288.5 0c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32L360 32l0 102.1 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-64 64c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23L312 32 120.1 32C111 12.8 91.6 0 69.5 0L24 0zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">
                            Despesas de Negócio
                        </p>
                        <div className="flex items-end gap-4">
                            <span className="text-nowrap text-xl">
                                {formatarMoedaBrasileira(
                                    props.resultadoGestor?.despesas_negocio,
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="skeleton-load border-white border rounded-lg flex items-center h-16"
                    style={{ gridArea: "dn" }}
                ></div>
            )}
            {props.show[0] ? (
                <div
                    style={{ gridArea: "tl" }}
                    className="bg-white border-zinc-300 border rounded-lg h-full flex items-center"
                >
                    <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            width="512"
                            height="512"
                            x="0"
                            y="0"
                            viewBox="0 0 480 480"
                        >
                            <g>
                                <path
                                    d="M416 336h-12.528a56.806 56.806 0 0 0-25.312 5.976 40.799 40.799 0 0 1-36.32 0 56.604 56.604 0 0 0-14.4-4.8L343.032 216H360a8 8 0 0 0 8-8v-32a8 8 0 0 0-8-8h-32v-24a8 8 0 0 0-2.344-5.656L288 100.688V75.84l12.128-9.696 20.712 41.432 14.32-7.152-22.256-44.504L322.8 48H352a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8h-80c-39.744.048-71.952 32.256-72 72a8 8 0 0 0 8 8h16v20.688l-21.656 21.656A8 8 0 0 0 200 128v40h-16v-64a7.906 7.906 0 0 0-.584-2.888 8.263 8.263 0 0 0-.496-.904 8.911 8.911 0 0 0-.672-1.208L152 61.2V8a8 8 0 0 0-8-8H96a8 8 0 0 0-8 8v53.2L57.752 99c-.255.385-.48.789-.672 1.208-.184.291-.35.593-.496.904A7.906 7.906 0 0 0 56 104v64H24a8 8 0 0 0-8 8v32a8 8 0 0 0 8 8h16.968l31.096 241.024A8 8 0 0 0 80 464h188.32A47.862 47.862 0 0 0 304 480h12.528a56.806 56.806 0 0 0 25.312-5.976 40.799 40.799 0 0 1 36.32 0A56.806 56.806 0 0 0 403.472 480H416c26.499-.026 47.974-21.501 48-48v-48c-.026-26.499-21.501-47.974-48-48zM328 16h16v16h-16V16zm24 168v16H240v-16h112zM216.568 64c4.013-27.535 27.606-47.965 55.432-48h40v20.16L277.192 64h-60.624zM272 80v16h-32V80h32zm-56 51.312L235.312 112h41.376L312 147.312V168h-96v-36.688zM208 184h16v56a8 8 0 0 0 4.424 7.2l48 24a9.663 9.663 0 0 1 4.92 5.688 10.289 10.289 0 0 1-.8 8 9.343 9.343 0 0 1-12.531 4.194l-.021-.01-32.48-16.24A8 8 0 0 0 224 280v80c0 8.837-7.163 16-16 16v-72h-16v72h-16v-72h-16v72h-16v-72h-16v72c-8.837 0-16-7.163-16-16V184h96zM104 16h32v40h-32V16zm-4.16 56h40.32l19.2 24H80.64l19.2-24zM72 112h96v56H72v-56zm-40 88v-16h64v16H32zm224 184v48a47.818 47.818 0 0 0 2.8 16H87.032L57.096 216H96v144c0 17.673 14.327 32 32 32h80c17.673 0 32-14.327 32-32v-67.056l20.896 10.448c12.627 6.232 27.915 1.048 34.147-11.579l.077-.157a25.896 25.896 0 0 0 1.464-19.8 25.597 25.597 0 0 0-12.96-14.992L240 235.056V216h86.904l-15.488 120H304c-26.499.026-47.974 21.501-48 48zm192 48c0 17.673-14.327 32-32 32h-12.528a40.8 40.8 0 0 1-18.152-4.288 56.903 56.903 0 0 0-50.64 0A40.8 40.8 0 0 1 316.528 464H304c-17.673 0-32-14.327-32-32v-12.32A47.75 47.75 0 0 0 304 432h12.528a56.806 56.806 0 0 0 25.312-5.976 40.799 40.799 0 0 1 36.32 0A56.806 56.806 0 0 0 403.472 432H416a47.75 47.75 0 0 0 32-12.32V432zm-32-16h-12.528a40.8 40.8 0 0 1-18.152-4.288 56.903 56.903 0 0 0-50.64 0A40.8 40.8 0 0 1 316.528 416H304c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h12.528a40.8 40.8 0 0 1 18.152 4.288 56.935 56.935 0 0 0 50.64 0A40.8 40.8 0 0 1 403.472 352H416c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32z"
                                    fill="#009ae7"
                                    opacity="1"
                                    data-original="#000000"
                                ></path>
                                <path
                                    d="M408 368h16v16h-16zM328 368h16v16h-16zM296 376h16v16h-16zM376 376h16v16h-16z"
                                    fill="#009ae7"
                                    opacity="1"
                                    data-original="#000000"
                                ></path>
                            </g>
                        </svg>
                    </div>
                    <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">
                            Taxa de Limpeza
                        </p>
                        <div className="flex items-end gap-4">
                            <span className="text-nowrap text-xl">
                                {formatarMoedaBrasileira(
                                    props.resultadoGestor?.ajuste_comissao_ota,
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{ gridArea: "tl" }}
                    className="skeleton-load border-white border rounded-lg h-full flex items-center"
                ></div>
            )}
            {props.show[0] ? (
                <div
                    className="bg-white border-zinc-300 border rounded-lg flex items-center"
                    style={{ gridArea: "lg" }}
                >
                    <div className="bg-[#E0FEEA] rounded-md w-fit py-2 px-2 ml-4">
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            width="512"
                            height="512"
                            x="0"
                            y="0"
                            viewBox="0 0 484.184 484.184"
                        >
                            <g>
                                <path
                                    d="M309.43 219.944c-19-10.5-39.2-18.5-59.2-26.8-11.6-4.8-22.7-10.4-32.5-18.2-19.3-15.4-15.6-40.4 7-50.3 6.4-2.8 13.1-3.7 19.9-4.1 26.2-1.4 51.1 3.4 74.8 14.8 11.8 5.7 15.7 3.9 19.7-8.4 4.2-13 7.7-26.2 11.6-39.3 2.6-8.8-.6-14.6-8.9-18.3-15.2-6.7-30.8-11.5-47.2-14.1-21.4-3.3-21.4-3.4-21.5-24.9-.1-30.3-.1-30.3-30.5-30.3-4.4 0-8.8-.1-13.2 0-14.2.4-16.6 2.9-17 17.2-.2 6.4 0 12.8-.1 19.3-.1 19-.2 18.7-18.4 25.3-44 16-71.2 46-74.1 94-2.6 42.5 19.6 71.2 54.5 92.1 21.5 12.9 45.3 20.5 68.1 30.6 8.9 3.9 17.4 8.4 24.8 14.6 21.9 18.1 17.9 48.2-8.1 59.6-13.9 6.1-28.6 7.6-43.7 5.7-23.3-2.9-45.6-9-66.6-19.9-12.3-6.4-15.9-4.7-20.1 8.6-3.6 11.5-6.8 23.1-10 34.7-4.3 15.6-2.7 19.3 12.2 26.6 19 9.2 39.3 13.9 60 17.2 16.2 2.6 16.7 3.3 16.9 20.1.1 7.6.1 15.3.2 22.9.1 9.6 4.7 15.2 14.6 15.4 11.2.2 22.5.2 33.7-.1 9.2-.2 13.9-5.2 13.9-14.5 0-10.4.5-20.9.1-31.3-.5-10.6 4.1-16 14.3-18.8 23.5-6.4 43.5-19 58.9-37.8 42.8-52 26.5-128.1-34.1-161.6z"
                                    fill="#61C365"
                                    opacity="1"
                                    data-original="#000000"
                                ></path>
                            </g>
                        </svg>
                    </div>
                    <div className="flex flex-col ml-4">
                        <p className="flex flex-col text-zinc-400 font-medium text-sm">
                            Lucro do Gestor
                        </p>
                        <div className="flex items-end gap-4">
                            <span className="text-nowrap text-xl">
                                {formatarMoedaBrasileira(
                                    props.resultadoGestor?.lucro_gestor,
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="skeleton-load border-white border rounded-lg flex items-center h-16"
                    style={{ gridArea: "lg" }}
                ></div>
            )}
            {props.show[1] ? (
                <div
                    className="bg-white border-zinc-300 border rounded-lg flex flex-col px-2 items-center"
                    style={{ gridArea: "en" }}
                >
                    <p className="flex flex-col text-zinc-400 font-medium text-sm mb-14 mt-3">
                        Faturamento x Despesas do negócio
                    </p>
                    {props.periodo == "m-atual" &&
                    props.lucroXDespesa.length > 0 ? (
                        <EvolucaoNegocio
                            mes={new Date().getMonth()}
                            ano={Number(
                                String(new Date().getFullYear()).slice(-2),
                            )}
                            dadosLucros={props.lucroXDespesa.map((d) =>
                                Number(d.lucro_acomodacoes),
                            )}
                            dadosDespesas={props.lucroXDespesa.map((d) =>
                                Number(d.despesas_negocio),
                            )}
                        />
                    ) : null}
                    {props.periodo == "m-passado" &&
                    props.lucroXDespesa.length > 0 ? (
                        <EvolucaoNegocio
                            mes={
                                new Date().getMonth() == 0
                                    ? 11
                                    : new Date().getMonth() - 1
                            }
                            ano={
                                new Date().getMonth() == 0
                                    ? Number(
                                          String(
                                              new Date().getFullYear(),
                                          ).slice(-2),
                                      ) - 1
                                    : Number(
                                          String(
                                              new Date().getFullYear(),
                                          ).slice(-2),
                                      )
                            }
                            dadosLucros={props.lucroXDespesa.map((d) =>
                                Number(d.lucro_acomodacoes),
                            )}
                            dadosDespesas={props.lucroXDespesa.map((d) =>
                                Number(d.despesas_negocio),
                            )}
                        />
                    ) : null}
                    {props.periodo == "a-atual" &&
                    props.lucroXDespesa.length > 0 ? (
                        <EvolucaoNegocio
                            mes={11}
                            ano={Number(
                                String(new Date().getFullYear()).slice(-2),
                            )}
                            dadosLucros={props.lucroXDespesa.map((d) =>
                                Number(d.lucro_acomodacoes),
                            )}
                            dadosDespesas={props.lucroXDespesa.map((d) =>
                                Number(d.despesas_negocio),
                            )}
                        />
                    ) : null}
                    {props.periodo == "a-passado" &&
                    props.lucroXDespesa.length > 0 ? (
                        <EvolucaoNegocio
                            mes={11}
                            ano={
                                Number(
                                    String(new Date().getFullYear()).slice(-2),
                                ) - 1
                            }
                            dadosLucros={props.lucroXDespesa.map((d) =>
                                Number(d.lucro_acomodacoes),
                            )}
                            dadosDespesas={props.lucroXDespesa.map((d) =>
                                Number(d.despesas_negocio),
                            )}
                        />
                    ) : null}
                    {props.periodo == "personalizado" &&
                    props.lucroXDespesa.length > 0 ? (
                        <EvolucaoNegocio
                            mes={11}
                            ano={Number(
                                String(new Date().getFullYear()).slice(-2),
                            )}
                            dadosLucros={props.lucroXDespesa.map((d) =>
                                Number(d.lucro_acomodacoes),
                            )}
                            dadosDespesas={props.lucroXDespesa.map((d) =>
                                Number(d.despesas_negocio),
                            )}
                        />
                    ) : null}
                </div>
            ) : (
                <div
                    className="skeleton-load border-white border rounded-lg flex flex-col px-2 items-center"
                    style={{ gridArea: "en" }}
                ></div>
            )}
        </section>
    );
}
