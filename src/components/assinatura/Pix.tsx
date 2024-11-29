import { useEffect, useState } from "react"

export default function Pix() {
    const [qr, setQr] = useState('')
    async function gerarQR() {
        await fetch(`http://localhost:3000/assinatura/pix/${'pay_b084p8lseat78y5d'}`, {
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
        gerarQR()
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
