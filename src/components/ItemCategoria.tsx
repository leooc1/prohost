import { useState } from "react";

interface CategoriaFinanceiro {
    id?: number;
    cor: string;
    editavel: boolean;
    nome: string;
    receita: boolean;
    tipo_despesa: string | null;
}

interface UpdateCategoriaProps {
    categoria: CategoriaFinanceiro;
    permissao: number;
    isDespesa: boolean;
    onUpdate: (id: number, pbody: any) => void;
    onDelete: (cat: CategoriaFinanceiro) => void;
}

export function ItemCategoria({
    categoria,
    permissao,
    isDespesa,
    onUpdate,
    onDelete,
}: UpdateCategoriaProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState({
        nome: categoria.nome,
        cor: categoria.cor,
        tipo_despesa: categoria.tipo_despesa,
    });

    const canEdit = categoria.editavel && permissao >= 3;

    const handleSave = () => {
        onUpdate(categoria.id!, {
            cor: tempData.cor,
            nome: tempData.nome,
            tipo_despesa: isDespesa ? tempData.tipo_despesa : null,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempData({
            nome: categoria.nome,
            cor: categoria.cor,
            tipo_despesa: categoria.tipo_despesa,
        });
        setIsEditing(false);
    };

    return (
        <li
            className={`flex items-center border pr-2 py-2 rounded-md pl-4 gap-3 transition-all ${isEditing ? "border-primary bg-zinc-50" : "border-zinc-200"
                }`}
        >
            {/* Container da Bolinha de Cor */}
            <div className="relative flex items-center justify-center">
                <label
                    className={`w-6 h-6 rounded-full border border-zinc-300 transition-all ${isEditing
                            ? "cursor-pointer hover:scale-110 shadow-md"
                            : "cursor-default"
                        }`}
                    style={{
                        backgroundColor: tempData.cor, // A cor da bolinha vem daqui
                        display: "block",
                    }}
                >
                    {/* O input fica invisível e sem tamanho, mas funcional */}
                    <input
                        type="color"
                        value={tempData.cor}
                        disabled={!isEditing}
                        onChange={(e) => setTempData({ ...tempData, cor: e.target.value })}
                        className="sr-only" // Classe do Tailwind para esconder visualmente mas manter acessível
                    />
                </label>
            </div>

            <section className="flex-1 flex flex-col gap-1">
                {/* Nome: Habilitado apenas em edição */}
                <input
                    type="text"
                    value={tempData.nome}
                    disabled={!isEditing}
                    onChange={(e) => setTempData({ ...tempData, nome: e.target.value })}
                    className={`outline-none px-1.5 text-md font-semibold w-full rounded transition-colors ${isEditing
                            ? "bg-white border border-zinc-300"
                            : "bg-transparent border-none"
                        }`}
                />

                {isDespesa && (
                    <select
                        disabled={!isEditing}
                        value={tempData.tipo_despesa || "null"}
                        onChange={(e) =>
                            setTempData({
                                ...tempData,
                                tipo_despesa: e.target.value !== "null" ? e.target.value : null,
                            })
                        }
                        className={`text-xs rounded px-1 py-0.5 outline-none transition-colors ${isEditing
                                ? "bg-white border border-zinc-300"
                                : "bg-transparent border-none text-zinc-500"
                            }`}
                    >
                        <option value="Despesas do Negócio">Despesas do Negócio</option>
                        <option value="Despesas Fixas">Despesas Fixas</option>
                        <option value="Despesas Variáveis">Despesas Variáveis</option>
                    </select>
                )}
            </section>

            <div className="flex gap-2 items-center">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="text-lg hover:scale-110"
                            title="Salvar"
                        >
                            ✅
                        </button>
                        <button
                            onClick={handleCancel}
                            className="text-lg hover:scale-110"
                            title="Cancelar"
                        >
                            ❌
                        </button>
                    </>
                ) : (
                    <>
                        {canEdit && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="hover:bg-zinc-100 p-1 rounded"
                                title="Editar"
                            >
                                ✏️
                            </button>
                        )}
                        {/* Lixeira: desabilitada/oculta durante a edição conforme seu plano */}
                        {categoria.editavel && permissao >= 4 && (
                            <button
                                onClick={() => onDelete(categoria)}
                                className="p-1 hover:bg-red-50 rounded"
                                title="Excluir"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="rgba(255,109,109,1)"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                                </svg>
                            </button>
                        )}
                    </>
                )}
            </div>
        </li>
    );
}
