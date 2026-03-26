import { useContext, useEffect, useState } from "react";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Notify from "./notify/Notify";
import { ModalAlert } from "./ModalAlert";
import { ItemCategoria } from "./ItemCategoria";

interface CategoriaFinanceiro {
  id?: number;
  cor: string;
  editavel: boolean;
  nome: string;
  receita: boolean;
  tipo_despesa: string | null;
  saas: { id: number };
}

interface PendingCategoriaUpdate {
  id: number;
  body: Partial<CategoriaFinanceiro>;
  message: string;
}

export default function GerenciadorDeCategoria({ close, permissao }: { close: () => void; permissao: number; }) {
  const apiURL = import.meta.env.VITE_API_URL;
  const { dataToken } = useContext(SideBarContext);
  
  const [mov, setMov] = useState(false); // false = Receita, true = Despesa
  const [color, setColor] = useState<string>("#bdc3c7");
  const [receitas, setReceitas] = useState<CategoriaFinanceiro[]>([]);
  const [despesas, setDespesas] = useState<CategoriaFinanceiro[]>([]);
  
  const [notify, setNotify] = useState({ type: 1, text: "" });
  const [showNotify, setShowNotify] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<CategoriaFinanceiro | null>(null);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [modalAlertData, setModalAlertData] = useState<{ title: string; message: string; } | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<PendingCategoriaUpdate | null>(null);

  const formatTipoDespesa = (tipo: string | null | undefined) => tipo ?? "Sem tipo";

  // --- API CALLS ---
  const triggerNotify = (text: string, type: number = 1) => {
    setNotify({ type, text });
    setShowNotify(true);
    setTimeout(() => setShowNotify(false), 1500);
  };

  async function getCategorias() {
    if (!dataToken?.id) return;
    try {
      const response = await fetch(`${apiURL}/categoria_financeiro/${dataToken.id}`);
      const data: CategoriaFinanceiro[] = await response.json();
      setDespesas(data.filter((e) => !e.receita));
      setReceitas(data.filter((e) => e.receita));
      console.log(data.filter((e) => !e.receita)[0].tipo_despesa)
    } catch (err) { console.error("Erro ao buscar categorias", err); }
  }

  async function createCategoria() {
    const nomeInput = document.getElementById("new-cat-nome") as HTMLInputElement;
    const tipoInput = document.getElementById("new-cat-tipo") as HTMLSelectElement;
    
    if (!nomeInput.value.trim() || !dataToken?.id) return;

    const body: CategoriaFinanceiro = {
      cor: color,
      editavel: true,
      receita: !mov,
      nome: nomeInput.value,
      tipo_despesa: mov && tipoInput?.value !== "null" ? tipoInput.value : null,
      saas: { id: dataToken.id }
    };

    const response = await fetch(`${apiURL}/categoria_financeiro/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      triggerNotify("Categoria criada!");
      nomeInput.value = "";
      setColor("#bdc3c7");
      getCategorias();
    }
  }

  async function confirmUpdate() {
    if (!pendingUpdate) return;

    const response = await fetch(`${apiURL}/categoria_financeiro/${pendingUpdate.id}`, {
      method: "PUT",
      body: JSON.stringify(pendingUpdate.body),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.affected) {
      triggerNotify("Atualizado com sucesso!");
      getCategorias();
    }
    setPendingUpdate(null);
  }

  async function handleUpdate(id: number, pbody: Partial<CategoriaFinanceiro>) {
    const categoriaAtual = [...receitas, ...despesas].find((categoria) => categoria.id === id);

    if (!categoriaAtual) {
      setPendingUpdate({
        id,
        body: pbody,
        message: "Deseja confirmar a atualização desta categoria?",
      });
      return;
    }

    const alteracoes: string[] = [];

    if (categoriaAtual.nome !== pbody.nome) {
      alteracoes.push(`Nome: "${categoriaAtual.nome}" -> "${pbody.nome}"`);
    }

    if (categoriaAtual.cor !== pbody.cor) {
      alteracoes.push(`Cor: ${categoriaAtual.cor} -> ${pbody.cor}`);
    }

    if (categoriaAtual.tipo_despesa !== pbody.tipo_despesa) {
      alteracoes.push(
        `Tipo: ${formatTipoDespesa(categoriaAtual.tipo_despesa)} -> ${formatTipoDespesa(pbody.tipo_despesa)}`
      );
    }

    if (!alteracoes.length) {
      triggerNotify("Nenhuma alteração identificada.", 2);
      return;
    }

    setPendingUpdate({
      id,
      body: pbody,
      message: `Confirme a atualização da categoria "${categoriaAtual.nome}":\n\n${alteracoes.join("\n")}`,
    });
  }

  async function confirmDelete() {
    if (!categoriaToDelete?.id) return;
    const response = await fetch(`${apiURL}/categoria_financeiro/${categoriaToDelete.id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setModalAlertData({
        title: "Não é possível excluir",
        message: data.message === "CATEGORY_IN_USE" ? "Existem movimentações vinculadas a esta categoria." : "Erro interno."
      });
      setShowModalAlert(true);
    } else {
      triggerNotify("Excluído!");
      getCategorias();
    }
    setShowDeleteModal(false);
  }

  useEffect(() => { getCategorias(); }, [dataToken]);

  return (
    <div className="w-screen h-screen fixed z-50 top-0 left-0 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
      
      {showNotify && <Notify type={notify.type} text={notify.text} />}
      
      {showDeleteModal && (
        <ModalAlert
          title="Confirmar Exclusão"
          message={`Deseja excluir permanentemente "${categoriaToDelete?.nome}"?`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          confirmText="Excluir"
          colorButton="red"
        />
      )}

      {pendingUpdate && (
        <ModalAlert
          title="Confirmar Atualização"
          message={pendingUpdate.message+"\n\n(As alterações serão aplicadas imediatamente após a confirmação, para movimentações futuras. Movimentações passadas não serão alteradas)"}
          onClose={() => setPendingUpdate(null)}
          onConfirm={confirmUpdate}
          confirmText="Atualizar"
          cancelText="Cancelar"
          colorButton="blue"
        />
      )}

      {showModalAlert && modalAlertData && (
        <ModalAlert
          title={modalAlertData.title}
          message={modalAlertData.message}
          onClose={() => setShowModalAlert(false)}
          onConfirm={() => setShowModalAlert(false)}
          confirmText="Ok"
          cancelText=""
          colorButton="green"
        />
      )}

      <section className="relative z-10 bg-zinc-50 rounded-2xl shadow-2xl w-full max-w-[480px] flex flex-col max-h-[90vh] overflow-hidden">
        <header className="p-6 pb-2">
          <h2 className="text-2xl font-extrabold text-zinc-800">Gerenciar Categorias</h2>
          
          <div className="flex gap-4 mt-4 bg-zinc-200 p-1 rounded-xl w-fit">
            <button onClick={() => setMov(false)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${!mov ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>Receitas</button>
            <button onClick={() => setMov(true)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mov ? 'bg-white shadow-sm text-red-600' : 'text-zinc-500 hover:text-zinc-700'}`}>Despesas</button>
          </div>
        </header>

        <ul className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-300">
          {(mov ? despesas : receitas).length > 0 ? (
            (mov ? despesas : receitas).map((cat) => (
              <ItemCategoria
                key={cat.id}
                categoria={cat}
                permissao={permissao}
                isDespesa={mov}
                onUpdate={handleUpdate}
                onDelete={(c) => { setCategoriaToDelete(c as CategoriaFinanceiro); setShowDeleteModal(true); }}
              />
            ))
          ) : (
            <p className="text-center text-zinc-400 py-10 text-sm italic">Nenhuma categoria encontrada.</p>
          )}
        </ul>

        <footer className="p-6 bg-white border-t border-zinc-100 flex flex-col gap-4">
          <h4 className="font-bold text-zinc-700">Nova Categoria</h4>
          <div className="flex gap-2 items-end">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Nome</label>
              <input type="text" id="new-cat-nome" className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Manutenção" />
            </div>

            {mov && (
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Tipo</label>
                <select id="new-cat-tipo" className="border border-zinc-200 rounded-lg px-2 py-2 text-sm bg-zinc-50 outline-none">
                  <option value="Despesas do Negócio">Negócio</option>
                  <option value="Despesas Fixas">Fixas</option>
                  <option value="Despesas Variáveis">Variáveis</option>
                </select>
              </div>
            )}

            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 border-none rounded-lg cursor-pointer bg-transparent" title="Escolher cor" />
          </div>

          <button
            onClick={createCategoria}
            className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg shadow-zinc-200 active:scale-[0.98]"
          >
            Cadastrar Categoria
          </button>
        </footer>
      </section>
    </div>
  );
}
