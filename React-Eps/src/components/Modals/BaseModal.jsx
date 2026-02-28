export default function BaseModal({ children }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 shadow-xl w-full max-w-2xl relative flex flex-col rounded-2xl max-h-[90vh] dark:scheme-dark">
                {children}
            </div>
        </div>
    )
}