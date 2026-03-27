<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Reporte de Citas - Médico</title>
    <style>
        body {
            font-family: sans-serif;
            color: #333;
            font-size: 11px;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 5px 0;
            color: #1e40af;
            font-size: 20px;
        }

        .header h2 {
            margin: 0;
            font-size: 13px;
            text-transform: uppercase;
            color: #475569;
        }

        .logo {
            position: absolute;
            top: 0;
            left: 0;
            width: 60px;
            height: 60px;
        }

        .info-panel {
            clear: both;
            margin-bottom: 15px;
            background: #f8fafc;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .info-panel p {
            margin: 4px 0;
            font-size: 10px;
            color: #64748b;
        }

        .info-panel strong {
            color: #334155;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }

        th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: bold;
            padding: 8px;
            border: 1px solid #cbd5e1;
            text-align: left;
            text-transform: uppercase;
            font-size: 9px;
        }

        td {
            border: 1px solid #cbd5e1;
            padding: 7px;
            color: #475569;
            font-size: 10px;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        tr:nth-child(even) {
            background-color: #fbfcfd;
        }

        .footer {
            position: fixed;
            bottom: -20px;
            left: 0px;
            right: 0px;
            height: 30px;
            text-align: center;
            font-size: 8px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
        }

        .badge {
            padding: 3px 6px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 8px;
            display: inline-block;
            text-align: center;
        }

        .badge-active {
            background-color: #dcfce7;
            color: #166534;
        }

        .badge-inactive {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .badge-pending {
            background-color: #fef9c3;
            color: #854d0e;
        }
    </style>
</head>

<body>
    <div class="header">
        @php
        $logoPath = public_path('icono.png');
        $logoBase64 = '';
        if(file_exists($logoPath)){
        $logoBase64 = base64_encode(file_get_contents($logoPath));
        }
        @endphp
        @if($logoBase64)
        <img src="data:image/png;base64,{{ $logoBase64 }}" class="logo">
        @endif
        <h1>Saluvanta EPS</h1>
        <h2>Reporte de Citas Atendidas</h2>
    </div>

    <div class="info-panel">
        <p><strong>Médico:</strong> {{ $generado }}</p>
        @if(isset($especialidad) && $especialidad)
        <p><strong>Especialidad:</strong> {{ $especialidad }}</p>
        @endif
        <p><strong>Fecha de Generación:</strong> {{ $fecha }}</p>
        <p><strong>Total de Citas en el Reporte:</strong> {{ count($data) }}</p>

        @if(!empty($filters))
        <p><strong>Filtros aplicados:</strong>
            @foreach($filters as $key => $val)
            @if($val && !in_array($key, ['limit', 'id_estado']))
            <span style="background: #e2e8f0; padding: 2px 4px; border-radius: 3px; margin-right: 5px; font-size: 9px;">
                {{ ucfirst(str_replace(['_', 'date_'], [' ', ''], $key)) }}: {{ $val }}
            </span>
            @endif
            @endforeach
        </p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 8%;">ID</th>
                <th style="width: 22%;">Paciente</th>
                <th style="width: 15%;">Fecha y Hora</th>
                <th style="width: 15%;">Motivo</th>
                <th style="width: 30%;">Diagnóstico(s)</th>
                <th style="width: 10%;">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
            <tr>
                <td>#{{ $row->id_cita }}</td>
                <td>
                    <strong>{{ $row->paciente->primer_nombre ?? 'N/A' }} {{ $row->paciente->primer_apellido ?? '' }}</strong><br>
                    <small style="color: #64748b;">Doc: {{ $row->paciente->documento ?? 'N/A' }}</small>
                </td>
                <td>
                    {{ \Carbon\Carbon::parse($row->fecha)->format('d/m/Y') }}<br>
                    {{ \Carbon\Carbon::parse($row->hora_inicio)->format('h:i A') }}
                </td>
                <td>{{ optional($row->motivoConsulta)->motivo ?? $row->motivo ?? 'N/A' }}</td>
                <td>
                    @if(optional($row->historialDetalle)->enfermedades && $row->historialDetalle->enfermedades->count() > 0)
                    {{ $row->historialDetalle->enfermedades->pluck('nombre')->join(', ') }}
                    @else
                    {{ optional($row->historialDetalle)->diagnostico ?? 'N/A' }}
                    @endif
                </td>
                <td style="text-align: center;">
                    @php
                    $badgeClass = 'badge-pending';
                    if($row->id_estado == 10) $badgeClass = 'badge-active'; /* Atendida */
                    elseif($row->id_estado == 11 || $row->id_estado == 16) $badgeClass = 'badge-inactive'; /* Cancelada / Inasistencia */
                    @endphp
                    <span class="badge {{ $badgeClass }}">{{ $row->estado->nombre_estado ?? 'N/A' }}</span>
                </td>
            </tr>
            @endforeach

            @if(count($data) == 0)
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">
                    No se encontraron citas atendidas con los criterios seleccionados.
                </td>
            </tr>
            @endif
        </tbody>
    </table>

    <div class="footer">
        Saluvanta EPS - Software Sanitec - Reporte generado por el profesional médico - Confidencial
    </div>
</body>

</html>