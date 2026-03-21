<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resultados de Examen - Clínica EPS</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Resultados de Laboratorio</h1>
    </div>

    <div style="background-color: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Hola <strong>{{ $examen->paciente->primer_nombre }} {{ $examen->paciente->primer_apellido }}</strong>,</p>

        <p>Adjunto a este correo encontrarás los resultados de tu examen clínico de categoría <strong>{{ $examen->categoriaExamen->categoria ?? 'Examen General' }}</strong> realizado el <strong>{{ $examen->fecha }}</strong>.</p>

        <p>Por favor, revisa el archivo PDF adjunto y consúltalo con tu respectivo médico tratante. No dudes en agendar una cita de seguimiento si es necesario.</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; text-align: center;">
            <p style="margin: 0;">Este es un mensaje automático generado por el sistema de Clínica EPS.</p>
            <p style="margin: 5px 0 0 0;">Por favor no respondas a este correo.</p>
        </div>
    </div>
</body>
</html>
