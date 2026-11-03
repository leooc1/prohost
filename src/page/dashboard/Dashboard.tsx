import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link, Outlet } from "react-router-dom";
import Select from "../../components/dashboard/Select";

export default function Dashboard() {
  const [pageActive, setPageActive] = useState<
    "indicadores-operacionais" | "resultado-acomodacoes" | "resultado-gestor"
  >(
    location.pathname === "/dashboard/resultado-acomodacoes"
      ? "resultado-acomodacoes"
      : location.pathname === "/dashboard/resultado-gestor"
        ? "resultado-gestor"
        : "indicadores-operacionais",
  );

  return (
    <div className="min-h-dvh w-full py-20 bg-background">
      <Toaster />
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="text-3xl font-semibold text-primary px-8">
          {pageActive === "indicadores-operacionais"
            ? "Indicadores Operacionais"
            : pageActive === "resultado-acomodacoes"
              ? "Resultados das Acomodações"
              : "Resultados do Gestor"}
        </h1>
        <div className="flex justify-center gap-2 px-2">
          <div className="join flex flex-wrap justify-center">
            <Link
              onClick={() => setPageActive("indicadores-operacionais")}
              to={"/dashboard/indicadores-operacionais"}
              className={`group hover:text-blue-500 btn lg:btn-md md:btn-sm btn-xs join-item ${pageActive === "indicadores-operacionais" ? "text-blue-500" : ""}`}
            >
              Indicadores Operacionais
            </Link>
            <Link
              onClick={() => setPageActive("resultado-acomodacoes")}
              to={"/dashboard/resultado-acomodacoes"}
              className={`group hover:text-blue-500 btn lg:btn-md md:btn-sm btn-xs join-item ${pageActive === "resultado-acomodacoes" ? "text-blue-500" : ""}`}
            >
              Resultados das Acomodações
            </Link>
            <Link
              onClick={() => setPageActive("resultado-gestor")}
              to={"/dashboard/resultado-gestor"}
              className={`group hover:text-blue-500 btn lg:btn-md md:btn-sm btn-xs join-item ${pageActive === "resultado-gestor" ? "text-blue-500" : ""}`}
            >
              Resultados do Gestor
            </Link>
          </div>
        </div>
        <section className="md:mx-8 mx-2 mb-4 grid grid-cols-3">
          <Select
            key={"periodo-analise"}
            id="periodo-analise"
            nome="Período de Análise"
            value={""}
            onChange={() => {}}
            options={[{ value: "", nome: "" }]}
            obrigatorio={false}
          />
        </section>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}
