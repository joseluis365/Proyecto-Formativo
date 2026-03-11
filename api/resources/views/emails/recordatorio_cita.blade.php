<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recordatorio de Cita Médica</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif; color:#333;">

    <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        {{-- Cabecera --}}
        <div style="background:linear-gradient(135deg, #0056b3, #007bff); padding:32px 24px; text-align:center;">
            <p style="margin:0; font-size:36px;">⏰</p>
            <h1 style="margin:12px 0 4px; color:#ffffff; font-size:22px; font-weight:700;">
                Recordatorio de Cita Médica
            </h1>
            <p style="margin:0; color:#cce0ff; font-size:14px;">Tu cita es mañana</p>
        </div>

        {{-- Saludo --}}
        <div style="padding:28px 32px 0;">
            @php
                $paciente = $cita->paciente;
                $medico   = $cita->medico;
                $nombrePaciente = $paciente
                    ? trim($paciente->primer_nombre . ' ' . $paciente->primer_apellido)
                    : 'Paciente';
                $nombreMedico = $medico
                    ? trim($medico->primer_nombre . ' ' . $medico->primer_apellido)
                    : 'tu médico';
                $fecha = \Carbon\Carbon::parse($cita->fecha)->locale('es')->translatedFormat('l, d \de F \de Y');
            @endphp

            <p style="font-size:16px; margin:0 0 20px;">
                Hola, <strong>{{ $nombrePaciente }}</strong>:
            </p>
            <p style="font-size:15px; margin:0 0 24px; line-height:1.6;">
                Te recordamos que tienes una <strong>cita médica programada para mañana</strong>.
                Por favor, preséntate puntualmente en la institución.
            </p>
        </div>

        {{-- Detalle de la cita --}}
        <div style="margin:0 32px 28px; background:#f0f6ff; border-left:4px solid #007bff; border-radius:4px; padding:20px 24px;">
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
                <tr>
                    <td style="padding:6px 0; color:#555; width:40%;"><strong>📅 Fecha:</strong></td>
                    <td style="padding:6px 0; text-transform:capitalize;">{{ $fecha }}</td>
                </tr>
                <tr>
                    <td style="padding:6px 0; color:#555;"><strong>🕐 Hora:</strong></td>
                    <td style="padding:6px 0;">{{ \Carbon\Carbon::createFromFormat('H:i:s', $cita->hora_inicio)->format('h:i A') }}</td>
                </tr>
                <tr>
                    <td style="padding:6px 0; color:#555;"><strong>👨‍⚕️ Médico:</strong></td>
                    <td style="padding:6px 0;">{{ $nombreMedico }}</td>
                </tr>
                @if($cita->tipoCita)
                <tr>
                    <td style="padding:6px 0; color:#555;"><strong>🏥 Tipo de cita:</strong></td>
                    <td style="padding:6px 0;">{{ $cita->tipoCita->nombre_tipo_cita ?? '—' }}</td>
                </tr>
                @endif
                @if($cita->motivo)
                <tr>
                    <td style="padding:6px 0; color:#555;"><strong>📋 Motivo:</strong></td>
                    <td style="padding:6px 0;">{{ $cita->motivo }}</td>
                </tr>
                @endif
            </table>
        </div>

        {{-- Recomendaciones --}}
        <div style="padding:0 32px 28px;">
            <p style="font-size:14px; color:#555; margin:0 0 8px;"><strong>Recomendaciones:</strong></p>
            <ul style="font-size:14px; color:#555; padding-left:20px; margin:0; line-height:1.8;">
                <li>Lleva tu documento de identidad.</li>
                <li>Preséntate con al menos 10 minutos de anticipación.</li>
                <li>Si no puedes asistir, cancela tu cita con anticipación desde el portal.</li>
            </ul>
        </div>

        {{-- Footer --}}
        <div style="background:#f4f6f9; padding:20px 32px; text-align:center; border-top:1px solid #e0e0e0;">
            <p style="margin:0; font-size:13px; color:#888;">
                Este es un mensaje automático. Por favor, no respondas a este correo.
            </p>
            <p style="margin:8px 0 0; font-size:13px; color:#888;">
                <strong>El equipo de tu EPS</strong>
            </p>
        </div>
    </div>

</body>
</html>
