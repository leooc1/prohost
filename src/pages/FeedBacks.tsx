import { useState } from "react"
import FeedBack from "../components/FeedBack"

export default function FeedBacks() {
    const [novoFeedBack, setNovoFeedBack] = useState(true)
    return (
        <div className="flex w-full min-h-screen h-full flex-col px-8">
            {novoFeedBack && <FeedBack close={() => setNovoFeedBack(false)} />}
            <section className="flex justify-between items-center">
                <h3 className="text-3xl font-semibold mb-7 pt-2">Feedbacks</h3>
                <button className='px-3 py-2 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
                    onClick={() => setNovoFeedBack(true)}>Nova Reserva</button>
            </section>
            <ul className="border border-black min-h-40"></ul>
        </div>
    )
}
