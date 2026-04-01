<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de reagendamiento de cita.
 * Valida nueva fecha/hora respetando reglas de negocio.
 */
class ReagendarCitaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Obtenemos el id de la cita actual desde la ruta para excluirla
        // en la validación de colisión de horarios
        $citaId = $this->route('id');

        return [
            'fecha' => 'required|date|after_or_equal:today',

            'hora_inicio' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) use ($citaId) {
                    // Rango permitido 08:00 - 17:00
                    $hora         = \Carbon\Carbon::createFromFormat('H:i', $value);
                    $inicioMinimo = \Carbon\Carbon::createFromFormat('H:i', '08:00');
                    $inicioMaximo = \Carbon\Carbon::createFromFormat('H:i', '17:00');

                    if ($hora->lt($inicioMinimo) || $hora->gt($inicioMaximo)) {
                        $fail('El horario debe estar entre las 08:00 y las 17:00.');
                        return;
                    }

                    // Solo intervalos de 30 minutos
                    if (!in_array($hora->minute, [0, 30])) {
                        $fail('Las citas solo pueden programarse en intervalos de 30 minutos (:00 o :30).');
                        return;
                    }

                    // Recuperamos el médico de la cita actual para validar colisiones
                    $cita = \App\Models\Cita::find($citaId);
                    if (!$cita) return;

                    $colision = \App\Models\Cita::where('doc_medico', $cita->doc_medico)
                        ->where('fecha', $this->fecha)
                        ->where('hora_inicio', $value . ':00')   // BD guarda HH:mm:ss
                        ->where('id_cita', '!=', $citaId)        // Excluir la cita actual
                        ->where('id_estado', '!=',               // Excluir canceladas
                            \App\Models\Estado::where('nombre_estado', 'Cancelada')->value('id_estado')
                        )
                        ->exists();

                    if ($colision) {
                        $fail('El médico ya tiene una cita en ese horario. Por favor elige otro.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha.required'         => 'La fecha es obligatoria.',
            'fecha.date'             => 'La fecha no es válida.',
            'fecha.after_or_equal'   => 'No puedes reagendar a una fecha pasada.',
            'hora_inicio.required'   => 'La hora de inicio es obligatoria.',
            'hora_inicio.date_format' => 'El formato de hora debe ser HH:mm.',
        ];
    }
}
