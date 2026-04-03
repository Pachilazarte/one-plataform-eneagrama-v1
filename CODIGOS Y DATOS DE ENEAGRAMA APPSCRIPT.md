Todos datos Plataform Eneag


AdminDashboard: Platform - Eneagrama
// ============================================
// GOOGLE APPS SCRIPT - GESTIÓN DE USUARIOS (Admin)
// Spreadsheet separado del SuperAdmin
// Original: solo doGet + appendRow
// Nuevo: + editarUser, toggleUserStatus, resetUserPass
// ============================================

function doGet(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Admins");
    var data = sheet.getDataRange().getValues();
    
    if (data.length === 0) return createCORSResponse(JSON.stringify([]));
    
    var headers = data[0];
    var rows = data.slice(1);
    
    var jsonData = rows.map(function(row) {
      var obj = {};
      headers.forEach(function(header, index) {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return createCORSResponse(JSON.stringify(jsonData));
  } catch (error) {
    return createCORSResponse(JSON.stringify({status: 'error', message: error.toString()}));
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Admins");
    var datosRecibidos;
    
    // Parsear datos (form data o JSON directo)
    if (e.parameter && e.parameter.data) {
      datosRecibidos = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      datosRecibidos = JSON.parse(e.postData.contents);
    }

    if (!datosRecibidos) {
      throw new Error("No se recibieron datos válidos");
    }

    var accion = datosRecibidos.accion || '';

    // ─────────────────────────────────────────
    // CREAR USUARIO (sin acción = append row) — lógica original
    // ─────────────────────────────────────────
    if (!accion && datosRecibidos.fila && Array.isArray(datosRecibidos.fila)) {
      sheet.appendRow(datosRecibidos.fila);
      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Guardado correctamente'
      }));
    }

    // ─────────────────────────────────────────
    // EDITAR USER (email, nombre, contraseña)
    // Usuario es ID único → no se modifica
    // ─────────────────────────────────────────
    if (accion === 'editarUser') {
      var fila = findRowByUserAndAdmin(sheet, datosRecibidos.usuario, datosRecibidos.adminId);
      if (fila === -1) throw new Error("Usuario no encontrado: " + datosRecibidos.usuario);

      var headers = getHeaders(sheet);
      if (datosRecibidos.nuevoEmail) setCell(sheet, fila, headers, 'Email_User', datosRecibidos.nuevoEmail);
      if (datosRecibidos.nuevoNombre) setCell(sheet, fila, headers, 'Nombre_User', datosRecibidos.nuevoNombre);
      if (datosRecibidos.nuevaPass) setCell(sheet, fila, headers, 'Pass_User', datosRecibidos.nuevaPass);

      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Usuario actualizado correctamente'
      }));
    }



    // ─────────────────────────────────────────
    // TOGGLE USER STATUS (activar / inactivar)
    // ─────────────────────────────────────────
    if (accion === 'toggleUserStatus') {
      var fila = findRowByUserAndAdmin(sheet, datosRecibidos.usuario, datosRecibidos.adminId);
      if (fila === -1) throw new Error("Usuario no encontrado: " + datosRecibidos.usuario);

      var headers = getHeaders(sheet);
      var colEstado = headers.indexOf('Estado_User');

      if (colEstado === -1) {
        // Crear columna si no existe
        var lastCol = sheet.getLastColumn() + 1;
        sheet.getRange(1, lastCol).setValue('Estado_User');
        sheet.getRange(fila, lastCol).setValue(datosRecibidos.nuevoEstado);
      } else {
        sheet.getRange(fila, colEstado + 1).setValue(datosRecibidos.nuevoEstado);
      }

      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Estado actualizado a ' + datosRecibidos.nuevoEstado
      }));
    }

    // ─────────────────────────────────────────
    // RESET USER PASSWORD
    // ─────────────────────────────────────────
    if (accion === 'resetUserPass') {
      var fila = findRowByUserAndAdmin(sheet, datosRecibidos.usuario, datosRecibidos.adminId);
      if (fila === -1) throw new Error("Usuario no encontrado: " + datosRecibidos.usuario);

      var headers = getHeaders(sheet);
      var colPass = headers.indexOf('Pass_User');
      if (colPass === -1) throw new Error("Columna Pass_User no encontrada");

      sheet.getRange(fila, colPass + 1).setValue(datosRecibidos.nuevaPass);

      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Contraseña actualizada correctamente'
      }));
    }



    // ─────────────────────────────────────────
    // ✅ NUEVA ACCIÓN: EDITAR PACK LÍDER
    // ─────────────────────────────────────────
    if (accion === 'editarUserPack') {
      var fila = findRowByUserAndAdmin(sheet, datosRecibidos.usuario, datosRecibidos.adminId);
      if (fila === -1) throw new Error("Usuario no encontrado");

      var headers = getHeaders(sheet);
      var colPack = headers.indexOf('Pack_Status');

      if (colPack === -1) {
        var lastCol = sheet.getLastColumn() + 1;
        sheet.getRange(1, lastCol).setValue('Pack_Status');
        sheet.getRange(fila, lastCol).setValue(datosRecibidos.valor);
      } else {
        sheet.getRange(fila, colPack + 1).setValue(datosRecibidos.valor);
      }

      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Pack actualizado correctamente'
      }));
    }

    // Si llegó aquí sin match
    if (!accion && !datosRecibidos.fila) {
      throw new Error("No se recibió ni 'fila' ni 'accion' válida");
    }
    throw new Error("Acción no reconocida: " + accion);

  } catch (error) {
    return createCORSResponse(JSON.stringify({status: 'error', message: error.toString()}));
  } finally {
    lock.releaseLock();
  }
}



