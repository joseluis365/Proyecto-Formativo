<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Global Report Settings
    |--------------------------------------------------------------------------
    */
    'settings' => [
        'default_pagination' => 50,
        'pdf_landscape'      => ['farmacia', 'usuario'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Reportable Entities
    |--------------------------------------------------------------------------
    | Definition of rules for each model that can generate reports.
    */
    'entities' => [
        'prioridades' => [
            'model'          => \App\Models\Prioridad::class,
            'label'          => 'Catálogo de Prioridades',
            'primary_key'    => 'id_prioridad',
            'uses_estado'    => true,
            'has_timestamps' => true,
            'searchable'     => ['prioridad'],
            'relations'      => ['estado'],
            'columns' => [
                'id_prioridad'         => 'ID',
                'prioridad'            => 'Nombre de Prioridad',
                'estado.nombre_estado' => 'Estado Actual',
                'created_at'           => 'Fecha de Registro',
            ],
            'groupable' => [
                'id_estado' => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Prioridades', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'roles' => [
            'model'          => \App\Models\Rol::class,
            'label'          => 'Gestión de Roles',
            'primary_key'    => 'id_rol',
            'uses_estado'    => true,
            'has_timestamps' => false,
            'searchable'     => ['tipo_usu'],
            'relations'      => ['estado'],
            'columns' => [
                'id_rol'               => 'ID',
                'tipo_usu'             => 'Tipo de Usuario',
                'estado.nombre_estado' => 'Estado',
            ],
            'groupable' => [
                'id_estado' => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Roles', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'especialidades' => [
            'model'          => \App\Models\Especialidad::class,
            'label'          => 'Especialidades Médicas',
            'primary_key'    => 'id_especialidad',
            'uses_estado'    => true,
            'has_timestamps' => false,
            'searchable'     => ['especialidad'],
            'relations'      => ['estado'],
            'columns' => [
                'id_especialidad'      => 'ID',
                'especialidad'         => 'Nombre Especialidad',
                'estado.nombre_estado' => 'Estado',
            ],
            'groupable' => [
                'id_estado' => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Especialidades', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'departamentos' => [
            'model'          => \App\Models\Departamento::class,
            'label'          => 'Departamentos / Regiones',
            'primary_key'    => 'codigo_DANE',
            'uses_estado'    => true,
            'has_timestamps' => true,
            'searchable'     => ['nombre'],
            'relations'      => ['estado'],
            'columns' => [
                'codigo_DANE'          => 'Código DANE',
                'nombre'               => 'Nombre Departamento',
                'estado.nombre_estado' => 'Estado',
                'created_at'           => 'Fecha Registro',
            ],
            'groupable' => [
                'id_estado' => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Departamentos', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'ciudades' => [
            'model'          => \App\Models\Ciudad::class,
            'label'          => 'Ciudades y Municipios',
            'primary_key'    => 'codigo_postal',
            'uses_estado'    => true,
            'has_timestamps' => true,
            'searchable'     => ['nombre'],
            'relations'      => ['departamento', 'estado'],
            'columns' => [
                'codigo_postal'        => 'Código Postal',
                'nombre'               => 'Nombre Ciudad',
                'departamento.nombre'  => 'Departamento',
                'estado.nombre_estado' => 'Estado',
                'created_at'           => 'Fecha Registro',
            ],
            'groupable' => [
                'id_departamento' => 'departamento.nombre',
                'id_estado'       => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Ciudades', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'categoria_examen' => [
            'model'          => \App\Models\CategoriaExamen::class,
            'label'          => 'Categorías de Examen',
            'primary_key'    => 'id_categoria_examen',
            'uses_estado'    => true,
            'has_timestamps' => true,
            'searchable'     => ['categoria'],
            'relations'      => ['estado'],
            'columns' => [
                'id_categoria_examen'  => 'ID',
                'categoria'            => 'Nombre Categoría',
                'estado.nombre_estado' => 'Estado',
                'created_at'           => 'Fecha Registro',
            ],
            'groupable' => [
                'id_estado' => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Categorías', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'categoria_medicamento' => [
            'model'          => \App\Models\CategoriaMedicamento::class,
            'label'          => 'Categorías de Medicamento',
            'primary_key'    => 'id_categoria',
            'uses_estado'    => true,
            'has_timestamps' => true,
            'searchable'     => ['categoria'],
            'relations'      => ['estado'],
            'columns' => [
                'id_categoria'         => 'ID',
                'categoria'            => 'Nombre Categoría',
                'estado.nombre_estado' => 'Estado',
                'created_at'           => 'Fecha Registro',
            ],
            'groupable' => [
                'id_estado' => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Categorías', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'farmacia' => [
            'model'          => \App\Models\Farmacia::class,
            'label'          => 'Red de Farmacias',
            'primary_key'    => 'nit',
            'uses_estado'    => true,
            'has_timestamps' => true,
            'searchable'     => ['nombre', 'nit', 'direccion'],
            'relations'      => ['empresa', 'estado'],
            'columns' => [
                'nit'                  => 'NIT',
                'nombre'               => 'Razón Social',
                'empresa.nombre'       => 'Empresa Asociada',
                'direccion'            => 'Dirección',
                'telefono'             => 'Teléfono',
                'estado.nombre_estado' => 'Estado',
            ],
            'groupable' => [
                'nit_empresa' => 'empresa.nombre',
                'id_estado'   => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Farmacias', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'usuario' => [
            'model'          => \App\Models\Usuario::class,
            'label'          => 'Directorio de Usuarios',
            'primary_key'    => 'documento',
            'uses_estado'    => true,
            'has_timestamps' => true,
            'searchable'     => ['nombre', 'apellido', 'email', 'documento'],
            'relations'      => ['rol', 'estado'],
            'columns' => [
                'documento'            => 'Documento',
                'nombre'               => 'Nombres',
                'apellido'             => 'Apellidos',
                'email'                => 'Correo Electrónico',
                'rol.tipo_usu'         => 'Rol / Perfil',
                'estado.nombre_estado' => 'Estado Cuenta',
                'created_at'           => 'Fecha Creación',
            ],
            'groupable' => [
                'id_rol'    => 'rol.tipo_usu',
                'id_estado' => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => ['label' => 'Total Usuarios registrados', 'type' => 'count'],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],

        'tipo_cita' => [
            'model'          => \App\Models\TipoCita::class,
            'label'          => 'Tipos de Cita',
            'primary_key'    => 'id_tipo_cita',
            'uses_estado'    => true,
            'has_timestamps' => true,
            'searchable'     => ['tipo'],
            'relations'      => ['estado'],
            'columns' => [
                'id_tipo_cita'         => 'ID',
                'tipo'                 => 'Tipo de Cita',
                'estado.nombre_estado' => 'Estado',
                'created_at'           => 'Fecha Registro',
            ],
            'groupable' => [
                'id_estado' => 'estado.nombre_estado',
            ],
            'statistics' => [
                'total_records' => [
                    'label' => 'Total Tipos de Cita',
                    'type'  => 'count',
                ],
            ],
            'exportable' => ['pdf', 'excel', 'json'],
        ],
    ],
];
