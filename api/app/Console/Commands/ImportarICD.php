<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Enfermedad;

class ImportarICD extends Command
{
    protected $signature = 'icd:importar {--limit= : Limitar el número de registros a importar}';
    protected $description = 'Importar todas las enfermedades desde ICD-11 MMS';

    protected $token;

    public function handle()
    {
        $limit = $this->option('limit');
        $processedCount = 0;

        // 1️⃣ Obtener token
        $this->info("Obteniendo token de acceso...");
        $this->refreshToken();

        if (!$this->token) {
            $this->error("No se pudo obtener el token.");
            return 1;
        }

        // 2️⃣ Cola para BFS (Breadth-First Search)
        // Iniciamos con la raíz de la versión MMS 2024-01
        $baseUrl = "https://id.who.int/icd/release/11/2024-01/mms";
        $queue = [$baseUrl];
        $processedUrls = [];

        $this->info("Iniciando importación masiva (BFS)...");
        $bar = $this->output->createProgressBar($limit ?: 17000);
        $bar->start();

        while (!empty($queue)) {
            $currentUrl = array_shift($queue);

            // Evitar procesar lo mismo dos veces
            if (isset($processedUrls[$currentUrl])) {
                continue;
            }

            // Realizar la petición
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->token}",
                'API-Version' => 'v2',
                'Accept' => 'application/json',
                'Accept-Language' => 'es'
            ])->get($currentUrl);

            if ($response->status() === 401) {
                // Token expirado, intentar una vez más
                $this->refreshToken();
                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$this->token}",
                    'API-Version' => 'v2',
                    'Accept' => 'application/json',
                    'Accept-Language' => 'es'
                ])->get($currentUrl);
            }

            if (!$response->successful()) {
                if ($response->status() === 404) {
                    $processedUrls[$currentUrl] = true;
                    continue;
                }
                $this->error("\nError en URL: $currentUrl (" . $response->status() . ")");
                continue;
            }

            $entity = $response->json();
            $processedUrls[$currentUrl] = true;

            // 3️⃣ Guardar en la base de datos
            // Solo guardamos si tiene código de clasificación (es una enfermedad/categoría final o sub-chapter)
            // O si es un capítulo. 
            $codigo = $entity['code'] ?? null;
            $nombre = $entity['title']['@value'] ?? 'Sin nombre';
            $descripcion = $entity['definition']['@value'] ?? null;

            if ($codigo || isset($entity['child'])) {
                Enfermedad::updateOrCreate(
                    [
                        'codigo_icd' => $codigo ?: basename($currentUrl)
                    ],
                    [
                        'nombre' => strip_tags($nombre),
                        'descripcion' => $descripcion ? strip_tags($descripcion) : null
                    ]
                );
                
                $processedCount++;
                $bar->advance();
            }

            // 4️⃣ Añadir hijos a la cola
            if (isset($entity['child'])) {
                foreach ($entity['child'] as $childUrl) {
                    // Limpieza rápida: asegurar que sea HTTPS y usar el dominio correcto
                    $childUrl = str_replace('http://id.who.int', 'https://id.who.int', $childUrl);
                    if (!isset($processedUrls[$childUrl])) {
                        $queue[] = $childUrl;
                    }
                }
            }

            // Verificar límite si existe
            if ($limit && $processedCount >= $limit) {
                break;
            }
        }

        $bar->finish();
        $this->info("\nImportación completada. Se procesaron $processedCount registros.");
        return 0;
    }

    private function refreshToken()
    {
        $response = Http::asForm()->post(
            'https://icdaccessmanagement.who.int/connect/token',
            [
                'client_id' => env('ICD_CLIENT_ID'),
                'client_secret' => env('ICD_CLIENT_SECRET'),
                'grant_type' => 'client_credentials',
                'scope' => 'icdapi_access'
            ]
        );

        $this->token = $response->json()['access_token'] ?? null;
    }
}

