/**
 * pdfGenerator/main.js
 * Orquestador del PDF de Eneagrama — logos y marca de agua corregidos.
 */

import {
  generarPortada, generarIndice, generarQueEsEneagrama,
  generarTipoBase, generarNucleo, generarFortalezas,
  generarPerfilOrganizacional, generarAlas, generarFlechas,
  generarNivelesSalud, generarComoRelacionarse, generarNovetipos,
  generarTablaResultados, generarRecomendaciones, generarNota,
  setPageNum, getPageNum,
} from './pdfSections.js';

import {
  agregarEncabezado, agregarPiePagina,
  svgToPngDataUrl, loadImageAsDataUrl
} from './pdfUtils.js';
import { PAGE_CONFIG, COLORES } from './pdfConfig.js';

window.generarPDFEneagrama = async function (userData, resultado, onBase64Ready) {

  const overlay = document.createElement('div');
  overlay.className = 'pdf-overlay';
  overlay.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:1.2rem;">
      <div class="pdf-spinner"></div>
      <p style="color:#e2b808;font-weight:600;font-size:1rem;">Generando PDF del Informe...</p>
      <p style="color:#c0c0c0;font-size:0.8rem;">Esto puede tomar unos segundos</p>
    </div>`;
  document.body.appendChild(overlay);

  try {
const base = window._pdfImgBasePath || '../';
const logoOneColor  = await loadImageAsDataUrl(base + 'img/one-logocolor.png');
const logoOneIcono  = await loadImageAsDataUrl(base + 'img/one-iconocolor.png');
const faviconData   = await loadImageAsDataUrl(base + 'img/favicon.png');
    const logos = { logoOneColor, logoOneIcono, faviconData };
    // Guardar logo en window para que pdfUtils.js pueda usarlo en agregarEncabezado
    window._pdfLogoIcono = logoOneIcono;

    let wheelImgData = null;
    let barImgData   = null;

    const wheelContainer = document.getElementById('eneagrama-wheel');
    if (wheelContainer) {
      const svg = wheelContainer.querySelector('svg');
      if (svg) {
        try {
          const clone = svg.cloneNode(true);
          clone.querySelectorAll('*').forEach(el => {
            if (el.style.opacity) el.style.opacity = '1';
            if (el.getAttribute('opacity')) el.setAttribute('opacity', '1');
            if (el.getAttribute('fill-opacity')) el.setAttribute('fill-opacity', '1');
          });
          const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          bg.setAttribute('width', '100%'); bg.setAttribute('height', '100%');
          bg.setAttribute('fill', '#ffffff');
          clone.insertBefore(bg, clone.firstChild);
          wheelImgData = await svgToPngDataUrl(clone);
        } catch(e) { console.warn('Wheel capture:', e); }
      }
    }

    const barsContainer = document.getElementById('eneagrama-bars');
    if (barsContainer) {
      const svg = barsContainer.querySelector('svg');
      if (svg) {
        try {
          const clone = svg.cloneNode(true);
          const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          bg.setAttribute('width', '100%'); bg.setAttribute('height', '100%');
          bg.setAttribute('fill', '#0a0118');
          clone.insertBefore(bg, clone.firstChild);
          barImgData = await svgToPngDataUrl(clone);
        } catch(e) { console.warn('Bars capture:', e); }
      }
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const nombre = `${userData.Nombre || ''} ${userData.Apellido || ''}`.trim();

    const pags = {};
    setPageNum(1);

    pags.portada = 1;
    generarPortada(doc, userData, resultado, logos);

    pags.indice = getPageNum() + 1;
    generarIndice(doc, nombre, null);
    _marcaDeAgua(doc, faviconData);

    pags.queEs = getPageNum() + 1;
    generarQueEsEneagrama(doc, nombre);
    _marcaDeAgua(doc, faviconData);

    pags.tipoBase = getPageNum() + 1;
    generarTipoBase(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.nucleo = getPageNum() + 1;
    generarNucleo(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.fortalezas = getPageNum() + 1;
    generarFortalezas(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.organizacional = getPageNum() + 1;
    generarPerfilOrganizacional(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.alas = getPageNum() + 1;
    generarAlas(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.flechas = getPageNum() + 1;
    generarFlechas(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.niveles = getPageNum() + 1;
    generarNivelesSalud(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.comoRelacionarse = getPageNum() + 1;
    generarComoRelacionarse(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.novetipos = getPageNum() + 1;
    generarNovetipos(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    const pnRueda = getPageNum() + 1;
    pags.rueda = pnRueda;
    setPageNum(pnRueda);
    doc.addPage();
    _dibujarPaginaRueda(doc, nombre, wheelImgData, resultado, pnRueda, logos);
    _marcaDeAgua(doc, faviconData);

    const pnBarras = getPageNum() + 1;
    pags.barras = pnBarras;
    setPageNum(pnBarras);
    doc.addPage();
    _dibujarPaginaBarras(doc, nombre, barImgData, pnBarras, logos);
    _marcaDeAgua(doc, faviconData);

    pags.tabla = getPageNum() + 1;
    generarTablaResultados(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.recs = getPageNum() + 1;
    generarRecomendaciones(doc, nombre, resultado);
    _marcaDeAgua(doc, faviconData);

    pags.nota = getPageNum() + 1;
    generarNota(doc, nombre, userData, logos);
    _marcaDeAgua(doc, faviconData);

    doc.setPage(pags.indice);
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, PAGE_CONFIG.WIDTH, PAGE_CONFIG.HEIGHT, 'F');
    _encabezadoPDF(doc, nombre, logos);
    _piePDF(doc, pags.indice);
    _marcaDeAgua(doc, faviconData);
    _dibujarContenidoIndice(doc, pags);

    const fileName = `Informe_Eneagrama_${nombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

    if (typeof onBase64Ready === 'function') {
      try {
        const pdfBase64 = doc.output('datauristring').split(',')[1];
        onBase64Ready(pdfBase64);
      } catch (e) {
        console.warn('[PDF] No se pudo generar base64:', e);
      }
    }

    doc.save(fileName);

  } catch (err) {
    console.error('Error generando PDF:', err);
    alert('Ocurrio un error al generar el PDF. Por favor, intente nuevamente.');
  } finally {
    document.body.removeChild(overlay);
  }
};

