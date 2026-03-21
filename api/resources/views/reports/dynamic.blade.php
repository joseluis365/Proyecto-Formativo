<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #1e40af;
            margin: 0;
            font-size: 18px;
            text-transform: uppercase;
        }
        .meta {
            width: 100%;
            margin-bottom: 15px;
            font-size: 9px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        th {
            background-color: #f1f5f9;
            color: #1e40af;
            font-weight: bold;
            padding: 8px 4px;
            border: 1px solid #e2e8f0;
            text-align: left;
            word-wrap: break-word;
        }
        td {
            padding: 6px 4px;
            border: 1px solid #e2e8f0;
            word-wrap: break-word;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 8px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
        }
        .status-badge {
            padding: 2px 5px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
        }
        .bg-green { background-color: #dcfce7; color: #166534; }
        .bg-red { background-color: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%; border: none; border-bottom: 2px solid #2563eb; margin-bottom: 10px;">
            <tr>
                <td style="width: 20%; border: none; text-align: left;">
                    @if(!empty($logoBase64))
                        <img src="data:image/png;base64,{{ $logoBase64 }}" style="width: 50px; height: 50px;">
                    @endif
                </td>
                <td style="width: 60%; border: none; text-align: center;">
                    <h1 style="margin: 0;">{{ $title }}</h1>
                    <p style="margin: 5px 0 0 0; color: #2563eb; font-weight: bold; font-size: 14px;">Saluvanta EPS</p>
                </td>
                <td style="width: 20%; border: none; text-align: right; color: #666; font-size: 8px;">
                    Documento Oficial
                </td>
            </tr>
        </table>
    </div>

    <table class="meta">
        <tr>
            <td><strong>Fecha de Generación:</strong> {{ $date }}</td>
            <td style="text-align: right;"><strong>Total Registros:</strong> {{ $total }}</td>
        </tr>
    </table>

    <table>
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
                            
                            // Formateo especial para fechas si el campo es created_at
                            if($key === 'created_at' && $value) {
                                $value = \Carbon\Carbon::parse($value)->format('d/m/Y');
                            }
                        @endphp
                        <td>
                            @if($key === 'id_estado' || str_contains($key, 'nombre_estado'))
                                <span class="status-badge {{ $item->id_estado == 1 ? 'bg-green' : 'bg-red' }}">
                                    {{ $value ?? ($item->id_estado == 1 ? 'ACTIVA' : 'INACTIVA') }}
                                </span>
                            @else
                                {{ $value ?? '-' }}
                            @endif
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Saluvanta EPS - Sistema de Gestión de Reportes (Sanitech) - Página <script type="text/php">echo $PAGE_NUM . " de " . $PAGE_COUNT;</script>
    </div>
</body>
</html>
