/**
 * pdfSections.js — Secciones del PDF de Eneagrama
 * FIXES:
 *  - Todos los caracteres Unicode/emoji reemplazados por texto ASCII o vectores
 *  - Numeración de páginas correcta (exportamos getPageNum para main.js)
 *  - Índice con páginas reales calculadas dinámicamente
 *  - "→" reemplazado por "->" en textos
 */

import {
  PAGE_CONFIG, COLORES, TIPOGRAFIA, TIPO_COLORES, TIPO_NOMBRES
} from './pdfConfig.js';
import {
  nuevaPagina, agregarEncabezado, agregarPiePagina,
  dibujarCuadro, dibujarCuadroSolido, dibujarBorde,
  dibujarTitulo, dibujarSubtitulo, dibujarTexto, dibujarLista,
  dibujarBarra, lineHeightMm, heightOfText, heightOfList, ensureSpace
} from './pdfUtils.js';

// ── Contador de páginas compartido ──────────────────────────────────────────
let _pageNum = 1;
export function setPageNum(n) { _pageNum = n; }
export function getPageNum()  { return _pageNum; }

function nextPage(doc, nombre) {
  _pageNum++;
  nuevaPagina(doc, nombre);
  agregarPiePagina(doc, _pageNum);
}

// ── Helper: dibuja un bullet cuadrado coloreado (reemplaza ✦ ◦ ●) ──────────
function dibujarBulletCuadrado(doc, x, y, color, size = 2.5) {
  doc.setFillColor(...color);
  doc.rect(x, y - size * 0.8, size, size, 'F');
}

