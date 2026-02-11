export default function BackgroundItem({ label, items}) {
    return (
        <li>
      <span className="font-bold text-gray-500 dark:text-gray-400">
        {label}:
      </span>

      {/* Mini lista */}
      {items && (
        <ul className="mt-1 ml-5 space-y-1 list-inside text-gray-600 dark:text-gray-300">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </li>
    )
}