import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ListaReservaR from "../ListaReservaR";
import ph from "/prohost-logo.png";

type DetalheReservaProps = {
  imagem?: string;
  editPages: boolean[];
  setEditPages: Dispatch<SetStateAction<boolean[]>>;
  cores: {
    primario: string;
    letra: string;
  };
  saas: number;
  dataIni: string;
  dataFim: string;
  acomodacao: number;
  onDataLoaded?: (hasReservations: boolean) => void;
};

export default function DetalheReserva(props: DetalheReservaProps) {
  const apiURL = import.meta.env.VITE_API_URL;
  const [dados, setDados] = useState<any>(null);

  async function getDados() {
    await fetch(
      `${apiURL}/relatorio/detalhe/${props.saas}/${props.dataIni}/${props.dataFim}/${props.acomodacao}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setDados(data);
        props.onDataLoaded?.(
          Array.isArray(data?.reservas) && data.reservas.length > 0,
        );
      });
  }

  useEffect(() => {
    getDados();
  }, []);

  return (
    <div className={`relative ${!props.editPages[1] && "opacity-30"}`}>
      <button
        onClick={() => {
          let error = props.editPages;
          error = error.map((e, i) => (i === 1 ? !e : e));
          props.setEditPages(error);
        }}
        className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${props.editPages[1] ? "bg-red-300" : "bg-green-300"} rounded-lg pointer-events-auto`}
      >
        {props.editPages[1] ? "Ocultar no relatório" : "Mostrar no relatório"}
      </button>
      {dados ? (
        <section
          style={{ backgroundColor: props.cores.primario }}
          id="detalhamento-reservas"
          className={`${!props.editPages[1] && "pointer-events-none opacity-30"} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}
        >
          <div
            onClick={() => {
              const logos = document.querySelectorAll(".logo-ph");
              if (logos[0].classList.contains("opacity-30"))
                logos.forEach((l) => {
                  l.classList.remove("opacity-30");
                  l.classList.add("opacity-100");
                });
              else
                logos.forEach((l) => {
                  l.classList.remove("opacity-100");
                  l.classList.add("opacity-30");
                });
            }}
            className="flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer"
          >
            <img src={ph} alt="" className="w-4 h-fit drop-shadow" />
            <p className="text-white font-bold text-lg tracking-tight">
              prohost
            </p>
          </div>
          <p
            style={{ color: props.cores.letra }}
            className={`text-3xl text-[${props.cores.letra}]`}
          >
            Detalhamento de reservas
          </p>
          <div className="flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8">
            <div
              style={{ backgroundColor: props.cores.primario }}
              className={`w-full h-px bg-[${props.cores.primario}]`}
            ></div>
            <img
              src={props.imagem}
              alt=""
              className="bg-primary max-w-56 max-h-28 h-28"
            />
          </div>
          <section className="h-full flex items-center">
            <ListaReservaR reservas={dados.reservas} />
          </section>
        </section>
      ) : (
        <section
          style={{ backgroundColor: props.cores.primario }}
          id="calendario"
          className={`${!props.editPages[0] && "pointer-events-none opacity-30"} flex flex-col justify-center items-center text-white p-10 h-screen bg-[${props.cores.primario}] relative`}
        >
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </section>
      )}
    </div>
  );
}
