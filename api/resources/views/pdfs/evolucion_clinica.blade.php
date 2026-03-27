<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Evolución Clínica</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; }
        .header { width: 100%; border-bottom: 3px solid #0056b3; padding-bottom: 10px; margin-bottom: 20px; }
        .header table { width: 100%; }
        .logo-eps { font-size: 22px; font-weight: bold; color: #0056b3; text-transform: uppercase; }
        .doc-title { font-size: 15px; font-weight: bold; color: #555; text-align: right; }
        .system-name { font-size: 9px; color: #777; margin-top: 4px; }

        .section-title { font-size: 13px; font-weight: bold; color: #0056b3; margin-top: 18px; margin-bottom: 8px;
            text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; }

        /* Gráficas */
        .chart-block { margin-bottom: 20px; page-break-inside: avoid; }
        .chart-block img { width: 100%; max-width: 700px; border: 1px solid #ddd; border-radius: 6px; }

        /* Tabla diagnósticos */
        .diag-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .diag-table th { background: #0056b3; color: #fff; padding: 6px 8px; text-align: left; font-size: 9px; text-transform: uppercase; }
        .diag-table td { border-bottom: 1px solid #e5e7eb; padding: 6px 8px; font-size: 10px; vertical-align: top; }
        .diag-table tr:last-child td { border-bottom: none; }
        .diag-table tr:nth-child(even) td { background: #f9fafb; }

        .diag-codes { font-weight: bold; color: #1d4ed8; font-size: 9px; }
        .text-block { background: #f8fafc; border-left: 3px solid #1d4ed8; padding: 5px 8px; margin-top: 3px; font-size: 9px; line-height: 1.4; white-space: pre-wrap; }

        .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9px; color: #999; text-align: center; }
        .bg-null { color: #999; font-style: italic; }

        .no-data { text-align:center; padding: 16px; border: 1px dashed #ccc; border-radius:6px; color:#999; font-size:10px; }
    </style>
</head>
<body>

    <div class="header">
        <table>
            <tr>
                <td style="width: 10%; vertical-align: middle;">
                    @if(!empty($logoBase64))
                        <img src="data:image/png;base64,{{ $logoBase64 }}" style="width: 45px; height: 45px;">
                    @endif
                </td>
                <td style="width: 40%; vertical-align: middle;">
                    <div class="logo-eps">SALUVANTA EPS</div>
                    <div class="system-name">Generado por Sanitec</div>
                </td>
                <td style="width: 50%; vertical-align: middle; text-align: right;">
                    <div class="doc-title">EVOLUCIÓN CLÍNICA DEL PACIENTE</div>
                    <div style="margin-top: 4px; font-size: 9px; color: #666;">
                        Paciente: {{ mb_strtoupper(trim($paciente->primer_nombre . ' ' . ($paciente->segundo_nombre ?? '') . ' ' . $paciente->primer_apellido . ' ' . ($paciente->segundo_apellido ?? ''))) }}<br>
                        Doc: {{ $paciente->documento }} &nbsp;|&nbsp; Fecha: {{ now()->format('d/m/Y H:i A') }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    {{-- Gráficas de signos vitales --}}
    <div class="section-title">Evolución de Signos Vitales</div>

    @if(!empty($graficasBase64) && count($graficasBase64) > 0)
        @foreach($graficasBase64 as $graficaItem)
            <div class="chart-block">
                <div style="font-size: 10px; font-weight: bold; color: #374151; margin-bottom: 4px;">
                    {{ $graficaItem['titulo'] ?? '' }}
                </div>
                <img src="data:image/png;base64,{{ $graficaItem['imagen'] }}" alt="{{ $graficaItem['titulo'] ?? 'Gráfica' }}">
            </div>
        @endforeach
    @else
        <div class="no-data">No hay datos de signos vitales registrados para este paciente.</div>
    @endif

    {{-- Evolución Diagnóstica --}}
    <div class="section-title" style="margin-top: 24px;">Evolución de Diagnósticos y Tratamientos</div>

    @if(count($evolucionDiagnostica) > 0)
        <table class="diag-table">
            <thead>
                <tr>
                    <th style="width: 12%;">Fecha</th>
                    <th style="width: 40%;">Diagnósticos (CIE-11)</th>
                    <th style="width: 48%;">Tratamiento / Plan Médico</th>
                </tr>
            </thead>
            <tbody>
                @foreach($evolucionDiagnostica as $ev)
                    <tr>
                        <td style="font-weight:bold; color: #1d4ed8;">{{ $ev->fecha }}</td>
                        <td>
                            @if(!empty($ev->diagnosticos))
                                <span class="diag-codes">{{ $ev->diagnosticos }}</span>
                            @else
                                <span class="bg-null">Sin diagnóstico CIE-11</span>
                            @endif
                        </td>
                        <td>
                            @if(!empty($ev->tratamiento) && $ev->tratamiento !== 'Sin registrar')
                                <div class="text-block">{{ $ev->tratamiento }}</div>
                            @else
                                <span class="bg-null">Sin tratamiento registrado</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="no-data">No hay diagnósticos registrados para este paciente.</div>
    @endif

    <div class="footer">
        Documento Oficial &copy; Saluvanta EPS | Generado por el Sistema de Información Sanitec
    </div>

</body>
</html>
