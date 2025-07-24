import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import prohostLogo from '/prohost-logo.png';

interface ApiResponse { success: boolean; message?: string }

export default function ResetarSenha() {
    const apiURL = 'https://api.prohost.net.br'
    const navigate = useNavigate(); 
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const mode = query.has('token') && query.has('id') ? 'reset' : 'request';

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [ok, setOk] = useState(false);

    const [email, setEmail] = useState('');
    const [senha1, setSenha1] = useState('');
    const [senha2, setSenha2] = useState('');

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
            setMsg('Não foi possível processar a solicitação.');
        } finally { setLoading(false); }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (senha1 !== senha2) { setMsg('As senhas não coincidem.'); return; }
        setLoading(true); setMsg(null);
        try {
            const { data } = await axios.post<ApiResponse>(
                `${apiURL}/reset-password/confirm`,
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

    return (
        <div className="flex w-full min-h-screen h-full">
            <main className="w-full min-h-screen h-full relative bg-zinc-100 grid md:grid-cols-2">
                {/* Coluna visual/identidade */}
                <section className="bg-gradient-to-t from-primary to-[#015A57] flex flex-col justify-center items-center py-20 md:py-0">
                    <div className="flex gap-2 mb-8">
                        <img src={prohostLogo} alt="Logo ProHost" width={48} height={48} />
                        <h1 className="text-white font-bold text-4xl tracking-tight">prohost</h1>
                    </div>
                    <p className="text-secondary font-semibold text-xl mb-5">Recuperação de Senha</p>
                </section>
                {/* Coluna formulário */}
                <section className="flex flex-col items-center justify-center px-8 py-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-[#015A57]">
                                {mode === 'request' ? 'Recuperação de Senha' : 'Definir Nova Senha'}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {mode === 'request'
                                    ? 'Digite seu email para receber o link de recuperação'
                                    : 'Escolha sua nova senha abaixo'}
                            </p>
                        </div>
                        {msg && (
                            <div className={`rounded-md p-4 text-sm ${ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                {msg}
                            </div>
                        )}
                        {mode === 'request' ? (
                            ok ? (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="w-full py-2 px-4 text-white bg-primary rounded-md font-semibold"
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
                                        className="w-full py-2 text-white bg-primary rounded-md font-semibold"
                                    >
                                        {loading ? 'Enviando…' : 'Enviar link'}
                                    </button>
                                </form>
                            )
                        ) : (
                            ok ? (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="w-full py-2 px-4 text-white bg-primary rounded-md font-semibold"
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
                                        className="w-full py-2 text-white bg-primary rounded-md font-semibold"
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