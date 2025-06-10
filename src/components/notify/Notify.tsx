
export default function Notify({ text, type }: { text: string, type: number }) {
    return (
        <>

            {type == 1 ?
                <div className="notify fixed top-4 left-4 w-[330px] h-[80px] rounded-lg px-4 py-2 bg-white shadow-lg flex items-center justify-around gap-4 overflow-hidden">
                    <svg className="absolute rotate-90 -left-8 top-8 w-[80px] fill-[#4777ff3a]" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L0,320Z"
                            fillOpacity="1"
                        ></path>
                    </svg>

                    <div className="w-[35px] h-[35px] flex items-center justify-center rounded-full bg-[#4777ff48] ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] text-[#124fff]">
                            <path d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z" />
                            <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z" />
                        </svg>
                    </div>

                    <div className="flex flex-col items-start justify-center flex-grow">
                        <p className="text-[#124fff] font-bold text-[17px] m-0">Sucesso</p>
                        <p className="text-[#555] text-[14px] m-0">{text}</p>
                    </div>
                </div> :
                <div className="notify fixed top-4 left-4 w-[330px] h-[80px] rounded-lg px-4 py-2 bg-white shadow-lg flex items-center justify-around gap-4 overflow-hidden">
                    <svg className="absolute rotate-90 left-[-31px] top-8 w-20 fill-[#fc0c0c3a]" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L0,320Z"
                            fillOpacity="1"
                        />
                    </svg>

                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#fc0c0c48] ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-[17px] h-[17px] text-[#d10d0d] fill-current">
                            <path
                                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col items-start justify-center flex-grow">
                        <p className="text-[#d10d0d] text-[17px] font-bold m-0">Erro</p>
                        <p className="text-[#555] text-[14px] m-0">{text}</p>
                    </div>
                </div>
            }
        </>
    )
}
