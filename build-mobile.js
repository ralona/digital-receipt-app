#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

async function buildForMobile() {
  console.log('🚀 Preparando archivos para Capacitor...');

  // Crear directorio dist/public si no existe
  await fs.mkdir('dist/public', { recursive: true });

  // Verificar si existe el build de Vite
  let htmlContent;
  try {
    // Intentar copiar desde el build de Vite
    htmlContent = await fs.readFile('dist/index.html', 'utf8');
    console.log('✅ Usando build de Vite');
    
    // Copiar todos los archivos del build
    await fs.cp('dist', 'dist/public', { recursive: true, force: true });
    
    // Ajustar las rutas para Capacitor
    htmlContent = htmlContent
      .replace(/src="\/assets\//g, 'src="./assets/')
      .replace(/href="\/assets\//g, 'href="./assets/')
      .replace(/\/uploads\//g, './assets/');
    
    await fs.writeFile('dist/public/index.html', htmlContent);
    
  } catch (error) {
    console.log('⚠️  Build de Vite no encontrado, usando HTML básico');
    // Fallback al HTML básico
    htmlContent = await fs.readFile('client/index.html', 'utf8');
    
    // Modificar el HTML para que funcione como aplicación independiente
    const mobileHtml = htmlContent
      .replace('src="/src/main.tsx"', 'src="./assets/main.js"')
      .replace('/uploads/', './assets/');

    await fs.writeFile('dist/public/index.html', mobileHtml);

    // Crear archivo JavaScript básico para la app
    const jsContent = `
// Capacitor Mobile App Entry Point
console.log('Generador de Recibos - Mobile App Starting...');

// Básico para que la app funcione
document.addEventListener('DOMContentLoaded', function() {
  // La app se cargará usando el webview
  console.log('App loaded successfully');
});
`;

    await fs.mkdir('dist/public/assets', { recursive: true });
    await fs.writeFile('dist/public/assets/main.js', jsContent);
  }

  // Copiar iconos y manifest
  try {
    await fs.copyFile('uploads/manifest.json', 'dist/public/manifest.json');
    await fs.copyFile('uploads/icon-192x192.png', 'dist/public/icon-192x192.png');
    await fs.copyFile('uploads/icon-512x512.png', 'dist/public/icon-512x512.png');
    await fs.copyFile('uploads/icon.svg', 'dist/public/icon.svg');
    console.log('✅ Iconos y manifest copiados');
  } catch (error) {
    console.log('⚠️  Algunos archivos no se pudieron copiar:', error.message);
  }

  console.log('✅ Archivos preparados para Capacitor en dist/public/');
  console.log('📱 Ejecuta: npx cap sync android');
}

buildForMobile().catch(console.error);