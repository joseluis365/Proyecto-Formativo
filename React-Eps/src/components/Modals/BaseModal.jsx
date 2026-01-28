export default function BaseModal({children}) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white shadow-xl w-full max-w-3xl relative flex flex-col rounded-lg">
                {children}
            </div>
        </div>
    )
}