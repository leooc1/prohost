import { ChangeEvent } from "react";

export default function FeedBack({ close }: { close: () => void }) {
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => { e.preventDefault() }}
                style={{ width: '-webkit-fill-available' }}
                className="flex rounded-md flex-col absolute px-4 pb-3 gap-4 top-1/2 right-1/2 min-w-72 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Enviar Feedback</h5>

                <label htmlFor="titulo" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Título</span>
                    <input {/*placeholder="Ex: Problemas em dashboard"*/...[]} type="text" name="titulo" id="titulo" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <label htmlFor="detalhe" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Detalhes</span>
                    <textarea placeholder="Descreva aqui os detalhes do seu feedback" name="detalhe" id="detalhe" className="border border-zinc-300 rounded-md px-2 py-1 outline-none min-h-8 max-h-52" />
                </label>
                <label htmlFor="imagem" className="flex flex-col">
                    <span className="text-zinc-500 text-xs font-medium mb-1">Anexar Prints (opcional)</span>
                    <div id="input-file" className="self-center w-64 h-28 cursor-pointer flex border border-zinc-300 rounded-md px-1 py-1 outline-none items-center">
                        <svg className="w-28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#777777"><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                        <p className="text-zinc-400">Clique ou arraste uma imagem aqui</p>
                    </div>

                    <img id="preview" src="" alt="Pré-Visualização da Imagem" className="self-center hidden w-64 h-28 object-contain cursor-pointer border border-zinc-300 rounded-md px-1 py-1 outline-none" />
                    <input type="file" name="imagem" id="imagem" accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng" className="hidden"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const input = document.getElementById('input-file') as HTMLInputElement | null;
                            const preview = document.getElementById('preview') as HTMLImageElement | null;
                            const file = e.target.files?.[0];
                            if (file && preview) {
                                preview.classList.remove('hidden')
                                input?.classList.add('hidden')
                                const reader = new FileReader();
                                reader.onload = (event: ProgressEvent<FileReader>) => {
                                    if (event.target) {
                                        preview.src = event.target.result as string;
                                    }
                                };
                                reader.readAsDataURL(file);
                            } else {
                                preview?.classList.add('hidden')
                                input?.classList.remove('hidden')
                            }
                        }} />
                </label>

                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                     onClick={close}>Enviar feedback</button>
                </section>
            </form>
        </div>
    )
}