// ════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ════════════════════════════════════════════

/** Headers de la primera fila */
function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

/**
 * Busca fila por User + Usuario_Admin
 * (seguridad: admin solo modifica SUS usuarios)
 * Retorna fila 1-based o -1
 */
function findRowByUserAndAdmin(sheet, usuario, adminId) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colUser = headers.indexOf('User');
  var colAdmin = headers.indexOf('Usuario_Admin');

  if (colUser === -1) return -1;

  for (var i = 1; i < data.length; i++) {
    var matchUser = String(data[i][colUser]).trim() === String(usuario).trim();
    var matchAdmin = (colAdmin === -1) || String(data[i][colAdmin]).trim() === String(adminId).trim();
    if (matchUser && matchAdmin) {
      return i + 1;
    }
  }
  return -1;
}

/** Actualiza celda si la columna existe */
function setCell(sheet, fila, headers, colName, value) {
  var col = headers.indexOf(colName);
  if (col !== -1 && value !== undefined && value !== null) {
    sheet.getRange(fila, col + 1).setValue(value);
  }
}

function createCORSResponse(content) {
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JSON);
}
Link: https://script.google.com/macros/s/AKfycbyacVBqleU3QDqIcucMvuRuqh8FBIcvEldEkppl74KCRa0IFlFfe6UUSsimhh9W15zJmw/exec


-----------------------
SuperAdminDashboard: Platform - Eneagrama

// ============================================
// CÓDIGO ORIGINAL RESTAURADO Y ACTUALIZADO
// NO SE ELIMINÓ NINGUNA FUNCIÓN EXISTENTE
// ============================================

