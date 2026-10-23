interface AsideProps {
  style?: string;
}

export default function Aside(props: AsideProps) {
  return (
    <aside
      className={`bg-linear-to-b from-[#0E7C71] to-primary flex items-center lg:justify-normal justify-center ${props.style}`}
    >
      <h2 className="text-white lg:text-6xl lg:w-lg lg:pl-10 lg:text-start text-4xl text-center">
        Seja bem-vindo à próxima geração de anfitriões
      </h2>
    </aside>
  );
}
