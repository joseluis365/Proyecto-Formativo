export default function Pharmacy({data}) {
  
    return (
        <div> 
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">local_pharmacy</span>
            <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider">Disponibilidad en
              farmacia</h3>
          </div>
          <div className="space-y-2 text-sm">
            {data.map((item) => {
              const isAvailable = item.stock === "Disponible";
              return (
              <div className="flex items-center justify-between">
                <p className="text-gray-700 dark:text-gray-300">{item.name}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAvailable ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}>
                  {item.stock}</span>
              </div>
            )})}
          </div>
        </div>
    )
}
