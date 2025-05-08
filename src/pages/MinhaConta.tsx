import { useContext, useEffect, useState } from "react"
import Loader from "../components/Loader"
import { SideBarContext } from "../contexts/SideBarMenuContext"

export default function MinhaConta() {
    const apiURL = 'https://api.prohost.net.br'
    useEffect(() => { document.title = 'Minha conta | Prohost' }, [])


    const { dataToken } = useContext(SideBarContext)
    const [fieldForm, setFieldForm] = useState([false, false, false])
    const [loaded, setLoaded] = useState(false)
    const [updateSenha, setUpdateSenha] = useState(false)
    const [user, setUser] = useState({ nome: '', email: '' })
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    function Perfil(nome: string) {
        const array = nome.split(' ')
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
            .then((data: any[]) => {
                setUser({ nome: data[0].nome, email: data[0].email })
                setNome(data[0].nome)
                setEmail(data[0].email)
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
                alert(data)
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
                <section className="w-full flex justify-center">
                    <form onSubmit={(e) => { e.preventDefault() }}
                        style={{ width: '-webkit-fill-available' }}
                        className="flex rounded-md flex-col absolute px-4 pb-3 gap-4 top-1/2 right-1/2 min-w-72 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                        <div className="m-auto w-16 h-16 flex justify-center items-center rounded-full bg-[#B1C2D9] text-white font-medium text-4xl">
                            {dataToken ? Perfil(nome) : 'NOT'}
                        </div>

                        <label htmlFor="nome" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center gap-10">Nome
                                <label
                                    className="relative text-zinc-500 flex cursor-pointer items-center justify-center gap-[1em]"
                                    htmlFor="check-name"
                                >
                                    <input className="peer appearance-none" id="check-name" name="check-name" type="checkbox" checked={fieldForm[0]}
                                        onChange={(e) => {
                                            if (!e.target.checked) { setNome(user.nome) }
                                            setFieldForm([e.target.checked, fieldForm[1], fieldForm[2]])
                                        }} />
                                    <span
                                        className="absolute left-0 top-1/2 h-5 w-5 -translate-x-full -translate-y-1/2 rounded-[0.25em] border-[2px] border-zinc-500"
                                    >
                                    </span>
                                    <svg
                                        viewBox="0 0 69 89"
                                        className="absolute left-0 top-1/2 h-5 w-5 -translate-x-full -translate-y-1/2 duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
                                        fill="none"
                                        height="89"
                                        width="69"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M.93 63.984c3.436.556 7.168.347 10.147 2.45 4.521 3.19 10.198 8.458 13.647 12.596 1.374 1.65 4.181 5.922 5.598 8.048.267.4-1.31.823-1.4.35-5.744-30.636 9.258-59.906 29.743-81.18C62.29 2.486 63.104 1 68.113 1"
                                            stroke-width="6px"
                                            stroke="#71717a"
                                            pathLength="100"
                                        ></path>
                                    </svg>
                                </label>
                            </span>
                            <input type="text" name="nome" id="nome" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" autoComplete="off" defaultValue={user.nome}
                                disabled={!fieldForm[0]} value={!fieldForm[0] ? user.nome : nome}
                                onChange={(e) => { setNome(e.target.value) }} />
                        </label>
                        <label htmlFor="email" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center gap-10">Email
                                <label
                                    className="relative text-zinc-500 flex cursor-pointer items-center justify-center gap-[1em]"
                                    htmlFor="check-email"
                                >
                                    <input className="peer appearance-none" id="check-email" name="check-email" type="checkbox"
                                        checked={fieldForm[1]} onChange={(e) => {
                                            if (!e.target.checked) { setEmail(user.email) } setFieldForm([fieldForm[0], e.target.checked, fieldForm[2]])
                                        }} />
                                    <span
                                        className="absolute left-0 top-1/2 h-5 w-5 -translate-x-full -translate-y-1/2 rounded-[0.25em] border-[2px] border-zinc-500"
                                    >
                                    </span>
                                    <svg
                                        viewBox="0 0 69 89"
                                        className="absolute left-0 top-1/2 h-5 w-5 -translate-x-full -translate-y-1/2 duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
                                        fill="none"
                                        height="89"
                                        width="69"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M.93 63.984c3.436.556 7.168.347 10.147 2.45 4.521 3.19 10.198 8.458 13.647 12.596 1.374 1.65 4.181 5.922 5.598 8.048.267.4-1.31.823-1.4.35-5.744-30.636 9.258-59.906 29.743-81.18C62.29 2.486 63.104 1 68.113 1"
                                            stroke-width="6px"
                                            stroke="#71717a"
                                            pathLength="100"
                                        ></path>
                                    </svg>
                                </label>
                            </span>
                            <input type="email" name="email" id="email" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" autoComplete="off" defaultValue={user.email} disabled={!fieldForm[1]} value={!fieldForm[1] ? user.email : email}
                                onChange={(e) => { setEmail(e.target.value) }} />
                        </label>
                        {updateSenha && <label htmlFor="senha" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center gap-10">Senha atual
                            </span>
                            <input type="password" name="senha" id="senha" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" autoComplete="off" placeholder="••••••••" />
                        </label>}
                        <label htmlFor="nova-senha" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-sm flex items-center gap-10">Nova senha
                                <label
                                    className="relative text-zinc-500 flex cursor-pointer items-center justify-center gap-[1em]"
                                    htmlFor="check-senha"
                                >
                                    <input className="peer appearance-none" id="check-senha" name="check-senha" type="checkbox" checked={updateSenha} onChange={(e) => {
                                        setUpdateSenha(e.target.checked)
                                        setFieldForm([fieldForm[0], fieldForm[1], e.target.checked,])
                                    }} />
                                    <span
                                        className="absolute left-0 top-1/2 h-5 w-5 -translate-x-full -translate-y-1/2 rounded-[0.25em] border-[2px] border-zinc-500"
                                    >
                                    </span>
                                    <svg
                                        viewBox="0 0 69 89"
                                        className="absolute left-0 top-1/2 h-5 w-5 -translate-x-full -translate-y-1/2 duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
                                        fill="none"
                                        height="89"
                                        width="69"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M.93 63.984c3.436.556 7.168.347 10.147 2.45 4.521 3.19 10.198 8.458 13.647 12.596 1.374 1.65 4.181 5.922 5.598 8.048.267.4-1.31.823-1.4.35-5.744-30.636 9.258-59.906 29.743-81.18C62.29 2.486 63.104 1 68.113 1"
                                            stroke-width="6px"
                                            stroke="#71717a"
                                            pathLength="100"
                                        ></path>
                                    </svg>
                                </label>
                            </span>
                            <input onChange={(e) => {
                                if (e.target.value.length > 0)
                                    setUpdateSenha(true)
                                else
                                    setUpdateSenha(false)
                            }} type="password" name="nova-senha" id="nova-senha" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" autoComplete="off" disabled={!fieldForm[2]} placeholder="••••••••" />
                        </label>


                        <section className="flex gap-3 justify-end mt-2">
                            <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                                onClick={() => {
                                    const senhaAtual = document.getElementById('senha') as HTMLInputElement
                                    const senhaNova = document.getElementById('nova-senha') as HTMLInputElement
                                    if ((fieldForm[0] && !(nome.length > 0))
                                        || (fieldForm[1] && !(email.length > 0))
                                        || (fieldForm[2] && (!(senhaAtual.value.length > 0) || !(senhaNova.value.length > 0)))) {
                                        alert('dados incorretos para edição do perfil')
                                    }
                                    else if (!fieldForm[0] &&
                                        !fieldForm[1] &&
                                        !fieldForm[2]) { alert('nao há nada para ser editado') }
                                    else {
                                        updateUser({
                                            nome,
                                            email,
                                            senhaAtual: fieldForm[2] ? senhaAtual.value : null,
                                            senhaNova: fieldForm[2] ? senhaNova.value :
                                                null
                                        })
                                    }



                                }}>Editar meu perfil</button>
                        </section>
                    </form>
                </section>
            </div>
            :
            <Loader />
    )
}