// ── Helper: dibuja un rectángulo de label con texto (reemplaza emojis) ──────
function dibujarLabelIcono(doc, texto, x, y, color) {
  const w = 4;
  doc.setFillColor(...color);
  doc.roundedRect(x, y - 3, w, 4, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(TIPOGRAFIA.label);
  doc.setTextColor(...color);
  doc.text(texto, x + w + 3, y);
}

// ════════════ BASE DE CONOCIMIENTO — Triadas, Mecanismos, Liderazgo ══════════
const _TRIADA_NOMBRE = {
  instinto: 'Triada de Instinto — Centro Visceral',
  emocion:  'Triada de Emocion — Centro Corazon',
  pensamiento: 'Triada de Pensamiento — Centro Cabeza',
};
const _TRIADA_DESC = {
  instinto:    'Los Tipos 8, 9 y 1 procesan la realidad a traves del cuerpo y la accion. Su emocion subyacente es la ira: explosiva en el 8, anestesiada en el 9, reprimida en el 1. Su desafio central: recuperar el contacto genuino con sus propias necesidades y limites corporales.',
  emocion:     'Los Tipos 2, 3 y 4 procesan a traves de los sentimientos y la imagen. Su emocion subyacente es la verguenza: el 2 la evita siendo indispensable, el 3 siendo exitoso, el 4 siendo especial y unico. Su desafio: encontrar su valor intrinseco independientemente del reconocimiento externo.',
  pensamiento: 'Los Tipos 5, 6 y 7 procesan a traves del analisis. Su emocion subyacente es el miedo: el 5 lo enfrenta con conocimiento, el 6 con vigilancia constante, el 7 huyendo hacia las posibilidades. Su desafio: encontrar apoyo interno sin depender de certezas externas.',
};
function _getTriadaKey(b) {
  return [8,9,1].includes(b) ? 'instinto' : [2,3,4].includes(b) ? 'emocion' : 'pensamiento';
}
const _MECANISMO = {
  1: 'Formacion reactiva: transforma impulsos inaceptables en su opuesto. La ira se convierte en critica constructiva y la imperfeccion propia en autocorreccion constante. Permite mantener una imagen de bondad e integridad mientras canaliza la tension interna hacia el mejoramiento continuo.',
  2: 'Represion: elimina del campo consciente sus propias necesidades. El Tipo 2 genuinamente no siente que necesita nada porque su atencion esta completamente volcada hacia los demas, permitiendo mantener la imagen de generosidad incondicional.',
  3: 'Identificacion: se fusiona con la imagen de exito. No distingue entre quien es y lo que logra porque su identidad esta construida sobre sus realizaciones y el reconocimiento que estas generan.',
  4: 'Introyeccion: internaliza profundamente las experiencias emocionales, habitandolas con tal intensidad que las convierte en identidad permanente. Genera una rica vida interior y profunda capacidad empatica.',
  5: 'Aislamiento: separa los pensamientos de las emociones. Puede analizar situaciones dolorosas con total objetividad porque ha desconectado el contenido emocional del intelectual, manteniendo claridad analitica.',
  6: 'Proyeccion: atribuye al exterior sus propios miedos. Percibe el mundo como amenazante porque proyecta hacia afuera los peligros que siente internamente, activando su notable capacidad de anticipacion de riesgos.',
  7: 'Racionalizacion: transforma el dolor en posibilidad. Reencuadra rapidamente las experiencias negativas para encontrarles un aspecto positivo, manteniendo el optimismo mientras evita el contacto profundo con el dolor.',
  8: 'Negacion: rechaza la vulnerabilidad propia. Niega cualquier signo de debilidad porque amenaza su sentido de autonomia y control, manteniendo la fortaleza exterior y la capacidad de proteccion del tipo.',
  9: 'Narcotizacion: se adormece ante las propias necesidades. Desaparece en actividades de bajo compromiso para evitar el conflicto que supondria afirmar su propia presencia y agenda personal.',
};
const _LIDERAZGO = {
  1: 'Liderazgo por principios. Establece estandares altos y lidera con el ejemplo etico. Su equipo lo percibe como justo, exigente y coherente. En su nivel sano eleva el nivel de toda la organizacion. Zona de sombra: rigidez y critica excesiva que puede desmotivar cuando nada esta perfectamente hecho.',
  2: 'Liderazgo por relacion y cuidado genuino. Crea vinculos profundos y sostiene emocionalmente a su equipo. En su nivel sano genera culturas de alta pertenencia y compromiso real. Zona de sombra: favoritismo y decisiones basadas en el afecto mas que en criterios tecnicos objetivos.',
  3: 'Liderazgo por resultados y vision energizante. Motiva al equipo con su confianza y capacidad para comunicar logros. En su nivel sano genera equipos de alto rendimiento genuinamente comprometidos. Zona de sombra: priorizar la imagen sobre la sustancia y no escuchar los problemas reales del equipo.',
  4: 'Liderazgo por vision y autenticidad. Inspira con profundidad y crea culturas con identidad y sentido genuinos. En su nivel sano es un lider transformacional capaz de movilizar emocionalmente al equipo. Zona de sombra: liderar desde los estados emocionales propios generando incertidumbre en el equipo.',
  5: 'Liderazgo por expertise y vision sistemica. Aporta rigor, analisis y perspectivas que otros no ven. En su nivel sano es un estratega brillante capaz de ver el cuadro completo. Zona de sombra: liderar desde la distancia y desconectarse de las necesidades emocionales del equipo.',
  6: 'Liderazgo por lealtad y cohesion. Construye equipos confiables y anticipa riesgos con precision. En su nivel sano genera organizaciones solidas con alta confianza interna. Zona de sombra: generar dependencia del lider y paralizar decisiones ante la incertidumbre.',
  7: 'Liderazgo por entusiasmo e innovacion. Genera energia, creatividad y posibilidades genuinas. En su nivel sano es un lider innovador capaz de ver oportunidades donde otros ven problemas. Zona de sombra: dispersar al equipo con demasiados proyectos y abandonar compromisos cuando la novedad se agota.',
  8: 'Liderazgo por determinacion y proteccion. Mueve organizaciones con claridad y audacia. En su nivel sano protege ferozmente a su equipo y genera alto impacto. Zona de sombra: intimidar, no escuchar el desacuerdo y generar dependencia de su fortaleza personal.',
  9: 'Liderazgo por armonia e integracion. Facilita la colaboracion y une perspectivas diversas. En su nivel sano resuelve conflictos desde la raiz. Zona de sombra: evitar las decisiones dificiles y perder su propia vision en el consenso del grupo.',
};
const _COMO_REL = {
  1:  { com:'Comunicate con precision y fundamentacion logica. Evita la improvisacion. Reconoce sus estandares de manera genuina, no como elogio vacio. Prepara las reuniones y presenta problemas con datos y propuestas concretas.',
        mot:'Se motiva cuando su trabajo tiene impacto real y los procesos son respetados. Dale autonomia y asegurate de que las normas sean claras y consistentes. Reconoce publicamente lo bien hecho antes de apuntar lo mejorable.',
        ev: 'Evita criticas generalizadas o feedback vago. No pidas que relaje estandares sin explicar por que. No lo interrumpas en medio de una tarea compleja. No ignores sus observaciones sobre procesos: suelen ser correctas y valiosas.',
        lid:'Su equipo lo percibe como justo y ejemplar. Su mayor desafio: celebrar lo bueno antes de corregir, y delegar sin controlar cada detalle del proceso. Cuando lo logra, su liderazgo se vuelve verdaderamente inspirador.' },
  2:  { com:'Conecta primero desde lo personal antes del contenido profesional. Reconoce explicitamente su contribucion. Necesita sentirse visto como persona, no solo como recurso productivo. Muestra interes genuino por su bienestar.',
        mot:'Se motiva cuando puede ayudar de manera concreta y siente que su presencia importa al equipo. Reconoce sus aportes, especialmente los que hace sin pedir nada a cambio. Celebra su capacidad de crear vinculos genuinos.',
        ev: 'Evita tratarlo de manera puramente transaccional. No ignores sus sugerencias sobre el clima del equipo. No le pidas que sea menos emocional: su inteligencia emocional es un activo organizacional muy valioso.',
        lid:'Crea entornos de alta calidez y pertenencia genuina. Su mayor desafio: liderar desde la autoridad ademas del afecto, y permitirse necesitar cosas del equipo sin sentir culpa por ello.' },
  3:  { com:'Ve directo al punto. Valora la eficiencia y los resultados. Presenta las tareas como desafios con metas claras y reconocimiento visible del logro. Muestra como su trabajo impacta en los objetivos globales del equipo.',
        mot:'Se motiva con metas concretas, plazos definidos y reconocimiento publico de sus logros. Dale libertad para elegir como alcanzar los resultados. Asegurate de que su desempeno sea visible ante quienes importan en la organizacion.',
        ev: 'Evita microgestionarlo o cuestionar su metodologia sin fundamento. No lo expongas negativamente frente a otros. No confundas su eficiencia con superficialidad: tiene mucha profundidad cuando se siente seguro y valorado.',
        lid:'Inspira por resultados y vision clara. Su mayor desafio: liderar desde la autenticidad y valorar el proceso y las personas tanto como los resultados visibles finales.' },
  4:  { com:'Dale espacio para expresar su perspectiva unica. Evita el lenguaje corporativo vacio. Necesita que su singularidad sea valorada genuinamente, no solo tolerada. Reconoce la profundidad de su mirada y su aporte.',
        mot:'Se motiva cuando su trabajo tiene significado genuino y puede aportar algo original. Dale proyectos que requieran creatividad y vision propia. Reconoce su aporte como unico y valioso para el equipo.',
        ev: 'Evita compararlo con otros miembros del equipo. No minimices sus emociones ni las tildas de dramatismo. No lo presiones a ser mas practico sin validar primero lo que siente.',
        lid:'Aporta profundidad, vision estetica y comprension emocional del equipo. Su mayor desafio: actuar con consistencia independientemente del estado emocional del momento.' },
  5:  { com:'Dale tiempo para procesar antes de responder. Presenta la informacion de manera organizada y completa. Respeta su necesidad de espacio y preparacion previa. No improvises con el ni lo sorprendas.',
        mot:'Se motiva cuando puede profundizar en su expertise con autonomia real. Valora su conocimiento sin obligarlo a socializar en exceso. El acceso a informacion relevante es clave para su motivacion sostenida.',
        ev: 'Evita sorpresas o cambios de agenda sin previo aviso. No interrumpas su tiempo de concentracion sin necesidad real. No asumas que su silencio es desacuerdo o falta de compromiso con el equipo.',
        lid:'Aporta rigor, vision sistemica y objetividad que otros no tienen. Su mayor desafio: comunicar su pensamiento antes de tener todas las respuestas, y liderar desde la presencia y la conexion humana.' },
  6:  { com:'Se claro, consistente y predecible en todo momento. Anticipa posibles obstaculos junto a el en lugar de descartarlos. Su capacidad para ver riesgos es un recurso muy valioso para la organizacion.',
        mot:'Se motiva en entornos de alta confianza con reglas claras. Celebra su lealtad y su compromiso real. La coherencia entre lo que se dice y lo que se hace es el factor que mas impacta su motivacion diaria.',
        ev: 'Evita la ambiguedad o los cambios de posicion sin explicacion clara. No lo presiones a decidir rapido en contextos de alta incertidumbre. No tomes su cuestionamiento como deslealtad: es su forma mas profunda de comprometerse.',
        lid:'Construye equipos cohesionados, leales y confiables. Su mayor desafio: confiar en su propio criterio sin necesitar validacion externa constante, y liderar desde la fortaleza interior que ya posee.' },
  7:  { com:'Presenta los proyectos como oportunidades con variedad y libertad de accion genuina. Conecta lo cotidiano con una vision mas grande. Necesita ver el potencial antes de comprometerse con los detalles del proceso.',
        mot:'Se motiva con variedad, novedad y libertad de accion. Permite que contribuya con ideas aunque no todas sean implementables. Reconoce su optimismo genuino y su notable capacidad de innovacion.',
        ev: 'Evita los proyectos monotonos sin horizonte claro. No lo ancles a procedimientos rigidos sin explicar el valor que tienen. No lo interrumpas en mitad de una idea antes de que la complete.',
        lid:'Genera entusiasmo, vision y posibilidades genuinas para el equipo. Su mayor desafio: comprometerse con una sola direccion y sostenerla hasta el final, valorando la profundidad sobre la amplitud dispersa.' },
  8:  { com:'Se directo y honesto en todo momento. El Tipo 8 respeta la confrontacion directa mas que la diplomacia excesiva. Ve al punto con claridad y sin rodeos innecesarios. Muestra respeto por su autonomia y capacidad.',
        mot:'Se motiva con desafios que requieren fuerza, decision y liderazgo real. Respeta su autonomia y capacidad de decision. Reconoce su proteccion del equipo y su compromiso genuino con los resultados.',
        ev: 'Evita la microadministracion. No seas pasivo-agresivo: prefiere siempre el conflicto directo y honesto. No lo trates como si necesitara ser controlado o supervisado de cerca en su trabajo.',
        lid:'Mueve organizaciones con determinacion y protege ferozmente a su equipo. Su mayor desafio: mostrar vulnerabilidad como fuente de autoridad genuina, y liderar desde el amor y la generosidad ademas de la fortaleza.' },
  9:  { com:'Dale espacio y tiempo para responder sin presion. Invitalo activamente a compartir su opinion: no suele imponerla. Necesita sentir que su perspectiva es genuinamente bienvenida y valorada por el equipo.',
        mot:'Se motiva en entornos de armonia y colaboracion real. Ayudalo a conectar con sus propias metas y prioridades. Reconoce su presencia estabilizadora y su capacidad de ver todas las perspectivas del equipo.',
        ev: 'Evita los conflictos frontales sin preparacion previa. No asumas que su acuerdo es genuino si no esta acompanado de compromiso activo. No ignores su perspectiva integradora: frecuentemente ve lo que otros pasan por alto.',
        lid:'Crea climas de alta armonia y colaboracion genuina en el equipo. Su mayor desafio: tomar posicion y sostenerla con firmeza, permitiendose sobresalir y liderar sin sentir que esto rompe la armonia del grupo.' },
};


// ── PORTADA ──────────────────────────────────────────────────────────────────
export function generarPortada(doc, userData, resultado, logos = {}) {
  _pageNum = 1;
  const nombre = `${userData.Nombre || ''} ${userData.Apellido || ''}`.trim();
  const tipoData = window.ENEAGRAMA_DATA?.tipos[resultado.base] || {};
  const colorTipo = TIPO_COLORES[resultado.base] || COLORES.secundario;

  // Fondo violeta oscuro
  doc.setFillColor(...COLORES.primario);
  doc.rect(0, 0, 210, 297, 'F');
  for (let i = 0; i < 40; i++) {
    const alpha = 0.03 + (i / 40) * 0.06;
    doc.saveGraphicsState();
    doc.setFillColor(110, 62, 171);
    doc.setGState(new doc.GState({ opacity: alpha }));
    doc.rect(0, i * (297 / 40), 210, 297 / 40 + 0.5, 'F');
    doc.restoreGraphicsState();
  }
  // Acento dorado lateral
  doc.setFillColor(...COLORES.dorado);
  doc.rect(0, 0, 5, 297, 'F');
  // Número gigante decorativo
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.04 }));
  doc.setFont('helvetica', 'bold'); doc.setFontSize(320);
  doc.setTextColor(255, 255, 255);
  doc.text(String(resultado.base), 140, 240, { align: 'center' });
  doc.restoreGraphicsState();

  // Logo ONE
  if (logos.logoOneColor) {
    const imgProps = doc.getImageProperties(logos.logoOneColor);
    const ratio = imgProps.height / imgProps.width;
    const lw = 60, lh = lw * ratio;
    doc.addImage(logos.logoOneColor, 'PNG', 105 - lw / 2, 28, lw, lh);
  } else {
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
    doc.text('ONE', 105, 42, { align: 'center' });
  }
  doc.setDrawColor(...COLORES.dorado); doc.setLineWidth(0.6);
  doc.line(60, 56, 150, 56);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
  doc.setTextColor(180, 160, 220);
  doc.text('INFORME DE PERSONALIDAD ORGANIZACIONAL', 105, 62, { align: 'center' });

  // Número tipo grande
  doc.setFont('helvetica', 'bold'); doc.setFontSize(96);
  doc.setTextColor(...COLORES.dorado);
  doc.text(String(resultado.base), 105, 125, { align: 'center' });

  // Nombre tipo
  doc.setFontSize(22); doc.setTextColor(255, 255, 255);
  doc.text(tipoData.nombre || '', 105, 140, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
  doc.setTextColor(180, 160, 220);
  doc.text(tipoData.subtitulo || '', 105, 150, { align: 'center' });

  // Score badge
  doc.setFillColor(...COLORES.dorado);
  doc.roundedRect(83, 155, 44, 10, 5, 5, 'F');
  doc.setTextColor(...COLORES.primario); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  doc.text(`Score: ${resultado.scores[resultado.base]}%`, 105, 161.5, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.setTextColor(160, 140, 200);
  doc.text(`Ala ${resultado.ala1} (${resultado.alaScore1}%)   |   Ala ${resultado.ala2} (${resultado.alaScore2}%)`, 105, 171, { align: 'center' });

  // Línea sep
  doc.setDrawColor(...COLORES.dorado); doc.setLineWidth(0.4);
  doc.line(20, 180, 190, 180);

  // Bloque datos evaluado
  doc.saveGraphicsState();
  doc.setFillColor(255, 255, 255); doc.setGState(new doc.GState({ opacity: 0.03 }));
  doc.roundedRect(20, 188, 170, 52, 4, 4, 'F'); doc.restoreGraphicsState();
  doc.setDrawColor(110, 62, 171); doc.setLineWidth(0.5);
  doc.roundedRect(20, 188, 170, 52, 4, 4, 'S');

  // Avatar
  doc.setFillColor(...COLORES.dorado); doc.circle(38, 210, 12, 'F');
  doc.setFillColor(...COLORES.primario);
  doc.circle(38, 207.5, 4, 'F');
  doc.roundedRect(33, 213, 10, 7, 2, 2, 'F');

  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text(nombre, 56, 202);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.setTextColor(160, 140, 200);
  doc.text(userData.Correo || '', 56, 210);
  doc.text(`Fecha: ${userData.Fecha || '—'}`, 56, 218);
  doc.text(`Integracion -> T${resultado.integracion}   |   Desintegracion -> T${resultado.desintegracion}`, 56, 226);

  doc.setTextColor(100, 80, 140); doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
  doc.text('Este informe es confidencial. Uso exclusivo del evaluado y del consultor asignado.', 105, 270, { align: 'center' });
  doc.text('(c) 2026 ONE Platform | - Eneagrama', 105, 277, { align: 'center' });
  const py = PAGE_CONFIG.HEIGHT - 10;
  doc.setDrawColor(60, 40, 100); doc.setLineWidth(0.3);
  doc.line(PAGE_CONFIG.MARGIN_LEFT, py - 4, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, py - 4);
  doc.setTextColor(100, 80, 140); doc.setFontSize(7);
  doc.text('(c) 2026 ONE Platform | - Eneagrama', PAGE_CONFIG.MARGIN_LEFT, py);
  doc.text('Confidencial', PAGE_CONFIG.WIDTH / 2, py, { align: 'center' });
  doc.text('Pagina 1', PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, py, { align: 'right' });
}

// ── ÍNDICE ────────────────────────────────────────────────────────────────────
// Las páginas reales se calculan en main.js y se pasan aquí
export function generarIndice(doc, nombre, paginasReales) {
  nextPage(doc, nombre);
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Indice del Informe', y);
  y += 14;

  // Si no se pasan páginas reales, usar estimadas
  const p = paginasReales || {
    portada: 1, indice: 2, queEs: 3, tipoBase: 4, nucleo: 5,
    fortalezas: 6, organizacional: 7, alas: 8, flechas: 9,
    niveles: 10, rueda: 11, barras: 12, tabla: 13, recs: 14, nota: 15
  };

  const secciones = [
    { titulo: 'Portada e Identificacion',              pagina: p.portada       || 1  },
    { titulo: 'Indice',                                pagina: p.indice        || 2  },
    { titulo: 'Que es el Eneagrama',                   pagina: p.queEs         || 3  },
    { titulo: 'Tu Tipo Base — Descripcion Completa',   pagina: p.tipoBase      || 4  },
    { titulo: 'Nucleo: Motivacion, Miedo y Deseo',     pagina: p.nucleo        || 5  },
    { titulo: 'Fortalezas y Areas de Desarrollo',      pagina: p.fortalezas    || 6  },
    { titulo: 'Perfil en el Contexto Organizacional',  pagina: p.organizacional|| 7  },
    { titulo: 'Alas — Influencias',                    pagina: p.alas          || 8  },
    { titulo: 'Lineas de Integracion y Desintegracion',pagina: p.flechas       || 9  },
    { titulo: 'Niveles de Salud Psicologica',          pagina: p.niveles       || 10 },
    { titulo: 'Rueda del Eneagrama — Perfil Visual',   pagina: p.rueda         || 11 },
    { titulo: 'Distribucion de Scores — Los 9 Tipos',  pagina: p.barras        || 12 },
    { titulo: 'Tabla de Resultados Detallada',         pagina: p.tabla         || 13 },
    { titulo: 'Recomendaciones para el Desarrollo',    pagina: p.recs          || 14 },
    { titulo: 'Nota Metodologica y Consideraciones',   pagina: p.nota          || 15 },
  ];

  const LH = 7;
  const X_T = PAGE_CONFIG.MARGIN_LEFT + 4;
  const X_P = PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT;

  secciones.forEach((sec, i) => {
    y = ensureSpace(y, LH + 2, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    if (i % 2 === 0) {
      doc.setFillColor(...COLORES.fondoClaro);
      doc.rect(PAGE_CONFIG.MARGIN_LEFT, y - 5, PAGE_CONFIG.CONTENT_W, LH, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TIPOGRAFIA.cuerpo);
    doc.setTextColor(...COLORES.texto);
    doc.text(sec.titulo, X_T, y);

    const tw = doc.getTextWidth(sec.titulo);
    const pw = doc.getTextWidth(String(sec.pagina));
    doc.setDrawColor(...COLORES.textoClaro);
    doc.setLineWidth(0.25);
    doc.setLineDash([1, 2]);
    doc.line(X_T + tw + 3, y - 1, X_P - pw - 3, y - 1);
    doc.setLineDash([]);

    doc.setTextColor(...COLORES.secundario);
    doc.setFont('helvetica', 'bold');
    doc.text(String(sec.pagina), X_P, y, { align: 'right' });
    doc.link(X_T - 2, y - 5, PAGE_CONFIG.CONTENT_W, LH, { pageNumber: sec.pagina });
    y += LH;
  });
}

// ── QUÉ ES EL ENEAGRAMA ───────────────────────────────────────────────────────
export function generarQueEsEneagrama(doc, nombre) {
  nextPage(doc, nombre);
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Que es el Eneagrama?', y);
  y += 14;

  const bloques = [
    {
      titulo: 'Definicion',
      texto: 'El Eneagrama es un sistema de tipologia psicologica que describe nueve tipos fundamentales de personalidad y sus interrelaciones. La palabra "Eneagrama" proviene del griego: "ennea" (nueve) y "gramma" (figura), haciendo referencia al diagrama geometrico de nueve puntos que lo representa.'
    },
    {
      titulo: 'Origen e Historia',
      texto: 'Sus raices se remontan a tradiciones espirituales de Oriente, especialmente a monasterios Sufis que utilizaban este diagrama como matriz de comprension de la realidad. En el siglo XX, G.I. Gurdjieff lo introdujo en Occidente, y fue desarrollado como sistema de personalidad por Oscar Ichazo y Claudio Naranjo. Actualmente es utilizado en psicologia, coaching ejecutivo y desarrollo organizacional en empresas como Google, Microsoft, IBM y Disney.'
    },
    {
      titulo: 'Que describe el Eneagrama?',
      texto: 'Cada uno de los nueve tipos describe un patron especifico de percepcion y respuesta al mundo. Este patron incluye: la motivacion profunda que impulsa las decisiones, los miedos fundamentales que condicionan los comportamientos, las fortalezas y talentos naturales, los mecanismos de defensa y las areas de crecimiento.'
    },
    {
      titulo: 'Aplicaciones Organizacionales',
      texto: 'En el contexto laboral, el Eneagrama permite comprender los estilos de liderazgo, mejorar la comunicacion entre equipos, resolver conflictos desde la raiz, disenar procesos de seleccion mas precisos y acompanar el desarrollo del talento con un mapa real de la personalidad de cada colaborador.'
    },
    {
      titulo: 'Que NO es el Eneagrama?',
      items: [
        'No es un diagnostico psicologico clinico ni psiquiatrico',
        'No clasifica a las personas en categorias rigidas: el tipo es un patron base, no una jaula',
        'No mide inteligencia ni aptitudes cognitivas',
        'No es un test de personalidad superficial: requiere autoobservacion honesta para su comprension real',
        'No determina el exito ni el fracaso en un rol por si solo',
      ]
    }
  ];

  bloques.forEach(bloque => {
    const esLista = !!bloque.items;
    const h = esLista
      ? heightOfList(doc, bloque.items, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.lista, 1.5) + 20
      : heightOfText(doc, bloque.texto, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.cuerpo) + 20;

    y = ensureSpace(y, h + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, h, COLORES.secundario, 0.04);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, h, COLORES.borde, 0.4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo - 1);
    doc.setTextColor(...COLORES.secundario);
    doc.text(bloque.titulo, PAGE_CONFIG.MARGIN_LEFT + 5, y + 9);

    if (esLista) {
      y = dibujarLista(doc, bloque.items, PAGE_CONFIG.MARGIN_LEFT + 6, y + 16, PAGE_CONFIG.CONTENT_W - 8, TIPOGRAFIA.lista, 1.5);
      y += 8;
    } else {
      y = dibujarTexto(doc, bloque.texto, PAGE_CONFIG.MARGIN_LEFT + 5, y + 16, PAGE_CONFIG.CONTENT_W - 8, TIPOGRAFIA.cuerpo);
      y += 10;
    }
  });
}

// ── TIPO BASE ─────────────────────────────────────────────────────────────────
export function generarTipoBase(doc, nombre, resultado) {
  nextPage(doc, nombre);
  const td = window.ENEAGRAMA_DATA?.tipos[resultado.base] || {};
  const colorTipo = TIPO_COLORES[resultado.base] || COLORES.secundario;
  let y = PAGE_CONFIG.MARGIN_TOP + 5;

  const headerH = 35;
  dibujarCuadroSolido(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, headerH, colorTipo);

  doc.setTextColor(...COLORES.blanco);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.text(String(resultado.base), PAGE_CONFIG.MARGIN_LEFT + 10, y + 24);

  doc.setFontSize(18);
  doc.text(td.nombre || '', PAGE_CONFIG.MARGIN_LEFT + 30, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(220, 210, 240);
  doc.text(td.subtitulo || '', PAGE_CONFIG.MARGIN_LEFT + 30, y + 23);

  doc.setTextColor(...COLORES.dorado);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(`${resultado.scores[resultado.base]}%`, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT - 5, y + 22, { align: 'right' });
  doc.setFontSize(7);
  doc.setTextColor(200, 190, 220);
  doc.text('SCORE', PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT - 5, y + 29, { align: 'right' });

  y += headerH + 10;

  dibujarTitulo(doc, 'Descripcion del Tipo', y, TIPOGRAFIA.subtitulo + 2);
  y += 10;
  const desc = td.descripcion || '';
  const hDesc = heightOfText(doc, desc, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo);
  y = ensureSpace(y, hDesc + 5, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });
  y = dibujarTexto(doc, desc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo);
  y += 8;

  const badges = [
    { label: 'PECADO CAPITAL', valor: td.pecadoCapital || '—', color: COLORES.magenta },
    { label: 'VIRTUD',         valor: td.virtud       || '—', color: COLORES.verde },
    { label: 'EMOCION BASE',   valor: td.emocionBasica|| '—', color: colorTipo },
  ];

  const badgeW = 57;
  const badgeH = 18;
  y = ensureSpace(y, badgeH + 10, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

  badges.forEach((b, i) => {
    const bx = PAGE_CONFIG.MARGIN_LEFT + i * (badgeW + 4.5);
    dibujarCuadroSolido(doc, bx, y, badgeW, badgeH, b.color);
    doc.setTextColor(...COLORES.blanco);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.label);
    doc.text(b.label, bx + badgeW / 2, y + 6, { align: 'center' });
    doc.setFontSize(TIPOGRAFIA.secundario);
    doc.text(b.valor, bx + badgeW / 2, y + 13, { align: 'center' });
  });
  y += badgeH + 10;

  // Triada de pertenencia
  const _tk = _getTriadaKey(resultado.base);
  const _hTr = heightOfText(doc, _TRIADA_DESC[_tk], PAGE_CONFIG.CONTENT_W - 12, TIPOGRAFIA.cuerpo) + 22;
  y = ensureSpace(y, _hTr + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });
  dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, _hTr, COLORES.secundario, 0.05);
  dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, _hTr, COLORES.secundario, 0.3);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...COLORES.secundario);
  doc.text(_TRIADA_NOMBRE[_tk].toUpperCase(), PAGE_CONFIG.MARGIN_LEFT + 6, y + 9);
  y = dibujarTexto(doc, _TRIADA_DESC[_tk], PAGE_CONFIG.MARGIN_LEFT + 6, y + 15, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.cuerpo);
  y += 12;

  // Mecanismo de defensa
  const _mec = _MECANISMO[resultado.base] || '';
  if (_mec) {
    const _hM = heightOfText(doc, _mec, PAGE_CONFIG.CONTENT_W - 14, TIPOGRAFIA.cuerpo) + 22;
    y = ensureSpace(y, _hM + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });
    doc.setFillColor(...colorTipo); doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, 5, _hM, 'F');
    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT + 5, y, PAGE_CONFIG.CONTENT_W - 5, _hM, colorTipo, 0.04);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT + 5, y, PAGE_CONFIG.CONTENT_W - 5, _hM, COLORES.borde, 0.3);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...colorTipo);
    doc.text('MECANISMO DE DEFENSA PREDOMINANTE', PAGE_CONFIG.MARGIN_LEFT + 11, y + 9);
    y = dibujarTexto(doc, _mec, PAGE_CONFIG.MARGIN_LEFT + 11, y + 16, PAGE_CONFIG.CONTENT_W - 16, TIPOGRAFIA.cuerpo);
    y += 10;
  }

  return y;
}

