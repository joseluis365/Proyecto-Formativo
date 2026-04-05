<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10px;
            color: #334155;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 5px 0;
            color: #1e40af;
            font-size: 20px;
            text-transform: uppercase;
        }

        .header p {
            margin: 0;
            font-size: 14px;
            color: #64748b;
            font-weight: bold;
        }

        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 9px;
            color: #64748b;
        }

        .meta-table td {
            border: none;
            padding: 2px 0;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }

        table.data-table th {
            background-color: #f8fafc;
            color: #334155;
            font-weight: bold;
            padding: 8px 6px;
            border: 1px solid #cbd5e1;
            text-align: left;
            text-transform: uppercase;
            font-size: 8px;
        }

        table.data-table td {
            border: 1px solid #cbd5e1;
            padding: 7px 6px;
            color: #475569;
            font-size: 9px;
            word-wrap: break-word;
        }

        table.data-table tr:nth-child(even) {
            background-color: #f1f5f9;
        }

        .footer {
            position: fixed;
            bottom: -10px;
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
            text-transform: uppercase;
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

        .badge-info {
            background-color: #e0f2fe;
            color: #075985;
        }
    </style>
</head>

<body>
    <div class="header">
        @if(!empty($logoBase64))
        <img src="data:image/png;base64,{{ $logoBase64 }}" style="width: 50px; height: 50px; margin-bottom: 5px;">
        @endif
        <h1>{{ $title }}</h1>
        <p>Saluvanta EPS - Soft. Sanitec</p>
    </div>

    <table class="meta-table">
        <tr>
            <td style="width: 50%;"><strong>Fecha de Generación:</strong> {{ $date }}</td>
            <td style="width: 50%; text-align: right;"><strong>Total de Registros:</strong> {{ $total }}</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                @foreach($columns as $key => $label)
                <th>{{ $label }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($collection as $item)
            <tr>
                @foreach($columns as $key => $label)
                @php
                $value = data_get($item, $key);

                // Formateo de fechas
                if(($key === 'created_at' || $key === 'fecha' || str_contains($key, 'fecha')) && $value) {
                try {
                $value = \Carbon\Carbon::parse($value)->format('d/m/Y');
                } catch(\Exception $e) {}
                }
                @endphp
                <td>
                    @if($key === 'id_estado' || str_contains($key, 'nombre_estado') || $key === 'estado')
                    @php
                    $statusVal = data_get($item, 'id_estado', $value);
                    $badgeClass = 'badge-pending';
                    if ($statusVal == 1 || $statusVal == 10) $badgeClass = 'badge-active';
                    elseif ($statusVal == 2 || $statusVal == 11 || $statusVal == 16) $badgeClass = 'badge-inactive';
                    @endphp
                    <span class="badge {{ $badgeClass }}">
                        {{ is_string($value) ? $value : ($statusVal == 1 ? 'ACTIVA' : 'INACTIVA') }}
                    </span>
                    @else
                    {{ is_string($value) || is_numeric($value) ? $value : ($value ? json_encode($value) : '-') }}
                    @endif
                </td>
                @endforeach
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Saluvanta EPS - Reporte Interno Digital
    </div>
</body>

</html>