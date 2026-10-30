import { useState } from "react";
import notImage from "../../../assets/not-image.jpg";
import Loading from "../../../components/loading/Loading";
import CalendarioReserva from "../../../components/reserva/calendario/CalendarioReservas";
import CardReserva from "../../../components/reserva/modal/CardReserva";
import Select from "../../../components/reserva/Select";
import useCalendario from "./useCalendario";

export default function Calendario() {
  const {
    todasAcomodacoes,
    mes,
    setMes,
    ano,
    setAno,
    initialDate,
    setInitialDate,
    todasReservas,
  } = useCalendario();

  const [idReserva, setIdReserva] = useState<number | null>(null);

  return (
    <div>
      <section className="flex gap-4 mb-4 items-center w-xs mx-auto">
        <CardReserva cancel={() => setIdReserva(null)} id={idReserva} />
        <Select
          key={"mes-calendario"}
          id="mes-calendario"
          nome="Mês"
          value={mes}
          onChange={setMes}
          options={[
            { value: "01", nome: "Janeiro" },
            { value: "02", nome: "Feveiro" },
            { value: "03", nome: "Março" },
            { value: "04", nome: "Abril" },
            { value: "05", nome: "Maio" },
            { value: "06", nome: "Junho" },
            { value: "07", nome: "Julho" },
            { value: "08", nome: "Agosto" },
            { value: "09", nome: "Setembro" },
            { value: "10", nome: "Outubro" },
            { value: "11", nome: "Novembro" },
            { value: "12", nome: "Dezembro" },
          ]}
          obrigatorio={false}
        />

        <Select
          key={"ano-calendario"}
          id="ano-calendario"
          nome="Ano"
          value={ano}
          onChange={setAno}
          options={Array.from(
            { length: new Date().getFullYear() - 2010 + 1 },
            (_, i) => new Date().getFullYear() + 1 - i,
          ).map((a) => ({ value: String(a), nome: String(a) }))}
          obrigatorio={false}
        />

        <button
          className="btn btn-sm btn-primary translate-y-3"
          onClick={() => setInitialDate(ano + "-" + mes + "-" + "01")}
        >
          Aplicar
        </button>
      </section>
      <main className="md:px-10 px-2">
        {todasAcomodacoes && todasReservas ? (
          <CalendarioReserva
            initialDate={initialDate}
            resources={todasAcomodacoes.map((a) => ({
              id: String(a.id),
              title: a.nome,
              image: a.foto ?? notImage,
            }))}
            events={todasReservas}
            onEventClick={(e) => {
              (
                document.getElementById(`card-reserva`) as HTMLDialogElement
              ).showModal();
              setIdReserva(Number(e.id));
            }}
          />
        ) : (
          <Loading />
        )}
      </main>
    </div>
  );
}
