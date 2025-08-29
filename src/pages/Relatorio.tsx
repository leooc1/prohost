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
                {/* <>
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
                </> */}
                <RelatorioCompleto
                    saas={Number(324)}
                    acomodacao={488}
                    mes={8}
                    ano={2025}
                    imagem={`data:image/jpeg;base64,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uHOMeiSnjn950Fe5hcyjJctbR9z5nHZPKD9ph9V26/Lufm3RXQeNvh/43+G+tyeHPH3hTVNA1KLObe/tmiZh/eXcMOp7MuQexrn69VNPVHhNOLswooopiCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK0NB0HW/FOs2fh3w3pN1qeqahMsFrZ2sTSSzSHoqqOSa92+Av7C3x6+O81tqFn4ck8NeG5SGbW9ajaGJkPeGMjzJ8jOCo2ZGCy1+pv7Nn7Hvwn/Zo03zfDVi2reJZ4vLvPEF8im5kB+8kQHEEZP8K8njczYBrhxOOp0NFqz0sHldbFPmeke/+R5l+w3+w3Y/s/2MfxF+IkNvffEG+hKoikSRaLE4+aKNhw0zA4eQcAZReNzP9gUUV89VqyrS557n1tChDDwVOmtAooorM2CiiigAooooAxPFvgnwd4+0l9C8b+FdJ1/T35NrqVnHcR59QrggH3HIr5f+Jn/BNH9lvxBa3msaPomueFp442mK6NqZ8tmAz9y4WVVHsoA9KKK6sLUnGaUWcWNpU503KUU36H5qfG74P+Gfhrq1xY6HfanPHExCm7ljY8eu1Frx+iivpabvE+Lqq0tAooorQzCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK0ND0+HU9QjtLhnVHIyUIB6+4NFFIEfeH7MH7BPwZ+Llp/afizWvFv7pBIYbW9t44356HMBbH0YGvuP4Y/sg/s4/COSG88G/CzSRqEBDJqGoK19dKw/iWScsYz/ALm2iivBzCpNS5bux9VlVGm48zir+h7HRRRXlnthRRRQAUUUUAf/2Q==`}
                />
            </SideBarProvider>
        </section>
    )
}
