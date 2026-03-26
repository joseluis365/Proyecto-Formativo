<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Resumen de Atención Médica</title>
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
        .badge-exam { background-color: #e3f2fd; color: #0d47a1; border: 1px solid #bbdefb; }
        .badge-cita { background-color: #e8f5e9; color: #1b5e20; border: 1px solid #c8e6c9;}
        .badge-receta { background-color: #f3e5f5; color: #4a148c; border: 1px solid #e1bee7;}
        
        .icd-badge { display: inline-block; background: #eff6ff; border: 1px solid #bfdbfe; padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; color: #1e40af; margin-right: 5px; margin-bottom: 5px;}

        .text-block { background: #f8fafc; border-left: 3px solid #1d4ed8; padding: 10px; margin-top: 5px; margin-bottom: 10px; }
        .text-block p { margin: 0; font-size: 11px; line-height: 1.5; color: #374151; white-space: pre-wrap; }

        .vital-table { width: 100%; margin-bottom: 15px; }
        .vital-box { background: #f0f8ff; border: 1px solid #b6d4fe; padding: 8px; border-radius: 6px; text-align: left; }
        .vital-label { font-size: 9px; color: #084298; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 2px; }
        .vital-value { font-size: 13px; font-weight: bold; color: #052c65; }
        .vital-unit { font-size: 9px; font-weight: normal; color: #084298; }

        .item-list-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 8px; }
        .item-title { font-size: 11px; font-weight: bold; color: #1e293b; margin-bottom: 4px; }
        .item-desc { font-size: 10px; color: #475569; }

        .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9px; color: #999; text-align: center; }

        .med-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        .med-table th, .med-table td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; font-size: 10px; }
        .med-table th { background-color: #f8fafc; color: #475569; font-size: 9px; text-transform: uppercase; }
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
                    <div class="doc-title">RESUMEN DE ATENCIÓN MÉDICA</div>
                    <div style="margin-top: 5px;">
                        <span class="badge" style="background: #eee; color: #333;">Consulta Nº #{{ $cita->id_cita }}</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Datos de la Consulta -->
    <div class="card">
        <div class="card-header">Datos de la Consulta</div>
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
                        <span class="info-label">Motivo General</span>
                        <span class="info-value">{{ $cita->motivoConsulta?->motivo ?? 'Atención General' }}</span>
                    </td>
                    <td>
                        <span class="info-label">Fecha y Hora</span>
                        <span class="info-value">{{ $cita->fecha }} a las {{ substr($cita->hora_inicio, 0, 5) }}</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    @if($cita->historialDetalle)
    @php 
        $det = $cita->historialDetalle; 
        $sv = $det->signos_vitales;

        // Helper para unidades
        $getUnit = function($key) {
            $k = strtoupper(str_replace('_', ' ', $key));
            switch ($k) {
                case 'FC': case 'FRECUENCIA CARDIACA': return 'lpm';
                case 'FR': case 'FRECUENCIA RESPIRATORIA': return 'rpm';
                case 'PESO': return 'kg';
                case 'TALLA': case 'ESTATURA': return 'm';
                case 'TEMPERATURA': return '°C';
                case 'TA SISTOLICA': case 'TA DIASTOLICA': case 'PRESION ARTERIAL': return 'mmHG';
                case 'SATURACION O2': case 'SATURACION OXIGENO': return '%';
                case 'IMC': return 'kg/m²';
                default: return '';
            }
        };
    @endphp

    <!-- Información Clínica -->
    <div class="card">
        <div class="card-header">Información Clínica</div>
        <div class="card-body">
            
            @if(is_array($sv) && count($sv) > 0)
            <div style="margin-bottom: 15px;">
                <span class="info-label" style="color:#084298;">SIGNOS VITALES</span>
                <table style="width: 100%; border-collapse: separate; border-spacing: 5px 0; margin-left: -5px;">
                    <tr>
                        @php $count = 0; @endphp
                        @foreach($sv as $k => $v)
                            @if($count > 0 && $count % 4 == 0)
                                </tr><tr><td colspan="4" style="height:5px;"></td></tr><tr>
                            @endif
                            <td style="width: 25%;"><div class="vital-box">
                                <span class="vital-label">{{ str_replace('_', ' ', $k) }}</span>
                                <span class="vital-value">{{ $v }} <span class="vital-unit">{{ $getUnit($k) }}</span></span>
                            </div></td>
                            @php $count++; @endphp
                        @endforeach
                        @while($count % 4 != 0)
                            <td style="width: 25%;"></td>
                            @php $count++; @endphp
                        @endwhile
                    </tr>
                </table>
            </div>
            @endif

            @if($det->subjetivo)
            <div>
                <span class="info-label">Motivo de Consulta / Subjetivo</span>
                <div class="text-block"><p>{{ $det->subjetivo }}</p></div>
            </div>
            @endif

            @if($det->diagnostico || ($det->enfermedades && count($det->enfermedades) > 0))
            <div>
                <span class="info-label">Diagnóstico Clínico</span>
                @if($det->enfermedades && count($det->enfermedades) > 0)
                <div style="margin-top: 5px;">
                    @foreach($det->enfermedades as $enf)
                    <span class="icd-badge">[{{ $enf->codigo_icd }}] {{ $enf->nombre }}</span>
                    @endforeach
                </div>
                @endif
                @if($det->diagnostico)
                <div class="text-block" style="margin-top: 5px;"><p>{{ $det->diagnostico }}</p></div>
                @endif
            </div>
            @endif

            @if($det->tratamiento)
            <div>
                <span class="info-label">Plan de Tratamiento</span>
                <div class="text-block"><p>{{ $det->tratamiento }}</p></div>
            </div>
            @endif

            @if($det->observaciones)
            <div>
                <span class="info-label">Observaciones</span>
                <div class="text-block"><p>{{ $det->observaciones }}</p></div>
            </div>
            @endif

        </div>
    </div>

    <!-- Remisiones y Exámenes -->
    @if($det->remisiones && count($det->remisiones) > 0)
    <div class="card">
        <div class="card-header">Remisiones y Exámenes ({{ count($det->remisiones) }})</div>
        <div class="card-body" style="padding-bottom: 4px;">
            @foreach($det->remisiones as $r)
            <div class="item-list-box">
                <table style="width: 100%;">
                    <tr>
                        <td style="vertical-align: top; width: 70%;">
                            <div style="margin-bottom: 4px;">
                                @if($r->tipo_remision === 'examen')
                                    <span class="badge badge-exam">EXAMEN</span>
                                @else
                                    <span class="badge badge-cita">REMISIÓN</span>
                                @endif
                                <span style="font-size: 10px; color: #888; font-weight: bold; margin-left: 4px;">#{{ $r->id_remision }}</span>
                            </div>
                            <div class="item-title">
                                {{ $r->tipo_remision === 'examen' ? ($r->categoriaExamen?->categoria ?? 'Examen General') : ($r->especialidad?->especialidad ?? 'Especialista') }}
                            </div>
                            @if($r->notas)
                                <div class="item-desc" style="margin-top: 3px;">Nota: {{ $r->notas }}</div>
                            @endif
                        </td>
                        <td style="vertical-align: top; text-align: right; width: 30%;">
                            @if(($r->tipo_remision === 'cita' && $r->cita) || ($r->tipo_remision === 'examen' && $r->examen))
                                @php $asig = $r->tipo_remision === 'cita' ? $r->cita : $r->examen; @endphp
                                <div style="font-size: 9px; color: #666; text-transform: uppercase; font-weight: bold;">Cita Asignada</div>
                                <div style="font-size: 10px; color: #1d4ed8; font-weight: bold; margin-top: 2px;">{{ $asig->fecha }}</div>
                                <div style="font-size: 10px; color: #1d4ed8;">{{ substr($asig->hora_inicio, 0, 5) }}</div>
                            @else
                                <div style="font-size: 10px; color: #e65100; font-weight: bold; margin-top: 15px;">Pendiente de Asignación</div>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Receta Médica -->
    @if($det->receta)
    <div class="card">
        <div class="card-header">Receta Médica</div>
        <div class="card-body" style="padding-top: 8px;">
            <div style="margin-bottom: 8px;">
                <span class="badge badge-receta">RECETA FORMATO #{{ $det->receta->id_receta }}</span>
                <span style="font-size: 10px; color: #666; margin-left: 8px;">Emisión: {{ $det->receta->created_at->format('d/m/Y') }}</span>
            </div>
            
            @if($det->receta->recetaDetalles && count($det->receta->recetaDetalles) > 0)
            <table class="med-table">
                <thead>
                    <tr>
                        <th>Medicamento y Dosis</th>
                        <th>Frecuencia</th>
                        <th>Duración</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($det->receta->recetaDetalles as $rd)
                    <tr>
                        <td>
                            <strong style="color: #0056b3;">{{ $rd->presentacion?->medicamento?->nombre ?? 'Medicamento' }}</strong><br>
                            <span style="color: #555;">Dosis: {{ $rd->dosis }}</span>
                        </td>
                        <td>{{ $rd->frecuencia }}</td>
                        <td>{{ $rd->duracion }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            @else
            <p style="font-size: 10px; color: #777; margin: 0;">Sin medicamentos registrados.</p>
            @endif
        </div>
    </div>
    @endif

    @endif

    <div class="footer">
        Documento Oficial &copy; Saluvanta EPS | Generado por el Sistema de Información Sanitec | Fecha: {{ now()->format('d/m/Y H:i A') }}
    </div>

</body>
</html>
