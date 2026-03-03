<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Empresa Exitoso</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #1e3a8a; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
        .content h2 { color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 20px; }
        .info-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
        ul { margin: 0; padding-left: 20px; }
        li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenido a la Plataforma EPS</h1>
        </div>
        
        <div class="content">
            <h2>¡Hola equipo de {{ $empresa->nombre }}!</h2>
            
            <p>Nos complace informarles que el registro de su empresa y el procesamiento del pago se han completado de manera <strong>exitosa</strong>.</p>
            
            <p>Su empresa ha quedado registrada formalmente en nuestro sistema con el NIT <strong>{{ $empresa->nit }}</strong>.</p>
            
            <div class="info-box">
                <p style="margin-top: 0; font-weight: 600; color: #1e3a8a;">Siguientes pasos:</p>
                <p style="margin-bottom: 0;">Actualmente, su licencia se encuentra <strong>Pendiente de Activación</strong>. Nuestro equipo de soporte verificará los datos en breve y activará su acceso. Recibirán una notificación una vez que el software esté listo para su uso.</p>
            </div>
            
            <p>Si tienen alguna duda o inquietud durante este proceso, no duden en contactar a nuestro equipo de soporte.</p>
            
            <p style="margin-top: 30px;">Atentamente,<br><strong>El equipo de Administración EPS</strong></p>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático, por favor no responda a este mensaje.</p>
            <p>&copy; {{ date('Y') }} Sistema EPS. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
