<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Examen Médico Asignado</title>
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
        <h1>Examen Clínico Asignado</h1>
    </div>
    
    <div class="content">
        <p class="greeting">Estimado(a) paciente,</p>
        <p style="color: #64748b; font-size: 15px;">Te confirmamos que se ha asignado una nueva cita para examen de laboratorio en el sistema de <strong>Saluvanta EPS</strong> con los siguientes detalles:</p>

        <div class="section" style="margin-top: 30px;">
            <div class="data-row">
                <span class="data-label">Documento del Paciente:</span>
                <span class="data-value">{{ $examen->doc_paciente }}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Tipo de Examen:</span>
                <span class="data-value">{{ $examen->categoriaExamen->categoria ?? 'Examen General' }}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Fecha Programada:</span>
                <span class="data-value">{{ \Carbon\Carbon::parse($examen->fecha)->format('d \d\e F, Y') }}</span>
            </div>
            @if($examen->hora_inicio)
            <div class="data-row">
                <span class="data-label">Hora:</span>
                <span class="data-value">{{ \Carbon\Carbon::parse($examen->hora_inicio)->format('h:i A') }}</span>
            </div>
            @else
            <div class="data-row">
                <span class="data-label">Aviso importante:</span>
                <span class="data-value" style="font-size: 13px; font-style: italic; color: #64748b;">La hora exacta será confirmada posteriormente.</span>
            </div>
            @endif
            <div class="data-row" style="margin-top: 15px;">
                <span class="data-label">Descripción:</span>
                <span class="data-value">{{ $examen->descripcion ?? 'Examen general de laboratorio' }}</span>
            </div>
        </div>

        @if($examen->requiere_ayuno)
        <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 5px 0; color: #DC2626;">Requiere Ayuno</h4>
            <p style="margin: 0; font-size: 14px; color: #991B1B;">Para este examen es estrictamente necesario presentarse en ayunas. Por favor, consulta los tiempos de ayuno con nuestro personal y abstente de ingerir alimentos o bebidas.</p>
        </div>
        @else
        <div style="background-color: #F0FDF4; border-left: 4px solid #22C55E; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #166534;">Este examen <strong>no requiere ayuno</strong>. Puedes presentarte con normalidad.</p>
        </div>
        @endif

        <p style="text-align: center; font-size: 14px; color: #475569;">
            Por favor, preséntate con 15 minutos de anticipación.<br>
            Puedes revisar más detalles en tu portal de salud.
        </p>
    </div>

    <div class="footer">
        Este correo es generado de manera automática, por favor no respondas a este remitente.<br>
        <strong>Saluvanta EPS</strong> &copy; {{ date('Y') }}
    </div>
</div>

</body>
</html>
