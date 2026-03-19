// ============================================================
//  BODA ANDREA & FERRAN — Google Apps Script Web App
// ============================================================
//  Hojas del Google Sheet:
//    · "Invitados"       → Nombre | Apellido | Hash | URL Invitación
//    · "Confirmaciones"  → RSVP de asistencia
//    · "Canciones"       → Sugerencias de canciones
// ============================================================

const SHEET_GUESTS         = 'Invitados';
const SHEET_CONFIRMACIONES = 'Confirmaciones';
const SHEET_CANCIONES      = 'Canciones';
const BASE_URL             = 'https://fparareda.github.io/boda-andrea-ferran/?invite=';

// ─── GET: devuelve datos del invitado por hash ───────────────
function doGet(e) {
  const hash = (e && e.parameter && e.parameter.hash) || '';
  if (!hash) return jsonResponse({ ok: false, error: 'missing hash' });
  const guest = findGuestByHash(hash);
  if (guest) return jsonResponse({ ok: true, guest });
  return jsonResponse({ ok: false, error: 'not found' });
}

// ─── POST: enruta por tipo (rsvp | cancion) ──────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type || 'rsvp';

    if (type === 'cancion') {
      const sheet = getOrCreateSheet(SHEET_CANCIONES, [
        'Timestamp', 'Hash', 'Nombre', 'Apellido', 'Canción', 'Artista', 'Notas'
      ]);
      sheet.appendRow([
        new Date().toISOString(),
        data.hash     || '',
        data.nombre   || '',
        data.apellido || '',
        data.cancion  || '',
        data.artista  || '',
        data.notas    || ''
      ]);
    } else {
      const sheet = getOrCreateSheet(SHEET_CONFIRMACIONES, [
        'Timestamp', 'Hash', 'Nombre', 'Apellido', 'Asistencia', 'Acompañantes', 'Dieta', 'Notas'
      ]);
      sheet.appendRow([
        new Date().toISOString(),
        data.hash         || '',
        data.nombre       || '',
        data.apellido     || '',
        data.asistencia   || '',
        data.acompanantes || '',
        data.dieta        || '',
        data.notas        || ''
      ]);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ─── Buscar invitado por hash ────────────────────────────────
function findGuestByHash(hash) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_GUESTS);
  if (!sheet) return null;

  const data    = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim().toLowerCase());
  const hHash     = headers.indexOf('hash');
  const hNombre   = headers.indexOf('nombre');
  const hApellido = headers.indexOf('apellido');

  if (hHash === -1) return null;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][hHash]).trim() === hash.trim()) {
      return {
        nombre:   data[i][hNombre]   || '',
        apellido: data[i][hApellido] || ''
      };
    }
  }
  return null;
}

// ─── Helpers ─────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ============================================================
//  HERRAMIENTA: Generar hashes para todos los invitados
// ============================================================
function generarHashes() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_GUESTS);
  if (!sheet) {
    Browser.msgBox('Error: No se encontró la hoja "' + SHEET_GUESTS + '".');
    return;
  }

  const data    = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim().toLowerCase());

  let colHash = headers.indexOf('hash');
  let colUrl  = headers.indexOf('url invitación');

  if (colHash === -1) {
    colHash = headers.length;
    sheet.getRange(1, colHash + 1).setValue('Hash');
  }
  if (colUrl === -1) {
    colUrl = Math.max(colHash + 1, headers.length);
    sheet.getRange(1, colUrl + 1).setValue('URL Invitación');
  }

  let generados = 0;
  for (let i = 1; i < data.length; i++) {
    const row    = data[i];
    const yaHash = String(sheet.getRange(i + 1, colHash + 1).getValue()).trim();
    if (!yaHash && (row[0] || row[1])) {
      const hash = generarHashAleatorio();
      sheet.getRange(i + 1, colHash + 1).setValue(hash);
      sheet.getRange(i + 1, colUrl  + 1).setValue(BASE_URL + hash);
      generados++;
    }
  }
  Browser.msgBox('✅ Hashes generados: ' + generados + '\nColumnas "Hash" y "URL Invitación" actualizadas.');
}

function generarHashAleatorio() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
