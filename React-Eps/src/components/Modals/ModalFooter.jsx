// TODO: Accept children or buttons as props to render specific actions
export default function ModalFooter({ children }) {
    return (
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap justify-end gap-2 sm:gap-3">
            {children}
        </div>
    )
}
