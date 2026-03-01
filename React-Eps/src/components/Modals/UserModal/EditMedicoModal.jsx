import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import Form from "../../UI/Form";
import { getEditUserFormConfig } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "../../UI/Spinner";


export default function EditPersonalModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [specialties, setSpecialties] = useState([]);


  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userRes, specialtiesRes] = await Promise.all([
          api.get(`/usuario/${userId}`),
          api.get('/especialidades')
        ]);
        setUser(userRes.data);
        setSpecialties(specialtiesRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleUpdate = async (data) => {
    try {
      setSaving(true);
      await api.put(`/usuario/${userId}`, data);

      Swal.fire({
        icon: 'success',
        title: 'Medico Actualizado',
        text: 'La información del medico ha sido actualizada correctamente.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        onSuccess?.();
        onClose();
      });

    } catch (error) {
      console.error("Error 422:", error.response?.data);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el medico.',
      });
    } finally {
      setSaving(false);
    }
  };
  console.log(user);
  return (
    <BaseModal>
      <ModalHeader icon="person" title="EDITAR MEDICO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <MotionSpinner />
          </div>
        ) : (
          <Form
            values={user}
            fields={getEditUserFormConfig(user.id_rol, { id_especialidad: specialties })}
            onSubmit={handleUpdate}
            disabled={saving}
            loading={saving}
          />
        )}
      </div>
    </BaseModal>
  );
}
