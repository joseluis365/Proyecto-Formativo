/**
 * CalendarSelector — Calendario compacto para el Portal del Médico.
 *
 * Diferencias vs CalendarAgenda (Admin):
 * - Permite navegar hacia el pasado (el médico puede consultar citas históricas).
 * - Rango: -2 meses hasta +3 meses desde hoy.
 * - Días pasados seleccionables (para revisar historial de citas).
 * - Diseño embebido como panel lateral (sin scroll interno).
 * - Marca visualmente: hoy, seleccionado, y weekends con color suave.
 */

const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function pad(n) { return String(n).padStart(2, '0'); }
function toDateStr(year, month, day) { return `${year}-${pad(month + 1)}-${pad(day)}`; }

export default function CalendarSelector({ selectedDate, onDateSelect }) {
    const today    = new Date();
    const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

    // Mes actualmente visible (offset relativo al mes actual)
    const [offset, setOffset] = useState(0);

    const MIN_OFFSET = -2;   // 2 meses hacia atrás
    const MAX_OFFSET =  3;   // 3 meses hacia adelante

    const viewDate   = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const viewYear   = viewDate.getFullYear();
    const viewMonth  = viewDate.getMonth();

    const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay(); // 0=Dom

    const blanks = Array.from({ length: firstWeekday });
    const days   = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 w-full">

            {/* ── Encabezado: mes + navegación ──────────────────────────── */}
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={() => setOffset(v => Math.max(MIN_OFFSET, v - 1))}
                    disabled={offset <= MIN_OFFSET}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>

                <div className="text-center">
                    <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                        {MONTHS[viewMonth]}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{viewYear}</p>
                </div>

                <button
                    onClick={() => setOffset(v => Math.min(MAX_OFFSET, v + 1))}
                    disabled={offset >= MAX_OFFSET}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
            </div>

            {/* ── Nombres de días de la semana ───────────────────────────── */}
            <div className="grid grid-cols-7 mb-2">
                {DAYS.map((d, i) => (
                    <div
                        key={d}
                        className={`text-center text-[10px] font-bold uppercase tracking-widest py-1
                            ${i === 0 || i === 6
                                ? 'text-red-400 dark:text-red-500'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* ── Grid de días ───────────────────────────────────────────── */}
            <div className="grid grid-cols-7 gap-y-1">
                {/* Blancos iniciales */}
                {blanks.map((_, i) => <div key={`b-${i}`} />)}

                {/* Días del mes */}
                {days.map(day => {
                    const dateStr    = toDateStr(viewYear, viewMonth, day);
                    const isSelected = selectedDate === dateStr;
                    const isToday    = dateStr === todayStr;
                    const weekday    = new Date(viewYear, viewMonth, day).getDay();
                    const isWeekend  = weekday === 0 || weekday === 6;

                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => onDateSelect(dateStr)}
                            className={`
                                relative mx-auto flex size-8 items-center justify-center
                                rounded-full text-xs font-semibold transition-all duration-150
                                cursor-pointer
                                ${isSelected
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                                    : isToday
                                        ? 'ring-2 ring-primary text-primary dark:text-primary font-black'
                                        : isWeekend
                                            ? 'text-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary'
                                }
                            `}
                        >
                            {day}
                            {/* Punto indicador para "hoy" cuando no está seleccionado */}
                            {isToday && !isSelected && (
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Leyenda inferior ───────────────────────────────────────── */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary inline-block" />
                    Hoy
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary/40 inline-block" />
                    Seleccionado
                </span>
            </div>
        </div>
    );
}

// ── Import necesario ──────────────────────────────────────────────────────────
import { useState } from 'react';
