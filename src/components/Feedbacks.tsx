import { useContext, useEffect, useState } from "react";
import { SideBarContext } from "../contexts/SideBarMenuContext";

const API_SHEETS_POST = import.meta.env.VITE_API_SHEETS_POST;
const API_SHEETS_GET = import.meta.env.VITE_API_SHEETS_GET;

export default function Feedbacks() {
  const { dataToken } = useContext(SideBarContext);
  const perguntas = [
    "O que você está achando do ProHost até agora?",
    "Teve alguma dificuldade em mexer na plataforma? Se sim qual?",
    "No que você acha que o ProHost pode te ajudar na sua operação de aluguel de temporada?",
    "Qual seria a sua sugestão de melhoria para nossa plataforma?",
  ];

  const [step, setStep] = useState(0);
  const [respondido, setRespondido] = useState(true);
  const [envioDesativado, setEnvioDesativado] = useState(false);
  const [form, setForm] = useState(["", "", "", ""]);

  async function getEmails() {
    try {
      const response = await fetch(API_SHEETS_GET, {
        method: "GET",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("Erro ao buscar emails:", error);
      throw error;
    }
  }

  async function handleSubmit() {
    try {
      const respostas = perguntas.map((pergunta, index) => ({
        nome: dataToken?.nome,
        email: dataToken?.email,
        pergunta: pergunta,
        resposta: form[index],
      }));
      // console.log(respostas);
      const response = await fetch(API_SHEETS_POST, {
        method: "POST",
        body: JSON.stringify(respostas),
      });

      const result = await response.json();
      // console.log(result);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log("Formulário enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      location.reload();
    }
  }

  useEffect(() => {
    async function carregarEmails() {
      if (localStorage.getItem("ph_r_fb_pu") === "true") {
        setRespondido(true);
        return;
      } else {
        try {
          const result = await getEmails();

          console.log(result);
          if (result && (result.emails as string[]).includes(dataToken.email)) {
            localStorage.setItem("ph_r_fb_pu", "true");
            setRespondido(true);
          } else {
            localStorage.setItem("ph_r_fb_pu", "false");
            setRespondido(false);
          }
        } catch (error) {
          console.error("Erro ao carregar emails:", error);
        }
      }
    }

    carregarEmails();
  }, [respondido, dataToken]);

  return (
    <>
      {!respondido && (
        <div className="fixed w-screen h-screen left-0 top-0 z-50 flex items-center justify-center bg-black/50">
          <div className="border border-primary p-2 bg-slate-300 rounded-2xl md:w-3/5 w-4/5 h-min flex flex-col gap-5">
            {perguntas.map((pergunta, index) => (
              <section
                className={`flex flex-col items-center gap-5 ${index === step ? "block" : "hidden"}`}
                key={index}
              >
                <p className="text-center md:text-2xl text-xl">{pergunta}</p>
                <textarea
                  onChange={(e) =>
                    setForm((prev) =>
                      prev.map((item, index) =>
                        index === step ? e.target.value : item,
                      ),
                    )
                  }
                  className="border border-primary rounded-md md:w-4/5 w-full resize-none h-40 p-2 "
                ></textarea>
              </section>
            ))}
            <section
              className={`grid ${step > 0 ? "grid-cols-2" : "grid-cols-1"} gap-5`}
            >
              {step > 0 && (
                <button
                  onClick={() => {
                    const textarea = document.querySelectorAll("textarea");
                    textarea.forEach((ta) => {
                      ta.classList.remove("border-red-400");
                      ta.classList.add("border-primary");
                    });
                    setStep(step - 1);
                  }}
                  className="border border-primary p-2 bg-slate-500 text-white text-xl rounded-2xl w-4/5 mx-auto"
                >
                  Voltar
                </button>
              )}
              {step < perguntas.length - 1 && (
                <button
                  onClick={async () => {
                    if (form[step].length) {
                      const textarea = document.querySelectorAll("textarea");
                      textarea.forEach((ta) => {
                        ta.classList.remove("border-red-400");
                        ta.classList.add("border-primary");
                      });
                      setStep(step + 1);
                    } else {
                      const textarea = document.querySelectorAll("textarea");
                      textarea.forEach((ta) => {
                        ta.classList.add("border-red-400");
                        ta.classList.remove("border-primary");
                      });
                    }
                  }}
                  className="border border-primary p-2 bg-slate-500 text-white text-xl rounded-2xl w-4/5 mx-auto"
                >
                  Avançar
                </button>
              )}
              {step === perguntas.length - 1 && (
                <button
                  onClick={() => {
                    setEnvioDesativado(true);
                    if (form[step].length) {
                      const textarea = document.querySelectorAll("textarea");
                      textarea.forEach((ta) => {
                        ta.classList.remove("border-red-400");
                        ta.classList.add("border-primary");
                      });
                      handleSubmit();
                    } else {
                      const textarea = document.querySelectorAll("textarea");
                      textarea.forEach((ta) => {
                        ta.classList.add("border-red-400");
                        ta.classList.remove("border-primary");
                      });
                    }
                  }}
                  disabled={envioDesativado}
                  className={`order border-primary p-2 bg-slate-500 text-white text-xl rounded-2xl w-4/5 mx-auto ${envioDesativado?'cursor-not-allowed':''}`}
                >
                  Concluir!
                </button>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
