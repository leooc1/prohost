import { useContext, useEffect, useState } from "react";
import CadastrarAcomodacao from "../components/CadastrarAcomodacao";
import Loader from "../components/Loader";
import SemPermissao from "../components/SemPermissao";
import Notify from "../components/notify/Notify";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import { ModalAlert } from "../components/ModalAlert";

// dnd-kit
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Acomodacao {
  id: number;
  tipo: string;
  comissao: number;
  data_ini_ope: string;
  descricao: string;
  endereco: string;
  check_in_p: string;
  check_out_p: string;
  foto: string;
  nome: string;
  numero_hospedes: number;
  valor_imovel: number;
  desativado: boolean;
  saas: { id: number };
}

// 🔹 Item arrastável
function SortableItem({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
  };

  // O children esperado é o <li> do card
  // Vamos clonar o elemento e inserir o handle no canto superior esquerdo
  return (
    <div ref={setNodeRef} style={style}>
      {children && typeof children === "object" && "type" in children ? (
        // Clona o <li> e insere o handle no canto superior esquerdo
        <children.type {...children.props}>
          <div
            {...attributes}
            {...listeners}
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 2,
              width: 28,
              height: 28,
              background: "#e5e7eb", // gray-200
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isDragging ? "0 0 0 2px #888" : undefined,
              cursor: "grab",
              border: "1px solid #d1d5db",
            }}
            title="Arraste para ordenar"
          >
            {/* Ícone de mão estilizado */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 11V5a2 2 0 0 1 4 0v6" />
              <path d="M11 10V4a2 2 0 0 1 4 0v7" />
              <path d="M15 11V7a2 2 0 0 1 4 0v8a5 5 0 0 1-10 0v-3" />
            </svg>
          </div>
          {children.props.children}
        </children.type>
      ) : (
        children
      )}
    </div>
  );
}

