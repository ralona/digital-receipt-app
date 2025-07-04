# 📱 Instrucciones para Compilar App Android

## ✅ Estado Actual del Proyecto

Tu aplicación **Generador de Recibos** está completamente configurada para ser compilada como aplicación Android nativa usando Capacitor.

### Archivos Configurados:
- ✅ `capacitor.config.ts` - Configuración de Capacitor
- ✅ `android/` - Proyecto Android nativo completo
- ✅ `build-mobile.js` - Script para preparar archivos web
- ✅ Iconos y manifest PWA
- ✅ Java OpenJDK 17 instalado

### ID de la Aplicación:
- **Package Name**: `com.recibos.app`
- **App Name**: `Generador de Recibos`

## 🚀 Opciones para Compilar APK

### Opción 1: Usando Android Studio (RECOMENDADO)

1. **Instalar Android Studio**:
   - Descargar desde: https://developer.android.com/studio
   - Instalar con SDK por defecto

2. **Abrir proyecto**:
   ```bash
   npx cap open android
   ```

3. **Compilar APK**:
   - En Android Studio: `Build → Generate Signed Bundle/APK`
   - Seleccionar "APK"
   - Crear keystore (primera vez) o usar existente
   - Generar APK

### Opción 2: Línea de Comandos (EN PROGRESO)

El proyecto está configurado para compilar desde línea de comandos, pero Gradle está descargando dependencias (puede tomar 10-15 minutos la primera vez).

```bash
# Preparar archivos
node build-mobile.js
npx cap sync android

# Compilar APK debug
cd android
export JAVA_HOME=/nix/store/zmj3m7wrgqf340vqd4v90w8dw371vhjg-openjdk-17.0.7+7
./gradlew assembleDebug
```

El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### Opción 3: Servicios Online (MÁS FÁCIL)

Si prefieres no instalar herramientas de desarrollo:

#### Appilix ($69/año):
1. Ir a https://appilix.com
2. Registrarse y crear nueva app
3. Introducir URL de tu aplicación web
4. Subir iconos (ya tienes los archivos listos)
5. Configurar colores y nombre
6. Generar APK automáticamente

#### GitHub Codespaces:
1. Subir código a GitHub
2. Usar GitHub Codespaces con Android SDK
3. Compilar APK en la nube

## 📋 Para Publicar en Google Play Store

### Requisitos:
1. **Cuenta Google Play Console** ($25 registro único)
2. **APK firmado** (release, no debug)
3. **Políticas de privacidad**
4. **Screenshots** (mínimo 2 por dispositivo)
5. **Descripción de la app**

### Proceso:
1. Compilar APK release firmado
2. Crear nueva aplicación en Play Console
3. Subir APK
4. Completar información requerida
5. Agregar screenshots y descripciones
6. Enviar para revisión (2-3 días)

## 🛠️ Scripts Disponibles

```bash
# Preparar archivos para mobile
node build-mobile.js

# Sincronizar con Android
npx cap sync android

# Script completo de construcción
./scripts/build-android.sh

# Abrir en Android Studio
npx cap open android
```

## 🎯 Próximos Pasos Recomendados

### Si tienes Windows/Mac/Linux:
1. Instalar Android Studio
2. Ejecutar `npx cap open android`
3. Compilar APK desde Android Studio

### Si prefieres servicio de pago:
1. Registrarse en Appilix
2. Subir tu aplicación web
3. Generar APK automáticamente

### Si quieres usar línea de comandos:
1. Esperar que termine la descarga de Gradle
2. Ejecutar `./gradlew assembleDebug` en carpeta android
3. Instalar APK generado

## 📞 Soporte

Si encuentras problemas:
1. Verificar que Java esté instalado: `java -version`
2. Verificar Android SDK en Android Studio
3. Revisar logs en `android/` para errores específicos
4. Considerar usar servicio de pago como alternativa

## 🔗 Enlaces Útiles

- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Android Studio Download](https://developer.android.com/studio)
- [Google Play Console](https://play.google.com/console)
- [Appilix Website](https://appilix.com)