function _marcaDeAgua(doc, faviconData) {
  if (!faviconData) return;
  const SIZE = 104;
  const x = (PAGE_CONFIG.WIDTH  - SIZE) / 2;
  const y = (PAGE_CONFIG.HEIGHT - SIZE) / 2;
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.04 }));
  doc.addImage(faviconData, 'PNG', x, y, SIZE, SIZE);
  doc.restoreGraphicsState();
}

function _encabezadoPDF(doc, nombre, logos) {
  doc.setFillColor(...COLORES.primario);
  doc.rect(0, 0, PAGE_CONFIG.WIDTH, 18, 'F');
  if (logos.logoOneIcono) {
    doc.addImage(logos.logoOneIcono, 'PNG', PAGE_CONFIG.MARGIN_LEFT, 3, 12, 12);
  } else if (logos.logoOneColor) {
    doc.addImage(logos.logoOneColor, 'PNG', PAGE_CONFIG.MARGIN_LEFT, 4, 30, 10);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('ONE', PAGE_CONFIG.MARGIN_LEFT, 12);
  }
  doc.setTextColor(180, 160, 220);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(nombre, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, 11, { align: 'right' });
  doc.setDrawColor(...COLORES.dorado);
  doc.setLineWidth(0.8);
  doc.line(0, 18, PAGE_CONFIG.WIDTH, 18);
}

function _piePDF(doc, pageNum) {
  const y = PAGE_CONFIG.HEIGHT - 10;
  doc.setDrawColor(...COLORES.borde);
  doc.setLineWidth(0.3);
  doc.line(PAGE_CONFIG.MARGIN_LEFT, y - 4, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, y - 4);
  doc.setTextColor(...COLORES.textoClaro);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('(c) 2026 ONE Platform', PAGE_CONFIG.MARGIN_LEFT, y);
  doc.text('Confidencial', PAGE_CONFIG.WIDTH / 2, y, { align: 'center' });
  doc.text(`Pagina ${pageNum}`, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, y, { align: 'right' });
}

