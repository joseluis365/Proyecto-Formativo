import { useState, useEffect } from "react";
import api from "../../Api/axios";
import { useNavigate } from "react-router-dom";

export default function Licencias() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 2. Efecto para cargar los datos al montar el componente
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/licencias", {
          params: {
            id_estado: 1,
          }
        }); // Tu ruta de Laravel
        
        // Laravel Resource devuelve los datos dentro de una propiedad 'data'
        setPlans(response.data.data);
      } catch (error) {
        setError("No se pudieron cargar las licencias");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Planes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Elige el plan que mejor se adapte a tu empresa
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-600 rounded-2xl border shadow-sm p-6 flex flex-col justify-between
                ${
                  plan.popular
                    ? "border-blue-600 shadow-md"
                    : "border-gray-200 dark:border-gray-400"
                }
              `}
            >
              {/* Badge más usada */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MÁS USADA
                </span>
              )}

              {/* Contenido */}
              <div className="space-y-4">
                {/* Duración */}
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                  {plan.tipo}
                </h3>

                {/* Descripción */}
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {plan.descripcion}
                </p>

                {/* Precio */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Precio</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {plan.precio}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => navigate("/pago", { state: { plan: plan } })} // Aquí conectarás al Checkout
                  className={`w-full py-3 rounded-xl cursor-pointer font-semibold transition
                    ${plan.popular 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "border border-blue-600 dark:bg-blue-600/50 text-blue-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-primary/70"}
                  `}
                >
                  Seleccionar
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Utilizada por{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    {plan.companies} empresas
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
