export default function Header({ onMenuClick, title, subtitle }) {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-neutral-gray-border/20 dark:border-gray-800 px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <button
                onClick={onMenuClick}
                className="lg:hidden pr-5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-wrap justify-between gap-3 items-center">
                <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">{title}</p>
                    <p className="text-neutral-gray-text dark:text-gray-400 text-sm font-normal leading-normal md:text-base truncate whitespace-normal">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    className="flex items-center justify-center rounded-full size-10 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button
                    className="flex items-center justify-center rounded-full size-10 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined">help</span>
                </button>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    data-alt="User avatar"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEQSpvUyANgw_hVpC1GFciTJM9thLELV7GFk5CBpXT-doHMOMro-aVrIgD1MECliv2UiZashGDcNaN2lqYpPta_wCSNcPZnYhbb8xriJtDhXpaX9f1yk_D08wbKpZspIR_-rynBmi5zt_F4QYwiX9a6R_B4sEgw4B6K7dArfs7_QkrtyzsG4lOgD4wl7djRiF5Nj5XQX4WAXPja4hKOuK0Ls0pLu2ubbdIqNiL5XAlf7tDAXeNJO5kF6_u4Whxh6F5w7r6upC0v3_v")' }}>
                </div>
            </div>
        </header>
    )
}
