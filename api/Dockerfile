FROM php:8.2-cli

# Instalar extensiones PHP necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath zip

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

# Instalar dependencias de Laravel
RUN composer install --optimize-autoloader --no-interaction --no-scripts

# Comando de inicio
CMD php artisan serve --host=0.0.0.0 --port=8080