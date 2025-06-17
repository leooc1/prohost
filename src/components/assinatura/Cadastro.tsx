import { InputMask } from "@react-input/mask"
import { useContext, useState } from "react"
import { AssinaturaContext } from "../../contexts/AssinaturaContext"
import termos from '../../../public/termos-de-uso.pdf'
import politica from '../../../public/politica-de-privacidade.pdf'
import Notify from "../notify/Notify"

export default function Cadastro() {
    const apiURL = 'https://api.prohost.net.br'
    const { planoDTO } = useContext(AssinaturaContext)
    const [button, setButton] = useState(false)
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)
    const [ruas, setRuas] = useState<{ display_name: string }[]>([])
    const [cidade, setCidade] = useState<string>('')
    const [estado, setEstado] = useState<string>('')
    estado
    const [complemento, setComplemento] = useState<string>('')
    const [bairro, setBairro] = useState<string>('')
    const [maskCpfCnpj, setMaskCpfCnpj] = useState<string>("xxx.xxx.xxx-xx")
    async function buscarCEP(cep: string) {
        await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                setCidade(data.localidade)
                setEstado(data.uf)
                setBairro(data.bairro)
                setComplemento(data.complemento)
                if (data.logradouro) {
                    const rua = document.getElementById('rua') as HTMLInputElement
                    rua.value = data.logradouro
                }

            })
            .catch(err => console.log(err))
    }
    async function buscarRua(rua: string) {
        await fetch(`https://nominatim.openstreetmap.org/search?street=${rua}&city=${cidade}&format=json`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                if (data.length > 0)
                    setRuas(data)
            })
            .catch(err => console.log(err))
    }
    async function criarConta(saas: any, user: any) {
        let idSaas = null
        let assinatura: any = null
        let pay: any = null
        let getPlano = null


        {
            await fetch(`${apiURL}/plano/${planoDTO.qtd_acomodacao}/${planoDTO.valor_ano}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(data => data.json())
                .then(async (data) => {
                    if (data.length > 0) {
                        getPlano = data[0]
                        getPlano = { ...getPlano, valor_ano: Number(getPlano.valor_ano), valor_mes: Number(getPlano.valor_mes), qtd_acomodacao: Number(getPlano.qtd_acomodacao) }
                    }
                    else {
                        await fetch(`${apiURL}/plano/`, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                "qtd_acomodacao": Number(planoDTO.qtd_acomodacao),
                                "permicao": 1,
                                "valor_mes": Number((Number(planoDTO.valor_ano) / 10).toFixed(2)),
                                "valor_ano": Number(planoDTO.valor_ano)
                            })
                        })
                            .then(data => data.json())
                            .then(data => {
                                getPlano = data
                                getPlano = { ...getPlano, valor_ano: Number(getPlano.valor_ano), valor_mes: Number(getPlano.valor_mes), qtd_acomodacao: Number(getPlano.qtd_acomodacao) }
                            })
                            .catch(err => console.log(err))
                    }
                })
        }

        if (getPlano) {
            const origem = new URL(location.href).searchParams.get('origin') || ''
            await fetch(`${apiURL}/assinatura`, {
                method: 'POST',
                body: JSON.stringify({ user: user, plano: getPlano, origin: origem }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(data => data.json())
                .then((data) => {
                    if (data.id) {
                        assinatura = data
                        pay = data.pagamento
                    }
                    else {
                        setNotify({ type: 2, text: data })
                        setShowNotify(true)
                        setTimeout(() => {
                            setShowNotify(false);
                        }, 3000)
                    }
                })
        }

        if (assinatura) {
            {
                const origem = new URL(location.href).searchParams.get('origin') || ''
                await fetch(`${apiURL}/saas`, {
                    method: 'POST',
                    body: JSON.stringify({ ...saas, assinatura: assinatura.id, origin: origem }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(data => data.json())
                    .then((data) => {
                        if (data.id) {
                            idSaas = data.id
                        }
                    })
            }

            if (idSaas) {
                const usuarioDTO = {
                    ...user, saas: { id: Number(idSaas) }, asaas_id: assinatura?.id
                }
                await fetch(`${apiURL}/users`, {
                    method: 'POST',
                    body: JSON.stringify(usuarioDTO),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(data => data.json())
                    .then((data) => {
                        if (data.id) {
                            setNotify({ type: 1, text: 'Criado!' })
                            setShowNotify(true)
                            setTimeout(() => {
                                setShowNotify(false);
                            }, 3000)
                        }
                    })
                await fetch(`${apiURL}/assinatura/crypto`, {
                    method: 'POST',
                    body: JSON.stringify({ pay }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(data => data.json())
                    .then((data) => {
                        const origem = new URL(location.href).searchParams.get('origin') || ''
                        window.localStorage.setItem('ph_pay_acc', data)
                        if (origem === 'newStudents' || origem === 'newClassmates') {
                            location.assign('/auth')
                        } else {
                            location.assign('/assinar/forma-pagamento')
                        }
                    })
            }
            else {
                setNotify({ type: 2, text: 'Ops! Algo deu errado, esse email pode já estar sendo usado.' })
                setShowNotify(true)
                setTimeout(() => {
                    setShowNotify(false);
                }, 3000)
            }
        }

    }


    return (
        <section className="bg-white flex flex-col justify-center h-full py-20 md:py-0 md:min-w-min">
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            <h2 className='text-3xl font-semibold mb-5 ml-10'>Registre-se</h2>
            <form action="" onSubmit={(e) => e.preventDefault()} className='mx-10 flex flex-col gap-2'>
                <label className='w-full text-zinc-500 flex flex-col text-sm gap-2 relative'>
                    Nome Completo
                    <svg className='h-fit w-4 fill-zinc-300 absolute top-9 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path></svg>
                    <input id='nome' type="text"
                        className='border border-zinc-300 bg-transparent text-base py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                </label>
                <label className='w-full text-zinc-500 flex flex-col text-sm gap-2 relative'>
                    CPF/CNPJ
                    <svg className='h-fit w-4 fill-zinc-300 absolute top-9 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 5C1 4.44772 1.44772 4 2 4H22C22.5523 4 23 4.44772 23 5V19C23 19.5523 22.5523 20 22 20H2C1.44772 20 1 19.5523 1 19V5ZM13 8V10H19V8H13ZM18 12H13V14H18V12ZM10.5 10C10.5 8.61929 9.38071 7.5 8 7.5C6.61929 7.5 5.5 8.61929 5.5 10C5.5 11.3807 6.61929 12.5 8 12.5C9.38071 12.5 10.5 11.3807 10.5 10ZM8 13.5C6.067 13.5 4.5 15.067 4.5 17H11.5C11.5 15.067 9.933 13.5 8 13.5Z"></path></svg>
                    <InputMask
                        mask={maskCpfCnpj}
                        replacement={{ x: /\d/ }}
                        onChange={(e) => {
                            if (e.target.value.replace(/\D/, "").length > 12) {
                                setMaskCpfCnpj('xx.xxx.xxx/xxxx-xx')
                            } else {
                                setMaskCpfCnpj('xxx.xxx.xxx-xx')
                            }
                        }}
                        id='cpfCnpj' type="text"
                        className='border border-zinc-300 bg-transparent text-base py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                </label>
                <div className='grid md:grid-cols-3 gap-5 w-full'>
                    <label className='w-full text-zinc-500 flex flex-col text-sm gap-2 relative col-span-2'>
                        E-mail
                        <svg className='h-fit w-4 fill-zinc-300 absolute top-9 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path></svg>
                        <input id='email' type="email"
                            className='border border-zinc-300 bg-transparent text-base py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                    </label>
                    <label className='w-full text-zinc-500 flex flex-col text-sm gap-2 relative'>
                        Telefone celular
                        <svg className='h-fit w-4 fill-zinc-300 absolute top-9 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path></svg>
                        <InputMask
                            mask="(xx) x xxxx-xxxx"
                            replacement={{ x: /\d/ }}
                            id='celular' type="tel"
                            className='border border-zinc-300 bg-transparent text-base py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                    </label>
                </div>
                <div className='grid md:grid-cols-4 gap-5 w-full'>
                    <label className='w-full text-zinc-500 flex flex-col text-sm gap-2 relative'>
                        CEP
                        <svg className='h-fit w-4 fill-zinc-300 absolute top-9 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path></svg>
                        <InputMask
                            mask="xxxxx-xxx"
                            replacement={{ x: /\d/ }}
                            id='cep' type="text"
                            onChange={(e) => {
                                if (e.target.value.length == 9)
                                    buscarCEP(e.target.value)
                            }}
                            className='border border-zinc-300 bg-transparent text-base py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                    </label>
                    <label className='w-full text-zinc-500 flex flex-col text-sm gap-2 relative col-span-2'>
                        Rua
                        <svg className='h-fit w-4 fill-zinc-300 absolute top-9 left-2' xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512"><g><path d="M187.53 0c-15.668 0-29.456 10.029-34.307 24.955L10.265 464.647c-3.573 10.99-1.653 23.13 5.135 32.475C22.269 506.577 32.902 512 44.574 512h29.101L190.124 0zM270.699 0v47.663c0 8.284-6.716 15-15 15s-15-6.716-15-15V0h-19.807L104.443 512h136.199v-47.663c0-8.284 6.716-15 15-15s15 6.716 15 15V512h146.539L300.733 0zm-30.086 142v-40.663c0-8.284 6.716-15 15-15s15 6.716 15 15V142c0 8.284-6.716 15-15 15s-15-6.716-15-15zm30.057 45.337V230c0 8.284-6.716 15-15 15s-15-6.716-15-15v-42.663c0-8.284 6.716-15 15-15s15 6.716 15 15zm-30.029 88c0-8.284 6.716-15 15-15s15 6.716 15 15V318c0 8.284-6.716 15-15 15s-15-6.716-15-15zM270.699 407c0 8.284-6.716 15-15 15s-15-6.716-15-15v-42.663c0-8.284 6.716-15 15-15s15 6.716 15 15zM501.897 465.289 367.928 25.597C363.263 10.287 349.394 0 333.418 0h-1.917l116.448 512h19.438c11.537 0 22.098-5.324 28.974-14.607 6.897-9.312 8.915-21.014 5.536-32.104z" opacity="1" data-original="#000000" ></path></g></svg>
                        <input
                            onBlur={() => {
                                setRuas([])
                            }}
                            autoComplete="new-password"
                            onChange={(e) => {
                                if (e.target.value.length == 0)
                                    setRuas([])
                                buscarRua(e.target.value)
                            }}
                            id='rua' type="text"
                            className='border border-zinc-300 bg-transparent text-base py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                        {ruas.length > 0 && (false) && <section className="absolute bg-white top-full w-full z-10">
                            <ul className="flex flex-col w-full gap-2 bg-white">
                                {ruas.map(r => <li onClick={(e) => {
                                    e.stopPropagation()
                                    const ruaInput = document.getElementById('rua') as HTMLInputElement
                                    ruaInput.value = r.display_name.split(', ')[0]
                                    setRuas([])
                                }} className="cursor-pointer border border-zinc-400 rounded-md px-1">
                                    {r.display_name.split(',')[0]},
                                    {r.display_name.split(',')[r.display_name.split(',').findIndex(e => e.trim().startsWith('Região')) - 1]}
                                </li>)}
                            </ul>
                        </section>}
                    </label>
                    <label className='w-full text-zinc-500 flex flex-col text-sm gap-2 relative'>
                        Número
                        <svg className='h-fit w-4 fill-zinc-300 absolute top-9 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20ZM11 13V19H13V13H11Z"></path></svg>
                        <input id='num' type="text"
                            className='border border-zinc-300 bg-transparent text-base py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                    </label>
                </div>
                <label className='w-full text-zinc-500 flex flex-col text-sm gap-2 relative'>
                    Crie uma senha
                    <svg className='h-fit w-4 fill-zinc-300 absolute top-9 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17ZM11 14V18H13V14H11Z"></path></svg>
                    <input id='senha' type="password"
                        className='border border-zinc-300 bg-transparent text-base py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                </label>
                <section className='flex gap-10 mt-4'>
                    <button className={`py-2 text-white text-xl font-medium px-10 rounded-lg ${button ? 'bg-primary' : 'bg-zinc-400 cursor-no-drop'}`}
                        onClick={() => {
                            const celular = document.getElementById('celular') as HTMLInputElement
                            const cpf_cnpj = document.getElementById('cpfCnpj') as HTMLInputElement
                            const end_rua = document.getElementById('rua') as HTMLInputElement
                            const end_num = document.getElementById('num') as HTMLInputElement
                            const end_cep = document.getElementById('cep') as HTMLInputElement
                            const nome = document.getElementById('nome') as HTMLInputElement
                            const email = document.getElementById('email') as HTMLInputElement
                            const senha = document.getElementById('senha') as HTMLInputElement
                            if (celular.value.length > 0 && cpf_cnpj.value.length > 0 && end_rua.value.length > 0 && end_num.value.length > 0 && end_cep.value.length > 0 && nome.value.length > 0 && email.value.length > 0 && senha.value.length > 0 && button) {
                                const origem = new URL(location.href).searchParams.get('origin') || ''
                                const cycle = new URL(location.href).searchParams.get('cycle') || ''
                                const trial = new Date();
                                if (origem === 'newStudents') {
                                    trial.setMonth(trial.getMonth() + 6);
                                } else if (origem === 'newClassmates') {
                                    trial.setFullYear(trial.getFullYear() + 1);
                                }
                                else {
                                    if (cycle == 'MONTHLY')
                                        trial.setMonth(trial.getMonth() + 1);
                                    else
                                        trial.setFullYear(trial.getFullYear() + 1);
                                    trial.setDate(trial.getDate() + 15);
                                }
                                criarConta({
                                    assinatura: null,
                                    master: email.value,
                                    nome: nome.value,
                                    trial_end: trial.toISOString().split('T')[0],
                                    origin: origem
                                },
                                    {
                                        asaas_id: '',
                                        celular: celular.value,
                                        cpf_cnpj: cpf_cnpj.value,
                                        end_rua: end_rua.value,
                                        end_num: end_num.value,
                                        end_bairro: bairro,
                                        end_comp: complemento,
                                        end_cep: end_cep.value,
                                        nome: nome.value,
                                        saas: undefined,
                                        email: email.value,
                                        senha: senha.value
                                    }
                                )

                            }
                        }}
                    >Avançar</button>
                    <label htmlFor="termos" className='flex gap-2 items-center font-light'>
                        <input type="checkbox" name="termos" id="termos" className='cursor-pointer' onChange={(e) => setButton(e.target.checked)} />
                        Aceito os <a href="#"
                            onClick={() => {
                                window.open(termos, '_blank')
                                window.open(politica, '_blank')
                            }}
                            className='text-primary italic font-medium'>Termos de Uso</a>
                    </label>
                </section>
            </form >
        </section >
    )
}
