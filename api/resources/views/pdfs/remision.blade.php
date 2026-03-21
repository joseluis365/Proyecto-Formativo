<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1f2937; background: #fff; padding: 32px; }

    .header { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; padding: 24px 28px; border-radius: 8px; margin-bottom: 28px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-area h1 { font-size: 18px; font-weight: 700; letter-spacing: 0.05em; }
    .logo-area p { font-size: 10px; opacity: 0.85; margin-top: 2px; }
    .doc-info { text-align: right; }
    .doc-info .label { font-size: 9px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.08em; }
    .doc-info .value { font-size: 14px; font-weight: 700; }
    .doc-badge { display: inline-block; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 20px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }

    .section { margin-bottom: 20px; }
    .section-title { font-size: 9px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1.5px solid #ede9fe; padding-bottom: 5px; margin-bottom: 12px; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; }
    .info-item .lbl { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    .info-item .val { font-size: 11px; color: #1f2937; margin-top: 1px; font-weight: 500; }

    .text-block { background: #f8fafc; border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; padding: 12px 14px; margin-top: 4px; }
    .text-block p { font-size: 11px; line-height: 1.6; color: #374151; }

    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
    .badge-exam { background: #dbeafe; color: #1e40af; }
    .badge-cita { background: #d1fae5; color: #065f46; }

    .priority-box { background: #fef9c3; border: 1px solid #fde68a; border-radius: 6px; padding: 10px 14px; margin-top: 10px; }
    .priority-box p { font-size: 10px; color: #78350f; }

    .ayuno-box { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px 14px; margin-top: 10px; }
    .ayuno-box p { font-size: 10px; color: #7f1d1d; font-weight: 600; }

    .notice-box { background: #e0f2fe; border: 1px solid #7dd3fc; border-radius: 6px; padding: 12px 14px; margin-top: 12px; }
    .notice-box h4 { font-size: 9px; font-weight: 700; color: #0369a1; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .notice-box p { font-size: 10px; color: #0c4a6e; line-height: 1.5; }

    .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 9px; color: #94a3b8; }
</style>
</head>
<body>

<div class="header">
    <div class="header-top">
        <div style="display: flex; align-items: center; gap: 15px;">
            @if(!empty($logoBase64))
                <img src="data:image/png;base64,{{ $logoBase64 }}" style="width: 45px; height: 45px; margin-right: 12px; vertical-align: middle;">
            @endif
            <div style="display: inline-block; vertical-align: middle;">
                <h1 style="font-size: 18px; font-weight: 700; letter-spacing: 0.05em; margin: 0;">SALUVANTA EPS</h1>
                <p style="font-size: 10px; opacity: 0.85; margin-top: 2px;">
                    @if($remision->tipo_remision === 'examen') Orden de Examen Clínico @else Remisión Médica @endif
                </p>
            </div>
        </div>
        <div class="doc-info">
            <div class="label">Nº de Remisión</div>
            <div class="value">#{{ $remision->id_remision }}</div>
            @if($remision->tipo_remision === 'examen')
            <div class="doc-badge">Examen Clínico</div>
            @else
            <div class="doc-badge">Interconsulta</div>
            @endif
        </div>
    </div>
</div>

<!-- Cita de Origen -->
@if($remision->historialDetalle?->cita)
@php $cita = $remision->historialDetalle->cita; @endphp
<div class="section">
    <div class="section-title">Cita Médica de Origen — #{{ $cita->id_cita }}</div>
    <div class="info-grid">
        <div class="info-item">
            <div class="lbl">Paciente</div>
            <div class="val">{{ $cita->paciente?->primer_nombre }} {{ $cita->paciente?->primer_apellido }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Documento</div>
            <div class="val">{{ $cita->paciente?->documento ?? $cita->doc_paciente }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Médico que Remite</div>
            <div class="val">Dr. {{ $cita->medico?->primer_nombre }} {{ $cita->medico?->primer_apellido }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Fecha de Consulta</div>
            <div class="val">{{ $cita->fecha }} — {{ substr($cita->hora_inicio, 0, 5) }}</div>
        </div>
    </div>
</div>
@endif

<!-- Detalles de la Remisión -->
<div class="section">
    <div class="section-title">Detalles de la Remisión</div>
    <div class="info-grid">
        <div class="info-item">
            <div class="lbl">Fecha de Emisión</div>
            <div class="val">{{ $remision->created_at->format('d/m/Y') }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Tipo</div>
            <div class="val">
                @if($remision->tipo_remision === 'examen')
                <span class="badge badge-exam">Examen Clínico</span>
                @else
                <span class="badge badge-cita">Interconsulta / Especialista</span>
                @endif
            </div>
        </div>
        @if($remision->tipo_remision === 'cita')
        <div class="info-item">
            <div class="lbl">Especialidad Destino</div>
            <div class="val">{{ $remision->especialidad?->especialidad ?? '—' }}</div>
        </div>
        @if($remision->cita)
        <div class="info-item">
            <div class="lbl">Médico Receptor</div>
            <div class="val">Dr. {{ $remision->cita->medico?->primer_nombre }} {{ $remision->cita->medico?->primer_apellido }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Fecha de Cita</div>
            <div class="val">{{ $remision->cita->fecha }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Hora de Cita</div>
            <div class="val">{{ substr($remision->cita->hora_inicio, 0, 5) }}</div>
        </div>
        @endif
        @else
        <div class="info-item">
            <div class="lbl">Categoría de Examen</div>
            <div class="val">{{ $remision->categoriaExamen?->categoria ?? '—' }}</div>
        </div>
        @if($remision->examen)
        <div class="info-item">
            <div class="lbl">Fecha de Examen</div>
            <div class="val">{{ $remision->examen->fecha }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Hora de Examen</div>
            <div class="val">{{ substr($remision->examen->hora_inicio, 0, 5) }}</div>
        </div>
        @endif
        @endif
        <div class="info-item">
            <div class="lbl">Prioridad</div>
            <div class="val">{{ $remision->prioridad?->nombre_prioridad ?? 'Normal' }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Estado</div>
            <div class="val">{{ $remision->estado?->nombre_estado ?? 'Activa' }}</div>
        </div>
        @if($remision->tipo_remision === 'examen')
        <div class="info-item">
            <div class="lbl">Requiere Ayuno</div>
            <div class="val">{{ $remision->requiere_ayuno ? '✅ SÍ — acuda en ayunas' : 'No requiere ayuno' }}</div>
        </div>
        @endif
    </div>

    @if($remision->requiere_ayuno && $remision->tipo_remision === 'examen')
    <div class="ayuno-box"><p>⚠️ IMPORTANTE: Este examen requiere ayuno mínimo de 8 horas. No consuma alimentos ni bebidas azucaradas antes de la prueba. Puede tomar agua.</p></div>
    @endif
</div>

@if($remision->notas)
<div class="section">
    <div class="section-title">Observaciones y Motivo</div>
    <div class="text-block"><p>{{ $remision->notas }}</p></div>
</div>
@endif

<div class="notice-box">
    <h4>📌 Instrucciones para el Paciente</h4>
    <p>
        Presente este documento en la recepción del servicio indicado para solicitar su cita o atención.
        Este documento tiene validez de 30 días a partir de la fecha de emisión.
        @if($remision->tipo_remision === 'examen')
        Diríjase al área de Laboratorio o Imágenes según corresponda al tipo de examen solicitado.
        @else
        Acuda al servicio de {{ $remision->especialidad?->especialidad ?? 'especialidad indicada' }} con este documento y su documento de identidad.
        @endif
    </p>
</div>

<div class="footer">
    <p>Documento generado por Saluvanta EPS (Sanitech) · {{ now()->format('d/m/Y H:i') }}</p>
    <p>Remisión #{{ $remision->id_remision }} · Cita Origen #{{ $remision->historialDetalle?->cita?->id_cita ?? '—' }}</p>
</div>

</body>
</html>
