#!/bin/bash

echo "🚀 Compilando Generador de Recibos para Android..."

# Paso 1: Preparar archivos web
echo "📦 Preparando archivos para mobile..."
node build-mobile.js

# Paso 2: Sincronizar con proyecto Android
echo "🔄 Sincronizando con proyecto Android..."
npx cap sync android

# Paso 3: Información para el usuario
echo ""
echo "✅ Proyecto Android listo!"
echo ""
echo "📱 Próximos pasos para compilar APK:"
echo "1. Instalar Android Studio desde: https://developer.android.com/studio"
echo "2. Ejecutar: npx cap open android"
echo "3. En Android Studio:"
echo "   - Build → Generate Signed Bundle/APK"
echo "   - Seleccionar APK"
echo "   - Crear nuevo keystore (primera vez)"
echo "   - Generar APK"
echo ""
echo "🔧 Alternativamente, puedes compilar desde línea de comandos:"
echo "cd android && ./gradlew assembleDebug"
echo ""
echo "📁 El APK se generará en: android/app/build/outputs/apk/debug/"