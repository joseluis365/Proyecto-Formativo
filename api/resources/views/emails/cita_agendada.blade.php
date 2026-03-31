<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Notificación de Cita Agendada</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7f6; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #3B82F6; color: white; padding: 30px 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px; }
        .greeting { font-size: 18px; margin-bottom: 20px; color: #1e293b; }
        .section { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
        .data-row { margin-bottom: 10px; }
        .data-label { font-weight: 600; color: #64748b; font-size: 14px; }
        .data-value { font-size: 15px; color: #334155; display: block; margin-top: 3px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>¡Hola! Tu cita ha sido agendada</h1>
    </div>
    
    <div class="content">
        <p class="greeting">Estimado(a) paciente,</p>
        <p style="color: #64748b; font-size: 15px;">Te confirmamos que se ha agendado exitosamente una nueva cita médica en el sistema de <strong>Saluvanta EPS</strong> con los siguientes detalles:</p>

        <div class="section" style="margin-top: 30px;">
            <div class="data-row">
                <span class="data-label">Paciente:</span>
                <span class="data-value">{{ $cita->paciente->nombre_completo ?? $cita->doc_paciente }}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Médico:</span>
                <span class="data-value">{{ $cita->medico->nombre_completo ?? 'Sin Asignar' }}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Fecha Programada:</span>
                <span class="data-value">{{ \Carbon\Carbon::parse($cita->fecha)->translatedFormat('d \d\e F, Y') }}</span>
            </div>
            @if($cita->hora_inicio)
            <div class="data-row">
                <span class="data-label">Hora:</span>
                <span class="data-value">{{ \Carbon\Carbon::parse($cita->hora_inicio)->format('h:i A') }}</span>
            </div>
            @else
            <div class="data-row">
                <span class="data-label">Aviso importante:</span>
                <span class="data-value" style="font-size: 13px; font-style: italic; color: #64748b;">La hora exacta será confirmada posteriormente.</span>
            </div>
            @endif
            <div class="data-row" style="margin-top: 15px;">
                <span class="data-label">Motivo de la Cita:</span>
                <span class="data-value">{{ $cita->motivo ?? 'Consulta General' }}</span>
            </div>
        </div>

        <p style="text-align: center; font-size: 14px; color: #475569;">
            Por favor, preséntate con 15 minutos de anticipación.<br>
            Si necesitas cancelar o reagendar, hazlo con mínimo 24 horas de antelación en el portal web.
        </p>
    </div>

    <div class="footer">
        Este correo es generado de manera automática, por favor no respondas a este remitente.<br>
        <strong>Saluvanta EPS</strong> &copy; {{ date('Y') }}
    </div>
</div>

</body>
</html>
