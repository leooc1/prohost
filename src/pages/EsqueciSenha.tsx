import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ApiResponse { success: boolean; message?: string }

export default function ResetarSenha() {
    const apiURL = 'https://api.prohost.net.br'
    const navigate = useNavigate();
    const { search } = useLocation();              // <── lê ?token=…&id=…
    const query = new URLSearchParams(search);
    const mode = query.has('token') && query.has('id') ? 'reset' : 'request';

    // estados comuns
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [ok, setOk] = useState(false);

    // estados específicos de cada modo
    const [email, setEmail] = useState('');
    const [senha1, setSenha1] = useState('');
    const [senha2, setSenha2] = useState('');

    /** 1) Solicitar link */
    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setMsg('Por favor, insira um email válido.');
            return;
        }
        setLoading(true); setMsg(null);
        try {
            const { data } = await axios.post<ApiResponse>(
                `${apiURL}/reset-password/request`,
                { email }
            );
            if (data.success) { setOk(true); setMsg('Email de recuperação enviado!'); setTimeout(() => setMsg(null), 5000); }
        } catch (e) {
            console.error('Erro ao solicitar redefinição:', e);
            setMsg('Não foi possível processar a solicitação.');
        } finally { setLoading(false); }
    };

    /** 2) Definir nova senha */
    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (senha1 !== senha2) { setMsg('As senhas não coincidem.'); return; }

        setLoading(true); setMsg(null);
        try {
            const { data } = await axios.post<ApiResponse>(
                `${apiURL}/reset-password/confirm`,   // rota sugerida
                {
                    token: query.get('token'),
                    userId: Number(query.get('id')),
                    senha: senha1
                }
            );
            if (data.success) { setOk(true); setMsg('Senha alterada com sucesso!'); }
        } catch (e) {
            setMsg('Não foi possível redefinir a senha (token expirado ou inválido).');
        } finally { setLoading(false); }
    };

    // ------------------------------------------------------------
    // JSX (condicional por `mode`)
    // ------------------------------------------------------------
    return (
        <div className="flex w-full min-h-screen">
            {/* coluna esquerda (logo) … */}
            <main className="w-full grid md:grid-cols-2 bg-zinc-100">
                {/* …logo/voltar… */}
                <section className="flex flex-col items-center justify-center px-8 py-12">
                    <div className="w-full max-w-md space-y-8">

                        {/* Título */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {mode === 'request' ? 'Recuperação de Senha' : 'Definir Nova Senha'}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {mode === 'request'
                                    ? 'Digite seu email para receber o link de recuperação'
                                    : 'Escolha sua nova senha abaixo'}
                            </p>
                        </div>

                        {/* Mensagem de sucesso/erro */}
                        {msg && (
                            <div
                                className={`rounded-md p-4 text-sm ${ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                    }`}
                            >
                                {msg}
                            </div>
                        )}

                        {/* FORMULÁRIO — muda conforme o modo */}
                        {mode === 'request' ? (
                            ok ? (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-2 px-4 text-white bg-primary rounded-md"
                                >
                                    Voltar para login
                                </button>
                            ) : (
                                <form onSubmit={handleRequest} className="space-y-6">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="seu-email@exemplo.com"
                                        className="w-full border px-3 py-2 rounded-md"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2 text-white bg-primary rounded-md"
                                    >
                                        {loading ? 'Enviando…' : 'Enviar link'}
                                    </button>
                                </form>
                            )
                        ) : (
                            ok ? (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="w-full py-2 px-4 text-white bg-primary rounded-md"
                                >
                                    Ir para login
                                </button>
                            ) : (
                                <form onSubmit={handleReset} className="space-y-6">
                                    <input
                                        type="password"
                                        required
                                        value={senha1}
                                        onChange={e => setSenha1(e.target.value)}
                                        placeholder="Nova senha"
                                        className="w-full border px-3 py-2 rounded-md"
                                    />
                                    <input
                                        type="password"
                                        required
                                        value={senha2}
                                        onChange={e => setSenha2(e.target.value)}
                                        placeholder="Confirme a senha"
                                        className="w-full border px-3 py-2 rounded-md"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2 text-white bg-primary rounded-md"
                                    >
                                        {loading ? 'Salvando…' : 'Salvar nova senha'}
                                    </button>
                                </form>
                            )
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}