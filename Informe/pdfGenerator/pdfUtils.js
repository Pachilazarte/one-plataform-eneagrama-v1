/**
 * pdfUtils.js — Primitivas de dibujo y utilidades para el PDF de Eneagrama
 */

import { PAGE_CONFIG, COLORES, TIPOGRAFIA } from './pdfConfig.js';

// ── Altura de línea ──────────────────────────────────────────────────────────
export function lineHeightMm(fontSize) {
  return fontSize * 0.37;
}

export function heightOfText(doc, text, maxWidth, fontSize, fontStyle = 'normal') {
  doc.setFont('helvetica', fontStyle);
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(String(text), maxWidth);
  return lines.length * lineHeightMm(fontSize);
}

export function heightOfList(doc, items, maxWidth, fontSize, lineGap = 1) {
  doc.setFontSize(fontSize);
  let h = 0;
  items.forEach(item => {
    const lines = doc.splitTextToSize(String(item), maxWidth - 6);
    h += lines.length * lineHeightMm(fontSize) + lineGap;
  });
  return h;
}

export function ensureSpace(currentY, neededH, onNewPage) {
  const BOTTOM = PAGE_CONFIG.HEIGHT - PAGE_CONFIG.FOOTER_H - 5;
  if (currentY + neededH > BOTTOM) {
    onNewPage();
    return PAGE_CONFIG.MARGIN_TOP + 5;
  }
  return currentY;
}

// ── Encabezado y pie de página ───────────────────────────────────────────────
export function agregarEncabezado(doc, nombreCompleto = '') {
  // Franja superior
  doc.setFillColor(...COLORES.primario);
  doc.rect(0, 0, PAGE_CONFIG.WIDTH, 18, 'F');

  // Logo ONE: usar window._pdfLogoIcono si está disponible, si no texto
  if (window._pdfLogoIcono) {
    doc.addImage(window._pdfLogoIcono, 'PNG', PAGE_CONFIG.MARGIN_LEFT, 3, 12, 12);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('ONE PLATFORM', PAGE_CONFIG.MARGIN_LEFT, 11);
  }

  if (nombreCompleto) {
    doc.setTextColor(180, 160, 220);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(nombreCompleto, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, 11, { align: 'right' });
  }

  // Línea separadora dorada
  doc.setDrawColor(...COLORES.dorado);
  doc.setLineWidth(0.8);
  doc.line(0, 18, PAGE_CONFIG.WIDTH, 18);
}

export function agregarPiePagina(doc, pageNum) {
  const y = PAGE_CONFIG.HEIGHT - 10;
  doc.setDrawColor(...COLORES.borde);
  doc.setLineWidth(0.3);
  doc.line(PAGE_CONFIG.MARGIN_LEFT, y - 4, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, y - 4);

  doc.setTextColor(...COLORES.textoClaro);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(TIPOGRAFIA.micro);
  doc.text('© 2026 Escencial Consultora — ONE Platform', PAGE_CONFIG.MARGIN_LEFT, y);
  doc.text(`Página ${pageNum}`, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, y, { align: 'right' });
  doc.text('Confidencial', PAGE_CONFIG.WIDTH / 2, y, { align: 'center' });
}

export function nuevaPagina(doc, nombreCompleto = '', pageNum = null) {
  doc.addPage();
  agregarEncabezado(doc, nombreCompleto);
  if (pageNum !== null) agregarPiePagina(doc, pageNum);
}

// ── Primitivas de dibujo ─────────────────────────────────────────────────────
export function dibujarCuadro(doc, x, y, ancho, alto, color, opacity = 0.1) {
  doc.saveGraphicsState();
  doc.setFillColor(...color);
  doc.setGState(new doc.GState({ opacity }));
  doc.roundedRect(x, y, ancho, alto, 3, 3, 'F');
  doc.restoreGraphicsState();
}

export function dibujarCuadroSolido(doc, x, y, ancho, alto, color, radius = 3) {
  doc.setFillColor(...color);
  doc.roundedRect(x, y, ancho, alto, radius, radius, 'F');
}

export function dibujarBorde(doc, x, y, ancho, alto, color, lineWidth = 0.5, radius = 3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(lineWidth);
  doc.roundedRect(x, y, ancho, alto, radius, radius, 'S');
}

export function dibujarTitulo(doc, texto, y, size = 18) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size);
  doc.setTextColor(...COLORES.texto);
  doc.text(String(texto), PAGE_CONFIG.MARGIN_LEFT, y);

  doc.setDrawColor(...COLORES.secundario);
  doc.setLineWidth(2);
  const w = Math.min(doc.getTextWidth(String(texto)), 80);
  doc.line(PAGE_CONFIG.MARGIN_LEFT, y + 2, PAGE_CONFIG.MARGIN_LEFT + w, y + 2);
}

export function dibujarSubtitulo(doc, texto, y, size = 12) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size || TIPOGRAFIA.subtitulo);
  doc.setTextColor(...COLORES.secundario);
  doc.text(String(texto), PAGE_CONFIG.MARGIN_LEFT, y);
}

export function dibujarTexto(doc, texto, x, y, maxWidth = 180, size = 10, color = COLORES.texto) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(String(texto), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeightMm(size);
}

export function dibujarLista(doc, items, x, y, maxWidth = 170, fontSize = 9.5, lineGap = 1.5) {
  let currentY = y;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORES.texto);

  items.forEach(item => {
    doc.setTextColor(...COLORES.secundario);
    doc.text('•', x, currentY);
    doc.setTextColor(...COLORES.texto);
    const lines = doc.splitTextToSize(String(item), maxWidth - 6);
    doc.text(lines, x + 5, currentY);
    currentY += lines.length * lineHeightMm(fontSize) + lineGap;
  });
  return currentY;
}

// ── Barra de progreso horizontal ─────────────────────────────────────────────
export function dibujarBarra(doc, x, y, ancho, alto, valor, colorFill, colorBg = COLORES.borde) {
  // Fondo
  doc.setFillColor(...colorBg);
  doc.roundedRect(x, y, ancho, alto, alto / 2, alto / 2, 'F');
  // Relleno
  const fillW = Math.max(4, (valor / 100) * ancho);
  doc.setFillColor(...colorFill);
  doc.roundedRect(x, y, fillW, alto, alto / 2, alto / 2, 'F');
}

// ── Canvas/SVG → PNG para jsPDF ───────────────────────────────────────────────
export function svgToPngDataUrl(svgElement) {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = 500; canvas.height = 500;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(img, 0, 0, 500, 500);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  });
}

// ── Cargar imagen local como dataURL para jsPDF ──────────────────────────────
/**
 * Carga una imagen desde una ruta relativa y la convierte a dataURL.
 * Uso: const data = await loadImageAsDataUrl('img/one-logocolor.png')
 *      doc.addImage(data, 'PNG', x, y, w, h)
 */
export function loadImageAsDataUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth  || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      // Si no carga, devolvemos null silenciosamente
      resolve(null);
    };
    img.src = src;
  });
}