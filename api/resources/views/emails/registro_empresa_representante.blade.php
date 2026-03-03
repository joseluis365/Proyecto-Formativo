<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro como Representante Legal</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #047857; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
        .content h2 { color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 20px; }
        .info-box { background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Notificación Legal EPS</h1>
        </div>
        
        <div class="content">
            <h2>Estimado/a {{ $empresa->nombre_representante }},</h2>
            
            <p>Por medio de este correo, le notificamos oficialmente que ha sido registrado(a) en nuestro sistema como el <strong>Representante Legal</strong> de la empresa <strong>{{ $empresa->nombre }}</strong> (NIT: {{ $empresa->nit }}).</p>
            
            <p>El pago de licenciamiento asociado a su empresa se ha procesado con éxito.</p>
            
            <div class="info-box">
                <p style="margin-top: 0; font-weight: 600; color: #047857;">Estado del Servicio:</p>
                <p style="margin-bottom: 0;">El acceso al software y sus plataformas asociadas se encuentra <strong>Pendiente de Activación</strong>. Un miembro de nuestro equipo administrativo se encargará de validar la información y habilitar los servicios a la mayor brevedad posible.</p>
            </div>
            
            <p>No se requiere ninguna acción adicional de su parte en este momento. Mantendremos al contacto principal y al administrador informados de cualquier novedad.</p>
            
            <p style="margin-top: 30px;">Atentamente,<br><strong>El equipo de Administración EPS</strong></p>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático y de carácter informativo.</p>
            <p>&copy; {{ date('Y') }} Sistema EPS. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
