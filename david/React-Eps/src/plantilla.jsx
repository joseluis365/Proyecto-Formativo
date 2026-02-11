export default function Plantilla() {
    return (
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900/50 rounded-xl shadow-lg border border-neutral-gray-border/20 dark:border-gray-800">
                    <div className="bg-primary-green/90 dark:bg-primary-green/50 backdrop-blur-sm text-white p-6 rounded-t-xl flex items-center gap-4">
                        <span className="material-symbols-outlined text-3xl">clinical_notes</span>
                        <h2 className="text-xl sm:text-2xl font-bold">HISTORIAL CLÍNICO – Laura Martínez López</h2>
                    </div>
                    <div className="p-6 sm:p-8 space-y-8">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary-green text-2xl">badge</span>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Datos Personales</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Documento:</span><span
                                        className="text-gray-800 dark:text-gray-200">1023456789</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Edad:</span><span
                                        className="text-gray-800 dark:text-gray-200">28 años</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Sexo:</span><span
                                        className="text-gray-800 dark:text-gray-200">Femenino</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Grupo
                                        Sanguíneo:</span><span className="text-gray-800 dark:text-gray-200">A-</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Teléfono:</span><span
                                        className="text-gray-800 dark:text-gray-200">300 123 4567</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Fecha de
                                        Nacimiento:</span><span
                                        className="text-gray-800 dark:text-gray-200">15/05/1996</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Dirección:</span><span
                                        className="text-gray-800 dark:text-gray-200">Calle 45 # 23-10, Bogotá</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Correo:</span><span
                                        className="text-gray-800 dark:text-gray-200">l.martinez@email.com</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">EPS:</span><span
                                        className="text-gray-800 dark:text-gray-200">SaludTotal EPS</span></div>
                                <div className="flex justify-between border-b pb-2 dark:border-gray-700"><span
                                        className="font-medium text-gray-500 dark:text-gray-400">Afiliación:</span><span
                                        className="text-gray-800 dark:text-gray-200">Cotizante</span></div>
                            </div>
                        </section>
                        <hr className="dark:border-gray-700" />
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-primary-green text-2xl">assignment</span>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Antecedentes Personales
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm list-disc list-inside">
                                <li><span className="font-medium text-gray-500 dark:text-gray-400">Enfermedades
                                        Previas:</span> Asma leve, diagnosticada en la infancia.</li>
                                <li><span className="font-medium text-gray-500 dark:text-gray-400">Cirugías Previas:</span>
                                    Apendicectomía (2010).</li>
                                <li><span className="font-medium text-gray-500 dark:text-gray-400">Alergias:</span> Alergia
                                    estacional al polen (rinitis). Sin alergias a medicamentos conocidas.</li>
                                <li><span className="font-medium text-gray-500 dark:text-gray-400">Medicación
                                        Habitual:</span> Salbutamol (inhalador) de uso ocasional.</li>
                            </ul>
                        </section>
                        <hr className="dark:border-gray-700" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <span
                                        className="material-symbols-outlined text-primary-green text-2xl">family_history</span>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Antecedentes
                                        Familiares</h3>
                                </div>
                                <ul className="space-y-2 text-sm list-disc list-inside">
                                    <li><span className="font-medium text-gray-500 dark:text-gray-400">Madre:</span>
                                        Hipertensión arterial, controlada.</li>
                                    <li><span className="font-medium text-gray-500 dark:text-gray-400">Padre:</span>
                                        Diabetes tipo 2.</li>
                                    <li><span className="font-medium text-gray-500 dark:text-gray-400">Hermanos:</span> Sin
                                        antecedentes de relevancia.</li>
                                </ul>
                            </section>
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="material-symbols-outlined text-primary-green text-2xl">spa</span>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Hábitos y Estilo de
                                        Vida</h3>
                                </div>
                                <ul className="space-y-2 text-sm list-disc list-inside">
                                    <li><span className="font-medium text-gray-500 dark:text-gray-400">Tabaquismo:</span> No
                                        fumadora.</li>
                                    <li><span className="font-medium text-gray-500 dark:text-gray-400">Alcohol:</span>
                                        Consumo social ocasional.</li>
                                    <li><span className="font-medium text-gray-500 dark:text-gray-400">Dieta:</span>
                                        Balanceada, rica en vegetales.</li>
                                    <li><span className="font-medium text-gray-500 dark:text-gray-400">Actividad
                                            Física:</span> Regular (3 veces por semana).</li>
                                </ul>
                            </section>
                        </div>
                        <hr className="dark:border-gray-700" />
                        <section>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Historial de Citas
                                Médicas</h3>
                            <div className="rounded-lg border border-neutral-gray-border/30 dark:border-gray-700 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-primary-green/10 dark:bg-primary-green/20">
                                            <tr>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Fecha</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Médico</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Diagnóstico</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90 text-center">
                                                    Ver Detalles</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3">10/06/2024</td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">Dr.
                                                    Carlos Peña</td>
                                                <td className="px-4 py-3">Control general anual</td>
                                                <td className="px-4 py-3 text-center"><a
                                                        className="font-medium text-accent-teal hover:underline"
                                                        href="resumen-cita-medica.html">Ver</a></td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3">22/01/2024</td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">Dra.
                                                    Sofia Vergara</td>
                                                <td className="px-4 py-3">Gripe estacional</td>
                                                <td className="px-4 py-3 text-center"><a
                                                        className="font-medium text-accent-teal hover:underline"
                                                        href="resumen-cita-medica.html">Ver</a></td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3">05/09/2023</td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">Dr.
                                                    Carlos Peña</td>
                                                <td className="px-4 py-3">Revisión de Alergia</td>
                                                <td className="px-4 py-3 text-center"><a
                                                        className="font-medium text-accent-teal hover:underline"
                                                        href="resumen-cita-medica.html">Ver</a></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Órdenes de Medicamentos</h3>
                            <div
                                className="rounded-lg border border-neutral-gray-border/30 dark:border-gray-700 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-primary-green/10 dark:bg-primary-green/20">
                                            <tr>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Fecha</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Medicamento</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Estado</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90 text-center">
                                                    Ver Orden</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90 text-center">
                                                    Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3">10/06/2024</td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">
                                                    Paracetamol</td>
                                                <td className="px-4 py-3"><span
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">Despachada</span>
                                                </td>
                                                <td className="px-4 py-3 text-center"><a
                                                        className="font-medium text-accent-teal hover:underline"
                                                        href="info-orden-medicamentos.html">Ver</a></td>
                                                <td className="px-4 py-3 text-center"><button
                                                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><span
                                                            className="material-symbols-outlined text-lg">download</span></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Remisiones Médicas</h3>
                            <div
                                className="rounded-lg border border-neutral-gray-border/30 dark:border-gray-700 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-primary-green/10 dark:bg-primary-green/20">
                                            <tr>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Fecha</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Tipo</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90">
                                                    Estado</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90 text-center">
                                                    Ver Remision</th>
                                                <th
                                                    className="px-4 py-3 font-semibold text-primary-green dark:text-primary-green/90 text-center">
                                                    Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3">10/06/2024</td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">
                                                    Examen de Sangre</td>
                                                <td className="px-4 py-3"><span
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">ATENDIDA</span>
                                                </td>
                                                <td className="px-4 py-3 text-center"><a
                                                        className="font-medium text-accent-teal hover:underline"
                                                        href="remision-info.html">Ver</a></td>
                                                <td className="px-4 py-3 text-center"><button
                                                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><span
                                                            className="material-symbols-outlined text-lg">download</span></button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3">10/06/2024</td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">
                                                    Mamografía</td>
                                                <td className="px-4 py-3"><span
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300">PENDIENTE</span>
                                                </td>
                                                <td className="px-4 py-3 text-center"><a
                                                        className="font-medium text-accent-teal hover:underline"
                                                        href="remision-info.html">Ver</a></td>
                                                <td className="px-4 py-3 text-center"><button
                                                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><span
                                                            className="material-symbols-outlined text-lg">download</span></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
                            <button
                                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-primary-green text-primary-green font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-primary-green/5 dark:hover:bg-primary-green/10 transition-colors duration-200">
                                <span className="material-symbols-outlined">download</span>
                                Exportar Historial Completo
                            </button>
                            <button
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-green hover:bg-primary-green/90 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                <span className="material-symbols-outlined">edit</span>
                                Editar Información
                            </button>
                        </div>
                    </div>
                </div>
    )
}
