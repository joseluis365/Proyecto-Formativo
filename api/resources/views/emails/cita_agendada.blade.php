<!DOCTYPE html>
<html>
<head>
    <title>Notificación de Cita Agendada</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #0056b3;">¡Hola! Tu cita ha sido agendada</h2>
        
        <p>Te informamos que se ha agendado una nueva cita médica con los siguientes detalles:</p>
        
        <ul>
            <li><strong>Paciente (Documento):</strong> {{ $cita->doc_paciente }}</li>
            <li><strong>Médico (Documento):</strong> {{ $cita->doc_medico }}</li>
            <li><strong>Fecha programada:</strong> {{ $cita->fecha }}</li>
            <li><strong>Motivo:</strong> {{ $cita->motivo }}</li>
        </ul>
        
        <p><em>Nota: Las horas exactas de inicio y fin se registrarán al momento de la atención por parte del médico.</em></p>
        
        <p>Por favor, preséntate con anticipación el día seleccionado.</p>
        
        <p>Atentamente,<br>
        <strong>El equipo de tu EPS</strong></p>
    </div>
</body>
</html>
