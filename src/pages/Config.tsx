import { useContext, useEffect, useState } from "react";
import SemPermissao from "../components/SemPermissao";
import TopBar from "../components/TopBar";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Notify from "../components/notify/Notify";
import MelhorarPlanos from "../components/MelhorarPlanos";

export default function Config() {
  useEffect(() => {
    document.title = `Assinatura | Prohost`;
  }, []);

  const apiURL = import.meta.env.VITE_API_URL;
  const { statusData, dataToken } = useContext(SideBarContext);
  const [session, setSession] = useState(0);
  const [assinatura, setAssinatura] = useState(true);
  const [componentAssinar, setComponentAssinar] = useState(true);
  const [proprietario, setProprietario] = useState(false);
  const [edicao, setEdicao] = useState(false);
  const [notify, setNotify] = useState({ type: 1, text: "Criado!" });
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [terceiro, setTerceiro] = useState<any[]>([]);

  function dateFormat(dataISO: string) {
    if (dataISO == "") return "";
    const dataLimpa = dataISO.slice(0, 10);
    const [ano, mes, dia] = dataLimpa.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  function diasFaltantes(dataFutura: string) {
    if (dataFutura == "") return "";
    const hoje = new Date() as any;
    const futura = new Date(dataFutura) as any;

    hoje.setHours(0, 0, 0, 0);
    futura.setHours(0, 0, 0, 0);

    const diferenca = Math.ceil((futura - hoje) / (1000 * 60 * 60 * 24));

    return diferenca;
  }

  async function excluir(idUsers: number) {
    await fetch(`${apiURL}/users/${idUsers}`, { method: "DELETE" })
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

  async function criarUsuario(body: any) {
    await fetch(`${apiURL}/users`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.id) {
          setNotify({ type: 1, text: "Usuário criado!" });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
            location.reload();
          }, 3000);
        } else {
          setNotify({ type: 2, text: data });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  }

  async function editarUsuario(id: number, body: any) {
    await fetch(`${apiURL}/users/${id}/permissao`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.affected) {
          setNotify({ type: 1, text: "Permissões atualizadas!" });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
            location.reload();
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  }

  const [users, setUsers] = useState<
    {
      id: string;
      nome: string;
      email: string;
      senha: string;
      permissao: {
        config: number;
        hospede: number;
        reserva: number;
        dashboard: { indiOpe: number; resultAc: number; resultGestor: number };
        financeiro: number;
        acomodacoes: number;
      };
      acomodacoes: string[];
    }[]
  >([]);
  const [permissao, setPermissao] = useState(0);
  async function permissoes() {
    await fetch(`${apiURL}/users/${dataToken.idUsu}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.config) {
          setPermissao(data.config);
        } else {
          setPermissao(0);
        }
      })
      .catch((err) => console.log(err));

    await fetch(`${apiURL}/users/${dataToken.id}/users`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => console.log(err));

    await acomodacoes();
  }

  async function acomodacoes() {
    await fetch(`${apiURL}/acomodacao/` + dataToken.id, {
      method: "GET",
    })
      .then((data) => data.json())
      .then(async (data: any[]) => {
        setTerceiro(data.filter((e) => e.tipo == "terceiro" && !e.desativado));
      });
  }

  const [idEdit, setIdEdit] = useState<number>();
  const [nomeInput, setNomeInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [dashboardPInput, setDashboardPInput] = useState<{
    indOpe: string;
    resultAc: string;
    resultGestor: string;
  }>({ indOpe: "", resultAc: "", resultGestor: "" });
  const [reservaPInput, setReservaPInput] = useState<string>("");
  const [acomodacaoPInput, setAcomodacaoPInput] = useState<string>("");
  const [hospedePInput, setHospedePInput] = useState<string>("");
  const [financeiroPInput, setFinanceiroPInput] = useState<string>("");
  const [acomodacoesSelected, setAcomodacoesSelected] = useState<
    string[] | null
  >(null);

  useEffect(() => {
    if (dataToken && dataToken.id && dataToken.idUsu) permissoes();
    if (statusData) {
      if (statusData?.trial_end) {
        if (new Date(statusData.trial_end) < new Date()) {
          setAssinatura(false);
        }
      }
    }
  }, [statusData, dataToken]);

  return (
    <div className="flex flex-col w-full min-h-screen h-full">
      {permissao == 0 && <SemPermissao />}
      <TopBar>
        <section className="ml-5 flex gap-5">
          <button
            onClick={() => setSession(0)}
            className={`h-full text-sm flex items-center gap-2 border-b-2 ${session == 0 ? "border-primary" : "border-transparent"} hover:border-primary px-2`}
          >
            Meu plano
          </button>
          <button
            onClick={() => setSession(1)}
            className={`h-full text-sm flex items-center gap-2 border-b-2 ${session == 1 ? "border-primary" : "border-transparent"} hover:border-primary px-2`}
          >
            Gestão de usuários
          </button>
        </section>
      </TopBar>
      {showNotify && <Notify type={notify.type} text={notify.text} />}

      {session == 0 && (
        <div className="flex rounded-md flex-col px-4 pb-3 pt-2">
          <h5 className="font-semibold text-2xl mb-2">Assinatura</h5>

          {assinatura ? (
            <>
              <div className="self-center bg-emerald-100 p-6 rounded-xl flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <svg
                    className="w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="rgba(60,209,169,1)"
                  >
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path>
                  </svg>
                  Meu plano
                </div>
                <p className="text-primary text-2xl">
                  Número de Acomodações: {statusData?.qtd_acomodacao || ""}
                </p>
                <p className="text-primary text-2xl">
                  Data de Renovação: {dateFormat(statusData?.trial_end || "")}
                </p>
                <p className="text-primary text-2xl">
                  Dias Restantes: {diasFaltantes(statusData?.trial_end || "")}
                </p>
              </div>

              <div className="text-primary text-center text-3xl mt-5 flex justify-center gap-5">
                {componentAssinar ? "Assinatura" : "Upgrade"} de plano
                <button
                  className="inline-flex justify-center items-center border-2 border-primary rounded-full p-1 bg-secondary bg-opacity-20"
                  onClick={() => {
                    setComponentAssinar(!componentAssinar);
                  }}
                >
                  <svg
                    className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 4C9.25144 4 6.82508 5.38626 5.38443 7.5H8V9.5H2V3.5H4V5.99936C5.82381 3.57166 8.72764 2 12 2C17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4ZM4 12C4 16.4183 7.58172 20 12 20C14.7486 20 17.1749 18.6137 18.6156 16.5H16V14.5H22V20.5H20V18.0006C18.1762 20.4283 15.2724 22 12 22C6.47715 22 2 17.5228 2 12H4Z"></path>
                  </svg>
                </button>
              </div>

              {componentAssinar && (
                <div className="incoming">
                  <MelhorarPlanos upgrade={false} />
                </div>
              )}
              {!componentAssinar && (
                <div className="incoming">
                  <MelhorarPlanos upgrade={true} />
                </div>
              )}
            </>
          ) : (
            <div className="self-center bg-red-100 p-6 rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[rgba(237,62,68,1)] font-semibold">
                <svg
                  className="w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="rgba(237,62,68,1)"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"></path>
                </svg>
                Seu acesso está bloqueado
              </div>
              <p className="text-primary text-3xl">
                Para continuar escolha um plano abaixo
              </p>
              <MelhorarPlanos upgrade={false} />
            </div>
          )}
        </div>
      )}
      {session == 1 && assinatura && (
        <section className="flex rounded-md flex-col px-4 pb-3 pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            style={{ width: "-webkit-fill-available" }}
            className="flex rounded-md flex-col px-4 pb-3 gap-4 min-w-72 mb-20 bg-white pt-2"
          >
            <h5 className="font-semibold text-2xl mb-2">
              Criar usuário filiado
            </h5>

            <label className="checkbox-wrapper">
              <input
                checked={proprietario}
                type="checkbox"
                defaultChecked={proprietario}
                onChange={(e) => {
                  setProprietario(e.target.checked);
                }}
              />
              <div className="checkmark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <span className="label">É um proprietário?</span>
            </label>

            <label htmlFor="nome" className="flex flex-col">
              <span className="text-zinc-500 font-medium mb-1 text-sm">
                Nome
              </span>
              <input
                type="text"
                name="nome"
                id="nome"
                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
              />
            </label>
            <label htmlFor="email" className="flex flex-col">
              <span className="text-zinc-500 font-medium mb-1 text-sm">
                E-mail
              </span>
              <input
                type="email"
                name="email"
                id="email"
                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
              />
            </label>
            <label htmlFor="senha" className="flex flex-col">
              <span className="text-zinc-500 font-medium mb-1 text-sm">
                Senha
              </span>
              <input
                type="password"
                name="senha"
                id="senha"
                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
              />
            </label>
            <span className="text-zinc-500 font-medium text-sm">
              {proprietario
                ? "Quais acomodaçoes ele poderá visualizar?"
                : "Permissões"}
            </span>
            {!proprietario ? (
              <section className="grid grid-cols-2 gap-4">
                <label
                  htmlFor="dash-permissao-ind-ope"
                  className="flex flex-col text-zinc-600 font-medium text-sm"
                >
                  <p>
                    Página Dashboard <strong>(Indicadores Operacionais)</strong>
                  </p>
                  <select
                    name="dash-permissao-ind-ope"
                    id="dash-permissao-ind-ope"
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label
                  htmlFor="dash-permissao-result-ac"
                  className="flex flex-col text-zinc-600 font-medium text-sm"
                >
                  <p>
                    Página Dashboard{" "}
                    <strong>(Resultados das Acomodações)</strong>
                  </p>
                  <select
                    name="dash-permissao-result-ac"
                    id="dash-permissao-result-ac"
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label
                  htmlFor="dash-permissao-result-gestor"
                  className="flex flex-col text-zinc-600 font-medium text-sm"
                >
                  <p>
                    Página Dashboard <strong>(Resultados do Gestor)</strong>
                  </p>
                  <select
                    name="dash-permissao-result-gestor"
                    id="dash-permissao-result-gestor"
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>

                <label
                  htmlFor="hospede-permissao"
                  className="flex flex-col text-zinc-600 font-medium text-sm"
                >
                  Página Hóspedes
                  <select
                    name="hospede-permissao"
                    id="hospede-permissao"
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label
                  htmlFor="reserva-permissao"
                  className="flex flex-col text-zinc-600 font-medium text-sm"
                >
                  Página Reserva
                  <select
                    name="reserva-permissao"
                    id="reserva-permissao"
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label
                  htmlFor="financeiro-permissao"
                  className="flex flex-col text-zinc-600 font-medium text-sm"
                >
                  Página Financeiro
                  <select
                    name="financeiro-permissao"
                    id="financeiro-permissao"
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label
                  htmlFor="acomodacao-permissao"
                  className="flex flex-col text-zinc-600 font-medium text-sm"
                >
                  Página Acomodações
                  <select
                    name="acomodacao-permissao"
                    id="acomodacao-permissao"
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <button
                  className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                  onClick={() => {
                    const nome = document.getElementById(
                      "nome",
                    ) as HTMLInputElement;
                    const email = document.getElementById(
                      "email",
                    ) as HTMLInputElement;
                    const senha = document.getElementById(
                      "senha",
                    ) as HTMLInputElement;
                    const dashIndOpe = document.getElementById(
                      "dash-permissao-ind-ope",
                    ) as HTMLSelectElement;
                    const dashResultAc = document.getElementById(
                      "dash-permissao-result-ac",
                    ) as HTMLSelectElement;
                    const dashResultGestor = document.getElementById(
                      "dash-permissao-result-gestor",
                    ) as HTMLSelectElement;
                    const reserva = document.getElementById(
                      "reserva-permissao",
                    ) as HTMLSelectElement;
                    const acomodacao = document.getElementById(
                      "acomodacao-permissao",
                    ) as HTMLSelectElement;
                    const hospede = document.getElementById(
                      "hospede-permissao",
                    ) as HTMLSelectElement;
                    const financeiro = document.getElementById(
                      "financeiro-permissao",
                    ) as HTMLSelectElement;
                    if (
                      nome.value.length > 0 &&
                      email.value.length > 0 &&
                      senha.value.length > 0 &&
                      dataToken.id
                    ) {
                      criarUsuario({
                        nome: nome.value,
                        email: email.value,
                        senha: senha.value,
                        saas: Number(dataToken.id),
                        permissao: {
                          dashboard: {
                            indiOpe: Number(dashIndOpe.value),
                            resultAc: Number(dashResultAc.value),
                            resultGestor: Number(dashResultGestor.value),
                          },
                          reserva: Number(reserva.value),
                          acomodacoes: Number(acomodacao.value),
                          hospede: Number(hospede.value),
                          financeiro: Number(financeiro.value),
                          config: 0,
                        },
                      });
                    }
                  }}
                >
                  Criar usuário
                </button>
              </section>
            ) : (
              <section className="gap-4 flex flex-col">
                <ul className="grid grid-cols-3 gap-5">
                  {terceiro.map((a) => (
                    <li>
                      <label htmlFor={a.id} className="flex">
                        <input
                          type="checkbox"
                          name={a.nome}
                          id={a.id}
                          className="prop-ac"
                          title={a.nome}
                        />
                        <p className="ml-2 text-nowrap text-ellipsis overflow-hidden">
                          {a.nome}
                        </p>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                  onClick={() => {
                    const nome = document.getElementById(
                      "nome",
                    ) as HTMLInputElement;
                    const email = document.getElementById(
                      "email",
                    ) as HTMLInputElement;
                    const senha = document.getElementById(
                      "senha",
                    ) as HTMLInputElement;

                    const acomodacoes = document.querySelectorAll(
                      ".prop-ac",
                    ) as NodeListOf<HTMLInputElement>;
                    const acomodacoesSelecionadas = Array.from(acomodacoes)
                      .filter((checkbox) => checkbox.checked)
                      .map((checkbox) => checkbox.id);
                    console.log(acomodacoesSelecionadas);
                    if (
                      nome.value.length > 0 &&
                      email.value.length > 0 &&
                      senha.value.length > 0 &&
                      dataToken.id
                    ) {
                      criarUsuario({
                        nome: nome.value,
                        email: email.value,
                        senha: senha.value,
                        saas: Number(dataToken.id),
                        permissao: {
                          dashboard: {
                            indiOpe: 1,
                            resultAc: 1,
                            resultGestor: 1,
                          },
                          reserva: 0,
                          acomodacoes: 0,
                          hospede: 0,
                          financeiro: 0,
                          config: 0,
                        },
                        acomodacoes: acomodacoesSelecionadas,
                      });
                    }
                  }}
                >
                  Criar usuário
                </button>
              </section>
            )}
          </form>
          <hr />
          <section className="top-full bg-white p-2 gap-4 rounded-xl">
            <h5 className="font-semibold text-2xl mb-2">Usuários criados</h5>
            <ul className="flex flex-col gap-1 mb-20">
              {users.map((u) => (
                <li
                  className="border-y border-zinc-400 px-2 py-1 cursor-pointer flex justify-between"
                  onClick={() => {
                    if (u?.acomodacoes && u.acomodacoes.length > 0) {
                      setProprietario(true);
                    } else {
                      setProprietario(false);
                    }
                    setEdicao(true);
                    setIdEdit(Number(u.id));
                    setNomeInput(u.nome);
                    setEmailInput(u.email);
                    setDashboardPInput({
                      indOpe: String(u.permissao.dashboard.indiOpe),
                      resultAc: String(u.permissao.dashboard.resultAc),
                      resultGestor: String(u.permissao.dashboard.resultGestor),
                    });
                    setReservaPInput(String(u.permissao.reserva));
                    setAcomodacaoPInput(String(u.permissao.acomodacoes));
                    setHospedePInput(String(u.permissao.hospede));
                    setFinanceiroPInput(String(u.permissao.financeiro));
                    setAcomodacoesSelected(u.acomodacoes);
                  }}
                >
                  Nome: {u.nome}
                  <br />
                  Email: {u.email}
                  <div className="group relative flex items-center mr-20">
                    <button
                      onClick={(ex) => {
                        if (!(permissao >= 4)) {
                          return;
                        }
                        let confirmDelete = false;
                        ex.stopPropagation();
                        confirmDelete = confirm("Deseja deletar este usuário?");
                        if (confirmDelete) excluir(Number(u.id));
                      }}
                      className="bg-red-200 w-10 h-10 flex justify-center items-center rounded-lg hover:translate-y-1 hover:duration-300 justify-self-end"
                    >
                      <svg
                        className="h-fit w-5 m-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#ED3E44"
                      >
                        <path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9ZM9 12V18H11V12H9ZM13 12V18H15V12H13Z"></path>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </section>
      )}
      {edicao && (
        <div className="w-screen h-screen fixed z-10 top-0 right-0">
          <div
            className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20"
            onClick={() => setEdicao(false)}
          ></div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            style={{ width: "max-content" }}
            className="flex rounded-md flex-col absolute min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2"
          >
            <h5 className="font-semibold text-2xl mb-2">
              Editar usuário filiado
            </h5>
            <label className="flex flex-col">
              <span className="text-zinc-500 font-medium mb-1 text-sm">
                Nome
              </span>
              <input
                disabled
                type="text"
                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                defaultValue={nomeInput}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-zinc-500 font-medium mb-1 text-sm">
                E-mail
              </span>
              <input
                disabled
                type="email"
                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                defaultValue={emailInput}
              />
            </label>
            <label className="checkbox-wrapper">
              <input
                checked={proprietario}
                type="checkbox"
                defaultChecked={proprietario}
                onChange={(e) => {
                  setProprietario(e.target.checked);
                }}
              />
              <div className="checkmark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <span className="label">É um proprietário?</span>
            </label>
            <span className="text-zinc-500 font-medium text-sm">
              {proprietario
                ? "Quais acomodaçoes ele poderá visualizar?"
                : "Permissões"}
            </span>
            {!proprietario ? (
              <section className="grid grid-cols-2 gap-4">
                <label className="flex flex-col text-zinc-600 font-medium text-sm">
                  <p>
                    Página Dashboard <strong>(Indicadores Operacionais)</strong>
                  </p>
                  <select
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                    onChange={(e) => {
                      setDashboardPInput({
                        ...dashboardPInput,
                        indOpe: e.target.value,
                      });
                    }}
                    defaultValue={dashboardPInput.indOpe}
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label className="flex flex-col text-zinc-600 font-medium text-sm">
                  <p>
                    Página Dashboard{" "}
                    <strong>(Resultados das Acomodações)</strong>
                  </p>
                  <select
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                    onChange={(e) => {
                      setDashboardPInput({
                        ...dashboardPInput,
                        resultAc: e.target.value,
                      });
                    }}
                    defaultValue={dashboardPInput.resultAc}
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label className="flex flex-col text-zinc-600 font-medium text-sm">
                  <p>
                    Página Dashboard <strong>(Resultados do Gestor)</strong>
                  </p>
                  <select
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                    onChange={(e) => {
                      setDashboardPInput({
                        ...dashboardPInput,
                        resultGestor: e.target.value,
                      });
                    }}
                    defaultValue={dashboardPInput.resultGestor}
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label className="flex flex-col text-zinc-600 font-medium text-sm">
                  Página Hóspedes
                  <select
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                    onChange={(e) => {
                      setHospedePInput(e.target.value);
                    }}
                    defaultValue={hospedePInput}
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label className="flex flex-col text-zinc-600 font-medium text-sm">
                  Página Reserva
                  <select
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                    onChange={(e) => {
                      setReservaPInput(e.target.value);
                    }}
                    defaultValue={reservaPInput}
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label className="flex flex-col text-zinc-600 font-medium text-sm">
                  Página Financeiro
                  <select
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                    onChange={(e) => {
                      setFinanceiroPInput(e.target.value);
                    }}
                    defaultValue={financeiroPInput}
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <label className="flex flex-col text-zinc-600 font-medium text-sm">
                  Página Acomodações
                  <select
                    className="border border-zinc-300 rounded-md px-2 py-1 outline-none text-base w-fit"
                    onChange={(e) => {
                      setAcomodacaoPInput(e.target.value);
                    }}
                    defaultValue={acomodacaoPInput}
                  >
                    <option value="0" className="text-black">
                      Sem Visualização
                    </option>
                    <option value="1" className="text-black">
                      Apenas Visualização
                    </option>
                    <option value="3" className="text-black">
                      Visualização, Adição e Edição
                    </option>
                    <option value="4" className="text-black">
                      Visualização, Adição, Edição e Exclusão
                    </option>
                  </select>
                </label>
                <button
                  className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                  onClick={() => {
                    if (dataToken.id) {
                      editarUsuario(idEdit || 0, {
                        nome: nomeInput,
                        permissao: {
                          dashboard: {
                            indiOpe: Number(dashboardPInput.indOpe),
                            resultAc: Number(dashboardPInput.resultAc),
                            resultGestor: Number(dashboardPInput.resultGestor),
                          },
                          reserva: Number(reservaPInput),
                          acomodacoes: Number(acomodacaoPInput),
                          hospede: Number(hospedePInput),
                          financeiro: Number(financeiroPInput),
                          config: 0,
                        },
                        acomodacoes: null,
                      });
                    }
                  }}
                >
                  Editar usuário
                </button>
              </section>
            ) : (
              <section className="gap-4 flex flex-col">
                <ul className="grid grid-cols-2 gap-5">
                  {terceiro.map((a) => (
                    <li>
                      <label htmlFor={`edit-${a.id}`} className="flex">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            acomodacoesSelected &&
                              setAcomodacoesSelected((prev) => {
                                if (e.target.checked) {
                                  return prev
                                    ? [...prev, String(a.id)]
                                    : [String(a.id)];
                                } else {
                                  return prev
                                    ? prev.filter((id) => id !== String(a.id))
                                    : null;
                                }
                              });
                          }}
                          checked={
                            acomodacoesSelected &&
                            acomodacoesSelected.includes(String(a.id))
                              ? true
                              : false
                          }
                          name={a.nome}
                          id={`edit-${a.id}`}
                          className="prop-ac"
                          title={a.nome}
                        />
                        <p className="ml-2 text-nowrap text-ellipsis overflow-hidden">
                          {a.nome}
                        </p>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                  onClick={() => {
                    if (dataToken.id) {
                      editarUsuario(idEdit || 0, {
                        nome: nomeInput,
                        permissao: {
                          dashboard: {
                            indiOpe: 1,
                            resultAc: 1,
                            resultGestor: 1,
                          },
                          reserva: 0,
                          acomodacoes: 0,
                          hospede: 0,
                          financeiro: 0,
                          config: 0,
                        },
                        acomodacoes: acomodacoesSelected,
                      });
                    }
                  }}
                >
                  Editar usuário
                </button>
              </section>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
