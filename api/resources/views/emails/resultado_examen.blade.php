<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resultados de Examen - Saluvanta EPS</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7f6; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #3B82F6; color: white; padding: 30px 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Resultados de Laboratorio</h1>
        </div>

        <div class="content">
            <p style="font-size: 18px; color: #1e293b; margin-top: 0;">Hola, <strong>{{ $examen->paciente->primer_nombre }} {{ $examen->paciente->primer_apellido }}</strong></p>

            <p style="color: #64748b; font-size: 15px;">Adjunto a este correo encontrarás los resultados de tu examen clínico correspondiente a la categoría <strong>{{ $examen->categoriaExamen->categoria ?? 'Examen General' }}</strong>, procesados el <strong>{{ \Carbon\Carbon::parse($examen->fecha)->format('d/m/Y') }}</strong>.</p>

            <p style="color: #64748b; font-size: 15px;">Te recomendamos revisar el archivo PDF adjunto y programar una <strong>Cita de Seguimiento</strong> con tu médico tratante para interpretar los resultados y continuar con tu tratamiento de ser necesario.</p>

        </div>

        <div class="footer">
            Este es un mensaje automático generado por el sistema de <strong>Saluvanta EPS</strong>.<br>
            Protegemos tus datos médicos conforme a la ley de Habeas Data.<br>
            &copy; {{ date('Y') }}
        </div>
    </div>
</body>
</html>
