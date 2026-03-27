<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Reporte de {{ ucfirst($entity) }}</title>
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
            font-size: 14px;
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
        }

        .info-panel p {
            margin: 3px 0;
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
        }

        th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: bold;
            padding: 8px;
            border: 1px solid #cbd5e1;
            text-align: left;
            text-transform: uppercase;
            font-size: 10px;
        }

        td {
            border: 1px solid #cbd5e1;
            padding: 7px;
            color: #475569;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
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
            font-size: 9px;
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
        @if(file_exists(public_path('icono.png')))
        <img src="{{ public_path('icono.png') }}" class="logo">
        @endif
        <h1>Saluvanta EPS</h1>
        <h2>Reporte Administrativo: {{ ucfirst($entity) }}</h2>
    </div>

    <div class="info-panel">
        <p><strong>Generado por:</strong> {{ $generado }}</p>
        <p><strong>Fecha y Hora:</strong> {{ $fecha }}</p>
        <p><strong>Total de Registros:</strong> {{ count($data) }}</p>

        @if(!empty($filters) && count($filters) > 1)
        <p><strong>Filtros aplicados:</strong>
            @foreach($filters as $key => $val)
            @if($key != 'limit' && $val != '')
            <span style="background: #e2e8f0; padding: 2px 4px; border-radius: 3px; margin-right: 5px;">
                {{ ucfirst(str_replace('_', ' ', $key)) }}: {{ $val }}
            </span>
            @endif
            @endforeach
        </p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                @if($entity === 'pacientes')
                <th>Tipo Doc</th>
                <th>Documento</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Sexo</th>
                <th>F. Nacimiento</th>
                <th>G. Sanguíneo</th>
                @elseif($entity === 'citas')
                <th>ID</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Especialidad</th>
                <th>Motivo</th>
                <th>Diagnóstico</th>
                <th>Fecha</th>
                <th>Estado</th>
                @elseif($entity === 'pqrs')
                <th>ID</th>
                <th>Usuario</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Respuesta</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Fecha</th>
                @else
                {{-- Caso Dinámico para nuevas entidades (como Exámenes) --}}
                @foreach($columns as $key => $label)
                <th>{{ $label }}</th>
                @endforeach
                @endif
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
            <tr>
                @if($entity === 'pacientes')
                <td>{{ $row->tipoDocumento->tipo_documento ?? 'N/A' }}</td>
                <td>{{ $row->documento }}</td>
                <td>{{ trim("{$row->primer_nombre} {$row->segundo_nombre} {$row->primer_apellido} {$row->segundo_apellido}") }}</td>
                <td>{{ $row->email }}</td>
                <td>{{ $row->telefono ?? 'N/A' }}</td>
                <td>{{ $row->direccion ?? 'N/A' }}</td>
                <td>{{ $row->sexo ?? 'N/A' }}</td>
                <td>{{ $row->fecha_nacimiento ? \Carbon\Carbon::parse($row->fecha_nacimiento)->format('d/m/Y') : 'N/A' }}</td>
                <td>{{ $row->grupo_sanguineo ?? 'N/A' }}</td>

                @elseif($entity === 'citas')
                <td>#{{ $row->id_cita }}</td>
                <td>{{ $row->paciente->primer_nombre ?? 'N/A' }} {{ $row->paciente->primer_apellido ?? '' }}</td>
                <td>{{ $row->medico->primer_nombre ?? 'N/A' }} {{ $row->medico->primer_apellido ?? '' }}</td>
                <td>{{ optional($row->especialidad)->especialidad ?? 'N/A' }}</td>
                <td>{{ optional($row->motivoConsulta)->motivo ?? 'N/A' }}</td>
                <td>
                    @if(optional($row->historialDetalle)->enfermedades && $row->historialDetalle->enfermedades->count() > 0)
                    {{ $row->historialDetalle->enfermedades->pluck('nombre')->join(', ') }}
                    @else
                    {{ optional($row->historialDetalle)->diagnostico ?? 'N/A' }}
                    @endif
                </td>
                <td>{{ \Carbon\Carbon::parse($row->fecha)->format('d/m/Y') }} {{ \Carbon\Carbon::parse($row->hora_inicio)->format('h:i A') }}</td>
                <td>
                    @php
                    $badgeClass = 'badge-pending'; // Agendada (9)
                    if($row->id_estado == 10) $badgeClass = 'badge-active'; /* Atendida */
                    elseif($row->id_estado == 11 || $row->id_estado == 16) $badgeClass = 'badge-inactive'; /* Cancelada / Inasistencia */
                    @endphp
                    <span class="badge {{ $badgeClass }}">{{ $row->estado->nombre_estado ?? 'Desconocido' }}</span>
                </td>

                @elseif($entity === 'pqrs')
                <td>#{{ $row->id_pqr }}</td>
                <td>{{ $row->nombre_usuario }}</td>
                <td>{{ \Illuminate\Support\Str::limit($row->asunto, 30) }}</td>
                <td>{{ \Illuminate\Support\Str::limit($row->mensaje, 30) }}</td>
                <td>{{ \Illuminate\Support\Str::limit($row->id_estado == 10 ? ($row->respuesta ?: 'Contestado') : 'Sin respuesta', 30) }}</td>
                <td>{{ $row->email }}</td>
                <td>{{ $row->telefono ?? 'N/A' }}</td>
                <td>
                    @php
                    $badgeClass = 'badge-pending'; // Pendiente (13)
                    if($row->id_estado == 10) $badgeClass = 'badge-active'; /* Atendido */
                    @endphp
                    <span class="badge {{ $badgeClass }}">{{ $row->estado->nombre_estado ?? ($row->id_estado == 10 ? 'Atendido' : 'Pendiente') }}</span>
                </td>
                <td>{{ isset($row->created_at) ? \Carbon\Carbon::parse($row->created_at)->format('d/m/Y') : 'N/A' }}</td>
                @else
                {{-- Caso Dinámico: Recorre todas las columnas definidas en el controlador --}}
                @foreach($columns as $key => $label)
                @php
                $val = data_get($row, $key);
                if ($key === 'id_estado' || $key === 'estado') {
                $badgeClass = 'badge-pending';
                if ($row->id_estado == 10) $badgeClass = 'badge-active';
                if ($row->id_estado == 11) $badgeClass = 'badge-inactive';
                $val = "<span class=\"badge {$badgeClass}\">" . ($row->estado ?? $val) . "</span>";
                }
                @endphp
                <td>{!! $val !!}</td>
                @endforeach
                @endif
            </tr>
            @endforeach

            @if(count($data) == 0)
            <tr>
                <td colspan="10" style="text-align: center; padding: 20px; color: #94a3b8;">
                    No se encontraron registros con los filtros aplicados.
                </td>
            </tr>
            @endif
        </tbody>
    </table>

    <div class="footer">
        Saluvanta EPS - Soft. Sanitec - Reporte de {{ ucfirst($entity) }} - Documento Interno y Confidencial
    </div>
</body>

</html>