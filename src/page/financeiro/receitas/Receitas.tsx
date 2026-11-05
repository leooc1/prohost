import { useState } from "react";
import Listagem from "../../../components/financeiro/Listagem";
import Select from "../../../components/utils/Select";
import useReceitas from "./useReceitas";
import PeriodoPersonalizado from "../../../components/utils/PeriodoPersonalizado";

export default function Receitas() {
  const { todasMovimentacoes, periodo, setPeriodo, setDataInicio, setDataFim } =
    useReceitas();
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterAcomodacao, setFilterAcomodacao] = useState("all");
  const categorias = new Set(
    todasMovimentacoes.map((m) => m.categoria),
  ) as Set<string>;
  const acomodacoes = new Set(
    todasMovimentacoes.map((m) => m.acomodacao),
  ) as Set<string>;
  return (
    <div>
      <section className="bg-white rounded-box p-4 md:mx-8 mx-2 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <Select
            key={"categoria-financeiro"}
            id="categoria-financeiro"
            nome="Categoria"
            value={filterCategoria}
            onChange={setFilterCategoria}
            options={[
              { value: "all", nome: "Todas" },
              ...Array.from(categorias).map((c) => ({ value: c, nome: c })),
            ]}
            obrigatorio={false}
          />
          <Select
            key={"acomodacao"}
            id="acomodacao"
            nome="Acomodação"
            value={filterAcomodacao}
            onChange={setFilterAcomodacao}
            options={[
              { value: "all", nome: "Todas" },
              ...Array.from(acomodacoes)
                .filter((a) => a !== "")
                .map((a) => ({ value: a, nome: a })),
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
      </section>
      <main className="md:px-8 px-2">
        <Listagem
          movimentacao={todasMovimentacoes
            .filter(
              (m) =>
                m.categoria === filterCategoria || filterCategoria === "all",
            )
            .filter(
              (m) =>
                m.acomodacao == filterAcomodacao || filterAcomodacao === "all",
            )}
        />
      </main>
    </div>
  );
}
