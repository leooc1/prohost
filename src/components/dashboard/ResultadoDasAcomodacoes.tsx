import FaturamentoCanal from "../chart/FaturamentoCanal";
import FaturamentoLiquido from "../chart/FaturamentoLiquido";
import FaturamentoxDespesa from "../chart/FaturamentoxDespesa";

type ResultadoDasAcomodacoesProps = {
  fatPorCanal: {
    nome: string;
    cor: string;
    tipo_reserva: string;
    valor_liq: number;
  }[];
  fatGrafic: {
    mes: string;
    ano: string;
    despesas: string;
    faturamento_liquido: string;
  }[];
  periodo: string;
  dataBW: [string, string];
  comparativoRA: {
    atual: {
      comissao_plataforma: string;
      despesas: string;
      diaria_media: string;
      faturamento_bruto: string;
      faturamento_liquido: string;
      lucro: string;
      taxa_limpeza: string;
      rentabilidade_imovel: string | number;
      comissao_reservas: string | number;
      comissao_taxa_limpeza: string | number;
      repasse: string | number;
    } | null;
    passado: {
      comissao_plataforma: string;
      despesas: string;
      diaria_media: string;
      faturamento_bruto: string;
      faturamento_liquido: string;
      lucro: string;
      taxa_limpeza: string;
      rentabilidade_imovel: string | number;
      comissao_reservas: string | number;
      comissao_taxa_limpeza: string | number;
      repasse: string | number;
    } | null;
  };
  filterAC: string;
  show: [boolean, boolean, boolean, boolean];
};

