import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import { useToast } from "../../ToastContext";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { createEmpresaFormConfig } from '../../EmpresaFormConfig';

export default function Pago() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [errors, setErrors] = useState({});

  // Recibimos el plan desde la navegación, si no existe redirigimos
  const plan = location.state?.plan || null;

  useEffect(() => {
    if (!plan) {
      navigate("/licencias");
    }
  }, [plan, navigate]);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Location Logic
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");

  useEffect(() => {
    api.get('/departamentos').then(res => setDepartamentos(res.data)).catch(console.error);
  }, []);

  const handleDepartamentoChange = async (e) => {
    const val = e.target.value;
    setSelectedDepartamento(val);
    setCiudades([]);
    setFormData(prev => ({ ...prev, id_ciudad: "" }));

    if (val) {
      try {
        const res = await api.get(`/ciudades/${val}`);
        setCiudades(res.data);
      } catch (e) { console.error(e); }
    }
  };

  // 1. Extraer el array de la configuración
  const fields = createEmpresaFormConfig[1];

  // 2. Filtrar los campos para las dos secciones
  const camposEmpresa = fields.filter(f => !f.name.startsWith('admin_'));
  const camposAdmin = fields.filter(f => f.name.startsWith('admin_'));

  // Estados del formulario
  const [formData, setFormData] = useState({
    ...Object.fromEntries(fields.map(f => [f.name, ""]))
  });

  // Cálculos dinámicos
  const subtotal = Number(plan?.precio_raw || plan?.precio || 0);
  const iva = subtotal * 0.19;
  const total = Math.round(subtotal + iva);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualizar el valor del formulario
    setFormData({ ...formData, [name]: value });

    // Si existe un error para este campo, eliminarlo
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handlePagar = async () => {
    if (!plan) return Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay plan seleccionado",
      showConfirmButton: false,
      timer: 1100,
      timerProgressBar: true,
    });

    setLoading(true);
    setErrors({}); // Limpiar errores antes de intentar

    try {
      const payload = {
        ...formData,
        id_tipo_licencia: plan.id,
        duracion_meses: plan.duracion_meses,
        id_estado: 3,
      };

      await api.post("/registrar-empresa-licencia", payload);

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Se ha registrado la empresa con exito, espera activación del Administrador",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error.response);

      if (error.response?.status === 422) {
        // Convertimos el objeto de arrays de Laravel a un objeto de strings
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = backendErrors[key][0]; // Tomamos el primer mensaje
        });

        setErrors(formattedErrors);
        toast.error("Revisa los campos marcados en rojo");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Error inesperado",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorMsg = ({ name }) => (
    errors[name] ? <p className="text-red-500 text-xs mt-1">{errors[name]}</p> : null
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* COLUMNA IZQUIERDA - RESUMEN DINÁMICO */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-12">
          <h2 className="text-xl font-semibold text-gray-900">Resumen del Plan</h2>

          <div className="border border-gray-300 rounded-xl p-4 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-700 uppercase">{plan.tipo}</h3>
            <p className="text-sm text-gray-600 mt-1">{plan.descripcion}</p>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>IVA (19%)</span>
              <span>${iva.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div className="border-t border-gray-300 pt-3 flex justify-between text-base font-semibold text-gray-900">
              <span>Total a pagar</span>
              <span className="text-blue-600 text-xl">${total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 bg-gray-100 rounded-lg p-3">
            Activo por <strong>{plan.duracion}</strong> a partir de la aprobación.
          </div>

          {/* Beneficios (Se mantienen estáticos por ahora) */}
          <div className="space-y-5">
            <h4 className="font-medium text-gray-900">Beneficios incluidos</h4>
            <ul className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <li className="flex items-center gap-2"> <span className="text-blue-600">✔</span> Soporte 24/7 </li>
              <li className="flex items-center gap-2"> <span className="text-blue-600">✔</span> Gestión de Usuarios </li>
              <li className="flex items-center gap-2"> <span className="text-blue-600">✔</span> Control de Inventario </li>
              <li className="flex items-center gap-2"> <span className="text-blue-600">✔</span> Agenda Medica </li>
              <li className="flex items-center gap-2"> <span className="text-blue-600">✔</span> Asignacion de Citas </li>
              <li className="flex items-center gap-2"> <span className="text-blue-600">✔</span> Remisiones </li>
              <li className="flex items-center gap-2"> <span className="text-blue-600">✔</span> Reportes y Estadisticas </li>
            </ul>
          </div>
        </div>

        {/* COLUMNA DERECHA - FORMULARIO CON BINDING */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8">
          <h2 className="text-xl font-semibold text-gray-900">Registro y Pago</h2>

          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800 border-b pb-2">Información de la Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {camposEmpresa.map((field) => {
                if (field.name === 'id_departamento') {
                  return (
                    <div key="location-group" className="contents">
                      {/* Departamento Select */}
                      <div className="flex flex-col">
                        <label htmlFor="id_departamento" className="text-xs font-medium text-gray-500 mb-1">Departamento</label>
                        <select
                          className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.id_departamento ? "border-red-500 bg-red-50" : "border-gray-200"
                            }`}
                          name="id_departamento"
                          id="id_departamento"
                          value={formData.id_departamento || ""}
                          onChange={async (e) => {
                            handleChange(e); // 👈 guarda en formData
                            const val = e.target.value;

                            setCiudades([]);
                            setFormData(prev => ({ ...prev, id_ciudad: "" }));

                            if (val) {
                              try {
                                const res = await api.get(`/ciudades/${val}`);
                                setCiudades(res.data);
                              } catch (error) {
                                console.error(error);
                              }
                            }
                          }}
                        >
                          <option value="">Seleccionar</option>
                          {departamentos.map(d => (
                            <option key={d.codigo_DANE} value={d.codigo_DANE}>{d.nombre}</option>
                          ))}
                        </select>
                        {errors.id_departamento && (
                          <span className="text-red-500 text-xs mt-1">{errors.id_departamento}</span>
                        )}
                      </div>

                      {/* Ciudad Select */}
                      <div className="flex flex-col">
                        <label htmlFor="id_ciudad" className="text-xs font-medium text-gray-500 mb-1">Ciudad</label>
                        <select
                          id="id_ciudad"
                          name="id_ciudad"
                          className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.id_ciudad ? "border-red-500 bg-red-50" : "border-gray-200"
                            }`}
                          value={formData.id_ciudad || ""}
                          onChange={handleChange}
                          disabled={!formData.id_departamento}
                        >
                          <option value="">Seleccionar</option>
                          {ciudades.map(c => (
                            <option key={c.codigo_postal} value={c.codigo_postal}>{c.nombre}</option>
                          ))}
                        </select>
                        {errors.id_ciudad && (
                          <span className="text-red-500 text-xs mt-1">{errors.id_ciudad}</span>
                        )}
                      </div>
                    </div>
                  );
                }

                if (field.name === 'id_ciudad') {
                  return null;
                }

                return (
                  <div key={field.name} className="flex flex-col">
                    <label htmlFor={field.name} className="text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.label}
                      className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors[field.name] ? "border-red-500 bg-red-50" : "border-gray-200"
                        }`}
                    />
                    {errors[field.name] && (
                      <span className="text-red-500 text-xs mt-1">{errors[field.name]}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800 border-b pb-2">Cuenta Administrador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {camposAdmin.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label htmlFor={field.name} className="text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.label}
                    className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors[field.name] ? "border-red-500 bg-red-50" : "border-gray-200"
                      }`}
                  />
                  {errors[field.name] && (
                    <span className="text-red-500 text-xs mt-1">{errors[field.name]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800">Método de Pago</h3>
            <div className="flex gap-3">
              <button onClick={() => setPaymentMethod("card")} className={`flex-1 border rounded-lg py-2 text-sm ${paymentMethod === "card" ? "border-blue-600 text-blue-600 bg-blue-50" : "text-gray-600"}`}>Tarjeta</button>
              <button onClick={() => setPaymentMethod("transfer")} className={`flex-1 border rounded-lg py-2 text-sm ${paymentMethod === "transfer" ? "border-blue-600 text-blue-600 bg-blue-50" : "text-gray-600"}`}>Transferencia</button>
            </div>
            {paymentMethod === "card" && (
              <div className="space-y-3">
                <input type="text" placeholder="Número de tarjeta" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/AA" className="rounded-lg border border-gray-200 px-4 py-2 text-sm" />
                  <input type="text" placeholder="CVC" className="rounded-lg border border-gray-200 px-4 py-2 text-sm" />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handlePagar}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:bg-blue-300"
          >
            {loading ? "Procesando Registro..." : "Pagar y Registrar Empresa"}
          </button>
        </div>
      </div>
    </div>
  );
}