// ── NÚCLEO ────────────────────────────────────────────────────────────────────
export function generarNucleo(doc, nombre, resultado) {
  nextPage(doc, nombre);
  const td = window.ENEAGRAMA_DATA?.tipos[resultado.base] || {};
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Nucleo del Tipo — Motivacion, Miedo y Deseo', y); y += 12;
  const _introN = 'El nucleo eneatipico esta formado por tres elementos que operan de manera interrelacionada e inconsciente. La motivacion profunda impulsa las decisiones. El miedo fundamental organiza la estrategia de vida intentando evitar un estado intolerable. El deseo basico es la necesidad genuina que el tipo busca satisfacer. La paradoja central: las estrategias habituales del tipo frecuentemente lo alejan de ambos objetivos.';
  y = dibujarTexto(doc, _introN, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo, COLORES.textoClaro); y += 10;

  const items = [
    { label: 'MOTIVACION PROFUNDA', texto: td.motivacionProfunda || '', color: COLORES.secundario },
    { label: 'MIEDO FUNDAMENTAL',   texto: td.miedoProfundo     || '', color: COLORES.magenta },
    { label: 'DESEO BASICO',        texto: td.deseoBasico       || '', color: COLORES.verde },
  ];

  items.forEach(item => {
    const hTexto = heightOfText(doc, item.texto, PAGE_CONFIG.CONTENT_W - 16, TIPOGRAFIA.cuerpo);
    const cardH = hTexto + 22;
    y = ensureSpace(y, cardH + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    doc.setFillColor(...item.color);
    doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, 4, cardH, 'F');
    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT + 4, y, PAGE_CONFIG.CONTENT_W - 4, cardH, item.color, 0.04);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT + 4, y, PAGE_CONFIG.CONTENT_W - 4, cardH, item.color, 0.3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.label);
    doc.setTextColor(...item.color);
    doc.text(item.label, PAGE_CONFIG.MARGIN_LEFT + 10, y + 8);

    y = dibujarTexto(doc, item.texto, PAGE_CONFIG.MARGIN_LEFT + 10, y + 15, PAGE_CONFIG.CONTENT_W - 16, TIPOGRAFIA.cuerpo);
    y += 10;
  });
}

