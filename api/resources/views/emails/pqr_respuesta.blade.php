<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Respuesta a su PQRS</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fcfcfc;}
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0284c7; padding-bottom: 20px; }
        .header h1 { color: #0284c7; margin: 0; font-size: 24px; }
        .content { margin-bottom: 30px; background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea;}
        .footer { text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eaeaea; padding-top: 20px; }
        .info-box { background-color: #f3f4f6; padding: 15px; border-left: 4px solid #0284c7; margin-bottom: 20px; border-radius: 0 4px 4px 0;}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Saluvanta EPS</h1>
            <p>Respuesta a su Solicitud</p>
        </div>
        
        <div class="content">
            <p>Estimado/a <strong>{{ $pqr->nombre_usuario }}</strong>,</p>
            
            <p>En relación a su PQRS recibida con el asunto: <em>"{{ $pqr->asunto }}"</em>, le informamos lo siguiente:</p>

            <div class="info-box">
                <p style="margin: 0; white-space: pre-wrap;">{{ $pqr->respuesta }}</p>
            </div>

            <p>Esperamos que esta información haya sido de utilidad. Si tiene alguna otra inquietud, no dude en contactarnos nuevamente a través de nuestros canales oficiales.</p>
            
            <p>Atentamente,<br><strong>Equipo Administrativo Saluvanta EPS</strong></p>
        </div>
        
        <div class="footer">
            <p>Este es un mensaje automático generado por el sistema de gestión de PQRS de Saluvanta EPS. Por favor, no responda directamente a este correo.</p>
        </div>
    </div>
</body>
</html>
