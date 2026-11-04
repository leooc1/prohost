import Listagem from "../../../components/financeiro/Listagem";
import Select from "../../../components/reserva/Select";
import useReceitas from "./useReceitas";

export default function Receitas() {
  const { todasMovimentacoes } = useReceitas();
  return (
    <div>
      <section className="bg-white rounded-box p-4 md:mx-8 mx-2 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <Select
            key={"categoria-financeiro"}
            id="categoria-financeiro"
            nome="Categoria"
            value={""}
            onChange={() => {}}
            options={[{ value: "", nome: "" }]}
            obrigatorio={false}
          />
          <Select
            key={"acomodacao"}
            id="acomodacao"
            nome="Acomodação"
            value={""}
            onChange={() => {}}
            options={[{ value: "", nome: "" }]}
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
      </section>
      <main className="md:px-8 px-2">
        <Listagem movimentacao={todasMovimentacoes} />
      </main>
    </div>
  );
}
