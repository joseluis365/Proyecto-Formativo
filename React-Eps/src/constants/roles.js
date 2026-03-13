/**
 * Constantes centralizadas de roles del sistema.
 *
 * Corresponden a los IDs de la tabla `rol` en el backend:
 *   1 → Super Admin
 *   2 → Admin
 *   3 → Personal Administrativo
 *   4 → Medico
 *   5 → Paciente
 *   6 → Farmaceutico
 *
 * Uso:
 *   import { ROLES } from '@/constants/roles';
 *   params: { id_rol: ROLES.MEDICO }
 */
export const ROLES = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    PERSONAL_ADMINISTRATIVO: 3,
    MEDICO: 4,
    PACIENTE: 5,
    FARMACEUTICO: 6,
};

/**
 * Mapa inverso: ID → nombre legible.
 * Útil para mostrar el nombre de un rol en la UI.
 *
 * Uso:
 *   ROL_LABELS[user.id_rol]  → 'Medico'
 */
export const ROL_LABELS = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.PERSONAL_ADMINISTRATIVO]: 'Personal Administrativo',
    [ROLES.MEDICO]: 'Medico',
    [ROLES.PACIENTE]: 'Paciente',
    [ROLES.FARMACEUTICO]: 'Farmaceutico',
};

/**
 * Array con todos los roles (excepto Super Admin).
 * Útil para selects y filtros del panel Admin.
 */
export const ROLES_ADMIN = [
    { value: ROLES.ADMIN, label: 'Admin' },
    { value: ROLES.PERSONAL_ADMINISTRATIVO, label: 'Personal Administrativo' },
    { value: ROLES.MEDICO, label: 'Medico' },
    { value: ROLES.PACIENTE, label: 'Paciente' },
    { value: ROLES.FARMACEUTICO, label: 'Farmaceutico' },
];
