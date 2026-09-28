import posthog from "../posthog";
import { useContext, useEffect, useState } from "react";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Notify from "./notify/Notify";

interface Acomodacao {
  id: number;
  tipo: string;
  comissao: number;
  data_ini_ope: string;
  descricao: string;
  endereco: string;
  check_in_p: string;
  check_out_p: string;
  modelo: number;
  foto: string;
  nome: string;
  numero_hospedes: number;
  valor_imovel: number;
  desativado: boolean;
  taxa_limpeza: number;
  saas: { id: number };
}

interface Canais {
  id?: number;
  cor: string;
  nome: string;
  saas: { id: number };
}

interface Hospede {
  id?: number;
  saas: { id: number };
  nome: string;
  telefone: string | null;
  email: string | null;
}

interface Reserva {
  acomodacao: { id: number };
  check_in: string;
  check_out: string;
  canal_reserva: { id: number | null };
  comissao_ota: number;
  hospede: { id: number | null };
  qtd_hospede: number;
  saas: { id: number };
  taxa_limpeza: number;
  valor: number;
  valor_liq: number;
  valor_prop: number;
  valor_gestor: number;
  valor_liq_calculado: number;
  obs: string;
  tipo_reserva: string;
}

interface propsEdicao {
  id: number;
  close: () => void;
  acomodacaoID: number;
  hospedeNOME: string;
  qtdHospede: number;
  checkIn: string;
  checkOut: string;
  canalID: number;
  valorTotal: number;
  taxaLimpeza: number;
  comissao: number;
  tipoReserva: string;
  valorLiq: number;
  obs: string;
  saas: number;
}

const Tooltip = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="ml-1"
      >
        <svg
          className="h-4 w-4 fill-primary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path>
        </svg>
      </button>
      {show && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-primary text-white text-sm p-2 rounded-xl z-50">
          <p dangerouslySetInnerHTML={{ __html: text }} />
          <div className="absolute left-2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-primary"></div>
        </div>
      )}
    </div>
  );
};

