import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import CardAcomodacao from '../../components/acomodacao/card/CardAcomodacao';
import CriarAcomodacao from '../../components/acomodacao/criar/CriarAcomodacao';
import Loading from '../../components/loading/Loading';
import useAcomodacao from './useAcomodacao';

export default function Acomodacao() {
  const { todasAcomodacoes, toggleActive, deleteAcomodacao, getAcomodacao } =
    useAcomodacao();
  useEffect(() => {}, [todasAcomodacoes]);

  return (
    <div className="min-h-dvh w-full py-20 bg-background">
      <Toaster />
      <div className="flex justify-between px-8">
        <h1 className="text-3xl font-semibold text-primary mb-8">Acomodações</h1>
        <div>
          <CriarAcomodacao atualizar={getAcomodacao} />
        </div>
      </div>
      {!todasAcomodacoes ? (
        <Loading />
      ) : todasAcomodacoes.proprio.length > 0 ||
        todasAcomodacoes.terceiro.length > 0 ||
        todasAcomodacoes.desativado.length > 0 ? (
        <main className="flex flex-col gap-8">
          {/* proprio */}
          <section className="px-8 flex flex-col gap-4">
            <h2 className="text-2xl font-medium text-primary">
              Próprios ({todasAcomodacoes.proprio.length})
            </h2>
            <ul className="flex gap-4 overflow-x-scroll">
              {todasAcomodacoes.proprio.map((a) => (
                <CardAcomodacao
                  buscarAcomodacoes={getAcomodacao}
                  id={a.id}
                  key={a.id}
                  nome={a.nome}
                  tipo={a.tipo}
                  desativado={a.desativado}
                  img={a.foto}
                  toggleActive={toggleActive}
                  delete={deleteAcomodacao}
                />
              ))}
            </ul>
          </section>
          {/* terceiro */}
          <section className="px-8 flex flex-col gap-4">
            <h2 className="text-2xl font-medium text-primary">
              Terceiros ({todasAcomodacoes.terceiro.length})
            </h2>
            <ul className="flex gap-4 overflow-x-scroll">
              {todasAcomodacoes.terceiro.map((a) => (
                <CardAcomodacao
                  buscarAcomodacoes={getAcomodacao}
                  id={a.id}
                  key={a.id}
                  nome={a.nome}
                  tipo={a.tipo}
                  desativado={a.desativado}
                  img={a.foto}
                  toggleActive={toggleActive}
                  delete={deleteAcomodacao}
                />
              ))}
            </ul>
          </section>
          {/* desativado */}
          <section className="px-8 flex flex-col gap-4">
            <h2 className="text-2xl font-medium text-primary">
              Suspensos ({todasAcomodacoes.desativado.length})
            </h2>
            <ul className="flex gap-4 overflow-x-scroll">
              {todasAcomodacoes.desativado.map((a) => (
                <CardAcomodacao
                  id={a.id}
                  key={a.id}
                  nome={a.nome}
                  tipo={a.tipo}
                  desativado={a.desativado}
                  img={a.foto}
                  toggleActive={toggleActive}
                  delete={deleteAcomodacao}
                />
              ))}
            </ul>
          </section>
        </main>
      ) : (
        <main className="flex flex-col items-center justify-center px-4 pt-4">
          <div className="bg-zinc-300 md:text-3xl text-2xl px-4 py-8 rounded-xl shadow-md shadow-primary text-center text-primary font-medium">
            Cadastre sua primeira acomodação e tenha total controle das suas
            reservas e ganhos. 🚀
          </div>
        </main>
      )}
    </div>
  );
}