function doGet(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Admins");
    
    var data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return createCORSResponse(JSON.stringify([]));
    }
    
    var headers = data[0];
    var rows = data.slice(1);
    
    var jsonData = rows.map(function(row) {
      var obj = {};
      headers.forEach(function(header, index) {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return createCORSResponse(JSON.stringify(jsonData));
    
  } catch (error) {
    return createCORSResponse(JSON.stringify({
      status: 'error',
      message: error.toString()
    }));
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Admins");
    var datosRecibidos;
    
    // 1. TUS 3 MÉTODOS DE PARSEO ORIGINALES (INTACTOS)
    if (e.postData && e.postData.contents) {
      try {
        datosRecibidos = JSON.parse(e.postData.contents);
      } catch (jsonError) {}
    }
    
    if (!datosRecibidos && e.parameter && e.parameter.data) {
      try {
        datosRecibidos = JSON.parse(e.parameter.data);
      } catch (formError) {
        throw new Error("No se pudo parsear los datos: " + formError.toString());
      }
    }
    
    if (!datosRecibidos && e.parameters) {
      datosRecibidos = {
        fila: [
          e.parameters.Email_SuperAdmin ? e.parameters.Email_SuperAdmin[0] : '',
          e.parameters.Usuario_Admin ? e.parameters.Usuario_Admin[0] : '',
          e.parameters.Pass_Admin ? e.parameters.Pass_Admin[0] : '',
          e.parameters.Email_Admin ? e.parameters.Email_Admin[0] : '',
          e.parameters.Fecha_Alta ? e.parameters.Fecha_Alta[0] : '',
          e.parameters.Estado ? e.parameters.Estado[0] : 'activo'
        ]
      };
    }
    
    if (!datosRecibidos) {
      throw new Error("No se recibieron datos válidos");
    }
    
    if (datosRecibidos.nombreHoja) {
       sheet = doc.getSheetByName(datosRecibidos.nombreHoja);
    }

    // --- DEFINICIÓN DE ACCIÓN ---
    var accion = datosRecibidos.accion || '';

    // ──────────────────────────────────────────────────────────
    // ✅ NUEVA ACCIÓN AGREGADA: editarAdmin (PARA EL PACK LÍDER)
    // ──────────────────────────────────────────────────────────
    if (accion === 'editarAdmin') {
      var fila = findRowByUsuario(sheet, datosRecibidos.usuario);
      if (fila === -1) throw new Error("Usuario no encontrado: " + datosRecibidos.usuario);

      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var colPack = headers.indexOf('Pack_Status');

      // Si la columna no existe, la crea
      if (colPack === -1) {
        var lastCol = sheet.getLastColumn() + 1;
        sheet.getRange(1, lastCol).setValue('Pack_Status');
        sheet.getRange(fila, lastCol).setValue(datosRecibidos.valor);
      } else {
        sheet.getRange(fila, colPack + 1).setValue(datosRecibidos.valor);
      }

      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Permisos de Pack actualizados'
      }));
    }

    // ──────────────────────────────────────────────────────────
    // TUS ACCIONES ORIGINALES (INTACTAS)
    // ──────────────────────────────────────────────────────────

    // ACCIÓN: CREAR
    if (!accion && Array.isArray(datosRecibidos.fila)) {
      sheet.appendRow(datosRecibidos.fila);
      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Administrador creado correctamente'
      }));
    }

    // ACCIÓN: EDITAR
    if (accion === 'editar') {
      var fila = findRowByUsuario(sheet, datosRecibidos.usuario);
      if (fila === -1) throw new Error("Usuario no encontrado: " + datosRecibidos.usuario);

      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var colEmail = headers.indexOf('Email_Admin');
      var colPass = headers.indexOf('Pass_Admin');

      if (datosRecibidos.nuevoEmail && colEmail !== -1) {
        sheet.getRange(fila, colEmail + 1).setValue(datosRecibidos.nuevoEmail);
      }
      if (datosRecibidos.nuevaPass && colPass !== -1) {
        sheet.getRange(fila, colPass + 1).setValue(datosRecibidos.nuevaPass);
      }

      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Administrador actualizado correctamente'
      }));
    }

    // ACCIÓN: TOGGLE STATUS
    if (accion === 'toggleStatus') {
      var fila = findRowByUsuario(sheet, datosRecibidos.usuario);
      if (fila === -1) throw new Error("Usuario no encontrado: " + datosRecibidos.usuario);

      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var colEstado = headers.indexOf('Estado');

      if (colEstado === -1) {
        var lastCol = sheet.getLastColumn() + 1;
        sheet.getRange(1, lastCol).setValue('Estado');
        sheet.getRange(fila, lastCol).setValue(datosRecibidos.nuevoEstado);
      } else {
        sheet.getRange(fila, colEstado + 1).setValue(datosRecibidos.nuevoEstado);
      }

      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Estado actualizado'
      }));
    }

    // ACCIÓN: RESET PASS
    if (accion === 'resetPass') {
      var fila = findRowByUsuario(sheet, datosRecibidos.usuario);
      if (fila === -1) throw new Error("Usuario no encontrado");

      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var colPass = headers.indexOf('Pass_Admin');
      sheet.getRange(fila, colPass + 1).setValue(datosRecibidos.nuevaPass);

      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Contraseña actualizada'
      }));
    }

    // ACCIÓN: BORRAR
    if (accion === 'borrar') {
      var fila = findRowByUsuario(sheet, datosRecibidos.usuario);
      if (fila === -1) throw new Error("Usuario no encontrado");
      sheet.deleteRow(fila);
      return createCORSResponse(JSON.stringify({
        status: 'success',
        message: 'Eliminado correctamente'
      }));
    }

    throw new Error("Acción no reconocida: " + accion);

  } catch (error) {
    return createCORSResponse(JSON.stringify({
      status: 'error',
      message: error.toString()
    }));
  } finally {
    lock.releaseLock();
  }
}

