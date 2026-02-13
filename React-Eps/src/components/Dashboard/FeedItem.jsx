const FEED_STYLES = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-600",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-600",
  },
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-600",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-600",
  },
};

export default function FeedItem({ icon, title, time, type }) {
  const styles = FEED_STYLES[type] || FEED_STYLES.purple;

  return (
    <div className="flex gap-4">
      <div
        className={`flex items-center justify-center size-10 rounded-full
          ${styles.bg} ${styles.text}`}
      >
        <span className="material-symbols-outlined text-xl">
          {icon}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          {title}
        </p>
        <p className="text-xs text-neutral-gray-text dark:text-gray-400">
          {time}
        </p>
      </div>
    </div>
  );
}
