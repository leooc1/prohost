import { useEffect, useState } from "react"

const apiUrl = import.meta.env.VITE_baseURLAPI;

export default function Boleto() {
    const [link, setLink] = useState<string>('')
    async function gerarBoleto() {
        await fetch(`${apiUrl}/assinatura/boleto/${'pay_uyi79p2jasuuxzo8'}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                setLink(data)
            })
            .catch(err => console.error(err))
    }
    useEffect(() => {
        gerarBoleto()
    }, [])

    return (
        <section className="bg-white flex flex-col py-20 h-full hidden">
            <h2 className='text-3xl font-semibold mb-5 ml-10'>Pagamento com Boleto</h2>
            <hr className='mx-5 mb-10' />
            <a href={link} target="_blank"
                className="w-fit mx-auto bg-primary text-white text-xl px-3 py-2 rounded-xl" >Clique para acessar seu boleto</a>
        </section>
    )
}
