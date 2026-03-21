<?php

namespace App\Constants;

/**
 * Constantes centralizadas de roles del sistema.
 *
 * Corresponden a los IDs de la tabla `rol`:
 *   1 → Super Admin
 *   2 → Admin
 *   3 → Personal Administrativo
 *   4 → Medico
 *   5 → Paciente
 *   6 → Farmaceutico
 *
 * Uso:
 *   use App\Constants\RolConstants;
 *   ->where('id_rol', RolConstants::ADMIN)
 */
final class RolConstants
{
    const SUPER_ADMIN             = 1;
    const ADMIN                   = 2;
    const PERSONAL_ADMINISTRATIVO = 3;
    const MEDICO                  = 4;
    const PACIENTE                = 5;
    const FARMACEUTICO            = 6;

    /**
     * Devuelve todos los roles como array asociativo [id => nombre].
     * Útil para validaciones o listados.
     */
    public static function all(): array
    {
        return [
            self::SUPER_ADMIN             => 'Super Admin',
            self::ADMIN                   => 'Admin',
            self::PERSONAL_ADMINISTRATIVO => 'Personal Administrativo',
            self::MEDICO                  => 'Medico',
            self::PACIENTE                => 'Paciente',
            self::FARMACEUTICO            => 'Farmaceutico',
        ];
    }

    /**
     * Devuelve el nombre legible de un rol dado su ID.
     */
    public static function nombre(int $id): string
    {
        return self::all()[$id] ?? 'Desconocido';
    }
}
