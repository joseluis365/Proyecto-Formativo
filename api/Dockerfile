FROM php:8.2-cli

# Instalar extensiones necesarias
RUN docker-php-ext-install bcmath pdo pdo_mysql

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --optimize-autoloader --no-interaction --no-scripts

CMD php artisan serve --host=0.0.0.0 --port=8080