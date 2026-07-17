# TrendGear Dashboard — De la Data Sintética a la Web Funcional

Panel de clientes para **TrendGear** (tienda tecnológica ficticia), construido en tres fases: ingeniería de datos sintéticos, maquetación asistida por IA e integración con Firebase Realtime Database.

## 📁 Estructura del proyecto

```
├── muestra_trendgear.psv       # Fase I · Paso 1-2: muestra base (15 registros, formato PSV)
├── generar_dataset.py          # Fase I · Paso 3: script de one-shot prompting (escala la muestra)
├── dataset_trendgear.csv       # Fase I · Paso 4: dataset final validado (100 registros)
├── data_firebase_seed.json     # Dataset convertido a JSON para importar en Firebase
├── index.html                  # Fase II: estructura (header / main / footer)
├── styles.css                  # Fase II: sistema visual TrendGear
├── script.js                   # Fase III: fetch a Firebase + renderizado dinámico
└── README.md
```

## 🧠 Prompts utilizados con la IA

### 1. Priming (validación de capacidad)

> "Actuá como un desarrollador frontend senior. ¿Podés escribir el código de un sitio web atractivo si te explico con detalle cómo quiero que se vea y se comporte?"

### 2. Meta-prompting (formato de instrucciones)

> "Antes de que te dé las especificaciones del diseño, decime: ¿cuál es el mejor formato para entregarte las instrucciones de manera que generes un resultado profesional y no genérico?"

*(La IA respondió pidiendo 7 puntos: estructura, esquema de colores, tipografía, navegación, elementos interactivos, imágenes/medios y estrategia responsive — que fueron cubiertos en el prompt final de diseño.)*

### 3. Prompt final de diseño (aplicando los 7 requisitos)

> "Necesito un dashboard llamado 'TrendGear' para visualizar clientes de una tienda de tecnología. Especificaciones:
> - **Estructura:** header con logo y navegación, main con KPIs y una tabla de clientes, footer con conteo de registros.
> - **Colores:** fondo oscuro #1E1E1E, acento azul #007BFF para botones y elementos interactivos.
> - **Tipografía:** Roboto para todo el texto, Roboto Mono para valores numéricos.
> - **Navegación:** menú que colapsa en 'hamburguesa' en pantallas menores a 760px.
> - **Interactividad:** buscador de clientes por nombre/ciudad, hover en filas de la tabla, botón de actualizar datos.
> - **Responsive:** mobile-first, tabla con scroll horizontal en pantallas chicas.
> - **Arquitectura:** entregame el código en tres archivos separados (HTML, CSS y JS), sin frameworks, para poder inyectar después los datos de Firebase sin tocar la estructura visual."

### 4. One-shot prompting (generación del dataset)

> "Tomá esta muestra de 15 registros como ejemplo de formato y estilo [muestra adjunta en PSV]. Generá un script de Python que produzca 100 registros sintéticos adicionales, respetando el mismo esquema de 11 columnas, con distribuciones realistas (edades en campana entre 18-55 años, montos coherentes con el tipo de producto, fechas de compra anteriores o iguales al último login, sin duplicar IDs)."

### 5. Depuración asistida (Fase III)

> "El fetch a Firebase no está mostrando datos en la tabla, la consola muestra este error: `[pegar error]`. Acá está el fragmento de script.js relevante: `[pegar código]`. ¿Qué está mal?"

## ✅ Checklist de validación aplicado al dataset

- [x] IDs únicos sin duplicados
- [x] Edades entre 13 y 100
- [x] Montos ≥ 0
- [x] Fechas en formato ISO (`YYYY-MM-DD`)
- [x] `purchase_date` ≤ `last_login_date`, sin fechas futuras
- [x] Categorías normalizadas (`Credit Card`, `Debit Card`, `PayPal`)
- [x] Correos con dominio seguro (`mailinator.com`)

## 🔧 Cómo correrlo

1. Descargá los 7 archivos en la misma carpeta.
2. Creá un proyecto en [Firebase Console](https://console.firebase.google.com) → Realtime Database.
3. Importá `data_firebase_seed.json` bajo el nodo `clientes`.
4. En Rules, habilitá lectura pública para el prototipo:
   ```json
   { "rules": { ".read": true, ".write": false } }
   ```
5. Confirmá que `FIREBASE_URL` en `script.js` apunte a tu proyecto:
   ```
   https://TU-PROYECTO-default-rtdb.firebaseio.com/clientes.json
   ```
6. Abrí `index.html` en el navegador.

## 📊 Stack técnico

- HTML5 / CSS3 (sin frameworks)
- JavaScript vanilla (fetch, template literals, DOM API)
- Firebase Realtime Database
- Python 3 (generación de dataset sintético)
