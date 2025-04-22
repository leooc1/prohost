import React, { useContext, useEffect, useState } from "react"
import { SideBarContext } from "../contexts/SideBarMenuContext"
import RegistrarDespesa from "./RegistrarDespesa"

export default function TopBar({ children }: { children?: React.JSX.Element }) {
    const { active, setActive, dataToken } = useContext(SideBarContext)
    const [notify, setNotify] = useState(false)
    const [registrar, setRegistrar] = useState(false)
    const [recorrencia, setRecorrencia] = useState<any[]>([])
    const [despesa, setDespesa] = useState<any[]>([])

    const apiURL = 'https://api.prohost.net.br'
    function Perfil(nome: string) {
        const array = nome.split(' ')
        const pnome = array[0][0]
        const unome = array[array.length - 1][0]
        if (array.length - 1 == 0)
            return pnome
        else
            return pnome + unome

    }
    async function getNotify() {
        await fetch(`${apiURL}/recorrencia/` + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: []) => {
                setRecorrencia(data)
            })
            .catch(err => console.log(err))
    }
    async function deleteRecorrencia(id: number) {
        await fetch(`${apiURL}/recorrencia/${id}`, {
            method: 'DELETE',
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    alert('DELETADO!')
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getNotify()
    }, [dataToken])

    return (
        <div className="bg-white w-full shadow-xs h-12 pl-4 pr-6 flex justify-between items-center mb-4">
            <div className="flex h-full">
                <button onClick={() => setActive(!active)}>
                    <svg className="w-7 h-fit transition-all duration-75 hover:brightness-50" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 24 24"><g><symbol id="d" viewBox="0 -48 48 48"></symbol><symbol id="c" viewBox="0 -48 48 48"><g clip-path="url(#a)"><g stroke="#000" stroke-miterlimit="10" stroke-width=".25"><path d="M2-48V0M4-48V0M6-48V0M8-48V0M10-48V0M12-48V0M14-48V0M16-48V0M18-48V0M20-48V0M22-48V0M24-48V0M26-48V0M28-48V0M30-48V0M32-48V0M34-48V0M36-48V0M38-48V0M40-48V0M42-48V0M44-48V0M46-48V0" fill="" opacity="1"></path></g><g fill="none" stroke="#000" stroke-miterlimit="10" stroke-width=".25"><path d="M0-2h48M0-4h48M0-6h48M0-8h48M0-10h48M0-12h48M0-14h48M0-16h48M0-18h48M0-20h48M0-22h48M0-24h48M0-26h48M0-28h48M0-30h48M0-32h48M0-34h48M0-36h48M0-38h48M0-40h48M0-42h48M0-44h48M0-46h48" fill="" opacity="1"></path></g><path d="M47.75-.25v-47.5H.25v47.5zM48 0H0v-48h48z" fill="#37425A" opacity="1"></path></g></symbol><clipPath id="a"><path d="M0-48h48V0H0z" fill="#37425A" opacity="1"></path></clipPath><symbol id="e" viewBox="0 -48 48 48"><g opacity=".4"><g clip-path="url(#b)"><path d="M47.75-.25v-47.5H.25v47.5zM48 0H0v-48h48z" fill="#37425A" opacity="1"></path></g></g></symbol><clipPath id="b"><path d="M0-48h48V0H0z" fill="#37425A" opacity="1"></path></clipPath><path d="M4 12a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM4 7a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM4 17a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z" fill="#37425A" opacity="1" ></path></g></svg>
                </button>
                {children}
            </div>
            <div className="flex items-center gap-7">
                <section className="relative">
                    <button onClick={() => setNotify(!notify)}>
                        <svg className="w-7 h-fit transition-all duration-75 hover:brightness-50" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 90 90"><g><path d="M55.434 72.521c0 3.712-1.979 6.553-5.193 8.41a10.37 10.37 0 0 1-10.379 0c-3.215-1.857-5.193-4.698-5.193-8.41M45.049 7.708c2.832 0 5.113 1.746 5.113 4.431 0 1.69.059 2.951 1.121 3.274 9.031 2.727 14.822 9.119 14.822 17.42v13.952c0 6.392 2.615 7.686 5.906 10.131 4.766 3.535 3.678 10.896-1.791 10.891H19.88c-5.469.005-6.557-7.356-1.791-10.891 3.287-2.445 5.906-3.739 5.906-10.131V32.833c0-8.301 5.791-14.693 14.822-17.42 1.059-.323 1.121-1.584 1.121-3.274.001-2.685 2.283-4.431 5.111-4.431z" fill="#37425A" opacity="1" data-original="#000000"></path></g></svg>
                    </button>
                    {notify ?
                        (recorrencia.length > 0 && <section className="absolute bg-[#37425A] text-white top-10 right-0 w-max rounded-xl p-4">
                            <ul className="flex flex-col gap-1">
                                {recorrencia.map(r =>
                                    <li className='flex'>
                                        {r.despesa.data.split('-')[2]}/
                                        {r.despesa.data.split('-')[1]}/
                                        {r.despesa.data.split('-')[0]} - {r.despesa.nome}
                                        <span className=" ml-5 flex gap-4">
                                            <button onClick={() => {
                                                const confirmar = confirm('Deseja excluir essa notificação?')
                                                if (confirmar)
                                                    deleteRecorrencia(r.id)
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-fit text-red-300' viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"></path></svg>
                                            </button>
                                            <button onClick={() => {
                                                setDespesa(r.despesa)
                                                setRegistrar(true)
                                            }} >
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    className='w-7 h-fit text-green-300' viewBox="0 0 24 24" fill="currentColor"><path d="M10.0072 2.10365C8.60556 1.64993 7.08193 2.28104 6.41168 3.59294L5.6059 5.17011C5.51016 5.35751 5.35775 5.50992 5.17036 5.60566L3.59318 6.41144C2.28128 7.08169 1.65018 8.60532 2.10389 10.0069L2.64935 11.6919C2.71416 11.8921 2.71416 12.1077 2.64935 12.3079L2.10389 13.9929C1.65018 15.3945 2.28129 16.9181 3.59318 17.5883L5.17036 18.3941C5.35775 18.4899 5.51016 18.6423 5.6059 18.8297L6.41169 20.4068C7.08194 21.7187 8.60556 22.3498 10.0072 21.8961L11.6922 21.3507C11.8924 21.2859 12.1079 21.2859 12.3081 21.3507L13.9931 21.8961C15.3947 22.3498 16.9183 21.7187 17.5886 20.4068L18.3944 18.8297C18.4901 18.6423 18.6425 18.4899 18.8299 18.3941L20.4071 17.5883C21.719 16.9181 22.3501 15.3945 21.8964 13.9929L21.3509 12.3079C21.2861 12.1077 21.2861 11.8921 21.3509 11.6919L21.8964 10.0069C22.3501 8.60531 21.719 7.08169 20.4071 6.41144L18.8299 5.60566C18.6425 5.50992 18.4901 5.3575 18.3944 5.17011L17.5886 3.59294C16.9183 2.28104 15.3947 1.64993 13.9931 2.10365L12.3081 2.6491C12.1079 2.71391 11.8924 2.71391 11.6922 2.6491L10.0072 2.10365ZM8.19271 4.50286C8.41612 4.06556 8.924 3.8552 9.39119 4.00643L11.0762 4.55189C11.6768 4.74632 12.3235 4.74632 12.9241 4.55189L14.6091 4.00643C15.0763 3.8552 15.5841 4.06556 15.8076 4.50286L16.6133 6.08004C16.9006 6.64222 17.3578 7.09946 17.92 7.38668L19.4972 8.19246C19.9345 8.41588 20.1448 8.92375 19.9936 9.39095L19.4481 11.076C19.2537 11.6766 19.2537 12.3232 19.4481 12.9238L19.9936 14.6088C20.1448 15.076 19.9345 15.5839 19.4972 15.8073L17.92 16.6131C17.3578 16.9003 16.9006 17.3576 16.6133 17.9197L15.8076 19.4969C15.5841 19.9342 15.0763 20.1446 14.6091 19.9933L12.9241 19.4479C12.3235 19.2535 11.6768 19.2535 11.0762 19.4479L9.3912 19.9933C8.924 20.1446 8.41612 19.9342 8.19271 19.4969L7.38692 17.9197C7.09971 17.3576 6.64246 16.9003 6.08028 16.6131L4.50311 15.8073C4.06581 15.5839 3.85544 15.076 4.00668 14.6088L4.55213 12.9238C4.74656 12.3232 4.74656 11.6766 4.55213 11.076L4.00668 9.39095C3.85544 8.92375 4.06581 8.41588 4.50311 8.19246L6.08028 7.38668C6.64246 7.09946 7.09971 6.64222 7.38692 6.08004L8.19271 4.50286ZM6.75972 11.7573L11.0023 15.9999L18.0734 8.92885L16.6592 7.51464L11.0023 13.1715L8.17394 10.343L6.75972 11.7573Z"></path></svg>
                                            </button>
                                        </span>
                                        <hr />
                                    </li>
                                )}
                            </ul>
                        </section>)
                        :
                        (recorrencia.length > 0 && <section className="absolute bg-red-500 -top-1 -right-1 rounded-full w-5 h-5 flex justify-center items-center text-white">
                            <span className="text-xs font-semibold">{recorrencia.length}</span>
                        </section>)
                    }
                </section>
                <div className="w-8 h-8 flex justify-center items-center rounded-full bg-[#B1C2D9] text-white font-medium">
                    {dataToken ? Perfil(dataToken.nome) : 'NOT'}
                </div>
            </div>
            {registrar &&
                <RegistrarDespesa saas={dataToken.id}
                    close={() => setRegistrar(false)} 
                    despesa={despesa}/>}
        </div>
    )
}
