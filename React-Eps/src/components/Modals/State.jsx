import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
export default function State({state}) {
    return (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <TaskAltRoundedIcon className="text-gray-500 dark:text-gray-400" />
            <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider">Estado de la orden
            </h3>
          </div>
          <div
            className="bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {state}
            </p>
          </div>
        </div>
    )
}
