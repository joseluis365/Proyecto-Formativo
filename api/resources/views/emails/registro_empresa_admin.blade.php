<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credenciales de Acceso Administrador</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #4f46e5; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
        .content h2 { color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 20px; }
        .credentials-box { background-color: #e0e7ff; border: 1px solid #c7d2fe; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center; }
        .credentials-box p { margin: 10px 0; font-size: 16px; }
        .credentials-box .value { font-weight: 700; color: #4f46e5; background: #ffffff; padding: 5px 10px; border-radius: 4px; border: 1px dashed #a5b4fc; display: inline-block; }
        .warning-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0; font-size: 14px; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenido al Sistema de Gestión</h1>
        </div>
        
        <div class="content">
            <h2>Hola, {{ $user->primer_nombre }} {{ $user->primer_apellido }}.</h2>
            
            <p>Se ha creado con éxito su cuenta de <strong>Administrador Principal</strong> para la empresa <strong>{{ $empresa->nombre }}</strong>.</p>
            
            <p>A continuación, le proporcionamos sus credenciales de acceso seguras. Por favor, guárdelas en un lugar seguro y no las comparta con nadie.</p>
            
            <div class="credentials-box">
                <p><strong>Usuario / Correo:</strong> <br> <span class="value">{{ $user->email }}</span></p>
                <p><strong>Contraseña:</strong> <br> <span class="value">{{ $password }}</span></p>
            </div>
            
            <div class="warning-box">
                <strong style="color: #b45309;">Importante:</strong> Aunque su cuenta ya está creada, el acceso a la plataforma está bloqueado temporalmente hasta que nuestro equipo culmine el proceso de <strong>Activación de la Licencia</strong>. Se le notificará tan pronto como el sistema esté completamente habilitado.
            </div>
            
            <p style="margin-top: 30px;">Atentamente,<br><strong>El equipo de TI y Soporte EPS</strong></p>
        </div>
        
        <div class="footer">
            <p>Este es un correo confidencial generado automáticamente.</p>
            <p>&copy; {{ date('Y') }} Sistema EPS. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
