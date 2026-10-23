import { deleteCookie, getCookieValid, setCookie } from '../../utils';

export default function Login() {
  return (
    <div className="min-h-dvh w-full bg-zinc-300 pt-24">
      <button
        className="btn btn-accent btn-outline"
        onClick={() => {
          console.log(setCookie('ph_lg_tk_acc', 'tem coisa', 24 * 7));
          location.href = '/';
        }}
      >
        criar
      </button>
      <button
        className="btn btn-accent btn-outline"
        onClick={() => {
          console.log(getCookieValid('ph_lg_tk_acc'));
        }}
      >
        buscar
      </button>
      <button
        className="btn btn-accent btn-outline"
        onClick={() => {
          console.log(deleteCookie('ph_lg_tk_acc'));
          location.href = '/auth';
        }}
      >
        deletar
      </button>
    </div>
  );
}