// ── FORTALEZAS Y DESARROLLO ───────────────────────────────────────────────────
export function generarFortalezas(doc, nombre, resultado) {
  nextPage(doc, nombre);
  const td = window.ENEAGRAMA_DATA?.tipos[resultado.base] || {};
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Fortalezas y Areas de Desarrollo', y); y += 12;
  const _introF = 'Las fortalezas del Tipo ' + resultado.base + ' son dones genuinos que emergen cuando el tipo opera desde su nivel sano. Las areas de desarrollo no son debilidades: son las mismas fortalezas llevadas al extremo o activadas de manera automatica por el miedo. El trabajo de crecimiento consiste en ampliar el rango de respuesta disponible, no en eliminar el tipo.';
  y = dibujarTexto(doc, _introF, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo, COLORES.textoClaro); y += 10;

  const colW = (PAGE_CONFIG.CONTENT_W - 8) / 2;
  const fortalezas = td.fortalezas || [];
  const desarrollo = td.areas_desarrollo || [];
  const hF = heightOfList(doc, fortalezas, colW - 8, TIPOGRAFIA.lista, 1.5) + 20;
  const hD = heightOfList(doc, desarrollo, colW - 8, TIPOGRAFIA.lista, 1.5) + 20;
  const cardH = Math.max(hF, hD);
  y = ensureSpace(y, cardH + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

  // Card fortalezas
  const xF = PAGE_CONFIG.MARGIN_LEFT;
  dibujarCuadro(doc, xF, y, colW, cardH, COLORES.verde, 0.05);
  doc.setFillColor(...COLORES.verde);
  doc.rect(xF, y, colW, 12, 'F');
  doc.setTextColor(...COLORES.blanco);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  // ASCII: sin ✦
  doc.text('+ FORTALEZAS NATURALES', xF + colW / 2, y + 8, { align: 'center' });
  dibujarLista(doc, fortalezas, xF + 5, y + 18, colW - 8, TIPOGRAFIA.lista, 2);

  // Card desarrollo
  const xD = PAGE_CONFIG.MARGIN_LEFT + colW + 8;
  dibujarCuadro(doc, xD, y, colW, cardH, COLORES.magenta, 0.05);
  doc.setFillColor(...COLORES.magenta);
  doc.rect(xD, y, colW, 12, 'F');
  doc.setTextColor(...COLORES.blanco);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  // ASCII: sin ◦
  doc.text('- AREAS DE DESARROLLO', xD + colW / 2, y + 8, { align: 'center' });
  dibujarLista(doc, desarrollo, xD + 5, y + 18, colW - 8, TIPOGRAFIA.lista, 2);

  y += cardH + 10;
  return y;
}

// ── PERFIL ORGANIZACIONAL ─────────────────────────────────────────────────────
export function generarPerfilOrganizacional(doc, nombre, resultado) {
  nextPage(doc, nombre);
  const td = window.ENEAGRAMA_DATA?.tipos[resultado.base] || {};
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Perfil en el Contexto Organizacional', y);
  y += 14;

  const secciones = [
    { label: 'En el Trabajo',        texto: td.en_trabajo       || '' },
    { label: 'En el Equipo',         texto: td.en_equipo        || '' },
    { label: 'Camino de Crecimiento',texto: td.camino_crecimiento || '' },
  ];

  secciones.forEach(sec => {
    const hTexto = heightOfText(doc, sec.texto, PAGE_CONFIG.CONTENT_W - 12, TIPOGRAFIA.cuerpo);
    const cardH = hTexto + 18;
    y = ensureSpace(y, cardH + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, COLORES.secundario, 0.04);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, COLORES.borde, 0.4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo - 1);
    doc.setTextColor(...COLORES.secundario);
    doc.text(sec.label, PAGE_CONFIG.MARGIN_LEFT + 6, y + 9);

    y = dibujarTexto(doc, sec.texto, PAGE_CONFIG.MARGIN_LEFT + 6, y + 16, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.cuerpo);
    y += 10;
  });

  // Estilo de liderazgo
  const _lid = _LIDERAZGO[resultado.base] || '';
  if (_lid) {
    const _hL = heightOfText(doc, _lid, PAGE_CONFIG.CONTENT_W - 14, TIPOGRAFIA.cuerpo) + 22;
    y = ensureSpace(y, _hL + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });
    const _cT = TIPO_COLORES[resultado.base] || COLORES.secundario;
    doc.setFillColor(..._cT); doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, 5, _hL, 'F');
    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT + 5, y, PAGE_CONFIG.CONTENT_W - 5, _hL, _cT, 0.04);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT + 5, y, PAGE_CONFIG.CONTENT_W - 5, _hL, COLORES.borde, 0.3);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.subtitulo - 2); doc.setTextColor(..._cT);
    doc.text('Estilo de Liderazgo', PAGE_CONFIG.MARGIN_LEFT + 11, y + 10);
    y = dibujarTexto(doc, _lid, PAGE_CONFIG.MARGIN_LEFT + 11, y + 17, PAGE_CONFIG.CONTENT_W - 16, TIPOGRAFIA.cuerpo);
    y += 10;
  }
}

