import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Listagem from "../../../components/reserva/lista/Listagem";
import Select from "../../../components/utils/Select";
import useLista from "./useLista";
import PeriodoPersonalizado from "../../../components/utils/PeriodoPersonalizado";
import type { ReservaOutletContext } from "../Reserva";

export default function Lista() {
  const { refreshKey, atualizarReservas } =
    useOutletContext<ReservaOutletContext>();
  const { todasReservas, periodo, setPeriodo, setDataInicio, setDataFim } =
    useLista(refreshKey);
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
  const [orderBy, setOrderBy] = useState("checkIn");
  const [orderDir, setOrderDir] = useState("asc");

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
            value={periodo}
            onChange={setPeriodo as (value: string) => void}
            options={[
              { value: "mes-atual", nome: "Mês Atual" },
              { value: "mes-anterior", nome: "Mês Anterior" },
              { value: "ano-atual", nome: "Ano Atual" },
              { value: "ano-anterior", nome: "Ano Anterior" },
              { value: "personalizado", nome: "Personalizado" },
            ]}
            obrigatorio={false}
          />
          {periodo === "personalizado" && (
            <PeriodoPersonalizado
              setDataInicio={setDataInicio}
              setDataFim={setDataFim}
            />
          )}
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
            value={orderBy}
            onChange={setOrderBy}
            options={[
              { value: "checkIn", nome: "Check-in" },
              { value: "checkOut", nome: "Check-out" },
              { value: "valor", nome: "Valor" },
              { value: "valorLiq", nome: "Valor Liquido" },
              { value: "diarias", nome: "Diárias" },
              { value: "qtdHospede", nome: "Quantidade de Hóspedes" },
            ]}
            obrigatorio={false}
          />
          <Select
            key={"classificar-por"}
            id="classificar-por"
            nome="Classificar por:"
            value={orderDir}
            onChange={setOrderDir}
            options={[
              { value: "asc", nome: "Crescente" },
              { value: "desc", nome: "Decrescente" },
            ]}
            obrigatorio={false}
          />
        </div>
      </section>
      <main className="md:px-8 px-2">
        <Listagem
          aoAtualizar={atualizarReservas}
          reservas={todasReservas
            .filter(
              (r) => r.canalReserva === filterCanais || filterCanais === "all",
            )
            .filter(
              (r) =>
                r.tipoReserva === filterTipoReserva ||
                filterTipoReserva === "all",
            )
            .filter(
              (r) =>
                r.acomodacao === filterAcomodacao || filterAcomodacao === "all",
            )
            .sort((a, b) => {
              const aValue = a[orderBy as keyof typeof a];
              const bValue = b[orderBy as keyof typeof b];

              if (orderBy === "checkIn" || orderBy === "checkOut") {
                const aDate = new Date((aValue as string).split("/").reverse().join("-"));
                const bDate = new Date((bValue as string).split("/").reverse().join("-"));
                return orderDir === "asc"
                  ? aDate.getTime() - bDate.getTime()
                  : bDate.getTime() - aDate.getTime();
              } else if (orderBy === "valor" || orderBy === "valorLiq") {
                const aNumber = parseFloat(
                  ((aValue ?? "0") as string).replace(/\D/g, ""),
                );
                const bNumber = parseFloat(
                  ((bValue ?? "0") as string).replace(/\D/g, ""),
                );
                return orderDir === "asc"
                  ? aNumber / 100 - bNumber / 100
                  : bNumber / 100 - aNumber / 100;
              } else if (orderBy === "diarias" || orderBy === "qtdHospede") {
                const aNumber = aValue as number;
                const bNumber = bValue as number;
                return orderDir === "asc"
                  ? aNumber - bNumber
                  : bNumber - aNumber;
              }
              return 0;
            })}
        />
      </main>
    </div>
  );
}
