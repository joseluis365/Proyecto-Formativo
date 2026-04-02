FROM php:8.2-fpm

WORKDIR /var/www/html

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    nginx \
    libpq-dev \
    git unzip curl \
    libonig-dev \        # <-- esta línea es la clave
    && docker-php-ext-install pdo pdo_pgsql bcmath mbstring tokenizer xml ctype


# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copiar proyecto Laravel
COPY . .

# Crear carpeta de logs y symlink
RUN mkdir -p /var/www/html/storage/logs \
    && ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

# Instalar dependencias de Laravel y optimizar
RUN composer install --optimize-autoloader --no-interaction --no-scripts \
    && chmod -R 777 storage bootstrap/cache \
    && php artisan config:clear \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Copiar configuración de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Configurar PHP-FPM
RUN echo "listen = 9000" >> /usr/local/etc/php-fpm.d/zz-docker.conf

# Exponer puerto
EXPOSE 8080

RUN apt-get update && apt-get install -y procps net-tools

# Comando de inicio
CMD ps aux && netstat -tlnp && php-fpm -D && nginx -g 'daemon off;'