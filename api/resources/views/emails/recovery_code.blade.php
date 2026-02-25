<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #2563eb; padding: 30px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; text-align: center; }
        .content p { font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 25px; }
        .code-box { background-color: #f3f4f6; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin: 30px 0; }
        .code { font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 5px; margin: 0; }
        .warning { font-size: 14px; color: #e53e3e; background-color: #fff5f5; padding: 15px; border-radius: 6px; border-left: 4px solid #e53e3e; text-align: left; margin-top: 30px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Recuperación de Contraseña</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>Proyecto EPS</strong>. Para continuar con el proceso, utiliza el siguiente código de recuperación:</p>
            
            <div class="code-box">
                <p class="code">{{ $code }}</p>
            </div>
            
            <p>Este código es válido por <strong>10 minutos</strong>. Si no solicitaste este cambio, simplemente ignora este correo y tu cuenta seguirá segura.</p>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> Por tu seguridad, no compartas este código con ninguna persona. El equipo de soporte técnico nunca te pedirá este código.
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Proyecto EPS. Todos los derechos reservados.
        </div>
    </div>
</body>
</html>
