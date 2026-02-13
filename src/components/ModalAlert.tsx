interface ModalAlertProps {
    title: string;
    message: string;
    onClose:() => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    colorButton?: string;
}

export function ModalAlert({
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    colorButton = "red",
}: ModalAlertProps) {
    const colorMap = {
        red: "bg-red-600 hover:bg-red-700",
        blue: "bg-blue-600 hover:bg-blue-700",
        green: "bg-green-600 hover:bg-green-700",
  
    }
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold">{title}</h2>
                <hr className="my-4"/>
                <p className="mt-2 text-zinc-600">{message}</p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg rounded-md border border-zinc-300"
                        onClick={onClose}
                    >
                            {cancelText}
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${colorMap[colorButton as keyof typeof colorMap] || "bg-red-600 hover:bg-red-700"} text-white`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}