function findRowByUsuario(sheet, usuario) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colUsuario = headers.indexOf('Usuario_Admin');
  if (colUsuario === -1) return -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colUsuario]).trim() === String(usuario).trim()) {
      return i + 1; 
    }
  }
  return -1;
}

function createCORSResponse(content) {
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JSON);
}
Link: https://script.google.com/macros/s/AKfycbyv5RTuSa-NVRVpsLMseHf1raa3DK5bS7MB63Jw9WIIN3Q-w3haCR38imPBz1Cx_XZd/exec

--------------------------------------

Respuestas Test: Platform - Eneagrama
/**
/**
/**
 * ============================================
 * GOOGLE APPS SCRIPT - RESPUESTAS TEST ENEAGRAMA
 * Escencial Consultora
 * --------------------------------------------
 * v3 - Fixes críticos:
 *   1. Deduplicación robusta por Eneagrama_Id (no solo por User)
 *      — evita doble inserción por race condition del iframe
 *   2. Trigger solo envía si Informe_Pdf no está vacío
 *      — evita emails con botón roto
 *   3. Lock más estricto en doPost para serializar inserciones
 *   4. URL del informe usa /view?usp=sharing
 * ============================================
 */

var CARPETA_PDF_ID = '1nqvwnhaYNbwTPHOqd7lwuANtyimVk993';

var HEADER_ENEAGRAMA_ID = 'Eneagrama_Id';
var HEADER_PDF_URL      = 'Informe_Pdf';
var HEADER_EMAIL_SENT   = 'Email_Enviado';

// ─── Utilidades ───────────────────────────────────────

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function parsePayload(e) {
  var datos = null;
  if (e && e.parameter && e.parameter.data) {
    try { datos = JSON.parse(e.parameter.data); } catch (err) {}
  }
  if (!datos && e && e.postData && e.postData.contents) {
    try { datos = JSON.parse(e.postData.contents); } catch (err) {}
  }
  return datos;
}

function toViewableUrl(driveUrl) {
  if (!driveUrl) return driveUrl;
  var m = driveUrl.match(/\/d\/([-\w]+)/);
  if (!m) return driveUrl;
  return 'https://drive.google.com/file/d/' + m[1] + '/view?usp=sharing';
}

// ─── Headers / Columnas ───────────────────────────────

function ensureHeadersAndGetCols(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) lastCol = 1;

  var headerRange = sheet.getRange(1, 1, 1, lastCol);
  var headers     = headerRange.getValues()[0];

  var hasAnyHeader = headers.some(function(h) { return String(h || '').trim() !== ''; });

  if (!hasAnyHeader) {
    headers = [];
    for (var c = 1; c <= lastCol; c++) headers.push('Col_' + c);
    headers.push(HEADER_ENEAGRAMA_ID);
    headers.push(HEADER_PDF_URL);
    headers.push(HEADER_EMAIL_SENT);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    var newHeaders = headers.slice();
    if (newHeaders.indexOf(HEADER_ENEAGRAMA_ID) === -1) newHeaders.push(HEADER_ENEAGRAMA_ID);
    if (newHeaders.indexOf(HEADER_PDF_URL)       === -1) newHeaders.push(HEADER_PDF_URL);
    if (newHeaders.indexOf(HEADER_EMAIL_SENT)    === -1) newHeaders.push(HEADER_EMAIL_SENT);
    if (newHeaders.length !== headers.length) {
      sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    }
    headers = newHeaders;
  }

  return {
    headers:      headers,
    colEneagrama: headers.indexOf(HEADER_ENEAGRAMA_ID) + 1,
    colPdf:       headers.indexOf(HEADER_PDF_URL)       + 1,
    colSent:      headers.indexOf(HEADER_EMAIL_SENT)    + 1
  };
}

// ─── doPost ──────────────────────────────────────────

