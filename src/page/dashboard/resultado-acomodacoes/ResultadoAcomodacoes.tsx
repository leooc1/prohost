import Select from "../../../components/dashboard/Select";

export default function ResultadoAcomodacoes() {
  return (
    <div>
      <section className="md:mx-8 mx-2 mb-4 grid grid-cols-3">
        <Select
          key={"filtro-acomodacao"}
          id="filtro-acomodacao"
          nome=""
          value={""}
          onChange={() => {}}
          options={[{ value: "", nome: "" }]}
          obrigatorio={false}
        />
      </section>
      <main className="md:px-8 px-2 grid grid-cols-1 md:grid-cols-3 gap-2 min-h-180">
        <div className="grid grid-rows-11 gap-2">
          <div className="bg-secondary row-span-3">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
        </div>
        <div className="grid grid-rows-11 md:col-span-2 gap-2">
          <div className="bg-secondary row-span-5">a</div>
          <div className="bg-secondary row-span-5">a</div>
          <div className="bg-secondary">a</div>
        </div>
      </main>
    </div>
  );
}
