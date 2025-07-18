
export default function FormaPagamento() {
    return (
        <section className="bg-white flex flex-col py-20 h-full">
            <h2 className='text-3xl font-semibold mb-5 ml-10'>Forma de pagamento</h2>
            <hr className='mx-5 mb-10' />
            <ul className='flex flex-col gap-10 mx-10'>
                <li onClick={() => { location.assign(`/assinar/credit-card`) }}
                    className='border border-[rgba(178,178,178,1)] rounded-lg py-5 px-5 flex items-center gap-5 cursor-pointer'>
                    <svg className='w-8 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(178,178,178,1)"><path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path></svg>
                    <p className='text-xl'>Cartão de Crédito</p>
                </li>
                <li onClick={() => { location.assign(`/assinar/pix`) }}
                    className='border border-[rgba(178,178,178,1)] rounded-lg py-5 px-5 flex items-center gap-5 cursor-pointer'>
                    <svg className='w-8 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(178,178,178,1)"><path d="M5.38545 18.1135L9.52498 22.253C10.8918 23.6199 13.1079 23.6199 14.4747 22.253L18.6143 18.1135C17.5088 18.1824 16.3802 17.7945 15.5354 16.9497L12.5302 13.9445C12.2373 13.6516 11.7624 13.6516 11.4695 13.9445L8.46432 16.9497C7.61954 17.7945 6.49092 18.1824 5.38545 18.1135ZM20.4851 16.2426L22.2529 14.4748C23.6197 13.108 23.6197 10.8919 22.2529 9.5251L20.4851 7.75734C19.3136 6.58576 17.4141 6.58576 16.2425 7.75734L13.2373 10.7625C12.5539 11.446 11.4458 11.446 10.7624 10.7625L7.75721 7.75734C6.58564 6.58576 4.68615 6.58576 3.51457 7.75734L1.74681 9.5251C0.37997 10.8919 0.37997 13.108 1.74681 14.4748L3.51457 16.2426C4.68615 17.4142 6.58564 17.4142 7.75721 16.2426L10.7624 13.2374C11.4458 12.554 12.5539 12.554 13.2373 13.2374L16.2425 16.2426C17.4141 17.4142 19.3136 17.4142 20.4851 16.2426ZM5.38545 5.88646C6.49092 5.81753 7.61954 6.20545 8.46432 7.05023L11.4695 10.0554C11.7624 10.3483 12.2373 10.3483 12.5302 10.0554L15.5354 7.05023C16.3802 6.20545 17.5088 5.81753 18.6143 5.88646L14.4747 1.74693C13.1079 0.380092 10.8918 0.380092 9.52498 1.74693L5.38545 5.88646Z"></path></svg>
                    <p className='text-xl'>PIX</p>
                </li>
                {/* <li onClick={() => { location.assign(`/assinar/boleto`) }}
                    className='border border-[rgba(178,178,178,1)] rounded-lg py-5 px-5 flex items-center gap-5 cursor-pointer'>
                    <svg className='w-8 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(178,178,178,1)"><path d="M2 4H4V20H2V4ZM6 4H7V20H6V4ZM8 4H10V20H8V4ZM11 4H13V20H11V4ZM14 4H16V20H14V4ZM17 4H18V20H17V4ZM19 4H22V20H19V4Z"></path></svg>
                    <p className='text-xl'>Boleto bancário</p>
                </li> */}

            </ul>
        </section>
    )
}
