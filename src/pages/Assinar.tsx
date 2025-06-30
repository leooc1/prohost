import { useContext, useEffect, useState } from 'react'
import prohostLogo from '/prohost-logo.png'
import { Outlet, useNavigate } from 'react-router-dom'
import { AssinaturaContext } from '../contexts/AssinaturaContext';

export default function Assinar() {
    const { setPlanoDTO } = useContext(AssinaturaContext);
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('');
    const [numAcomodacao, setNumAcomodacao] = useState<string>('');
    const [cycle, setCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');

    const precoAnual = () => {
        const qtdAcomod = Number(numAcomodacao) || 1;
        const precos = [249.00, 399.00, 549.00, 799.00, 1299.00, 1799.00];
        if (qtdAcomod === 1) return precos[0];
        else if (qtdAcomod > 1 && qtdAcomod <= 3) return precos[1];
        else if (qtdAcomod > 3 && qtdAcomod <= 5) return precos[2];
        else if (qtdAcomod > 5 && qtdAcomod <= 10) return precos[3];
        else if (qtdAcomod > 10 && qtdAcomod <= 20) return precos[4];
        else return precos[5];
    };

    const precoMensal = () => precoAnual() / 10;

    useEffect(() => {
        const url = new URL(location.href);
        // Read cycle from URL
        const urlCycle = url.searchParams.get('cycle')?.toUpperCase() || 'YEARLY';
        setCycle(urlCycle === 'MONTHLY' ? 'MONTHLY' : 'YEARLY');

        // Handle number of accommodations
        if (url.searchParams.get('acom') && numAcomodacao === '') {
            setNumAcomodacao(url.searchParams.get('acom') || '1');
        } else {
            const valor = numAcomodacao || '1';
            url.searchParams.set('acom', valor);
            window.history.replaceState({}, '', url);
        }

        // Calculate prices and set PlanoDTO
        const anual = precoAnual();
        const mensal = precoMensal();
        setPlanoDTO({
            qtd_acomodacao: Number(numAcomodacao) || 1,
            valor_mes: Number(mensal.toFixed(2)),
            valor_ano: anual,
            cycle: cycle
        });
    }, [numAcomodacao, cycle, setPlanoDTO]);

    useEffect(() => {
        const vURL = new URL(location.href).searchParams.get('origin') || '';
        setOrigin(vURL);
    }, []);

    return (
        <div className="flex w-full min-h-screen h-full">
            <main className="w-full min-h-screen h-full relative bg-zinc-100 grid md:grid-cols-2">
                <section className="bg-gradient-to-t from-primary to-[#015A57] relative flex justify-center items-center md:min-w-min py-20 md:py-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-xl text-zinc-200 flex gap-3 items-center fixed left-8 top-5 w-fit h-fit"
                    >
                        <span>&lt;</span> Voltar
                    </button>

                    {location.pathname.includes('forma-pagamento') ||
                        location.pathname.includes('credit-card') ||
                        location.pathname.includes('pix') ? (
                        <div className="flex gap-2">
                            <img src={prohostLogo} alt="Logo ProHost" width={48} height={48} />
                            <h1 className="text-white font-bold text-4xl tracking-tight">prohost</h1>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full mx-10">
                            <div className="flex gap-2">
                                <img src={prohostLogo} alt="Logo ProHost" width={32} height={32} />
                                <h1 className="text-white font-bold text-3xl tracking-tight">prohost</h1>
                            </div>
                            <p className="text-secondary font-semibold text-xl my-5">Assinatura</p>
                            <div className="border border-zinc-400 rounded-xl p-4 gap-4 flex flex-col">
                                <p className="text-white">Quantas acomodações você administra?</p>
                                <label htmlFor="qtdAcomodacao" className="flex items-center gap-8">
                                    <input
                                        id="qtdAcomodacao"
                                        type="range"
                                        min={1}
                                        max={30}
                                        defaultValue={new URL(location.href).searchParams.get('acom') || 1}
                                        onChange={(e) => setNumAcomodacao(e.target.value)}
                                    />
                                    <span className="text-secondary h-8 w-8 border border-zinc-400 flex justify-center items-center rounded-lg">
                                        {numAcomodacao || 1}
                                    </span>
                                </label>
                            </div>
                            {origin === 'newStudents' && (
                                <div className="mt-5 text-zinc-100 flex items-center gap-4">
                                    <p className="text-2xl font-semibold">
                                        Bem vindo(a) novo(a) aluno(a)!<br />
                                        Você tem direito a 6 meses grátis de acesso ao sistema.
                                    </p>
                                </div>
                            )}
                            {origin === 'newClassmates' && (
                                <div className="mt-5 text-zinc-100 flex items-center gap-4">
                                    <p className="text-2xl font-semibold">
                                        Bem vindo(a) novo(a) aluno(a)!<br />
                                        Você tem direito a 1 ano grátis de acesso ao sistema.
                                    </p>
                                </div>
                            )}
                            {origin === 'newAnfitriao' && (
                                <div className="mt-5 text-zinc-100 flex items-center gap-4">
                                    <p className="text-2xl font-semibold">
                                        Parabéns, anfitrião!<br />
                                        Você ganhou 1 mês gratuito para usar o ProHost, seja bem-vindo(a)
                                    </p>
                                </div>
                            )}
                            <div className={`mt-5 text-zinc-100 flex items-center gap-4 ${origin !== '' && 'hidden'}`}>
                                <p className="text-4xl">
                                    R${' '}
                                    {(cycle === 'MONTHLY' ? precoMensal() : precoAnual()).toFixed(2).replace('.', ',')}
                                </p>
                                <p className="text-sm">
                                    pago <br /> {cycle === 'MONTHLY' ? 'mensalmente' : 'anualmente'}
                                </p>
                            </div>
                            <hr className="my-5 brightness-75" />
                            <p className="text-zinc-100">
                                Plano para {numAcomodacao || 1} acomodaç{Number(numAcomodacao) > 1 ? 'ões' : 'ão'}
                            </p>

                            {numAcomodacao === '30' && (
                                <a
                                    href="https://wa.me/5521995178020"
                                    target="_blank"
                                    className="bg-secondary bg-opacity-40 border-2 border-secondary rounded-md p-2 w-fit mx-auto mt-5"
                                >
                                    <p className="text-white font-light">
                                        Você administra <strong>mais de 30 acomodações</strong>?<br />
                                        Temos uma oferta especial para você!<br />
                                        <br />
                                        <strong>Clique aqui para entrar em Contato</strong>
                                    </p>
                                </a>
                            )}
                        </div>
                    )}
                </section>
                <Outlet />
            </main>
        </div>
    );
}