export default function ResultadoDasAcomodacoes(
  props: ResultadoDasAcomodacoesProps,
) {
  function formatarMoedaBrasileira(valor: string | number | null | undefined) {
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
      className="grid gap-5 mb-10 grid-rows-10"
      style={{ gridTemplateColumns: "1fr 2fr" }}
    >
      {props.show[0] ? (
        <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center h-full row-span-3 w-full">
          <p className="flex flex-col text-zinc-400 font-medium text-sm mb-7 mt-3">
            Faturamento por Canal
          </p>
          {props.fatPorCanal.length > 0 && (
            <FaturamentoCanal
              labels={props.fatPorCanal.map((m) => m.nome)}
              dados={props.fatPorCanal.map((m) => m.valor_liq)}
              colors={props.fatPorCanal.map((m) => m.cor)}
            />
          )}
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex flex-col items-center h-full row-span-3 w-full"></div>
      )}
      {props.show[2] ? (
        <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center h-full row-span-5">
          <p className="flex flex-col text-zinc-400 font-medium text-sm mb-16 mt-3">
            Faturamento X Despesas
          </p>
          {props.periodo == "m-atual" && props.fatGrafic.length > 0 ? (
            <FaturamentoxDespesa
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.despesas))}
              mes={new Date(props.dataBW[1]).getMonth() + 1}
            />
          ) : null}
          {props.periodo == "m-passado" && props.fatGrafic.length > 0 ? (
            <FaturamentoxDespesa
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.despesas))}
              mes={
                new Date(props.dataBW[1]).getMonth() == 0 &&
                props.fatGrafic.length > 0
                  ? 12
                  : new Date(props.dataBW[1]).getMonth()
              }
            />
          ) : null}
          {props.periodo == "a-atual" && props.fatGrafic.length > 0 ? (
            <FaturamentoxDespesa
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.despesas))}
              mes={12}
            />
          ) : null}
          {props.periodo == "a-passado" && props.fatGrafic.length > 0 ? (
            <FaturamentoxDespesa
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.despesas))}
              mes={12}
            />
          ) : null}
          {props.periodo == "personalizado" && props.fatGrafic.length > 0 ? (
            <FaturamentoxDespesa
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.despesas))}
              mes={
                new Date(
                  new Date(props.dataBW[1]).setDate(
                    new Date(props.dataBW[1]).getDate() + 1,
                  ),
                ).getMonth() + 1
              }
            />
          ) : null}
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex flex-col items-center h-full row-span-5"></div>
      )}
      {props.show[1] ? (
        <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
          <div className="bg-[#FEF0D0] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FAB515"
            >
              <path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z"></path>
            </svg>
          </div>
          <div className="flex flex-col ml-4">
            <p className="flex flex-col text-zinc-400 font-medium text-sm">
              Diária Média
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {formatarMoedaBrasileira(
                  props.comparativoRA.atual?.diaria_media,
                )}
              </span>
              {/* <Comparativo nome="DIÁRIA MÉDIA" data={dataBW} passado={Number(comparativoRA.passado?.diaria_media) || 0}
                          atual={Number(comparativoRA.atual?.diaria_media) || 0} /> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex items-center h-16"></div>
      )}
      {props.show[1] ? (
        <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
          <div className="bg-[#D8D8D8] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#898989"
            >
              <path d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C13.6418 20 15.1681 19.5054 16.4381 18.6571L17.5476 20.3214C15.9602 21.3818 14.0523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V13.5C22 15.433 20.433 17 18.5 17C17.2958 17 16.2336 16.3918 15.6038 15.4659C14.6942 16.4115 13.4158 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C13.1258 7 14.1647 7.37209 15.0005 8H17V13.5C17 14.3284 17.6716 15 18.5 15C19.3284 15 20 14.3284 20 13.5V12ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z"></path>
            </svg>{" "}
          </div>
          <div className="flex flex-col ml-4">
            <p className="flex flex-col text-zinc-400 font-medium text-sm">
              Rentabilidade do Imóvel
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {props.filterAC != "all"
                  ? (
                      Number(props.comparativoRA.atual?.rentabilidade_imovel) *
                      100
                    ).toFixed(2)
                  : "-----"}{" "}
                %
              </span>
              {/* {props.filterAC != 'all' && <Comparativo nome="RENTABILIDADE DO IMÓVEL" data={dataBW}
                          passado={comparativoRA.passado?.rentabilidade_imovel ? Number(comparativoRA.passado?.rentabilidade_imovel) * 100 : 0}
                          atual={comparativoRA.atual?.rentabilidade_imovel ? Number(comparativoRA.atual?.rentabilidade_imovel) * 100 : 0} />} */}
            </div>
          </div>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex items-center h-16"></div>
      )}
      {props.show[1] ? (
        <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
          <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#01AAFE"
            >
              <path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path>
            </svg>
          </div>
          <div className="flex flex-col ml-4">
            <p className="flex flex-col text-zinc-400 font-medium text-sm">
              Faturamento Bruto
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {formatarMoedaBrasileira(
                  props.comparativoRA.atual?.faturamento_bruto,
                )}
              </span>
              {/* <Comparativo nome="FATURAMENTO BRUTO" data={dataBW} passado={Number(comparativoRA.passado?.faturamento_bruto) || 0}
                          atual={Number(comparativoRA.atual?.faturamento_bruto) || 0} /> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex items-center h-16"></div>
      )}
      {props.show[2] ? (
        <div className="bg-white border-zinc-300 border rounded-lg flex flex-col items-center h-full row-span-5">
          <p className="flex flex-col text-zinc-400 font-medium text-sm mb-16 mt-3">
            Comparativo de Faturamento Líquido
          </p>
          {props.periodo == "m-atual" && props.fatGrafic.length > 0 ? (
            <FaturamentoLiquido
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(0, 12)
                .map((fat) => Number(fat.faturamento_liquido))}
              mes={new Date(props.dataBW[1]).getMonth() + 1}
            />
          ) : null}
          {props.periodo == "m-passado" && props.fatGrafic.length > 0 ? (
            <FaturamentoLiquido
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(0, 12)
                .map((fat) => Number(fat.faturamento_liquido))}
              mes={
                new Date(props.dataBW[1]).getMonth() == 0 &&
                props.fatGrafic.length > 0
                  ? 12
                  : new Date(props.dataBW[1]).getMonth()
              }
            />
          ) : null}
          {props.periodo == "a-atual" && props.fatGrafic.length > 0 ? (
            <FaturamentoLiquido
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(0, 12)
                .map((fat) => Number(fat.faturamento_liquido))}
              mes={12}
            />
          ) : null}
          {props.periodo == "a-passado" && props.fatGrafic.length > 0 ? (
            <FaturamentoLiquido
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(0, 12)
                .map((fat) => Number(fat.faturamento_liquido))}
              mes={12}
            />
          ) : null}
          {props.periodo == "personalizado" && props.fatGrafic.length > 0 ? (
            <FaturamentoLiquido
              dadosAtuais={props.fatGrafic
                .slice(-12)
                .map((fat) => Number(fat.faturamento_liquido))}
              dadosPassado={props.fatGrafic
                .slice(0, 12)
                .map((fat) => Number(fat.faturamento_liquido))}
              mes={
                new Date(
                  new Date(props.dataBW[1]).setDate(
                    new Date(props.dataBW[1]).getDate() + 1,
                  ),
                ).getMonth() + 1
              }
            />
          ) : null}
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex flex-col items-center h-full row-span-5"></div>
      )}
      {props.show[1] ? (
        <div
          className="bg-white border-zinc-300 border rounded-lg h-full flex items-center relative"
          onMouseOver={() => {
            document
              .getElementById("detail-comission")
              ?.classList.remove("hidden");
          }}
          onMouseLeave={() => {
            document
              .getElementById("detail-comission")
              ?.classList.add("hidden");
          }}
        >
          <div className="bg-[#FCE0E1] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ED3E44"
            >
              <path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path>
            </svg>
          </div>
          <div className="flex flex-col ml-4">
            <p className="flex flex-col text-zinc-400 font-medium text-sm">
              Comissão das Plataformas
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {formatarMoedaBrasileira(
                  Number(
                    props.comparativoRA.atual?.comissao_plataforma,
                  ) /*  - Number(comparativoRA.atual.comissao_taxa_limpeza) */
                    .toFixed(2),
                )}
              </span>
            </div>
          </div>
          <section
            id="detail-comission"
            className="absolute flex flex-col top-1/2 -translate-y-1/2 gap-2 -right-32 scale-75 hidden"
          >
            <div className="flex flex-col bg-white rounded-lg px-2 py-1 shadow-zinc-400 shadow-lg">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">
                {" "}
                Comissão Taxa de Limpeza
              </p>
              <div className="flex items-end gap-4">
                <span className="text-nowrap text-xl">
                  {formatarMoedaBrasileira(
                    Number(
                      props.comparativoRA.atual?.comissao_taxa_limpeza,
                    ).toFixed(2),
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg px-2 py-1 shadow-zinc-400 shadow-lg">
              <p className="flex flex-col text-zinc-400 font-medium text-sm">
                {" "}
                Comissão Reservas
              </p>
              <div className="flex items-end gap-4">
                <span className="text-nowrap text-xl">
                  {formatarMoedaBrasileira(
                    (
                      Number(props.comparativoRA.atual?.comissao_plataforma) -
                      Number(props.comparativoRA.atual?.comissao_taxa_limpeza)
                    ).toFixed(2),
                  )}
                </span>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg h-full flex items-center relative"></div>
      )}
      {props.show[1] ? (
        <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
          <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6 h-fit"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="512"
              height="512"
              x="0"
              y="0"
              viewBox="0 0 100 100"
            >
              <g>
                <path
                  d="m93.9 29.7-.6-.1v-.4c-.1-1.1-.6-2-1.4-2.7s-1.8-1-2.9-.9L72.9 27l-60.8-7.7c-2.2-.3-4.2 1.3-4.5 3.5L6.3 33.1c-.9.2-1.7.6-2.3 1.3-.7.8-1 1.9-.9 2.9l1.1 12.1-1.6 13c-.1 1.1.2 2.1.8 3 .6.8 1.4 1.3 2.4 1.5L6.7 77c.2 2.1 1.9 3.6 4 3.6h.4l61-5.5 15.9 2h.5c2 0 3.7-1.5 4-3.5l.1-.4.8-.1c1.1-.1 2-.6 2.7-1.4s1-1.9.9-2.9L95.4 51l2.1-17c.2-2-1.4-4-3.6-4.3zM9.6 23.1c.1-1 1-1.8 2-1.8h.3l51.8 6.5-55.3 5zM5 64.1c-.3-.4-.5-1-.4-1.5l.5-3.8.5 5.8c-.2-.1-.4-.3-.6-.5zm83.2 11.1-6.8-.9 9.1-.8c-.2 1.1-1.2 1.8-2.3 1.7zm6.2-4.6c-.3.4-.8.7-1.3.7h-.3l-2 .2-18.6 1.7-9.5.8-51.9 4.6c-1.1.1-2.1-.7-2.2-1.8L7.7 67l-.2-2-1.3-15.5-.8-9.4-.3-3c0-.5.1-1 .5-1.5.1-.2.3-.3.4-.4.3-.1.6-.2.9-.2l1.2-.1 64.8-5.8 9.3-.8 7-.6h.2c.5 0 .9.2 1.3.5s.7.8.7 1.3l.2 2 1.8 19.7.8 9.4.8 8.7c-.1.3-.2.9-.6 1.3zm1-36.7-1 7.9-.9-10.1h.2c1.1.1 1.9 1.1 1.7 2.2z"
                  fill="#01AAFE"
                  opacity="1"
                  data-original="#000000"
                ></path>
                <path
                  d="M86.1 38.7c-1.5.1-3-.3-4.2-1.3s-1.9-2.3-2-3.9c0-.3-.2-.5-.4-.7s-.5-.3-.7-.2l-30.5 2.7L18 38c-.5.1-1 .5-.9 1.1.1 1.5-.3 3-1.3 4.2s-2.4 1.9-3.9 2c-.3 0-.5.2-.7.4s-.2.4-.2.7l1.7 19.3.1 1c0 .5.5 1 1.1.9 1.1-.1 2.2.1 3.1.6 1.7.9 2.9 2.5 3.1 4.6 0 .3.2.5.4.7s.4.2.6.2h.1L44 71.6l7.6-.7 1.7-.1L82 68.2c.3 0 .5-.2.7-.3.2-.2.3-.5.2-.7-.1-1.5.3-3 1.3-4.2s2.4-1.9 3.9-2c.3 0 .5-.2.7-.4s.3-.5.2-.7l-1.8-20.3c-.1-.6-.5-1-1.1-.9zm-3.4 23c-1.1 1.3-1.7 2.9-1.8 4.6L51.4 69l-7.3.7-9.3.8L22 71.6c-.2-1.1-.7-2.1-1.4-2.9-.8-1-1.8-1.9-3-2.4-.9-.4-1.9-.7-2.9-.7l-1.6-18.4c3.4-.8 5.9-3.7 6-7.2l29.5-2.7L78 34.6c.4 1.7 1.3 3.1 2.6 4.3 1.3 1.1 2.9 1.7 4.6 1.8l1.7 18.4c-1.6.4-3.1 1.3-4.2 2.6z"
                  fill="#01AAFE"
                  opacity="1"
                  data-original="#000000"
                ></path>
                <path
                  d="M49.9 52.1c-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3s.1-1 .5-1.4c.3-.4.8-.7 1.3-.7s1 .1 1.4.5c.4.3.7.8.7 1.3s.5 1 1.1.9c.6 0 1-.5.9-1.1-.1-1.1-.6-2-1.4-2.7-.5-.5-1.2-.7-1.9-.9l-.1-1.1c0-.5-.5-1-1.1-.9-.5 0-1 .5-.9 1.1l.1 1.1c-.7.2-1.2.6-1.7 1.2-.7.8-1 1.8-.9 2.9s.6 2 1.4 2.7 1.9 1 2.9.9c1.1-.1 2 .7 2.1 1.8 0 .5-.1 1-.5 1.4-.3.4-.8.7-1.3.7-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3 0-.6-.5-1-1.1-.9-.6 0-1 .5-.9 1.1.1 1.1.6 2 1.4 2.7.6.5 1.2.8 1.9.9l.1 1.1c0 .5.5.9 1 .9h.1c.5 0 1-.5.9-1.1l-.1-1.1c.7-.2 1.2-.6 1.7-1.2.7-.8 1-1.8.9-2.9s-.6-2-1.4-2.7c-.8-.6-1.8-1-2.9-.9z"
                  fill="#01AAFE"
                  opacity="1"
                  data-original="#000000"
                ></path>
                <path
                  d="M58.7 42.7c-2.8-2.3-6.3-3.4-9.9-3.1-7.5.7-13 7.3-12.3 14.8.3 3.6 2 6.9 4.8 9.2 2.5 2.1 5.5 3.2 8.7 3.2.4 0 .8 0 1.2-.1 7.1-.6 12.4-6.6 12.4-13.5V52c-.4-3.7-2.1-7-4.9-9.3zm-7.7 22c-3 .3-6.1-.7-8.4-2.7s-3.8-4.8-4.1-7.9c-.6-6.4 4.2-12 10.5-12.6h1.1c2.7 0 5.3.9 7.4 2.7 1.2 1 2.2 2.2 2.8 3.5.7 1.3 1.1 2.8 1.3 4.3.5 6.5-4.2 12.1-10.6 12.7zM20.9 50c-1.9 0-3.5 1.6-3.5 3.5S19 57 20.9 57s3.5-1.6 3.5-3.5c-.1-1.9-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5c-.1.8-.7 1.5-1.5 1.5zM79.1 50c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5S81 50 79.1 50zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S80 55 79.1 55z"
                  fill="#01AAFE"
                  opacity="1"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </div>
          <div className="flex flex-col ml-4">
            <p className="flex flex-col text-zinc-400 font-medium text-sm">
              Faturamento Líquido
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {formatarMoedaBrasileira(
                  props.comparativoRA.atual?.faturamento_liquido,
                )}
              </span>
              {/* <Comparativo nome="FATURAMENTO LÍQUIDO" data={dataBW} passado={Number(comparativoRA.passado?.faturamento_liquido) || 0}
                          atual={Number(comparativoRA.atual?.faturamento_liquido) || 0} /> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex items-center h-16"></div>
      )}
      {props.show[1] ? (
        <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
          <div className="bg-[#F8DCDC] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#D94D52"
            >
              <path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path>
            </svg>{" "}
          </div>
          <div className="flex flex-col ml-4">
            <p className="flex flex-col text-zinc-400 font-medium text-sm">
              Despesas (exceto negócio)
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {formatarMoedaBrasileira(props.comparativoRA.atual?.despesas)}
              </span>
              {/* <Comparativo nome="DESPESAS" data={dataBW} formatarMoeda={formatarMoedaBrasileira} passado={Number(comparativoRA.passado?.despesas) || 0}
                          atual={Number(comparativoRA.atual?.despesas) || 0} /> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex items-center h-16"></div>
      )}
      {props.show[1] ? (
        <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center">
          <div className="bg-[#E0FEEA] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6 h-fit"
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
              Lucro das Acomodações
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {formatarMoedaBrasileira(props.comparativoRA.atual?.lucro)}
              </span>
              {/* <Comparativo nome="LUCRO DAS ACOMODAÇÕES" data={dataBW} formatarMoeda={formatarMoedaBrasileira} passado={(Number(comparativoRA.passado?.lucro)) || 0}
                          atual={Number(comparativoRA.atual?.lucro) || 0} /> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg flex items-center h-16"></div>
      )}
      {props.show[1] ? (
        <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3">
          <div className="bg-[#f6d0fe] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#b115fa"
            >
              <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM13 16.083V20H17.6586C16.9423 17.9735 15.1684 16.4467 13 16.083ZM11 20V16.083C8.83165 16.4467 7.05766 17.9735 6.34141 20H11ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.2104 11 16 9.21043 16 7C16 4.78957 14.2104 3 12 3C9.78957 3 8 4.78957 8 7C8 9.21043 9.78957 11 12 11Z"></path>
            </svg>
          </div>
          <div className="flex flex-col ml-4">
            <p className="flex flex-col text-zinc-400 font-medium text-sm">
              Repasse ao proprietário
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {props.filterAC != "all"
                  ? formatarMoedaBrasileira(
                      Number(props.comparativoRA.atual?.repasse).toFixed(2),
                    )
                  : "-----"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg h-16 flex items-center py-3"></div>
      )}
      {props.show[1] ? (
        <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3">
          <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
            <svg
              className="w-6 h-fit"
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
          <div className="flex flex-col ml-4 relative">
            <p className="flex flex-col text-zinc-400 font-medium text-sm">
              Taxa de Limpeza
            </p>
            <div className="flex items-end gap-4">
              <span className="text-nowrap text-xl">
                {formatarMoedaBrasileira(
                  Number(
                    props.comparativoRA.atual?.taxa_limpeza,
                  ) /*  - Number(comparativoRA.atual.comissao_taxa_limpeza) */
                    .toFixed(2),
                )}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="skeleton-load border-white border rounded-lg h-16 flex items-center py-3"></div>
      )}
    </section>
  );
}