// ── ALAS ──────────────────────────────────────────────────────────────────────
export function generarAlas(doc, nombre, resultado) {
  nextPage(doc, nombre);
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Alas — Influencias', y);
  y += 8;

  const introText = 'Las alas son los dos tipos con mayor puntuacion despues del tipo base. Ningun tipo se expresa de forma pura: siempre esta influenciado por sus alas, que anaden matices, recursos y desafios adicionales a la personalidad base. El ala dominante es la que muestra mayor puntuacion en el test.';
  y = dibujarTexto(doc, introText, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo, COLORES.textoClaro);
  y += 8;

  const alas = [
    { num: resultado.ala1, score: resultado.alaScore1, dominante: resultado.alaDominante === resultado.ala1 },
    { num: resultado.ala2, score: resultado.alaScore2, dominante: resultado.alaDominante === resultado.ala2 },
  ];

  alas.forEach(ala => {
    const td = window.ENEAGRAMA_DATA?.tipos[ala.num] || {};
    const colorAla = TIPO_COLORES[ala.num] || COLORES.secundario;
    const _tdAla = window.ENEAGRAMA_DATA?.tipos[ala.num] || {};
    const _descAla = _tdAla.descripcion ? _tdAla.descripcion.substring(0, 300) + '...' : '';
    const _hDescAla = _descAla ? heightOfText(doc, _descAla, PAGE_CONFIG.CONTENT_W - 14, TIPOGRAFIA.cuerpo - 0.5) : 0;
    const cardH = 42 + (_hDescAla > 0 ? _hDescAla + 10 : 0);
    y = ensureSpace(y, cardH + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    if (ala.dominante) {
      doc.setFillColor(...COLORES.dorado);
      doc.roundedRect(PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, 3, 3, 'F');
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.92 }));
      doc.setFillColor(...COLORES.fondoCard);
      doc.roundedRect(PAGE_CONFIG.MARGIN_LEFT + 1.5, y + 1.5, PAGE_CONFIG.CONTENT_W - 3, cardH - 3, 2, 2, 'F');
      doc.restoreGraphicsState();
    } else {
      dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, colorAla, 0.05);
      dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, COLORES.borde, 0.4);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(...colorAla);
    doc.text(String(ala.num), PAGE_CONFIG.MARGIN_LEFT + 8, y + 24);

    doc.setFontSize(13);
    doc.setTextColor(...COLORES.texto);
    doc.text(TIPO_NOMBRES[ala.num] || '', PAGE_CONFIG.MARGIN_LEFT + 26, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TIPOGRAFIA.secundario);
    doc.setTextColor(...COLORES.textoClaro);
    doc.text(td.subtitulo || '', PAGE_CONFIG.MARGIN_LEFT + 26, y + 22);

    const barX = PAGE_CONFIG.MARGIN_LEFT + 26;
    const barY = y + 28;
    const barW = PAGE_CONFIG.CONTENT_W - 36;
    dibujarBarra(doc, barX, barY, barW, 4, ala.score, colorAla, COLORES.borde);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...colorAla);
    doc.text(`${ala.score}%`, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT - 3, y + 31, { align: 'right' });

    if (ala.dominante) {
      dibujarCuadroSolido(doc, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT - 30, y + 6, 28, 10, COLORES.dorado);
      doc.setTextColor(...COLORES.blanco); doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
      doc.text('DOMINANTE', PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT - 16, y + 12.5, { align: 'center' });
    }

    // Descripcion del tipo ala
    if (_descAla) {
      const _sepY = y + 36;
      doc.setDrawColor(...colorAla); doc.setLineWidth(0.25);
      doc.line(PAGE_CONFIG.MARGIN_LEFT + 6, _sepY, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, _sepY);
      dibujarTexto(doc, _descAla, PAGE_CONFIG.MARGIN_LEFT + 8, _sepY + 5, PAGE_CONFIG.CONTENT_W - 14, TIPOGRAFIA.cuerpo - 0.5, COLORES.textoClaro);
    }

    y += cardH + 8;
  });
}

