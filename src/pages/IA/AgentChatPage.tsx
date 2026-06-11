import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const apiURL = import.meta.env.VITE_API_URL;

const getToken = () => window.localStorage.getItem("ph_token_acc") ?? "";
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

// ── Tipos ──────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  fileName?: string;
  streaming?: boolean;
}

interface Conversation {
  id: string;
  title: string | null;
  updatedAt: string;
}

const uid = () => Math.random().toString(36).slice(2);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// ── Componente ─────────────────────────────────────────────────────────────
export default function AgentChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch(`${apiURL}/agent/conversations`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setConversations(data);
    } catch {}
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${apiURL}/agent/conversations/${id}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setMessages(
        (data.messages ?? []).map((m: any) => ({
          id: uid(),
          role: m.role,
          content: m.content,
          fileName: m.fileName,
        })),
      );
      setActiveConvId(id);
    } catch {}
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const newConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    textareaRef.current?.focus();
  };

  const deleteConversation = async (id: string) => {
    await fetch(`${apiURL}/agent/conversations/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (activeConvId === id) newConversation();
    loadConversations();
  };

  const sendMessage = async () => {
    if (!input.trim() && !file) return;
    setSending(true);

    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: input,
      fileName: file?.name,
    };
    const assistantMsgId = uid();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    const sentFile = file;
    setFile(null);

    try {
      const formData = new FormData();
      formData.append("message", userMsg.content);
      if (activeConvId) formData.append("conversationId", activeConvId);
      if (sentFile) formData.append("file", sentFile);

      const res = await fetch(`${apiURL}/agent/chat`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.content) {
              fullContent += parsed.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, content: fullContent } : m,
                ),
              );
            }
          } catch {}
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, streaming: false } : m,
        ),
      );

      setTimeout(() => loadConversations(), 600);
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: "❌ Erro ao conectar com o backend.",
                streaming: false,
              }
            : m,
        ),
      );
    } finally {
      setSending(false);
    }
  };

  const copyText = (text: string) => navigator.clipboard.writeText(text);

  const activeTitle =
    conversations.find((c) => c.id === activeConvId)?.title ?? null;

  return (
    <div
      className="flex h-screen bg-stone-950 text-stone-100 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col border-r border-stone-800/60 bg-stone-900 transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-stone-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
              <span className="text-stone-950 text-[10px] font-bold">P</span>
            </div>
            <span className="text-sm font-semibold text-stone-100 tracking-tight">
              ProHost <span className="text-amber-400">Agent</span>
            </span>
          </div>
          <button
            onClick={newConversation}
            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-amber-400/10 border border-stone-700 hover:border-amber-400/30 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-all text-sm"
            title="Nova conversa"
          >
            +
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2">
          <p className="text-[9px] text-stone-600 uppercase tracking-[0.15em] px-3 mb-2">
            Conversas recentes
          </p>
          {conversations.length === 0 && (
            <p className="text-[11px] text-stone-600 px-3 py-4 text-center">
              Nenhuma conversa ainda.
              <br />
              <span className="text-stone-700">Comece digitando abaixo.</span>
            </p>
          )}
          <div className="space-y-0.5">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => loadConversation(c.id)}
                className={`group flex items-start justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                  activeConvId === c.id
                    ? "bg-amber-400/8 border border-amber-400/20 text-stone-100"
                    : "hover:bg-stone-800/60 text-stone-400 hover:text-stone-200"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium truncate leading-snug">
                    {c.title ?? "Nova conversa"}
                  </p>
                  <p
                    className="text-[10px] text-stone-600 mt-0.5"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {formatDate(c.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 ml-2 mt-0.5 text-stone-600 hover:text-red-400 transition-all text-xs shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-stone-800/60">
          <p className="text-[9px] text-stone-700 text-center">
            Respostas geradas por IA · Revise antes de enviar
          </p>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-3 px-5 py-3.5 border-b border-stone-800/60 bg-stone-900/40 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-7 h-7 rounded-md hover:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-300 transition-all text-sm"
          >
            ☰
          </button>
          <div className="h-4 w-px bg-stone-800" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-stone-400 font-medium">
              {activeTitle ??
                (activeConvId ? "Conversa ativa" : "Nova conversa")}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-6 px-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-3xl shadow-xl">
                  🏡
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-stone-950 flex items-center justify-center">
                  <span className="text-[8px] text-stone-950 font-bold">
                    AI
                  </span>
                </div>
              </div>
              <div className="text-center max-w-sm">
                <h2 className="text-lg font-semibold text-stone-200 mb-2">
                  Agente de Avaliações
                </h2>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Cole uma avaliação do Airbnb, Booking ou Google e receba uma
                  sugestão de resposta personalizada.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                {[
                  "Avaliação 1 estrela sobre limpeza",
                  "Hóspede elogiou mas pediu desconto",
                  "Reclamação sobre barulho externo",
                  "Check-in confuso, hóspede frustrado",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-left px-3 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-[11px] text-stone-400 hover:text-stone-200 transition-all leading-snug"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 max-w-3xl mx-auto w-full space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 shrink-0 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-sm mt-0.5">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}
                  >
                    {msg.fileName && (
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-400/80 bg-amber-400/5 border border-amber-400/15 rounded-lg px-2.5 py-1 w-fit">
                        <span>📎</span>
                        <span style={{ fontFamily: "'DM Mono', monospace" }}>
                          {msg.fileName}
                        </span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed max-w-full ${
                        msg.role === "user"
                          ? "bg-stone-800 text-stone-100 rounded-tr-sm"
                          : "bg-stone-900/80 border border-stone-800/80 text-stone-200 rounded-tl-sm"
                      }`}
                    >
                      <div className="markdown-body prose prose-invert max-w-full text-inherit">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }: any) => (
                              <p className="mb-2 last:mb-0 whitespace-pre-wrap leading-relaxed text-inherit">
                                {children}
                              </p>
                            ),
                            ul: ({ children }: any) => (
                              <ul className="list-disc pl-5 my-2 space-y-1 text-inherit">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }: any) => (
                              <ol className="list-decimal pl-5 my-2 space-y-1 text-inherit">
                                {children}
                              </ol>
                            ),
                            li: ({ children }: any) => (
                              <li className="leading-relaxed text-inherit">
                                {children}
                              </li>
                            ),
                            a: ({ href, children }: any) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-300 underline decoration-amber-400/40 hover:text-amber-200"
                              >
                                {children}
                              </a>
                            ),
                            strong: ({ children }: any) => (
                              <strong className="font-semibold text-stone-100">
                                {children}
                              </strong>
                            ),
                            em: ({ children }: any) => (
                              <em className="italic text-stone-100/90">
                                {children}
                              </em>
                            ),
                            blockquote: ({ children }: any) => (
                              <blockquote className="border-l-2 border-amber-400/40 pl-3 italic text-stone-300 my-2">
                                {children}
                              </blockquote>
                            ),
                            hr: () => <hr className="my-3 border-stone-800" />,
                            h1: ({ children }: any) => (
                              <h1 className="text-base font-semibold text-stone-50 mt-2 mb-2">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }: any) => (
                              <h2 className="text-sm font-semibold text-stone-100 mt-2 mb-1.5">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }: any) => (
                              <h3 className="text-[13px] font-semibold text-stone-100 mt-2 mb-1">
                                {children}
                              </h3>
                            ),
                            code: ({
                              inline,
                              className,
                              children,
                              ...props
                            }: any) =>
                              inline ? (
                                <code
                                  className="rounded bg-stone-800/90 px-1 py-0.5 font-mono text-[12px] text-amber-100"
                                  {...props}
                                >
                                  {children}
                                </code>
                              ) : (
                                <pre className="my-3 overflow-x-auto rounded-xl border border-stone-800 bg-stone-950/90 p-3 text-[12px] leading-5">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                        {msg.streaming && (
                          <span className="inline-block w-[2px] h-[14px] bg-amber-400 ml-0.5 animate-pulse align-middle rounded-full" />
                        )}
                      </div>
                    </div>
                    {msg.role === "assistant" &&
                      !msg.streaming &&
                      msg.content && (
                        <button
                          onClick={() => copyText(msg.content)}
                          className="flex items-center gap-1 text-[10px] text-stone-600 hover:text-amber-400 transition-colors mt-0.5 ml-1"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          <span>⎘</span> copiar resposta
                        </button>
                      )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 shrink-0 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-sm mt-0.5">
                      👤
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="px-4 py-4 border-t border-stone-800/60 bg-stone-900/30">
          <div className="max-w-3xl mx-auto">
            {file && (
              <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-stone-800/60 border border-stone-700 rounded-xl w-fit">
                <span
                  className="text-[11px] text-amber-400"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  📎 {file.name}
                </span>
                <button
                  onClick={() => setFile(null)}
                  className="text-stone-600 hover:text-red-400 text-xs transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-end gap-2 bg-stone-900 border border-stone-800 rounded-2xl px-3 py-2.5 focus-within:border-amber-400/30 transition-colors">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mb-0.5 w-8 h-8 rounded-lg hover:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-300 transition-all shrink-0"
                title="Anexar PDF, DOCX ou imagem"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                  />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 160) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Cole a avaliação ou escreva sua mensagem... (Enter para enviar, Shift+Enter para quebra de linha)"
                rows={1}
                className="flex-1 bg-transparent text-[13.5px] text-stone-100 placeholder-stone-600 resize-none focus:outline-none leading-relaxed py-1"
                style={{ maxHeight: "160px" }}
              />

              <button
                onClick={sendMessage}
                disabled={sending || (!input.trim() && !file)}
                className="mb-0.5 w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:bg-stone-800 disabled:text-stone-600 flex items-center justify-center text-stone-950 transition-all shrink-0"
              >
                {sending ? (
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
