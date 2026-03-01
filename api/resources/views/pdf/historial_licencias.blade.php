<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Historial de Licencias</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #333; line-height: 1.3; font-size: 10px; }
        .header { border-bottom: 2px solid #0d6efd; padding-bottom: 10px; margin-bottom: 15px; text-align: center; }
        .title { color: #0d6efd; font-size: 16px; margin: 0; }
        .subtitle { color: #666; font-size: 10px; margin: 5px 0 0; }

        .history-card {
            border: 1px solid #ddd;
            border-left: 4px solid #0d6efd;
            background-color: #fff;
            padding: 8px;
            margin-bottom: 10px;
            page-break-inside: avoid;
            border-radius: 4px;
        }

        .card-header {
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 5px;
            display: table;
            width: 100%;
        }

        .company-title { font-weight: bold; font-size: 11px; color: #0d6efd; }
        .license-id { text-align: right; font-weight: bold; color: #555; font-size: 11px; }

        .details-grid { display: table; width: 100%; }
        .details-col { display: table-cell; width: 50%; vertical-align: top; }
        
        .info-row { margin-bottom: 2px; }
        .label { font-weight: bold; color: #666; margin-right: 4px; font-size: 9px; }
        .value { color: #000; font-size: 10px; }

        .status-badge { 
            font-weight: bold; 
            font-size: 9px;
            text-transform: uppercase;
        }

        .footer { position: fixed; bottom: 0; left: 0; right: 0; border-top: 1px solid #ddd; padding-top: 5px; font-size: 8px; text-align: center; color: #999; }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">Historial Completo de Vinculaciones</h1>
        <p class="subtitle">Total Registros: {{ $historial->count() }} • Generado el {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    @foreach($historial as $item)
    <div class="history-card">
        <!-- Encabezado de la Tarjeta -->
        <div class="card-header">
            <div style="display: table-cell; width: 70%;">
                <span class="company-title">{{ $item->empresa->nombre ?? 'Empresa Eliminada' }}</span>
                <span style="font-size: 9px; color: #777;">(NIT: {{ $item->nit }})</span>
            </div>
            <div style="display: table-cell; width: 30%; text-align: right;">
                <span class="license-id">Licencia: {{ $item->id_empresa_licencia }}</span>
            </div>
        </div>

        <!-- Contenido Dividido en 2 Columnas -->
        <div class="details-grid">
            <!-- Columna Izquierda: Datos Empresa -->
            <div class="details-col" style="padding-right: 10px; border-right: 1px solid #eee;">
                <div style="font-weight: bold; color: #0d6efd; font-size: 9px; margin-bottom: 3px; border-bottom: 1px dashed #eee;">DATOS DE EMPRESA</div>
                
                <div class="info-row">
                    <span class="label">Representante:</span>
                    <span class="value">{{ $item->empresa->nombre_representante ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email Contacto:</span>
                    <span class="value">{{ $item->empresa->email_contacto ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email Rep:</span>
                    <span class="value">{{ $item->empresa->email_representante ?? 'N/A' }}</span>
                </div>
            </div>

            <!-- Columna Derecha: Datos Licencia -->
            <div class="details-col" style="padding-left: 10px;">
                <div style="font-weight: bold; color: #0d6efd; font-size: 9px; margin-bottom: 3px; border-bottom: 1px dashed #eee;">DETALLES DE LICENCIA</div>
                
                <div class="info-row">
                    <span class="label">Tipo:</span>
                    <span class="value">{{ $item->tipoLicencia->tipo ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Precio:</span>
                    <span class="value">${{ number_format($item->tipoLicencia->precio ?? 0, 0, ',', '.') }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Vigencia:</span>
                    <span class="value">
                        {{ \Carbon\Carbon::parse($item->fecha_inicio)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($item->fecha_fin)->format('d/m/Y') }}
                    </span>
                </div>
                <div class="info-row">
                    <span class="label">Estado:</span>
                    @switch($item->id_estado)
                        @case(1) <span class="status-badge" style="color: green;">Activa</span> @break
                        @case(2) <span class="status-badge" style="color: gray;">Inactiva</span> @break
                        @case(3) <span class="status-badge" style="color: orange;">Sin Licencia</span> @break
                        @case(4) <span class="status-badge" style="color: orange;">Por Vencer</span> @break
                        @case(5) <span class="status-badge" style="color: red;">Vencida</span> @break
                        @case(6) <span class="status-badge" style="color: red;">Bloqueada</span> @break
                        @default <span class="status-badge">{{ $item->id_estado }}</span>
                    @endswitch
                </div>
            </div>
        </div>
    </div>
    @endforeach

    <div class="footer">
        EPS - Sistema de Gestión de Licencias | Departamento de Contabilidad y Auditoría
    </div>

</body>
</html>
