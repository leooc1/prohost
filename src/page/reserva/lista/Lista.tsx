import Listagem from '../../../components/reserva/lista/Listagem';
import Select from '../../../components/reserva/Select';
import useLista from './useLista';

export default function Lista() {
  const { todasReservas } = useLista();
  console.log(todasReservas);
  return (
    <div>
      <section className="bg-white rounded-box p-4 md:mx-8 mx-2 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <Select
            key={'canal-reserva'}
            id="canal-reserva"
            nome="Canal"
            value={''}
            onChange={() => {}}
            options={[{ value: '', nome: '' }]}
            obrigatorio={false}
          />
          <Select
            key={'tipo-reserva'}
            id="tipo-reserva"
            nome="Tipo de Reserva"
            value={''}
            onChange={() => {}}
            options={[{ value: '', nome: '' }]}
            obrigatorio={false}
          />
          <Select
            key={'periodo-analise'}
            id="periodo-analise"
            nome="Período de Análise"
            value={''}
            onChange={() => {}}
            options={[{ value: '', nome: '' }]}
            obrigatorio={false}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Select
            key={'acomodacao'}
            id="acomodacao"
            nome="Acomodação"
            value={''}
            onChange={() => {}}
            options={[{ value: '', nome: '' }]}
            obrigatorio={false}
          />
          <Select
            key={'ordenar-por'}
            id="ordenar-por"
            nome="Ordenar por:"
            value={''}
            onChange={() => {}}
            options={[{ value: '', nome: '' }]}
            obrigatorio={false}
          />
          <Select
            key={'classificar-por'}
            id="classificar-por"
            nome="Classificar por:"
            value={''}
            onChange={() => {}}
            options={[{ value: '', nome: '' }]}
            obrigatorio={false}
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Select
            key={'canal-reserva'}
            id="canal-reserva"
            nome="Canal"
            value={''}
            onChange={() => {}}
            options={[{ value: '', nome: '' }]}
            obrigatorio={false}
          />
        </div>
      </section>
      <main className="md:px-8 px-2">
        <Listagem reservas={todasReservas} />
      </main>
    </div>
  );
}
