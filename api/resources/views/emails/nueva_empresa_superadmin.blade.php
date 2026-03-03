<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Empresa Registrada</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #312e81; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
        .content h2 { color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 20px; }
        .info-card { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; margin: 25px 0; border-radius: 8px; }
        .info-row { margin-bottom: 10px; display: flex; border-bottom: 1px solid #edf2f7; padding-bottom: 8px; }
        .info-label { font-weight: 600; color: #4a5568; width: 140px; flex-shrink: 0; }
        .info-value { color: #2d3748; }
        .action-box { background-color: #fffbeb; border-left: 4px solid #d97706; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Alerta de Sistema - Nueva Empresa</h1>
        </div>
        
        <div class="content">
            <h2>Notificación de Registro</h2>
            
            <p>Se ha registrado una nueva empresa en la plataforma. El proceso de pago ha sido <strong>exitoso</strong> y la solicitud está a la espera de revisión y activación de licencia.</p>
            
            <div class="info-card">
                <div class="info-row">
                    <span class="info-label">Empresa:</span>
                    <span class="info-value">{{ $empresa->nombre }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">NIT:</span>
                    <span class="info-value">{{ $empresa->nit }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Representante:</span>
                    <span class="info-value">{{ $empresa->nombre_representante }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ubicación:</span>
                    <span class="info-value">{{ $empresa->ciudad->nombre ?? 'N/A' }}, {{ $empresa->ciudad->departamento->nombre ?? 'N/A' }}</span>
                </div>
            </div>
            
            <div class="action-box">
                <p style="margin: 0; font-weight: 600; color: #92400e;">Acción requerida:</p>
                <p style="margin: 5px 0 0 0;">Por favor, ingrese al panel de SuperAdmin para validar la documentación y activar la licencia correspondiente para permitir el acceso de los usuarios de la empresa.</p>
            </div>
            
            <p style="margin-top: 30px;">Atentamente,<br><strong>Sistema de Notificaciones EPS</strong></p>
        </div>
        
        <div class="footer">
            <p>Este es un mensaje automático del sistema de gestión corporativa.</p>
            <p>&copy; {{ date('Y') }} Sistema EPS. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
