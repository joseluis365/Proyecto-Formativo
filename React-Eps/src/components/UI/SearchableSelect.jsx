import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SearchableSelect({
    options, // { value: string/number, label: string }
    value, // current selected value
    onChange, // function to update value
    placeholder = "Seleccionar...",
    noOptionsText = "No se encontraron resultados",
    required = false,
    onSearchChange,
    loading = false,
    error = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure the element is focusable post-render/animation
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [isOpen]);

    // Invoke onSearchChange when search changes
    useEffect(() => {
        if (onSearchChange) {
            onSearchChange(search);
        }
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

    // Filter options case-insensitive
    const filteredOptions = useMemo(() => {
        if (onSearchChange) return options;
        if (!search) return options;
        const lowerSearch = search.toLowerCase();
        return options.filter(opt =>
            opt.label.toLowerCase().includes(lowerSearch)
        );
    }, [options, search, onSearchChange]);

    const selectedOption = useMemo(() => {
        // If we are searching async, the selected option might not be in the current `options` list
        // We should ideally have the full option object or at least show the value if label is unknown
        const found = options.find(opt => String(opt.value) === String(value));
        if (found) return found;
        if (value && options.length === 0 && onSearchChange) {
             return { value, label: `Seleccionado: ${value}` }; // Fallback for async when initialized
        }
        return null;
    }, [options, value, onSearchChange]);

    const handleSelect = (val) => {
        onChange(val);
        setSearch('');
        if (onSearchChange) onSearchChange('');
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Native hidden required input if needed for form validation */}
            {required && (
                <input
                    type="text"
                    required
                    value={value}
                    onChange={() => { }}
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                    tabIndex={-1}
                />
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between border ${
                    isOpen ? 'border-primary ring-2 ring-primary/20' : 
                    error ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm outline-none text-left transition-all`}
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={`material-symbols-outlined text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden"
                    >
                        <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                                    <span className="material-symbols-outlined text-sm">search</span>
                                </span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm rounded-md py-1.5 pl-8 pr-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Buscar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when typing
                                />
                            </div>
                        </div>

                        <ul className="max-h-60 overflow-y-auto p-1">
                            {loading ? (
                                <li className="px-3 py-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                                    Buscando...
                                </li>
                            ) : filteredOptions.length === 0 ? (
                                <li className="px-3 py-3 text-sm text-gray-500 text-center">
                                    {noOptionsText}
                                </li>
                            ) : (
                                filteredOptions.map((opt) => (
                                    <li
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors flex items-center justify-between ${String(opt.value) === String(value)
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {String(opt.value) === String(value) && (
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