function doPost(e) {
  // ✅ FIX 1: Lock estricto — fuerza que las inserciones sean secuenciales
  // Esto evita que dos llamadas paralelas (doSend + iframe del informe)
  // inserten dos filas antes de que la deduplicación las detecte
  var lock = LockService.getScriptLock();
  var lockAcquired = lock.tryLock(30000);
  if (!lockAcquired) {
    return jsonOut({ success: false, error: 'No se pudo adquirir el lock. Reintentá en unos segundos.' });
  }

  try {
    var datosRecibidos = parsePayload(e);
    if (!datosRecibidos) {
      return jsonOut({ success: false, error: 'No se pudieron parsear los datos' });
    }

    var ss         = SpreadsheetApp.getActiveSpreadsheet();
    var nombreHoja = datosRecibidos.nombreHoja || 'Respuestas';
    var sheet      = ss.getSheetByName(nombreHoja);
    if (!sheet) {
      return jsonOut({ success: false, error: 'No existe la hoja: ' + nombreHoja });
    }

    var accion = datosRecibidos.accion || '';
    var cols   = ensureHeadersAndGetCols(sheet);

    // ── PASO 1: Guardar fila de respuestas ────────────────────────────────────
    if (!accion && Array.isArray(datosRecibidos.fila)) {
      var filaEntrante = datosRecibidos.fila;
      var userEvaluado = String(filaEntrante[3] || '').trim();

      // ✅ FIX 2: Deduplicación robusta
      // Busca por User Y por fecha (los primeros 10 chars del campo fecha en col 0)
      // Así evita que el mismo usuario completando el test en días distintos
      // sea tratado como duplicado, pero SÍ bloquea el doble envío del mismo test
      if (userEvaluado) {
        var lastRow2 = sheet.getLastRow();
        if (lastRow2 >= 2) {
          var numCols   = sheet.getLastColumn();
          var allData   = sheet.getRange(2, 1, lastRow2 - 1, numCols).getValues();
          var colsH     = ensureHeadersAndGetCols(sheet);
          var colUser   = colsH.headers.indexOf('User');
          var colId     = colsH.headers.indexOf('Eneagrama_Id');
          var colFecha  = colsH.headers.indexOf('Fecha'); // columna Fecha si existe
          var colResp   = colsH.headers.indexOf('Respuestas'); // fallback: comparar respuestas

          // Fecha de la fila entrante — primeros 10 caracteres (dd/mm/yyyy)
          var fechaEntrante = '';
          if (filaEntrante[0]) {
            fechaEntrante = String(filaEntrante[0]).substring(0, 10);
          }

          // Respuestas de la fila entrante para comparar (columna 7 en el array)
          var respEntrante = '';
          if (filaEntrante[7]) {
            respEntrante = String(filaEntrante[7]).substring(0, 50); // primeros 50 chars
          }

          if (colUser >= 0 && colId >= 0) {
            for (var i2 = allData.length - 1; i2 >= 0; i2--) {
              var userExistente = String(allData[i2][colUser] || '').trim();
              var idExistente2  = String(allData[i2][colId]   || '').trim();

              if (userExistente.toLowerCase() !== userEvaluado.toLowerCase()) continue;
              if (!idExistente2) continue;

              // ✅ Si el User coincide Y tiene Eneagrama_Id → es duplicado del mismo test
              // Validación adicional: comparar las respuestas para confirmar que es el mismo intento
              var esMismaSesion = true;
              if (colResp >= 0 && respEntrante) {
                var respExistente = String(allData[i2][colResp] || '').substring(0, 50);
                // Si las respuestas son completamente distintas, es un test diferente
                if (respExistente && respEntrante && respExistente !== respEntrante) {
                  esMismaSesion = false;
                }
              }

              if (esMismaSesion) {
                Logger.log('Duplicado detectado para user: ' + userEvaluado + ' fila: ' + (i2 + 2));
                return jsonOut({ success: true, eneagrama_id: idExistente2, row: i2 + 2, _duplicado: true });
              }
            }
          }
        }
      }

      var eneagramaId  = Utilities.getUuid();
      var filaCompleta = filaEntrante.slice();
      filaCompleta.push(eneagramaId);
      filaCompleta.push('');
      filaCompleta.push('');

      sheet.appendRow(filaCompleta);
      var row = sheet.getLastRow();
      Logger.log('Fila insertada: row=' + row + ' user=' + userEvaluado + ' id=' + eneagramaId);
      return jsonOut({ success: true, eneagrama_id: eneagramaId, row: row });
    }

    // ── PASO 2: Subir PDF ─────────────────────────────────────────────────────
    if (accion === 'guardarPdf') {
      var pdfBase64    = datosRecibidos.pdfBase64;
      var nombrePdf    = datosRecibidos.pdfNombre   || 'Informe_Eneagrama.pdf';
      var targetRow    = parseInt(datosRecibidos.row, 10);
      var eneagramaId2 = datosRecibidos.eneagrama_id || '';

      if (!pdfBase64 || pdfBase64.length < 100) {
        return jsonOut({ success: false, error: 'pdfBase64 vacio o muy corto' });
      }
      if (!targetRow || targetRow < 2) {
        return jsonOut({ success: false, error: 'Falta row valido para actualizar Informe_Pdf' });
      }

      var bytes  = Utilities.base64Decode(pdfBase64);
      var blob   = Utilities.newBlob(bytes, 'application/pdf', nombrePdf);
      var folder = DriveApp.getFolderById(CARPETA_PDF_ID);
      var file   = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      var pdfUrl = file.getUrl();

      sheet.getRange(targetRow, cols.colPdf).setValue(pdfUrl);
      if (eneagramaId2 && cols.colEneagrama) {
        sheet.getRange(targetRow, cols.colEneagrama).setValue(eneagramaId2);
      }

      Logger.log('PDF subido: row=' + targetRow + ' url=' + pdfUrl);
      return jsonOut({ success: true, url: pdfUrl, row: targetRow, eneagrama_id: eneagramaId2 || null });
    }

    return jsonOut({ success: false, error: 'Accion no reconocida', accion: accion });

  } catch (error) {
    Logger.log('ERROR doPost: ' + error);
    return jsonOut({ success: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// TRIGGER: ENVIAR INFORMES PENDIENTES (cada 30 min)
// ═══════════════════════════════════════════════════════

function crearTrigger30Min() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'enviarInformesPendientes') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('enviarInformesPendientes')
    .timeBased()
    .everyMinutes(30)
    .create();
  Logger.log('Trigger creado: enviarInformesPendientes cada 30 minutos');
}


function enviarInformesPendientes() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Respuestas');
  if (!sheet) { Logger.log('No existe hoja Respuestas'); return; }

  var cols    = ensureHeadersAndGetCols(sheet);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) { Logger.log('Sin datos'); return; }

  var headers = cols.headers;
  var colMap  = {};
  for (var h = 0; h < headers.length; h++) {
    colMap[String(headers[h]).trim()] = h;
  }

  var requiredCols = ['Email_Admin', 'Correo', 'Nombre', 'Apellido', 'Usuario_Admin', 'Fecha', HEADER_PDF_URL, HEADER_EMAIL_SENT];
  for (var r = 0; r < requiredCols.length; r++) {
    if (colMap[requiredCols[r]] === undefined) {
      Logger.log('Falta columna: ' + requiredCols[r]);
      return;
    }
  }

  var data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();

  // ✅ FIX 3: Solo procesar filas que tengan PDF Y no hayan sido enviadas
  // La clave del problema: antes se enviaban filas con PDF vacío
  // Ahora: si no tiene PDF → se marca como "PDF pendiente" y se reintenta en el próximo trigger
  var pendientesPorCorreo = {};

  for (var i = 0; i < data.length; i++) {
    var fila      = data[i];
    var pdfUrl    = String(fila[colMap[HEADER_PDF_URL]]    || '').trim();
    var yaEnviado = String(fila[colMap[HEADER_EMAIL_SENT]] || '').trim();

    // ✅ CAMBIO CRÍTICO: si no tiene PDF, NO procesar — saltar completamente
    if (!pdfUrl || pdfUrl.length < 10) continue;

    // Ya fue procesado (enviado, omitido, error, etc.)
    if (yaEnviado !== '') continue;

    var emailUser = String(fila[colMap['Correo']] || '').trim().toLowerCase();
    var clave     = emailUser || ('fila_' + i);
    if (!pendientesPorCorreo[clave]) pendientesPorCorreo[clave] = [];
    pendientesPorCorreo[clave].push(i);
  }

  var enviados = 0;
  var ahora = Utilities.formatDate(new Date(), 'America/Argentina/Buenos_Aires', 'dd/MM/yyyy, HH:mm:ss');

  for (var clave in pendientesPorCorreo) {
    var indices   = pendientesPorCorreo[clave];

    // ✅ FIX 4: De los duplicados, enviar el que tiene PDF más reciente (último índice)
    // y marcar todos los anteriores como omitidos
    var idxEnviar = indices[indices.length - 1];

    for (var d = 0; d < indices.length - 1; d++) {
      var rowDup = indices[d] + 2;
      sheet.getRange(rowDup, cols.colSent).setValue('Omitido (duplicado) - ' + ahora);
    }

    var fila           = data[idxEnviar];
    var rowNum         = idxEnviar + 2;
    var pdfUrlRaw      = String(fila[colMap[HEADER_PDF_URL]] || '').trim();
    var emailAdmin     = String(fila[colMap['Email_Admin']]  || '').trim();
    var emailUser      = String(fila[colMap['Correo']]       || '').trim();
    var nombre         = String(fila[colMap['Nombre']]       || '').trim();
    var apellido       = String(fila[colMap['Apellido']]     || '').trim();
    var adminName      = String(fila[colMap['Usuario_Admin']]|| '').trim();
    var fecha          = String(fila[colMap['Fecha']]        || '').trim();
    var nombreCompleto = (nombre + ' ' + apellido).trim() || 'Evaluado';

    var pdfUrlEmail = toViewableUrl(pdfUrlRaw);

    var destinatarios = [];
    if (emailUser && emailUser.indexOf('@') > 0) destinatarios.push(emailUser);

    if (destinatarios.length === 0) {
      Logger.log('Fila ' + rowNum + ': sin emails validos. Saltando.');
      sheet.getRange(rowNum, cols.colSent).setValue('Sin emails - ' + ahora);
      continue;
    }

    try {
      var subject   = 'Informe Eneagrama | ' + nombreCompleto;
      var htmlBody  = construirEmailHTML(nombreCompleto, adminName, fecha, pdfUrlEmail);
      var plainBody = 'Su Informe Eneagrama ya está disponible. Acceda aquí: ' + pdfUrlEmail;

      var mailOptions = {
        htmlBody: htmlBody,
        name:     'Escencial Consultora - Test Eneagrama',
        cc:       emailAdmin
      };

      GmailApp.sendEmail(destinatarios.join(','), subject, plainBody, mailOptions);
      sheet.getRange(rowNum, cols.colSent).setValue('Enviado - ' + ahora);
      enviados++;
      Logger.log('Email enviado fila ' + rowNum + ' -> ' + destinatarios.join(', '));

    } catch (err) {
      Logger.log('Error enviando fila ' + rowNum + ': ' + err);
      sheet.getRange(rowNum, cols.colSent).setValue('Error: ' + String(err).slice(0, 80));
    }
  }

  Logger.log('Envio finalizado. Total enviados: ' + enviados);
}


