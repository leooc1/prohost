interface InputProps {
  id: string;
  nome: string;
  type: string;
  placeholder?: string;
  className?: string;
  obrigatorio: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function Input(props: InputProps) {
  return (
    <fieldset className={`fieldset w-full ${props.className}`}>
      <label className="label text-black" htmlFor={props.id}>
        {props.nome}{' '}
        {props.obrigatorio && <span className="text-red-500">*</span>}
      </label>
      <input
        type={props.type}
        id={props.id}
        className="input w-full"
        placeholder={props.placeholder}
        value={props.value}
        required={props.obrigatorio}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </fieldset>
  );
}
