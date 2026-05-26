import { useState, useRef, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? ""

// ── Tipos ──────────────────────────────────────────────────────────────────
interface Knowledge {
  id: number;
  title: string;
  sourceType: string;
  sourceName: string;
  chunkIndex: number;
  createdAt: string;
}

interface AgentConfig {
  systemPrompt: string;
  instructions: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

type Tab = "knowledge" | "config";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const sourceIcon = (type: string) => {
  if (type === "pdf") return "PDF";
  if (type === "docx") return "DOC";
  return "TXT";
};

const sourceBadgeColor = (type: string) => {
  if (type === "pdf") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  if (type === "docx") return "bg-sky-500/10 text-sky-400 border-sky-500/20";
  return "bg-violet-500/10 text-violet-400 border-violet-500/20";
};

// ── Componente ─────────────────────────────────────────────────────────────
export default function AgentAdminPage() {
  const [tab, setTab] = useState<Tab>("knowledge");

  // Knowledge
  const [knowledgeList, setKnowledgeList] = useState<Knowledge[]>([]);
  const [kTitle, setKTitle] = useState("");
  const [kText, setKText] = useState("");
  const [kFile, setKFile] = useState<File | null>(null);
  const [kLoading, setKLoading] = useState(false);
  const [kSuccess, setKSuccess] = useState(false);
  const [kListLoading, setKListLoading] = useState(false);

  // Config
  const [config, setConfig] = useState<AgentConfig>({
    systemPrompt: "",
    instructions: "",
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 2000,
  });
  const [configLoading, setConfigLoading] = useState(false);
  const [configSaving, setConfigSaving] = useState(false);
  const [configMsg, setConfigMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const kFileInputRef = useRef<HTMLInputElement>(null);

  // ── Loaders ────────────────────────────────────────────────────────────
  const loadKnowledge = useCallback(async () => {
    setKListLoading(true);
    try {
      const res = await fetch(`${API_BASE}/agent/knowledge`);
      const data = await res.json() as Knowledge[];
      setKnowledgeList(Array.isArray(data) ? data : []);
    } finally {
      setKListLoading(false);
    }
  }, []);
 
  const loadConfig = useCallback(async () => {
    setConfigLoading(true);
    try {
      const res = await fetch(`${API_BASE}/agent/config`);
      const data = await res.json() as Partial<AgentConfig>;
      setConfig({
        systemPrompt: data.systemPrompt ?? "",
        instructions: data.instructions ?? "",
        model: data.model ?? "gpt-4o",
        temperature: data.temperature ?? 0.7,
        maxTokens: data.maxTokens ?? 2000,
      });
    } finally {
      setConfigLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "knowledge") loadKnowledge();
    if (tab === "config") loadConfig();
  }, [tab, loadKnowledge, loadConfig]);

  // ── Knowledge actions ──────────────────────────────────────────────────
  const addKnowledge = async () => {
    if (!kTitle.trim() || (!kText.trim() && !kFile)) return;
    setKLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", kTitle);
      if (kFile) formData.append("file", kFile);
      else formData.append("text", kText);

      const res = await fetch(`${API_BASE}/agent/knowledge`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setKTitle("");
        setKText("");
        setKFile(null);
        setKSuccess(true);
        setTimeout(() => setKSuccess(false), 2500);
        loadKnowledge();
      }
    } finally {
      setKLoading(false);
    }
  };

  const deleteKnowledge = async (id: number) => {
    await fetch(`${API_BASE}/agent/knowledge/${id}`, { method: "DELETE" });
    loadKnowledge();
  };

  // ── Config actions ─────────────────────────────────────────────────────
  const saveConfig = async () => {
    setConfigSaving(true);
    setConfigMsg(null);
    try {
      const res = await fetch(`${API_BASE}/agent/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setConfigMsg(
        res.ok
          ? { type: "ok", text: "Configurações salvas com sucesso." }
          : { type: "err", text: "Erro ao salvar configurações." }
      );
    } catch {
      setConfigMsg({ type: "err", text: "Erro de conexão com o backend." });
    } finally {
      setConfigSaving(false);
      setTimeout(() => setConfigMsg(null), 4000);
    }
  };

  // Agrupa knowledge por título
  const groupedKnowledge = Array.isArray(knowledgeList)
    ? Array.from(
        new Map(knowledgeList.map((k) => [k.title, k])).values()
      ).map((first) => ({
        ...first,
        chunks: knowledgeList.filter((k) => k.title === first.title).length,
      }))
    : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ── Topbar ── */}
      <header className="border-b border-zinc-800/70 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-0 flex items-center justify-between">
          <div className="flex items-center gap-3 py-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm text-white">
              P
            </div>
            <div>
              <span className="text-sm font-semibold text-zinc-100">ProHost</span>
              <span className="text-xs text-zinc-500 ml-2">/ Admin do Agente</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-zinc-800/60 rounded-xl p-1">
            {([
              { key: "knowledge", label: "📚 Base de Conhecimento" },
              { key: "config", label: "⚙️ Configurações" },
            ] as { key: Tab; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tab === key
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── TAB: KNOWLEDGE ── */}
        {tab === "knowledge" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100">Base de Conhecimento</h1>
              <p className="text-sm text-zinc-500 mt-1">
                Documentos que o agente usará como referência ao gerar respostas.
              </p>
            </div>

            {/* Form adicionar */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                  Adicionar documento
                </span>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block">Título</label>
                  <input
                    value={kTitle}
                    onChange={(e) => setKTitle(e.target.value)}
                    placeholder="Ex: Política de cancelamento, Guia de boas-vindas..."
                    className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-800 transition-all"
                  />
                </div>

                {/* Modo texto ou arquivo */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      !kFile
                        ? "border-indigo-500/40 bg-indigo-500/5"
                        : "border-zinc-700/60 hover:border-zinc-600"
                    }`}
                    onClick={() => setKFile(null)}
                  >
                    <p className="text-xs font-medium text-zinc-300 mb-0.5">✏️ Texto livre</p>
                    <p className="text-[10px] text-zinc-600">Cole ou escreva o conteúdo</p>
                  </div>
                  <div
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      kFile
                        ? "border-indigo-500/40 bg-indigo-500/5"
                        : "border-zinc-700/60 hover:border-zinc-600"
                    }`}
                    onClick={() => kFileInputRef.current?.click()}
                  >
                    <p className="text-xs font-medium text-zinc-300 mb-0.5">📎 Arquivo PDF / DOCX</p>
                    <p className="text-[10px] text-zinc-600">
                      {kFile ? kFile.name : "Clique para selecionar"}
                    </p>
                  </div>
                  <input
                    ref={kFileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={(e) => setKFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                {!kFile && (
                  <div>
                    <label className="text-xs text-zinc-500 mb-1.5 block">Conteúdo</label>
                    <textarea
                      value={kText}
                      onChange={(e) => setKText(e.target.value)}
                      placeholder="Cole aqui o texto do documento..."
                      rows={5}
                      className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-800 transition-all"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  {kSuccess && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Documento adicionado com sucesso!
                    </span>
                  )}
                  {!kSuccess && <div />}
                  <button
                    onClick={addKnowledge}
                    disabled={kLoading || !kTitle.trim() || (!kText.trim() && !kFile)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none"
                  >
                    {kLoading ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processando...
                      </>
                    ) : (
                      "Adicionar documento"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de documentos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-zinc-400">
                  Documentos indexados
                  {groupedKnowledge.length > 0 && (
                    <span className="ml-2 text-xs text-zinc-600">({groupedKnowledge.length})</span>
                  )}
                </h2>
                {kListLoading && (
                  <span className="text-[10px] text-zinc-600">Carregando...</span>
                )}
              </div>

              {groupedKnowledge.length === 0 && !kListLoading && (
                <div className="text-center py-12 bg-zinc-900/40 border border-zinc-800/40 rounded-2xl">
                  <p className="text-3xl mb-3">📂</p>
                  <p className="text-sm text-zinc-500">Nenhum documento adicionado ainda.</p>
                  <p className="text-xs text-zinc-700 mt-1">Use o formulário acima para começar.</p>
                </div>
              )}

              <div className="space-y-2">
                {groupedKnowledge.map((k) => (
                  <div
                    key={k.id}
                    className="group flex items-center gap-4 px-5 py-4 bg-zinc-900 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-all"
                  >
                    <div className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md border ${sourceBadgeColor(k.sourceType)}`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {sourceIcon(k.sourceType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{k.title}</p>
                      <p className="text-[11px] text-zinc-600 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {k.sourceName} · {k.chunks} chunk{k.chunks > 1 ? "s" : ""} · {formatDate(k.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteKnowledge(k.id)}
                      className="opacity-0 group-hover:opacity-100 shrink-0 px-3 py-1.5 rounded-lg text-[11px] text-zinc-500 hover:text-red-400 hover:bg-red-400/5 border border-transparent hover:border-red-400/20 transition-all"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: CONFIG ── */}
        {tab === "config" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100">Configurações do Agente</h1>
              <p className="text-sm text-zinc-500 mt-1">
                Ajuste o modelo, parâmetros e instruções base do agente.
              </p>
            </div>

            {configLoading ? (
              <div className="flex items-center justify-center py-20 text-zinc-600 text-sm">
                Carregando configurações...
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">

                {/* Coluna esquerda — parâmetros */}
                <div className="col-span-1 space-y-5">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                      Parâmetros do modelo
                    </p>

                    {/* Modelo */}
                    <div>
                      <label className="text-xs text-zinc-500 mb-1.5 block">Modelo</label>
                      <select
                        value={config.model}
                        onChange={(e) => setConfig({ ...config, model: e.target.value })}
                        className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 transition-all"
                      >
                        <option value="gpt-4o">gpt-4o</option>
                        <option value="gpt-4o-mini">gpt-4o-mini</option>
                        <option value="gpt-4-turbo">gpt-4-turbo</option>
                      </select>
                    </div>

                    {/* Temperature */}
                    <div>
                      <label className="text-xs text-zinc-500 mb-2 flex justify-between">
                        <span>Temperature</span>
                        <span className="text-indigo-400 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {config.temperature.toFixed(1)}
                        </span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={config.temperature}
                        onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                        className="w-full accent-indigo-500"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-700 mt-1">
                        <span>Preciso</span>
                        <span>Criativo</span>
                      </div>
                    </div>

                    {/* Max Tokens */}
                    <div>
                      <label className="text-xs text-zinc-500 mb-1.5 block">Max Tokens</label>
                      <input
                        type="number"
                        value={config.maxTokens}
                        onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) || 0 })}
                        min={100}
                        max={8000}
                        className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 transition-all"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      />
                    </div>
                  </div>

                  {/* Info custo estimado */}
                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4">
                    <p className="text-xs font-medium text-amber-400 mb-2">💰 Custo estimado</p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Para ~100 usuários com ~10 msgs/dia, o custo de API fica entre{" "}
                      <span className="text-zinc-300">$15–40/mês</span> dependendo do tamanho das avaliações.
                    </p>
                  </div>
                </div>

                {/* Coluna direita — prompts */}
                <div className="col-span-2 space-y-5">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                        System Prompt
                      </p>
                      <p className="text-[11px] text-zinc-600 mt-0.5">
                        Instrução base que define o comportamento do agente.
                      </p>
                    </div>
                    <div className="p-4">
                      <textarea
                        value={config.systemPrompt}
                        onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                        rows={7}
                        placeholder="Ex: Você é um especialista em respostas de avaliações para hospedagens no Airbnb e Booking. Seu objetivo é ajudar anfitriões a responder avaliações de forma profissional, empática e que valorize a propriedade..."
                        className="w-full bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 resize-none focus:outline-none focus:border-indigo-500/40 focus:bg-zinc-800/60 transition-all leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                        Instruções Adicionais
                      </p>
                      <p className="text-[11px] text-zinc-600 mt-0.5">
                        Regras extras, tom de voz, restrições ou contexto adicional.
                      </p>
                    </div>
                    <div className="p-4">
                      <textarea
                        value={config.instructions}
                        onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
                        rows={5}
                        placeholder="Ex: Sempre finalize com uma frase convidando o hóspede a voltar. Nunca ofereça reembolso diretamente. Mantenha o tom cordial mesmo em críticas..."
                        className="w-full bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 resize-none focus:outline-none focus:border-indigo-500/40 focus:bg-zinc-800/60 transition-all leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Salvar */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      {configMsg && (
                        <span className={`text-xs flex items-center gap-1.5 ${configMsg.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${configMsg.type === "ok" ? "bg-emerald-400" : "bg-red-400"}`} />
                          {configMsg.text}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={saveConfig}
                      disabled={configSaving}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none"
                    >
                      {configSaving ? (
                        <>
                          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Salvando...
                        </>
                      ) : (
                        "Salvar configurações"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}