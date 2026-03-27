<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historial Clínico</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; }
        .header { width: 100%; border-bottom: 3px solid #0056b3; padding-bottom: 10px; margin-bottom: 20px; }
        .header table { width: 100%; }
        .logo-eps { font-size: 24px; font-weight: bold; color: #0056b3; text-transform: uppercase; }
        .doc-title { font-size: 16px; font-weight: bold; color: #555; text-align: right; }
        .system-name { font-size: 10px; color: #777; margin-top: 5px; }

        .section-title { font-size: 14px; font-weight: bold; color: #0056b3; margin-top: 12px; margin-bottom: 6px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; }

        .card { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px; overflow: hidden; page-break-inside: avoid; }
        .card-header { background-color: #f4f7f6; padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #ddd; color: #0056b3; font-size: 12px; text-transform: uppercase; }
        .card-body { padding: 12px; }

        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { padding: 6px; vertical-align: top; }
        .info-label { font-size: 9px; color: #777; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 2px; }
        .info-value { font-size: 12px; font-weight: bold; color: #222; }

        .item-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 10px; page-break-inside: avoid; }
        .item-box table { width: 100%; border-collapse: collapse; }
        .item-box td { vertical-align: top; }

        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .badge-cita { background-color: #e8f5e9; color: #1b5e20; border: 1px solid #c8e6c9;}
        .badge-exam { background-color: #e3f2fd; color: #0d47a1; border: 1px solid #bbdefb; }
        .badge-receta { background-color: #f3e5f5; color: #4a148c; border: 1px solid #e1bee7;}

        .text-block { background: #f8fafc; border-left: 3px solid #1d4ed8; padding: 8px; margin-top: 5px; }
        .text-block p { margin: 0; font-size: 10px; line-height: 1.4; color: #374151; white-space: pre-wrap; }

        .med-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        .med-table th, .med-table td { border: 1px solid #e2e8f0; padding: 4px 6px; text-align: left; font-size: 9px; }
        .med-table th { background-color: #f8fafc; color: #475569; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }

        .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9px; color: #999; text-align: center; }

        /* Helpers for background fields */
        .bg-null { color: #999; font-style: italic; }
        .bg-row-even { background: #f9fafb; }
        .bg-row-odd { background: #fff; }
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
                    <div class="doc-title">HISTORIAL CLÍNICO</div>
                    <div style="margin-top: 5px; font-size: 10px; color: #666;">
                        Paciente: {{ trim($paciente->primer_nombre . ' ' . ($paciente->segundo_nombre ?? '') . ' ' . $paciente->primer_apellido . ' ' . ($paciente->segundo_apellido ?? '')) }}<br>
                        Fecha de Impresión: {{ now()->format('d/m/Y H:i A') }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Datos del Paciente -->
    <div class="card">
        <div class="card-header">Datos Demográficos</div>
        <div class="card-body">
            <table class="info-table">
                <tr>
                    <td style="width: 45%;">
                        <span class="info-label">Paciente</span>
                        <span class="info-value">
                            {{ mb_strtoupper(trim($paciente->primer_nombre . ' ' . ($paciente->segundo_nombre ?? '') . ' ' . $paciente->primer_apellido . ' ' . ($paciente->segundo_apellido ?? ''))) }}
                        </span>
                    </td>
                    <td style="width: 20%;">
                        <span class="info-label">Documento</span>
                        <span class="info-value">{{ $paciente->tipo_documento ?? 'CC' }} {{ $paciente->documento }}</span>
                    </td>
                    <td style="width: 20%;">
                        <span class="info-label">Fecha de Nacimiento</span>
                        <span class="info-value">{{ $paciente->fecha_nacimiento ? \Carbon\Carbon::parse($paciente->fecha_nacimiento)->format('d/m/Y') : 'N/A' }}</span>
                    </td>
                    <td style="width: 15%;">
                        <span class="info-label">Sexo</span>
                        <span class="info-value">
                            @php
                                $s = strtoupper($paciente->sexo ?? '');
                                if($s === 'M' || $s === 'MASCULINO') echo 'MASCULINO';
                                elseif($s === 'F' || $s === 'FEMENINO') echo 'FEMENINO';
                                else echo $s ?: 'N/A';
                            @endphp
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="info-label">Dirección</span>
                        <span class="info-value">{{ $paciente->direccion ?? 'N/A' }}</span>
                    </td>
                    <td>
                        <span class="info-label">Teléfono</span>
                        <span class="info-value">{{ $paciente->telefono ?? 'N/A' }}</span>
                    </td>
                    <td>
                        <span class="info-label">Grupo Sanguíneo</span>
                        <span class="info-value" style="color: #d32f2f;">{{ $paciente->grupo_sanguineo ?? 'N/A' }}</span>
                    </td>
                    <td>
                        <!-- Espacio extra -->
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <!-- Antecedentes Clínicos y Hábitos -->
    <div class="section-title">Antecedentes Clínicos</div>
    
    <table style="width: 100%; border-collapse: separate; border-spacing: 0 8px;">
        <tr>
            <td style="width: 50%; padding-right: 5px; vertical-align: top;">
                <div class="card" style="margin-bottom: 0;">
                    <div class="card-header" style="font-size:10px;">Enfermedades y Cirugías Previas</div>
                    <div class="card-body" style="font-size:10px;">
                        @if(!empty($historial->antecedentes_personales))
                            <span style="white-space: pre-wrap;">{{ $historial->antecedentes_personales }}</span>
                        @else
                            <span class="bg-null">Sin registrar</span>
                        @endif
                    </div>
                </div>
            </td>
            <td style="width: 50%; padding-left: 5px; vertical-align: top;">
                <div class="card" style="margin-bottom: 0;">
                    <div class="card-header" style="font-size:10px;">Alergias Conocidas</div>
                    <div class="card-body" style="font-size:10px; color: #d32f2f;">
                        @if(!empty($historial->alergias))
                            <span style="white-space: pre-wrap; font-weight: bold;">{{ $historial->alergias }}</span>
                        @else
                            <span class="bg-null">Sin registrar</span>
                        @endif
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td style="width: 50%; padding-right: 5px; vertical-align: top;">
                <div class="card" style="margin-bottom: 0;">
                    <div class="card-header" style="font-size:10px;">Historial Familiar</div>
                    <div class="card-body" style="font-size:10px;">
                        @if(!empty($historial->antecedentes_familiares))
                            <span style="white-space: pre-wrap;">{{ $historial->antecedentes_familiares }}</span>
                        @else
                            <span class="bg-null">Sin registrar</span>
                        @endif
                    </div>
                </div>
            </td>
            <td style="width: 50%; padding-left: 5px; vertical-align: top;">
                <div class="card" style="margin-bottom: 0;">
                    <div class="card-header" style="font-size:10px;">Estilos de Vida</div>
                    <div class="card-body" style="font-size:10px;">
                        @php
                            $habitos = is_array($historial?->habitos_vida) ? $historial->habitos_vida : json_decode($historial?->habitos_vida ?? '{}', true);
                            $tieneHabitos = !empty($habitos) && array_filter($habitos);
                        @endphp
                        @if($tieneHabitos)
                            <table style="width: 100%;">
                                @foreach(['tabaco', 'alcohol', 'ejercicio', 'dieta'] as $habito)
                                    @if(!empty($habitos[$habito]))
                                        <tr>
                                            <td style="width: 30%; color: #777; font-weight: bold; text-transform: uppercase;">{{ $habito }}:</td>
                                            <td>{{ $habitos[$habito] }}</td>
                                        </tr>
                                    @endif
                                @endforeach
                            </table>
                        @else
                            <span class="bg-null">Sin registrar</span>
                        @endif
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Registro de Atenciones (Citas) -->
    <div class="section-title" style="page-break-before: auto;">Registro de Atenciones Médicas</div>
    
    @if(count($citas) > 0)
        @foreach($citas as $cita)
            <div class="item-box">
                <table>
                    <tr>
                        <td style="width: 20%;">
                            <span class="badge badge-cita">Consulta #{{ $cita->id }}</span>
                            <div style="margin-top: 6px; font-weight: bold; font-size: 11px; color: #1d4ed8;">{{ $cita->fecha }}</div>
                            <div style="font-size: 9px; color: #666;">{{ $cita->hora ?? '' }}</div>
                        </td>
                        <td style="width: 35%; padding: 0 10px; border-left: 1px solid #eee; border-right: 1px solid #eee;">
                            <span class="info-label">Profesional / Especialidad</span>
                            <div style="font-weight: bold; font-size: 11px; margin-bottom: 2px;">Dr. {{ $cita->medico }}</div>
                            <div style="font-size: 10px; color: #555;">{{ $cita->especialidad }}</div>
                        </td>
                        <td style="width: 45%; padding-left: 10px;">
                            <span class="info-label">Motivo y Diagnóstico</span>
                            <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px; color: #333;">Motivo: {{ $cita->motivo }}</div>
                            @if(!empty($cita->diagnostico))
                                <div class="text-block" style="margin-top:0; padding: 4px; border-width: 2px;">
                                    <p style="font-size: 9px;">{{ $cita->diagnostico }}</p>
                                </div>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>
        @endforeach
    @else
        <div style="text-align: center; padding: 20px; color: #999; border: 1px dashed #ccc; border-radius: 8px;">
            No hay atenciones médicas registradas.
        </div>
    @endif

    <!-- Remisiones y Exámenes -->
    @if(count($remisiones) > 0)
        <div class="section-title">Remisiones y Exámenes Clínicos</div>
        
        @foreach($remisiones as $rem)
            <div class="item-box">
                <table>
                    <tr>
                        <td style="width: 20%;">
                            @if($rem->tipo === 'Examen Médico')
                                <span class="badge badge-exam">EXAMEN #{{ $rem->id }}</span>
                            @else
                                <span class="badge badge-cita">REMISIÓN #{{ $rem->id }}</span>
                            @endif
                            <div style="margin-top: 6px; font-weight: bold; font-size: 11px; color: #1d4ed8;">{{ $rem->fecha }}</div>
                            <div style="font-size: 9px; color: #666;">Estado: {{ $rem->estado }}</div>
                        </td>
                        <td style="width: 35%; padding: 0 10px; border-left: 1px solid #eee; border-right: 1px solid #eee;">
                            <span class="info-label">Destino / Especialidad</span>
                            <div style="font-weight: bold; font-size: 11px; margin-bottom: 2px;">{{ $rem->destino }}</div>
                            <div style="font-size: 9px; color: #777; text-transform: uppercase; margin-top: 5px;">Solicitado por:</div>
                            <div style="font-size: 10px; color: #555;">Dr. {{ $rem->medico_solicitante }}</div>
                        </td>
                        <td style="width: 45%; padding-left: 10px;">
                            <span class="info-label">Motivo de Solicitud</span>
                            <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px; color: #333;">Consulta: {{ $rem->motivo_solicitud }}</div>
                            @if(!empty($rem->notas))
                                <div class="text-block" style="margin-top:0; padding: 4px; border-width: 2px;">
                                    <p style="font-size: 9px;">Nota: {{ $rem->notas }}</p>
                                </div>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>
        @endforeach
    @endif

    <!-- Historial Farmacológico -->
    @if(count($recetas) > 0)
        <div class="section-title">Historial Farmacológico</div>
        
        @foreach($recetas as $rec)
            <div class="item-box">
                <table style="margin-bottom: 8px;">
                    <tr>
                        <td style="width: 50%;">
                            <span class="badge badge-receta">RECETA FORMATO #{{ $rec->id }}</span>
                        </td>
                        <td style="width: 50%; text-align: right;">
                            <span style="font-size: 9px; color: #666; font-weight: bold;">Emisión: <span style="color:#333;">{{ $rec->fecha }}</span></span>
                            <span style="font-size: 9px; color: #666; font-weight: bold; margin-left: 10px;">Vencimiento: <span style="color:#d32f2f;">{{ $rec->fecha_vencimiento }}</span></span>
                        </td>
                    </tr>
                </table>
                <table class="med-table">
                    <thead>
                        <tr>
                            <th style="width: 45%;">Medicamento Prescrito</th>
                            <th style="width: 25%;">Dosis</th>
                            <th style="width: 15%;">Frecuencia</th>
                            <th style="width: 15%;">Duración</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($rec->medicamentos as $det)
                            <tr>
                                <th style="background: none; font-weight: bold; color: #0056b3; font-size: 9px; border-bottom: 1px solid #e2e8f0;">{{ $det->medicamento }}</th>
                                <td>{{ $det->dosis }}</td>
                                <td>{{ $det->frecuencia }}</td>
                                <td>{{ $det->duracion }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endforeach
    @endif

    {{-- El pie de página se movió al final del documento para evitar duplicados --}}

{{-- ── SECCIÓN EVOLUCIÓN CLÍNICA (solo si hay atenciones) ─────────────── --}}
@if(isset($evSignos) && (count($evSignos) > 0 || count($evDiagnostica) > 0))
    <div style="margin-top: 30px;"></div>

    {{-- Subencabezado de página de evolución --}}
    <div style="border-bottom: 3px solid #0056b3; padding-bottom: 6px; margin-bottom: 14px;">
        <span style="font-size:15px; font-weight:bold; color:#0056b3; text-transform:uppercase;">Evolución Clínica del Paciente</span>
        <span style="float:right; font-size:9px; color:#777;">
            {{ mb_strtoupper(trim($paciente->primer_nombre . ' ' . ($paciente->segundo_nombre ?? '') . ' ' . $paciente->primer_apellido . ' ' . ($paciente->segundo_apellido ?? ''))) }}
        </span>
    </div>

    {{-- Tabla de signos vitales --}}
    @if(count($evSignos) > 0 && count($activeVitalKeys) > 0)
        <div class="section-title">Registro de Signos Vitales</div>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:9px;">
            <thead>
                <tr>
                    <th style="background:#0056b3; color:#fff; padding:5px 7px; text-align:left; border:1px solid #ccc;">Fecha</th>
                    @foreach($activeVitalKeys as $k)
                        <th style="background:#0056b3; color:#fff; padding:5px 7px; text-align:center; border:1px solid #ccc;">
                            {{ $vitalsLabels[$k]['label'] }}<br><span style="font-weight:normal; font-size:8px;">({{ $vitalsLabels[$k]['unit'] }})</span>
                        </th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach($evSignos as $i => $sv)
                    <tr class="{{ $i % 2 === 0 ? 'bg-row-even' : 'bg-row-odd' }}">
                        <td style="padding:5px 7px; border:1px solid #e5e7eb; font-weight:bold; color:#1d4ed8;">
                            {{ \Carbon\Carbon::parse($sv['fecha'])->format('d/m/Y') }}
                        </td>
                        @foreach($activeVitalKeys as $k)
                            <td style="padding:5px 7px; border:1px solid #e5e7eb; text-align:center; font-weight:bold;">
                                {{ isset($sv[$k]) && $sv[$k] !== null ? $sv[$k] : '—' }}
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    {{-- Evolución diagnóstica --}}
    @if(count($evDiagnostica) > 0)
        <div class="section-title">Evolución de Diagnósticos y Tratamientos</div>
        <table style="width:100%; border-collapse:collapse; font-size:9px;">
            <thead>
                <tr>
                    <th style="background:#0056b3; color:#fff; padding:5px 7px; text-align:left; width:12%; border:1px solid #ccc;">Fecha</th>
                    <th style="background:#0056b3; color:#fff; padding:5px 7px; text-align:left; width:40%; border:1px solid #ccc;">Diagnósticos (CIE-11)</th>
                    <th style="background:#0056b3; color:#fff; padding:5px 7px; text-align:left; width:48%; border:1px solid #ccc;">Tratamiento</th>
                </tr>
            </thead>
            <tbody>
                @foreach($evDiagnostica as $i => $ev)
                    <tr class="{{ $i % 2 === 0 ? 'bg-row-even' : 'bg-row-odd' }}">
                        <td style="padding:5px 7px; border:1px solid #e5e7eb; font-weight:bold; color:#1d4ed8;">{{ $ev->fecha }}</td>
                        <td style="padding:5px 7px; border:1px solid #e5e7eb; font-weight:bold; color:#1e40af;">
                            {{ !empty($ev->diagnosticos) ? $ev->diagnosticos : '—' }}
                        </td>
                        <td style="padding:5px 7px; border:1px solid #e5e7eb; white-space:pre-wrap;">
                            {{ !empty($ev->tratamiento) ? $ev->tratamiento : '—' }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    {{-- Pie de página se movió fuera del bloque if --}}
@endif

    <div class="footer">
        Documento Oficial &copy; Saluvanta EPS | Generado por el Sistema de Información Sanitec
    </div>

</body>
</html>