// ── FLECHAS ───────────────────────────────────────────────────────────────────
export function generarFlechas(doc, nombre, resultado) {
  nextPage(doc, nombre);
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Lineas de Integracion y Desintegracion', y);
  y += 8;

  const intro = `Las lineas o flechas del Eneagrama indican como se transforma el comportamiento del tipo base en dos situaciones clave: bajo crecimiento y bienestar (direccion de integracion) y bajo estres o tension sostenida (direccion de desintegracion).`;
  y = dibujarTexto(doc, intro, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo, COLORES.textoClaro);
  y += 10;

  const flechas = [
    {
      tipo: 'INTEGRACION — Crecimiento y Bienestar',
      num: resultado.integracion,
      color: COLORES.verde,
      colorFondo: COLORES.verdeClaro,
      desc: `Bajo crecimiento y bienestar, el Tipo ${resultado.base} se mueve hacia las cualidades mas sanas del Tipo ${resultado.integracion}. ${(window.ENEAGRAMA_DATA?.tipos[resultado.integracion]?.descripcion || '').substring(0, 400)}...`,
    },
    {
      tipo: 'DESINTEGRACION — Estres y Tension',
      num: resultado.desintegracion,
      color: COLORES.magenta,
      colorFondo: COLORES.magentaClaro,
      desc: `Bajo estres sostenido o tension, el Tipo ${resultado.base} puede caer en los patrones menos saludables del Tipo ${resultado.desintegracion}. ${(window.ENEAGRAMA_DATA?.tipos[resultado.desintegracion]?.descripcion || '').substring(0, 400)}...`,
    }
  ];

  flechas.forEach(f => {
    const hDesc = heightOfText(doc, f.desc, PAGE_CONFIG.CONTENT_W - 36, TIPOGRAFIA.cuerpo);
    const cardH = hDesc + 30;
    y = ensureSpace(y, cardH + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    doc.setFillColor(...f.colorFondo);
    doc.roundedRect(PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, 3, 3, 'F');
    doc.setFillColor(...f.color);
    doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, 5, cardH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...f.color);
    doc.text(f.tipo, PAGE_CONFIG.MARGIN_LEFT + 10, y + 9);

    doc.setFontSize(26);
    doc.text(String(f.num), PAGE_CONFIG.MARGIN_LEFT + 10, y + 24);

    doc.setFontSize(12);
    doc.setTextColor(...COLORES.texto);
    doc.text(TIPO_NOMBRES[f.num] || '', PAGE_CONFIG.MARGIN_LEFT + 28, y + 20);

    dibujarTexto(doc, f.desc, PAGE_CONFIG.MARGIN_LEFT + 10, y + 30, PAGE_CONFIG.CONTENT_W - 16, TIPOGRAFIA.cuerpo);

    y += cardH + 8;
  });
}

// ── NIVELES DE SALUD ──────────────────────────────────────────────────────────
export function generarNivelesSalud(doc, nombre, resultado) {
  nextPage(doc, nombre);
  const td = window.ENEAGRAMA_DATA?.tipos[resultado.base] || {};
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Niveles de Salud Psicologica', y);
  y += 8;

  const intro = `El Eneagrama reconoce que cada tipo puede expresarse en un amplio espectro de salud psicologica. El mismo tipo base puede manifestarse de forma muy diferente segun el nivel de consciencia, trabajo interior y bienestar general de la persona.`;
  y = dibujarTexto(doc, intro, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo, COLORES.textoClaro);
  y += 10;

  const _NIVEL_CTX = {
    sano:    'En el nivel sano, el tipo opera desde sus cualidades mas integradas. Las fortalezas naturales se expresan libremente y sin el peso del mecanismo de defensa. Es el nivel al que apunta el trabajo de desarrollo personal y el objetivo del coaching con Eneagrama.',
    promedio:'El nivel promedio es donde opera la mayoria de las personas la mayor parte del tiempo. El patron automatico funciona con sus luces y sombras. El trabajo de autoobservacion tiene aqui su mayor impacto: pequenos cambios producen grandes diferencias en la calidad de vida y las relaciones.',
    insano:  'El nivel insano emerge bajo estres extremo, trauma no procesado o ausencia de trabajo interior sostenido. El patron del tipo se rigidiza generando dano a uno mismo y a los demas. Cuando los comportamientos de este nivel son sostenidos, la intervencion psicologica profesional es el camino adecuado.',
  };
  const niveles = [
    { label: 'NIVEL SANO — Integracion y Libertad',     texto: td.niveles?.sano     || '', ctx: _NIVEL_CTX.sano,    color: COLORES.verde },
    { label: 'NIVEL PROMEDIO — Automatismo y Defensas', texto: td.niveles?.promedio || '', ctx: _NIVEL_CTX.promedio, color: COLORES.doradoOsc },
    { label: 'NIVEL INSANO — Rigidez y Ruptura',        texto: td.niveles?.insano   || '', ctx: _NIVEL_CTX.insano,  color: COLORES.magenta },
  ];

  niveles.forEach(nivel => {
    const hTexto = heightOfText(doc, nivel.texto, PAGE_CONFIG.CONTENT_W - 16, TIPOGRAFIA.cuerpo);
    const _hCtx = nivel.ctx ? heightOfText(doc, nivel.ctx, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.cuerpo - 0.5) + 10 : 0;
    const cardH = hTexto + 18 + _hCtx;
    y = ensureSpace(y, cardH + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, nivel.color, 0.05);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, nivel.color, 0.4);

    // Cuadradito de color como ícono (reemplaza ●)
    doc.setFillColor(...nivel.color);
    doc.rect(PAGE_CONFIG.MARGIN_LEFT + 6, y + 5, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.label);
    doc.setTextColor(...nivel.color);
    doc.text(nivel.label, PAGE_CONFIG.MARGIN_LEFT + 12, y + 8);

    let _ny = y + 14;
    _ny = dibujarTexto(doc, nivel.texto, PAGE_CONFIG.MARGIN_LEFT + 6, _ny, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.cuerpo);
    if (nivel.ctx) {
      _ny += 4;
      doc.setDrawColor(...nivel.color); doc.setLineWidth(0.25);
      doc.line(PAGE_CONFIG.MARGIN_LEFT + 6, _ny, PAGE_CONFIG.WIDTH - PAGE_CONFIG.MARGIN_RIGHT, _ny);
      _ny += 4;
      dibujarTexto(doc, nivel.ctx, PAGE_CONFIG.MARGIN_LEFT + 6, _ny, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.cuerpo - 0.5, COLORES.textoClaro);
    }
    y += cardH + 8;
  });
}

