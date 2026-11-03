import { CalendarCheck, List } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link, Outlet } from "react-router-dom";

export default function Financeiro() {
  const [pageActive, setPageActive] = useState<"todos" | "receita" | "despesa">(
    "todos",
  );

  useEffect(() => {
    console.log(location.pathname);
  }, []);

  return (
    <div className="min-h-dvh w-full py-20 bg-background">
      <Toaster />
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-semibold text-primary px-8">
          {pageActive === "todos"
            ? "Movimentações"
            : pageActive === "receita"
              ? "Receitas"
              : "Despesas"}
        </h1>
        <div className="flex justify-around gap-2 px-2">
          <div className="join flex flex-wrap">
            <Link
              onClick={() => setPageActive("todos")}
              to={"/financeiro"}
              className={`group hover:text-blue-500 btn lg:btn-md md:btn-sm btn-xs join-item ${pageActive ==='todos'?'text-blue-500':''}`}
            >
              Todas
            </Link>
            <Link
              onClick={() => setPageActive("receita")}
              to={"/financeiro/receita"}
              className={`group hover:text-blue-500 btn lg:btn-md md:btn-sm btn-xs join-item ${pageActive ==='receita'?'text-blue-500':''}`}
            >
              Receitas
            </Link>
            <Link
              onClick={() => setPageActive("despesa")}
              to={"/financeiro/despesa"}
              className={`group hover:text-blue-500 btn lg:btn-md md:btn-sm btn-xs join-item ${pageActive ==='despesa'?'text-blue-500':''}`}
            >
              Despesas
            </Link>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button className="btn lg:btn-md md:btn-sm btn-xs btn-outline">
              Gerenciar Categorias
            </button>
            <button className="btn lg:btn-md md:btn-sm btn-xs btn-success text-white">
              Nova Receita
            </button>
            <button className="btn lg:btn-md md:btn-sm btn-xs btn-error text-white">
              Nova Despesa
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
