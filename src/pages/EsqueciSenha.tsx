import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import prohostLogo from '/prohost-logo.png';

interface ApiResponse { success: boolean; message?: string }

const open = <svg id="eye-open" className="w-4 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path></svg>
const closed = <svg className="w-4 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path></svg>

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
    const [senha1Eye, setSenha1Eye] = useState(false);
    const [senha2Eye, setSenha2Eye] = useState(false);

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
                { email: gmail || email }
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
                                                href={"https://wa.me/5521997541318?text= Quero uma nova senha! Não tenho mais acesso ao email " + `${gmail}!`}
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
                                    <div className='relative'>
                                        <label htmlFor="">
                                            <input
                                                type={senha1Eye ? "text" : "password"}
                                                required
                                                value={senha1}
                                                onChange={e => setSenha1(e.target.value)}
                                                placeholder="Nova senha"
                                                className="w-full border pl-2 pr-7 py-2 rounded-md"
                                            />
                                            <button className="absolute top-1/2 -translate-y-1/2 right-2"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSenha1Eye(!senha1Eye)
                                                }}>{senha1Eye ? open : closed}</button>
                                        </label>
                                    </div>
                                    <div className='relative'>
                                        <input
                                            type={senha2Eye ? "text" : "password"}
                                            required
                                            value={senha2}
                                            onChange={e => setSenha2(e.target.value)}
                                            placeholder="Confirme a senha"
                                            className="w-full border pl-2 pr-7 py-2 rounded-md"
                                        />
                                        <button className="absolute top-1/2 -translate-y-1/2 right-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSenha2Eye(!senha2Eye)
                                            }}>{senha2Eye ? open : closed}</button>
                                    </div>
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