import { useEffect, useState } from "react"

export default function Pix() {
    const [qr, setQr] = useState('')
    async function gerarQR(storage: string) {
        let pay = ''
        await fetch(`http://localhost:3000/assinatura/${storage}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                pay = data
            })
            .catch(err => console.error(err))
        await fetch(`http://localhost:3000/assinatura/pix/${pay}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    setQr(data.encodedImage)
                }
            })
            .catch(err => console.error(err))
    }
    useEffect(() => {
        const storage = window.localStorage.getItem('ph_pay_acc') || ''
        gerarQR(storage)
    }, [])
    return (
        <section className="bg-white flex flex-col py-20 h-full">
            <h2 className='text-3xl font-semibold mb-5 ml-10'>Pagamento com PIX</h2>
            <hr className='mx-5 mb-10' />
            <img
                className="h-64 w-fit mx-auto"
                src={`data:image/png;base64,${qr}`} alt="QR Pagamento" />
        </section>
    )
}
