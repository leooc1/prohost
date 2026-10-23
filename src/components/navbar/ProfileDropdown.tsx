import { UserPen } from 'lucide-react';

export default function ProfileDropdown() {
  return (
    <div className="dropdown dropdown-center ">
      <div tabIndex={0} role="button" className="cursor-pointer">
        <div className="rounded-full">
          <UserPen className="text-black md:size-10 size-8" />
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow bg-zinc-200 gap-2"
      >
        <li>
          <a className="text-xl text-black hover:bg-zinc-400 ring ring-zinc-400">Profile</a>
        </li>
        <li>
          <a className="text-xl text-black hover:bg-zinc-400 ring ring-zinc-400">Settings</a>
        </li>
        <li>
          <a className="text-xl text-black hover:bg-zinc-400 ring ring-zinc-400">Logout</a>
        </li>
      </ul>
    </div>
  );
}
