FROM php:8.2-fpm

WORKDIR /var/www/html


RUN apt-get update && apt-get install -y pkg-config \
    nginx \
    libpq-dev \
    git unzip curl \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql bcmath mbstring xml ctype



RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


COPY . .


RUN mkdir -p storage/logs \
    && ln -sf /dev/stderr storage/logs/laravel.log


RUN composer install --optimize-autoloader --no-interaction --no-scripts \
    && chmod -R 777 storage bootstrap/cache \
    && php artisan config:clear \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache


COPY ./nginx.conf /etc/nginx/conf.d/default.conf


RUN echo "listen = 9000" >> /usr/local/etc/php-fpm.d/zz-docker.conf


EXPOSE 8080

RUN apt-get update && apt-get install -y procps net-tools


CMD php artisan migrate --force && php artisan db:seed --force && ps aux && netstat -tlnp && php-fpm -D && nginx -g 'daemon off;'