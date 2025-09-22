import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import prohostLogo from '/prohost-logo.png';

interface ApiResponse { success: boolean; message?: string }

export default function ResetarSenha() {
    const apiURL = import.meta.env.VITE_API_URL
    console.log(apiURL)
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const mode = query.has('token') && query.has('id') ? 'reset' : 'request';

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [ok, setOk] = useState(false);
    const [specialMsg, setSpecialMsg] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const gmail = URLSearchParams.prototype.get.call(query, 'email') || '';
    const [senha1, setSenha1] = useState('');
    const [senha2, setSenha2] = useState('');

    useEffect(() => {
        const msg = window.localStorage.getItem('ph_reset_msg');
        if (msg) {
            setSpecialMsg(msg);
            window.localStorage.removeItem('ph_reset_msg');
        }
    }, []);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gmail.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) && !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setMsg('Por favor, insira um email válido.');
            return;
        }
        setLoading(true); setMsg(null);
        try {
            const { data } = await axios.post<ApiResponse>(
                `${apiURL}/reset-password/request`,
                { email: gmail }
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
                                {(specialMsg && !ok)
                                    ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="text-lg text-primary font-semibold">
                                                Email de recuperação enviado para: {gmail}
                                            </div>
                                            <div className="text-sm text-zinc-700 text-center">
                                            {specialMsg}
                                            </div>
                                            <div className="text-sm text-zinc-700 text-center">
                                                Caso não tenha mais acesso ao email ou não esteja recebendo o email (verifique a caixa de spam e lixeira), pode entrar em contato através do WhatsApp.
                                            </div>
                                            <a
                                                href={"https://wa.me/5521997541318?text= Quero uma nova senha! Não tenho mais acesso ao email "+ `${gmail}!`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.52 3.48A11.77 11.77 0 0 0 12.07 0C5.41 0 .07 5.34.07 12c0 2.12.56 4.19 1.62 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12.07 24c6.66 0 12.09-5.34 12.09-12S20.52 3.48 20.52 3.48zm-8.45 19.09c-1.89 0-3.74-.5-5.36-1.45l-.38-.22-3.67.96.98-3.58-.25-.37A9.93 9.93 0 0 1 2.07 12c0-5.48 4.52-9.93 10.09-9.93 2.67 0 5.18 1.04 7.07 2.93a9.93 9.93 0 0 1 2.93 7.07c0 5.48-4.52 9.93-10.09 9.93zm5.53-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.5-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.13 4.39.72.25 1.28.4 1.72.52.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.13-.29-.2-.59-.35z" />
                                                </svg>
                                                Falar no WhatsApp
                                            </a>
                                        </div>
                                    )
                                    : mode === 'request'
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
                                <div className="flex flex-col items-center gap-4">
                                    <div className="text-lg text-primary font-semibold">
                                        Email de recuperação enviado para: <span className="font-bold">{email}</span>
                                    </div>
                                    <div className="text-sm text-zinc-700 text-center">
                                        Caso não tenha mais acesso ao email ou não esteja recebendo o email (verifique a caixa de spam e lixeira), pode entrar em contato através do WhatsApp.
                                    </div>
                                    <a
                                        href="https://wa.me/5521997541318"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.52 3.48A11.77 11.77 0 0 0 12.07 0C5.41 0 .07 5.34.07 12c0 2.12.56 4.19 1.62 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12.07 24c6.66 0 12.09-5.34 12.09-12S20.52 3.48 20.52 3.48zm-8.45 19.09c-1.89 0-3.74-.5-5.36-1.45l-.38-.22-3.67.96.98-3.58-.25-.37A9.93 9.93 0 0 1 2.07 12c0-5.48 4.52-9.93 10.09-9.93 2.67 0 5.18 1.04 7.07 2.93a9.93 9.93 0 0 1 2.93 7.07c0 5.48-4.52 9.93-10.09 9.93zm5.53-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.5-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.13 4.39.72.25 1.28.4 1.72.52.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.13-.29-.2-.59-.35z" />
                                        </svg>
                                        Falar no WhatsApp
                                    </a>
                                    <button
                                        onClick={() => navigate('/auth')}
                                        className="w-full py-2 px-4 text-white bg-primary rounded-md font-semibold"
                                    >
                                        Voltar para login
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleRequest} className="space-y-6">
                                    <input
                                        type="email"
                                        required
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="seu-email@exemplo.com"
                                        className="w-full border px-3 py-2 rounded-md"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2 text-white bg-primary rounded-md font-semibold"
                                    >
                                        {loading ? 'Enviando…' : 'Solicitar link'}
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