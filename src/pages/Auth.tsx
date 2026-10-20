import posthog, { identifyUser } from "../posthog";
import { useEffect, useState } from "react";
import prohostLogo from "/prohost-logo.png";
import Notify from "../components/notify/Notify";

export default function Auth() {
  const apiURL = import.meta.env.VITE_API_URL;
  const [notify, setNotify] = useState({ type: 1, text: "Criado!" });
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [viewPW, setViewPW] = useState(false);
  const params = Object.fromEntries(
    new URLSearchParams(window.location.search),
  );

  async function logar(login: { email: string; senha: string }) {
    await fetch(`${apiURL}/users/auth`, {
      method: "POST",
      body: JSON.stringify({
        email: login.email,
        senha: login.senha,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        if (data.status == 200) return data.json();
        else return null;
      })
      .then((data) => {
        if (data) {
          if (data.token === true) {
            window.localStorage.setItem(
              "ph_reset_msg",
              "Por motivos de segurança, estamos solicitando que você redefina sua senha.",
            );
            window.location.assign(
              "/reset-senha?email=" + encodeURIComponent(login.email),
            );
          } else if (data.token && data.token != true) {
            fetch(`${apiURL}/users/token/${data.token}`, { method: "GET" })
              .then((response) => response.json())
              .then((user) => {
                identifyUser({
                  email: user?.email,
                  nome: user?.nome,
                  create_date: user?.create_date,
                });
              })
              .catch((err) => console.log(err))
              .finally(() => {
                posthog.capture("login_completed");
                window.localStorage.setItem("ph_token_acc", data.token);
                window.localStorage.removeItem("ph_user_data_lg");
                window.location.assign("/");
              });
          }
        } else {
          posthog.capture("login_failed");
          setNotify({ type: 2, text: "Dados incorretos!" });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  }
  async function autoLogin(token: string) {
    await fetch(`${apiURL}/users/auto-login/${token}`, {
      method: "GET",
    })
      .then((data) => {
        if (data.status == 200) return data.json();
        else return null;
      })
      .then(async (data) => {
        if (data) {
          window.localStorage.setItem("ph_token_acc", data.token);
          window.localStorage.removeItem("ph_user_data_lg");
          window.location.assign("/");
        }
        else location.assign('/auth')
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (params.token) {
      autoLogin(params.token);
    }
  }, []);

  return (
    <div className="flex w-full min-h-screen h-full">
      <main className="w-full min-h-screen h-full relative bg-zinc-100 flex flex-col md:grid md:grid-cols-3">
        {showNotify && <Notify type={notify.type} text={notify.text} />}
        <section className="bg-white flex flex-col justify-center h-full py-20 md:py-0">
          <div className="flex gap-2 ml-10">
            <img src={prohostLogo} alt="Logo ProHost" width={32} height={32} />
            <h1 className="text-zinc-500 font-bold text-3xl tracking-tight">
              prohost
            </h1>
          </div>

          <h2 className="text-3xl font-semibold mb-5 mt-10 ml-10">
            Faça login
          </h2>

          <form
            action=""
            className="mx-10 flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              const email = document.getElementById(
                "email",
              ) as HTMLInputElement;
              const senha = document.getElementById(
                "senha",
              ) as HTMLInputElement;
              logar({
                email: email.value,
                senha: senha.value,
              });
            }}
          >
            <label className="text-zinc-500 flex flex-col text-sm gap-2 relative col-span-2">
              Seu e-mail
              <svg
                className="h-fit w-4 fill-zinc-300 absolute top-10 left-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path>
              </svg>
              <input
                id="email"
                type="email"
                className="border border-zinc-300 bg-transparent text-lg py-1 pr-2 pl-7 outline-secondary text-black rounded-md"
              />
            </label>
            <label className="text-zinc-500 flex flex-col text-sm gap-2 relative">
              Sua senha
              <svg
                className="h-fit w-4 fill-zinc-300 absolute top-10 left-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17ZM11 14V18H13V14H11Z"></path>
              </svg>
              <input
                id="senha"
                type={viewPW ? "text" : "password"}
                className="border border-zinc-300 bg-transparent text-lg py-1 pr-2 pl-7 outline-secondary text-black rounded-md"
              />
              {viewPW ? (
                <svg
                  onClick={() => setViewPW(!viewPW)}
                  className="h-fit w-4 fill-zinc-500 absolute top-10 cursor-pointer right-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                </svg>
              ) : (
                <svg
                  onClick={() => setViewPW(!viewPW)}
                  className="h-fit w-4 fill-zinc-500 absolute top-10 cursor-pointer right-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path>
                </svg>
              )}
            </label>
            <a
              className="flex gap-2 items-center font-medium text-zinc-500 cursor-pointer hover:text-blue-600"
              href="/reset-senha"
            >
              Esqueceu sua senha?
            </a>
            <button
              className={`py-2 text-white text-xl font-medium px-10 rounded-lg bg-primary w-fit`}
            >
              Avançar
            </button>
            <a
              href="assinar?acom=1"
              className="flex gap-2 items-center font-medium text-zinc-500 hover:text-blue-600"
            >
              Não tem uma conta? Registre-se
            </a>
          </form>
        </section>

        <section className="bg-gradient-to-t from-[#003447] to-[#0e7c71] relative flex items-center col-span-2 py-20 md:py-0">
          <h2 className="text-4xl md:text-6xl text-white font-semibold ml-10">
            Seja bem-vindo <br />
            à próxima geração <br />
            de anfitriões
          </h2>
        </section>
      </main>
    </div>
  );
}
