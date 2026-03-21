<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1f2937; background: #fff; padding: 32px; }

    .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 24px 28px; border-radius: 8px; margin-bottom: 28px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-area h1 { font-size: 18px; font-weight: 700; letter-spacing: 0.05em; }
    .logo-area p { font-size: 10px; opacity: 0.85; margin-top: 2px; }
    .doc-info { text-align: right; }
    .doc-info .label { font-size: 9px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.08em; }
    .doc-info .value { font-size: 14px; font-weight: 700; }
    .doc-badge { display: inline-block; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 20px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }

    .section { margin-bottom: 20px; }
    .section-title { font-size: 9px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1.5px solid #d1fae5; padding-bottom: 5px; margin-bottom: 12px; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; }
    .info-item .lbl { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    .info-item .val { font-size: 11px; color: #1f2937; margin-top: 1px; font-weight: 500; }

    .text-block { background: #f8fafc; border-left: 3px solid #059669; border-radius: 0 6px 6px 0; padding: 12px 14px; margin-top: 4px; }
    .text-block p { font-size: 11px; line-height: 1.6; color: #374151; }

    .med-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    .med-table th { background: #059669; color: white; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 7px 10px; text-align: left; }
    .med-table td { font-size: 10px; padding: 9px 10px; border-bottom: 1px solid #f1f5f9; color: #374151; }
    .med-table tr:last-child td { border-bottom: none; }
    .med-table tr:nth-child(even) td { background: #f0fdf4; }
    .med-table .med-name { font-weight: 700; color: #065f46; }

    .status-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
    .status-pendiente { background: #fef9c3; color: #854d0e; }
    .status-dispensada { background: #dcfce7; color: #15803d; }

    .notice-box { background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 6px; padding: 14px 16px; margin-top: 12px; }
    .notice-box h4 { font-size: 9px; font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
    .notice-box p { font-size: 10px; color: #047857; line-height: 1.6; }

    .warning-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 10px 14px; margin-top: 10px; }
    .warning-box p { font-size: 10px; color: #9a3412; }

    .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 9px; color: #94a3b8; }
    .footer .stamp { font-size: 9px; color: #94a3b8; text-align: right; }
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
                <p style="font-size: 10px; opacity: 0.85; margin-top: 2px;">Receta Médica — Documento Oficial</p>
            </div>
        </div>
        <div class="doc-info">
            <div class="label">Nº de Receta</div>
            <div class="value">#{{ $receta->id_receta }}</div>
            <div class="doc-badge">
                @if($receta->estado?->nombre_estado === 'Dispensada') Dispensada
                @else Pendiente de Reclamar
                @endif
            </div>
        </div>
    </div>
</div>

<!-- Cita de Origen -->
@if($receta->historialDetalle?->cita)
@php $cita = $receta->historialDetalle->cita; @endphp
<div class="section">
    <div class="section-title">Información de la Cita Médica — #{{ $cita->id_cita }}</div>
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
            <div class="lbl">Médico Prescriptor</div>
            <div class="val">Dr. {{ $cita->medico?->primer_nombre }} {{ $cita->medico?->primer_apellido }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Especialidad</div>
            <div class="val">{{ $cita->especialidad?->especialidad ?? 'Medicina General' }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Fecha de Emisión</div>
            <div class="val">{{ $receta->created_at->format('d/m/Y') }}</div>
        </div>
        <div class="info-item">
            <div class="lbl">Fecha de Vencimiento</div>
            <div class="val">{{ $receta->fecha_vencimiento ?? 'Según indicación médica' }}</div>
        </div>
    </div>
</div>
@endif

<!-- Medicamentos -->
<div class="section">
    <div class="section-title">Medicamentos Recetados</div>
    @if($receta->recetaDetalles && count($receta->recetaDetalles) > 0)
    <table class="med-table">
        <thead>
            <tr>
                <th>Medicamento</th>
                <th>Presentación</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Duración</th>
                <th>Cant.</th>
                <th>Observaciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($receta->recetaDetalles as $det)
            <tr>
                <td>
                    <span class="med-name">{{ $det->presentacion?->medicamento?->nombre ?? '—' }}</span>
                </td>
                <td>{{ $det->presentacion?->concentracion?->concentracion ?? '' }} {{ $det->presentacion?->formaFarmaceutica?->forma_farmaceutica ?? '' }}</td>
                <td><strong>{{ $det->dosis }}</strong></td>
                <td>{{ $det->frecuencia }}</td>
                <td>{{ $det->duracion }}</td>
                <td>{{ $det->cantidad_dispensar }}</td>
                <td>{{ $det->observaciones ?? '—' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Farmacia por medicamento -->
    @php $farmacias = collect($receta->recetaDetalles)->groupBy(fn($d) => $d->nit_farmacia)->filter(fn($g, $nit) => $nit); @endphp
    @if($farmacias->count() > 0)
    <div style="margin-top: 14px;">
        <div style="font-size: 9px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Farmacias Asignadas</div>
        @foreach($farmacias as $nit => $dets)
        @php $farmacia = $dets->first()->farmacia; @endphp
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px 12px; margin-bottom: 6px;">
            <p style="font-size: 10px; font-weight: 700; color: #065f46;">🏪 {{ $farmacia?->nombre ?? 'Farmacia NIT: '.$nit }}</p>
            @if($farmacia?->direccion) <p style="font-size: 9px; color: #64748b; margin-top: 2px;">📍 {{ $farmacia->direccion }}</p> @endif
            @if($farmacia?->telefono) <p style="font-size: 9px; color: #64748b;">📞 {{ $farmacia->telefono }}</p> @endif
        </div>
        @endforeach
    </div>
    @endif
    @else
    <p style="text-align: center; padding: 20px; color: #94a3b8; font-size: 11px;">Sin medicamentos registrados</p>
    @endif
</div>

<div class="notice-box">
    <h4>📌 Instrucciones para Reclamar sus Medicamentos</h4>
    <p>
        1. Diríjase a la farmacia indicada portando este documento y su cédula de identidad.<br>
        2. Presente este documento al farmacéutico en el área de dispensación.<br>
        3. Recuerde verificar la fecha de vencimiento de la receta antes de acudir.<br>
        4. Si tiene preguntas sobre la dosificación, consulte con su médico tratante o el farmacéutico.
    </p>
</div>

@if($receta->estado?->nombre_estado === 'Dispensada')
<div class="warning-box" style="margin-top: 10px;">
    <p>⚠️ Esta receta ya fue dispensada por la farmacia. No es válida para una segunda dispensación.</p>
</div>
@endif

<div class="footer">
    <p>Documento generado por Saluvanta EPS (Sanitech) · {{ now()->format('d/m/Y H:i') }}</p>
    <div class="stamp">
        <p>Firma Médico Prescriptor</p>
        <p style="margin-top: 28px; border-top: 1px solid #cbd5e1; padding-top: 4px;">
            Dr. {{ $receta->historialDetalle?->cita?->medico?->primer_nombre }} {{ $receta->historialDetalle?->cita?->medico?->primer_apellido }}
        </p>
    </div>
</div>

</body>
</html>
