interface InputProps {
  id: string;
  nome: string;
  className?: string;
  obrigatorio: boolean;
  options: { value: string; nome: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function Select(props: InputProps) {
  return (
    <fieldset className={`fieldset w-full ${props.className}`}>
      <label className="label text-black" htmlFor={props.id}>
        {props.nome}{' '}
        {props.obrigatorio && <span className="text-red-500">*</span>}
      </label>
      <select
        id={props.id}
        value={props.value}
        required={props.obrigatorio}
        onChange={(e) => props.onChange(e.target.value)}
        className="select select-sm w-full"
      >
        {props.options.map((o) => (
          <option value={o.value}>{o.nome}</option>
        ))}
      </select>
    </fieldset>
  );
}