export default function EditarReserva(props: propsEdicao) {
  const apiURL = import.meta.env.VITE_API_URL;
  const { dataToken } = useContext(SideBarContext);
  const checkin = new Date(props.checkIn);
  const checkinDate = `${checkin.getUTCFullYear()}-${("0" + (checkin.getUTCMonth() + 1)).slice(-2)}-${("0" + checkin.getUTCDate()).slice(-2)}`;
  const checkinTime = `${("0" + checkin.getUTCHours()).slice(-2)}:${("0" + checkin.getUTCMinutes()).slice(-2)}`;
  const [completeHospede, setCompleteHospede] = useState<{
    complete: boolean;
    celular: string;
    email: string;
  }>({ complete: false, celular: "", email: "" });
  function formatedNumber(input: string) {
    if (input.replace(/[.,]/gm, "").length <= 3)
      return input.replace(/[.,]/gm, "").replace(/(\d{1})(\d{2})/gm, "$1,$2");
    else if (input.replace(/[.,]/gm, "").length <= 4)
      return input.replace(/[.,]/gm, "").replace(/(\d{2})(\d{2})/gm, "$1,$2");
    else if (input.replace(/[.,]/gm, "").length <= 5)
      return input.replace(/[.,]/gm, "").replace(/(\d{3})(\d{2})/gm, "$1,$2");
    else if (input.replace(/[.,]/gm, "").length <= 6)
      return input
        .replace(/[.,]/gm, "")
        .replace(/(\d{1})(\d{3})(\d{2})/gm, "$1.$2,$3");
    else if (input.replace(/[.,]/gm, "").length <= 7)
      return input
        .replace(/[.,]/gm, "")
        .replace(/(\d{2})(\d{3})(\d{2})/gm, "$1.$2,$3");
    else if (input.replace(/[.,]/gm, "").length <= 8)
      return input
        .replace(/[.,]/gm, "")
        .replace(/(\d{3})(\d{3})(\d{2})/gm, "$1.$2,$3");
    else if (input.replace(/[.,]/gm, "").length <= 9)
      return input
        .replace(/[.,]/gm, "")
        .replace(/(\d{1})(\d{3})(\d{3})(\d{2})/gm, "$1.$2.$3,$4");
    else if (input.replace(/[.,]/gm, "").length <= 10)
      return input
        .replace(/[.,]/gm, "")
        .replace(/(\d{2})(\d{3})(\d{3})(\d{2})/gm, "$1.$2.$3,$4");
    else if (input.replace(/[.,]/gm, "").length <= 11)
      return input
        .replace(/[.,]/gm, "")
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/gm, "$1.$2.$3,$4");
    else return "0,00";
  }

  const checkout = new Date(props.checkOut);
  const checkoutDate = `${checkout.getUTCFullYear()}-${("0" + (checkout.getUTCMonth() + 1)).slice(-2)}-${("0" + checkout.getUTCDate()).slice(-2)}`;
  const checkoutTime = `${("0" + checkout.getUTCHours()).slice(-2)}:${("0" + checkout.getUTCMinutes()).slice(-2)}`;

  const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([]);
  const [canais, setCanais] = useState<Canais[]>([]);
  const [render, setRender] = useState(false);
  const [showTaxaLimpeza, setShowTaxaLimpeza] = useState<[boolean, number]>([
    false,
    0,
  ]);
  const [hospede, setHospede] = useState<Hospede[]>([]);

  const [showH, setShowH] = useState<Hospede[]>([]);
  const [notify, setNotify] = useState({ type: 1, text: "Criado!" });
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [button, setButton] = useState<boolean>(true);

  function checkNegativeAndApplyStyle() {
    const total = document.getElementById("tot") as HTMLInputElement;
    const comissao = document.getElementById("com") as HTMLInputElement;
    const liquido = document.getElementById("liq") as HTMLInputElement;

    if (Number(total.value) < 0) {
      total.classList.add("border-red-500");
    } else {
      total.classList.remove("border-red-500");
    }
    if (Number(comissao.value) < 0) {
      comissao.classList.add("border-red-500");
    } else {
      comissao.classList.remove("border-red-500");
    }
    if (Number(liquido.value) < 0) {
      liquido.classList.add("border-red-500");
    } else {
      liquido.classList.remove("border-red-500");
    }
  }

  async function createHospede(pbody: Hospede) {
    try {
      const response = await fetch(`${apiURL}/hospede/`, {
        method: "POST",
        body: JSON.stringify(pbody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return data.id ? data.id : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function updateReserva(pbody: Reserva) {
    await fetch(`${apiURL}/reserva/${props.id}`, {
      method: "PUT",
      body: JSON.stringify(pbody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data[0]?.affected == 1) {
          posthog.capture("reservation_updated");
          setNotify({ type: 1, text: "Atualizado!" });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
            location.reload();
          }, 3000);
        } else if (data.length > 0) {
          setButton(true);
          setNotify({ type: 1, text: data });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
          }, 3000);
        } else {
          setButton(true);
          setNotify({ type: 2, text: "Erro ao cadastrar!" });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  }

  async function getAcomodacoes() {
    if (!dataToken || !dataToken.id) return;
    await fetch(`${apiURL}/acomodacao/names/${dataToken.id}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data: Acomodacao[]) => {
        setAcomodacao(data.filter((e) => !e.desativado));
        setShowTaxaLimpeza([
          data.filter((a) => a.id == props.acomodacaoID)[0].modelo == 2 ||
            data.filter((a) => a.id == props.acomodacaoID)[0].modelo == 3,
          data.filter((a) => a.id == props.acomodacaoID)[0].taxa_limpeza,
        ]);
      })
      .catch((err) => console.log(err));
  }

  async function getCanais() {
    if (!dataToken || !dataToken.id) return;
    await fetch(`${apiURL}/canal_reserva/${dataToken.id}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data: Canais[]) => {
        setCanais(data);
      })
      .catch((err) => console.log(err));
  }

  async function updateHospede(pbody: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
  }) {
    await fetch(`${apiURL}/hospede/${pbody.id}`, {
      method: "PUT",
      body: JSON.stringify(pbody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.affected == 1) {
        }
      })
      .catch((err) => console.log(err));
  }

  async function getHospede() {
    if (!dataToken || !dataToken.id) return;
    await fetch(`${apiURL}/hospede/${dataToken.id}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data: Hospede[]) => {
        setHospede(data);
      })
      .catch((err) => console.log(err));
  }

  async function getAll() {
    if (!dataToken || !dataToken.id) return;
    await getAcomodacoes();
    await getCanais();
    await getHospede();
    setRender(true);
  }

  useEffect(() => {
    const total = document.getElementById("tot") as HTMLInputElement | null;
    if (total) {
      total.value = formatedNumber(
        String(
          Number(total.value.replace(/[.]/gm, "").replace(/[,]/gm, "")) -
            Number(
              String(showTaxaLimpeza[1])
                .replace(/[.]/gm, "")
                .replace(/[,]/gm, ""),
            ),
        ),
      );
    }
  }, [showTaxaLimpeza]);

  useEffect(() => {
    if (dataToken && dataToken.id) getAll();
  }, [dataToken]);

  return (
    <div className="w-screen h-screen fixed z-50 top-0 right-0">
      <div
        className="w-screen h-screen bg-black absolute top-0 right-0 bg-opacity-20"
        onClick={props.close}
      ></div>
      {showNotify && <Notify type={notify.type} text={notify.text} />}
      {render && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex rounded-md flex-col max-h-screen overflow-scroll scroll-default absolute md:min-w-80 px-4 md:py-3 py-16 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white"
        >
          <h5 className="font-semibold text-2xl mb-2">Editar Reserva</h5>
          <label htmlFor="acomodacao" className="flex flex-col">
            <span className="text-zinc-500 font-medium mb-1 text-xs">
              Acomodação<span className="text-red-500 font-bold"> *</span>
            </span>
            <select
              onChange={(ac) => {
                const total = document.getElementById(
                  "tot",
                ) as HTMLInputElement;
                total.value = formatedNumber(
                  String(
                    Number(
                      total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                    ) +
                      Number(
                        String(showTaxaLimpeza[1])
                          .replace(/[.]/gm, "")
                          .replace(/[,]/gm, ""),
                      ),
                  ),
                );

                setShowTaxaLimpeza([
                  [2, 3].includes(
                    acomodacao.filter((a) => a.id == Number(ac.target.value))[0]
                      .modelo,
                  ),
                  acomodacao.filter((a) => a.id == Number(ac.target.value))[0]
                    .taxa_limpeza,
                ]);
              }}
              defaultValue={props.acomodacaoID}
              name="acomodacao"
              id="acomodacao"
              className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none"
            >
              <option value="" selected disabled className="hidden">
                Selecione uma acomodação
              </option>
              {acomodacao.length &&
                acomodacao.map((a) => <option value={a.id}>{a.nome}</option>)}
            </select>
          </label>
          <div
            className="grid gap-4 md:grid-cols-4 grid-cols-2"
          >
            <label htmlFor="hospede" className="flex flex-col relative">
              <span className="text-zinc-500 font-medium mb-1 text-xs">
                Hóspede<span className="text-red-500 font-bold"> *</span>
              </span>
              <input
                defaultValue={props.hospedeNOME}
                onChange={(e) => {
                  if (e.target.value.length == 0) {
                    setShowH([]);
                  } else {
                    setShowH(
                      hospede.filter((h) =>
                        h.nome
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()),
                      ),
                    );
                  }
                }}
                type="text"
                placeholder="Selecione um hóspede"
                name="hospede"
                id="hospede"
                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
              />
              <button
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full w-6 h-6 text-xl flex justify-center items-center font-bold"
                onClick={() =>
                  setCompleteHospede((prev) => ({
                    ...prev,
                    complete: !prev?.complete,
                  }))
                }
              >
                {completeHospede?.complete ? "-" : "+"}
              </button>
              {showH.length > 0 && (
                <section className="absolute bg-white top-full w-full">
                  <ul className="flex flex-col w-full gap-1">
                    {showH.map((h) => (
                      <li
                        id={`${h.id}`}
                        onClick={() => {
                          const hInput = document.getElementById(
                            "hospede",
                          ) as HTMLInputElement;
                          hInput.value = h.nome;
                          setShowH([]);
                        }}
                        className="cursor-pointer border border-zinc-400 rounded-md px-1"
                      >
                        {h.nome}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </label>
            <label htmlFor="qtd-hospedes" className="flex flex-col">
              <span className="text-zinc-500 font-medium mb-1 text-xs">
                Qtd. Hóspedes<span className="text-red-500 font-bold"> *</span>
              </span>
              <input
                type="number"
                defaultValue={props.qtdHospede}
                min={1}
                onChange={(e) => {
                  if (e.target.value.length > 0 && Number(e.target.value) < 1)
                    e.target.value = "1";
                }}
                name="qtd-hospedes"
                id="qtd-hospedes"
                className="border border-zinc-300 rounded-md px-2 py-1 text-center outline-none max-w-32"
              />
            </label>
          </div>
          {completeHospede.complete && (
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="email" className="flex flex-col">
                <span className="text-zinc-500 font-medium mb-1 text-xs">
                  E-mail
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={completeHospede.email}
                  className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                  placeholder="hospede@email.com"
                  onChange={(e) =>
                    setCompleteHospede((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  />
              </label>
              <label htmlFor="tel" className="flex flex-col">
                <span className="text-zinc-500 font-medium mb-1 text-xs">
                  Telefone
                </span>
                <input
                  type="tel"
                  name="tel"
                  id="tel"
                  value={completeHospede.celular}
                  className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                  placeholder="(00) 9 9999-9999"
                  onChange={(e) =>
                    setCompleteHospede((prev) => ({
                      ...prev,
                      celular: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-4 grid-cols-2">
            <label htmlFor="checkin-date" className="flex flex-col justify-end">
              <span className="text-zinc-500 font-medium mb-1 text-xs">
                Check-in<span className="text-red-500 font-bold"> *</span>
              </span>
              <input
                defaultValue={checkinDate}
                type="date"
                name="checkin-date"
                id="checkin-date"
                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
              />
            </label>
            <label
              htmlFor="checkin-hour"
              className="flex flex-col justify-end w-fit"
            >
              <input
                defaultValue={checkinTime}
                type="time"
                name="checkin-hour"
                id="checkin-hour"
                className="border border-zinc-300 max-w-24 rounded-md px-2 py-1 outline-none"
              />
            </label>
            <label
              htmlFor="checkout-date"
              className="flex flex-col justify-end"
            >
              <span className="text-zinc-500 font-medium mb-1 text-xs">
                Check-out<span className="text-red-500 font-bold"> *</span>
              </span>
              <input
                defaultValue={checkoutDate}
                type="date"
                name="checkout-date"
                id="checkout-date"
                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
              />
            </label>
            <label
              htmlFor="checkout-hour"
              className="flex flex-col justify-end w-fit"
            >
              <input
                defaultValue={checkoutTime}
                type="time"
                name="checkout-hour"
                id="checkout-hour"
                className="border border-zinc-300 max-w-24 rounded-md px-2 py-1 outline-none"
              />
            </label>
          </div>
          <label htmlFor="canal-reserva" className="flex flex-col">
            <span className="text-zinc-500 font-medium mb-1 text-xs">
              Canal<span className="text-red-500 font-bold"> *</span>
            </span>
            <select
              defaultValue={props.canalID}
              name="canal-reserva"
              id="canal-reserva"
              className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none"
            >
              <option value="" selected disabled className="hidden">
                Selecione um canal
              </option>
              {canais.length &&
                canais.map((c) => <option value={c.id}>{c.nome}</option>)}
            </select>
          </label>
          {/*  */}
          <div className="grid gap-4 md:grid-cols-3 grid-cols-1">
            <label htmlFor="tot" className="flex flex-col">
              <div className="flex items-center">
                <span className="text-zinc-500 font-medium mb-1 text-xs">
                  {!showTaxaLimpeza[0] ? "Valor Total" : "Valor Diárias"}
                  <span className="text-red-500 font-bold"> *</span>
                </span>
                <Tooltip
                  text={
                    !showTaxaLimpeza[0]
                      ? "<strong>Valor Total</strong> - Valor Total é o valor pago pelo hóspede."
                      : "<strong>Valor Diárias</strong> - Valor diárias é o valor que o hóspede pagou referente as diárias da hospedagem, ou seja, o valor que ele pagou menos a taxa de limpeza (ou qualquer taxa cobrada a parte das diárias)."
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                R$
                <input
                  defaultValue={formatedNumber(
                    String(props.valorTotal.toFixed(2)),
                  )}
                  type="text"
                  placeholder="R$"
                  step="0.01"
                  name="tot"
                  id="tot"
                  className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full"
                  onInput={() => {
                    const total = document.getElementById(
                      "tot",
                    ) as HTMLInputElement;
                    const comissao = document.getElementById(
                      "com",
                    ) as HTMLInputElement;
                    const liquido = document.getElementById(
                      "liq",
                    ) as HTMLInputElement;
                    // const limpeza = document.getElementById('taxa_limpeza') as HTMLInputElement
                    if (
                      comissao.value.length == 0 &&
                      liquido.value.length == 0
                    ) {
                      // if (!showTaxaLimpeza[0]) {
                      liquido.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            comissao.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                      //}
                      /* else {
                                                liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(limpeza.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                            } */
                    } else if (
                      comissao.value.length == 0 &&
                      liquido.value.length > 0
                    ) {
                      // if (!showTaxaLimpeza[0]) {
                      comissao.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            liquido.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                      //}
                      /* else {
                                                comissao.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(limpeza.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                            } */
                    } else if (
                      comissao.value.length > 0 &&
                      liquido.value.length == 0
                    ) {
                      // if (!showTaxaLimpeza[0]) {
                      liquido.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            comissao.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                      //}
                      /* else {
                                                liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(limpeza.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                            } */
                    } else {
                      // if (!showTaxaLimpeza[0]) {
                      liquido.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            comissao.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                      //}
                      /* else {
                                                liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(limpeza.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                            } */
                    }
                    total.value = formatedNumber(
                      String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    comissao.value = formatedNumber(
                      String(
                        Number(
                          comissao.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    liquido.value = formatedNumber(
                      String(
                        Number(
                          liquido.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    checkNegativeAndApplyStyle();
                  }}
                />
              </div>
            </label>
            <label htmlFor="com" className="flex flex-col">
              <div className="flex items-center">
                <span className="text-zinc-500 font-medium mb-1 text-xs">
                  Comissão<span className="text-red-500 font-bold"> *</span>
                </span>
                <Tooltip text="<strong>Comissão</strong> - Comissão é o valor que ficou retido para a plataforma, incluindo impostos (se aplicável)." />
              </div>
              <div className="flex items-center gap-2">
                R$
                <input
                  defaultValue={formatedNumber(
                    String(props.comissao.toFixed(2)),
                  )}
                  type="text"
                  placeholder="R$"
                  step="0.01"
                  name="com"
                  id="com"
                  className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full"
                  onInput={() => {
                    const total = document.getElementById(
                      "tot",
                    ) as HTMLInputElement;
                    const comissao = document.getElementById(
                      "com",
                    ) as HTMLInputElement;
                    const liquido = document.getElementById(
                      "liq",
                    ) as HTMLInputElement;
                    // const limpeza = document.getElementById('taxa_limpeza') as HTMLInputElement
                    if (liquido.value.length == 0 && total.value.length == 0) {
                      return;
                    } else if (
                      liquido.value.length == 0 &&
                      total.value.length > 0
                    ) {
                      // if (!showTaxaLimpeza[0]) {
                      liquido.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            comissao.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                      //}
                      /* else {
                                                liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(limpeza.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                            } */
                    } else if (
                      liquido.value.length > 0 &&
                      total.value.length == 0
                    ) {
                      total.value = String(
                        Number(
                          comissao.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ) +
                          Number(
                            liquido.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                    } else {
                      // if (!showTaxaLimpeza[0]) {
                      liquido.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            comissao.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                      //}
                      /* else {
                                                liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(limpeza.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                            } */
                    }
                    total.value = formatedNumber(
                      String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    comissao.value = formatedNumber(
                      String(
                        Number(
                          comissao.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    liquido.value = formatedNumber(
                      String(
                        Number(
                          liquido.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    checkNegativeAndApplyStyle();
                  }}
                />
              </div>
            </label>
            <label htmlFor="liq" className="flex flex-col">
              <div className="flex items-center">
                <span className="text-zinc-500 font-medium mb-1 text-xs">
                  Valor Líquido
                  <span className="text-red-500 font-bold"> *</span>
                </span>
                <Tooltip text="<strong>Valor Líquido</strong> - Valor líquido é o valor que o proprietário/gestor recebe após as deduções de comissões e taxas." />
              </div>
              <div className="flex items-center gap-2">
                R$
                <input
                  defaultValue={formatedNumber(
                    String(props.valorLiq.toFixed(2)),
                  )}
                  type="text"
                  placeholder="R$"
                  step="0.01"
                  name="liq"
                  id="liq"
                  className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full"
                  onInput={() => {
                    const total = document.getElementById(
                      "tot",
                    ) as HTMLInputElement;
                    const comissao = document.getElementById(
                      "com",
                    ) as HTMLInputElement;
                    const liquido = document.getElementById(
                      "liq",
                    ) as HTMLInputElement;
                    // const limpeza = document.getElementById('taxa_limpeza') as HTMLInputElement
                    if (comissao.value.length == 0 && total.value.length == 0) {
                      total.value = String(
                        Number(
                          liquido.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ) +
                          Number(
                            comissao.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                    } else if (
                      comissao.value.length == 0 &&
                      total.value.length > 0
                    ) {
                      // if (!showTaxaLimpeza[0]) {
                      comissao.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            liquido.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                      //}
                      /* else {
                                                comissao.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(limpeza.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                            } */
                    } else if (
                      comissao.value.length > 0 &&
                      total.value.length == 0
                    ) {
                      total.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            comissao.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                    } else {
                      // if (!showTaxaLimpeza[0]) {
                      comissao.value = String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ) -
                          Number(
                            liquido.value
                              .replace(/[.]/gm, "")
                              .replace(/[,]/gm, ""),
                          ),
                      );
                      //}
                      /* else {
                                                comissao.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(limpeza.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                            } */
                    }
                    total.value = formatedNumber(
                      String(
                        Number(
                          total.value.replace(/[.]/gm, "").replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    comissao.value = formatedNumber(
                      String(
                        Number(
                          comissao.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    liquido.value = formatedNumber(
                      String(
                        Number(
                          liquido.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    checkNegativeAndApplyStyle();
                  }}
                />
              </div>
            </label>
          </div>
          {/*  */}
          {showTaxaLimpeza[0] && (
            <label htmlFor="taxa_limpeza" className="flex flex-col">
              <div className="flex items-center">
                <span className="text-zinc-500 font-medium mb-1 text-xs">
                  Taxa de Limpeza
                  <span className="text-red-500 font-bold"> *</span>
                </span>
                <Tooltip text="<strong>Taxa de limpeza</strong> - Taxa de limpeza é o valor cobrado adicionalmente ao valor das diárias nas reservas." />
              </div>
              <div className="flex items-center gap-2">
                R$
                <input
                  type="text"
                  placeholder="R$"
                  step="0.01"
                  name="taxa_limpeza"
                  id="taxa_limpeza"
                  defaultValue={props.taxaLimpeza.toFixed(2)}
                  className={`border border-zinc-300  rounded-md px-2 py-1 outline-none w-full`}
                  onChange={(e) => {
                    e.target.value = formatedNumber(
                      String(
                        Number(
                          e.target.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, ""),
                        ),
                      ),
                    );
                    checkNegativeAndApplyStyle();
                  }}
                />
              </div>
            </label>
          )}
          {/*  */}
          <label htmlFor="obs" className="flex flex-col">
            <span className="text-zinc-500 font-medium mb-1 text-xs">
              Observação
            </span>
            <input
              defaultValue={props.obs}
              type="text"
              name="obs"
              id="obs"
              placeholder="Opcional"
              className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
            />
          </label>
          <section className="flex gap-3 justify-end mt-2">
            <button
              className="px-3 py-2 border border-zinc-300 rounded-lg"
              onClick={props.close}
            >
              Cancelar
            </button>
            {button && (
              <button
                onClick={async () => {
                  setButton(false);
                  const acomodacaoInput = document.getElementById(
                    "acomodacao",
                  ) as HTMLSelectElement;
                  const canais = document.getElementById(
                    "canal-reserva",
                  ) as HTMLSelectElement;
                  const qtdHospede = document.getElementById(
                    "qtd-hospedes",
                  ) as HTMLInputElement;
                  const checkinDate = document.getElementById(
                    "checkin-date",
                  ) as HTMLInputElement;
                  const checkinHora = document.getElementById(
                    "checkin-hour",
                  ) as HTMLInputElement;
                  const checkoutDate = document.getElementById(
                    "checkout-date",
                  ) as HTMLInputElement;
                  const checkoutHora = document.getElementById(
                    "checkout-hour",
                  ) as HTMLInputElement;

                  const valorComissao = document.getElementById(
                    "com",
                  ) as HTMLInputElement;
                  const valorBruto = document.getElementById(
                    "tot",
                  ) as HTMLInputElement;
                  const valorLiquido = document.getElementById(
                    "liq",
                  ) as HTMLInputElement;
                  const taxaLimpeza = document.getElementById(
                    "taxa_limpeza",
                  ) as HTMLInputElement;
                  const hospedeInput = document.getElementById(
                    "hospede",
                  ) as HTMLInputElement;
                  const obs = document.getElementById(
                    "obs",
                  ) as HTMLInputElement;
                  let hospedeId: number = 0;
                  let vProprietario: number = 0;
                  let vGestor: number = 0;
                  /* let valorLiqCalculado = 0

                                if (taxaLimpeza) {
                                    const calculado = (
                                        (
                                            (Number(valorBruto.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2')) +
                                                (Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2')))) -
                                            Number(valorComissao.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))
                                        )//valor liquido 
                                        - (
                                            (Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))) // limpeza 
                                            -
                                            (
                                                (Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))) *
                                                (
                                                    (Number(valorComissao.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))) /
                                                    (Number(valorBruto.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2')) +
                                                        (Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))))
                                                )
                                            )
                                        )
                                    );

                                    valorLiqCalculado = Number(calculado.toFixed(2));
                                } */

                  const checkinDateTime = new Date(
                    `${checkinDate.value} ${checkinHora.value}:00`,
                  );
                  const checkoutDateTime = new Date(
                    `${checkoutDate.value} ${checkoutHora.value}:00`,
                  );

                  if (
                    acomodacaoInput.value.length > 0 &&
                    canais.value.length > 0 &&
                    Number(qtdHospede.value) > 0 &&
                    checkinDate.value.length > 0 &&
                    checkinHora.value.length > 0 &&
                    checkoutDate.value.length > 0 &&
                    checkoutHora.value.length > 0 &&
                    Number(
                      valorComissao.value
                        .replace(/[.]/gm, "")
                        .replace(/[,]/gm, "."),
                    ) >= 0 &&
                    Number(
                      valorBruto.value
                        .replace(/[.]/gm, "")
                        .replace(/[,]/gm, "."),
                    ) >= 0 &&
                    Number(
                      valorLiquido.value
                        .replace(/[.]/gm, "")
                        .replace(/[,]/gm, "."),
                    ) >= 0 &&
                    hospedeInput.value.length > 0 &&
                    checkinDateTime < checkoutDateTime
                  ) {
                    if (
                      hospede.filter(
                        (h) =>
                          h.nome.toLowerCase() ==
                          hospedeInput.value.toLowerCase(),
                      ).length > 0
                    ) {
                      hospedeId =
                        hospede.filter(
                          (h) =>
                            h.nome.toLowerCase() ==
                            hospedeInput.value.toLowerCase(),
                        )[0].id || 0;
                      if (completeHospede.complete) {
                        await updateHospede({
                          id: hospedeId,
                          email: completeHospede.email,
                          telefone: completeHospede.celular,
                          nome: hospedeInput.value,
                        });
                      }
                    } else
                      hospedeId = await createHospede({
                        nome: hospedeInput.value,
                        email:
                          completeHospede.email.length > 0
                            ? completeHospede.email
                            : null,
                        saas: { id: dataToken.id },
                        telefone:
                          completeHospede.celular.length > 0
                            ? completeHospede.celular
                            : null,
                      });

                    if (
                      acomodacao.filter(
                        (a) => a.id == Number(acomodacaoInput.value),
                      )[0].comissao
                    ) {
                      const comissao = acomodacao.filter(
                        (a) => a.id == Number(acomodacaoInput.value),
                      )[0].comissao;
                      vProprietario =
                        ((100 - comissao) / 100) *
                        Number(
                          valorLiquido.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, "."),
                        );
                      vGestor =
                        (comissao / 100) *
                        Number(
                          valorLiquido.value
                            .replace(/[.]/gm, "")
                            .replace(/[,]/gm, "."),
                        );
                    } else {
                      vProprietario = Number(
                        valorLiquido.value
                          .replace(/[.]/gm, "")
                          .replace(/[,]/gm, "."),
                      );
                      vGestor = Number(
                        valorLiquido.value
                          .replace(/[.]/gm, "")
                          .replace(/[,]/gm, "."),
                      );
                    }
                    await updateReserva({
                      acomodacao: {
                        id: Number(acomodacaoInput.value),
                      },
                      check_in: `${checkinDate.value} ${checkinHora.value}:00`,
                      check_out: `${checkoutDate.value} ${checkoutHora.value}:00`,
                      canal_reserva: {
                        id: Number(canais.value),
                      },
                      comissao_ota: Number(
                        valorComissao.value
                          .replace(/[.]/gm, "")
                          .replace(/[,]/gm, "."),
                      ),
                      hospede: {
                        id: hospedeId,
                      },
                      qtd_hospede: Number(qtdHospede.value),
                      saas: {
                        id: Number(dataToken.id),
                      },
                      taxa_limpeza: taxaLimpeza
                        ? Number(
                            taxaLimpeza.value
                              .replace(/[.,]/gm, "")
                              .replace(/(\d{1,})(\d{2})/gm, "$1.$2"),
                          )
                        : 0,
                      valor: Number(
                        valorBruto.value
                          .replace(/[.]/gm, "")
                          .replace(/[,]/gm, "."),
                      ),
                      valor_liq: Number(
                        valorLiquido.value
                          .replace(/[.]/gm, "")
                          .replace(/[,]/gm, "."),
                      ),
                      valor_prop: vProprietario,
                      valor_gestor: vGestor,
                      valor_liq_calculado: Number(
                        valorLiquido.value
                          .replace(/[.]/gm, "")
                          .replace(/[,]/gm, "."),
                      ),
                      obs: obs.value,
                      tipo_reserva: props.tipoReserva,
                    });
                  } else {
                    setButton(true);
                    setNotify({ type: 2, text: "Preenchimento incorreto!" });
                    setShowNotify(true);
                    setTimeout(() => {
                      setShowNotify(false);
                    }, 3000);
                  }
                }}
                id="button-cadastrar"
                className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
              >
                Salvar Alterações
              </button>
            )}
          </section>
        </form>
      )}
    </div>
  );
}
