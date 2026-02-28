import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import { useToast } from "../../ToastContext";
import Swal from "sweetalert2";
import { createEmpresaFormConfig } from '../../EmpresaFormConfig';
import FormWithIcons from "../../components/UI/FormWithIcons";
import BackArrow from "../../components/UI/BackArrow";

export default function Pago() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [errors, setErrors] = useState({});

  const plan = location.state?.plan || null;

  useEffect(() => {
    if (!plan) {
      navigate("/licencias");
    }
  }, [plan, navigate]);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "" });
  const [cardErrors, setCardErrors] = useState({});

  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    api.get('/departamentos').then(res => setDepartamentos(res.data)).catch(console.error);
  }, []);

  const fields = createEmpresaFormConfig[1];
  const camposEmpresa = fields.filter(f => !f.name.startsWith('admin_'));
  const camposAdmin = fields.filter(f => f.name.startsWith('admin_'));

  const formSections = [
    { title: "Información de la Empresa", fields: camposEmpresa },
    { title: "Cuenta Administrador", fields: camposAdmin }
  ];

  const [formData, setFormData] = useState({
    ...Object.fromEntries(fields.map(f => [f.name, ""]))
  });

  const subtotal = Number(plan?.precio_raw || plan?.precio || 0);
  const iva = subtotal * 0.19;
  const total = Math.round(subtotal + iva);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCardChange = (name, value) => {
    let formattedValue = value;
    if (name === 'number') {
      formattedValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\//g, '').replace(/(\d{2})/, '$1/').substring(0, 5);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    if (cardErrors[name]) {
      setCardErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateCard = () => {
    const errors = {};
    const { number, expiry, cvc } = cardData;

    // Luhn Algorithm
    const isLuhnValid = (num) => {
      let sum = 0;
      let shouldDouble = false;
      const digits = num.replace(/\s/g, '');
      if (digits.length < 13) return false;
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);
        if (shouldDouble) {
          if ((digit *= 2) > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    };

    if (!number) errors.number = "Número requerido";
    else if (!isLuhnValid(number)) errors.number = "Número de tarjeta inválido";

    if (!expiry) errors.expiry = "Requerido";
    else if (!/^\d{2}\/\d{2}$/.test(expiry)) errors.expiry = "Formato MM/AA";
    else {
      const [mm, aa] = expiry.split('/').map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = parseInt(now.getFullYear().toString().slice(-2));
      if (mm < 1 || mm > 12) errors.expiry = "Mes inválido";
      else if (aa < currentYear || (aa === currentYear && mm < currentMonth)) errors.expiry = "Tarjeta expirada";
    }

    if (!cvc) errors.cvc = "Requerido";
    else if (!/^\d{3,4}$/.test(cvc)) errors.cvc = "CVC inválido";

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePagar = async () => {
    if (!plan) return Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay plan seleccionado",
      showConfirmButton: true,
    });

    if (paymentMethod === 'card') {
      validateCard(); // Activa los errores visuales de la tarjeta pero no detiene el fetch aún
    }

    setLoading(true);
    setErrors({});

    // Si la tarjeta está mal, activamos el modo solo validación para el backend
    const cardIsInvalid = paymentMethod === 'card' && Object.keys(cardErrors).length > 0;
    const isValidationOnly = cardIsInvalid;

    try {
      const payload = {
        ...formData,
        id_tipo_licencia: plan.id,
        duracion_meses: plan.duracion_meses,
        id_estado: 3,
        validate_only: isValidationOnly
      };

      const response = await api.post("/registrar-empresa-licencia", payload);

      // Si llegamos aquí y es validación exitosa (pero la tarjeta estaba mal), nos detenemos
      if (isValidationOnly) {
        toast.error("Por favor revisa los datos de tu tarjeta");
        setLoading(false);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Se ha registrado la empresa con exito, espera activación del Administrador",
        showConfirmButton: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error.response);

      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = backendErrors[key][0];
        });
        setErrors(formattedErrors);

        // Si la tarjeta también tenía errores, avisamos
        if (cardIsInvalid) {
          toast.error("Revisa el formulario y los datos de tu tarjeta");
        } else {
          toast.error("Revisa los campos marcados en rojo");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Error inesperado",
          showConfirmButton: true,
        });
      }
    } finally {
      if (!isValidationOnly) setLoading(false);
      else setLoading(false);
    }
  };

  const customRenderers = {
    id_departamento: (field, value, error) => (
      <div key="location-group-depto" className="flex flex-col gap-1.5 pb-3">
        <label className="text-[#0d121b] dark:text-white text-sm font-semibold leading-normal" htmlFor="id_departamento">{field.label}</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] text-xl">{field.icon}</span>
          <select
            className={`form-input flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border ${error ? 'border-red-500 bg-red-50' : 'border-[#cfd7e7] dark:border-white/10'} bg-white dark:bg-gray-800/50 h-12 pl-12 pr-4 text-base font-normal`}
            name="id_departamento"
            id="id_departamento"
            value={value || ""}
            onChange={async (e) => {
              const val = e.target.value;
              handleChange("id_departamento", val);
              setCiudades([]);
              handleChange("id_ciudad", "");
              if (val) {
                try {
                  const res = await api.get(`/ciudades/${val}`);
                  setCiudades(res.data);
                } catch (err) { console.error(err); }
              }
            }}
          >
            <option value="">{field.placeholder || "Seleccionar"}</option>
            {departamentos.map(d => (
              <option key={d.codigo_DANE} value={d.codigo_DANE}>{d.nombre}</option>
            ))}
          </select>
        </div>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    ),
    id_ciudad: (field, value, error) => (
      <div key="location-group-ciudad" className="flex flex-col gap-1.5 pb-3">
        <label className="text-[#0d121b] dark:text-white text-sm font-semibold leading-normal" htmlFor="id_ciudad">{field.label}</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] text-xl">{field.icon}</span>
          <select
            id="id_ciudad"
            name="id_ciudad"
            className={`form-input flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border ${error ? 'border-red-500 bg-red-50' : 'border-[#cfd7e7] dark:border-white/10'} bg-white dark:bg-gray-800/50 h-12 pl-12 pr-4 text-base font-normal`}
            value={value || ""}
            onChange={(e) => handleChange("id_ciudad", e.target.value)}
            disabled={!formData.id_departamento}
          >
            <option value="">{field.placeholder || "Seleccionar"}</option>
            {ciudades.map(c => (
              <option key={c.codigo_postal} value={c.codigo_postal}>{c.nombre}</option>
            ))}
          </select>
        </div>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* CABECERA CON BOTÓN VOLVER */}
        <div className="flex items-center">
          <div className="group flex items-center relative h-10">
            <BackArrow />
            <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute left-12 px-2 py-1 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded-md whitespace-nowrap z-30">
              Volver a los Planes
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* COLUMNA IZQUIERDA - RESUMEN DINÁMICO */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 p-6 space-y-8 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resumen del Plan</h2>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-300 dark:border-blue-900/50 rounded-xl p-6 bg-blue-50 dark:bg-blue-900/20">
              <div>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 uppercase">{plan.tipo}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{plan.descripcion}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total a pagar</p>
                <span className="text-blue-600 dark:text-blue-400 text-3xl font-bold">${total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">Detalle de Costos</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>IVA (19%)</span>
                    <span>${iva.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                    * Plan activo por {plan.duracion} a partir de la aprobación.
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">Beneficios incluidos</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2"> <span className="text-blue-600 dark:text-blue-400 text-xs">✔</span> Soporte 24/7 </li>
                  <li className="flex items-center gap-2"> <span className="text-blue-600 dark:text-blue-400 text-xs">✔</span> Gestión de Usuarios </li>
                  <li className="flex items-center gap-2"> <span className="text-blue-600 dark:text-blue-400 text-xs">✔</span> Control de Inventario </li>
                  <li className="flex items-center gap-2"> <span className="text-blue-600 dark:text-blue-400 text-xs">✔</span> Agenda Medica </li>
                  <li className="flex items-center gap-2"> <span className="text-blue-600 dark:text-blue-400 text-xs">✔</span> Asignacion de Citas </li>
                  <li className="flex items-center gap-2"> <span className="text-blue-600 dark:text-blue-400 text-xs">✔</span> Remisiones </li>
                </ul>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA - FORMULARIO REFACTORIZADO */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 p-6 space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Registro y Pago</h2>

            <FormWithIcons
              sections={formSections}
              values={formData}
              customRenderers={customRenderers}
              onChange={handleChange}
              errors={errors}
            >
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">Método de Pago</h3>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setPaymentMethod("card")} className={`flex-1 border rounded-lg py-2 text-sm transition-colors ${paymentMethod === "card" ? "border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 dark:border-gray-700"}`}>Tarjeta</button>
                  <button type="button" onClick={() => setPaymentMethod("transfer")} className={`flex-1 border rounded-lg py-2 text-sm transition-colors ${paymentMethod === "transfer" ? "border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 dark:border-gray-700"}`}>Transferencia</button>
                </div>
                {paymentMethod === "card" && (
                  <div className="space-y-3 mt-4">
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        placeholder="Número de tarjeta"
                        value={cardData.number}
                        onChange={(e) => handleCardChange('number', e.target.value)}
                        className={`w-full rounded-lg border ${cardErrors.number ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-[#cfd7e7] dark:border-white/10'} bg-white dark:bg-gray-800/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-[#0d121b] dark:text-white placeholder:text-[#4c669a]/60`}
                      />
                      {cardErrors.number && <span className="text-red-500 text-xs px-1">{cardErrors.number}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardData.expiry}
                          onChange={(e) => handleCardChange('expiry', e.target.value)}
                          className={`w-full rounded-lg border ${cardErrors.expiry ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-[#cfd7e7] dark:border-white/10'} bg-white dark:bg-gray-800/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-[#0d121b] dark:text-white placeholder:text-[#4c669a]/60`}
                        />
                        {cardErrors.expiry && <span className="text-red-500 text-xs px-1">{cardErrors.expiry}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <input
                          type="text"
                          placeholder="CVC"
                          value={cardData.cvc}
                          onChange={(e) => handleCardChange('cvc', e.target.value)}
                          className={`w-full rounded-lg border ${cardErrors.cvc ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-[#cfd7e7] dark:border-white/10'} bg-white dark:bg-gray-800/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-[#0d121b] dark:text-white placeholder:text-[#4c669a]/60`}
                        />
                        {cardErrors.cvc && <span className="text-red-500 text-xs px-1">{cardErrors.cvc}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handlePagar}
                disabled={loading}
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 py-3 rounded-xl transition disabled:bg-blue-300 dark:disabled:bg-blue-900/50 cursor-pointer"
              >
                {loading ? "Procesando Registro..." : (
                  <>
                    <span className="material-symbols-outlined">payments</span>
                    Pagar y Registrar Empresa
                  </>
                )}
              </button>
            </FormWithIcons>
          </div>
        </div>
      </div>
    </div>
  );
}
