import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboard from "../../public/tour/dash.jpeg";

export default function Tour() {
  const navigate = useNavigate();

  const bg = [
    dashboard,
    // "",
    // criarAcomodacao,
    // criarReserva,
    // financeiro,
    // relatorio,
  ];
  const [step, setStep] = useState<number>(5);

  useEffect(() => {
    const tour = window.localStorage.getItem("tour") || "true";
    if (!JSON.parse(tour)) setStep(-1);

    // alert(tour);

    const path = location.pathname;
    if (path === "/dashboard") setStep(0);
    else if (path === "/acomodacoes") setStep(1);
    else if (path === "/reservas") setStep(2);
    else if (path === "/movimentacoes") setStep(3);
    else if (path === "/relatorio") setStep(5);
    // else if (path === "/reservas") setStep(5);
  }, []);
  return (
    <div
      className={`fixed z-50 top-0 left-0 w-screen h-screen bg-black/5 ${step === -1 && "hidden"} transition-all duration-300 
      ${step !== 5 && "pointer-events-none"}
      `}
      style={{
        backgroundImage: `url(${bg[step]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {step === 0 && location.pathname === "/dashboard" && (
        <div className="pointer-events-auto md:scale-100 scale-75 absolute bg-white md:left-6 left-1/2 md:translate-x-0 -translate-x-1/2 bottom-6 flex flex-col gap-5 w-fit px-6 py-4 rounded-xl">
          <p className="text-3xl font-bold w-96">
            Sua operação organizada em um único lugar
          </p>
          <p className="w-96">
            O ProHost transforma reservas, hóspedes e movimentações financeiras
            em indicadores que ajudam você a tomar decisões melhores todos os
            dias
          </p>
          <ul className="flex flex-col gap-1">
            <li className="flex">
              <div className="w-5 h-5 bg-emerald-600 rounded-full mr-2"></div>
              <span>Taxa de ocupação</span>
            </li>
            <li className="flex">
              <div className="w-5 h-5 bg-emerald-600 rounded-full mr-2"></div>
              <span>Reservas por canal</span>
            </li>
            <li className="flex">
              <div className="w-5 h-5 bg-emerald-600 rounded-full mr-2"></div>
              <span>Receita e despesas</span>
            </li>
            <li className="flex">
              <div className="w-5 h-5 bg-emerald-600 rounded-full mr-2"></div>
              <span>Hóspedes</span>
            </li>
            <li className="flex">
              <div className="w-5 h-5 bg-emerald-600 rounded-full mr-2"></div>
              <span>Indicadores da acomodação</span>
            </li>
          </ul>
          <p className="text-center">
            Em poucos minutos você começa <br />a construir este painel
          </p>
          <div className="w-full flex justify-around">
            <button
              onClick={() => {
                {
                  setStep(step - 1);
                  window.localStorage.setItem("tour", "false");
                }
              }}
              className="border border-zinc-800 text-zinc-800 font-bold py-2 px-4 rounded-md"
            >
              Pular tour
            </button>
            <button
              onClick={() => {
                setStep(1);
                window.localStorage.setItem("tour", "1");
                navigate("/acomodacoes");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Vamos começar &rarr;
            </button>
          </div>
        </div>
      )}
      {(step === 1 || location.pathname === "/acomodacoes") && (
        <div className="pointer-events-auto md:scale-100 scale-75 absolute bg-white bottom-6 flex flex-col gap-5 md:w-3/5 w-full left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl -z-[100]">
          <p className="text-xl font-bold text-emerald-500">Passo 1 de 5</p>
          <p className="text-3xl font-bold">
            Cadastre sua primeira acomodação.
          </p>
          <div className="flex justify-between">
            <p className="w-[450px]">
              Toda operação começa pelos imóveis que você administra. <br />
              Depois de cadastrar sua primeira acomodação, o ProHost já estará
              pronto para acompanhar toda a operação.
            </p>
            <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex justify-center items-center">
              <svg
                className="w-14 h-14 fill-emerald-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20C20 20.5523 19.5523 21 19 21ZM13 19H18V9.15745L12 3.7029L6 9.15745V19H11V13H13V19Z"></path>
              </svg>
            </div>
          </div>
          <div className="w-full flex justify-end gap-4">
            <button
              onClick={() => {
                setStep(step - 1);
                navigate("/dashboard");
              }}
              className="border border-zinc-800 text-zinc-800 font-bold py-2 px-4 rounded-md"
            >
              Voltar
            </button>
            <button
              onClick={() => {
                setStep(2);
                window.localStorage.setItem("tour", "2");
                navigate("/reservas");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Próximo &rarr;
            </button>
          </div>
        </div>
      )}
      {step === 2 && location.pathname === "/reservas" && (
        <div className="pointer-events-auto md:scale-100 scale-75 absolute bg-white md:bottom-6 flex flex-col gap-5 md:w-3/5 w-full left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl">
          <p className="text-xl font-bold text-emerald-500">Passo 2 de 5</p>
          <p className="text-3xl font-bold">
            Traga suas reservas para o ProHost.
          </p>
          <div className="flex justify-between">
            <p className="w-[450px]">
              Vocẽ pode importar reservas do Airbnb e Booking
              <br />
              ou cadastrá-las manualmente. <br />
              Quanto mais informações você adicionar, mais
              <br />
              inteligente ficará seu painel.
            </p>
            <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex justify-center items-center mr-10">
              <svg
                className="w-14 h-14 fill-emerald-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
              </svg>
            </div>
          </div>
          <div className="w-full flex justify-end gap-4">
            <button
              onClick={() => {
                setStep(step - 1);
                window.localStorage.setItem("tour", "1");
                navigate("/acomodacoes");
              }}
              className="border border-zinc-800 text-zinc-800 font-bold py-2 px-4 rounded-md"
            >
              Voltar
            </button>
            <button
              onClick={() => {
                window.localStorage.setItem("tour", "3");
                navigate("/movimentacoes");
                setStep(3);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Próximo &rarr;
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="pointer-events-auto md:scale-100 scale-75 absolute bg-white bottom-6 flex flex-col gap-5 md:w-3/5 w-full left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl">
          <p className="text-xl font-bold text-emerald-500">Passo 3 de 5</p>
          <p className="text-3xl font-bold">
            Descubra quanto realmente sobra no seu bolso.
          </p>
          <div className="flex justify-between">
            <p className="w-[450px]">
              Cadastre receitas e despesas para acompanhar o lucro
              <br />
              de cada acomodação e tomar decisões com segurança.
            </p>
            <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex justify-center items-center mr-10">
              <svg
                className="w-14 h-14 fill-emerald-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.0049 22.0027C6.48204 22.0027 2.00488 17.5256 2.00488 12.0027C2.00488 6.4799 6.48204 2.00275 12.0049 2.00275C17.5277 2.00275 22.0049 6.4799 22.0049 12.0027C22.0049 17.5256 17.5277 22.0027 12.0049 22.0027ZM12.0049 20.0027C16.4232 20.0027 20.0049 16.421 20.0049 12.0027C20.0049 7.58447 16.4232 4.00275 12.0049 4.00275C7.5866 4.00275 4.00488 7.58447 4.00488 12.0027C4.00488 16.421 7.5866 20.0027 12.0049 20.0027ZM8.50488 14.0027H14.0049C14.281 14.0027 14.5049 13.7789 14.5049 13.5027C14.5049 13.2266 14.281 13.0027 14.0049 13.0027H10.0049C8.62417 13.0027 7.50488 11.8835 7.50488 10.5027C7.50488 9.12203 8.62417 8.00275 10.0049 8.00275H11.0049V6.00275H13.0049V8.00275H15.5049V10.0027H10.0049C9.72874 10.0027 9.50488 10.2266 9.50488 10.5027C9.50488 10.7789 9.72874 11.0027 10.0049 11.0027H14.0049C15.3856 11.0027 16.5049 12.122 16.5049 13.5027C16.5049 14.8835 15.3856 16.0027 14.0049 16.0027H13.0049V18.0027H11.0049V16.0027H8.50488V14.0027Z"></path>
              </svg>
            </div>
          </div>
          <div className="w-full flex justify-end gap-4">
            <button
              onClick={() => {
                setStep(step - 1);
                window.localStorage.setItem("tour", "2");
                navigate("/reservas");
              }}
              className="border border-zinc-800 text-zinc-800 font-bold py-2 px-4 rounded-md"
            >
              Voltar
            </button>
            <button
              onClick={() => {
                window.localStorage.setItem("tour", "4");
                navigate("/relatorio");
                setStep(4);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Próximo &rarr;
            </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="pointer-events-auto md:scale-100 scale-75 absolute bg-white top-6 flex flex-col gap-5 md:w-3/5 w-full left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl">
          <p className="text-xl font-bold text-emerald-500">Passo 4 de 5</p>
          <p className="text-3xl font-bold">
            Gere relatórios profissionais em segundos.
          </p>
          <div className="flex justify-between">
            <p className="w-[450px]">
              Crie relatórios personalisados e envie para proprietários <br />
              ou investidores com poucos cliques.
            </p>
            <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex justify-center items-center mr-10">
              <svg
                className="w-14 h-14 fill-emerald-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"></path>
              </svg>
            </div>
          </div>
          <div className="w-full flex justify-end gap-4">
            <button
              onClick={() => {
                setStep(step - 1);
                window.localStorage.setItem("tour", "3");
                navigate("/movimentacoes");
              }}
              className="border border-zinc-800 text-zinc-800 font-bold py-2 px-4 rounded-md"
            >
              Voltar
            </button>
            <button
              onClick={() => {
                // window.localStorage.setItem("tour", "5");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                setStep(5);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Próximo &rarr;
            </button>
          </div>
        </div>
      )}
      {step === 5 && (
        <>
          <div className="pointer-events-auto md:scale-100 scale-75 absolute bg-white left-1/2 -translate-x-1/2 top-6 flex flex-col gap-5 md:w-fit w-full px-6 py-4 rounded-xl">
            <p className="text-3xl font-bold w-[300px]">
              O ProHost vai muito <br />
              além do básico.
            </p>
            <p className="w-[300px]">
              Recursos que tornam sua operação <br /> mais eficiente e
              lucrativa.
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center">
                <div className="w-16 h-16 bg-purple-300/30 flex justify-center items-center rounded-full mr-4">
                  <svg
                    className="w-10 h-10 fill-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.4668 8.69379L20.7134 8.12811C21.1529 7.11947 21.9445 6.31641 22.9323 5.87708L23.6919 5.53922C24.1027 5.35653 24.1027 4.75881 23.6919 4.57612L22.9748 4.25714C21.9616 3.80651 21.1558 2.97373 20.7238 1.93083L20.4706 1.31953C20.2942 0.893489 19.7058 0.893489 19.5293 1.31953L19.2761 1.93083C18.8442 2.97373 18.0384 3.80651 17.0252 4.25714L16.308 4.57612C15.8973 4.75881 15.8973 5.35653 16.308 5.53922L17.0677 5.87708C18.0555 6.31641 18.8471 7.11947 19.2866 8.12811L19.5331 8.69379C19.7136 9.10792 20.2864 9.10792 20.4668 8.69379ZM5.79993 16H7.95399L8.55399 14.5H11.4459L12.0459 16H14.1999L10.9999 8H8.99993L5.79993 16ZM9.99993 10.8852L10.6459 12.5H9.35399L9.99993 10.8852ZM15 16V8H17V16H15ZM3 3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V11H20V19H4V5H14V3H3Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">IA para remoção de avaliações</p>
                  <span>
                    Conteste avaliações injustas com <br /> ajuda da nossa IA.
                  </span>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-16 h-16 bg-green-300/30 flex justify-center items-center rounded-full mr-4">
                  <svg
                    className="w-10 h-10 fill-emerald-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM4 5V19H20V7H11.5858L9.58579 5H4ZM11 9H13V17H11V9ZM15 12H17V17H15V12ZM7 14H9V17H7V14Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Dashboard automático</p>
                  <span>
                    Acompanhe todos os indicadores <br /> da sua operação em
                    tempo real.
                  </span>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-16 h-16 bg-blue-300/30 flex justify-center items-center rounded-full mr-4">
                  <svg
                    className="w-10 h-10 fill-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20C20 20.5523 19.5523 21 19 21ZM13 19H18V9.15745L12 3.7029L6 9.15745V19H11V13H13V19Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Gestão completa</p>
                  <span>
                    Controle multiplas acomodações, <br /> hóspedes, reservas e
                    finanças.
                  </span>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-16 h-16 bg-orange-300/30 flex justify-center items-center rounded-full mr-4">
                  <svg
                    className="w-10 h-10 fill-orange-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Relatórios profissionais</p>
                  <span>
                    Personalize e envie relatórios <br /> que impressionam.
                  </span>
                </div>
              </li>
            </ul>
            <div className="w-full flex flex-col justify-around gap-2">
              <button
                onClick={() => {
                  setStep(4);
                }}
                className="border border-zinc-800 text-zinc-800 font-bold py-2 px-4 rounded-md"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("tour", "false");
                  navigate("/acomodacoes");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Começar a usar o ProHost 🚀
              </button>
            </div>
          </div>
          <div className="absolute bg-white min-w-32 right-40 -top-8 md:scale-100 scale-75">
            <div className="text-9xl z-50 text-primary focus-point relative left-5">
              ➪
            </div>
            <div className="absolute md:left-1/2 md:-translate-x-1/2 md:mt-0 -mt-5 -left-28 bg-white px-3 p-1 rounded-lg">
              <p className="text-xl font-semibold whitespace-nowrap">
                Restaram dúvidas? <br className="hidden md:block" />
                Conclua o tour e acesse <br />o tutorial clicando no botão
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
