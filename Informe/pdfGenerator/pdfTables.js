/**
 * ============================================================================
 * pdfTables.js — Generación de tablas
 * ----------------------------------------------------------------------------
 * Responsabilidades:
 *  - Tabla de detalle pregunta por pregunta (Parte I y Parte II)
 *  - Tabla comparativa Parte I vs Parte II
 *  - Tabla de puntuaciones detallada
 *  - Gráfico de barras Eneagrama dibujado manualmente (fallback sin canvas)
 * ============================================================================
 */

import { COLORES } from './pdfConfig.js';

// ---------------------------------------------------------------------------
// TABLA DETALLE PREGUNTA POR PREGUNTA
// ---------------------------------------------------------------------------

/**
 * Dibuja la tabla de respuestas detalladas (cabecera + filas con badges).
 * Se usa tanto para Parte I como para Parte II.
 *
 * @param {object} doc
 * @param {number} yInicial   - Posición Y de inicio
 * @param {Array}  datos      - Array de objetos { numero, textoD, textoI, textoS, textoC, masGrupo, menosGrupo }
 * @returns {number} Nueva posición Y al terminar la tabla
 */
export function dibujarTablaDetalle(doc, yInicial, datos) {
  const colWidths  = [12, 32, 32, 32, 32, 15, 15];
  const rowHeight  = 7;
  let y = yInicial;

  // --- Cabecera ---
  const headers = ['Nº', 'D', 'I', 'S', 'C', 'MÁS', 'MENOS'];
  let x = 15;

  headers.forEach((header, i) => {
    doc.setFillColor(...COLORES.primario);
    doc.rect(x, y, colWidths[i], rowHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(header, x + colWidths[i] / 2, y + 4.5, { align: 'center' });

    x += colWidths[i];
  });

  y += rowHeight;

  // --- Filas de datos ---
  datos.forEach((item, index) => {
    x = 15;

    // Fondo alternado en filas pares
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, y, 180, rowHeight, 'F');
    }

    const rowData = [
      item.numero.toString(),
      item.textoD,
      item.textoI,
      item.textoS,
      item.textoC,
      item.masGrupo,
      item.menosGrupo
    ];

    rowData.forEach((cell, colIndex) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(...COLORES.texto);

      // Columna de número en negrita
      if (colIndex === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
      }

      // Badges coloreados para MÁS / MENOS
      if (colIndex >= 5) {
        const bgColor = cell === 'D/I'
          ? (colIndex === 5 ? COLORES.D : COLORES.I)
          : (colIndex === 5 ? COLORES.S : COLORES.C);

        doc.saveGraphicsState();
        doc.setFillColor(...bgColor);
        doc.setGState(new doc.GState({ opacity: 0.2 }));
        doc.roundedRect(x + 1, y + 0.5, colWidths[colIndex] - 2, rowHeight - 1, 1, 1, 'F');
        doc.restoreGraphicsState();

        doc.setTextColor(...bgColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
      }

      doc.text(cell, x + colWidths[colIndex] / 2, y + 4.5, { align: 'center' });
      x += colWidths[colIndex];
    });

    y += rowHeight;
  });

  return y;
}

// ---------------------------------------------------------------------------
// TABLA COMPARATIVA PARTE I vs PARTE II
// ---------------------------------------------------------------------------

/**
 * Dibuja la tabla comparativa de resultados entre Parte I y Parte II.
 * Resalta la fila de diferencias con un fondo acento.
 *
 * @param {object} doc
 * @param {number} y        - Posición Y de inicio
 * @param {object} resultado - Objeto con masDI_P1, masSC_P1, etc.
 * @returns {number} Nueva posición Y
 */
