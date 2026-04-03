<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Carbon::setLocale('es');

        if (env('APP_ENV') === 'production') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        \Illuminate\Support\Facades\Mail::extend('brevo', function (array $config = []) {
            return (new \Symfony\Component\Mailer\Bridge\Brevo\Transport\BrevoTransportFactory())->create(
                new \Symfony\Component\Mailer\Transport\Dsn(
                    'brevo+api',
                    'default',
                    env('BREVO_API_KEY')
                )
            );
        });
    }
}
