/**
 * pdfConfig.js — Configuración global del PDF de Eneagrama
 */

export const PAGE_CONFIG = {
  WIDTH: 210,
  HEIGHT: 297,
  MARGIN_LEFT: 15,
  MARGIN_RIGHT: 15,
  MARGIN_TOP: 28,
  FOOTER_H: 18,
  CONTENT_W: 180,
};

export const COLORES = {
  primario:    [40, 6, 64],       // --violet-900
  secundario:  [110, 62, 171],    // --violet-600
  acento:      [149, 58, 144],    // --magenta-600
  dorado:      [226, 184, 8],     // --gold-500
  doradoOsc:   [184, 137, 23],    // --gold-700
  texto:       [37, 37, 37],      // --ink-800
  textoClaro:  [120, 120, 140],
  borde:       [200, 195, 215],
  fondoClaro:  [248, 245, 255],
  fondoCard:   [243, 240, 252],
  verde:       [16, 185, 129],
  verdeClaro:  [209, 250, 229],
  magenta:     [149, 58, 144],
  magentaClaro:[253, 235, 252],
  blanco:      [255, 255, 255],
  negro:       [0, 0, 0],
};

export const TIPOGRAFIA = {
  titulo:    22,
  subtitulo: 14,
  cuerpo:    10,
  lista:     9.5,
  micro:     8,
  secundario:9,
  label:     7.5,
};

// Colores por tipo de eneatipo (r,g,b)
export const TIPO_COLORES = {
  1: [110, 62, 171],
  2: [149, 58, 144],
  3: [226, 184, 8],
  4: [71, 39, 140],
  5: [52, 47, 29],
  6: [110, 62, 171],
  7: [184, 137, 23],
  8: [40, 6, 64],
  9: [71, 39, 140],
};

export const TIPO_NOMBRES = {
  1: 'El Reformador',
  2: 'El Ayudador',
  3: 'El Triunfador',
  4: 'El Individualista',
  5: 'El Investigador',
  6: 'El Leal',
  7: 'El Entusiasta',
  8: 'El Desafiador',
  9: 'El Pacificador',
};
