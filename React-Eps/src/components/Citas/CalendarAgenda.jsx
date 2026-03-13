import { useState } from 'react';

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export default function CalendarAgenda({ selectedDate, onDateSelect, onClose }) {
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

    const today = new Date();
    const baseDate = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1);

    // Generar datos para el mes 1 y mes 2
    const handleNext = () => setCurrentMonthOffset(prev => Math.min(2, prev + 1));
    const handlePrev = () => setCurrentMonthOffset(prev => Math.max(0, prev - 1));

    const renderMonth = (offsetFromBase) => {
        const targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + offsetFromBase, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const blanks = Array.from({ length: firstDay }, (_, i) => i);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const twoMonthsFromNow = new Date();
        twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

        return (
            <div key={`${year}-${month}`} className="mb-6">
                <h3 className="text-center font-bold text-gray-800 dark:text-gray-200 mb-4 text-lg">
                    {MONTHS[month]} {year}
                </h3>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="text-xs font-semibold text-gray-500 dark:text-gray-400 py-1">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks.map(blank => (
                        <div key={`blank-${blank}`} className="p-2"></div>
                    ))}
                    {days.map(day => {
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dateObj = new Date(year, month, day);
                        const isSelected = selectedDate === dateStr;
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;

                        const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                        const isTooFar = dateObj > twoMonthsFromNow;
                        const isDisabled = isPast || isTooFar;

                        return (
                            <button
                                key={day}
                                onClick={() => !isDisabled && onDateSelect(dateStr)}
                                disabled={isDisabled}
                                className={`
                                    flex items-center justify-center size-8 sm:size-10 rounded-full text-sm mx-auto transition-colors
                                    ${isDisabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'cursor-pointer'}
                                    ${isSelected ? 'bg-primary text-white font-bold shadow-md' : ''}
                                    ${!isSelected && !isDisabled ? 'text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20' : ''}
                                    ${isToday && !isSelected ? 'border-2 border-primary text-primary font-bold' : ''}
                                `}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="flex pr-2 items-center justify-center text-gray-500 hover:text-gray-900 border-r border-gray-200 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white transition cursor-pointer"
                            title="Ocultar calendario"
                        >
                            <span className="material-symbols-outlined text-[20px]">first_page</span>
                        </button>
                    )}
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Calendario</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={currentMonthOffset === 0}
                        className={`p-1.5 rounded-lg border ${currentMonthOffset === 0 ? 'text-gray-300 border-gray-200 dark:border-gray-700 dark:text-gray-600' : 'text-gray-600 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800'} transition cursor-pointer`}
                    >
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 transition cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                </div>
            </div>

            <div className="overflow-hidden">
                <div className="transition-transform duration-300 ease-in-out">
                    {renderMonth(0)}
                </div>
            </div>
        </div>
    );
}
