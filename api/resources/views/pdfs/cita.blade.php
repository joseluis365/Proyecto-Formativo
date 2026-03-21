<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1f2937; background: #fff; padding: 32px; }

    /* Header */
    .header { background: linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%); color: white; padding: 24px 28px; border-radius: 8px; margin-bottom: 28px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-area h1 { font-size: 18px; font-weight: 700; letter-spacing: 0.05em; }
    .logo-area p { font-size: 10px; opacity: 0.85; margin-top: 2px; }
    .doc-info { text-align: right; }
    .doc-info .label { font-size: 9px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.08em; }
    .doc-info .value { font-size: 14px; font-weight: 700; }
    .doc-badge { display: inline-block; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 20px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }

    /* Section */
    .section { margin-bottom: 20px; }
    .section-title { font-size: 9px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1.5px solid #dbeafe; padding-bottom: 5px; margin-bottom: 12px; }

    /* Info grid */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; }
    .info-item .lbl { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    .info-item .val { font-size: 11px; color: #1f2937; margin-top: 1px; font-weight: 500; }

    /* Text block */
    .text-block { background: #f8fafc; border-left: 3px solid #1d4ed8; border-radius: 0 6px 6px 0; padding: 12px 14px; margin-top: 4px; }
    .text-block p { font-size: 11px; line-height: 1.6; color: #374151; }

    /* Badges */
    .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-purple { background: #f3e8ff; color: #7e22ce; }
    .badge-yellow { background: #fef9c3; color: #854d0e; }

    /* Table */
    .med-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    .med-table th { background: #1d4ed8; color: white; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 7px 10px; text-align: left; }
    .med-table td { font-size: 10px; padding: 8px 10px; border-bottom: 1px solid #f1f5f9; color: #374151; }
    .med-table tr:last-child td { border-bottom: none; }
    .med-table tr:nth-child(even) td { background: #f8fafc; }

    /* ICD badges row */
    .icd-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .icd-badge { background: #eff6ff; border: 1px solid #bfdbfe; padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; color: #1e40af; }

    /* Footer */
    .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 9px; color: #94a3b8; }
    .footer .stamp { font-size: 9px; color: #94a3b8; text-align: right; }

    /* Remision card */
    .remision-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; margin-bottom: 10px; }
    .remision-card .type-badge { margin-bottom: 8px; }

    /* Notice box */
    .notice-box { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; padding: 12px 14px; }
    .notice-box p { font-size: 10px; color: #92400e; line-height: 1.5; }
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
                <p style="font-size: 10px; opacity: 0.85; margin-top: 2px;">Atención Médica — Documento Oficial</p>
            </div>
        </div>
        <div class="doc-info">
            <div class="label">Nº de Consulta</div>
            <div class="value">#{{ $cita->id_cita }}</div>
            <div class="doc-badge">Cita Atendida</div>
        </div>
    </div>
</div>

<!-- Información General -->
<div class="section">
    <div class="section-title">Información General</div>
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
            <div class="lbl">Médico Tratante</div>
            <div class="val">Dr. {{ $cita->medico?->primer_nombre }} {{ $cita->medico?->primer_apellido }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Especialidad</div>
            <div class="val">{{ $cita->especialidad?->especialidad ?? 'Medicina General' }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Fecha</div>
            <div class="val">{{ $cita->fecha }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Hora</div>
            <div class="val">{{ substr($cita->hora_inicio, 0, 5) }}</div>
        </div>
    </div>
</div>

@if($cita->historialDetalle)
@php $det = $cita->historialDetalle; @endphp

@if($det->subjetivo)
<div class="section">
    <div class="section-title">Motivo de Consulta</div>
    <div class="text-block"><p>{{ $det->subjetivo }}</p></div>
</div>
@endif

@if($det->diagnostico)
<div class="section">
    <div class="section-title">Diagnóstico Clínico</div>
    @if($det->enfermedades && count($det->enfermedades) > 0)
    <div class="icd-row">
        @foreach($det->enfermedades as $enf)
        <span class="icd-badge">[{{ $enf->codigo_icd }}] {{ $enf->nombre }}</span>
        @endforeach
    </div>
    @endif
    <div class="text-block" style="margin-top: 8px;"><p>{{ $det->diagnostico }}</p></div>
</div>
@endif

@if($det->tratamiento)
<div class="section">
    <div class="section-title">Plan de Tratamiento</div>
    <div class="text-block"><p>{{ $det->tratamiento }}</p></div>
</div>
@endif

@if($det->observaciones)
<div class="section">
    <div class="section-title">Observaciones</div>
    <div class="text-block"><p>{{ $det->observaciones }}</p></div>
</div>
@endif

@if($det->receta && $det->receta->recetaDetalles && count($det->receta->recetaDetalles) > 0)
<div class="section">
    <div class="section-title">Receta Médica · ID #{{ $det->receta->id_receta }}</div>
    <table class="med-table">
        <thead>
            <tr>
                <th>Medicamento</th>
                <th>Presentación</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Duración</th>
                <th>Farmacia</th>
            </tr>
        </thead>
        <tbody>
            @foreach($det->receta->recetaDetalles as $rd)
            <tr>
                <td><strong>{{ $rd->presentacion?->medicamento?->nombre ?? '—' }}</strong></td>
                <td>{{ $rd->presentacion?->concentracion?->concentracion ?? '' }} {{ $rd->presentacion?->formaFarmaceutica?->forma_farmaceutica ?? '' }}</td>
                <td>{{ $rd->dosis }} (Cant: {{ $rd->cantidad_dispensar }})</td>
                <td>{{ $rd->frecuencia }}</td>
                <td>{{ $rd->duracion }}</td>
                <td>{{ $rd->farmacia?->nombre ?? $rd->nit_farmacia }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif

@if($det->remisiones && count($det->remisiones) > 0)
<div class="section">
    <div class="section-title">Remisiones Generadas ({{ count($det->remisiones) }})</div>
    @foreach($det->remisiones as $r)
    <div class="remision-card">
        <div class="type-badge">
            @if($r->tipo_remision === 'examen')
            <span class="badge badge-blue">Examen Clínico</span>
            @else
            <span class="badge badge-green">Interconsulta / Especialista</span>
            @endif
        </div>
        <div class="info-grid" style="margin-top: 4px; padding: 10px;">
            <div class="info-item"><div class="lbl">Emisión</div><div class="val">{{ $r->created_at->format('d/m/Y') }}</div></div>
            @if($r->tipo_remision === 'cita')
            <div class="info-item"><div class="lbl">Especialidad</div><div class="val">{{ $r->especialidad?->especialidad ?? '—' }}</div></div>
            @if($r->cita)
            <div class="info-item"><div class="lbl">Fecha Cita</div><div class="val">{{ $r->cita->fecha }} ({{ substr($r->cita->hora_inicio, 0, 5) }})</div></div>
            <div class="info-item"><div class="lbl">Médico</div><div class="val">Dr. {{ $r->cita->medico?->primer_nombre }} {{ $r->cita->medico?->primer_apellido }}</div></div>
            @endif
            @else
            <div class="info-item"><div class="lbl">Examen</div><div class="val">{{ $r->categoriaExamen?->categoria ?? '—' }}</div></div>
            @if($r->examen)
            <div class="info-item"><div class="lbl">Fecha Examen</div><div class="val">{{ $r->examen->fecha }} ({{ substr($r->examen->hora_inicio, 0, 5) }})</div></div>
            @endif
            <div class="info-item"><div class="lbl">Requiere Ayuno</div><div class="val">{{ $r->requiere_ayuno ? 'Sí' : 'No' }}</div></div>
            @endif
            <div class="info-item"><div class="lbl">Prioridad</div><div class="val">{{ $r->prioridad?->nombre_prioridad ?? 'Normal' }}</div></div>
            <div class="info-item"><div class="lbl">Estado</div><div class="val">{{ $r->estado?->nombre_estado ?? 'Activa' }}</div></div>
        </div>
        @if($r->notas)
        <p style="font-size: 10px; color: #64748b; margin-top: 6px;">📝 {{ $r->notas }}</p>
        @endif
    </div>
    @endforeach
</div>
@endif

@endif

<div class="footer">
    <p>Documento generado por Saluvanta EPS (Sanitech) · {{ now()->format('d/m/Y H:i') }}</p>
    <div class="stamp">
        <p>Firma Médico Tratante</p>
        <p style="margin-top: 28px; border-top: 1px solid #cbd5e1; padding-top: 4px;">Dr. {{ $cita->medico?->primer_nombre }} {{ $cita->medico?->primer_apellido }}</p>
    </div>
</div>

</body>
</html>