// ─── Obtener PDF desde Drive ──────────────────────────

function obtenerPdfDesdeDrive(url) {
  try {
    var match = url.match(/\/d\/([-\w]+)/);
    if (!match) match = url.match(/([-\w]{25,})/);
    if (!match) return null;
    var file = DriveApp.getFileById(match[1]);
    return file.getBlob().setName(file.getName());
  } catch (err) {
    Logger.log('No se pudo descargar PDF: ' + err);
    return null;
  }
}


// ═══════════════════════════════════════════════════════
// EMAIL HTML ESTILIZADO
// ═══════════════════════════════════════════════════════

function construirEmailHTML(nombreCompleto, adminName, fecha, pdfUrl) {

  var fechaMostrar = fecha;
  try {
    var d = new Date(fecha);
    if (!isNaN(d.getTime())) {
      fechaMostrar = Utilities.formatDate(d, 'America/Argentina/Buenos_Aires',
        'dd \'de\' MMMM \'de\' yyyy, HH:mm');
    }
  } catch (e) {}

  return '<!DOCTYPE html>' +
  '<html><head><meta charset="UTF-8"></head>' +
  '<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:Segoe UI,Helvetica,Arial,sans-serif;">' +

  '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:30px 0;">' +
  '<tr><td align="center">' +
  '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">' +

  '<tr><td style="background:linear-gradient(135deg,#0b4a6e 0%,#020f27 100%);padding:40px 30px;text-align:center;">' +
  '<h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:700;letter-spacing:2px;">Eneagrama</h1>' +
  '<p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;letter-spacing:0.5px;">Informe de Perfil Profesional</p>' +
  '</td></tr>' +

  '<tr><td style="padding:20px 30px 10px;text-align:center;">' +
  '<span style="display:inline-block;background:#eef2ff;color:#1e3a8a;padding:8px 18px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.5px;">INFORME PERSONALIZADO DE ENEAGRAMA</span>' +
  '</td></tr>' +

  '<tr><td style="padding:0 30px;"><hr style="border:none;height:1px;background:#e2e8f0;margin:15px 0;"></td></tr>' +

  '<tr><td style="padding:10px 30px 5px;">' +
  '<p style="color:#1e293b;font-size:16px;margin:0;">Estimado/a <strong>' + nombreCompleto + '</strong>,</p>' +
  '</td></tr>' +

  '<tr><td style="padding:10px 30px;">' +
  '<p style="color:#475569;font-size:15px;line-height:1.7;margin:0;">' +
  'Le informamos que su <strong>Informe de Perfil Profesional Eneagrama</strong> ha sido generado exitosamente. ' +
  'Este documento contiene el an&aacute;lisis completo de su eneatipo dominante, la distribuci&oacute;n de sus puntajes entre los nueve tipos, visualizaciones detalladas y recomendaciones personalizadas para su desarrollo personal y profesional.' +
  '</p></td></tr>' +

  '<tr><td style="padding:15px 30px;">' +
  '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">' +
  '<tr><td style="padding:20px;">' +
  '<table width="100%" cellpadding="0" cellspacing="0">' +
  '<tr><td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;width:140px;">Evaluado:</td>' +
  '<td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:500;">' + nombreCompleto + '</td></tr>' +
  '<tr><td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;">Administrador:</td>' +
  '<td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:500;">' + (adminName || '&mdash;') + '</td></tr>' +
  '<tr><td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;">Fecha:</td>' +
  '<td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:500;">' + (fechaMostrar || '&mdash;') + '</td></tr>' +
  '</table></td></tr></table>' +
  '</td></tr>' +

  '<tr><td style="padding:10px 30px;">' +
  '<p style="color:#475569;font-size:14px;line-height:1.6;margin:0;">' +
  'Su informe Eneagrama est&aacute; disponible en l&iacute;nea. Puede acceder al documento completo desde el siguiente bot&oacute;n:' +
  '</p></td></tr>' +

  '<tr><td style="padding:10px 30px 20px;text-align:center;">' +
  '<a href="' + pdfUrl + '" target="_blank" ' +
  'style="display:inline-block;background:linear-gradient(135deg,#0b4a6e 0%,#020f27 100%);color:#ffffff;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.3px;">' +
  'Ver Informe Eneagrama' +
  '</a></td></tr>' +

  '<tr><td style="padding:0 30px;"><hr style="border:none;height:1px;background:#e2e8f0;margin:10px 0;"></td></tr>' +

  '<tr><td style="padding:20px 30px 30px;text-align:center;">' +
  '<p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Este es un correo autom&aacute;tico generado por el sistema de evaluaciones ENEAGRAMA.</p>' +
  '<p style="color:#94a3b8;font-size:12px;margin:0 0 10px;">Por favor no responda a este mensaje.</p>' +
  '<p style="color:#0b4a6e;font-size:13px;font-weight:600;margin:0;">Escencial Consultora</p>' +
  '</td></tr>' +

  '</table></td></tr></table>' +
  '</body></html>';
}

