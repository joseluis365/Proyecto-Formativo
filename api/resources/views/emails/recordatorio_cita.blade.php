<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recordatorio: {{ ucfirst($tipoEvento) }} Mañana</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7f6; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #F59E0B; color: white; padding: 30px 40px; text-align: center; } /* Amber para recordatorios */
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
        <h1>¡Recordatorio de tu {{ ucfirst($tipoEvento) }}!</h1>
    </div>
    
    <div class="content">
        <p class="greeting">Estimado(a) paciente,</p>
        <p style="color: #64748b; font-size: 15px;">Te recordamos que tienes una atención médica programada para el día de <strong>mañana</strong> en <strong>Saluvanta EPS</strong>.</p>

        <div class="section" style="margin-top: 30px;">
            <div class="data-row">
                <span class="data-label">Fecha Programada:</span>
                <span class="data-value">{{ \Carbon\Carbon::parse($registro->fecha)->translatedFormat('d \d\e F, Y') }}</span>
            </div>
            
            @if($registro->hora_inicio)
            <div class="data-row">
                <span class="data-label">Hora exacto de llegada (Presentarse 15 mins antes):</span>
                <span class="data-value">{{ \Carbon\Carbon::parse($registro->hora_inicio)->format('h:i A') }}</span>
            </div>
            @endif

            @if($tipoEvento === 'examen')
                <div class="data-row">
                    <span class="data-label">Tipo de Examen:</span>
                    <span class="data-value">{{ $registro->categoriaExamen->categoria ?? 'Examen General' }}</span>
                </div>
            @elseif($tipoEvento === 'cita' || $tipoEvento === 'remisión')
                <div class="data-row">
                    <span class="data-label">Motivo de Cita:</span>
                    <span class="data-value">{{ $registro->motivo ?? 'Consulta General' }}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">Médico:</span>
                    <span class="data-value">{{ $registro->medico->nombre_completo ?? 'Sin Especificar' }}</span>
                </div>
            @endif
        </div>

        @if($tipoEvento === 'examen' && $registro->requiere_ayuno)
        <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 5px 0; color: #DC2626;">¡Alta Importancia: Ayuno Estricto!</h4>
            <p style="margin: 0; font-size: 14px; color: #991B1B;">Recuerda que para este examen es obligatorio presentarse en ayunas. Por favor evita comidas fuertes desde la cena y consulta tu protocolo de prevención.</p>
        </div>
        @endif

        <p style="text-align: center; font-size: 14px; color: #475569;">
            Recuerda llevar tu documento de identidad y autorizaciones si aplican.
        </p>
    </div>

    <div class="footer">
        Este correo es generado de manera automática, por favor no respondas a este remitente.<br>
        Si un médico te ha autorizado medicamentos o tienes dudas, puedes ingresar a tu portal web.<br>
        <strong>Saluvanta EPS</strong> &copy; {{ date('Y') }}
    </div>
</div>

</body>
</html>
