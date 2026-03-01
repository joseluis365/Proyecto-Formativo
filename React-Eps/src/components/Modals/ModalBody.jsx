export default function ModalBody({children}) {
    return (
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
            {children}
        </div>
    )
}
