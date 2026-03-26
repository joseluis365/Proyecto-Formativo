<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Remision Medica</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; }
        .header { width: 100%; border-bottom: 3px solid #0056b3; padding-bottom: 10px; margin-bottom: 20px; }
        .header table { width: 100%; }
        .logo-eps { font-size: 24px; font-weight: bold; color: #0056b3; text-transform: uppercase; }
        .doc-title { font-size: 16px; font-weight: bold; color: #555; text-align: right; }
        .system-name { font-size: 10px; color: #777; margin-top: 5px; }

        .card { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px; overflow: hidden; page-break-inside: avoid; }
        .card-header { background-color: #f4f7f6; padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #ddd; color: #0056b3; font-size: 12px; text-transform: uppercase; }
        .card-body { padding: 12px; }

        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { padding: 6px; vertical-align: top; }
        .info-label { font-size: 9px; color: #777; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 2px; }
        .info-value { font-size: 12px; font-weight: bold; color: #222; }

        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-exam { background-color: #e3f2fd; color: #0d47a1; }
        .badge-cita { background-color: #e8f5e9; color: #1b5e20; }
        
        .alert-ayuno { background-color: #ffebee; border: 1px solid #ffcdd2; color: #c62828; padding: 10px; border-radius: 5px; font-weight: bold; margin-bottom: 15px; }
        .observaciones { background-color: #fffde7; border-left: 4px solid #fbc02d; padding: 10px; margin-bottom: 15px; font-style: italic; }
        
        .instrucciones { background-color: #e1f5fe; border: 1px solid #b3e5fc; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .instrucciones h4 { margin: 0 0 5px 0; color: #0277bd; font-size: 11px; text-transform: uppercase; }
        .instrucciones p { margin: 0; font-size: 11px; line-height: 1.5; color: #01579b; }

        .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9px; color: #999; text-align: center; }
    </style>
</head>
<body>

    <div class="header">
        <table>
            <tr>
                <td style="width: 10%; vertical-align: middle;">
                    @if(!empty($logoBase64))
                        <img src="data:image/png;base64,{{ $logoBase64 }}" style="width: 50px; height: 50px;">
                    @endif
                </td>
                <td style="width: 40%; vertical-align: middle;">
                    <div class="logo-eps">SALUVANTA EPS</div>
                    <div class="system-name">Generado por Sanitec</div>
                </td>
                <td style="width: 50%; vertical-align: middle; text-align: right;">
                    <div class="doc-title">
                        @if($remision->tipo_remision === 'examen') ORDEN DE EXAMEN CLÍNICO @else REMISIÓN MÉDICA @endif
                    </div>
                    <div style="margin-top: 5px;">
                        <span class="badge" style="background: #eee; color: #333;">Nº #{{ $remision->id_remision }}</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Cita de Origen -->
    @if($remision->historialDetalle?->cita)
    @php $cita = $remision->historialDetalle->cita; @endphp
    <div class="card">
        <div class="card-header">Datos de la Consulta de Origen</div>
        <div class="card-body">
            <table class="info-table">
                <tr>
                    <td style="width: 50%;">
                        <span class="info-label">Paciente</span>
                        <span class="info-value">{{ $cita->paciente?->primer_nombre }} {{ $cita->paciente?->primer_apellido }}</span>
                    </td>
                    <td style="width: 50%;">
                        <span class="info-label">Documento</span>
                        <span class="info-value">{{ $cita->paciente?->tipo_documento ?? 'CC' }} {{ $cita->paciente?->documento ?? $cita->doc_paciente }}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="info-label">Médico Tratante</span>
                        <span class="info-value">Dr. {{ $cita->medico?->primer_nombre }} {{ $cita->medico?->primer_apellido }}</span>
                    </td>
                    <td>
                        <span class="info-label">Fecha y Hora</span>
                        <span class="info-value">{{ $cita->fecha }} — {{ substr($cita->hora_inicio, 0, 5) }}</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    @endif

    <!-- Detalles de la Remisión -->
    <div class="card">
        <div class="card-header">Detalles de la Solicitud</div>
        <div class="card-body">
            <table class="info-table">
                <tr>
                    <td style="width: 50%;">
                        <span class="info-label">Fecha de Emisión</span>
                        <span class="info-value">{{ $remision->created_at->format('d/m/Y') }}</span>
                    </td>
                    <td style="width: 50%;">
                        <span class="info-label">Tipo de Solicitud</span>
                        <span class="info-value">
                            @if($remision->tipo_remision === 'examen')
                                <span class="badge badge-exam">Examen Clínico</span>
                            @else
                                <span class="badge badge-cita">Interconsulta / Especialista</span>
                            @endif
                        </span>
                    </td>
                </tr>

                @if($remision->tipo_remision === 'cita')
                    <tr>
                        <td>
                            <span class="info-label">Especialidad Destino</span>
                            <span class="info-value">{{ $remision->especialidad?->especialidad ?? '—' }}</span>
                        </td>
                        <td>
                            <span class="info-label">Prioridad</span>
                            <span class="info-value" style="color: {{ $remision->prioridad?->nombre_prioridad == 'Urgente' ? '#c62828' : '#333' }};">{{ $remision->prioridad?->nombre_prioridad ?? 'Normal' }}</span>
                        </td>
                    </tr>
                    @if($remision->cita)
                        <tr>
                            <td>
                                <span class="info-label">Médico Receptor Asignado</span>
                                <span class="info-value">Dr. {{ $remision->cita->medico?->primer_nombre }} {{ $remision->cita->medico?->primer_apellido }}</span>
                            </td>
                            <td>
                                <span class="info-label">Cita Asignada</span>
                                <span class="info-value">{{ $remision->cita->fecha }} a las {{ substr($remision->cita->hora_inicio, 0, 5) }}</span>
                            </td>
                        </tr>
                    @endif
                @else
                    <tr>
                        <td>
                            <span class="info-label">Categoría de Examen</span>
                            <span class="info-value">{{ $remision->categoriaExamen?->categoria ?? $remision->categoria_examen?->categoria ?? '—' }}</span>
                        </td>
                        <td>
                            <span class="info-label">Prioridad</span>
                            <span class="info-value" style="color: {{ $remision->prioridad?->nombre_prioridad == 'Urgente' ? '#c62828' : '#333' }};">{{ $remision->prioridad?->nombre_prioridad ?? 'Normal' }}</span>
                        </td>
                    </tr>
                    @if($remision->examen)
                        <tr>
                            <td colspan="2">
                                <span class="info-label">Cita de Examen Asignada</span>
                                <span class="info-value">{{ $remision->examen->fecha }} a las {{ substr($remision->examen->hora_inicio, 0, 5) }}</span>
                            </td>
                        </tr>
                    @endif
                @endif
            </table>
        </div>
    </div>

    @if($remision->requiere_ayuno && $remision->tipo_remision === 'examen')
    <div class="alert-ayuno">
        <strong>ADVERTENCIA:</strong> REQUIERE AYUNO: Este examen requiere un mínimo de 8 a 12 horas de ayuno. No consuma alimentos ni bebidas (sólo agua si es necesario).
    </div>
    @endif

    @if($remision->notas)
    <div class="observaciones">
        <strong>Observaciones Clínicas / Motivo:</strong><br>
        {{ $remision->notas }}
    </div>
    @endif

    <div class="instrucciones">
        <h4>Instrucciones Generales para el Paciente</h4>
        <p>
            - Presente este documento impreso o digital al momento de requerir el servicio.<br>
            - La presente orden es válida por un período máximo de 30 días calendario contados a partir de su emisión.<br>
            @if($remision->tipo_remision === 'examen')
            - Diríjase al área de Laboratorio Clínico o Imágenes Diagnósticas según corresponda al tipo de examen.
            @else
            - Solicite su cita en los canales de atención de Saluvanta EPS para acceder al especialista indicado.
            @endif
        </p>
    </div>

    <div class="footer">
        Documento Oficial &copy; Saluvanta EPS | Generado por el Sistema de Información Sanitec | Fecha: {{ now()->format('d/m/Y H:i A') }}
    </div>

</body>
</html>