export default function Acomodacoes() {
  const apiURL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    document.title = "Acomodações | Prohost";
  }, []);

  const { statusData, dataToken } = useContext(SideBarContext);
  const [loaded, setLoaded] = useState(false);
  const [cadastrarAcomodacao, setCadastrarAcomodacao] = useState(false);
  const [proprio, setProprio] = useState<Acomodacao[]>([]);
  const [terceiro, setTerceiro] = useState<Acomodacao[]>([]);
  const [desativados, setDesativados] = useState<Acomodacao[]>([]);
  const [notify, setNotify] = useState({ type: 1, text: "Criado!" });
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [verifyAcomodacao, setVerifyAcomodacao] = useState<boolean>(false);
  const [showSuspenderModal, setShowSuspenderModal] = useState(false);
  const [acomodacaoToSuspender, setAcomodacaoToSuspender] =
    useState<Acomodacao | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [acomodacaoToDelete, setAcomodacaoToDelete] =
    useState<Acomodacao | null>(null);

  function abrirModalSuspender(acomodacao: Acomodacao) {
    setAcomodacaoToSuspender(acomodacao);
    setShowSuspenderModal(true);
  }

  function fecharModalSuspender() {
    setShowSuspenderModal(false);
    setAcomodacaoToSuspender(null);
  }

  async function confirmarSuspensao() {
    if (!acomodacaoToSuspender) return;

    await desativar(acomodacaoToSuspender.id, true);
    fecharModalSuspender();
  }

  function abrirModalExclusao(acomodacao: Acomodacao) {
    setAcomodacaoToDelete(acomodacao);
    setShowDeleteModal(true);
  }

  function fecharModalExclusao() {
    setShowDeleteModal(false);
    setAcomodacaoToDelete(null);
  }

  async function confirmarExclusao() {
    if (!acomodacaoToDelete) return;

    await deletarAcomodacao(acomodacaoToDelete.id);
    fecharModalExclusao();
  }
  async function acomodacoes() {
    await fetch(`${apiURL}/acomodacao/` + dataToken.id, {
      method: "GET",
    })
      .then((data) => data.json())
      .then(async (data: Acomodacao[]) => {
        const storage = localStorage.getItem("order_ac");
        let orderMap: any = null;

        if (storage) {
          const store: [string, any][] = JSON.parse(storage || "[]");
          const found = store.find((item) => item[0] === dataToken.id);
          if (found) {
            orderMap = found[1];
          }
        }

        // 🔹 Filtra normalmente
        let proprioList: any = data.filter(
          (e) => e.tipo == "proprio" && !e.desativado,
        );
        let terceiroList: any = data.filter(
          (e) => e.tipo == "terceiro" && !e.desativado,
        );
        let desativadoList: any = data.filter((e) => e.desativado);

        // 🔹 Reordena com base no localStorage
        if (orderMap) {
          const reorder = (list: Acomodacao[], orderIds: number[]) => {
            const map = new Map(list.map((item) => [item.id, item]));
            const ordered = orderIds.map((id) => map.get(id)).filter(Boolean);
            const leftovers = list.filter((i) => !orderIds.includes(i.id));
            return [...ordered, ...leftovers];
          };

          proprioList = reorder(proprioList, orderMap.proprio || []);
          terceiroList = reorder(terceiroList, orderMap.terceiro || []);
          desativadoList = reorder(desativadoList, orderMap.desativado || []);
        }
        setProprio(proprioList);
        setTerceiro(terceiroList);
        setDesativados(desativadoList);

        if (
          data.filter((e) => !e.desativado).length <
          (statusData?.qtd_acomodacao ?? 1)
        )
          setVerifyAcomodacao(true);
        else setVerifyAcomodacao(false);
        setLoaded(true);
      })
      .catch((err) => console.log(err));

    await permissoes();
  }

  const [permissao, setPermissao] = useState(0);
  async function permissoes() {
    if (!dataToken || !dataToken.idUsu) return;
    await fetch(`${apiURL}/users/${dataToken.idUsu}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.acomodacoes) {
          setPermissao(data.acomodacoes);
        } else {
          setPermissao(0);
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    if (dataToken && dataToken.id) acomodacoes();
  }, [dataToken, statusData]);

  async function desativar(id: number, desativado: boolean) {
    await fetch(`${apiURL}/acomodacao/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ desativado: desativado }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.affected == 1) {
          setNotify({ type: 1, text: "Atualizado!" });
          setShowNotify(true);
          setTimeout(() => {
            setShowNotify(false);
          }, 3000);
          if (desativado) {
            setNotify({ type: 1, text: "Desativado!" });
            setShowNotify(true);
            setTimeout(() => {
              setShowNotify(false);
            }, 3000);
          } else {
            setNotify({ type: 1, text: "Ativado!" });
            setShowNotify(true);
            setTimeout(() => {
              setShowNotify(false);
            }, 3000);
          }
          location.reload();
        }
      })
      .catch((err) => console.log(err));
  }
  async function deletarAcomodacao(id: number) {
    await fetch(`${apiURL}/acomodacao/${id}/del`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.affected == 1) location.reload();
      })
      .catch((err) => console.log(err));
  }
  // 🔹 Config drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (
    event: any,
    list: Acomodacao[],
    setList: React.Dispatch<React.SetStateAction<Acomodacao[]>>,
  ) => {
    list;
    const { active, over } = event;
    const storage = localStorage.getItem("order_ac");
    if (!over) return;

    if (active.id !== over.id) {
      setList((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newList = arrayMove(items, oldIndex, newIndex);

        // 🔹 Monta o objeto de ordem
        const result = {
          proprio: proprio.map((i) => i.id),
          terceiro: terceiro.map((i) => i.id),
          desativado: desativados.map((i) => i.id),
        };

        // 🔹 Substitui a lista correta no `result`
        if (setList === setProprio) {
          result.proprio = newList.map((i) => i.id);
        } else if (setList === setTerceiro) {
          result.terceiro = newList.map((i) => i.id);
        } else if (setList === setDesativados) {
          result.desativado = newList.map((i) => i.id);
        }

        // 🔹 Atualiza localStorage
        if (!storage) {
          localStorage.setItem(
            "order_ac",
            JSON.stringify([[dataToken.id, result]]),
          );
        } else {
          const store: [string, any][] = JSON.parse(storage || "[]");
          let found = false;

          store.forEach((item, index) => {
            if (item[0] === dataToken.id) {
              store[index][1] = result;
              found = true;
            }
          });

          if (!found) {
            store.push([dataToken.id, result]);
          }
          localStorage.setItem("order_ac", JSON.stringify(store));
        }

        return newList;
      });
    }
  };

  return loaded ? (
    <div className="w-main px-8">
      {permissao == 0 && <SemPermissao />}
      <div className="mb-7 pt-2 flex justify-between gap-5 flex-wrap">
        <h3 className="text-3xl font-semibold">Acomodações</h3>
        {showNotify && <Notify type={notify.type} text={notify.text} />}
        <button
          className="px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black"
          onClick={() => {
            if (verifyAcomodacao) setCadastrarAcomodacao(true);
            else {
              setNotify({
                type: 2,
                text: "Seu plano não permite ter mais acomodações!",
              });
              setShowNotify(true);
              setTimeout(() => {
                setShowNotify(false);
              }, 3000);
            }
          }}
          disabled={!(permissao >= 2)}
        >
          Cadastrar Acomodação
        </button>
        {cadastrarAcomodacao && (
          <CadastrarAcomodacao close={() => setCadastrarAcomodacao(false)} />
        )}
      </div>

      {proprio.length == 0 &&
        terceiro.length == 0 &&
        desativados.length == 0 && (
          <section className="px-10 bg-zinc-200 rounded-xl py-10">
            <p className="text-3xl font-medium text-center ">
              Cadastre sua primeira acomodação e tenha total controle das suas
              reservas e ganhos. 🚀
            </p>
          </section>
        )}

      {/* 🔹 Próprias */}
      {proprio.length ? (
        <section className="pt-3">
          <p className="text-2xl font-medium">Próprias ({proprio.length})</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, proprio, setProprio)}
          >
            <SortableContext
              items={proprio.map((e) => e.id)}
              strategy={horizontalListSortingStrategy}
            >
              <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                {proprio.map((e) => (
                  <SortableItem key={e.id} id={e.id}>
                    <li
                      className="bg-white w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer"
                      onClick={() => location.assign(`/acomodacoes/${e.id}`)}
                    >
                      <img
                        src={
                          e.foto ||
                          "https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max"
                        }
                        className="object-cover h-24 w-48 rounded-md"
                      />
                      <p
                        className="font-semibold mt-4 text-lg text-nowrap text-ellipsis overflow-hidden"
                        title={e.nome}
                      >
                        {e.nome}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                          <div className="bg-[#1266B5] w-2 h-2 rounded-full"></div>
                          <div
                            className="uppercase text-xs font-semibold text-[#1266B5]"
                            style={{ lineHeight: "normal", fontSize: "10px" }}
                          >
                            próprio
                          </div>
                        </div>
                        <button
                          className="hover:bg-red-200 bg-transparent p-1 rounded-lg transition-all duration-200 border border-red-200 text-sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            abrirModalSuspender(e);
                          }}
                          disabled={!(permissao >= 4)}
                        >
                          Suspender
                        </button>
                      </div>
                    </li>
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      ) : null}

      {/* 🔹 Terceiras */}
      {terceiro.length ? (
        <section className="py-12">
          <p className="text-2xl font-medium">Terceiras ({terceiro.length})</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, terceiro, setTerceiro)}
          >
            <SortableContext
              items={terceiro.map((e) => e.id)}
              strategy={horizontalListSortingStrategy}
            >
              <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                {terceiro.map((e) => (
                  <SortableItem key={e.id} id={e.id}>
                    <li
                      className="bg-white w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer"
                      onClick={() => location.assign(`/acomodacoes/${e.id}`)}
                    >
                      <img
                        src={
                          e.foto ||
                          "https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max"
                        }
                        className="object-cover h-24 w-48 rounded-md"
                      />
                      <p className="font-semibold mt-4 text-lg text-nowrap text-ellipsis overflow-hidden">
                        {e.nome}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                          <div className="bg-[#3A8E71] w-2 h-2 rounded-full"></div>
                          <div
                            className="uppercase text-xs font-semibold text-[#3A8E71]"
                            style={{ lineHeight: "normal", fontSize: "10px" }}
                          >
                            terceiro
                          </div>
                        </div>
                        <button
                          className="hover:bg-red-200 bg-transparent p-1 rounded-lg transition-all duration-200 border border-red-200 text-sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            abrirModalSuspender(e);
                          }}
                          disabled={!(permissao >= 4)}
                        >
                          Suspender
                        </button>
                      </div>
                    </li>
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      ) : null}

      {/* 🔹 Desativadas */}
      {showDeleteModal && acomodacaoToDelete && (
        <ModalAlert
          title="Excluir acomodação"
          message={`Deseja excluir permanentemente "${acomodacaoToDelete.nome}" e os dados referentes a ela?`}
          onClose={fecharModalExclusao}
          onConfirm={confirmarExclusao}
          confirmText="Excluir permanentemente"
          cancelText="Cancelar"
          colorButton="red"
        />
      )}
      {showSuspenderModal && acomodacaoToSuspender && (
        <ModalAlert
          title="Suspender acomodação"
          message={`Ao suspender a acomodação "${acomodacaoToSuspender.nome}", ela ficará desativada e não poderá ser utilizada em reservas nem aparecerá em dashboards. Para reativá-la, acesse a seção de acomodações desativadas.`}
          onClose={fecharModalSuspender}
          onConfirm={confirmarSuspensao}
          confirmText="Suspender"
          cancelText="Cancelar"
          colorButton="blue"
        />
      )}
      {desativados.length ? (
        <section className="py-12">
          <p className="text-2xl font-medium">Desativadas</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, desativados, setDesativados)}
          >
            <SortableContext
              items={desativados.map((e) => e.id)}
              strategy={horizontalListSortingStrategy}
            >
              <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                {desativados.map((e) => (
                  <SortableItem key={e.id} id={e.id}>
                    <li className="bg-white w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer opacity-75 brightness-75">
                      <img
                        src={
                          e.foto ||
                          "https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max"
                        }
                        className="object-cover h-24 w-48 rounded-md"
                      />
                      <p className="font-semibold mt-4 text-lg text-nowrap text-ellipsis overflow-hidden">
                        {e.nome}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                          <div
                            className={`bg-[${e?.tipo == "proprio" ? "#1266B5" : "#3A8E71"}] w-2 h-2 rounded-full`}
                          ></div>
                          <div
                            className={`uppercase text-xs font-semibold text-[${e?.tipo == "proprio" ? "#1266B5" : "#3A8E71"}]`}
                            style={{ lineHeight: "normal", fontSize: "10px" }}
                          >
                            {e?.tipo}
                          </div>
                        </div>
                        <button
                          className="hover:bg-green-200 bg-transparent p-1 rounded-lg transition-all duration-200"
                          onClick={async (event) => {
                            event.stopPropagation();
                            if (verifyAcomodacao) desativar(e.id, false);
                            else {
                              setNotify({
                                type: 2,
                                text: "Seu plano não permite ter mais acomodações!",
                              });
                              setShowNotify(true);
                              setTimeout(() => {
                                setShowNotify(false);
                              }, 3000);
                            }
                          }}
                          disabled={!(permissao >= 3)}
                        >
                          <svg
                            className="feather feather-trash w-7 h-fit fill-[#00dd00]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M10.0072 2.10365C8.60556 1.64993 7.08193 2.28104 6.41168 3.59294L5.6059 5.17011C5.51016 5.35751 5.35775 5.50992 5.17036 5.60566L3.59318 6.41144C2.28128 7.08169 1.65018 8.60532 2.10389 10.0069L2.64935 11.6919C2.71416 11.8921 2.71416 12.1077 2.64935 12.3079L2.10389 13.9929C1.65018 15.3945 2.28129 16.9181 3.59318 17.5883L5.17036 18.3941C5.35775 18.4899 5.51016 18.6423 5.6059 18.8297L6.41169 20.4068C7.08194 21.7187 8.60556 22.3498 10.0072 21.8961L11.6922 21.3507C11.8924 21.2859 12.1079 21.2859 12.3081 21.3507L13.9931 21.8961C15.3947 22.3498 16.9183 21.7187 17.5886 20.4068L18.3944 18.8297C18.4901 18.6423 18.6425 18.4899 18.8299 18.3941L20.4071 17.5883C21.719 16.9181 22.3501 15.3945 21.8964 13.9929L21.3509 12.3079C21.2861 12.1077 21.2861 11.8921 21.3509 11.6919L21.8964 10.0069C22.3501 8.60531 21.719 7.08169 20.4071 6.41144L18.8299 5.60566C18.6425 5.50992 18.4901 5.3575 18.3944 5.17011L17.5886 3.59294C16.9183 2.28104 15.3947 1.64993 13.9931 2.10365L12.3081 2.6491C12.1079 2.71391 11.8924 2.71391 11.6922 2.6491L10.0072 2.10365ZM8.19271 4.50286C8.41612 4.06556 8.924 3.8552 9.39119 4.00643L11.0762 4.55189C11.6768 4.74632 12.3235 4.74632 12.9241 4.55189L14.6091 4.00643C15.0763 3.8552 15.5841 4.06556 15.8076 4.50286L16.6133 6.08004C16.9006 6.64222 17.3578 7.09946 17.92 7.38668L19.4972 8.19246C19.9345 8.41588 20.1448 8.92375 19.9936 9.39095L19.4481 11.076C19.2537 11.6766 19.2537 12.3232 19.4481 12.9238L19.9936 14.6088C20.1448 15.076 19.9345 15.5839 19.4972 15.8073L17.92 16.6131C17.3578 16.9003 16.9006 17.3576 16.6133 17.9197L15.8076 19.4969C15.5841 19.9342 15.0763 20.1446 14.6091 19.9933L12.9241 19.4479C12.3235 19.2535 11.6768 19.2535 11.0762 19.4479L9.3912 19.9933C8.924 20.1446 8.41612 19.9342 8.19271 19.4969L7.38692 17.9197C7.09971 17.3576 6.64246 16.9003 6.08028 16.6131L4.50311 15.8073C4.06581 15.5839 3.85544 15.076 4.00668 14.6088L4.55213 12.9238C4.74656 12.3232 4.74656 11.6766 4.55213 11.076L4.00668 9.39095C3.85544 8.92375 4.06581 8.41588 4.50311 8.19246L6.08028 7.38668C6.64246 7.09946 7.09971 6.64222 7.38692 6.08004L8.19271 4.50286ZM6.75972 11.7573L11.0023 15.9999L18.0734 8.92885L16.6592 7.51464L11.0023 13.1715L8.17394 10.343L6.75972 11.7573Z"></path>
                          </svg>
                        </button>
                        <button
                          className="hover:bg-red-200 bg-transparent p-1 rounded-lg transition-all duration-200"
                          onClick={(event) => {
                            event.stopPropagation();
                            abrirModalExclusao(e);
                          }}
                          disabled={!(permissao >= 4)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="rgba(255,0,0,0)"
                            stroke="currentColor"
                            strokeWidth="1"
                            stroke-linecap="undefined"
                            stroke-linejoin="round"
                            className="feather feather-trash w-7 h-fit"
                            color="rgba(255,0,0,1)"
                            pointer-events="none"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </li>
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      ) : null}
    </div>
  ) : (
    <Loader />
  );
}
