/**
 * pdfEmoticons.js — Íconos “tipo emoji” pero vectoriales (compatibles con jsPDF)
 * ---------------------------------------------------------------------------
 * Problema: emojis como 💡 ⬍ ⬌ no siempre existen en Helvetica/core fonts.
 * Solución: dibujarlos como vectores para que SIEMPRE rendericen bien.
 */

export function withGState(doc, fn) {
  doc.saveGraphicsState();
  try {
    fn();
  } finally {
    doc.restoreGraphicsState();
  }
}

/**
 * Dibuja un ícono de bombilla (reemplazo de 💡)
 * @param {jsPDF} doc
 * @param {number} x  esquina izquierda del ícono
 * @param {number} y  baseline aproximado (mismo y que doc.text)
 * @param {number[]} color RGB array [r,g,b]
 * @param {number} size tamaño en mm aprox (default 6)
 */
export function iconBulb(doc, x, y, color, size = 6) {
  withGState(doc, () => {
    const s = size / 6; // factor
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6 * s);

    // Bulb head
    doc.circle(x + 3.0 * s, y - 2.2 * s, 2.0 * s, 'S');

    // Neck
    doc.line(x + 2.2 * s, y - 0.4 * s, x + 3.8 * s, y - 0.4 * s);

    // Base
    doc.line(x + 2.3 * s, y + 0.6 * s, x + 3.7 * s, y + 0.6 * s);
    doc.line(x + 2.5 * s, y + 1.3 * s, x + 3.5 * s, y + 1.3 * s);

    // Filament
    doc.line(x + 2.5 * s, y - 2.2 * s, x + 3.5 * s, y - 2.2 * s);
  });
}

/**
 * Dibuja un ícono de información (i en círculo) útil como fallback
 */
export function iconInfo(doc, x, y, color, size = 6) {
  withGState(doc, () => {
    const s = size / 6;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6 * s);

    doc.circle(x + 3.0 * s, y - 1.8 * s, 2.0 * s, 'S');

    // "i"
    doc.line(x + 3.0 * s, y - 2.0 * s, x + 3.0 * s, y - 0.6 * s);
    doc.circle(x + 3.0 * s, y - 2.8 * s, 0.25 * s, 'S');
  });
}

/**
 * Flecha vertical (⬍ o similar): doble flecha arriba/abajo
 */
export function iconVerticalAxis(doc, x, y, color, size = 6) {
  withGState(doc, () => {
    const s = size / 6;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.7 * s);

    const cx = x + 3.0 * s;
    const top = y - 4.0 * s;
    const bot = y + 1.5 * s;

    // shaft
    doc.line(cx, top + 1.2 * s, cx, bot - 1.2 * s);

    // arrow up
    doc.line(cx, top + 1.2 * s, cx - 1.0 * s, top + 2.2 * s);
    doc.line(cx, top + 1.2 * s, cx + 1.0 * s, top + 2.2 * s);

    // arrow down
    doc.line(cx, bot - 1.2 * s, cx - 1.0 * s, bot - 2.2 * s);
    doc.line(cx, bot - 1.2 * s, cx + 1.0 * s, bot - 2.2 * s);
  });
}

/**
 * Flecha horizontal (⬌ o similar): doble flecha izquierda/derecha
 */
export function iconHorizontalAxis(doc, x, y, color, size = 6) {
  withGState(doc, () => {
    const s = size / 6;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.7 * s);

    const cy = y - 1.5 * s;
    const left = x + 0.8 * s;
    const right = x + 5.2 * s;

    // shaft
    doc.line(left + 1.2 * s, cy, right - 1.2 * s, cy);

    // arrow left
    doc.line(left + 1.2 * s, cy, left + 2.2 * s, cy - 1.0 * s);
    doc.line(left + 1.2 * s, cy, left + 2.2 * s, cy + 1.0 * s);

    // arrow right
    doc.line(right - 1.2 * s, cy, right - 2.2 * s, cy - 1.0 * s);
    doc.line(right - 1.2 * s, cy, right - 2.2 * s, cy + 1.0 * s);
  });
}

/**
 * Flechas simples (↑ ↓ → ←) para encabezados de sub-bloques
 */
export function iconArrow(doc, dir, x, y, color, size = 5) {
  withGState(doc, () => {
    const s = size / 5;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.7 * s);

    const cx = x + 2.5 * s;
    const cy = y - 1.5 * s;

    if (dir === 'up') {
      doc.line(cx, cy + 2.0 * s, cx, cy - 2.0 * s);
      doc.line(cx, cy - 2.0 * s, cx - 1.3 * s, cy - 0.7 * s);
      doc.line(cx, cy - 2.0 * s, cx + 1.3 * s, cy - 0.7 * s);
    } else if (dir === 'down') {
      doc.line(cx, cy - 2.0 * s, cx, cy + 2.0 * s);
      doc.line(cx, cy + 2.0 * s, cx - 1.3 * s, cy + 0.7 * s);
      doc.line(cx, cy + 2.0 * s, cx + 1.3 * s, cy + 0.7 * s);
    } else if (dir === 'right') {
      doc.line(cx - 2.0 * s, cy, cx + 2.0 * s, cy);
      doc.line(cx + 2.0 * s, cy, cx + 0.7 * s, cy - 1.3 * s);
      doc.line(cx + 2.0 * s, cy, cx + 0.7 * s, cy + 1.3 * s);
    } else if (dir === 'left') {
      doc.line(cx + 2.0 * s, cy, cx - 2.0 * s, cy);
      doc.line(cx - 2.0 * s, cy, cx - 0.7 * s, cy - 1.3 * s);
      doc.line(cx - 2.0 * s, cy, cx - 0.7 * s, cy + 1.3 * s);
    }
  });
}

/**
 * Helper para pintar "icono + texto" alineado, evitando emojis.
 * Devuelve el X donde debería empezar el texto (por si quieres controlar).
 */
export function drawIconLabel(doc, {
  icon,        // function(doc,x,y,color,size)
  x,
  y,
  color,
  size = 6,
  gap = 2,
  text = '',
  fontSize = 11,
  fontStyle = 'bold',
  textColor = color,
}) {
  icon(doc, x, y, color, size);

  doc.setFont('helvetica', fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...textColor);

  const textX = x + size + gap;
  doc.text(text, textX, y);
  return textX;
}
