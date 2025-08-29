import { ChangeEvent, useContext, useEffect, useState } from "react"
import { SideBarContext, SideBarProvider } from "../contexts/SideBarMenuContext"
import RelatorioCompleto from "../report/RelatorioCompleto"

export default function Relatorio() {
    const apiURL = 'https://api.prohost.net.br'
    const { dataToken } = useContext(SideBarContext)
    const [acomodacoes, setAcomodacoes] = useState<any>([])
    const [foto, setFoto] = useState<string | null>(null)
    const [relatorio, setRelatorio] = useState<boolean>(false)
    const [chooseAc, setChooseAc] = useState<number | null>(null)
    const [chooseMes, setChooseMes] = useState<number>(new Date().getMonth() + 1)
    const [chooseAno, setChooseAno] = useState<number>(new Date().getFullYear())
    const anos = Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, i) => new Date().getFullYear() - i);
    async function getData() {
        await fetch(`${apiURL}/acomodacao/${dataToken.id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: any[]) => {
                setAcomodacoes(data.filter((e => !e.desativado)))
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (dataToken) {
            getData()
        }
    }, [dataToken, foto])
    return (
        <section>
            <SideBarProvider>
                <>
                    {!relatorio && <section>
                        {acomodacoes.length ?
                            <section className="py-py">
                                <p className="text-2xl font-medium text-center -mb-4">Escolha a acomodação para o relatório</p>
                                <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex gap-5 flex-wrap justify-center h-72 overflow-y-scroll">
                                    {acomodacoes.map((e: any) =>
                                        <li className={`min-w-52 h-44 border border-zinc-200 rounded-xl p-5 cursor-pointer ${e.id == chooseAc ? 'bg-green-200' : 'bg-white'}`}
                                            onClick={() => setChooseAc(e.id)}>
                                            <img src={e.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} className="object-cover h-24 w-48 rounded-md" />
                                            <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                        </li>)}
                                </ul>
                            </section>
                            : null
                        }
                        <section className="flex justify-around mt-8 items-center">
                            <label htmlFor="imagem" className="flex flex-col">
                                <span className="flex flex-col text-zinc-600 font-medium text-sm">Logo da empresa</span>
                                <div id="input-file" className="w-52 h-20 cursor-pointer flex border border-zinc-300 rounded-md px-1 py-1 outline-none items-center">
                                    <svg className="w-28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#777777"><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                                    <p className="text-zinc-400">Clique ou arraste uma imagem aqui</p>
                                </div>

                                <img id="preview" src="" alt="Pré-Visualização da Imagem" className="hidden w-52 h-20 object-contain cursor-pointer border border-zinc-300 rounded-md px-1 py-1 outline-none" />
                                <input type="file" name="imagem" id="imagem" accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng" className="hidden"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        const input = document.getElementById('input-file') as HTMLInputElement | null;
                                        const preview = document.getElementById('preview') as HTMLImageElement | null;
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (preview) {
                                                preview.classList.remove('hidden')
                                                input?.classList.add('hidden')
                                                const reader = new FileReader();
                                                reader.onload = (event: ProgressEvent<FileReader>) => {
                                                    if (event.target) {
                                                        preview.src = event.target.result as string;
                                                        setFoto(preview.src)
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        } else {
                                            preview?.classList.add('hidden')
                                            input?.classList.remove('hidden')
                                            setFoto(null)
                                        }
                                    }} />
                            </label>
                            <label htmlFor="mes" className={`flex flex-col text-zinc-600 font-medium text-sm`}>
                                Mês
                                <select name="mes" id="mes" className={`border border-zinc-300 rounded-md px-2 py-1 h-9 outline-none text-base`} value={chooseMes}
                                    onChange={(e) => setChooseMes(Number(e.target.value))}>
                                    <option value="1">Janeiro</option>
                                    <option value="2">Fevereiro</option>
                                    <option value="3">Março</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Maio</option>
                                    <option value="6">Junho</option>
                                    <option value="7">Julho</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Setembro</option>
                                    <option value="10">Outubro</option>
                                    <option value="11">Novembro</option>
                                    <option value="12">Dezembro</option>
                                </select>
                            </label>
                            <label htmlFor="ano" className={`flex flex-col text-zinc-600 font-medium text-sm`}>
                                Ano
                                <select name="ano" id="ano" className={`border border-zinc-300 rounded-md px-2 py-1 h-9 outline-none text-base`} value={chooseAno}
                                    onChange={(e) => setChooseAno(Number(e.target.value))}>
                                    {anos.map((ano) => (
                                        <option key={ano} value={ano}>
                                            {ano}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black h-14'
                                onClick={() => {
                                    if (!chooseAc)
                                        alert('Escolha uma acomodação para gerar o relatório')
                                    else {
                                        setRelatorio(true)
                                    }
                                }}>Gerar relatório</button>
                        </section>
                    </section>}
                    {chooseAc && relatorio && <RelatorioCompleto
                        saas={Number(dataToken.id)}
                        acomodacao={chooseAc}
                        mes={chooseMes}
                        ano={chooseAno}
                        imagem={foto || ''}
                    />}
                </>
                {/* <RelatorioCompleto
                    saas={Number(324)}
                    acomodacao={488}
                    mes={8}
                    ano={2025}
                    imagem={``}
                /> */}
            </SideBarProvider>
        </section>
    )
}
