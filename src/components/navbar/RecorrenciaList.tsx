import { Bell } from 'lucide-react';

export default function RecorrenciaList() {
  return (
    <div className="dropdown dropdown-center ">
      <div tabIndex={0} role="button" className="cursor-pointer">
        <div className="rounded-full indicator">
          <div className="indicator-item badge badge-error badge-sm text-white font-bold tracking-widest ">10</div>
          <Bell className="text-black size-8" />
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow bg-slate-500 gap-2"
      >
        {[1,2,3,4,5,6,7,8,9,10].map((i) => (
          <li key={i}>
            <a className="text-xl text-black hover:bg-zinc-400 ring ring-zinc-400">
              Despesa tal
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
