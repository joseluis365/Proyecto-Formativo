<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Licencia Activada Exitosamente</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #3b82f6; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
        .content h2 { color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 20px; }
        .success-banner { background-color: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 20px; text-align: center; border-radius: 8px; font-size: 18px; font-weight: 600; margin-bottom: 25px; }
        .details-box { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 25px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Activación del Servicio EPS</h1>
        </div>
        
        <div class="content">
            <div class="success-banner">
                ¡Su licencia ha sido activada con éxito!
            </div>

            <h2>Hola equipo de {{ $empresa->nombre }},</h2>
            
            <p>Es un gusto para nosotros informarles que el proceso de validación ha finalizado y su acceso a la plataforma ha sido habilitado completamente.</p>
            
            <div class="details-box">
                <p style="margin-top: 0;"><strong>Detalles de la Licencia:</strong></p>
                <ul style="margin-bottom: 0;">
                    <li><strong>Vencimiento:</strong> {{ \Carbon\Carbon::parse($licencia->fecha_fin)->format('d/m/Y') }}</li>
                    <li><strong>NIT:</strong> {{ $empresa->nit }}</li>
                </ul>
            </div>
            
            <p>A partir de este momento, ya pueden ingresar al sistema y comenzar a disfrutar de todas las herramientas de gestión que ofrecemos.</p>
            
            <p style="margin-top: 30px;">Bienvenidos,<br><strong>El equipo administrativo de EPS</strong></p>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático generado por el sistema.</p>
            <p>&copy; {{ date('Y') }} Sistema EPS. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