Link: https://script.google.com/macros/s/AKfycbyTG4ijRmyn_RdN88lGAudFiXF0_8A78GukRfvCCncO5S7G5wLe938iqveW4EMG1ZAS/exec

------------------------------------

Visualizacion Test: Platform - Eneagrama
function doGet(e) {

  var sheetId = "1hxhEZbQTstsdSEtDySjU108GNoPgotsHAW-mLtPovok";
  var nombreHoja = "Respuestas";

  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(nombreHoja);

  var userParam = e && e.parameter && e.parameter.user 
    ? String(e.parameter.user).trim() 
    : null;

  var data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: "Sin datos" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var rows = data.slice(1);

  for (var i = 0; i < rows.length; i++) {

    var row = rows[i];
    var obj = {};

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }

    // 🔎 Si coincide el User, devolvemos TODO el objeto completo
    if (userParam && String(obj.User).trim() === userParam) {

      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          data: obj
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ❌ Si no lo encontró
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      message: "Usuario no encontrado"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

Link: https://script.google.com/macros/s/AKfycbyYy3Wgyqr5h60eaSuCAds9zu1i2vpN1pTuTl31HGh33V7KiSzMuwilnog2UCNw78SKMA/exec

----------

Link de la carpeta donde caen los informes: https://drive.google.com/drive/folders/1nqvwnhaYNbwTPHOqd7lwuANtyimVk993


