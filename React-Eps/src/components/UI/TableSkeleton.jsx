import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TableSkeleton({ rows = 5, columns = 4 }) {
    const isDark = document.documentElement.classList.contains("dark");

  return (
    <SkeletonTheme
      baseColor={isDark ? "#374151" : "#e5e7eb"}
      highlightColor={isDark ? "#4B5563" : "#f3f4f6"}
    >
    <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-3 dark:bg-gray-700">
                <Skeleton height={16}  />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t dark:b-gray-700">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-3">
                  <Skeleton height={14} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </SkeletonTheme>
  );
}
