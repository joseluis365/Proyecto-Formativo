<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Receta Medica</title>
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
        .badge-status { background-color: #e8f5e9; color: #1b5e20; }
        .badge-pending { background-color: #fff3e0; color: #e65100; }

        .med-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .med-table th, .med-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .med-table th { background-color: #f4f7f6; font-size: 10px; text-transform: uppercase; color: #555; }
        .med-table td { font-size: 11px; color: #333; }
        .med-name { font-weight: bold; color: #0056b3; }

        .farmacia-box { background-color: #f1f8e9; border: 1px solid #c5e1a5; padding: 10px; border-radius: 5px; margin-top: 10px; }
        .farmacia-box p { margin: 2px 0; font-size: 10px; color: #33691e; }
        .farmacia-title { font-weight: bold; font-size: 11px; margin-bottom: 5px !important; }

        .warning-dispensada { background-color: #ffebee; border: 1px solid #ffcdd2; color: #c62828; padding: 10px; border-radius: 5px; font-weight: bold; margin-bottom: 15px; text-align: center; }
        
        .instrucciones { background-color: #e1f5fe; border: 1px solid #b3e5fc; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .instrucciones h4 { margin: 0 0 5px 0; color: #0277bd; font-size: 11px; text-transform: uppercase; }
        .instrucciones p { margin: 0; font-size: 11px; line-height: 1.5; color: #01579b; }

        .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9px; color: #999; width: 100%; table-layout: fixed; }
        .footer-table td { vertical-align: bottom; }
        .stamp-area { text-align: right; width: 250px; float: right; margin-top: -30px; }
        .stamp-line { border-bottom: 1px solid #777; width: 100%; margin-bottom: 5px; height: 30px; }
        .stamp-text { font-size: 10px; color: #555; text-align: center; font-weight: bold; }
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
                    <div class="doc-title">RECETA MÉDICA OFICIAL</div>
                    <div style="margin-top: 5px;">
                        <span class="badge" style="background: #eee; color: #333;">Nº #{{ $receta->id_receta }}</span>
                        @if($receta->estado?->nombre_estado === 'Dispensada')
                            <span class="badge badge-status">DISPENSADA</span>
                        @else
                            <span class="badge badge-pending">PENDIENTE</span>
                        @endif
                    </div>
                </td>
            </tr>
        </table>
    </div>

    @if($receta->estado?->nombre_estado === 'Dispensada')
    <div class="warning-dispensada">
        <strong>ADVERTENCIA:</strong> ESTA RECETA YA FUE DISPENSADA Y NO ES VÁLIDA PARA UNA NUEVA ENTREGA DE MEDICAMENTOS.
    </div>
    @endif

    <!-- Cita de Origen -->
    @if($receta->historialDetalle?->cita)
    @php $cita = $receta->historialDetalle->cita; @endphp
    <div class="card">
        <div class="card-header">Datos del Paciente y Prescriptor</div>
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
                        <span class="info-label">Especialidad</span>
                        <span class="info-value">{{ $cita->especialidad?->especialidad ?? 'Medicina General' }}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="info-label">Fecha de Prescripción</span>
                        <span class="info-value">{{ $receta->created_at->format('d/m/Y') }}</span>
                    </td>
                    <td>
                        <span class="info-label">Fecha de Vencimiento</span>
                        <span class="info-value" style="color: #c62828;">{{ $receta->fecha_vencimiento ? \Carbon\Carbon::parse($receta->fecha_vencimiento)->format('d/m/Y') : 'Según indicación médica' }}</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    @endif

    <!-- Medicamentos -->
    <div class="card">
        <div class="card-header">Medicamentos Recetados</div>
        <div class="card-body" style="padding: 0;">
            @if($receta->recetaDetalles && count($receta->recetaDetalles) > 0)
                <table class="med-table" style="margin-top: 0; border: none; border-bottom: 1px solid #ddd;">
                    <thead>
                        <tr>
                            <th style="border-left: none; border-top: none;">Medicamento</th>
                            <th style="border-top: none;">Dosis</th>
                            <th style="border-top: none;">Frecuencia</th>
                            <th style="border-top: none;">Duración</th>
                            <th style="border-right: none; border-top: none; text-align: center;">Cant.</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($receta->recetaDetalles as $det)
                        <tr>
                            <td style="border-left: none;">
                                <div class="med-name">{{ $det->presentacion?->medicamento?->nombre ?? '—' }}</div>
                                <div style="font-size: 9px; color: #777;">
                                    {{ $det->presentacion?->concentracion?->concentracion ?? '' }} {{ $det->presentacion?->formaFarmaceutica?->forma_farmaceutica ?? '' }}
                                </div>
                                @if($det->observaciones)
                                    <div style="font-size: 9px; font-style: italic; color: #555; margin-top: 4px;">* {{ $det->observaciones }}</div>
                                @endif
                            </td>
                            <td><strong>{{ $det->dosis }}</strong></td>
                            <td>{{ $det->frecuencia }}</td>
                            <td>{{ $det->duracion }}</td>
                            <td style="border-right: none; text-align: center; font-weight: bold; font-size: 12px;">{{ $det->cantidad_dispensar }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <p style="text-align: center; padding: 20px; color: #999; font-size: 12px; margin: 0;">No hay medicamentos registrados en esta receta.</p>
            @endif
        </div>
    </div>

    <!-- Farmacias Asignadas -->
    @if($receta->recetaDetalles && count($receta->recetaDetalles) > 0)
        @php $farmacias = collect($receta->recetaDetalles)->groupBy(fn($d) => $d->nit_farmacia)->filter(fn($g, $nit) => $nit); @endphp
        @if($farmacias->count() > 0)
        <div class="card" style="margin-top: 15px;">
            <div class="card-header">Farmacias Autorizadas para Dispensación</div>
            <div class="card-body">
                @foreach($farmacias as $nit => $dets)
                @php $farmacia = $dets->first()->farmacia; @endphp
                <div class="farmacia-box">
                    <p class="farmacia-title">Farmacia: {{ $farmacia?->nombre ?? 'NIT: '.$nit }}</p>
                    @if($farmacia?->direccion) <p>Dirección: {{ $farmacia->direccion }}</p> @endif
                    @if($farmacia?->telefono) <p>Tel: {{ $farmacia->telefono }}</p> @endif
                </div>
                @endforeach
            </div>
        </div>
        @endif
    @endif

    <div class="instrucciones">
        <h4>Instrucciones para Reclamar Medicamentos</h4>
        <p>
            - Acuda a la farmacia autorizada presentando esta receta y su documento de identidad original.<br>
            - La receta debe ser reclamada antes de su fecha de vencimiento.<br>
            - Siga estrictamente la dosis, frecuencia y duración indicadas por el médico.<br>
            - Si presenta efectos adversos, suspenda el medicamento y consulte inmediatamente.
        </p>
    </div>

    <table class="footer footer-table">
        <tr>
            <td style="width: 100%; text-align: center; vertical-align: bottom;">
                Documento Oficial &copy; Saluvanta EPS<br>
                Generado por Sistema Sanitec: {{ now()->format('d/m/Y H:i A') }}
            </td>
        </tr>
    </table>

</body>
</html>
