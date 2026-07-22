FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
        git curl zip unzip \
        libpq-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN npm ci && npm run build

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache \
    && chmod +x start.sh

COPY .docker/apache.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 10000

CMD ["/var/www/html/start.sh"]