// ── TABLA DE RESULTADOS ───────────────────────────────────────────────────────
export function generarTablaResultados(doc, nombre, resultado) {
  nextPage(doc, nombre);
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Tabla de Resultados Detallada', y);
  y += 14;

  const COL = {
    num:  [PAGE_CONFIG.MARGIN_LEFT,       12],  // # tipo
    name: [PAGE_CONFIG.MARGIN_LEFT + 14,  58],  // Nombre
    bar:  [PAGE_CONFIG.MARGIN_LEFT + 74,  56],  // Barra
    pct:  [PAGE_CONFIG.MARGIN_LEFT + 132, 20],  // Porcentaje centrado
    rol:  [PAGE_CONFIG.MARGIN_LEFT + 155, 25],  // Badge ROL
  };

  // Encabezado
  doc.setFillColor(...COLORES.primario);
  doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, 10, 'F');
  doc.setTextColor(...COLORES.blanco);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(TIPOGRAFIA.label);
  doc.text('#',     COL.num[0] + 2,  y + 7);
  doc.text('Tipo',  COL.name[0] + 2, y + 7);
  doc.text('Score', COL.bar[0] + 2,  y + 7);
  doc.text('%',     COL.pct[0] + COL.pct[1]/2, y + 7, { align: 'center' });
  doc.text('Rol',   COL.rol[0],      y + 7);
  y += 10;

  const sorted = Object.entries(resultado.scores).sort((a, b) => b[1] - a[1]);

  sorted.forEach(([tipo, score], i) => {
    const t = parseInt(tipo);
    const isBase = t === resultado.base;
    const isAla  = t === resultado.ala1 || t === resultado.ala2;
    const rowH = 10;

    y = ensureSpace(y, rowH + 2, () => {
      nextPage(doc, nombre);
      y = PAGE_CONFIG.MARGIN_TOP + 5;
      doc.setFillColor(...COLORES.primario);
      doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, 10, 'F');
      doc.setTextColor(...COLORES.blanco);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(TIPOGRAFIA.label);
      doc.text('#', COL.num[0]+2, y+7); doc.text('Tipo', COL.name[0]+2, y+7);
      doc.text('Score', COL.bar[0]+2, y+7); doc.text('%', COL.pct[0], y+7); doc.text('Rol', COL.rol[0], y+7);
      y += 10;
    });

    if (isBase)         doc.setFillColor(255, 248, 210);
    else if (isAla)     doc.setFillColor(242, 237, 255);
    else if (i % 2===0) doc.setFillColor(...COLORES.fondoClaro);
    else                doc.setFillColor(255, 255, 255);
    doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, rowH, 'F');

    doc.setDrawColor(...COLORES.borde);
    doc.setLineWidth(0.2);
    doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, rowH, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isBase ? 12 : 10);
    doc.setTextColor(...(isBase ? COLORES.doradoOsc : TIPO_COLORES[t]));
    doc.text(String(t), COL.num[0] + 2, y + 7);

    doc.setFont('helvetica', isBase ? 'bold' : 'normal');
    doc.setFontSize(TIPOGRAFIA.cuerpo);
    doc.setTextColor(...COLORES.texto);
    doc.text(TIPO_NOMBRES[t] || '', COL.name[0] + 2, y + 7);

    dibujarBarra(doc, COL.bar[0] + 2, y + 3.5, COL.bar[1] - 4, 3, score, TIPO_COLORES[t]);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.secundario);
    doc.setTextColor(...(isBase ? COLORES.doradoOsc : COLORES.texto));
    doc.text(`${score}%`, COL.pct[0] + COL.pct[1] / 2, y + 7, { align: 'center' });

    if (isBase) {
      doc.setFillColor(...COLORES.dorado);
      doc.roundedRect(COL.rol[0], y + 2, 22, 6, 2, 2, 'F');
      doc.setTextColor(...COLORES.blanco);
      doc.setFontSize(6.5);
      doc.text('BASE', COL.rol[0] + 11, y + 6.5, { align: 'center' });
    } else if (isAla) {
      doc.setFillColor(...COLORES.secundario);
      doc.roundedRect(COL.rol[0], y + 2, 18, 6, 2, 2, 'F');
      doc.setTextColor(...COLORES.blanco);
      doc.setFontSize(6.5);
      doc.text('ALA', COL.rol[0] + 9, y + 6.5, { align: 'center' });
    }

    y += rowH;
  });
  y += 6;
  return y;
}

// ── RECOMENDACIONES ───────────────────────────────────────────────────────────
export function generarRecomendaciones(doc, nombre, resultado) {
  nextPage(doc, nombre);
  const td = window.ENEAGRAMA_DATA?.tipos[resultado.base] || {};
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Recomendaciones para el Desarrollo', y);
  y += 14;

  const recs = [
    {
      titulo: '01 | Autoobservacion Consciente',
      texto: `El primer paso para cualquier tipo es la autoobservacion sin juicio. Para ${td.nombre || 'este tipo'}, esto implica especialmente notar cuando los patrones automaticos del tipo toman el control, y crear el espacio necesario para elegir una respuesta diferente.`
    },
    {
      titulo: '02 | Trabajo con la Virtud del Tipo',
      texto: `La virtud del Tipo ${resultado.base} es la ${td.virtud || '—'}. Cultivar esta cualidad de manera consciente y cotidiana es el antidoto natural al patron limitante del tipo. No se trata de eliminar el tipo, sino de expresarlo desde sus aspectos mas integrados.`
    },
    {
      titulo: '03 | Integracion hacia el Tipo ' + resultado.integracion,
      texto: `Bajo bienestar, moverte conscientemente hacia las cualidades del Tipo ${resultado.integracion} te permite acceder a recursos que naturalmente no son tu primer movimiento. Estudia las fortalezas de ese tipo y practica incorporarlas progresivamente.`
    },
    {
      titulo: '04 | Gestion del Estres — Anticipar la Desintegracion',
      texto: `Conociendo que bajo presion puedes caer en patrones del Tipo ${resultado.desintegracion}, puedes anticiparte. Cuando notes las senales de alarma, esto es una invitacion a detenerte, respirar, y elegir conscientemente como responder.`
    },
    {
      titulo: '05 | Trabajo con las Alas',
      texto: `Tu ala dominante (Tipo ${resultado.alaDominante} — ${window.ENEAGRAMA_DATA?.tipos[resultado.alaDominante]?.nombre || ''}) ya enriquece tu tipo base de manera natural. Tu ala secundaria (Tipo ${resultado.alaDominante === resultado.ala1 ? resultado.ala2 : resultado.ala1}) ofrece recursos complementarios que quizas no uses tanto. Explorar las cualidades de ambas alas de manera intencional amplia el rango de respuesta disponible en distintas situaciones.`
    },
    {
      titulo: '06 | Practica Corporal y Regulacion',
      texto: `El Eneagrama reconoce que cada tipo tiene una relacion particular con el cuerpo, las emociones y el pensamiento. Para el Tipo ${resultado.base}, cuya emocion base es ${td.emocionBasica || '—'}, trabajar la regulacion desde el cuerpo suele ser especialmente efectivo. Practicas como el movimiento consciente, la respiracion diafragmatica o el scan corporal ayudan a detectar la activacion del patron antes de que se exprese conductualmente, creando el espacio para una respuesta mas consciente e integrada.`
    },
  ];

  recs.forEach(rec => {
    const hTexto = heightOfText(doc, rec.texto, PAGE_CONFIG.CONTENT_W - 12, TIPOGRAFIA.cuerpo);
    const cardH = hTexto + 18;
    y = ensureSpace(y, cardH + 5, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, COLORES.secundario, 0.04);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, COLORES.borde, 0.3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo - 1);
    doc.setTextColor(...COLORES.secundario);
    doc.text(rec.titulo, PAGE_CONFIG.MARGIN_LEFT + 6, y + 9);

    y = dibujarTexto(doc, rec.texto, PAGE_CONFIG.MARGIN_LEFT + 6, y + 16, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.cuerpo);
    y += 9;
  });
}

// ── COMO RELACIONARSE ────────────────────────────────────────────────────────
export function generarComoRelacionarse(doc, nombre, resultado) {
  nextPage(doc, nombre);
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Como Relacionarse con este Tipo', y); y += 12;
  const _ir = `Esta seccion esta orientada a lideres, consultores y profesionales de RRHH que trabajan con personas del Tipo ${resultado.base}. Conocer las claves de comunicacion, motivacion y liderazgo de este tipo permite construir relaciones mas efectivas, reducir fricciones innecesarias y potenciar el desempeno del colaborador de manera genuina.`;
  y = dibujarTexto(doc, _ir, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo, COLORES.textoClaro); y += 10;
  const _rel = _COMO_REL[resultado.base] || {};
  const _items = [
    { label: 'Comunicacion Efectiva',   texto: _rel.com || '', color: COLORES.secundario },
    { label: 'Claves de Motivacion',    texto: _rel.mot || '', color: COLORES.verde },
    { label: 'Que Evitar',              texto: _rel.ev  || '', color: COLORES.magenta },
    { label: 'Como Lider de este Tipo', texto: _rel.lid || '', color: COLORES.doradoOsc },
  ];
  _items.forEach(item => {
    const hT = heightOfText(doc, item.texto, PAGE_CONFIG.CONTENT_W - 14, TIPOGRAFIA.cuerpo);
    const cardH = hT + 22;
    y = ensureSpace(y, cardH + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });
    doc.setFillColor(...item.color); doc.rect(PAGE_CONFIG.MARGIN_LEFT, y, 5, cardH, 'F');
    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT + 5, y, PAGE_CONFIG.CONTENT_W - 5, cardH, item.color, 0.04);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT + 5, y, PAGE_CONFIG.CONTENT_W - 5, cardH, COLORES.borde, 0.3);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.label + 0.5); doc.setTextColor(...item.color);
    doc.text(item.label, PAGE_CONFIG.MARGIN_LEFT + 11, y + 9);
    y = dibujarTexto(doc, item.texto, PAGE_CONFIG.MARGIN_LEFT + 11, y + 16, PAGE_CONFIG.CONTENT_W - 16, TIPOGRAFIA.cuerpo);
    y += 8;
  });
}

