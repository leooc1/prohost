import { useState } from "react";
import Listagem from "../../../components/reserva/lista/Listagem";
import Select from "../../../components/utils/Select";
import useLista from "./useLista";

export default function Lista() {
  const { todasReservas, periodo, setPeriodo, setDataInicio, setDataFim } =
    useLista();
  const acomodacoes = new Set(
    todasReservas.map((r) => r.acomodacao),
  ) as Set<string>;
  const canais = new Set(
    todasReservas.map((r) => r.canalReserva),
  ) as Set<string>;
  const tiposReserva = new Set(
    todasReservas.map((r) => r.tipoReserva),
  ) as Set<string>;
  const [filterCanais, setFilterCanais] = useState("all");
  const [filterAcomodacao, setFilterAcomodacao] = useState("all");
  const [filterTipoReserva, setFilterTipoReserva] = useState("all");

  return (
    <div>
      <section className="bg-white rounded-box p-4 md:mx-8 mx-2 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <Select
            key={"canal-reserva"}
            id="canal-reserva"
            nome="Canal"
            value={filterCanais}
            onChange={setFilterCanais}
            options={[
              { value: "all", nome: "Todas" },
              ...Array.from(canais)
                .filter(
                  (c) => c !== "Indisponibilidade" && c !== "Continuidade",
                )
                .map((c) => ({ value: c, nome: c })),
            ]}
            obrigatorio={false}
          />
          <Select
            key={"tipo-reserva"}
            id="tipo-reserva"
            nome="Tipo de Reserva"
            value={filterTipoReserva}
            onChange={setFilterTipoReserva}
            options={[
              { value: "all", nome: "Todas" },
              ...Array.from(tiposReserva).map((t) => ({ value: t, nome: t })),
            ]}
            obrigatorio={false}
          />
          <Select
            key={"periodo-analise"}
            id="periodo-analise"
            nome="Período de Análise"
            value={""}
            onChange={() => {}}
            options={[{ value: "", nome: "" }]}
            obrigatorio={false}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Select
            key={"acomodacao"}
            id="acomodacao"
            nome="Acomodação"
            value={filterAcomodacao}
            onChange={setFilterAcomodacao}
            options={[
              { value: "all", nome: "Todas" },
              ...Array.from(acomodacoes).map((a) => ({ value: a, nome: a })),
            ]}
            obrigatorio={false}
          />
          <Select
            key={"ordenar-por"}
            id="ordenar-por"
            nome="Ordenar por:"
            value={""}
            onChange={() => {}}
            options={[{ value: "", nome: "" }]}
            obrigatorio={false}
          />
          <Select
            key={"classificar-por"}
            id="classificar-por"
            nome="Classificar por:"
            value={""}
            onChange={() => {}}
            options={[{ value: "", nome: "" }]}
            obrigatorio={false}
          />
        </div>
      </section>
      <main className="md:px-8 px-2">
        <Listagem reservas={todasReservas
          .filter(r=>r.canalReserva === filterCanais || filterCanais === "all")
          .filter(r=>r.tipoReserva === filterTipoReserva || filterTipoReserva === "all")
          .filter(r=>r.acomodacao === filterAcomodacao || filterAcomodacao === "all")
          } />
      </main>
    </div>
  );
}
