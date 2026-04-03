# 📋 INSTRUCCIONES DE CONFIGURACIÓN - GOOGLE SHEETS

## 📊 Crear la Base de Datos en Google Sheets

### Paso 1: Crear Nueva Planilla
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva planilla
3. Nómbrala: **"Eneagrama - Base de Datos"**

---

## 📑 Configurar las 3 Hojas

### HOJA 1: "Admins"

**Nombre de la hoja:** `Admins`

**Encabezados (Fila 1):**

| A | B | C | D | E |
|---|---|---|---|---|
| Email_SuperAdmin | Usuario_Admin | Pass_Admin | Email_Admin | Fecha_Alta |

**Ejemplo de datos (Fila 2 en adelante):**

| Email_SuperAdmin | Usuario_Admin | Pass_Admin | Email_Admin | Fecha_Alta |
|---|---|---|---|---|
| superadmin@sistema.com | admin01 | pass123 | admin01@empresa.com | 15/02/2026 |
| superadmin@sistema.com | admin02 | secure456 | admin02@empresa.com | 16/02/2026 |

**Nota:** Esta hoja almacena todos los administradores creados por el SuperAdmin.

---

### HOJA 2: "Usuarios"

**Nombre de la hoja:** `Usuarios`

**Encabezados (Fila 1):**

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Email_Admin | Usuario_User | Pass_User | Email_User | Nombre | Fecha_Alta | Estado |

**Ejemplo de datos (Fila 2 en adelante):**

| Email_Admin | Usuario_User | Pass_User | Email_User | Nombre | Fecha_Alta | Estado |
|---|---|---|---|---|---|---|
| admin01@empresa.com | user01 | 123456 | juan@email.com | Juan Pérez | 16/02/2026 | activo |
| admin01@empresa.com | user02 | 123456 | maria@email.com | María García | 17/02/2026 | activo |
| admin02@empresa.com | user03 | 789012 | pedro@email.com | Pedro López | 17/02/2026 | activo |

**Importante:**
- La columna `Email_Admin` vincula al usuario con su administrador
- El `Estado` puede ser: `activo` o `inactivo`

---

### HOJA 3: "Respuestas"

**Nombre de la hoja:** `Respuestas`

**Encabezados (Fila 1):**

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Admin_Email | Admin_Usuario | Fecha | Nombre | Apellido | Email_User | Respuestas | Puntajes | Perfil_Dominante |

**Ejemplo de datos (Fila 2 en adelante - se llena automáticamente al completar el test):**

| Admin_Email | Admin_Usuario | Fecha | Nombre | Apellido | Email_User | Respuestas | Puntajes | Perfil_Dominante |
|---|---|---|---|---|---|---|---|---|
| admin01@empresa.com | admin01 | 17/02/2026 | Juan | Pérez | juan@email.com | {"1":0,"2":1,...} | {"D":32,"I":28,"S":24,"C":20} | D |

**Importante:**
- Las columnas `Respuestas` y `Puntajes` contienen datos en formato JSON
- `Perfil_Dominante` puede ser: D, I, S, C o combinaciones (DI, DS, etc.)

---

## 🔧 Configurar Google Apps Script

### Paso 1: Abrir Editor de Scripts
1. En tu planilla de Google Sheets
2. Ve a **Extensiones** → **Apps Script**
3. Se abrirá el editor de Google Apps Script

### Paso 2: Copiar el Código
1. Borra cualquier código existente (generalmente `function myFunction() {}`)
2. Abre el archivo `/Informe/Codigo.gs` de este proyecto
3. Copia TODO el contenido
4. Pégalo en el editor de Apps Script
5. Haz clic en el icono de **Guardar** (💾)

### Paso 3: Nombrar el Proyecto
1. Haz clic donde dice "Proyecto sin título"
2. Nómbralo: **"Eneagrama - Backend API"**

### Paso 4: Implementar como Web App
1. Haz clic en **Implementar** (arriba a la derecha)
2. Selecciona **Nueva implementación**
3. En "Tipo", haz clic en el icono de engranaje ⚙️
4. Selecciona **Aplicación web**
5. Configura:
   - **Descripción:** "API Backend del Sistema Eneagrama"
   - **Ejecutar como:** **Yo (tu email)**
   - **Quién tiene acceso:** **Cualquier persona**
6. Haz clic en **Implementar**
7. Autoriza los permisos cuando te lo pida
8. **IMPORTANTE:** Copia la URL de la Web App que se genera
   - Ejemplo: `https://script.google.com/macros/s/ABC123.../exec`

### Paso 5: Actualizar las URLs en el Proyecto

1. Abre el archivo `/Marca.js` en tu editor
2. Busca la sección `api`:

