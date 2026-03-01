<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class ReportService
{
    /**
     * Obtiene los metadatos de todas las entidades configurables.
     */
    public function getEntitiesMeta(): array
    {
        $entities = config('reportables.entities', []);
        $meta = [];
        
        foreach ($entities as $key => $config) {
            $meta[$key] = $config['label'] ?? ucfirst($key);
        }

        return $meta;
    }

    /**
     * Obtiene los datos de una entidad reportable con filtros y paginación.
     */
    public function getData(string $entityKey, array $params = []): array
    {
        $config = $this->validateEntity($entityKey);
        
        $query = $this->buildBaseQuery($config);
        
        $this->applySearch($query, $config, $params['search'] ?? null);
        $this->applyFilters($query, $config, $params);
        
        $perPage = config('reportables.settings.default_pagination', 50);
        $paginator = $query->paginate($perPage);

        return [
            'entity'       => $entityKey,
            'report_title' => $config['label'],
            'meta'         => [
                'columns'    => $config['columns'],
                'has_dates'  => $config['has_timestamps'] ?? false,
                'exportable' => $config['exportable'] ?? [],
            ],
            'data'         => $paginator,
        ];
    }

    /**
     * Valida la existencia de la entidad y retorna su configuración.
     */
    private function validateEntity(string $entityKey): array
    {
        $config = config("reportables.entities.{$entityKey}");

        if (!$config) {
            throw new \InvalidArgumentException("La entidad '{$entityKey}' no está configurada como reportable.");
        }

        return $config;
    }

    /**
     * Inicializa la consulta base con relaciones y selección de columnas.
     */
    private function buildBaseQuery(array $config): Builder
    {
        $model = new $config['model'];
        $query = $model->query();

        // 1. Selección inicial de columnas de la tabla base (evitando las de relaciones con punto)
        $baseColumns = array_values(array_filter(array_keys($config['columns']), function ($col) {
            return !str_contains($col, '.');
        }));

        // 2. Asegurar que la PK esté presente
        $pk = $config['primary_key'] ?? $model->getKeyName();
        if (!in_array($pk, $baseColumns)) {
            $baseColumns[] = $pk;
        }

        // 3. Resolución y carga de relaciones
        $relations = $this->resolveRelationsFromColumns($config);
        if (!empty($relations)) {
            $query->with($relations);
            
            // Asegurar que las llaves foráneas (BelongsTo) estén en la selección para que Eloquent cargue las relaciones
            foreach ($relations as $relName) {
                try {
                    if (method_exists($model, $relName)) {
                        $relation = $model->$relName();
                        if ($relation instanceof \Illuminate\Database\Eloquent\Relations\BelongsTo) {
                            $fk = $relation->getForeignKeyName();
                            if (!in_array($fk, $baseColumns)) {
                                $baseColumns[] = $fk;
                            }
                        }
                    }
                } catch (\Throwable $e) {
                    continue;
                }
            }
        }

        // 4. Si usa id_estado para soft delete/status, asegurar su presencia
        if ($config['uses_estado'] ?? false) {
            if (!in_array('id_estado', $baseColumns)) {
                $baseColumns[] = 'id_estado';
            }
        }

        return $query->select($baseColumns);
    }

    /**
     * Resuelve las relaciones necesarias basándose en la configuración y las columnas.
     */
    private function resolveRelationsFromColumns(array $config): array
    {
        $relations = $config['relations'] ?? [];

        foreach (array_keys($config['columns']) as $column) {
            if (str_contains($column, '.')) {
                $parts = explode('.', $column);
                // El primer elemento es el nombre de la relación
                if (!in_array($parts[0], $relations)) {
                    $relations[] = $parts[0];
                }
            }
        }

        return $relations;
    }

    /**
     * Aplica búsqueda por texto usando ILIKE (PostgreSQL) o LIKE.
     */
    private function applySearch(Builder $query, array $config, ?string $searchTerm): void
    {
        if (empty($searchTerm) || empty($config['searchable'])) {
            return;
        }

        $driver = DB::getDriverName();
        $operator = ($driver === 'pgsql') ? 'ILIKE' : 'LIKE';

        $query->where(function ($q) use ($config, $searchTerm, $operator) {
            foreach ($config['searchable'] as $column) {
                $q->orWhere($column, $operator, "%{$searchTerm}%");
            }
        });
    }

    /**
     * Aplica filtros de estado y rangos de fecha.
     */
    private function applyFilters(Builder $query, array $config, array $params): void
    {
        // Filtro por id_estado
        if (($config['uses_estado'] ?? false) && isset($params['id_estado'])) {
            $query->where('id_estado', $params['id_estado']);
        }

        // Filtro por rango de fechas (solo si el modelo tiene timestamps)
        if (($config['has_timestamps'] ?? false) && !empty($params['date_from']) && !empty($params['date_to'])) {
            $query->whereBetween('created_at', [$params['date_from'], $params['date_to']]);
        }
    }

    /**
     * Exporta los datos de una entidad reportable en el formato especificado.
     */
    public function export(string $entityKey, array $params, string $format = 'pdf')
    {
        $config = $this->validateEntity($entityKey);
        
        $query = $this->buildBaseQuery($config);
        $this->applySearch($query, $config, $params['search'] ?? null);
        $this->applyFilters($query, $config, $params);

        $limit = config('reportables.settings.export_limit', 1000);
        $collection = $query->limit($limit)->get();

        if ($format === 'pdf') {
            return (new Export\PdfExportService())->generate($entityKey, $config, $collection);
        }

        throw new \InvalidArgumentException("El formato de exportación '{$format}' no está soportado.");
    }
}