export function dibujarTablaComparativa(doc, y, resultado) {
  const tableData = [
    ['Parte', 'MÁS D/I', 'MÁS S/C', 'MENOS D/I', 'MENOS S/C'],
    [
      'Parte I (Fortalezas)',
      resultado.masDI_P1.toString(),
      resultado.masSC_P1.toString(),
      resultado.menosDI_P1.toString(),
      resultado.menosSC_P1.toString()
    ],
    [
      'Parte II (Bajo presión)',
      resultado.masDI_P2.toString(),
      resultado.masSC_P2.toString(),
      resultado.menosDI_P2.toString(),
      resultado.menosSC_P2.toString()
    ],
    [
      'Diferencia',
      Math.abs(resultado.masDI_P1  - resultado.masDI_P2).toString(),
      Math.abs(resultado.masSC_P1  - resultado.masSC_P2).toString(),
      Math.abs(resultado.menosDI_P1 - resultado.menosDI_P2).toString(),
      Math.abs(resultado.menosSC_P1 - resultado.menosSC_P2).toString()
    ]
  ];

  const colWidths = [50, 30, 30, 30, 30];
  const rowHeight = 9;

  tableData.forEach((row, rowIndex) => {
    let x = 15;

    row.forEach((cell, colIndex) => {
      if (rowIndex === 0) {
        // Cabecera
        doc.setFillColor(...COLORES.primario);
        doc.rect(x, y, colWidths[colIndex], rowHeight, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(cell, x + colWidths[colIndex] / 2, y + 6, { align: 'center' });
      } else {
        // Fondo alternado
        if (rowIndex % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(x, y, colWidths[colIndex], rowHeight, 'F');
        }

        // Fila de diferencias con fondo acento
        if (rowIndex === 3) {
          doc.saveGraphicsState();
          doc.setFillColor(...COLORES.acento);
          doc.setGState(new doc.GState({ opacity: 0.1 }));
          doc.rect(x, y, colWidths[colIndex], rowHeight, 'F');
          doc.restoreGraphicsState();
        }

        doc.setFont('helvetica', colIndex === 0 ? 'bold' : 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...COLORES.texto);

        if (colIndex === 0) {
          doc.text(cell, x + 2, y + 6);
        } else {
          doc.text(cell, x + colWidths[colIndex] / 2, y + 6, { align: 'center' });
        }
      }

      x += colWidths[colIndex];
    });

    y += rowHeight;
  });

  return y;
}

// ---------------------------------------------------------------------------
// TABLA DE PUNTUACIONES DETALLADA
// ---------------------------------------------------------------------------

/**
 * Dibuja la tabla resumen de puntuaciones (MÁS, %, Nivel, MENOS, %, Nivel, Neto).
 *
 * @param {object} doc
 * @param {number} y
 * @param {object} resultado
 * @returns {number} Nueva posición Y
 */
export function dibujarTablaPuntuaciones(doc, y, resultado) {
  const tableData = [
    ['Eje Conductual', 'MÁS', '%', 'Nivel', 'MENOS', '%', 'Nivel', 'Neto'],
    [
      'D/I (Activo/Extrovertido)',
      resultado.masDI.toString(),
      `${resultado.pctMasDI}%`,
      resultado.nivelMasDI,
      resultado.menosDI.toString(),
      `${resultado.pctMenosDI}%`,
      resultado.nivelMenosDI,
      `${resultado.netoDI > 0 ? '+' : ''}${resultado.netoDI}`
    ],
    [
      'S/C (Reservado/Metódico)',
      resultado.masSC.toString(),
      `${resultado.pctMasSC}%`,
      resultado.nivelMasSC,
      resultado.menosSC.toString(),
      `${resultado.pctMenosSC}%`,
      resultado.nivelMenosSC,
      `${resultado.netoSC > 0 ? '+' : ''}${resultado.netoSC}`
    ]
  ];

  const colWidths = [45, 15, 15, 20, 15, 15, 20, 15];
  const rowHeight = 9;

  tableData.forEach((row, rowIndex) => {
    let x = 15;

    row.forEach((cell, colIndex) => {
      if (rowIndex === 0) {
        doc.setFillColor(...COLORES.primario);
        doc.rect(x, y, colWidths[colIndex], rowHeight, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text(cell, x + colWidths[colIndex] / 2, y + 6, { align: 'center' });
      } else {
        if (rowIndex % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(x, y, colWidths[colIndex], rowHeight, 'F');
        }
        doc.setFont(colIndex === 0 ? 'helvetica' : 'helvetica', colIndex === 0 ? 'bold' : 'normal');
        doc.setFontSize(colIndex === 0 ? 8 : 9);
        doc.setTextColor(...COLORES.texto);

        if (colIndex === 0) {
          doc.text(cell, x + 2, y + 6);
        } else {
          doc.text(cell, x + colWidths[colIndex] / 2, y + 6, { align: 'center' });
        }
      }

      x += colWidths[colIndex];
    });

    y += rowHeight;
  });

  return y;
}

// ---------------------------------------------------------------------------
// GRÁFICO DE BARRAS MANUAL (fallback)
// ---------------------------------------------------------------------------

/**
 * Dibuja el gráfico de barras Eneagrama de forma programática (sin canvas).
 * Se usa como fallback cuando no está disponible el elemento canvas del DOM.
 *
 * @param {object} doc
 * @param {number} x          - Posición X de inicio
 * @param {number} y          - Posición Y de inicio
 * @param {{ D, I, S, C }} EneagramaValues - Valores 0-100 para cada dimensión
 */
export function dibujarGraficoBarrasManual(doc, x, y, EneagramaValues, width = 180) {
  const maxHeight = 90;

  const dimensiones = [
    { letra: 'D', valor: EneagramaValues.D, color: COLORES.D, nombre: 'Dominancia'   },
    { letra: 'I', valor: EneagramaValues.I, color: COLORES.I, nombre: 'Influencia'   },
    { letra: 'S', valor: EneagramaValues.S, color: COLORES.S, nombre: 'Estabilidad'  },
    { letra: 'C', valor: EneagramaValues.C, color: COLORES.C, nombre: 'Cumplimiento' }
  ];

  // ✅ layout responsivo
  const leftPad = 18;     // deja espacio al eje Y (0..100)
  const rightPad = 8;
  const usableW = width - leftPad - rightPad;

  const spacing = Math.max(6, usableW * 0.06);
  const barWidth = (usableW - spacing * 3) / 4;

  // Líneas de referencia horizontales
  doc.setDrawColor(...COLORES.textoClaro);
  doc.setLineWidth(0.2);

  for (let i = 0; i <= 100; i += 20) {
    const lineY = y + maxHeight - (i / 100 * maxHeight);
    doc.line(x, lineY, x + width, lineY);

    doc.setFontSize(7);
    doc.setTextColor(...COLORES.textoClaro);
    doc.text(i.toString(), x - 5, lineY + 2, { align: 'right' });
  }

  // Barras
  dimensiones.forEach((dim, index) => {
    const barX = x + leftPad + index * (barWidth + spacing);
    const barHeight = (dim.valor / 100) * maxHeight;
    const barY = y + maxHeight - barHeight;

    doc.setFillColor(...dim.color);
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.8 }));
    doc.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'F');
    doc.restoreGraphicsState();

    doc.setDrawColor(...dim.color);
    doc.setLineWidth(0.5);
    doc.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'S');

    // Valor
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...dim.color);
    doc.text(dim.valor.toString(), barX + barWidth / 2, barY - 3, { align: 'center' });

    // Letra
    doc.setFontSize(18);
    doc.text(dim.letra, barX + barWidth / 2, y + maxHeight + 8, { align: 'center' });

    // Nombre
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORES.texto);
    doc.text(dim.nombre, barX + barWidth / 2, y + maxHeight + 14, { align: 'center' });
  });
}