```javascript
api: {
    gestion: "link-appscript-gestion",
    informes: "link-appscript-informes",
    Eneagrama: "link-appscript-test-Eneagrama"
}
```

3. Reemplaza los tres placeholders con la URL que copiaste:

```javascript
api: {
    gestion: "https://script.google.com/macros/s/ABC123.../exec",
    informes: "https://script.google.com/macros/s/ABC123.../exec",
    Eneagrama: "https://script.google.com/macros/s/ABC123.../exec"
}
```

**Nota:** Puedes usar la misma URL para las 3, ya que el script diferencia las acciones por parámetros.

---

## 🔐 Configurar SuperAdmin

### Cambiar Credenciales del SuperAdmin

1. Abre el archivo `/Informe/Codigo.gs` (en Apps Script)
2. Busca la función `handleLogin`, línea ~50
3. Encuentra esta sección:

```javascript
if (usuario === 'superadmin' && password === 'admin123') {
```

4. Cambia `'superadmin'` y `'admin123'` por tus credenciales deseadas:

```javascript
if (usuario === 'miusuario' && password === 'mipassword123') {
```

5. Guarda los cambios
6. **Implementa nuevamente:**
   - Haz clic en **Implementar** → **Gestionar implementaciones**
   - Haz clic en el icono de lápiz ✏️ de la implementación activa
   - Cambia la **Versión** a "Nueva versión"
   - Haz clic en **Implementar**

---

## ✅ Verificar Configuración

### Prueba Manual

1. **Probar SuperAdmin:**
   - Ve a `/inicio/index.html`
   - Selecciona "Super Administrador"
   - Ingresa tus credenciales
   - Deberías acceder al panel de SuperAdmin

2. **Crear un Admin:**
   - En el panel de SuperAdmin
   - Completa el formulario "Crear Nuevo Administrador"
   - Verifica que aparezca en la hoja "Admins" de Google Sheets

3. **Probar Admin:**
   - Cierra sesión
   - Ingresa con las credenciales del Admin que creaste
   - Deberías acceder al panel de Admin

4. **Crear un Usuario:**
   - En el panel de Admin
   - Completa el formulario "Habilitar Nuevo Usuario"
   - Verifica que aparezca en la hoja "Usuarios"

5. **Probar Usuario:**
   - Cierra sesión
   - Ingresa con las credenciales del Usuario
   - Realiza el test Eneagrama
   - Verifica que los datos aparezcan en la hoja "Respuestas"

---

## 🔄 Actualizar el Script

Si necesitas hacer cambios en el código de Apps Script:

1. Edita el código en el editor
2. Guarda (💾)
3. **Implementar nuevamente:**
   - **Implementar** → **Gestionar implementaciones**
   - Editar la implementación actual (✏️)
   - Cambiar a "Nueva versión"
   - **Implementar**

**Importante:** No cambies la URL, solo actualiza la versión.

---

## 📱 Permisos de Google

Cuando implementes por primera vez, Google te pedirá permisos:

1. Haz clic en **Revisar permisos**
2. Selecciona tu cuenta de Google
3. Si aparece "Esta app no está verificada":
   - Haz clic en "Avanzado"
   - Haz clic en "Ir a [nombre del proyecto] (no seguro)"
4. Acepta los permisos solicitados

Esto es normal para scripts personales.

---

## 🐛 Solución de Problemas

### Error: "No se puede guardar"
- Verifica que las 3 hojas tengan exactamente los nombres: `Admins`, `Usuarios`, `Respuestas`
- Los nombres son case-sensitive (mayúsculas/minúsculas importan)

### Error: "Permission denied"
- Asegúrate de que la Web App esté configurada como "Cualquier persona" puede acceder
- Vuelve a implementar el script

### Los datos no se guardan
- Abre el editor de Apps Script
- Ve a **Ejecuciones** (icono de reloj ⏰ a la izquierda)
- Revisa si hay errores en las ejecuciones recientes

### Error de CORS
- Verifica que estés usando la URL de la implementación más reciente
- La URL debe terminar en `/exec` no en `/dev`

---

## 📞 Ayuda Adicional

Para ver los logs del script:
1. En Apps Script, ve a **Ejecuciones** (⏰)
2. Haz clic en cualquier ejecución para ver detalles
3. Revisa los logs en la parte inferior

---

**¡Listo! Tu sistema Eneagrama ya está configurado y listo para usar.**

*Si todo funciona correctamente, deberías poder:*
✅ Iniciar sesión como SuperAdmin
✅ Crear Administradores
✅ Los Admins pueden crear Usuarios
✅ Los Usuarios pueden realizar el test
✅ Todos pueden ver los informes correspondientes
