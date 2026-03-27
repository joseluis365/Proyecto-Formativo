<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resultado de tu Consulta Médica</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7f6; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #3B82F6; color: white; padding: 30px 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px; }
        .greeting { font-size: 18px; margin-bottom: 20px; color: #1e293b; }
        .section { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
        .section:last-child { border-bottom: none; }
        .section-title { font-size: 16px; color: #3B82F6; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; }
        .data-row { margin-bottom: 10px; }
        .data-label { font-weight: 600; color: #64748b; font-size: 14px; }
        .data-value { font-size: 15px; color: #334155; display: block; margin-top: 3px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; background: #E0E7FF; color: #3730A3; }
        .item-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 10px; }
        .item-title { font-weight: bold; color: #1e293b; margin-bottom: 5px; font-size: 15px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
        .footer a { color: #3B82F6; text-decoration: none; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Resumen de tu Consulta Médica</h1>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Cita #{{ $cita->id_cita }}</p>
    </div>
    
    <div class="content">
        <p class="greeting">Hola, <strong>{{ $cita->paciente->primer_nombre ?? 'Paciente' }} {{ $cita->paciente->primer_apellido ?? '' }}</strong></p>
        <p style="color: #64748b; font-size: 15px;">Tu atención médica ha concluido con éxito. A continuación encontrarás un resumen oficial de las notas, diagnósticos e indicaciones de tu médico tratante.</p>

        <div class="section" style="margin-top: 30px;">
            <div class="section-title">Detalles de la Atención</div>
            <div class="data-row">
                <span class="data-label">Médico Tratante:</span>
                <span class="data-value">Dr. {{ $cita->medico->primer_nombre ?? '' }} {{ $cita->medico->primer_apellido ?? '' }}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Fecha:</span>
                <span class="data-value">{{ \Carbon\Carbon::parse($cita->fecha)->format('d \d\e F, Y') }} a las {{ \Carbon\Carbon::parse($cita->hora_inicio)->format('h:i A') }}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Diagnóstico y Plan (SOAP)</div>
            <div class="data-row">
                <span class="data-label">Motivo de consulta:</span>
                <span class="data-value" style="font-style: italic;">"{{ $detalle->subjetivo ?? 'No especificado' }}"</span>
            </div>
            <div class="data-row">
                <span class="data-label">Diagnóstico Clínico CIE-11 (A):</span>
                @if($detalle->enfermedades && count($detalle->enfermedades) > 0)
                    <div style="margin-top: 5px; margin-bottom: 8px;">
                        @foreach($detalle->enfermedades as $enf)
                            <span class="badge" style="margin-right: 5px; margin-bottom: 5px;">[{{ $enf->codigo_icd }}] {{ $enf->nombre }}</span>
                        @endforeach
                    </div>
                @endif
                <span class="data-value" style="background: #f8fafc; padding: 10px; border-radius: 6px; border-left: 3px solid #3B82F6;"><strong>{{ $detalle->diagnostico }}</strong></span>
            </div>
            <div class="data-row">
                <span class="data-label">Plan de Tratamiento (P):</span>
                <span class="data-value">{{ $detalle->tratamiento }}</span>
            </div>
            @if(!empty($detalle->observaciones))
            <div class="data-row" style="margin-top: 15px;">
                <span class="data-label">Observaciones Generales:</span>
                <span class="data-value">{{ $detalle->observaciones }}</span>
            </div>
            @endif
        </div>

        @if($remisiones && count($remisiones) > 0)
        <div class="section">
            <div class="section-title">Remisiones y Órdenes Clínicas</div>
            <p style="font-size: 14px; color: #64748b; margin-top: 0;">Tu médico ha generado las siguientes órdenes que ya se encuentran activas en el sistema:</p>
            
            @foreach($remisiones as $rem)
            <div class="item-box">
                <div class="item-title">
                    {{ ucfirst($rem->tipo_remision) }} 
                    @if($rem->tipo_remision === 'cita')
                        a Especialista
                    @else
                        Clínico
                    @endif
                    <span class="badge" style="float: right;">Autorizada</span>
                </div>
                <div style="font-size: 14px; color: #475569; margin-top: 8px;">
                    <strong>Justificación:</strong> {{ $rem->notas }}
                </div>
            </div>
            @endforeach
        </div>
        @endif

        @if($receta && count($receta->recetaDetalles) > 0)
        <div class="section">
            <div class="section-title">Receta Médica y Medicamentos</div>
            <p style="font-size: 14px; color: #64748b; margin-top: 0;">Preséntate en las farmacias seleccionadas con tu documento para la dispensación.</p>
            
            @foreach($receta->recetaDetalles as $med)
            <div class="item-box">
                <div class="item-title">{{ $med->presentacion->medicamento->nombre ?? 'Medicamento' }} {{ $med->presentacion->concentracion->concentracion ?? '' }}</div>
                <div style="font-size: 13px; color: #475569; margin-top: 5px;">
                    <div><strong>Dosis:</strong> {{ $med->dosis }}</div>
                    <div><strong>Frecuencia:</strong> {{ $med->frecuencia }}</div>
                    <div><strong>Duración:</strong> {{ \Carbon\Carbon::parse($med->duracion)->diffInDays(\Carbon\Carbon::parse($cita->fecha)) }} días (hasta {{ \Carbon\Carbon::parse($med->duracion)->format('d/m/Y') }})</div>
                    <div><strong>Cantidad a Entregar:</strong> {{ $med->cantidad_dispensar }} unidades autorizadas.</div>
                    <div style="margin-top: 5px;"><strong>Farmacia Asignada:</strong> {{ $med->farmacia->nombre ?? 'N/A' }}</div>
                </div>
            </div>
            @endforeach
        </div>
        @endif
        
        <p style="text-align: center; margin-top: 30px; font-size: 15px;">
            Puedes consultar más detalles accediendo a tu <a href="http://localhost:5173/login" style="color: #3B82F6; font-weight: bold; text-decoration: none;">Portal de Paciente EPS</a>.
        </p>
    </div>

    <div class="footer">
        Protegemos tus datos médicos conforme a la ley de Habeas Data.<br>
        Este correo es generado de manera automática, por favor no respondas a este remitente.<br>
        <strong>Saluvanta EPS</strong> &copy; {{ date('Y') }}
    </div>
</div>

</body>
</html>
