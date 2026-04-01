FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql pdo bcmath zip

WORKDIR /app

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

RUN composer install --optimize-autoloader --no-interaction --no-scripts

CMD php -S 0.0.0.0:8080 -t public