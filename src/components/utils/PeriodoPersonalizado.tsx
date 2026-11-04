import { useState } from "react";

interface PeriodoPersonalizadoProps {
  setDataInicio: (data: string) => void;
  setDataFim: (data: string) => void;
}

export default function PeriodoPersonalizado(props: PeriodoPersonalizadoProps) {
  const [de, setDe] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1 - 1, 1)
      .toISOString()
      .slice(0, 10),
  );
  const [ate, setAte] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      .toISOString()
      .slice(0, 10),
  );
  return (
    <>
      <fieldset className={`fieldset w-full`}>
        <label className="label text-black" htmlFor={"data-inicio"}>
          De:
        </label>
        <input
          type="date"
          id={"data-inicio"}
          className="input input-sm w-full"
          value={de}
          onChange={(e) => setDe(e.target.value)}
        />
      </fieldset>
      <fieldset className={`fieldset w-full`}>
        <label className="label text-black" htmlFor={"data-fim"}>
          Até:
        </label>
        <input
          type="date"
          id={"data-fim"}
          className="input input-sm w-full"
          value={ate}
          min={de}
          onChange={(e) => setAte(e.target.value)}
        />
      </fieldset>
      <button
        className="btn btn-sm btn-primary self-end -translate-y-1"
        onClick={() => {
          if (de && ate) {
            props.setDataInicio(de);
            props.setDataFim(ate);
          }
        }}
      >
        Aplicar
      </button>
    </>
  );
}
