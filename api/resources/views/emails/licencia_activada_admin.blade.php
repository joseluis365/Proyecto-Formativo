<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cuenta de Administrador Activada</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #4f46e5; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
        .content h2 { color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 20px; }
        .cta-button { display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 25px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Acceso Administrador Habilitado</h1>
        </div>
        
        <div class="content">
            <h2>Hola, {{ $user->primer_nombre }} {{ $user->primer_apellido }}.</h2>
            
            <p>Tu cuenta de Administrador para la empresa <strong>{{ $empresa->nombre }}</strong> ha sido activada oficialmente.</p>
            
            <p>Ya puedes iniciar sesión en la plataforma utilizando el correo electrónico y la contraseña que configuraste durante el registro.</p>
            
            <div style="text-align: center;">
                <a href="{{ env('FRONTEND_URL') ?? '#' }}" class="cta-button">Ingresar al Sistema</a>
            </div>
            
            <p>Si no recuerdas tus credenciales, puedes usar la opción "Olvidé mi contraseña" en la página de inicio de sesión.</p>
            
            <p style="margin-top: 30px;">Atentamente,<br><strong>Soporte Técnico EPS</strong></p>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
            <p>&copy; {{ date('Y') }} Sistema EPS. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
