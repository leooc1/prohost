import { Trash } from 'lucide-react';
import type { ChangeEvent } from 'react';
import toast from 'react-hot-toast';

interface ImageInputProps {
  id: string;
  nome: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ImageInput(props: ImageInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        toast.error('Não foi possível carregar a imagem.');
        return;
      }
      props.onChange(reader.result);
    };
    reader.onerror = () => toast.error('Não foi possível carregar a imagem.');
    reader.readAsDataURL(file);
  }

  return (
    <div className="fieldset w-full">
      <label className="label text-black" htmlFor={props.id}>
        {props.nome}
      </label>
      <div className="flex justify-center items-center">
        <label
          htmlFor={props.id}
          className="relative flex h-28 w-42 cursor-pointer items-center justify-center overflow-hidden rounded-box border border-zinc-300"
        >
          {props.value ? (
            <img
              src={props.value}
              alt={`Pré-visualização de ${props.nome.toLowerCase()}`}
              className="max-h-32 w-full object-cover"
            />
          ) : (
            <div className="flex items-center gap-2 text-zinc-400">
              <svg
                className="h-10 w-10 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
              </svg>
              <span>Clique ou arraste uma imagem aqui</span>
            </div>
          )}
          <input
            type="file"
            name={props.id}
            id={props.id}
            accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleChange}
          />
        </label>
        {props.value&&<Trash
          className="text-error cursor-pointer"
          onClick={() => {
            props.onChange('');
          }}
        />}
      </div>
    </div>
  );
}
