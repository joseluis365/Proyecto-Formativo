<!DOCTYPE html>
<html>
<head>
    <title>Mi Primer PDF</title>
    <style>
        /* CSS básico (DomPDF no soporta Grid o Flexbox avanzado) */
        body { font-family: sans-serif; }
        .titulo { color: #333; text-align: center; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <h1 class="titulo">{{ $titulo }}</h1>
    <p>Fecha: {{ $fecha }}</p>

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
</body>
</html>