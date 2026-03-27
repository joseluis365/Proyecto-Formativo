<!DOCTYPE html>
<html>

<head>
    <title>Mi Primer PDF</title>
    <style>
        /* CSS básico (DomPDF no soporta Grid o Flexbox avanzado) */
        body {
            font-family: sans-serif;
        }

        .titulo {
            color: #333;
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">
    @if(!empty($logoBase64))
    <img src="data:image/png;base64,{{ $logoBase64 }}" style="width: 50px; height: 50px; display: block; margin: 0 auto;">
    @endif
    <h1 style="margin: 10px 0 5px 0; color: #1e40af;">Saluvanta EPS</h1>
    <h2 class="titulo" style="margin: 0; font-size: 16px;">{{ $titulo }}</h2>
    <p style="font-size: 10px; color: #666;">Fecha de generación: {{ $fecha }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Documento</th>
            <th>Nombre</th>
        </tr>
    </thead>
    <tbody>
        @foreach($usuarios as $user)
        <tr>
            <td>{{ $user->documento }}</td>
            <td>{{ $user->nombre }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
<div style="position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 5px;">
    Saluvanta EPS - {{ $titulo }} - Generado por Sanitec
</div>
</body>

</html>