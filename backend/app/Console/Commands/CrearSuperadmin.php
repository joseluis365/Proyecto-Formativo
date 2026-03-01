use App\Models\Superadmin;
use Illuminate\Support\Facades\Hash;

public function handle()
{
    Superadmin::create([
        'documento'  => 999999,
        'nombre'     => 'Super Admin',
        'usuario'    => 'superadmin',
        'email'      => 'madarazeduchiha@gmail.com',
        'contrasena' => Hash::make('admin123'),
        'id_rol'     => null
    ]);

    $this->info('Superadmin creado correctamente');
}
