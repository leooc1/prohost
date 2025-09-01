import { ChangeEvent, useContext, useEffect, useState } from "react"
import Loader from "../components/Loader"
import Notify from "../components/notify/Notify"
import { SideBarContext } from "../contexts/SideBarMenuContext"

export default function MinhaConta() {
    const apiURL = import.meta.env.VITE_API_URL
    useEffect(() => { document.title = 'Minha conta | Prohost' }, [])


    const { dataToken } = useContext(SideBarContext)
    // const [fieldForm, setFieldForm] = useState([false, false, false])
    const [loaded, setLoaded] = useState(false)
    const [updateSenha, setUpdateSenha] = useState(false)
    const [user, setUser] = useState({ nome: '', email: '' })
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [foto, setFoto] = useState<null | string>(null)
    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)
    const [viewPW, setViewPW] = useState(false)

    function Perfil(nome: string) {
        const array = nome.trim().split(' ')
        const pnome = array[0][0]
        const unome = array[array.length - 1][0]
        if (array.length - 1 == 0)
            return pnome || ''
        else
            return pnome + (unome ? unome : '')

    }
    async function getInfo() {
        await fetch(`${apiURL}/users/${dataToken.idUsu}/info`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: any) => {
                setFoto(data.foto)
                setUser({ nome: data.nome, email: data.master })
                setNome(data.nome)
                setEmail(data.master)
                setLoaded(true)
            })
            .catch(err => console.log(err))
    }
    async function updateUser(pbody: any) {
        await fetch(`${apiURL}/users/${dataToken.idUsu}/info`, {
            method: 'PUT',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data == 'Senha atual está incorreta')
                    setNotify({ type: 2, text: 'Senha atual está incorreta' + '!' })
                else
                    setNotify({ type: 1, text: 'Informações atualizadas com sucesso' + '!' })
                setShowNotify(true)
                setTimeout(() => {
                    setShowNotify(false);
                }, 3000)
            })
            .catch(err => console.log(err))
    }
    async function updateFoto(imagem: string) {
        await fetch(`${apiURL}/users/${dataToken.idUsu}/foto`, {
            method: 'PUT',
            body: JSON.stringify({ foto: (imagem && imagem.length > 0) ? imagem : null }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected)
                    location.reload()
                else {
                    setNotify({ type: 2, text: 'Não foi possível atualizar essa foto.' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getInfo()
    }, [dataToken])
    return (
        loaded ?
            <div className="w-full px-8">
                <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                    <h3 className="text-3xl font-semibold">Minha conta</h3>
                </div>
                {showNotify && <Notify type={notify.type} text={notify.text} />}
                <section className="w-full flex justify-center p-12">
                    <form onSubmit={(e) => { e.preventDefault() }}
                        style={{ width: '-webkit-fill-available' }}
                        className="flex rounded-md flex-col absolute px-12 pb-12 gap-4 top-1/2 right-1/2 min-w-72 translate-x-1/2 -translate-y-1/2 bg-white pt-12 max-h-[400px] overflow-scroll scroll-default">
                        <label htmlFor="foto" className="cursor-pointer w-fit m-auto relative">
                            {!foto ? <>
                                <button className="absolute bg-blue-100 w-7 h-7 rounded-full -bottom-1 -right-2"
                                    onClick={() => {
                                        const input = document.getElementById('foto') as HTMLInputElement
                                        input.click()
                                    }}>
                                    <svg className="h-fit w-5 m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3E6BED"><path d="M12.8995 6.85453L17.1421 11.0972L7.24264 20.9967H3V16.754L12.8995 6.85453ZM14.3137 5.44032L16.435 3.319C16.8256 2.92848 17.4587 2.92848 17.8492 3.319L20.6777 6.14743C21.0682 6.53795 21.0682 7.17112 20.6777 7.56164L18.5563 9.68296L14.3137 5.44032Z"></path></svg>
                                </button>
                                <div className="m-auto w-16 h-16 flex justify-center items-center rounded-full bg-[#B1C2D9] text-white font-medium text-4xl">
                                    {dataToken ? Perfil(nome) : 'NOT'}
                                </div>
                            </>
                                :
                                <>
                                    <button className="absolute bg-red-100 w-7 h-7 rounded-full -bottom-1 -right-2"
                                        onClick={() => { updateFoto('') }}>
                                        <svg className="h-fit w-5 m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9ZM9 12V18H11V12H9ZM13 12V18H15V12H13Z"></path></svg>
                                    </button>
                                    <img className="m-auto w-16 h-16 flex justify-center items-center rounded-full bg-[#B1C2D9] text-white font-medium text-4xl" src={foto} />
                                </>

                            }
                            <input type="file" name="foto" id="foto" accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif, .bmp, .dib, .tif, .tiff, .webp, .heic, .heif, .svg, .ico, .cur, .apng" className="hidden"
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (e: ProgressEvent<FileReader>) => {
                                            if (e.target?.result) {
                                                const imageData = e.target.result as string;
                                                setFoto(imageData);
                                                updateFoto(imageData);
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                    else {
                                        // updateFoto('');
                                        // setFoto('')
                                    }
                                }}
                            />
                        </label>

                        <label htmlFor="nome" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center gap-4">
                                Nome
                            </span>
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                autoComplete="off"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </label>
                        <label htmlFor="email" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center gap-4">
                                Email
                            </span>
                            <input
                                disabled
                                type="email"
                                name="email"
                                id="email"
                                className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        {updateSenha && (
                            <>
                                <label htmlFor="senha" className="flex flex-col relative">
                                    <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center">Senha atual</span>
                                    <div className="relative">
                                        <input
                                            type={viewPW ? 'text' : 'password'}
                                            name="senha"
                                            id="senha"
                                            className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full"
                                            autoComplete="off"
                                            placeholder="••••••••"
                                            value={senhaAtual}
                                            onChange={e => setSenhaAtual(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                            tabIndex={-1}
                                            onClick={() => setViewPW(!viewPW)}
                                        >
                                            {viewPW ? (
                                                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-7-10-7a20.727 20.727 0 0 1 3.153-3.905m3.197-2.385A9.956 9.956 0 0 1 12 5c5.523 0 10 7 10 7a20.727 20.727 0 0 1-3.153 3.905m-3.197 2.385A9.956 9.956 0 0 1 12 19c-1.07 0-2.104-.167-3.075-.475M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.42 12.29A10.05 10.05 0 0 1 12 5c5.523 0 10 7 10 7s-4.477 7-10 7a10.05 10.05 0 0 1-10-7z" />
                                                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </label>
                                <label htmlFor="nova-senha" className="flex flex-col relative">
                                    <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center">Nova senha</span>
                                    <div className="relative">
                                        <input
                                            type={viewPW ? 'text' : 'password'}
                                            name="nova-senha"
                                            id="nova-senha"
                                            className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full"
                                            autoComplete="off"
                                            placeholder="••••••••"
                                            value={novaSenha}
                                            onChange={e => setNovaSenha(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                            tabIndex={-1}
                                            onClick={() => setViewPW(!viewPW)}
                                        >
                                            {viewPW ? (
                                                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-7-10-7a20.727 20.727 0 0 1 3.153-3.905m3.197-2.385A9.956 9.956 0 0 1 12 5c5.523 0 10 7 10 7a20.727 20.727 0 0 1-3.153 3.905m-3.197 2.385A9.956 9.956 0 0 1 12 19c-1.07 0-2.104-.167-3.075-.475M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.42 12.29A10.05 10.05 0 0 1 12 5c5.523 0 10 7 10 7s-4.477 7-10 7a10.05 10.05 0 0 1-10-7z" />
                                                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </label>
                                <label htmlFor="confirmar-senha" className="flex flex-col relative">
                                    <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center">Confirmar nova senha</span>
                                    <div className="relative">
                                        <input
                                            type={viewPW ? 'text' : 'password'}
                                            name="confirmar-senha"
                                            id="confirmar-senha"
                                            className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full"
                                            autoComplete="off"
                                            placeholder="••••••••"
                                            value={confirmarSenha}
                                            onChange={e => setConfirmarSenha(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                            tabIndex={-1}
                                            onClick={() => setViewPW(!viewPW)}
                                        >
                                            {viewPW ? (
                                                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-7-10-7a20.727 20.727 0 0 1 3.153-3.905m3.197-2.385A9.956 9.956 0 0 1 12 5c5.523 0 10 7 10 7a20.727 20.727 0 0 1-3.153 3.905m-3.197 2.385A9.956 9.956 0 0 1 12 19c-1.07 0-2.104-.167-3.075-.475M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.42 12.29A10.05 10.05 0 0 1 12 5c5.523 0 10 7 10 7s-4.477 7-10 7a10.05 10.05 0 0 1-10-7z" />
                                                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </label>
                            </>
                        )}

                        <section className="flex gap-3 justify-end mt-2">
                            <button
                                type="button"
                                className="px-3 py-2 border border-zinc-300 rounded-lg text-primary bg-white border-primary"
                                onClick={() => setUpdateSenha(!updateSenha)}
                            >
                                {updateSenha ? "Cancelar alteração de senha" : "Alterar senha"}
                            </button>
                            <button
                                className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                                onClick={() => {
                                    const body: any = {};
                                    let hasChange = false;

                                    if (nome !== user.nome && nome.length > 0) {
                                        body.nome = nome;
                                        hasChange = true;
                                    }
                                    if (email !== user.email && email.length > 0) {
                                        body.email = email;
                                        hasChange = true;
                                    }
                                    if (updateSenha) {
                                        if (!senhaAtual || !novaSenha || !confirmarSenha) {
                                            setNotify({ type: 2, text: 'Preencha todos os campos de senha!' })
                                            setShowNotify(true)
                                            setTimeout(() => setShowNotify(false), 3000)
                                            return;
                                        }
                                        if (novaSenha !== confirmarSenha) {
                                            setNotify({ type: 2, text: 'As senhas não coincidem!' })
                                            setShowNotify(true)
                                            setTimeout(() => setShowNotify(false), 3000)
                                            return;
                                        }
                                        body.senhaAtual = senhaAtual;
                                        body.senhaNova = novaSenha;
                                        hasChange = true;
                                    }

                                    if (!hasChange) {
                                        setNotify({ type: 2, text: 'Não há nada para ser editado!' })
                                        setShowNotify(true)
                                        setTimeout(() => setShowNotify(false), 3000)
                                        return;
                                    }

                                    updateUser(body)
                                }}
                            >
                                Editar meu perfil
                            </button>
                        </section>
                    </form>
                </section>
            </div>
            :
            <Loader />
    )
}