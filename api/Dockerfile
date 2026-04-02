FROM php:8.2-fpm

WORKDIR /var/www/html

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    nginx \
    libpq-dev \
    git unzip curl \
    && docker-php-ext-install pdo pdo_pgsql bcmath

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

RUN composer install --optimize-autoloader --no-interaction --no-scripts \
    && chmod -R 777 storage bootstrap/cache \
    && php artisan config:clear \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN echo "listen = 9000" >> /usr/local/etc/php-fpm.d/zz-docker.conf

EXPOSE 8080

RUN apt-get update && apt-get install -y net-tools

CMD ["nginx", "-g", "daemon off;"]