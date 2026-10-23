import { BadgeQuestionMark, Menu } from 'lucide-react';
import { useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import RecorrenciaList from './RecorrenciaList';

const abas = [
  {
    to: '/',
    text: 'Home',
  },
  {
    to: '/page2',
    text: 'Page 2',
  },
  {
    to: '/page3',
    text: 'Page 3',
  },
  {
    to: '/mouse-follow',
    text: 'Seguir mouse',
  },
  {
    to: '/scroll-e-l-i',
    text: 'Itens entrando e saindo da tela',
  },
];
export default function Navbar() {
  const menuRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="drawer">
      <input
        ref={menuRef}
        id="side-menu"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content min-h-dvh">
        <section
          id="top-bar"
          className="bg-zinc-100 h-20 shadow-md shadow-zinc-500/50 rounded-xl fixed top-2 inset-0 flex justify-between items-center mx-2 px-8 z-10"
        >
          <div>
            <label htmlFor="side-menu" className="cursor-pointer drawer-button">
              <Menu className="text-black md:size-10 size-8" />
            </label>
          </div>
          <div className="flex gap-8">
            <button>
              <RecorrenciaList />
            </button>
            <button>
              <ProfileDropdown />
            </button>
            <button>
              <BadgeQuestionMark className="text-black md:size-10 size-8" />
            </button>
          </div>
        </section>
        {/* Page content here */}
        <Outlet />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="side-menu"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-primary min-h-full w-80 p-4 rounded-r-lg">
          {/* Sidebar content here */}
          {abas.map((a) => (
            <li
              key={a.to}
              onClick={() => {
                if (menuRef.current) menuRef.current.checked = false;
              }}
            >
              <Link to={a.to} className='text-white'>{a.text}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
