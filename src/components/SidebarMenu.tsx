import posthog from '../posthog';
import { useContext, useEffect, useState } from "react";
import prohostLogo from "/prohost-logo.png";
import { SideBarContext } from "../contexts/SideBarMenuContext";

export default function SidebarMenu({ route }: { route: string }) {
  const apiURL = import.meta.env.VITE_API_URL;
  const [refresh, setRefresh] = useState<boolean>(true);
  async function infoToken() {
    const token = window.localStorage.getItem("ph_token_acc");
    if (token) {
      await fetch(`${apiURL}/users/token/${token}`, {
        method: "GET",
      })
        .then((data) => {
          if (data.status == 500) {
            window.location.assign("/auth");
          } else {
            return data.json();
          }
        })
        .then((data) => {
          setDataToken(data);
          if (data && data.idUsu) {
            posthog.identify(String(data.idUsu), { name: data.nome });
          }
        })
        .catch((err) => console.log(err));
    } else {
      window.location.assign("/auth");
    }
    setRefresh(false);
  }
  useEffect(() => {
    if (refresh) {
      infoToken();
    }
  }, [refresh]);

  async function getSituation(id: string) {
    await fetch(`${apiURL}/saas/vp/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        const page = location.pathname;
        if (
          new Date(data.trial_end) <
            new Date(new Date().setDate(new Date().getDate())) &&
          page != "/assinatura"
        ) {
          location.assign("/assinatura");
        } else if (
          dataToken?.acomodacoes &&
          dataToken.acomodacoes.length > 0 &&
          page != "/proprietario"
        ) {
          location.assign("/proprietario");
        }
        setStatusData(data);
      })
      .catch((err) => console.log(err));
  }
  const { active, setDataToken, dataToken, setStatusData } =
    useContext(SideBarContext);
  useEffect(() => {
    if (dataToken?.id) {
      getSituation(dataToken.id);
    }
  }, [dataToken]);
  return (
    <nav
      className={`bg-primary sticky top-0 left-0 h-screen ${active ? "w-56" : "w-20"} flex flex-col justify-between border-r border-secondary`}
    >
      <div>
        <a href={"/"} className="flex py-5 gap-2 px-7 justify-center">
          {active ? (
            <>
              <img
                src={prohostLogo}
                alt="Logo ProHost"
                width={32}
                height={32}
              />
              <h1 className="text-white font-bold text-3xl tracking-tight">
                prohost
              </h1>
            </>
          ) : (
            <h1 className="text-white font-bold text-3xl tracking-tight">
              <span className="text-secondary">p</span>
              <span>h</span>
            </h1>
          )}
        </a>
        <hr className="opacity-25" />
        {dataToken?.acomodacoes && dataToken.acomodacoes.length > 0 ? (
          <ul className="flex flex-col gap-2 mt-6 items-center">
            <li>
              <a
                href={"/proprietario"}
                className={`${route == "/proprietario" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="#ACDBFF"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M480-40 360-160H200q-33 0-56.5-23.5T120-240v-560q0-33 23.5-56.5T200-880h560q33 0 56.5 23.5T840-800v560q0 33-23.5 56.5T760-160H600L480-40ZM200-286q54-53 125.5-83.5T480-400q83 0 154.5 30.5T760-286v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM280-240h400v-10q-42-35-93-52.5T480-320q-56 0-107 17.5T280-250v10Zm200-320q-25 0-42.5-17.5T420-620q0-25 17.5-42.5T480-680q25 0 42.5 17.5T540-620q0 25-17.5 42.5T480-560Zm0 17Z" />
                </svg>
                {active && <p className="text-zinc-300">Proprietário</p>}
              </a>
            </li>
          </ul>
        ) : (
          <ul className="flex flex-col gap-2 mt-6 items-center">
            {/* dashboard */}
            <li>
              <a
                href={"/dashboard"}
                className={`${route == "/dashboard" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="#ACDBFF"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h240v-560H200v560Zm320 0h240v-280H520v280Zm0-360h240v-200H520v200Z" />
                </svg>
                {active && <p className="text-zinc-300">Dashboard</p>}
              </a>
            </li>
            {/* agent chat */}
            <li>
              <a
                href={"/agent-chat"} target="_blank"
                className={`${route == "/agent-chat" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover bg-secondary/80 ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  height="24"
                  fill="#003447"
                  width="24"
                >
                  <path d="M13.5 2C13.5 2.44425 13.3069 2.84339 13 3.11805V5H18C19.6569 5 21 6.34315 21 8V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8C3 6.34315 4.34315 5 6 5H11V3.11805C10.6931 2.84339 10.5 2.44425 10.5 2C10.5 1.17157 11.1716 0.5 12 0.5C12.8284 0.5 13.5 1.17157 13.5 2ZM6 7C5.44772 7 5 7.44772 5 8V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V8C19 7.44772 18.5523 7 18 7H13H11H6ZM2 10H0V16H2V10ZM22 10H24V16H22V10ZM9 14.5C9.82843 14.5 10.5 13.8284 10.5 13C10.5 12.1716 9.82843 11.5 9 11.5C8.17157 11.5 7.5 12.1716 7.5 13C7.5 13.8284 8.17157 14.5 9 14.5ZM15 14.5C15.8284 14.5 16.5 13.8284 16.5 13C16.5 12.1716 15.8284 11.5 15 11.5C14.1716 11.5 13.5 12.1716 13.5 13C13.5 13.8284 14.1716 14.5 15 14.5Z"></path>
                </svg>
                {active && <p className="text-primary text-sm">IA de avaliação</p>}
              </a>
            </li>
            {/* acomodacoes */}
            <li>
              <a
                href={"/acomodacoes"}
                className={`${route == "/acomodacoes" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="#ACDBFF"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M680-600h80v-80h-80v80Zm0 160h80v-80h-80v80Zm0 160h80v-80h-80v80Zm0 160v-80h160v-560H480v56l-80-58v-78h520v720H680Zm-640 0v-400l280-200 280 200v400H360v-200h-80v200H40Zm80-80h80v-200h240v200h80v-280L320-622 120-480v280Zm560-360ZM440-200v-200H200v200-200h240v200Z" />
                </svg>
                {active && <p className="text-zinc-300">Acomodações</p>}
              </a>
            </li>
            {/* reservas */}
            <li>
              <a
                href={"/reservas"}
                className={`${route == "/reservas" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="#ACDBFF"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                </svg>
                {active && <p className="text-zinc-300">Reserva</p>}
              </a>
            </li>
            {/* financeiro */}
            <li>
              <a
                href={"/movimentacoes"}
                className={`${route == "/movimentacoes" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="#ACDBFF"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                {active && <p className="text-zinc-300">Financeiro</p>}
              </a>
            </li>
            {/* relatorio */}
            <li>
              <a
                href={"/relatorio"}
                className={`${route == "/relatorio" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#ACDBFF"
                  height="24"
                  width="24"
                >
                  <path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"></path>
                </svg>
                {active && <p className="text-zinc-300">Relatório</p>}
              </a>
            </li>
            {/* hospedes */}
            <li>
              <a
                href={"/hospedes"}
                className={`${route == "/hospedes" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="#ACDBFF"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M480-40 360-160H200q-33 0-56.5-23.5T120-240v-560q0-33 23.5-56.5T200-880h560q33 0 56.5 23.5T840-800v560q0 33-23.5 56.5T760-160H600L480-40ZM200-286q54-53 125.5-83.5T480-400q83 0 154.5 30.5T760-286v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM280-240h400v-10q-42-35-93-52.5T480-320q-56 0-107 17.5T280-250v10Zm200-320q-25 0-42.5-17.5T420-620q0-25 17.5-42.5T480-680q25 0 42.5 17.5T540-620q0 25-17.5 42.5T480-560Zm0 17Z" />
                </svg>
                {active && <p className="text-zinc-300">Hóspedes</p>}
              </a>
            </li>
            {/* conficuração */}
            <li>
              <a
                href={"/assinatura"}
                className={`${route == "/assinatura" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="#ACDBFF"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                </svg>
                {active && <p className="text-zinc-300">Configurações</p>}
              </a>
            </li>
            {dataToken?.is_admin && (
              <li>
                <a
                  href={"/admin"}
                  className={`${route == "/admin" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    fill="#ACDBFF"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                  </svg>
                  {active && <p className="text-zinc-300">Admin</p>}
                </a>
              </li>
            )}
            {/* minha conta */}
            <li>
              <a
                href={"/minha-conta"}
                className={`${route == "/minha-conta" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  fill="#ACDBFF"
                >
                  <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"></path>
                </svg>
                {active && <p className="text-zinc-300">Minha conta</p>}
              </a>
            </li>
            <li className="hidden">
              <a
                href={"/feedback"}
                className={`${route == "/feedback" ? "nav-active" : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? "w-44" : "w-fit justify-center"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="#ACDBFF"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M720-440v-80h160v80H720Zm48 280-128-96 48-64 128 96-48 64Zm-80-480-48-64 128-96 48 64-128 96ZM200-200v-160h-40q-33 0-56.5-23.5T80-440v-80q0-33 23.5-56.5T160-600h160l200-120v480L320-360h-40v160h-80Zm240-182v-196l-98 58H160v80h182l98 58Zm120 36v-268q27 24 43.5 58.5T620-480q0 41-16.5 75.5T560-346ZM300-480Z" />
                </svg>
                {active && <p className="text-zinc-300">Feedback</p>}
              </a>
            </li>
          </ul>
        )}
      </div>
      <div className="pb-5">
        <a
          href={"/auth"}
          className={`flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover mx-auto ${active ? "w-44" : "w-fit justify-center"}`}
          onClick={(e) => {
            e.preventDefault();
            posthog.reset();
            window.localStorage.removeItem("ph_token_acc");
            window.location.assign("/auth");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            fill="#ACDBFF"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
          </svg>
          {active && <p className="text-zinc-300">Sair</p>}
        </a>
      </div>
    </nav>
  );
}
