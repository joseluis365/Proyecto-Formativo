export default function ModalFooter({children}) {
    return (
        <div className="flex flex-col sm:flex-row rounded-b-lg items-center justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            {children}
        </div>
    )
}