// ── LOS NUEVE TIPOS ──────────────────────────────────────────────────────────
export function generarNovetipos(doc, nombre, resultado) {
  nextPage(doc, nombre);
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Los Nueve Tipos — Vision de Conjunto', y); y += 12;
  const _in = `Vision de referencia de los nueve eneatipos con su motivacion y pecado/virtud. Util para comprender la diversidad de perfiles con los que el evaluado se relaciona en su entorno organizacional. El Tipo ${resultado.base} aparece destacado.`;
  y = dibujarTexto(doc, _in, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, TIPOGRAFIA.cuerpo, COLORES.textoClaro); y += 8;
  const _tipos = window.ENEAGRAMA_DATA?.tipos || {};
  // Columnas: # | Nombre | Pecado/Virtud | Motivacion
  const _RH = 18; // filas más altas para 2 líneas de texto
  const _ML = PAGE_CONFIG.MARGIN_LEFT;
  const _COL = { num: _ML+4, nom: _ML+16, pv: _ML+72, mot: _ML+122 };
  const _W =   { nom: 54,    pv: 48,      mot: 52 };

  doc.setFillColor(...COLORES.primario); doc.rect(_ML, y, PAGE_CONFIG.CONTENT_W, 10, 'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
  doc.text('#', _COL.num, y+7);
  doc.text('Nombre', _COL.nom, y+7);
  doc.text('Pecado / Virtud', _COL.pv, y+7);
  doc.text('Motivacion central', _COL.mot, y+7);
  y += 10;

  for (let t=1; t<=9; t++) {
    const _td = _tipos[t] || {}, _isB = t === resultado.base;

    // Calcular altura real de cada celda según su contenido
    const _pvTxt = (_td.pecadoCapital||'—') + ' / ' + (_td.virtud||'—');
    const _motTxt = _td.motivacionProfunda || '—';
    const _pvLines = doc.splitTextToSize(_pvTxt, _W.pv);
    const _motLines = doc.splitTextToSize(_motTxt, _W.mot);
    const _maxLines = Math.max(_pvLines.length, _motLines.length, 1);
    const _rowH = Math.max(_RH, _maxLines * 5 + 8);

    y = ensureSpace(y, _rowH + 2, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    if (_isB) doc.setFillColor(255,248,210);
    else if (t%2===0) doc.setFillColor(...COLORES.fondoClaro);
    else doc.setFillColor(255,255,255);
    doc.rect(_ML, y, PAGE_CONFIG.CONTENT_W, _rowH, 'F');
    doc.setDrawColor(...COLORES.borde); doc.setLineWidth(0.2);
    doc.rect(_ML, y, PAGE_CONFIG.CONTENT_W, _rowH, 'S');

    const _cy = y + 6;

    // Número
    doc.setFont('helvetica','bold'); doc.setFontSize(_isB?11:9);
    doc.setTextColor(...(_isB ? COLORES.doradoOsc : TIPO_COLORES[t]));
    doc.text(String(t), _COL.num, _cy);

    // Nombre tipo
    doc.setFont('helvetica', _isB?'bold':'normal'); doc.setFontSize(9);
    doc.setTextColor(...COLORES.texto);
    doc.text(TIPO_NOMBRES[t]||'', _COL.nom, _cy);

    // Pecado / Virtud — texto completo en 2 líneas
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
    doc.setTextColor(...COLORES.textoClaro);
    doc.text(_pvLines.slice(0,2), _COL.pv, _cy);

    // Motivacion — texto completo en 2 líneas
    doc.setFontSize(7);
    doc.text(_motLines.slice(0,2), _COL.mot, _cy);

    // Badge TU TIPO
    if (_isB) {
      doc.setFillColor(...COLORES.dorado);
      doc.roundedRect(_ML + PAGE_CONFIG.CONTENT_W - 20, y + (_rowH/2) - 4, 18, 8, 2, 2, 'F');
      doc.setTextColor(...COLORES.primario); doc.setFont('helvetica','bold'); doc.setFontSize(6);
      doc.text('TU TIPO', _ML + PAGE_CONFIG.CONTENT_W - 11, y + (_rowH/2) + 1, { align: 'center' });
    }
    y += _rowH;
  }
  y+=8; return y;
}


// ── NOTA METODOLÓGICA ─────────────────────────────────────────────────────────
export function generarNota(doc, nombre, userData, logos = {}) {
  nextPage(doc, nombre);
  let y = PAGE_CONFIG.MARGIN_TOP + 5;
  dibujarTitulo(doc, 'Nota Metodologica y Consideraciones', y);
  y += 14;

  const notas = [
    {
      titulo: 'Sobre la Validez del Test',
      texto: 'Este test ha sido disenado para identificar el patron eneatipico predominante a traves de respuestas a situaciones cotidianas. Como todo instrumento de autoinforme, los resultados reflejan la autopercepcion del evaluado en el momento de la evaluacion. Para una interpretacion profunda, se recomienda la lectura reflexiva de este informe y, cuando sea posible, una conversacion con un consultor certificado en Eneagrama.'
    },
    {
      titulo: 'Consideraciones Importantes',
      texto: 'El Eneagrama es una herramienta de desarrollo, no un sistema de clasificacion rigida. Los tipos no son etiquetas definitivas ni determinan el destino de una persona. El objetivo de este informe es proporcionar un mapa de autoconocimiento, no una sentencia. Las personas evolucionan, y el trabajo consciente con el propio tipo es precisamente lo que hace posible esa evolucion.'
    },
    {
      titulo: 'Confidencialidad',
      texto: 'Este informe es confidencial y esta destinado exclusivamente al uso del evaluado y del consultor o profesional de RRHH que administre la evaluacion. No debe ser utilizado como unico criterio en decisiones de seleccion, promocion o desvinculacion. El uso responsable de esta herramienta implica considerarla como un elemento mas dentro de un proceso integral de evaluacion.'
    },
  ];

  notas.forEach(nota => {
    const hTexto = heightOfText(doc, nota.texto, PAGE_CONFIG.CONTENT_W - 12, TIPOGRAFIA.cuerpo);
    const cardH = hTexto + 18;
    y = ensureSpace(y, cardH + 6, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });

    dibujarCuadro(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, COLORES.primario, 0.04);
    dibujarBorde(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, cardH, COLORES.borde, 0.3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo - 1);
    doc.setTextColor(...COLORES.primario);
    doc.text(nota.titulo, PAGE_CONFIG.MARGIN_LEFT + 6, y + 9);

    y = dibujarTexto(doc, nota.texto, PAGE_CONFIG.MARGIN_LEFT + 6, y + 16, PAGE_CONFIG.CONTENT_W - 10, TIPOGRAFIA.cuerpo);
    y += 10;
  });

  y = ensureSpace(y, 22, () => { nextPage(doc, nombre); y = PAGE_CONFIG.MARGIN_TOP + 5; });
  dibujarCuadroSolido(doc, PAGE_CONFIG.MARGIN_LEFT, y, PAGE_CONFIG.CONTENT_W, 18, COLORES.primario);

  // Logo ONE en bloque final
  if (logos.logoOneIcono) {
    doc.addImage(logos.logoOneIcono, 'PNG', PAGE_CONFIG.MARGIN_LEFT + 4, y + 3, 12, 12);
  }

  doc.setTextColor(...COLORES.blanco);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    `Informe generado el ${userData.Fecha || new Date().toLocaleDateString('es-AR')} — (c) 2026 Escencial Consultora — ONE Platform`,
    PAGE_CONFIG.WIDTH / 2 + 10, y + 11, { align: 'center' }
  );
}