<!DOCTYPE html>
<html>
<head>
    <title>Nuevo Mensaje de Contacto</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #eee; padding-bottom: 10px;">Nuevo mensaje desde el Formulario de Contacto</h2>
        
        <p><strong>De:</strong> {{ $data['name'] }}</p>
        <p><strong>Correo Electrónico:</strong> {{ $data['email'] }}</p>
        <p><strong>Teléfono:</strong> {{ $data['phone'] }}</p>
        <p><strong>Asunto:</strong> {{ $data['subject'] }}</p>
        
        <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Mensaje:</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
            {{ nl2br(e($data['message'])) }}
        </div>
        
        <p style="margin-top: 40px; font-size: 12px; color: #777; text-align: center;">
            Este mensaje fue enviado desde el formulario de contacto del sistema EPS.
        </p>
    </div>
</body>
</html>
