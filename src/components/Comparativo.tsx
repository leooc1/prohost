
export default function Comparativo({ number }: { number: number }) {
    return (
        <div className="flex bg-green-100 rounded-md w-fit px-2 items-baseline">
            <svg className="w-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#82C785"><path d="M3 12H7V21H3V12ZM17 8H21V21H17V8ZM10 2H14V21H10V2Z"></path></svg>
            <p className="text-[#82C785] font-medium">{number}</p>
            <p className="text-[#82C785] font-medium ml-1">%</p>
        </div>
    )
}
