import { useState } from "react";
import Notify from "../notify/Notify";

export default function AddTrialModal({ close, saasId }: { close: () => void, saasId: number }) {
    const apiURL = import.meta.env.VITE_API_URL
    const [days, setDays] = useState<number>(15)
    const [notify, setNotify] = useState({ type: 1, text: 'Adicionado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)

    async function addTrial() {
        const token = localStorage.getItem('ph_token_acc');
        await fetch(`${apiURL}/admin/users/${saasId}/trial`, {
            method: 'POST',
            body: JSON.stringify({ days }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.success) {
                    setNotify({ type: 1, text: 'Dias adicionados!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                        close();
                        location.reload()
                    }, 2000)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className='w-screen h-screen fixed z-20 top-0 right-0 flex items-center justify-center'>
            <div className="w-screen h-screen bg-black absolute top-0 right-0 bg-opacity-20" onClick={close}></div>
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            <div className="bg-white p-6 rounded-lg z-30 flex flex-col gap-4 min-w-[300px]">
                <h3 className="text-xl font-bold">Adicionar Trial</h3>
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Dias</span>
                    <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} className="border border-gray-300 rounded-md px-2 py-1" />
                </label>
                <div className="flex justify-end gap-2">
                    <button onClick={close} className="px-4 py-2 border rounded-md">Cancelar</button>
                    <button onClick={addTrial} className="px-4 py-2 bg-primary text-white rounded-md">Adicionar</button>
                </div>
            </div>
        </div>
    )
}