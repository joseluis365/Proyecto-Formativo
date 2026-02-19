<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Detalle Empresa - {{ $empresa->nombre }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #333; line-height: 1.4; font-size: 10px; }
        .header { border-bottom: 2px solid #0d6efd; padding-bottom: 10px; margin-bottom: 20px; }
        .title { color: #0d6efd; font-size: 20px; margin: 0; }
        .subtitle { color: #666; font-size: 11px; margin: 5px 0 0; }
        
        .section { margin-bottom: 20px; }
        .section-title { background-color: #f8f9fa; padding: 8px; border-left: 4px solid #0d6efd; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
        
        .info-grid { width: 100%; border-collapse: collapse; }
        .info-label { font-weight: bold; color: #555; width: 130px; padding: 4px 0; }
        .info-value { color: #000; padding: 4px 0; }
        
        td { vertical-align: top; }
        
        /* Tabla de historial */
        .history-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9px; }
        .history-table th { background-color: #e9ecef; color: #495057; text-align: left; padding: 6px; border-bottom: 1px solid #dee2e6; }
        .history-table td { padding: 6px; border-bottom: 1px solid #eee; }
        
        .status-badge { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: bold; background-color: #e9ecef; color: #495057; }
        
        .footer { position: fixed; bottom: 0; left: 0; right: 0; border-top: 1px solid #ddd; padding-top: 5px; font-size: 8px; text-align: center; color: #999; }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">{{ $empresa->nombre }}</h1>
        <p class="subtitle">Informe Detallado de Empresa • Generado el {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <div class="section">
        <div class="section-title">Información Corporativa</div>
        <table class="info-grid">
            <tr>
                <td class="info-label">NIT:</td>
                <td class="info-value">{{ $empresa->nit }}</td>
            </tr>
            <tr>
                <td class="info-label">Dirección:</td>
                <td class="info-value">{{ $empresa->direccion }}</td>
            </tr>
            <tr>
                <td class="info-label">Ciudad:</td>
                <td class="info-value">{{ $empresa->ciudad->nombre ?? 'No registrada' }}</td>
            </tr>
            <tr>
                <td class="info-label">Teléfono:</td>
                <td class="info-value">{{ $empresa->telefono }}</td>
            </tr>
            <tr>
                <td class="info-label">Email Contacto:</td>
                <td class="info-value">{{ $empresa->email_contacto }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Representante Legal</div>
        <table class="info-grid">
            <tr>
                <td class="info-label">Nombre:</td>
                <td class="info-value">{{ $empresa->nombre_representante }}</td>
            </tr>
            <tr>
                <td class="info-label">Documento:</td>
                <td class="info-value">{{ $empresa->documento_representante }}</td>
            </tr>
            <tr>
                <td class="info-label">Email:</td>
                <td class="info-value">{{ $empresa->email_representante }}</td>
            </tr>
            <tr>
                <td class="info-label">Teléfono:</td>
                <td class="info-value">{{ $empresa->telefono_representante }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Administrador del Sistema</div>
        @if($empresa->adminUser)
        <table class="info-grid">
            <tr>
                <td class="info-label">Nombre:</td>
                <td class="info-value">{{ $empresa->adminUser->nombre }}</td>
            </tr>
            <tr>
                <td class="info-label">Email Acceso:</td>
                <td class="info-value">{{ $empresa->adminUser->email }}</td>
            </tr>
            <tr>
                <td class="info-label">Documento:</td>
                <td class="info-value">{{ $empresa->adminUser->documento }}</td>
            </tr>
        </table>
        @else
        <p class="text-muted" style="font-style: italic; color: #777;">No se ha asignado un administrador.</p>
        @endif
    </div>

    <div class="section">
        <div class="section-title">Historial de Licencias y Vinculaciones</div>
        @if($empresa->licencias && $empresa->licencias->count() > 0)
        <table class="history-table">
            <thead>
                <tr>
                    <th>ID Licencia</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th></th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                @foreach($empresa->licencias->sortByDesc('created_at') as $licencia)
                <tr>
                    <td>{{ $licencia->id_empresa_licencia }}</td>
                    <td>{{ $licencia->tipoLicencia->tipo ?? 'N/A' }}</td>
                    <td>${{ number_format($licencia->tipoLicencia->precio ?? 0, 0, ',', '.') }}</td>
                    <td>{{ \Carbon\Carbon::parse($licencia->fecha_inicio)->format('d/m/Y') }}</td>
                    <td>{{ \Carbon\Carbon::parse($licencia->fecha_fin)->format('d/m/Y') }}</td>
                    <td>
                        @switch($licencia->id_estado)
                            @case(1) <span style="color: green; font-weight: bold;">Activa</span> @break
                            @case(2) <span style="color: gray;">Inactiva</span> @break
                            @case(3) <span style="color: orange;">Sin Licencia</span> @break
                            @case(4) <span style="color: orange;">Por vencer</span> @break
                            @case(5) <span style="color: red;">Vencida</span> @break
                            @case(6) <span style="color: red;">Bloqueada</span> @break
                            @default {{ $licencia->id_estado }}
                        @endswitch
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <p style="font-style: italic; color: #777;">No hay historial de licencias registrado.</p>
        @endif
    </div>

    <div class="footer">
        EPS - Sistema de Gestión de Empresas | {{ date('Y') }}
    </div>

</body>
</html>