function _dibujarContenidoIndice(doc, pags) {
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(37, 37, 37);
  doc.text('Indice del Informe', PAGE_CONFIG.MARGIN_LEFT, y);
  doc.setDrawColor(110, 62, 171);
  doc.setLineWidth(2);
  doc.line(PAGE_CONFIG.MARGIN_LEFT, y + 2, PAGE_CONFIG.MARGIN_LEFT + 60, y + 2);
  y += 14;

  const secciones = [
    { titulo: 'Portada e Identificacion',               pagina: pags.portada          },
    { titulo: 'Indice',                                  pagina: pags.indice           },
    { titulo: 'Que es el Eneagrama',                     pagina: pags.queEs            },
    { titulo: 'Tu Tipo Base — Descripcion Completa',     pagina: pags.tipoBase         },
    { titulo: 'Nucleo: Motivacion, Miedo y Deseo',       pagina: pags.nucleo           },
    { titulo: 'Fortalezas y Areas de Desarrollo',        pagina: pags.fortalezas       },
    { titulo: 'Perfil en el Contexto Organizacional',    pagina: pags.organizacional    },
    { titulo: 'Alas — Influencias',                      pagina: pags.alas             },
    { titulo: 'Lineas de Integracion y Desintegracion',  pagina: pags.flechas          },
    { titulo: 'Niveles de Salud Psicologica',            pagina: pags.niveles          },
    { titulo: 'Como Relacionarse con este Tipo',         pagina: pags.comoRelacionarse  },
    { titulo: 'Los Nueve Tipos — Vision de Conjunto',    pagina: pags.novetipos        },
    { titulo: 'Rueda del Eneagrama — Perfil Visual',     pagina: pags.rueda            },
    { titulo: 'Distribucion de Scores — Los 9 Tipos',    pagina: pags.barras           },
    { titulo: 'Tabla de Resultados Detallada',           pagina: pags.tabla            },
    { titulo: 'Recomendaciones para el Desarrollo',      pagina: pags.recs             },
    { titulo: 'Nota Metodologica y Consideraciones',     pagina: pags.nota             },
  ];

  const LH  = 7;
  const X_T = PAGE_CONFIG.MARGIN_LEFT + 4;
  const X_P = PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT;

  secciones.forEach((sec, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 245, 255);
      doc.rect(PAGE_CONFIG.MARGIN_LEFT, y - 5, PAGE_CONFIG.CONTENT_W, LH, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(37, 37, 37);
    doc.text(sec.titulo, X_T, y);
    const tw = doc.getTextWidth(sec.titulo);
    const pw = doc.getTextWidth(String(sec.pagina));
    doc.setDrawColor(120, 120, 140);
    doc.setLineWidth(0.25);
    doc.setLineDash([1, 2]);
    doc.line(X_T + tw + 3, y - 1, X_P - pw - 3, y - 1);
    doc.setLineDash([]);
    doc.setTextColor(110, 62, 171);
    doc.setFont('helvetica', 'bold');
    doc.text(String(sec.pagina), X_P, y, { align: 'right' });
    doc.link(X_T - 2, y - 5, PAGE_CONFIG.CONTENT_W, LH, { pageNumber: sec.pagina });
    y += LH;
  });
}

function _dibujarPaginaRueda(doc, nombre, wheelImgData, resultado, pageNum, logos) {
  _encabezadoPDF(doc, nombre, logos);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORES.primario);
  doc.text('Rueda del Eneagrama — Perfil Visual', PAGE_CONFIG.MARGIN_LEFT, 28);
  if (wheelImgData) {
    doc.addImage(wheelImgData, 'PNG', 30, 35, 150, 150);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...COLORES.textoClaro);
    doc.text('[Grafico no disponible — ver informe web]', PAGE_CONFIG.WIDTH / 2, 110, { align: 'center' });
  }
  let ly = 193;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLORES.texto);
  doc.text(`Tipo Base: ${resultado.base} — ${window.ENEAGRAMA_DATA?.tipos[resultado.base]?.nombre || ''}`, PAGE_CONFIG.MARGIN_LEFT, ly);
  ly += 7;
  doc.text(`Ala Dominante: ${resultado.alaDominante}  |  Integracion -> Tipo ${resultado.integracion}  |  Desintegracion -> Tipo ${resultado.desintegracion}`, PAGE_CONFIG.MARGIN_LEFT, ly);
  _piePDF(doc, pageNum);
}

function _dibujarPaginaBarras(doc, nombre, barImgData, pageNum, logos) {
  _encabezadoPDF(doc, nombre, logos);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORES.primario);
  doc.text('Distribucion de Scores — Los 9 Tipos', PAGE_CONFIG.MARGIN_LEFT, 28);
  if (barImgData) {
    doc.addImage(barImgData, 'PNG', PAGE_CONFIG.MARGIN_LEFT, 35, PAGE_CONFIG.CONTENT_W, 110);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...COLORES.textoClaro);
    doc.text('[Grafico no disponible — ver informe web]', PAGE_CONFIG.WIDTH / 2, 80, { align: 'center' });
  }
  _piePDF(doc, pageNum);
}