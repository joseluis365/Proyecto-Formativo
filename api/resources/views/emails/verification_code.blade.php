<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #1e3a8a; padding: 30px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; text-align: center; }
        .content p { font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 25px; }
        .code-box { background-color: #f3f4f6; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin: 30px 0; }
        .code { font-size: 36px; font-weight: bold; color: #1e3a8a; letter-spacing: 5px; margin: 0; }
        .warning { font-size: 14px; color: #e53e3e; background-color: #fff5f5; padding: 15px; border-radius: 6px; border-left: 4px solid #e53e3e; text-align: left; margin-top: 30px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verificación de Inicio de Sesión</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Hemos detectado un intento de inicio de sesión en tu cuenta de SuperAdmin de <strong>Proyecto EPS</strong>. Para continuar y verificar tu identidad, ingresa el siguiente código:</p>
            
            <div class="code-box">
                <p class="code">{{ $code }}</p>
            </div>
            
            <p>Este código es válido por <strong>5 minutos</strong>. Si no has intentado iniciar sesión, puedes ignorar este correo de forma segura.</p>
            
            <div class="warning">
                <strong>⚠️ Advertencia de Seguridad:</strong> Nunca compartas este código con nadie. El equipo de Proyecto EPS nunca te pedirá tu código de verificación.
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Proyecto EPS. Todos los derechos reservados.
        </div>
    </div>
</body>
</html>
