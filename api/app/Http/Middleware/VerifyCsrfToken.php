<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

/**
 * Middleware CSRF.
 * Define excepciones y comportamiento de proteccion CSRF.
 */
class VerifyCsrfToken extends Middleware
{
    protected $except = [
        '/product',
        '/product/*'
    ];
}
