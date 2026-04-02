FROM php:8.2-fpm

WORKDIR /var/www/html

COPY . .

RUN apt-get update && apt-get install -y \
    nginx \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && composer install --optimize-autoloader --no-interaction --no-scripts \
    && chmod -R 777 storage bootstrap/cache

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD service php-fpm start && nginx -g 'daemon off;'