import { useEffect, useState } from "react"
import { intervalToDuration } from 'date-fns';
import Notify from "../notify/Notify";

export default function Pix() {
    const apiURL = 'https://api.prohost.net.br';
    const [copypastepix, setCopypastepix] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const initialExpireDate = localStorage.getItem('expireDate') || '';
    const [expireDate, setExpireDate] = useState(initialExpireDate);
    const [qr, setQr] = useState('');

    const [notify, setNotify] = useState({ type: 1, text: '' });
    const [showNotify, setShowNotify] = useState<boolean>(false);

    const calculateExpirationTime = () => {
        if (!expireDate) return { hours: 0, minutes: 0, seconds: 0 };
        const expiry = new Date(expireDate);
        const now = new Date();
        const diff = intervalToDuration({ start: now, end: expiry });
        return diff;
    };
    const [expirationTime, setExpirationTime] = useState(calculateExpirationTime());

    async function gerarQR(storage: string) {
        try {
            const payResponse = await fetch(`${apiURL}/assinatura/${storage}`);
            const pay = await payResponse.json();
            setPaymentId(pay);

            const qrResponse = await fetch(`${apiURL}/assinatura/pix/${pay}`);
            const data = await qrResponse.json();

            if (data.success) {
                setQr(data.encodedImage);
                localStorage.setItem('expireDate', data.expirationDate);
                setExpireDate(data.expirationDate);
                setCopypastepix(data.payload);
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Geração do QR e contador regressivo
    useEffect(() => {
        const storage = window.localStorage.getItem('ph_pay_acc') || '';
        gerarQR(storage);

        const intervalId = setInterval(() => {
            const time = calculateExpirationTime();
            setExpirationTime({
                hours: time.hours || 0,
                minutes: time.minutes || 0,
                seconds: time.seconds || 0,
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Polling para verificar status do pagamento
    useEffect(() => {
        if (!paymentId) return;

        const checkStatus = async () => {
            try {
                const response = await fetch(`${apiURL}/assinatura/status/${paymentId}`);
                const data = await response.json();

                if (data.status === 'CONFIRMED') {
                    clearInterval(statusIntervalId);
                    setNotify({ type: 1, text: 'Pagamento confirmado! Redirecionando...' });
                    setShowNotify(true);
                    setTimeout(() => {
                        location.assign('/auth');
                    }, 2000);
                }
            } catch (error) {
                console.error('Erro ao verificar status do pagamento:', error);
            }
        };

        const statusIntervalId = setInterval(checkStatus, 5000);
        return () => clearInterval(statusIntervalId);
    }, [paymentId]);

    return (
        <section className="bg-white flex flex-col py-20 h-full">
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            <h2 className='text-3xl font-semibold mb-5 ml-10'>Pagamento com PIX</h2>
            <hr className='mx-5 mb-10' />
            <img
                className="h-64 w-fit mx-auto"
                src={`data:image/png;base64,${qr}`} alt="QR Pagamento"
            />
            <p className="text-center text-lg font-semibold mt-4">Validade do pagamento</p>
            <p className="text-center text-gray-600">
                {String(expirationTime.minutes).padStart(2, '0')}:{String(expirationTime.seconds).padStart(2, '0')}
            </p>
            <div className="flex flex-col items-center mt-6">
                <button
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors duration-200"
                    onClick={() => navigator.clipboard.writeText(copypastepix)}
                >
                    Copiar código PIX
                </button>
            </div>
        </section>
    )
}
