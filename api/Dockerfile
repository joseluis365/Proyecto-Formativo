FROM php:8.2-fpm

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libpq-dev \
    nginx \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_pgsql pdo bcmath zip mbstring

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

WORKDIR /var/www/html

COPY . .

RUN composer install --optimize-autoloader --no-interaction --no-scripts \
    && chmod -R 777 storage bootstrap/cache

# Copiar configuración de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD php-fpm & nginx -g 'daemon off;'