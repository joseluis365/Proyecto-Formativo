export default function BaseModal({ children, maxWidth = "max-w-2xl" }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`bg-white dark:bg-gray-900 shadow-xl w-full ${maxWidth} relative flex flex-col rounded-2xl max-h-[90vh] dark:scheme-dark`}>
                {children}
            </div>
        </div>
    )
}
