import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import { useToast } from "../../ToastContext";
import { useEffect } from "react";

export default function Pago() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Recibimos el plan desde la navegación, si no existe redirigimos
  const plan = location.state?.plan || null;

  useEffect(() => {
    if (!plan) {
      navigate("/licencias");
    }
  }, [plan, navigate]);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nit: "",
    nombre: "",
    email_contacto: "",
    telefono: "",
    direccion: "",
    documento_representante: "",
    nombre_representante: "",
    email_representante: "",
    telefono_representante: "",
    ciudad: "",
    admin_documento: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
  });

  // Cálculos dinámicos
  const subtotal = Number(plan?.precio_raw || plan?.precio || 0);
  const iva = subtotal * 0.19;
  const total = Math.round(subtotal + iva);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePagar = async () => {
    if (!plan) return alert("No hay plan seleccionado");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        id_tipo_licencia: plan.id,
        duracion_meses: plan.duracion_meses,
      };

      const response = await api.post("/registrar-empresa-licencia", payload);

      toast.success("Registro exitoso. Espera la activación del administrador.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error en el proceso");
    } finally {
      setLoading(false);
    }
  };

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
            <h3 className="text-base font-medium text-gray-800">Información de la Empresa</h3>
            <input name="nit" onChange={handleChange} type="text" placeholder="NIT de la empresa" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="nombre" onChange={handleChange} type="text" placeholder="Nombre de la empresa" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="email_contacto" onChange={handleChange} type="email" placeholder="email de la empresa" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="telefono" onChange={handleChange} type="number" placeholder="Telefono de la Empresa" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="direccion" onChange={handleChange} type="text" placeholder="Dirección de la empresa" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="documento_representante" onChange={handleChange} type="text" placeholder="Documento del representante legal" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="nombre_representante" onChange={handleChange} type="text" placeholder="Nombre del representante" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="telefono_representante" onChange={handleChange} type="text" placeholder="Telefono del representante" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="email_representante" onChange={handleChange} type="email" placeholder="Email del representante" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="ciudad" onChange={handleChange} type="text" placeholder="Ciudad" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800">Cuenta Administrador</h3>
            <input name="admin_documento" onChange={handleChange} type="text" placeholder="Documento del administrador" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="admin_name" onChange={handleChange} type="text" placeholder="Nombre del administrador" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="admin_email" onChange={handleChange} type="email" placeholder="Email corporativo" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="admin_password" onChange={handleChange} type="password" placeholder="Contraseña" className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
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
