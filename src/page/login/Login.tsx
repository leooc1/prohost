import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import logoP from '../../../public/prohost-logo.png';
import Aside from './Aside';
import { useLogin } from './useLogin';
import { Link } from 'react-router-dom';

export default function Login() {
  const { verSenha, toggleVerSenha, setEmail, setSenha, logar, loginDisable } =
    useLogin();
  return (
    <div className="min-h-dvh w-full bg-background grid lg:grid-cols-[1fr_2fr] lg:grid-rows-1 grid-rows-[1fr_0.5fr]">
      <main className="lg:min-w-lg flex flex-col justify-center gap-10">
        <h1 className="text-4xl font-bold flex text-zinc-600 justify-center gap-2">
          <img
            src={logoP}
            className="size-12 object-contain"
            alt="Logo ProHost"
          />
          prohost
        </h1>
        <section className="flex flex-col items-center w-full gap-5">
          <h2 className="text-3xl text-primary font-medium">Faça login</h2>
          <form className="flex flex-col gap-4 w-full px-4">
            {/* input email */}
            <div className="flex flex-col gap-2">
              <label className="label text-primary font-medium">
                Seu e-mail
              </label>
              <label className="input input-primary w-full">
                <Mail className="text-base text-primary" />
                <input
                  id="email"
                  type="text"
                  className="grow"
                  placeholder="seu@email.aqui"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            {/* input senha */}
            <div className="flex flex-col gap-2">
              <label className="label text-primary font-medium">
                Sua senha
              </label>
              <label className="input input-primary w-full">
                <Lock className="text-base text-primary" />
                <input
                  id="senha"
                  type={verSenha ? 'text' : 'password'}
                  className="grow"
                  placeholder="••••••••••••"
                  onChange={(e) => setSenha(e.target.value)}
                />
                {verSenha ? (
                  <Eye
                    className="text-base text-primary cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleVerSenha();
                    }}
                  />
                ) : (
                  <EyeOff
                    className="text-base text-primary cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleVerSenha();
                    }}
                  />
                )}
              </label>
            </div>
            <Link
              className="text-primary font-medium hover:underline w-max"
              to={'/'}
            >
              Esqueceu sua senha?
            </Link>
            <button
              disabled={loginDisable}
              className={`btn btn-primary lg:w-sm w-full mx-auto`}
              onClick={(e) => {
                e.preventDefault();
                logar();
              }}
            >
              {loginDisable && (
                <span className="loading loading-spinner"></span>
              )}
              Avançar
            </button>
            <Link
              className="text-primary font-medium hover:underline w-max"
              to={'/'}
            >
              Não tem uma conta? Registre-se
            </Link>
          </form>
        </section>
      </main>
      <Aside />
    </div>
  );
}
