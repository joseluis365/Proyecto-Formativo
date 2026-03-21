<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Medicamentos Despachados</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; line-height: 1.6; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        h1 { color: #0284c7; font-size: 24px; margin-bottom: 20px; }
        .details { background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .details p { margin: 5px 0; }
        .footer { font-size: 12px; color: #64748b; margin-top: 30px; text-align: center; }
        .highlight { font-weight: bold; color: #0284c7; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Actualización de Receta Médica</h1>
        <p>Hola <strong>{{ $paciente->primer_nombre }} {{ $paciente->primer_apellido }}</strong>,</p>
        
        <p>Te informamos que se ha despachado un medicamento correspondiente a tu receta médica. A continuación, los detalles:</p>

        <div class="details">
            <p><strong>ID Receta:</strong> #{{ $receta->id_receta }}</p>
            <p><strong>Medicamento:</strong> {{ $medicamentoDespachado }}</p>
            <p><strong>Cantidad Despachada:</strong> {{ $cantidad }} unidades</p>
            <p><strong>Farmacia:</strong> {{ $farmacia->razon_social ?? 'Farmacia Asignada' }}</p>
            <p><strong>Estado Actual de la Receta:</strong> <span class="highlight">{{ $receta->estado->nombre_estado ?? 'En Proceso' }}</span></p>
        </div>

        <p>Si la receta tiene estado "Parcialmente entregada", significa que aún tienes medicamentos pendientes por reclamar.</p>

        <p>Gracias por confiar en <strong>Saluvanta EPS</strong>.</p>

        <div class="footer">
            <p>Este es un mensaje generado automáticamente, por favor no respondas a este correo.</p>
        </div>
    </div>
</body>
</html>
