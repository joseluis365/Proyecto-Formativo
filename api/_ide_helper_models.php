<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $type
 * @property string $icon
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $channel_name
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereChannelName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereUpdatedAt($value)
 */
	class Activity extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_categoria_examen
 * @property string|null $categoria
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool|null $requiere_ayuno
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen whereCategoria($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen whereIdCategoriaExamen($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen whereRequiereAyuno($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaExamen whereUpdatedAt($value)
 */
	class CategoriaExamen extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_categoria
 * @property string|null $categoria
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaMedicamento newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaMedicamento newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaMedicamento query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaMedicamento whereCategoria($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaMedicamento whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaMedicamento whereIdCategoria($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaMedicamento whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CategoriaMedicamento whereUpdatedAt($value)
 */
	class CategoriaMedicamento extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_cita
 * @property int|null $doc_paciente
 * @property int|null $doc_medico
 * @property string|null $fecha
 * @property string|null $hora_inicio
 * @property string|null $hora_fin
 * @property string|null $motivo
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool $recordatorio_enviado true cuando el recordatorio automático ya fue despachado para esta cita
 * @property string $tipo_evento
 * @property int|null $id_especialidad
 * @property int|null $id_examen
 * @property int|null $id_motivo
 * @property-read \App\Models\Especialidad|null $especialidad
 * @property-read \App\Models\Estado|null $estado
 * @property-read \App\Models\HistorialDetalle|null $historialDetalle
 * @property-read \App\Models\Usuario|null $medico
 * @property-read \App\Models\MotivoConsulta|null $motivoConsulta
 * @property-read \App\Models\Usuario|null $paciente
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereDocMedico($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereDocPaciente($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereFecha($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereHoraFin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereHoraInicio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereIdCita($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereIdEspecialidad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereIdExamen($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereIdMotivo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereMotivo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereRecordatorioEnviado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereTipoEvento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cita whereUpdatedAt($value)
 */
	class Cita extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $codigo_postal
 * @property string|null $nombre
 * @property int|null $id_departamento
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $id_estado
 * @property-read \App\Models\Departamento|null $departamento
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad whereCodigoPostal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad whereIdDepartamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ciudad whereUpdatedAt($value)
 */
	class Ciudad extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_concentracion
 * @property string|null $concentracion
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Presentacion> $presentaciones
 * @property-read int|null $presentaciones_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Concentracion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Concentracion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Concentracion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Concentracion whereConcentracion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Concentracion whereIdConcentracion($value)
 */
	class Concentracion extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_consultorio
 * @property int|null $numero_consultorio
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Consultorio newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Consultorio newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Consultorio query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Consultorio whereIdConsultorio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Consultorio whereNumeroConsultorio($value)
 */
	class Consultorio extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $codigo_DANE
 * @property string|null $nombre
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $id_estado
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Departamento newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Departamento newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Departamento query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Departamento whereCodigoDANE($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Departamento whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Departamento whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Departamento whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Departamento whereUpdatedAt($value)
 */
	class Departamento extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_dispensacion
 * @property int $id_detalle_receta
 * @property string $nit_farmacia
 * @property int|null $cantidad
 * @property string|null $fecha_dispensacion
 * @property int|null $documento_farmaceutico
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\RecetaDetalle $detalleReceta
 * @property-read \App\Models\Estado|null $estado
 * @property-read \App\Models\Usuario|null $farmaceutico
 * @property-read \App\Models\Farmacia $farmacia
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereCantidad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereDocumentoFarmaceutico($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereFechaDispensacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereIdDetalleReceta($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereIdDispensacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereNitFarmacia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dispensacion whereUpdatedAt($value)
 */
	class Dispensacion extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $nit
 * @property string $nombre
 * @property string|null $email_contacto
 * @property string|null $telefono
 * @property string|null $direccion
 * @property int|null $documento_representante
 * @property string|null $nombre_representante
 * @property string|null $telefono_representante
 * @property string|null $email_representante
 * @property int|null $id_ciudad
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Usuario|null $adminUser
 * @property-read \App\Models\Ciudad|null $ciudad
 * @property-read \App\Models\EmpresaLicencia|null $licenciaActual
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\EmpresaLicencia> $licencias
 * @property-read int|null $licencias_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereDireccion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereDocumentoRepresentante($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereEmailContacto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereEmailRepresentante($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereIdCiudad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereNit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereNombreRepresentante($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereTelefono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereTelefonoRepresentante($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereUpdatedAt($value)
 */
	class Empresa extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id_empresa_licencia
 * @property string $nit
 * @property int $id_tipo_licencia
 * @property string|null $fecha_inicio
 * @property string|null $fecha_fin
 * @property int $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Empresa $empresa
 * @property-read \App\Models\Estado $estado
 * @property-read \App\Models\Licencia $tipoLicencia
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia whereFechaFin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia whereFechaInicio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia whereIdEmpresaLicencia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia whereIdTipoLicencia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia whereNit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmpresaLicencia whereUpdatedAt($value)
 */
	class EmpresaLicencia extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $codigo_icd
 * @property string $nombre
 * @property string|null $descripcion
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Enfermedad newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Enfermedad newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Enfermedad query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Enfermedad whereCodigoIcd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Enfermedad whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Enfermedad whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Enfermedad whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Enfermedad whereUpdatedAt($value)
 */
	class Enfermedad extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_especialidad
 * @property string $especialidad
 * @property int|null $id_estado
 * @property string|null $created_at
 * @property string|null $updated_at
 * @property bool|null $acceso_directo
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad whereAccesoDirecto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad whereEspecialidad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad whereIdEspecialidad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Especialidad whereUpdatedAt($value)
 */
	class Especialidad extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_estado
 * @property string|null $nombre_estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereNombreEstado($value)
 */
	class Estado extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_examen
 * @property string $nombre
 * @property int|null $id_categoria_examen
 * @property bool|null $requiere_ayuno
 * @property string|null $descripcion
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $doc_paciente
 * @property string|null $fecha
 * @property string|null $hora_inicio
 * @property string|null $hora_fin
 * @property int|null $id_estado
 * @property string|null $resultado_pdf
 * @property-read \App\Models\CategoriaExamen|null $categoriaExamen
 * @property-read \App\Models\Estado|null $estado
 * @property-read \App\Models\Usuario|null $paciente
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereDocPaciente($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereFecha($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereHoraFin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereHoraInicio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereIdCategoriaExamen($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereIdExamen($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereRequiereAyuno($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereResultadoPdf($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Examen whereUpdatedAt($value)
 */
	class Examen extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $nit
 * @property string $nombre
 * @property string|null $direccion
 * @property string|null $telefono
 * @property string|null $email
 * @property string|null $nombre_contacto
 * @property string|null $horario_apertura
 * @property string|null $horario_cierre
 * @property bool|null $abierto_24h
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $nit_empresa
 * @property int|null $id_estado
 * @property-read \App\Models\Empresa|null $empresa
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereAbierto24h($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereDireccion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereHorarioApertura($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereHorarioCierre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereNit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereNitEmpresa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereNombreContacto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereTelefono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Farmacia whereUpdatedAt($value)
 */
	class Farmacia extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_forma
 * @property string|null $forma_farmaceutica
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Presentacion> $presentaciones
 * @property-read int|null $presentaciones_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormaFarmaceutica newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormaFarmaceutica newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormaFarmaceutica query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormaFarmaceutica whereFormaFarmaceutica($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormaFarmaceutica whereIdForma($value)
 */
	class FormaFarmaceutica extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_historial
 * @property int|null $id_paciente
 * @property string|null $antecedentes_personales
 * @property string|null $antecedentes_familiares
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $alergias
 * @property array<array-key, mixed>|null $habitos_vida
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\HistorialDetalle> $detalles
 * @property-read int|null $detalles_count
 * @property-read \App\Models\Usuario|null $paciente
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico whereAlergias($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico whereAntecedentesFamiliares($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico whereAntecedentesPersonales($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico whereHabitosVida($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico whereIdHistorial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico whereIdPaciente($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialClinico whereUpdatedAt($value)
 */
	class HistorialClinico extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_detalle
 * @property int $id_historial
 * @property int $id_cita
 * @property string|null $diagnostico
 * @property string|null $tratamiento
 * @property string|null $notas_medicas
 * @property string|null $observaciones
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $subjetivo SOAP S — Síntomas y motivo de consulta narrado por el paciente
 * @property array<array-key, mixed>|null $signos_vitales SOAP O — Hallazgos objetivos: signos vitales como JSON
 * @property-read \App\Models\Cita $cita
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Enfermedad> $enfermedades
 * @property-read int|null $enfermedades_count
 * @property-read \App\Models\HistorialClinico $historial
 * @property-read \App\Models\HistorialClinico $historialClinico
 * @property-read \App\Models\Receta|null $receta
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Remision> $remisiones
 * @property-read int|null $remisiones_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereDiagnostico($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereIdCita($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereIdDetalle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereIdHistorial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereNotasMedicas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereObservaciones($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereSignosVitales($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereSubjetivo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereTratamiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialDetalle whereUpdatedAt($value)
 */
	class HistorialDetalle extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialEnfermedad newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialEnfermedad newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialEnfermedad query()
 */
	class HistorialEnfermedad extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $id_usuario
 * @property string $tabla_relacion
 * @property int $num_registros
 * @property array<array-key, mixed>|null $ejemplo_registro
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Usuario|null $usuario
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte whereEjemploRegistro($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte whereIdUsuario($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte whereNumRegistros($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte whereTablaRelacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistorialReporte whereUpdatedAt($value)
 */
	class HistorialReporte extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_inventario
 * @property string $nit_farmacia
 * @property int $id_presentacion
 * @property int|null $stock_actual
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Farmacia $farmacia
 * @property-read \App\Models\Presentacion $presentacion
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia whereIdInventario($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia whereIdPresentacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia whereNitFarmacia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia whereStockActual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventarioFarmacia whereUpdatedAt($value)
 */
	class InventarioFarmacia extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_tipo_licencia
 * @property string $tipo
 * @property string $descripcion
 * @property int $duracion_meses
 * @property numeric $precio
 * @property int $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\EmpresaLicencia> $empresaLicencias
 * @property-read int|null $empresa_licencias_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia whereDuracionMeses($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia whereIdTipoLicencia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia wherePrecio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia whereTipo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Licencia whereUpdatedAt($value)
 */
	class Licencia extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_lote
 * @property int|null $id_presentacion
 * @property string|null $nit_farmacia
 * @property string|null $fecha_vencimiento
 * @property int|null $stock_actual
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Farmacia|null $farmacia
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MovimientoInventario> $movimientosInventario
 * @property-read int|null $movimientos_inventario_count
 * @property-read \App\Models\Presentacion|null $presentacion
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento whereFechaVencimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento whereIdLote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento whereIdPresentacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento whereNitFarmacia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento whereStockActual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteMedicamento whereUpdatedAt($value)
 */
	class LoteMedicamento extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_medicamento
 * @property string|null $nombre
 * @property string|null $descripcion
 * @property int|null $id_categoria
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CategoriaMedicamento|null $categoriaMedicamento
 * @property-read \App\Models\Estado|null $estado
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Presentacion> $presentaciones
 * @property-read int|null $presentaciones_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento whereIdCategoria($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento whereIdMedicamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Medicamento whereUpdatedAt($value)
 */
	class Medicamento extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_motivo
 * @property string|null $motivo
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MotivoConsulta newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MotivoConsulta newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MotivoConsulta query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MotivoConsulta whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MotivoConsulta whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MotivoConsulta whereIdMotivo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MotivoConsulta whereMotivo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MotivoConsulta whereUpdatedAt($value)
 */
	class MotivoConsulta extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_movimiento
 * @property int|null $id_lote
 * @property string|null $tipo_movimiento
 * @property int|null $cantidad
 * @property string|null $fecha
 * @property int|null $documento
 * @property string|null $motivo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $id_dispensacion
 * @property-read \App\Models\Dispensacion|null $dispensacion
 * @property-read \App\Models\LoteMedicamento|null $loteMedicamento
 * @property-read \App\Models\Usuario|null $usuarioDocumento
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereCantidad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereDocumento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereFecha($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereIdDispensacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereIdLote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereIdMovimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereMotivo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereTipoMovimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MovimientoInventario whereUpdatedAt($value)
 */
	class MovimientoInventario extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_pqr
 * @property string|null $nombre_usuario
 * @property string|null $email
 * @property string|null $telefono
 * @property string|null $asunto
 * @property string|null $mensaje
 * @property string|null $respuesta
 * @property int $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Estado $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereAsunto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereIdPqr($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereMensaje($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereNombreUsuario($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereRespuesta($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereTelefono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pqr whereUpdatedAt($value)
 */
	class Pqr extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_presentacion
 * @property int $id_medicamento
 * @property int $id_concentracion
 * @property int $id_forma_farmaceutica
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property numeric|null $precio_unitario
 * @property-read \App\Models\Concentracion $concentracion
 * @property-read \App\Models\FormaFarmaceutica $formaFarmaceutica
 * @property-read \App\Models\Medicamento $medicamento
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion whereIdConcentracion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion whereIdFormaFarmaceutica($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion whereIdMedicamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion whereIdPresentacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion wherePrecioUnitario($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presentacion whereUpdatedAt($value)
 */
	class Presentacion extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_prioridad
 * @property string|null $prioridad
 * @property int $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Estado $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prioridad newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prioridad newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prioridad query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prioridad whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prioridad whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prioridad whereIdPrioridad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prioridad wherePrioridad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prioridad whereUpdatedAt($value)
 */
	class Prioridad extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_receta
 * @property int $id_detalle_cita
 * @property string $fecha_vencimiento
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RecetaDetalle> $detalles
 * @property-read int|null $detalles_count
 * @property-read \App\Models\Estado|null $estado
 * @property-read \App\Models\HistorialDetalle $historialDetalle
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RecetaDetalle> $recetaDetalles
 * @property-read int|null $receta_detalles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta whereFechaVencimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta whereIdDetalleCita($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta whereIdReceta($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receta whereUpdatedAt($value)
 */
	class Receta extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_detalle_receta
 * @property int $id_receta
 * @property int $id_presentacion
 * @property string $dosis
 * @property string $frecuencia
 * @property string $duracion
 * @property string|null $observaciones
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $nit_farmacia
 * @property int|null $cantidad_dispensar
 * @property-read \App\Models\Dispensacion|null $dispensacion
 * @property-read \App\Models\Farmacia|null $farmacia
 * @property-read \App\Models\Presentacion $presentacion
 * @property-read \App\Models\Receta $receta
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereCantidadDispensar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereDosis($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereDuracion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereFrecuencia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereIdDetalleReceta($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereIdPresentacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereIdReceta($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereNitFarmacia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereObservaciones($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecetaDetalle whereUpdatedAt($value)
 */
	class RecetaDetalle extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_remision
 * @property int $id_detalle_cita
 * @property string|null $tipo_remision
 * @property int|null $id_especialidad
 * @property int|null $id_examen
 * @property int|null $id_prioridad
 * @property string $notas
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $id_categoria_examen
 * @property bool $requiere_ayuno
 * @property int|null $id_cita
 * @property-read \App\Models\CategoriaExamen|null $categoriaExamen
 * @property-read \App\Models\Cita|null $cita
 * @property-read \App\Models\Especialidad|null $especialidad
 * @property-read \App\Models\Estado|null $estado
 * @property-read \App\Models\Examen|null $examen
 * @property-read \App\Models\HistorialDetalle $historialDetalle
 * @property-read \App\Models\Prioridad|null $prioridad
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereIdCategoriaExamen($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereIdCita($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereIdDetalleCita($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereIdEspecialidad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereIdExamen($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereIdPrioridad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereIdRemision($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereNotas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereRequiereAyuno($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereTipoRemision($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Remision whereUpdatedAt($value)
 */
	class Remision extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_rol
 * @property string|null $tipo_usu
 * @property int|null $id_estado
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rol newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rol newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rol query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rol whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rol whereIdRol($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rol whereTipoUsu($value)
 */
	class Rol extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $documento
 * @property string|null $nombre
 * @property string|null $usuario
 * @property string|null $email
 * @property string $contrasena
 * @property int|null $id_rol
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin whereContrasena($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin whereDocumento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin whereIdRol($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Superadmin whereUsuario($value)
 */
	class Superadmin extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_tipo_cita
 * @property string|null $tipo
 * @property int $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool|null $acceso_directo
 * @property-read \App\Models\Especialidad|null $especialidad
 * @property-read \App\Models\Estado $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita whereAccesoDirecto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita whereIdTipoCita($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita whereTipo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoCita whereUpdatedAt($value)
 */
	class TipoCita extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_tipo_documento
 * @property string|null $tipo_documento
 * @property int|null $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Estado|null $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoDocumento newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoDocumento newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoDocumento query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoDocumento whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoDocumento whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoDocumento whereIdTipoDocumento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoDocumento whereTipoDocumento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TipoDocumento whereUpdatedAt($value)
 */
	class TipoDocumento extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $documento
 * @property string|null $primer_nombre
 * @property string|null $primer_apellido
 * @property string|null $email
 * @property string|null $telefono
 * @property string|null $direccion
 * @property string|null $sexo
 * @property \Illuminate\Support\Carbon|null $fecha_nacimiento
 * @property string|null $grupo_sanguineo
 * @property string $contrasena
 * @property string|null $registro_profesional
 * @property string $nit
 * @property int $id_rol
 * @property int $id_estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $id_especialidad
 * @property string|null $segundo_nombre
 * @property string|null $segundo_apellido
 * @property string|null $id_farmacia
 * @property bool|null $examenes
 * @property int|null $id_consultorio
 * @property int|null $id_tipo_documento
 * @property-read \App\Models\Consultorio|null $consultorio
 * @property-read \App\Models\Empresa $empresa
 * @property-read \App\Models\Especialidad|null $especialidad
 * @property-read \App\Models\Estado $estado
 * @property-read \App\Models\Farmacia|null $farmacia
 * @property-read mixed $edad
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Cita> $medicoCitas
 * @property-read int|null $medico_citas_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Cita> $pacienteCitas
 * @property-read int|null $paciente_citas_count
 * @property-read \App\Models\Rol $rol
 * @property-read \App\Models\TipoDocumento|null $tipoDocumento
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereContrasena($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereDireccion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereDocumento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereExamenes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereFechaNacimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereGrupoSanguineo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereIdConsultorio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereIdEspecialidad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereIdEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereIdFarmacia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereIdRol($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereIdTipoDocumento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereNit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario wherePrimerApellido($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario wherePrimerNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereRegistroProfesional($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereSegundoApellido($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereSegundoNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereSexo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereTelefono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Usuario whereUpdatedAt($value)
 */
	class Usuario extends \Eloquent {}
}

