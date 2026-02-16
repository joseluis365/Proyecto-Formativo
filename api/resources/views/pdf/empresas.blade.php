<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Informe Empresas EPS</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #333; line-height: 1.4; font-size: 11px; }
        .header { border-bottom: 2px solid #0d6efd; padding-bottom: 10px; margin-bottom: 20px; }
        .title { color: #0d6efd; font-size: 18px; margin: 0; }
        .subtitle { color: #666; font-size: 10px; margin: 5px 0 0; }
        
        .company-card { 
            border: 1px solid #ddd; 
            border-radius: 5px; 
            padding: 10px; 
            margin-bottom: 15px; 
            page-break-inside: avoid;
            background-color: #fff;
        }
        
        .card-header {
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 5px;
            display: table;
            width: 100%;
        }
        
        .company-name {
            display: table-cell;
            font-size: 14px;
            font-weight: bold;
            color: #0d6efd;
            width: 70%;
        }
        
        .company-nit {
            display: table-cell;
            text-align: right;
            font-weight: bold;
            color: #555;
        }
        
        .info-row { margin-bottom: 3px; }
        .label { font-weight: bold; color: #666; margin-right: 5px; }
        .value { color: #333; }
        
        .sections-grid { display: table; width: 100%; margin-top: 5px; }
        .section-col { display: table-cell; width: 50%; vertical-align: top; padding-right: 10px; }
        
        .sub-title { 
            font-size: 10px; 
            font-weight: bold; 
            color: #0d6efd; 
            border-bottom: 1px solid #eee; 
            margin-bottom: 3px; 
            text-transform: uppercase;
        }

        .footer { position: fixed; bottom: 0; left: 0; right: 0; border-top: 1px solid #ddd; padding-top: 5px; font-size: 9px; text-align: center; color: #999; }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">Informe General de Empresas</h1>
        <p class="subtitle">Total Registros: {{ $empresas->count() }} • Generado el {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    @foreach($empresas as $empresa)
    <div class="company-card">
        <div class="card-header">
            <div class="company-name">{{ $empresa->nombre }}</div>
            <div class="company-nit">NIT: {{ $empresa->nit }}</div>
        </div>
        
        <div class="info-row">
            <span class="label">Contacto:</span>
            <span class="value">{{ $empresa->email_contacto }} • {{ $empresa->telefono }}</span>
        </div>
        <div class="info-row">
            <span class="label">Dirección:</span>
            <span class="value">{{ $empresa->direccion }} ({{ $empresa->ciudad ?? 'N/A' }})</span>
        </div>

        <div class="sections-grid">
            <div class="section-col">
                <div class="sub-title">Representante Legal</div>
                <div class="info-row"><span class="value">{{ $empresa->nombre_representante }}</span></div>
                <div class="info-row"><span class="label">Doc:</span><span class="value">{{ $empresa->documento_representante }}</span></div>
                <div class="info-row"><span class="label">Email:</span><span class="value">{{ $empresa->email_representante }}</span></div>
            </div>
            
            <div class="section-col">
                <div class="sub-title">Licencia Actual</div>
                @if($empresa->licenciaActual)
                    <div class="info-row"><span class="label">Tipo:</span><span class="value">{{ $empresa->licenciaActual->tipoLicencia->tipo ?? 'N/A' }}</span></div>
                    <div class="info-row"><span class="label">Vigencia:</span><span class="value">{{ \Carbon\Carbon::parse($empresa->licenciaActual->fecha_inicio)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($empresa->licenciaActual->fecha_fin)->format('d/m/Y') }}</span></div>
                @else
                    <div class="info-row"><span class="value" style="color: #999; font-style: italic;">Sin licencia activa</span></div>
                @endif
            </div>
        </div>
    </div>
    @endforeach

    <div class="footer">
        EPS - Proyecto Formativo | Documento Confidencial
    </div>

</body>
</html>
