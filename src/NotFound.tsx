import prohostLogo from '../public/prohost-logo.png'

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-gradient-to-t from-[#003447] to-[#0e7c71]">
      <img src={prohostLogo} alt='Logo ProHost' width={52} height={52} />
      <h1 className="text-white text-6xl">404</h1>
      <p className="text-white text-2xl">Esta página não existe</p>
      <a className="text-white text-xl underline" href="/">Clique aqui para voltar ao início</a>
    </div>
  )
}
