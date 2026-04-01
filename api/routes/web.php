<?php

/*
|--------------------------------------------------------------------------
| Rutas Web
|--------------------------------------------------------------------------
| Rutas HTTP de tipo web (renderizado de vistas Blade).
| En este proyecto se usan de forma minima; la mayor parte vive en api.php.
*/
use App\Models\Product;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
