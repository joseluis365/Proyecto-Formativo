import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import BarChartCitas from "../../components/Charts/BarChartCitas";
import StatsPanel from "../../components/Dashboard/StatsPanel";
import MotionSpinner from "../../components/UI/Spinner";
import api from "../../Api/axios";

export default function PersonalAdminDashboard() {
  const { setTitle, setSubtitle } = useLayout();

  useHelp({
    title: "Panel de Control Administrativo",
    description: "Monitoreo general de la operación de la EPS, métricas clave y accesos rápidos.",
    sections: [
      {
        title: "Indicadores Clave (KPIs)",
        type: "list",
        items: [
          "Pacientes Activos: Total de usuarios vigentes en el sistema.",
          "Citas del Mes: Volumen de atenciones agendadas actualmente.",
          "PQRS Pendientes: Solicitudes de usuarios que requieren respuesta inmediata."
        ]
      },
      {
        title: "Análisis Visual",
        type: "text",
        content: "El gráfico de 'Citas de la Semana' permite identificar los días de mayor carga laboral para una mejor planificación del personal."
      },
      {
        title: "Acciones Rápidas",
        type: "steps",
        items: [
          "Gestión de Pacientes: Acceso para búsqueda y edición de información de afiliados.",
          "Consultar Agenda: Visualización de las citas programadas para el día.",
          "Responder PQRS: Gestión del buzón de entrada de peticiones y quejas."
        ]
      },
      {
        title: "Recomendaciones",
        type: "tip",
        content: "Revisa los indicadores al inicio de tu jornada para priorizar las tareas pendientes más críticas, especialmente las PQRS acumuladas."
      }
    ]
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [citasData, setCitasData] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    setTitle("Inicio");
    setSubtitle("Panel de control del personal administrativo.");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citasRes, statsRes] = await Promise.all([
          api.get("/admin/dashboard/citas-semana"),
          api.get("/admin/dashboard/stats")
        ]);

        const rawCitas = Array.isArray(citasRes) ? citasRes : (citasRes?.data ?? citasRes ?? []);
        setCitasData(rawCitas);

        // Filter stats, show only Pacientes Activos & Citas del Mes for Admin Personal
        const rawStats = Array.isArray(statsRes) ? statsRes : [];
        const filteredStats = rawStats.filter(s => 
          s.title === 'Pacientes Activos' || s.title === 'Citas del Mes' || s.title === 'PQRS Pendientes'
        );
        setStats(filteredStats);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <MotionSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Stats row - only showing what's relevant */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-neutral-gray-border/10 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-gray-text dark:text-gray-400">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-2xl">
                <span className="material-symbols-outlined text-primary text-2xl">
                  {stat.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 p-6 rounded-4xl border border-neutral-gray-border/10 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">bar_chart</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none">Citas de la Semana</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Actividad total de atenciones recibidas.</p>
            </div>
          </div>
          <BarChartCitas data={citasData} />
        </div>

        {/* Vertical Quick Actions */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2">Acciones Rápidas</h3>
          
          {[
            { label: 'Ver Pacientes', icon: 'group', path: '/personal/pacientes', desc: 'Gestionar base de datos de pacientes.', color: 'from-blue-500 to-blue-600' },
            { label: 'Consultar Agenda', icon: 'event', path: '/personal/agenda', desc: 'Ver disponibilidad y citas del día.', color: 'from-indigo-500 to-indigo-600' },
            { label: 'Responder PQRS', icon: 'forum', path: '/personal/pqrs', desc: 'Atender sugerencias y reclamos.', color: 'from-sky-500 to-sky-600' }
          ].map((action, i) => (
            <button 
              key={i}
              onClick={() => navigate(action.path)}
              className="group relative flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-3xl border border-neutral-gray-border/10 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all text-left overflow-hidden cursor-pointer w-full"
            >
              <div className={`size-12 rounded-2xl bg-linear-to-br ${action.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{action.icon}</span>
              </div>
              <div className="grow">
                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors text-sm">{action.label}</h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 line-clamp-1">{action.desc}</p>
              </div>
              <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
            </button>
          ))}

          {/* Banner decorativo o extra */}
          <div className="mt-2 p-6 rounded-4xl bg-linear-to-br from-primary to-[#0270a8] text-white overflow-hidden relative">
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Soporte Saluvanta</span>
              <h4 className="text-sm font-bold leading-tight">¿Tienes dudas con el sistema?</h4>
              <p className="text-[10px] opacity-70 leading-relaxed max-w-[150px]">Consulta la ayuda integrada en la parte superior derecha.</p>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl opacity-10 rotate-12">help_center</span>
          </div>
        </div>
      </div>
    </div>
  );
}
