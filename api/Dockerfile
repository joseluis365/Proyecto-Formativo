FROM php:8.2-cli

# Instalar dependencias necesarias para extensiones
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql pdo bcmath zip

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

# Instalar dependencias de Laravel
RUN composer install --optimize-autoloader --no-interaction --no-scripts

# Comando de inicio
CMD php artisan serve --host=0.0.0.0 --port=8080