import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { options, setCookie } from '../../utils';
import { useNavigate } from 'react-router-dom';
const apiURL = import.meta.env.VITE_API_URL;

export function useLogin() {
  const Login = z.object({
    email: z.email('E-mail inválido'),
    senha: z.string().min(1, 'Preencha o campo de senha'),
  });
  const [verSenha, setVerSenha] = useState(false);
  const [login, setLogin] = useState({ email: '', senha: '' });
  const [loginDisable, setLoginDisable] = useState<boolean>(false);
  const navigate = useNavigate();

  function toggleVerSenha() {
    setVerSenha((verSenha) => !verSenha);
  }

  function setEmail(email: string) {
    setLogin((prev) => ({ ...prev, email }));
  }

  function setSenha(senha: string) {
    setLogin((prev) => ({ ...prev, senha }));
  }

  function logar() {
    setLoginDisable(true);
    const result = Login.safeParse(login);
    if (!result.success)
      result.error.issues.forEach((err) => toast.error(err.message));
    else fetchLogin(result.data);
  }

  async function fetchLogin(body: { email: string; senha: string }) {
    const result = await fetch(`${apiURL}/auth/login`, options.post(body));
    const data = await result.json();
    if (result.status !== 200) {
      setLoginDisable(false);
      toast.error(data.message);
      return;
    }
    toast.success(`Bem vindo(a) ${data.nome}!`);
    await setCookie('ph_lg_tk_acc', data.token, 7 * 24);
    location.href = '/';
  }

  return {
    verSenha,
    toggleVerSenha,
    setEmail,
    setSenha,
    logar,
    loginDisable,
  };
}
