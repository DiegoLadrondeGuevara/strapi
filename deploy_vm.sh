#!/bin/bash
set -e

echo "🚀 Iniciando proceso de despliegue de Strapi en EC2..."

# 1. Verificación Fuerte de Variables de Entorno (Validación de Arquitectura S3 Option B)
echo "🔍 Verificando variables vitales de entorno en .env..."
if [ -f ".env" ]; then
    if ! grep -q "CLOUDFRONT_URL" .env || ! grep -q "S3_BUCKET" .env; then
      echo "⚠️  ADVERTENCIA: CLOUDFRONT_URL o S3_BUCKET no encontrados en el archivo .env."
      echo "Si faltan, el sistema de carpetas 1:1 de S3 fallará para el equipo de Marketing."
      sleep 3
    else
      echo "✅ Variables CLOUDFRONT_URL y S3_BUCKET localizadas."
    fi
else
    echo "⚠️  ADVERTENCIA: No se encontró un archivo .env en la ruta actual. Asegúrate de crearlo a partir de .env.example"
    sleep 3
fi

# 2. Re-construcción del Admin de Strapi
echo "📦 Preparando y empaquetando el admin (npm run build)..."
npm install --production
npm run build

# 3. Instalación de Nginx Configuration
echo "🌐 Transfiriendo archivo strapi.conf a Nginx..."
sudo cp strapi.conf /etc/nginx/sites-available/strapi.conf

echo "🔗 Configurando Symlink en sites-enabled..."
if [ ! -f /etc/nginx/sites-enabled/strapi.conf ]; then
    sudo ln -s /etc/nginx/sites-available/strapi.conf /etc/nginx/sites-enabled/
fi

# Eliminar configuración por defecto que bloquea el puerto 80
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️  Eliminando default bloqueante de Nginx..."
    sudo rm /etc/nginx/sites-enabled/default
fi

# 4. Validar Sintaxis Reiniciar Nginx Protectivamente
echo "🔄 Recargando configuración de capa de red..."
sudo nginx -t
sudo systemctl restart nginx
echo "✅ Nginx reiniciado con éxito apoyando 100MB max_body_size."

# 5. Arranque en Background (con PM2)
echo "⚡ Reiniciando el motor Node.js de Strapi mediante pm2..."
# Detecta pm2 o lo sugiere
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 no está instalado globalmente. Instalando..."
    sudo npm install -g pm2
fi

if pm2 status | grep -q "strapi"; then
  echo "♻️  Strapi ya estaba corriendo; reciclando instancia..."
  pm2 restart strapi
else
  echo "▶️  Strapi arrancando por primera vez en PM2..."
  pm2 start npm --name "strapi" -- run start
  pm2 save
fi

echo "========================================"
echo "🎉 ¡Despliegue Listado! Tu entorno EC2 está vivo y ruteando por HTTP (Puerto 80)"
echo "========================================"
