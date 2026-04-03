/**
 * Dashboard Organizacional — ONE Eneagrama v4
 * Caché localStorage · Overlay AdminDashboard · Gestión completa · Cultura profunda
 * Informe completo en ventana nueva (window.open)
 */

Auth.protectPage(CONFIG.roles.ADMIN);

// ═══════════════════════════════════════════════════════════
// CACHÉ
// ═══════════════════════════════════════════════════════════
function getPanelCacheKey() {
  const s = Auth.getSession();
  return 'one_paneldata_' + (s ? s.userName : 'x');
}
const PANEL_CACHE_TTL = 10 * 60 * 1000;

function savePanelCache(data) {
  try { localStorage.setItem(getPanelCacheKey(), JSON.stringify({ ts: Date.now(), data })); } catch(e) {}
}
function loadPanelCache() {
  try {
    const r = localStorage.getItem(getPanelCacheKey());
    if (!r) return null;
    const p = JSON.parse(r);
    if (!Array.isArray(p.data)) return null;
    if (Date.now() - p.ts > PANEL_CACHE_TTL) return null;
    return p.data;
  } catch(e) { return null; }
}
function clearPanelCache() {
  try { localStorage.removeItem(getPanelCacheKey()); } catch(e) {}
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES ENEAGRAMA
// ═══════════════════════════════════════════════════════════
const TIPO_NOMBRES = {
  1:'El Reformador',2:'El Ayudador',3:'El Triunfador',
  4:'El Individualista',5:'El Investigador',6:'El Leal',
  7:'El Entusiasta',8:'El Desafiador',9:'El Pacificador'
};
const TIPO_CORTO = {
  1:'Reformador',2:'Ayudador',3:'Triunfador',
  4:'Individualista',5:'Investigador',6:'Leal',
  7:'Entusiasta',8:'Desafiador',9:'Pacificador'
};
const TIPO_SUBTITULO = {
  1:'El Perfeccionista ético',2:'El Servidor empático',3:'El Ejecutor exitoso',
  4:'El Artista auténtico',5:'El Experto analítico',6:'El Guardián leal',
  7:'El Visionario optimista',8:'El Líder protector',9:'El Mediador pacífico'
};
const TIPO_COLORS = {
  1:'#a8342c',2:'#be4b73',3:'#be8223',
  4:'#5f4b9b',5:'#345a9e',6:'#2d7360',
  7:'#c89123',8:'#943030',9:'#487c5c'
};
const TRIADA = {
  1:'Cuerpo',2:'Corazon',3:'Corazon',4:'Corazon',
  5:'Cabeza',6:'Cabeza',7:'Cabeza',8:'Cuerpo',9:'Cuerpo'
};
const TRIADA_COLORS = { Cuerpo:'#e17bd7', Corazon:'#e4c76a', Cabeza:'#6be1e3' };

// ─── Motivación y punto ciego ───────────────────────────────
const TIPO_MOTIVADOR = {
  1:'Hacer las cosas correctamente y mejorar el entorno',
  2:'Ser necesario, querido y reconocido por dar',
  3:'Lograr objetivos y ser valorado por sus resultados',
  4:'Ser auténtico y expresar su mundo interior único',
  5:'Comprender profundamente y preservar su autonomía',
  6:'Sentir seguridad y certeza en su entorno',
  7:'Vivir experiencias positivas y evitar el sufrimiento',
  8:'Tener control, impacto y proteger a los suyos',
  9:'Mantener la armonía y evitar el conflicto'
};
const TIPO_PUNTO_CIEGO = {
  1:'Rigidez: puede imponer sus estándares sin escuchar otras formas de hacer',
  2:'Dependencia: puede no identificar sus propias necesidades reales',
  3:'Imagen: puede priorizar la apariencia de éxito sobre el proceso genuino',
  4:'Idealización: puede devaluar lo presente buscando lo que le falta',
  5:'Desconexión: puede aislarse emocionalmente en momentos críticos',
  6:'Desconfianza: puede paralizar decisiones por anticipar riesgos excesivos',
  7:'Fuga: puede evitar el compromiso sostenido con lo difícil',
  8:'Vulnerabilidad: puede no mostrar fragilidad cuando el equipo la necesita',
  9:'Inercia: puede perder impulso propio al fusionarse con la agenda ajena'
};
const TIPO_ROL_EQUIPO = {
  1:'Guardián de calidad y procesos',
  2:'Cohesionador emocional del equipo',
  3:'Motor de resultados y visibilidad',
  4:'Alma creativa e innovadora',
  5:'Estratega y cerebro analítico',
  6:'Sistema inmune y voz crítica',
  7:'Combustible de ideas y energía',
  8:'Columna vertebral en momentos de crisis',
  9:'Mediador y pegamento humano'
};
const TIPO_FORTALEZAS = {
  1:['Estándares éticos elevados','Disciplina y organización','Detección temprana de errores','Procesos robustos'],
  2:['Empatía profunda','Red de relaciones amplia','Calidez y contención grupal','Inteligencia emocional alta'],
  3:['Energía contagiosa','Orientación a resultados','Resiliencia ante el fracaso','Adaptación al contexto'],
  4:['Creatividad única','Empatía con el dolor ajeno','Visión estética y profunda','Autenticidad radical'],
  5:['Análisis riguroso','Pensamiento sistémico','Independencia intelectual','Concentración excepcional'],
  6:['Lealtad profunda','Anticipación de riesgos','Compromiso inquebrantable','Memoria organizacional'],
  7:['Innovación y entusiasmo','Optimismo contagioso','Pensamiento lateral','Visión de oportunidades'],
  8:['Decisión y valentía','Protección del equipo','Liderazgo en crisis','Ejecución sin rodeos'],
  9:['Mediación natural','Capacidad de escucha','Presencia calmante','Visión integradora']
};
const TIPO_DESARROLLO = {
  1:'Trabajar la flexibilidad: aceptar que hay múltiples formas correctas de hacer. Practicar la autocompasión y la tolerancia al error propio y ajeno.',
  2:'Aprender a reconocer y comunicar sus propias necesidades. Dar sin esperar reciprocidad inmediata. Practicar el límite como acto de cuidado.',
  3:'Desacelerar para conectar con el proceso, no solo el resultado. Cultivar la autenticidad más allá de la imagen. Aprender a fallar sin colapsar.',
  4:'Desarrollar tolerancia a la frustración y capacidad de valorar lo cotidiano. Anclar proyectos creativos en planes concretos y plazos reales.',
  5:'Practicar la presencia emocional y la participación activa en el equipo. Compartir conocimiento antes de sentirlo "completo" o definitivo.',
  6:'Desarrollar confianza en su propio juicio. Tomar decisiones con información suficiente, no perfecta. Distinguir riesgo real de riesgo imaginado.',
  7:'Trabajar la capacidad de cierre y compromiso sostenido. Tolerar la incomodidad del proceso profundo sin escapar hacia nuevas ideas.',
  8:'Cultivar la vulnerabilidad estratégica. Escuchar antes de actuar en situaciones de alta carga emocional. Delegar desde la confianza.',
  9:'Reconectar con sus propias prioridades. Desarrollar iniciativa y capacidad de sostener posición ante el conflicto sin disolverse.'
};
const TIPO_COMUNICACION = {
  1:'Sé directo/a y fundamentado/a. Valorá su criterio antes de proponer cambios. Evitá la crítica sin contexto ni evidencia.',
  2:'Reconocé su aporte genuinamente antes de pedir algo. Conectá desde lo personal antes de ir al contenido técnico.',
  3:'Sé concreto/a y orientado/a a resultados. Mostrá cómo su rol impacta en los objetivos del equipo y del negocio.',
  4:'Conectá con el significado de lo que se pide. Validá su perspectiva única antes de pedir alineamiento o cambio.',
  5:'Dales tiempo y espacio antes de responder. Presentá la información estructurada, con evidencia y sin presión social.',
  6:'Sé consistente y predecible. Anticipá los posibles problemas y mostrá que los consideraste. Evitá la ambigüedad.',
  7:'Sé entusiasta y abierto/a a ideas. Evitá los "no" sin alternativas. Vinculá tareas a oportunidades y a futuro positivo.',
  8:'Sé directo/a y sin rodeos. Respetá su autoridad. Presentá los desafíos como oportunidades de impacto real.',
  9:'Dales tiempo para procesar. Pedí su opinión explícitamente y esperá. Evitá presionarlos cuando hay conflicto abierto.'
};
const TIPO_ROLES_IDEALES = {
  1:'Control de calidad · Compliance · Auditoría · Procesos · Mejora continua',
  2:'RRHH · Bienestar · Atención al cliente · Capacitación · Onboarding',
  3:'Ventas · Liderazgo de proyectos · Representación externa · Desarrollo de negocio',
  4:'Creatividad · Diseño · Marca · Cultura organizacional · Innovación',
  5:'Investigación · Estrategia · Data · Desarrollo de producto · Arquitectura',
  6:'Seguridad · Planificación · Soporte · Gestión de riesgos · Legales',
  7:'Comunicación · Marketing · Exploración de mercado · Nuevos negocios',
  8:'Dirección ejecutiva · Gestión de crisis · Negociación · Expansión',
  9:'Mediación · Coordinación · Soporte · Trabajo en equipo · Facilitación'
};
const LIDERAZGO_POTENCIAL = {
  8:{nivel:'Alto',razon:'Liderazgo natural en crisis, decisión y protección del equipo.'},
  3:{nivel:'Alto',razon:'Orientación a resultados y capacidad de inspirar al equipo.'},
  1:{nivel:'Alto',razon:'Estándares éticos y construcción de sistemas robustos.'},
  7:{nivel:'Medio',razon:'Visión innovadora y energía para movilizar al equipo.'},
  6:{nivel:'Medio',razon:'Lealtad, anticipación de riesgos y cohesión grupal.'},
  2:{nivel:'Medio',razon:'Liderazgo relacional y capacidad de sostener emocionalmente al equipo.'},
  9:{nivel:'Medio',razon:'Mediación e integración de perspectivas diversas y antagónicas.'},
  5:{nivel:'Situacional',razon:'Liderazgo experto en proyectos de alta complejidad técnica.'},
  4:{nivel:'Situacional',razon:'Liderazgo creativo en contextos de innovación y cultura.'}
};
const COMPATIBILIDAD = {
  '1-7':'Complementarios: el 1 aporta rigor, el 7 aporta visión y espontaneidad.',
  '2-8':'El 2 humaniza al 8, el 8 da dirección al 2. Alta sinergia.',
  '3-6':'El 3 impulsa resultados, el 6 cuida los riesgos. Dupla ejecutora.',
  '4-5':'Creatividad más análisis. Proyectos únicos y bien fundamentados.',
  '5-8':'El 5 aporta estrategia, el 8 ejecución. Alta potencia operativa.',
  '6-9':'Lealtad más armonía. Equipo sólido y estable bajo presión.',
  '7-1':'Entusiasmo más estándares. Innovación con calidad.',
  '2-4':'Empatía profunda compartida. Altamente sintonizados emocionalmente.',
  '3-8':'Dos motores de acción. Necesitan acordar dirección para no chocar.',
  '1-4':'Perfeccionismo más profundidad. Tensión creativa muy productiva.'
};
const TENSIONES = {
  '1-9':'El 1 exige, el 9 evita conflicto. Necesitan claridad de expectativas y acuerdos explícitos.',
  '3-4':'El 3 busca imagen, el 4 busca autenticidad. Tensión de valores puede ser desgastante.',
  '5-2':'El 5 necesita autonomía, el 2 necesita conexión. Gestionar ritmos y espacio personal.',
  '6-7':'El 6 anticipa riesgos, el 7 los ignora. Requieren acuerdos explícitos sobre gestión del riesgo.',
  '8-2':'El 8 confronta, el 2 evita. Pueden malinterpretarse mutuamente en situaciones de estrés.',
  '1-8':'Dos tipos que buscan control desde lógicas distintas. Necesitan roles bien definidos.',
  '9-8':'El 9 evita, el 8 confronta directamente. Pueden frustrarse y alejarse sin resolución.'
};
const TIPO_DESCRIPCION = {
  1:'Persona principios-centrada, con alto sentido del deber y compromiso con la excelencia. Trabaja con rigor y disciplina, y su aporte al equipo es sostener los estándares de calidad.',
  2:'Persona orientada a las relaciones, con una capacidad innata para percibir las necesidades ajenas. Su aporte al equipo es la cohesión emocional y la creación de vínculos de confianza.',
  3:'Persona orientada al logro y la eficacia. Tiene una energía contagiosa y una capacidad notable para adaptarse a lo que el contexto demanda. Mueve al equipo hacia sus objetivos.',
  4:'Persona con una vida interior rica y una sensibilidad especial para captar lo esencial. Aporta creatividad, autenticidad y profundidad emocional al equipo.',
  5:'Persona analítica y estratégica, con una mente rigurosa y capacidad de concentración excepcional. Aporta el pensamiento profundo y la planificación de largo plazo.',
  6:'Persona leal, comprometida y con alta capacidad de anticipar riesgos. Es la "memoria del equipo" y sostiene la cohesión y la responsabilidad colectiva.',
  7:'Persona entusiasta, creativa y generadora de ideas. Aporta energía positiva, visión de oportunidades y la capacidad de mantener el espíritu de equipo alto.',
  8:'Persona con una presencia natural de liderazgo. Toma decisiones con rapidez y valentía, protege a su equipo y genera un ambiente de acción y propósito.',
  9:'Persona con una capacidad especial para crear armonía y mediar en los conflictos. Aporta calma, escucha genuina y una visión integradora de todas las perspectivas.'
};
const TIPO_NIVEL_SANO = {
  1:'Principios firmes con apertura. Acepta la imperfección y guía con sabiduría práctica sin imposición.',
  2:'Ayuda desde la fortaleza, no la necesidad. Tiene límites claros y cuidado genuino sin manipulación.',
  3:'Auténtico en sus logros. Inspira con resultados reales y valora el proceso tanto como el destino.',
  4:'Creativo y emocionalmente equilibrado. Transforma su profundidad en arte y conexión real.',
  5:'Comparte su conocimiento con generosidad. Equilibra análisis con acción y presencia.',
  6:'Confía en sí mismo y en los demás. Actúa con valentía y sostiene al equipo con lealtad genuina.',
  7:'Presente en el momento. Integra la profundidad con el disfrute genuino sin escapismo.',
  8:'Líder que protege y da poder a otros. Usa su fortaleza para el bien común, no para el control.',
  9:'Presente y conectado. Toma posición con claridad y mantiene la paz desde la fortaleza interior.'
};
const TIPO_NIVEL_INSANO = {
  1:'Rigidez extrema, crítica destructiva y resentimiento acumulado que paraliza el equipo.',
  2:'Manipulación a través del servicio, dependencia emocional y reproches encubiertos.',
  3:'Engaño, imagen vacía y agotamiento por un ritmo insostenible de logros.',
  4:'Ensimismamiento, envidia paralizante y parálisis creativa profunda.',
  5:'Aislamiento total, acaparamiento de recursos e información y desconexión emocional.',
  6:'Paranoia, sabotaje pasivo o sumisión extrema ante cualquier figura de autoridad.',
  7:'Escapismo compulsivo, impulsividad y superficialidad que destruye proyectos.',
  8:'Control total, intimidación sistemática y negación absoluta de la vulnerabilidad propia.',
  9:'Disociación, negligencia propia total y rendición ante la voluntad ajena.'
};
const ENEAGRAMA_INTEGRACION    = {1:7,2:4,3:6,4:1,5:8,6:9,7:5,8:2,9:3};
const ENEAGRAMA_DESINTEGRACION = {1:4,2:8,3:9,4:2,5:7,6:3,7:1,8:5,9:6};

// ─── NUEVAS CONSTANTES GESTIÓN ──────────────────────────────────────────────
const TIPO_FEEDBACK_11 = {
  1:'Presentá el feedback con datos concretos y criterios objetivos. Reconocé su esfuerzo por la calidad antes de señalar áreas de mejora. El T1 necesita sentir que la crítica es justa y fundamentada, no arbitraria. Nunca uses un tono condescendiente — lo percibe como falta de respeto a su integridad. Separar siempre la persona de la conducta.',
  2:'Iniciá validando su contribución emocional al equipo. El T2 necesita sentir que su presencia importa más allá de lo que produce. Luego abrí el espacio para hablar de sus propias necesidades no cubiertas. Preguntale explícitamente qué necesita — no espera que se lo adivinen, pero tampoco lo pide solo. Terminar reforzando el vínculo.',
  3:'Sé directo/a con los logros primero — el T3 necesita sentir que su trabajo es genuinamente valorado antes de recibir cualquier ajuste. Enfocá las mejoras como una forma de elevar aún más su impacto, no como errores. Evitá el feedback en público que pueda afectar su imagen. Conectá cada cambio pedido con el resultado esperado.',
  4:'Empezá reconociendo su singularidad y profundidad de perspectiva. El T4 necesita sentir que su mirada única es vista y valorada antes de abrirse al feedback. Evitá compararlo/a con otros — lo percibe como invalidación de su identidad. Usá preguntas exploratorias más que afirmaciones. Dale tiempo para procesar emocionalmente.',
  5:'Mandá los puntos con anticipación para que llegue preparado/a. El T5 procesa mejor cuando tiene tiempo. En la reunión, respetá el silencio — es señal de que está procesando, no de desinterés. Presentá el feedback como datos objetivos, no como juicios de valor. Evitá el exceso de emocionalidad en la conversación.',
  6:'Antes del feedback, establecé el marco seguro: "Esta conversación es para ayudarte a crecer, no es una evaluación negativa." El T6 necesita certeza sobre las intenciones detrás del encuentro. Sé específico/a y evitá la ambigüedad. No dejes puntos sin resolver al final. Confirmá acuerdos por escrito.',
  7:'Mantené la energía positiva incluso al hablar de áreas de mejora. Formulá los desafíos como oportunidades de crecimiento y nuevas experiencias. El T7 responde bien cuando siente que el cambio lo lleva a algo mejor. Evitá reuniones largas y cargadas — preferí encuentros cortos y frecuentes. Conectá el feedback con su proyección futura.',
  8:'Sé absolutamente directo/a — el T8 no tolera el rodeo ni los eufemismos. Tratalé como un igual, no como un subordinado. Reconocé su poder y autoridad antes de hablar de ajustes. El feedback indirecto o "suavizado" lo interpreta como debilidad o falta de honestidad. Ir al grano y respetar su tiempo.',
  9:'Creá un espacio calmado y sin urgencia artificial. El T9 necesita tiempo para procesar y no se abre bajo presión. Pedí su opinión explícitamente y esperá — puede tener insights profundos que no comparte si no se lo preguntás. Evitá acumular feedback durante meses y descargarlo todo junto. Frecuencia y suavidad son clave.'
};

const TIPO_BURNOUT_SENALES = {
  1:['Se vuelve hipercrítico/a con el trabajo propio y del equipo','Perfeccionismo paralizante: nada está bien','Irritabilidad y rigidez extrema ante cualquier cambio','Dificultad total para delegar','Resentimiento acumulado hacia quienes no tienen sus estándares','Insomnio y tensión corporal crónica'],
  2:['Agotamiento emocional por sobre-ayuda sostenida','Resentimiento encubierto cuando no recibe reconocimiento','Comienza a quejarse del equipo en privado','Dificultad para decir que no a cualquier pedido','Descuido de su propia salud y necesidades','Llanto o emocionalidad sin causa aparente'],
  3:['Adicción al trabajo sin descanso real','Vacío emocional tras lograr objetivos importantes','Cambios de humor cuando los resultados no son visibles','Desconexión total de las relaciones personales','Imagen de "todo bien" que oculta agotamiento profundo','Dificultad para parar aunque el cuerpo lo pida'],
  4:['Melancolía prolongada y retiro social','Retiro de actividades que antes disfrutaba','Sensación intensa de no ser comprendido/a','Intensificación de la autocrítica destructiva','Envidia que paraliza en lugar de motivar','Dificultad para producir o crear'],
  5:['Aislamiento extremo — evita reuniones y contacto','Dificultad para terminar proyectos iniciados','Acaparamiento de información sin compartirla','Incapacidad de conectar con el equipo incluso cuando quiere','Parálisis por análisis — no puede decidir','Sensación de estar siempre al límite de sus recursos'],
  6:['Hipervigilancia y ansiedad que afecta el sueño','Cuestionamiento excesivo de sus propias decisiones','Búsqueda compulsiva de validación externa','Pensamiento catastrófico frecuente sobre el futuro','Dificultad para confiar incluso en personas de confianza','Parálisis ante cualquier cambio o incertidumbre'],
  7:['Hiperactividad sin foco real','Inicio de múltiples proyectos sin cerrar ninguno','Evasión sistemática de conversaciones difíciles','Irritabilidad cuando se le imponen límites o estructura','Distracción compulsiva — no puede quedarse quieto/a','Negación del propio agotamiento'],
  8:['Agresividad o control excesivo sobre el equipo','Incapacidad total para delegar o confiar en otros','Sensación de que "nadie lo/la puede"','Aislamiento detrás de una fortaleza que no se puede penetrar','Impulsos de renunciar o confrontar sin filtro','Dolores físicos por tensión acumulada'],
  9:['Inercia y procrastinación extrema','Dificultad para tomar decisiones simples del día a día','Desconexión de sus propias metas y deseos','Fusión total con las necesidades ajenas','Cansancio que no desaparece con el descanso','Sensación de invisibilidad y sin importancia']
};

const TIPO_RETENCION = {
  1:'Darles proyectos donde puedan aplicar sus estándares de excelencia con autonomía. Reconocer públicamente su ética de trabajo y su rigor. Ofrecerles participación en el diseño de procesos. Darles claridad de criterios y expectativas. Evitar entornos de trabajo mediocre, caótico o donde se premia la apariencia sobre la sustancia.',
  2:'Generar entornos donde se sientan valorados/as y necesarios/as de forma genuina. Reconocer su contribución emocional explícitamente y con frecuencia. Brindarles oportunidades de acompañar, capacitar o cuidar a otros. Involucrarlos en iniciativas de bienestar. Evitar roles aislados, puramente técnicos o donde nadie los vea.',
  3:'Ofrecer visibilidad, reconocimiento de logros y métricas claras de éxito. Darles objetivos ambiciosos y los recursos para alcanzarlos. Vincularlos a proyectos de alto impacto y visibilidad externa. Posibilidades reales de crecimiento y ascenso. Evitar entornos sin metas, sin reconocimiento o donde el mérito no sea visible.',
  4:'Crear espacio para la expresión creativa y auténtica dentro del trabajo. Validar su perspectiva única y diferencial. Darles proyectos con significado profundo, no solo funcional. Libertad para innovar en el cómo. Evitar entornos homogéneos, corporativos rígidos o donde no puedan diferenciarse.',
  5:'Respetar profundamente su autonomía y espacio de pensamiento. Darles acceso a información, recursos y tiempo de calidad. Asignarles proyectos de alta complejidad intelectual. Permitirles trabajar con independencia. Evitar entornos de alta exposición, demanda social constante o donde deban estar "siempre disponibles".',
  6:'Generar entornos de certeza, claridad y consistencia. Ser predecible en las expectativas y en los cambios. Darles rol en la anticipación y gestión de riesgos — que sientan que cuidan algo importante. Reconocer su lealtad explícitamente. Evitar contextos de alta ambigüedad, cambio abrupto sin comunicación o liderazgo inconsistente.',
  7:'Ofrecer variedad, nuevos proyectos y oportunidades de aprendizaje constante. Darles libertad para innovar y explorar. Vincularlos a iniciativas de futuro y expansión. Posibilidades de moverse entre roles. Evitar roles rutinarios, rígidos o sin espacio para la creatividad y la novedad.',
  8:'Darles autoridad real, responsabilidad de alto impacto y autonomía genuina para tomar decisiones. Reconocer su liderazgo explícita y públicamente. Posiciones de poder real, no cosmético. Respetarlos como pares. Evitar microgestión, contextos donde su poder sea ignorado o donde deban reportar a personas que perciben como débiles.',
  9:'Crear entornos de armonía y buen clima como norma, no como excepción. Darles roles de coordinación, mediación y facilitación donde su presencia calmante sea valorada. Asegurar explícitamente que su opinión es escuchada y tiene peso real. Evitar entornos de conflicto constante, alta presión o donde se sientan invisibles.'
};

const TIPO_CONFLICTO_GESTION = {
  1:'En conflicto, el T1 tiende a creer que tiene la razón objetiva y que el otro está equivocado. Puede volverse rígido/a y moralista. Necesita que el otro reconozca el error antes de poder avanzar. Estrategia: presentar los hechos con neutralidad, separar la persona de la conducta, y ofrecer criterios objetivos como árbitro neutral.',
  2:'El T2 evita el conflicto directo pero acumula resentimiento durante semanas o meses. Puede volverse indirecto/a o usar la culpa de manera encubierta. Estrategia: crear un espacio seguro donde pueda expresar sus necesidades sin sentir que "pide demasiado" o que va a dañar la relación al hacerlo.',
  3:'El T3 en conflicto puede volverse esquivo/a para proteger su imagen pública. Prioriza resolver rápido para seguir avanzando, incluso si la resolución es superficial. Estrategia: abordar el conflicto en privado, enmarcarlo como un obstáculo a superar juntos, y vincular la resolución a un mejor resultado colectivo.',
  4:'El T4 puede intensificar el conflicto emocionalmente y quedarse en él más tiempo del necesario. Necesita ser profundamente escuchado/a antes de poder resolver. Estrategia: validar su experiencia emocional sin necesariamente darle la razón en los hechos. Separar el reconocimiento del acuerdo.',
  5:'El T5 se retira del conflicto y necesita tiempo para procesar. Puede parecer indiferente cuando en realidad está procesando internamente con alta intensidad. Estrategia: darle espacio y tiempo sin presión, luego retomar la conversación en un contexto calmado y estructurado, preferentemente por escrito primero.',
  6:'El T6 en conflicto puede dudar de sus propias percepciones y alternar entre confrontar y retirarse según el nivel de ansiedad. Estrategia: ser claro/a y tranquilizador/a sobre las intenciones. Mostrar que el conflicto es manejable y no amenaza la relación ni la pertenencia al grupo.',
  7:'El T7 tiende a reencuadrar el conflicto o evitarlo cambiando de tema hacia algo más positivo. Puede parecer que no le importa cuando en realidad teme la pérdida de armonía y disfrute. Estrategia: invitarlo/a a quedarse en el tema sin juzgar la evasión, y conectar la resolución con un mejor futuro.',
  8:'El T8 confronta directamente y puede escalar rápido, subiendo la intensidad emocional. Respeta profundamente a quien le responde con firmeza y claridad. Estrategia: no ceder ante la presión, mantener la calma y la posición propia sin atacar su autoridad. La firmeza respetuosa genera más respeto que la sumisión.',
  9:'El T9 evita el conflicto a toda costa y puede parecer de acuerdo cuando en realidad no lo está — el disenso no expresado se convierte en inercia o retiro pasivo. Estrategia: crear espacio explícito para su desacuerdo, preguntar directamente qué piensa, y no interpretar el silencio como acuerdo.'
};

const TIPO_COMO_LIDERAR = {
  1:'Liderá con criterio y claridad. Establecé estándares de calidad explícitos. Dale participación en la definición de procesos — siente que el trabajo se hace "bien" si tuvo parte en el diseño. Reconocé su ética y rigor antes de pedir cambios. No improvises frente a él/ella: la falta de preparación lo/la irrita profundamente.',
  2:'Liderá desde el vínculo y el reconocimiento genuino. El T2 necesita sentir que te importa como persona, no solo como recurso. Preguntale cómo está, qué necesita. Reconocé públicamente su aporte al equipo. Dale roles de mentoría o cuidado de otros. Evitá liderazgos distantes, puramente transaccionales.',
  3:'Liderá desde los resultados y el reconocimiento del logro. Dale objetivos claros, métricas de éxito y visibilidad. Celebrá sus victorias públicamente. Conectá su trabajo con el impacto de la organización. Dale autonomía para elegir el cómo — solo pedile el qué y el cuándo. Evitá el micromanagement.',
  4:'Liderá desde el significado y la autenticidad. El T4 necesita sentir que su trabajo tiene propósito real. Dale proyectos que lo/la desafíen creativamente. Involucralé en decisiones sobre cultura, valores e identidad de equipo. Evitá el liderazgo corporativo frío — necesita sentir que hay un ser humano del otro lado.',
  5:'Liderá desde el respeto a su autonomía e inteligencia. Dale contexto completo y tiempo para procesar. Evitá las reuniones largas sin agenda. Respetá su espacio y sus tiempos — no lo/la interrumpas cuando está en foco. Dale acceso a recursos y reconocé su expertise públicamente. No le pidas que "sea más social" sin un contexto de confianza.',
  6:'Liderá con consistencia, transparencia y claridad. El T6 necesita predecibilidad para confiar. Comunicá los cambios con anticipación y con contexto completo. Incluilo/a en la anticipación de riesgos — se sentirá parte de la solución. Reconocé su lealtad. Nunca lo/la dejes en la ambigüedad sobre su posición o el futuro del equipo.',
  7:'Liderá desde la inspiración y las posibilidades. Conectá su trabajo con una visión emocionante de futuro. Dale variedad, nuevos proyectos y libertad creativa. Sostené los compromisos con energía positiva, no con control. Ayudalo/a a cerrar ciclos — es su punto más difícil. Celebrá las ideas aunque no todas se ejecuten.',
  8:'Liderá desde la firmeza y el respeto mutuo. El T8 no tolera los liderazgos débiles o indirectos. Sé directo/a, decidido/a y claro/a en lo que esperás. Demostrá que podés sostener tu posición aunque te confronte. Dale poder real, no cosmético. Involucralé en las decisiones grandes — no le presentes el resultado sin el proceso.',
  9:'Liderá con paciencia y presencia. Dale tiempo para procesar, no lo/la apures. Pedí su opinión explícitamente — no asumas su acuerdo por su silencio. Reconocé su capacidad de ver todos los puntos de vista. Ayudalo/a a priorizar y a tomar posición. Creá entornos de armonía y claridad de roles donde no tenga que estar resolviendo tensiones constantemente.'
};

const TIPO_DESEMPENO_ESPERAR = {
  1:{fortaleza:'Alta calidad en la ejecución, procesos claros y documentados, cumplimiento riguroso de compromisos.',limitacion:'Puede bloquear la entrega perfecta por sobre optimizar. Dificultad para aceptar soluciones "suficientemente buenas". Puede generar tensión con el equipo cuando sus estándares no son compartidos.',indicadores:'Evaluar por calidad del output, precisión, y capacidad de mejorar procesos sin paralizar la operación.'},
  2:{fortaleza:'Altísima efectividad en roles relacionales, cohesión del equipo, retención de talento, resolución informal de conflictos.',limitacion:'Puede sacrificar rendimiento propio por ayudar a otros. Dificultad con metas individuales cuando hay necesidades grupales urgentes.',indicadores:'Evaluar por impacto relacional, clima del equipo y capacidad de establecer límites sin dejar de cuidar.'},
  3:{fortaleza:'Entrega de resultados con energía y consistencia, alta adaptabilidad al contexto y capacidad de movilizar al equipo.',limitacion:'Puede priorizar la apariencia del logro sobre el proceso real. Riesgo de burnout por sobre exigencia autogenerada.',indicadores:'Evaluar resultados concretos, pero también el proceso y la sostenibilidad. Cuidar que no infle métricas.'},
  4:{fortaleza:'Innovación genuina, calidad estética y conceptual elevada, aporte único de perspectivas que otros no ven.',limitacion:'Irregularidad en la producción: picos de brillantez y valles de parálisis. Dificultad con tareas rutinarias o sin significado.',indicadores:'Evaluar por la calidad del aporte creativo y por la capacidad de completar proyectos, no solo de iniciarlos.'},
  5:{fortaleza:'Análisis profundo, estrategia de largo plazo, resolución de problemas complejos, pensamiento sistémico.',limitacion:'Puede tardar más de lo necesario en decidir o actuar. Dificultad para comunicar su trabajo a no-expertos.',indicadores:'Evaluar por calidad del análisis, claridad en la comunicación de sus conclusiones y capacidad de pasar a la acción.'},
  6:{fortaleza:'Confiabilidad extrema, cumplimiento de compromisos, anticipación de riesgos, construcción de confianza institucional.',limitacion:'Puede paralizar proyectos por exceso de análisis de riesgo. Necesita más validación que otros antes de avanzar.',indicadores:'Evaluar por consistencia, lealtad institucional y capacidad de tomar decisiones bajo incertidumbre razonable.'},
  7:{fortaleza:'Alta generación de ideas, energía y entusiasmo que mueve al equipo, visión de oportunidades, innovación.',limitacion:'Dificultad para cerrar proyectos. Puede dispersarse y dejar cosas incompletas. Bajo umbral de aburrimiento.',indicadores:'Evaluar por tasa de cierre de proyectos iniciados, no solo por la calidad de las ideas generadas.'},
  8:{fortaleza:'Ejecución rápida, decisión en momentos de crisis, capacidad de movilizar recursos y personas hacia objetivos.',limitacion:'Puede generar tensión por el estilo directivo. Dificultad para delegar o confiar en el proceso de otros.',indicadores:'Evaluar por impacto real, capacidad de construir equipo y resultados sostenibles, no solo de crisis resueltas.'},
  9:{fortaleza:'Coordinación efectiva, mediación de conflictos, integración de perspectivas diversas, clima laboral positivo.',limitacion:'Puede perder iniciativa propia y diluirse en las agendas ajenas. Dificultad para medir su propio impacto.',indicadores:'Evaluar por impacto en la cohesión del equipo, capacidad de iniciativa propia y efectividad en la coordinación.'}
};

const TIPO_CAPACITACION = {
  1:'Metodologías: casos de estudio con criterios claros, análisis de errores y mejora continua. Contenidos que resuenan: ética profesional, gestión de calidad, liderazgo desde principios. Evitar: dinámicas caóticas o sin estructura, facilitadores que no tienen dominio del tema.',
  2:'Metodologías: aprendizaje colaborativo, roleplay de situaciones relacionales, grupos pequeños. Contenidos que resuenan: comunicación empática, bienestar organizacional, liderazgo de equipos. Evitar: capacitaciones puramente técnicas sin componente humano, entornos competitivos y fríos.',
  3:'Metodologías: formatos intensivos con resultados visibles y tangibles, coaching ejecutivo, casos de éxito. Contenidos que resuenan: liderazgo de alto desempeño, presentación ejecutiva, negociación. Evitar: capacitaciones largas sin aplicación práctica inmediata ni métricas de impacto.',
  4:'Metodologías: talleres experienciales, arte-terapia organizacional, exploración creativa con libertad de expresión. Contenidos que resuenan: creatividad aplicada, innovación, cultura organizacional e identidad. Evitar: capacitaciones estandarizadas y corporativas que no dejan espacio a la expresión individual.',
  5:'Metodologías: autoaprendizaje, lecturas profundas, clases magistrales de alta calidad, investigación propia. Contenidos que resuenan: estrategia, pensamiento sistémico, análisis de datos, tecnología avanzada. Evitar: dinámicas grupales forzadas, roleplay emocional, contenidos superficiales sin fundamento.',
  6:'Metodologías: capacitación estructurada con bibliografía sólida, mentoring de personas confiables, grupos estables. Contenidos que resuenan: gestión de riesgos, toma de decisiones bajo incertidumbre, liderazgo transformacional. Evitar: capacitaciones caóticas, cambios de facilitador frecuentes, contenidos sin respaldo.',
  7:'Metodologías: experiencias inmersivas, hackathons, formatos cortos y variados, gamificación. Contenidos que resuenan: innovación, design thinking, emprendimiento, tendencias del futuro. Evitar: capacitaciones largas y lineales sin variedad, contenidos densos y repetitivos, entornos sin energía.',
  8:'Metodologías: workshops intensivos de alto impacto, conversaciones directas con expertos, coaching ejecutivo. Contenidos que resuenan: liderazgo en crisis, negociación avanzada, gestión del poder e influencia. Evitar: capacitaciones que los traten como aprendices en lugar de líderes, dinámicas infantilizantes.',
  9:'Metodologías: aprendizaje experiencial en grupos armoniosos, facilitadores empáticos, proceso gradual sin urgencia. Contenidos que resuenan: mediación de conflictos, facilitación grupal, desarrollo personal, propósito. Evitar: capacitaciones de alta presión, competitivas o que requieran posicionamiento público forzado.'
};

// ─── Estado ──────────────────────────────────────────────────────────────────
let allPersons       = [];
let filteredPersons  = [];
let chartMain        = null;
let chartTriadas     = null;
let chartClima       = null;
let chartEnergia     = null;
let currentChartType = 'bar';
let currentSection   = 'overview';
let currentModalIdx  = 0;
let currentModalTab  = 'perfil';

// ─── Cálculo ─────────────────────────────────────────────────────────────────
const QUESTIONS_TY = [
  1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,
  1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,
  1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,
  1,2,3,4,5,6,7,8,9
];

function calcularEneagrama(rawString) {
  const answers = {};
  const pairs = (rawString||'').match(/\d+;\d+/g)||[];
  pairs.forEach(p => {
    const [q,v] = p.split(';').map(Number);
    if (q>=1&&q<=90&&v>=1&&v<=5) answers[q-1]=v;
  });
  const raw = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  for (let i=0;i<QUESTIONS_TY.length;i++) if (answers[i]!==undefined) raw[QUESTIONS_TY[i]]+=answers[i];
  let totalRaw=0;
  for (let t=1;t<=9;t++) totalRaw+=raw[t];
  const scores={};
  let maxT=1;
  for (let t=1;t<=9;t++) { scores[t]=totalRaw>0?Math.round((raw[t]/totalRaw)*100):0; if(raw[t]>raw[maxT])maxT=t; }
  let suma=0; for (let t=1;t<=9;t++) suma+=scores[t];
  if (suma!==100&&totalRaw>0) scores[maxT]+=(100-suma);
  let base=1; for (let t=2;t<=9;t++) if(scores[t]>scores[base])base=t;
  const ala1=base===1?9:base-1, ala2=base===9?1:base+1;
  const alaDominante=scores[ala1]>=scores[ala2]?ala1:ala2;
  return { base, scores, rawScores:raw, ala1, ala2, alaDominante,
    alaScore1:scores[ala1]||0, alaScore2:scores[ala2]||0,
    integracion:ENEAGRAMA_INTEGRACION[base], desintegracion:ENEAGRAMA_DESINTEGRACION[base] };
}

function buildPerson(p, calc) {
  return {
    nombre:(String(p.Nombre||'')+' '+String(p.Apellido||'')).trim()||p.User||'Sin nombre',
    email:p.Correo||'', fecha:p.Fecha||'', user:p.User||'',
    tipo:calc.base, scores:calc.scores, rawScores:calc.rawScores,
    ala1:calc.ala1, ala2:calc.ala2, alaDominante:calc.alaDominante,
    alaScore1:calc.alaScore1, alaScore2:calc.alaScore2,
    integracion:calc.integracion, desintegracion:calc.desintegracion,
    respuestas:p.Respuestas,
    _nombre:String(p.Nombre||''), _apellido:String(p.Apellido||'')
  };
}

// ═══════════════════════════════════════════════════════════
// OVERLAY — idéntico al AdminDashboard
// ═══════════════════════════════════════════════════════════
const OVERLAY_ID = 'oneLoadingOverlay';

function showOverlay(mensaje) {
  let el = document.getElementById(OVERLAY_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = OVERLAY_ID;
    el.innerHTML = `<div class="overlay-inner"><div class="overlay-logo-wrap"><div class="overlay-glow"></div><div class="overlay-arc-outer"></div><div class="overlay-arc-inner"></div><div class="overlay-arc-base"></div><img src="../../img/one-iconocolor.png" alt="ONE" class="overlay-logo" onerror="this.src='../../img/one-icononegro.png'"></div><div class="overlay-text"><p class="overlay-msg" id="overlayMsg">Cargando...</p><p class="overlay-sub" id="overlaySub"></p></div></div>`;
    document.body.appendChild(el);
    if (!document.getElementById('oneOverlayStyles')) {
      const s = document.createElement('style');
      s.id = 'oneOverlayStyles';
      s.textContent = `#oneLoadingOverlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.78);backdrop-filter:blur(14px) saturate(1.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s ease;pointer-events:none;}#oneLoadingOverlay.visible{opacity:1;pointer-events:auto;}.overlay-inner{display:flex;flex-direction:column;align-items:center;gap:14px;}.overlay-logo-wrap{position:relative;width:90px;height:90px;}.overlay-glow{position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(circle,rgba(225,123,215,0.2) 0%,transparent 70%);animation:ovGlow 2s ease-in-out infinite;pointer-events:none;}.overlay-arc-outer{position:absolute;inset:-4px;border-radius:50%;border:2.5px solid transparent;border-top-color:#e17bd7;border-right-color:rgba(225,123,215,0.5);animation:ovSpin .8s linear infinite;}.overlay-arc-inner{position:absolute;inset:-4px;border-radius:50%;border:2.5px solid transparent;border-bottom-color:rgba(200,100,240,0.3);animation:ovSpin 1.8s linear infinite reverse;}.overlay-arc-base{position:absolute;inset:-4px;border-radius:50%;border:2.5px solid rgba(225,123,215,0.08);}.overlay-logo{width:90px;height:90px;border-radius:50%;object-fit:cover;position:relative;z-index:2;display:block;filter:drop-shadow(0 0 8px rgba(225,123,215,0.25));}.overlay-text{text-align:center;line-height:1.4;}.overlay-msg{margin:0;font-size:.93rem;font-weight:600;color:rgba(255,255,255,.9);font-family:'Exo 2',system-ui,sans-serif;letter-spacing:.02em;}.overlay-sub{margin:3px 0 0;font-size:.75rem;color:rgba(225,123,215,.72);font-family:'Exo 2',system-ui,sans-serif;letter-spacing:.03em;min-height:16px;}@keyframes ovSpin{to{transform:rotate(360deg);}}@keyframes ovGlow{0%,100%{opacity:.6;transform:scale(1);}50%{opacity:1;transform:scale(1.1);}}`;
      document.head.appendChild(s);
    }
  }
  document.getElementById('overlayMsg').textContent = mensaje||'Cargando...';
  document.getElementById('overlaySub').textContent = '';
  el.getBoundingClientRect();
  requestAnimationFrame(()=>el.classList.add('visible'));
}
function updateOverlay(sub) { const el=document.getElementById('overlaySub'); if(el) el.textContent=sub||''; }
function hideOverlay() {
  const el=document.getElementById(OVERLAY_ID); if(!el) return;
  el.classList.remove('visible');
  setTimeout(()=>el?.parentNode?.removeChild(el),300);
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  const session = Auth.getSession();
  if (session) document.getElementById('adminName').textContent = session.userName||session.userEmail;
  const ls = document.getElementById('loadingScreen');
  if (ls) ls.style.display = 'none';

  const cached = loadPanelCache();
  if (cached && cached.length > 0) {
    allPersons = cached; filteredPersons = [...allPersons];
    renderAll();
    refreshInBackground();
  } else {
    showOverlay('Cargando datos del equipo...');
    await loadData();
  }
});

async function refreshInBackground() {
  try {
    const session = Auth.getSession();
    const usersJson = await Helpers.fetchGET(CONFIG.api.gestionAdmin);
    if (!Array.isArray(usersJson)) return;
    const userList = usersJson.filter(r =>
      String(r.Usuario_Admin||'').trim()===String(session.userName||'').trim() && String(r.User||'').trim()!==''
    );
    if (!userList.length) return;
    const results = await Promise.all(userList.map(async u => {
      const un = String(u.User||'').trim(); if(!un) return null;
      try {
        const r = await fetch(CONFIG.api.informes+'?user='+encodeURIComponent(un));
        const j = await r.json();
        if (j.success&&j.data&&String(j.data.Respuestas||'').trim().length>10) return j.data;
        return null;
      } catch(e){ return null; }
    }));
    const newPersons = results.filter(Boolean).map(p=>buildPerson(p,calcularEneagrama(p.Respuestas)));
    if (JSON.stringify(newPersons.map(p=>p.email))!==JSON.stringify(allPersons.map(p=>p.email))) {
      allPersons=newPersons; filteredPersons=[...allPersons];
      savePanelCache(allPersons); renderAll();
    }
  } catch(e){ console.warn('[BG]',e); }
}

async function loadData() {
  try {
    const session = Auth.getSession();
    updateOverlay('Obteniendo usuarios...');
    let usersJson;
    try { usersJson = await Helpers.fetchGET(CONFIG.api.gestionAdmin); }
    catch(e){ hideOverlay(); allPersons=[]; filteredPersons=[]; renderAll(); return; }
    let userList=[];
    if (Array.isArray(usersJson)) userList = usersJson.filter(r =>
      String(r.Usuario_Admin||'').trim()===String(session.userName||'').trim()&&String(r.User||'').trim()!==''
    );
    if (!userList.length){ hideOverlay(); allPersons=[]; filteredPersons=[]; renderAll(); return; }
    updateOverlay('Verificando evaluaciones ('+userList.length+' usuarios)...');
    const results = await Promise.all(userList.map(async u=>{
      const un=String(u.User||'').trim(); if(!un) return null;
      try {
        const c=new AbortController(); const t=setTimeout(()=>c.abort(),10000);
        const r=await fetch(CONFIG.api.informes+'?user='+encodeURIComponent(un),{signal:c.signal});
        clearTimeout(t); const j=await r.json();
        if(j.success&&j.data&&String(j.data.Respuestas||'').trim().length>10) return j.data;
        return null;
      } catch(e){ return null; }
    }));
    allPersons=results.filter(Boolean).map(p=>buildPerson(p,calcularEneagrama(p.Respuestas)));
    filteredPersons=[...allPersons];
    savePanelCache(allPersons); renderAll();
  } catch(err){ console.error('[Dashboard]',err); hideOverlay(); allPersons=[]; filteredPersons=[]; renderAll(); }
}

function renderAll() {
  hideOverlay();
  const ls=document.getElementById('loadingScreen'); if(ls) ls.style.display='none';
  document.getElementById('mainContent').style.display='block';
  renderHeroStats(); renderCharts(); renderTeamGrid();
  renderInsights(); renderCompatibility();
  renderGestion(); renderCultura();
}

function reloadData() {
  clearPanelCache();
  document.getElementById('mainContent').style.display='none';
  showOverlay('Actualizando datos del equipo...');
  loadData();
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function switchSection(name) {
  currentSection=name;
  document.querySelectorAll('.section-pane').forEach(el=>el.classList.add('hidden'));
  const t=document.getElementById('section-'+name); if(t) t.classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    const oc=btn.getAttribute('onclick')||'';
    btn.classList.toggle('active', oc.includes("'"+name+"'"));
  });
}

// ─── Stats ───────────────────────────────────────────────────────────────────
function renderHeroStats() {
  const total=allPersons.length;
  const typesPresent=new Set(allPersons.map(p=>p.tipo)).size;
  const typeCount={}; allPersons.forEach(p=>{typeCount[p.tipo]=(typeCount[p.tipo]||0)+1;});
  const dominantType=Object.entries(typeCount).sort((a,b)=>b[1]-a[1])[0];
  const tc={Cuerpo:0,Corazon:0,Cabeza:0}; allPersons.forEach(p=>{tc[TRIADA[p.tipo]]++;});
  const dominantTriada=Object.entries(tc).sort((a,b)=>b[1]-a[1])[0];
  const diversidad=typesPresent>0?Math.min(100,Math.round((typesPresent/9)*100*(1-Math.abs(0.5-(dominantType?dominantType[1]/total:0))))):0;
  setText('statTotal',total); setText('statTypes',typesPresent);
  setText('statDominant',dominantType?`T${dominantType[0]} · ${TIPO_CORTO[dominantType[0]]}`:'—');
  setText('statTriada',dominantTriada?(dominantTriada[0]==='Corazon'?'Corazón':dominantTriada[0]):'—');
  setText('statDiversidad',total>0?`${diversidad}/100`:'—');
}

// ─── Charts ──────────────────────────────────────────────────────────────────
function renderCharts(){ renderMainChart(); renderTriadasChart(); }

function renderMainChart(){
  const tc={}; for(let t=1;t<=9;t++) tc[t]=0;
  filteredPersons.forEach(p=>tc[p.tipo]++);
  const labels=Object.keys(tc).map(t=>`T${t}`);
  const data=Object.values(tc);
  const colors=Object.keys(tc).map(t=>TIPO_COLORS[t]);
  if(chartMain) chartMain.destroy();
  const ctx=document.getElementById('chartMain').getContext('2d');
  if(currentChartType==='bar'){
    chartMain=new Chart(ctx,{type:'bar',data:{labels,datasets:[{data,backgroundColor:colors,borderRadius:6,borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#a4a8c0',font:{family:'Exo 2',size:11}}},y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#a4a8c0',font:{family:'Exo 2',size:11},stepSize:1},beginAtZero:true}}}});
  } else {
    chartMain=new Chart(ctx,{type:'radar',data:{labels:Object.keys(tc).map(t=>TIPO_CORTO[t]),datasets:[{data,backgroundColor:'rgba(107,225,227,0.12)',borderColor:'#6be1e3',borderWidth:2,pointBackgroundColor:colors,pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#a4a8c0',backdropColor:'transparent',font:{size:8},stepSize:1},pointLabels:{color:'#a4a8c0',font:{family:'Exo 2',size:9}}}}}});
  }
}

function switchChart(type){
  currentChartType=type;
  document.getElementById('btnBar').classList.toggle('active',type==='bar');
  document.getElementById('btnRadar').classList.toggle('active',type==='radar');
  renderMainChart();
}

function renderTriadasChart(){
  const tc={Cuerpo:0,Corazon:0,Cabeza:0};
  filteredPersons.forEach(p=>tc[TRIADA[p.tipo]]++);
  const total=filteredPersons.length||1;
  if(chartTriadas) chartTriadas.destroy();
  const ctx=document.getElementById('chartTriadas').getContext('2d');
  chartTriadas=new Chart(ctx,{type:'doughnut',data:{labels:['Cuerpo','Corazón','Cabeza'],datasets:[{data:[tc.Cuerpo,tc.Corazon,tc.Cabeza],backgroundColor:[TRIADA_COLORS.Cuerpo,TRIADA_COLORS.Corazon,TRIADA_COLORS.Cabeza],borderWidth:0,hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false}}}});
  document.getElementById('triadaLegend').innerHTML=['Cuerpo','Corazon','Cabeza'].map(n=>{
    const label=n==='Corazon'?'Corazón':n;
    return `<div class="triada-row"><div class="triada-dot" style="background:${TRIADA_COLORS[n]}"></div><span class="flex-1 text-white font-semibold text-xs">${label}</span><span class="text-one-slate font-mono text-[10px]">${tc[n]} pers.</span><span class="text-one-cyan font-mono text-[10px] ml-2">${Math.round(tc[n]/total*100)}%</span></div>`;
  }).join('');
}

// ─── Team Grid ────────────────────────────────────────────────────────────────
function renderTeamGrid(){
  const grid=document.getElementById('teamGrid'); if(!grid) return;
  if(!filteredPersons.length){ grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;color:#a4a8c0;padding:40px;font-size:0.82rem">Sin evaluados con ese filtro</div>`; return; }
  grid.innerHTML=filteredPersons.map((p,i)=>`
    <div class="person-card" style="--tc:${TIPO_COLORS[p.tipo]}">
      <div class="p-type-badge" style="background:${TIPO_COLORS[p.tipo]}">${p.tipo}</div>
      <div class="p-name">${esc(p.nombre)}</div>
      <div class="p-tipo">T${p.tipo} — ${TIPO_CORTO[p.tipo]}</div>
      <div class="p-bar"><div class="p-fill" style="width:${p.scores[p.tipo]}%;background:${TIPO_COLORS[p.tipo]}"></div></div>
      <div class="p-actions">
        <button class="p-btn p-btn-p" onclick="openPersonModal(${i},'perfil')">Perfil</button>
        <button class="p-btn p-btn-i" onclick="openPersonModal(${i},'informe')">Informe</button>
      </div>
    </div>`).join('');
}

function filterTeam(){
  const triada=document.getElementById('filterTriada').value;
  const tipo=document.getElementById('filterType').value;
  const search=(document.getElementById('searchPerson')?.value||'').toLowerCase();
  filteredPersons=allPersons.filter(p=>{
    if(triada&&TRIADA[p.tipo]!==triada) return false;
    if(tipo&&p.tipo!==parseInt(tipo)) return false;
    if(search&&!p.nombre.toLowerCase().includes(search)) return false;
    return true;
  });
  renderTeamGrid(); renderMainChart(); renderTriadasChart();
}

// ─── Insights ─────────────────────────────────────────────────────────────────
function renderInsights(){
  const grid=document.getElementById('insightsGrid'); if(!grid) return;
  const ins=generateInsights();
  grid.innerHTML=ins.map(i=>`<div class="insight-card" style="--acc:${i.color}"><div class="insight-tag">${i.tag}</div><div class="insight-title">${i.title}</div><div class="insight-text">${i.text}</div></div>`).join('');
}

function generateInsights(){
  const total=allPersons.length;
  if(!total) return [{tag:'Sin datos',title:'Sin evaluados',text:'Cuando los usuarios completen el test verás el análisis aquí.',color:'#a4a8c0'}];
  const tc={}; for(let t=1;t<=9;t++) tc[t]=0;
  allPersons.forEach(p=>tc[p.tipo]++);
  const triC={Cuerpo:0,Corazon:0,Cabeza:0}; allPersons.forEach(p=>triC[TRIADA[p.tipo]]++);
  const topType=Object.entries(tc).sort((a,b)=>b[1]-a[1])[0];
  const topTriada=Object.entries(triC).sort((a,b)=>b[1]-a[1])[0];
  const absent=Object.entries(tc).filter(([,v])=>v===0).map(([t])=>t);
  const hasLeader=allPersons.some(p=>[1,3,8].includes(p.tipo));
  const hasCohesion=allPersons.some(p=>[2,6,9].includes(p.tipo));
  const hasCreative=allPersons.some(p=>[4,5,7].includes(p.tipo));
  const avgScore=Math.round(allPersons.reduce((s,p)=>s+p.scores[p.tipo],0)/allPersons.length);
  const domLabel=topTriada[0]==='Corazon'?'Corazón':topTriada[0];
  const typeInsightMap={1:'Alto estándar y rigor en procesos. Puede volverse rígido ante el cambio.',2:'Alta empatía y cohesión emocional. Puede tener dificultad para el feedback directo.',3:'Orientado a resultados con alta energía. Riesgo: priorizar imagen sobre proceso genuino.',4:'Alta creatividad y profundidad. Necesita estructura para concretar ideas en resultados.',5:'Análisis riguroso y estratégico. Puede tener dificultad para la acción rápida bajo incertidumbre.',6:'Alta lealtad y anticipación de riesgos. Puede necesitar trabajo en autonomía bajo presión.',7:'Creatividad y entusiasmo naturales. El principal desafío es sostener compromisos hasta el cierre.',8:'Alta determinación y ejecución. Necesita trabajo en escucha activa y vulnerabilidad.',9:'Excelente mediación y armonía. Puede necesitar líderes que tomen posición clara.'};
  const triadaMap={Cuerpo:`${Math.round(triC.Cuerpo/total*100)}% procesa desde el instinto y la acción directa. Son ejecutores naturales. La emoción subyacente es la ira: necesita canales de expresión saludables.`,Corazon:`${Math.round(triC.Corazon/total*100)}% toma decisiones desde las emociones y la imagen. Alta inteligencia relacional. Necesitan entornos de reconocimiento genuino para rendir a su mejor nivel.`,Cabeza:`${Math.round(triC.Cabeza/total*100)}% analiza antes de actuar. Alta capacidad estratégica. Pueden necesitar estructura para pasar del análisis a la acción.`};
  return [
    {tag:'Composición',color:TIPO_COLORS[topType[0]],title:`Predomina Tipo ${topType[0]} — ${TIPO_CORTO[topType[0]]}`,text:`${topType[1]} de ${total} personas (${Math.round(topType[1]/total*100)}%). ${typeInsightMap[parseInt(topType[0])]}` },
    {tag:'Tríada dominante',color:TRIADA_COLORS[topTriada[0]],title:`Centro ${domLabel} predominante`,text:triadaMap[topTriada[0]]||''},
    ...(absent.length?[{tag:'Gaps del equipo',color:'#ffb86c',title:`${absent.length} eneatipo${absent.length>1?'s':''} ausente${absent.length>1?'s':''}`,text:`Sin T${absent.join(', T')}. Puntos ciegos: ${absent.slice(0,2).map(t=>TIPO_ROL_EQUIPO[t]).join(' · ')}.`}]:[]),
    {tag:'Fortalezas colectivas',color:'#50fa7b',title:'Capacidades naturales del equipo',text:[hasLeader?'✓ Liderazgo y ejecución (T1,T3 o T8)':'✗ Falta perfil de liderazgo',hasCohesion?'✓ Cohesión y lealtad (T2,T6 o T9)':'✗ Falta cohesionador emocional',hasCreative?'✓ Creatividad e innovación (T4,T5 o T7)':'✗ Falta perfil creativo/analítico'].join('<br>')},
    {tag:'Score promedio',color:'#e4c76a',title:`Score base promedio del equipo: ${avgScore}%`,text:`Un score >50% indica claridad tipológica: cada persona tiene un patrón predominante bien definido, lo que facilita predecir comportamientos bajo presión y diseñar estrategias de gestión personalizadas.`},
    {tag:'Comunicación',color:'#e17bd7',title:'Estilo comunicacional predominante',text:{Cuerpo:'El equipo valora mensajes concretos y orientados a la acción. Las conversaciones más efectivas van directo al punto y tienen responsabilidades claras.',Corazon:'El equipo valora la conexión personal antes del contenido. Los mensajes impactan más cuando incluyen reconocimiento genuino y contexto relacional.',Cabeza:'El equipo necesita datos y fundamentos antes de comprometerse. La estructura, la evidencia y la anticipación de riesgos multiplican la adhesión.'}[topTriada[0]]||''},
    {tag:'Recomendación',color:'#6be1e3',title:'Próximos pasos sugeridos',text:(()=>{const absent2=Object.entries(tc).filter(([,v])=>v===0).map(([t])=>parseInt(t));if(absent2.includes(8)||absent2.includes(3))return 'El equipo carece de perfiles de alta ejecución (T3 o T8). Considerar roles de liderazgo externo o desarrollar esa capacidad en perfiles actuales.';if(triC.Cabeza>total*0.6)return 'El equipo es altamente analítico. Para proyectos de ejecución rápida, incorporar facilitadores que aceleren la toma de decisiones.';if(triC.Corazon>total*0.6)return 'Excelente clima relacional. Para proyectos técnicos complejos, asegurarse de tener perfiles analíticos en roles clave.';return 'El equipo tiene buena diversidad de perfiles. Capitalizar esa diversidad con retroalimentación cruzada entre tipos y sesiones de Eneagrama aplicado.';})()}
  ];
}

// ─── Compatibility ────────────────────────────────────────────────────────────
function renderCompatibility(){
  if(!allPersons.length){ ['leadersList','duplasList','tensionsList','gapsList'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='<div class="compat-item" style="color:#a4a8c0">Sin datos disponibles</div>';}); return; }
  const tc={}; for(let t=1;t<=9;t++) tc[t]=0; allPersons.forEach(p=>tc[p.tipo]++);
  const el_l=document.getElementById('leadersList');
  if(el_l){ const leaders=allPersons.map(p=>({...p,lid:LIDERAZGO_POTENCIAL[p.tipo]})).filter(p=>['Alto','Medio'].includes(p.lid.nivel)).sort((a,b)=>({'Alto':0,'Medio':1,'Situacional':2}[a.lid.nivel])-({'Alto':0,'Medio':1,'Situacional':2}[b.lid.nivel])).slice(0,5); el_l.innerHTML=leaders.length?leaders.map(p=>`<div class="compat-item"><strong>${esc(p.nombre)}</strong> — T${p.tipo} ${TIPO_CORTO[p.tipo]}<span class="cr">Potencial ${p.lid.nivel}: ${p.lid.razon}</span></div>`).join(''):'<div class="compat-item" style="color:#a4a8c0">Sin perfiles identificados</div>'; }
  const el_d=document.getElementById('duplasList');
  if(el_d){ const duplas=[]; for(let i=0;i<allPersons.length;i++)for(let j=i+1;j<allPersons.length;j++){const a=allPersons[i],b=allPersons[j],k=`${Math.min(a.tipo,b.tipo)}-${Math.max(a.tipo,b.tipo)}`;if(COMPATIBILIDAD[k])duplas.push({a,b,razon:COMPATIBILIDAD[k]});} el_d.innerHTML=duplas.length?duplas.slice(0,4).map(d=>`<div class="compat-item"><strong>${esc(d.a.nombre)} + ${esc(d.b.nombre)}</strong><span class="cr">T${d.a.tipo}+T${d.b.tipo}: ${d.razon}</span></div>`).join(''):'<div class="compat-item" style="color:#a4a8c0">Pocos evaluados para calcular duplas</div>'; }
  const el_t=document.getElementById('tensionsList');
  if(el_t){ const tens=[]; for(let i=0;i<allPersons.length;i++)for(let j=i+1;j<allPersons.length;j++){const a=allPersons[i],b=allPersons[j],k=`${Math.min(a.tipo,b.tipo)}-${Math.max(a.tipo,b.tipo)}`;if(TENSIONES[k])tens.push({a,b,razon:TENSIONES[k]});} el_t.innerHTML=tens.length?tens.slice(0,4).map(t=>`<div class="compat-item"><strong>${esc(t.a.nombre)} ↔ ${esc(t.b.nombre)}</strong><span class="cr">${t.razon}</span></div>`).join(''):'<div class="compat-item" style="color:#a4a8c0">No se detectan tensiones significativas</div>'; }
  const el_g=document.getElementById('gapsList');
  if(el_g){ const absent=Object.entries(tc).filter(([,v])=>v===0).map(([t])=>parseInt(t)); el_g.innerHTML=absent.length?absent.map(t=>`<div class="compat-item"><strong>T${t} — ${TIPO_CORTO[t]}</strong><span class="cr">Falta: ${TIPO_ROL_EQUIPO[t]}</span></div>`).join(''):'<div class="compat-item" style="color:#50fa7b">✓ Todos los tipos están representados</div>'; }
}

// ═══════════════════════════════════════════════════════════
// GESTIÓN — sección completa
// ═══════════════════════════════════════════════════════════
function renderGestion(){
  renderRRHHTable();
  renderGestionBlock('feedback11Grid', TIPO_FEEDBACK_11, 'rgba(107,225,227,0.05)', 'rgba(107,225,227,0.12)', t=>null);
  renderBurnout();
  renderGestionBlock('retencionGrid', TIPO_RETENCION, 'rgba(80,250,123,0.04)', 'rgba(80,250,123,0.15)', t=>null);
  renderGestionBlock('conflictoGrid', TIPO_CONFLICTO_GESTION, 'rgba(228,199,106,0.04)', 'rgba(228,199,106,0.18)', t=>null);
  renderGestionBlock('liderarGrid', TIPO_COMO_LIDERAR, 'rgba(107,225,227,0.04)', 'rgba(107,225,227,0.15)', t=>null);
  renderDesempeno();
  renderEquiposProyecto();
  renderGestionBlock('capacitacionGrid', TIPO_CAPACITACION, 'rgba(228,199,106,0.04)', 'rgba(228,199,106,0.18)', t=>null);
}

function getPresentTypes(){
  const tc={}; allPersons.forEach(p=>{tc[p.tipo]=(tc[p.tipo]||0)+1;});
  return Object.keys(tc).map(Number).sort((a,b)=>a-b);
}

function renderRRHHTable(){
  const tbody=document.getElementById('rrhhTable'); if(!tbody) return;
  if(!allPersons.length){ tbody.innerHTML='<tr><td colspan="7" class="px-4 py-6 text-center text-one-slate text-xs">Sin datos disponibles</td></tr>'; return; }
  const lid_order={'Alto':0,'Medio':1,'Situacional':2};
  tbody.innerHTML=allPersons.map((p,i)=>{
    const lid=LIDERAZGO_POTENCIAL[p.tipo];
    const lc=lid.nivel==='Alto'?'lid-alto':lid.nivel==='Medio'?'lid-medio':'lid-sit';
    return `<tr class="border-t border-white/5 hover:bg-one-cyan/5 transition-colors">
      <td class="px-4 py-3">
        <div class="flex items-center gap-2.5">
          <div style="width:30px;height:30px;min-width:30px;border-radius:50%;background:${TIPO_COLORS[p.tipo]};display:flex;align-items:center;justify-content:center;font-size:0.77rem;font-weight:900;color:#fff;flex-shrink:0">${p.tipo}</div>
          <div style="min-width:0">
            <div class="font-semibold text-xs text-white" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px" title="${esc(p.nombre)}">${esc(p.nombre)}</div>
            <div class="text-[10px] text-one-slate" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px">${esc(p.email)}</div>
          </div>
        </div>
      </td>
      <td class="px-4 py-3 whitespace-nowrap"><span style="font-size:0.68rem;font-weight:700;color:${TIPO_COLORS[p.tipo]};padding:3px 8px;border-radius:20px;background:${TIPO_COLORS[p.tipo]}22;border:1px solid ${TIPO_COLORS[p.tipo]}44;white-space:nowrap">T${p.tipo} ${TIPO_CORTO[p.tipo]}</span></td>
      <td style="padding:10px 14px;font-size:0.72rem;color:#a4a8c0;vertical-align:middle">${TIPO_ROL_EQUIPO[p.tipo]}</td>
      <td style="padding:10px 14px;font-size:0.72rem;color:#a4a8c0;vertical-align:middle">${TIPO_MOTIVADOR[p.tipo]}</td>
      <td style="padding:10px 14px;font-size:0.72rem;color:#ffb86c;vertical-align:middle">${TIPO_PUNTO_CIEGO[p.tipo].split(':')[0]}</td>
      <td class="px-4 py-3 text-center"><span class="lid-badge ${lc}">${lid.nivel}</span></td>
      <td class="px-4 py-3 text-center">
        <button onclick="openPersonModal(${i},'perfil')" style="padding:3px 9px;font-size:0.63rem;font-weight:700;border-radius:6px;border:1px solid rgba(107,225,227,0.25);background:rgba(107,225,227,0.08);color:#6be1e3;cursor:pointer;font-family:'Exo 2',sans-serif">Ver</button>
      </td>
    </tr>`;
  }).join('');
}

function renderGestionBlock(id, dataObj, bg, borderColor, extraFn){
  const el=document.getElementById(id); if(!el) return;
  const pts=getPresentTypes();
  if(!pts.length){ el.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#a4a8c0;padding:20px;font-size:0.8rem">Sin evaluados aún</div>'; return; }
  const tc={}; allPersons.forEach(p=>{tc[p.tipo]=(tc[p.tipo]||0)+1;});
  el.innerHTML=pts.map(t=>`
    <div class="gc" style="background:${bg};border:1px solid ${borderColor};border-top:2px solid ${TIPO_COLORS[t]}">
      <div class="gc-head">
        <div class="gc-num" style="background:${TIPO_COLORS[t]}">${t}</div>
        <span class="gc-tipo" style="color:${TIPO_COLORS[t]}">${TIPO_CORTO[t]}</span>
        <span class="gc-cnt">${tc[t]} pers.</span>
      </div>
      <div class="gc-text">${dataObj[t]||'—'}</div>
    </div>`).join('');
}

function renderBurnout(){
  const el=document.getElementById('burnoutGrid'); if(!el) return;
  const pts=getPresentTypes();
  if(!pts.length){ el.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#a4a8c0;padding:20px;font-size:0.8rem">Sin evaluados aún</div>'; return; }
  const tc={}; allPersons.forEach(p=>{tc[p.tipo]=(tc[p.tipo]||0)+1;});
  el.innerHTML=pts.map(t=>`
    <div class="gc" style="background:rgba(255,85,85,0.04);border:1px solid rgba(255,85,85,0.15);border-left:3px solid ${TIPO_COLORS[t]}">
      <div class="gc-head">
        <div class="gc-num" style="background:${TIPO_COLORS[t]}">${t}</div>
        <span class="gc-tipo" style="color:${TIPO_COLORS[t]}">${TIPO_CORTO[t]}</span>
        <span class="gc-cnt">${tc[t]} pers.</span>
      </div>
      <div class="gc-text">${(TIPO_BURNOUT_SENALES[t]||[]).map(s=>`<div style="display:flex;gap:5px;margin-bottom:3px"><span style="color:#ff5555;flex-shrink:0">⚠</span><span>${s}</span></div>`).join('')}</div>
    </div>`).join('');
}

function renderDesempeno(){
  const el=document.getElementById('desempenoGrid'); if(!el) return;
  const pts=getPresentTypes();
  if(!pts.length){ el.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#a4a8c0;padding:20px;font-size:0.8rem">Sin evaluados aún</div>'; return; }
  const tc={}; allPersons.forEach(p=>{tc[p.tipo]=(tc[p.tipo]||0)+1;});
  el.innerHTML=pts.map(t=>{
    const d=TIPO_DESEMPENO_ESPERAR[t];
    return `<div class="gc" style="background:rgba(225,123,215,0.04);border:1px solid rgba(225,123,215,0.15);border-top:2px solid ${TIPO_COLORS[t]}">
      <div class="gc-head">
        <div class="gc-num" style="background:${TIPO_COLORS[t]}">${t}</div>
        <span class="gc-tipo" style="color:${TIPO_COLORS[t]}">${TIPO_CORTO[t]}</span>
        <span class="gc-cnt">${tc[t]} pers.</span>
      </div>
      <div style="font-size:0.68rem;font-weight:700;color:#50fa7b;margin-bottom:3px;margin-top:4px">✓ Fortaleza en el desempeño</div>
      <div class="gc-text" style="margin-bottom:7px">${d.fortaleza}</div>
      <div style="font-size:0.68rem;font-weight:700;color:#ffb86c;margin-bottom:3px">⚠ Limitación típica</div>
      <div class="gc-text" style="margin-bottom:7px">${d.limitacion}</div>
      <div style="font-size:0.68rem;font-weight:700;color:#6be1e3;margin-bottom:3px">📋 Cómo evaluar</div>
      <div class="gc-text">${d.indicadores}</div>
    </div>`;
  }).join('');
}

function renderEquiposProyecto(){
  const el=document.getElementById('equiposProyectoGrid'); if(!el) return;
  const total=allPersons.length;
  if(!total){ el.innerHTML='<div style="text-align:center;color:#a4a8c0;padding:20px;font-size:0.8rem">Sin evaluados aún</div>'; return; }
  const tc={}; allPersons.forEach(p=>{tc[p.tipo]=(tc[p.tipo]||0)+1;});
  const tipos=Object.keys(tc).map(Number);
  const proyectos=[
    {nombre:'Proyecto de transformación / cambio organizacional',tipos:[8,1,3,7],razon:'Necesita liderazgo fuerte (T8), rigor metodológico (T1), motor de ejecución (T3) y generación de adhesión (T7).'},
    {nombre:'Proyecto creativo / de innovación',tipos:[4,7,5,3],razon:'Requiere alma creativa (T4), entusiasmo e ideas (T7), análisis profundo (T5) y capacidad de llevar la idea al resultado (T3).'},
    {nombre:'Proyecto de mejora de procesos / calidad',tipos:[1,5,6,9],razon:'Necesita estándares altos (T1), análisis sistémico (T5), anticipación de riesgos (T6) y mediación de resistencias (T9).'},
    {nombre:'Proyecto de alta exposición / ventas',tipos:[3,8,7,2],razon:'Requiere orientación a resultados (T3), decisión y cierre (T8), entusiasmo (T7) y construcción de relaciones (T2).'},
    {nombre:'Proyecto de alta complejidad técnica',tipos:[5,1,6,3],razon:'Necesita profundidad analítica (T5), rigor (T1), gestión de riesgos (T6) y entrega de resultados (T3).'},
    {nombre:'Proyecto de bienestar / cultura interna',tipos:[2,9,4,6],razon:'Requiere empatía y cuidado (T2), mediación (T9), creatividad cultural (T4) y responsabilidad institucional (T6).'}
  ];
  el.innerHTML=proyectos.map(proj=>{
    const available=proj.tipos.filter(t=>tipos.includes(t));
    const missing=proj.tipos.filter(t=>!tipos.includes(t));
    const strength=Math.round((available.length/proj.tipos.length)*100);
    return `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px">
      <div style="font-size:0.75rem;font-weight:700;color:#fff;margin-bottom:6px">${proj.nombre}</div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <div style="flex:1;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${strength}%;background:${strength>=75?'#50fa7b':strength>=50?'#e4c76a':'#ff5555'};border-radius:3px"></div>
        </div>
        <span style="font-size:0.7rem;font-weight:700;color:${strength>=75?'#50fa7b':strength>=50?'#e4c76a':'#ff5555'}">${strength}%</span>
      </div>
      <div style="font-size:0.7rem;color:#a4a8c0;line-height:1.6;margin-bottom:7px">${proj.razon}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${available.map(t=>`<span style="padding:2px 7px;border-radius:20px;font-size:0.62rem;font-weight:700;background:${TIPO_COLORS[t]}22;color:${TIPO_COLORS[t]};border:1px solid ${TIPO_COLORS[t]}44">T${t} ✓</span>`).join('')}
        ${missing.map(t=>`<span style="padding:2px 7px;border-radius:20px;font-size:0.62rem;font-weight:700;background:rgba(255,255,255,0.05);color:#a4a8c0;border:1px solid rgba(255,255,255,0.1)">T${t} —</span>`).join('')}
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════
// CULTURA — sección completa
// ═══════════════════════════════════════════════════════════
function renderCultura(){
  renderClimaChart(); renderEnergiaChart();
  renderConvivencia(); renderDinamicas();
  renderClimaTriada(); renderConfrontacion();
  renderComunicacionGuide(); renderRituales();
  renderPuntosCriticos();
}

function renderClimaChart(){
  const ctx=document.getElementById('chartClima'); if(!ctx) return;
  if(chartClima) chartClima.destroy();
  const total=allPersons.length||1;
  const tc={}; for(let t=1;t<=9;t++) tc[t]=0; allPersons.forEach(p=>tc[p.tipo]++);
  const c=(types)=>Math.min(100,Math.round(types.reduce((s,t)=>s+(tc[t]||0),0)/total*100+15));
  chartClima=new Chart(ctx.getContext('2d'),{type:'radar',data:{labels:['Creatividad','Ejecución','Cohesión','Analítica','Adaptabilidad','Gest. conflicto'],datasets:[{label:'Clima',data:[c([4,7,5]),c([3,8,1]),c([2,6,9]),c([5,1,6]),c([7,9,3]),c([8,1,6])],backgroundColor:'rgba(107,225,227,0.12)',borderColor:'#6be1e3',borderWidth:2,pointBackgroundColor:'#6be1e3',pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{min:0,max:100,grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#a4a8c0',backdropColor:'transparent',font:{size:9},stepSize:25},pointLabels:{color:'#a4a8c0',font:{family:'Exo 2',size:9}}}}}});
}

function renderEnergiaChart(){
  const ctx=document.getElementById('chartEnergia'); if(!ctx) return;
  if(chartEnergia) chartEnergia.destroy();
  const tc={}; for(let t=1;t<=9;t++) tc[t]=0; allPersons.forEach(p=>tc[p.tipo]++);
  chartEnergia=new Chart(ctx.getContext('2d'),{type:'bar',data:{labels:Object.keys(tc).map(t=>`T${t}`),datasets:[{data:Object.values(tc),backgroundColor:Object.keys(tc).map(t=>TIPO_COLORS[t]+'bb'),borderColor:Object.keys(tc).map(t=>TIPO_COLORS[t]),borderWidth:1,borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#a4a8c0',font:{size:9}}},y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#a4a8c0',font:{size:9},stepSize:1},beginAtZero:true}}}});
}

function renderConvivencia(){
  const grid=document.getElementById('convivenciaGrid'); if(!grid) return;
  const total=allPersons.length;
  const tc={Cuerpo:0,Corazon:0,Cabeza:0}; allPersons.forEach(p=>tc[TRIADA[p.tipo]]++);
  const dom=total?Object.entries(tc).sort((a,b)=>b[1]-a[1])[0][0]:'Cabeza';
  const typeCount={}; allPersons.forEach(p=>{typeCount[p.tipo]=(typeCount[p.tipo]||0)+1;});
  const tipos=Object.keys(typeCount).map(Number);
  let tension='No se detectan tensiones de alta intensidad con la composición actual. Monitorear silos entre tríadas.';
  if(tipos.includes(1)&&tipos.includes(9)) tension='Tensión entre el perfeccionismo (T1) y la tendencia a evitar el conflicto (T9). Pueden acumularse frustraciones sin expresarse durante semanas.';
  else if(tipos.includes(3)&&tipos.includes(4)) tension='Tensión entre la imagen del éxito (T3) y la necesidad de autenticidad (T4). Pueden chocar en torno a los valores reales del equipo.';
  else if(tipos.includes(8)&&tipos.includes(2)) tension='Tensión entre la confrontación directa (T8) y la búsqueda de armonía (T2). Necesitan acuerdos explícitos y permanentes de comunicación.';
  const uneMap={Cuerpo:'El equipo se une desde la acción concreta y los resultados tangibles. La lealtad se construye en la práctica compartida, no en las palabras.',Corazon:'El equipo se une desde las relaciones y el reconocimiento mutuo. El vínculo emocional y la sensación de pertenencia son el pegamento grupal.',Cabeza:'El equipo se une desde el pensamiento compartido y el análisis de la realidad. El respeto intelectual mutuo es el fundamento de la confianza.'};
  const accMap={Cuerpo:'Crear espacios de reflexión y revisión estratégica periódica. El equipo tiende a actuar antes de pensar, lo que puede generar correcciones costosas en tiempo y recursos.',Corazon:'Instalar conversaciones de feedback directo y constructivo. El equipo puede evitar la confrontación necesaria para crecer, acumulando tensión sin resolución.',Cabeza:'Diseñar instancias de prototipado rápido y toma de decisiones con información incompleta. Reducir la parálisis por análisis con metodologías ágiles y plazos.'};
  grid.innerHTML=[
    {color:'#6be1e3',label:'Qué une al equipo',title:'Fortaleza de convivencia',text:total?uneMap[dom]:'Sin datos.'},
    {color:'#ffb86c',label:'Punto de fricción natural',title:'Tensión latente',text:total?tension:'Sin datos.'},
    {color:'#50fa7b',label:'Acción prioritaria',title:'Recomendación de clima',text:total?accMap[dom]:'Sin datos.'}
  ].map(i=>`<div class="conv-card" style="--cc:${i.color}"><div class="conv-label">${i.label}</div><div class="conv-title">${i.title}</div><div class="conv-text">${i.text}</div></div>`).join('');
}

function renderDinamicas(){
  const grid=document.getElementById('dinamicasGrid'); if(!grid) return;
  const tc={Cuerpo:0,Corazon:0,Cabeza:0}; allPersons.forEach(p=>tc[TRIADA[p.tipo]]++);
  const total=allPersons.length||1;
  const dom=Object.entries(tc).sort((a,b)=>b[1]-a[1])[0][0];
  const typeCount={}; allPersons.forEach(p=>{typeCount[p.tipo]=(typeCount[p.tipo]||0)+1;});
  const leaders=allPersons.filter(p=>LIDERAZGO_POTENCIAL[p.tipo].nivel==='Alto');
  const dinamicas=[
    {t:'Toma de decisiones',txt:{Cuerpo:'El equipo decide rápido y desde el instinto. Las reuniones tienden a ser cortas y orientadas a la acción. El riesgo es la falta de reflexión suficiente antes de actuar.',Corazon:'El equipo necesita consenso emocional antes de decidir. Las reuniones requieren tiempo para el diálogo y la validación mutua.',Cabeza:'El equipo analiza profundamente antes de decidir. Puede necesitar plazos explícitos para evitar la postergación de decisiones importantes.'}[dom]},
    {t:'Comportamiento bajo presión',txt:typeCount[8]?'Con T8 presente, el equipo se intensifica bajo presión: el liderazgo se vuelve más directivo. Eficaz en crisis pero desgastante en el largo plazo.':typeCount[6]?'Con T6 presente, el equipo hipervigilar los riesgos bajo presión. Requiere liderazgo claro, tranquilizador y consistente.':typeCount[9]?'Con T9 presente, el equipo puede dispersarse bajo presión. Necesitan un líder que ayude a priorizar y sostener la dirección.':'El equipo no tiene un perfil de respuesta a la presión claramente definido. Recomendamos simular escenarios de crisis para identificar los patrones emergentes.'},
    {t:'Poder y autoridad informal',txt:typeCount[8]&&typeCount[1]?'Coexisten dos tipos de autoridad: la del poder directo (T8) y la de los principios (T1). Pueden generar tensión si no acuerdan criterios explícitos.':typeCount[8]?'El T8 tiende a concentrar el poder informalmente. Importante distribuir la autoridad para evitar dependencia de una sola persona.':typeCount[1]?'La autoridad se construye desde la ética y los criterios. El T1 ejerce influencia a través de estándares, no de jerarquía.':'El equipo tiene una distribución de poder más horizontal. Definir roles de liderazgo explícitamente para situaciones de crisis.'},
    {t:'Aprendizaje colectivo',txt:tc.Cabeza>total*0.5&&tc.Corazon>0?'El equipo combina capacidad analítica y emocional. Puede generar aprendizaje desde la experiencia práctica y desde la reflexión teórica.':tc.Cabeza>total*0.5?'El equipo aprende mejor desde el análisis de casos y la revisión estructurada. Responde bien a capacitación con fundamentos sólidos.':tc.Corazon>total*0.5?'El equipo aprende mejor desde la experiencia compartida y la conexión emocional con el aprendizaje.':'Estilo mixto. Combinar formatos expositivos con instancias de práctica y reflexión colectiva.'},
    {t:'Innovación y cambio',txt:typeCount[7]||typeCount[4]?'Alta capacidad de generar ideas nuevas. El desafío es estructurar la innovación para que llegue a la implementación.':typeCount[5]?'La innovación en este equipo es profunda y analítica. Necesita facilitadores que aceleren el paso de la idea al prototipo.':'El equipo puede resistir el cambio. Introducir novedades con fundamentos sólidos, gradualmente y con participación.'},
    {t:'Liderazgo emergente',txt:leaders.length===0?'No se identifican perfiles de liderazgo alto. Se recomienda trabajar en el desarrollo de capacidades de conducción en los perfiles existentes.':leaders.length===1?`${esc(leaders[0].nombre)} (T${leaders[0].tipo}) concentra el liderazgo natural. Importante desarrollar co-liderazgo para evitar dependencia de una sola persona.`:`${leaders.map(p=>`${esc(p.nombre)} (T${p.tipo})`).join(' y ')} tienen potencial alto. El equipo puede distribuir el liderazgo según el contexto, lo que aumenta la resiliencia.`}
  ];
  grid.innerHTML=dinamicas.map(d=>`<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px"><div style="font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6be1e3;margin-bottom:5px">${d.t}</div><div style="font-size:0.77rem;color:#a4a8c0;line-height:1.65">${d.txt}</div></div>`).join('');
}

function renderClimaTriada(){
  const el=document.getElementById('climaTriadaGrid'); if(!el) return;
  const tc={Cuerpo:0,Corazon:0,Cabeza:0}; allPersons.forEach(p=>tc[TRIADA[p.tipo]]++);
  const total=allPersons.length||1;
  const triadas=[
    {n:'Cuerpo',c:TRIADA_COLORS.Cuerpo,tipos:'T1, T8, T9',pct:Math.round(tc.Cuerpo/total*100),
      clima:'Clima de acción y práctica. El equipo genera confianza haciendo cosas juntos, no solo hablando.',
      fortalezas:'Alta resiliencia en crisis · Lealtad demostrada en la práctica · Comunicación directa y sin rodeos · Capacidad de ejecución sostenida',
      riesgos:'Puede acumular tensión sin expresarla · Dificultad para introspección colectiva · Puede actuar antes de reflexionar suficientemente',
      recomendacion:'Incluir instancias de retrospectiva estructurada. Dar canales seguros para expresar emociones sin que parezca "debilidad". Celebrar el proceso, no solo el resultado.'},
    {n:'Corazón',c:TRIADA_COLORS.Corazon,tipos:'T2, T3, T4',pct:Math.round(tc.Corazon/total*100),
      clima:'Clima de conexión y reconocimiento. El equipo genera confianza a través de las relaciones y la imagen compartida.',
      fortalezas:'Alta inteligencia emocional colectiva · Capacidad de motivar y movilizar emocionalmente · Adaptabilidad social · Cuidado mutuo genuino',
      riesgos:'Puede evitar conflictos necesarios · Dependencia del reconocimiento externo · Puede priorizar la imagen sobre la sustancia',
      recomendacion:'Instalar conversaciones de feedback directo. Separar la valoración personal de la evaluación del trabajo. Cultivar la autenticidad por encima de la imagen.'},
    {n:'Cabeza',c:TRIADA_COLORS.Cabeza,tipos:'T5, T6, T7',pct:Math.round(tc.Cabeza/total*100),
      clima:'Clima de análisis y anticipación. El equipo genera confianza a través del conocimiento compartido y la preparación.',
      fortalezas:'Alta capacidad de planificación estratégica · Anticipación de riesgos y oportunidades · Innovación fundamentada · Adaptabilidad intelectual',
      riesgos:'Parálisis por análisis · Dificultad para actuar con información incompleta · Puede generar distancia emocional con el equipo',
      recomendacion:'Instaurar metodologías de toma de decisión con tiempo límite. Equilibrar el análisis con la acción mediante prototipos rápidos. Fortalecer la dimensión emocional del vínculo.'}
  ];
  el.innerHTML=triadas.filter(tri=>tc[tri.n]>0).map(tri=>`
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-left:4px solid ${tri.c};border-radius:12px;padding:16px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="width:28px;height:28px;border-radius:50%;background:${tri.c}22;border:2px solid ${tri.c}55;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:900;color:${tri.c}">${tri.pct}%</div>
        <div>
          <div style="font-size:0.82rem;font-weight:700;color:${tri.c}">Centro ${tri.n} · ${tri.tipos}</div>
          <div style="font-size:0.7rem;color:#a4a8c0">${tc[tri.n]} persona${tc[tri.n]>1?'s':''} en el equipo</div>
        </div>
      </div>
      <div style="font-size:0.77rem;color:#fff;margin-bottom:8px;font-style:italic">"${tri.clima}"</div>
      <div style="font-size:0.68rem;font-weight:700;color:#50fa7b;margin-bottom:3px">FORTALEZAS DEL CLIMA</div>
      <div style="font-size:0.72rem;color:#a4a8c0;margin-bottom:8px">${tri.fortalezas}</div>
      <div style="font-size:0.68rem;font-weight:700;color:#ffb86c;margin-bottom:3px">RIESGOS A MONITOREAR</div>
      <div style="font-size:0.72rem;color:#a4a8c0;margin-bottom:8px">${tri.riesgos}</div>
      <div style="font-size:0.68rem;font-weight:700;color:#6be1e3;margin-bottom:3px">RECOMENDACIÓN</div>
      <div style="font-size:0.72rem;color:#a4a8c0">${tri.recomendacion}</div>
    </div>`).join('');
}

function renderConfrontacion(){
  const el=document.getElementById('confrontacionGrid'); if(!el) return;
  const tc={}; allPersons.forEach(p=>{tc[p.tipo]=(tc[p.tipo]||0)+1;});
  const total=allPersons.length||1;
  const items=[];
  if(tc[8]) items.push({color:TIPO_COLORS[8],titulo:'Poder directo: T8 presente ('+tc[8]+' pers.)',texto:'El T8 ejerce poder de forma directa, visible y sin rodeos. Puede dominar informalmente el espacio de decisión. Es honesto en la confrontación pero puede intimidar sin querer. Recomendación: darle autoridad formal para que el poder informal no genere resentimiento en el equipo.'});
  if(tc[1]) items.push({color:TIPO_COLORS[1],titulo:'Autoridad por principios: T1 presente ('+tc[1]+' pers.)',texto:'El T1 ejerce autoridad a través de la ética y los estándares. Puede generar tensión cuando percibe que otros no cumplen con sus criterios. Su confrontación es "justa" desde su perspectiva pero puede percibirse como rígida. Recomendación: crear espacios para negociar criterios y estándares colectivamente.'});
  if(tc[6]) items.push({color:TIPO_COLORS[6],titulo:'Control a través de la anticipación: T6 presente ('+tc[6]+' pers.)',texto:'El T6 puede confrontar cuando percibe que los riesgos no están siendo considerados. Puede generar fricción al señalar problemas que otros no ven. Su confrontación nace de la preocupación, no de la agresión. Recomendación: validar su función de "sistema inmune" del equipo y crear canales formales para sus alertas.'});
  if(tc[9]) items.push({color:TIPO_COLORS[9],titulo:'Resistencia pasiva: T9 presente ('+tc[9]+' pers.)',texto:'El T9 rara vez confronta directamente pero puede resistir pasivamente decisiones con las que no acuerda. Su "acuerdo" no siempre es real. La resistencia aparece como inercia, postergación o falta de compromiso. Recomendación: crear instancias donde el desacuerdo sea explícitamente bienvenido y seguro.'});
  if(tc[4]) items.push({color:TIPO_COLORS[4],titulo:'Confrontación desde la autenticidad: T4 presente ('+tc[4]+' pers.)',texto:'El T4 confronta cuando siente que se está violando algo genuino o auténtico. Puede intensificar emocionalmente las situaciones de conflicto. Su confrontación es profunda y no superficial. Recomendación: crear espacios de diálogo donde la profundidad emocional sea bienvenida y no percibida como exagerada.'});
  if(!items.length) items.push({color:'#a4a8c0',titulo:'Sin patrones de confrontación dominantes identificados',texto:'La composición actual no presenta perfiles con patrones de confrontación o poder de alta intensidad. El equipo probablemente tiene un estilo más horizontal y colaborativo. Monitorear la aparición de liderazgos informales no reconocidos.'});
  el.innerHTML=items.map(i=>`<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-left:4px solid ${i.color};border-radius:10px;padding:14px"><div style="font-size:0.75rem;font-weight:700;color:${i.color};margin-bottom:6px">${i.titulo}</div><div style="font-size:0.77rem;color:#a4a8c0;line-height:1.65">${i.texto}</div></div>`).join('');
}

function renderComunicacionGuide(){
  const grid=document.getElementById('comunicacionGuide'); if(!grid) return;
  const pts=getPresentTypes();
  const tc={}; allPersons.forEach(p=>{tc[p.tipo]=(tc[p.tipo]||0)+1;});
  if(!pts.length){ grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#a4a8c0;padding:20px;font-size:0.8rem">Sin evaluados aún</div>'; return; }
  grid.innerHTML=pts.map(t=>`
    <div class="com-card" style="--tc:${TIPO_COLORS[t]}">
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px">
        <div style="width:26px;height:26px;min-width:26px;border-radius:50%;background:${TIPO_COLORS[t]};display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:900;color:#fff">${t}</div>
        <span style="font-size:0.77rem;font-weight:700;color:${TIPO_COLORS[t]}">${TIPO_CORTO[t]}</span>
      </div>
      <div style="font-size:0.71rem;color:#a4a8c0;line-height:1.6;margin-bottom:9px">${TIPO_COMUNICACION[t]}</div>
      <button onclick="showTipoPersonas(${t})"
        style="width:100%;padding:5px 0;font-size:0.63rem;font-weight:700;border-radius:6px;border:1px solid ${TIPO_COLORS[t]}44;background:${TIPO_COLORS[t]}18;color:${TIPO_COLORS[t]};cursor:pointer;font-family:'Exo 2',sans-serif">
        Ver ${tc[t]} persona${tc[t]>1?'s':''} de este tipo →
      </button>
    </div>`).join('');
}

function showTipoPersonas(tipo){
  const personas=allPersons.filter(p=>p.tipo===tipo);
  const color=TIPO_COLORS[tipo];
  const ex=document.getElementById('tipoPopup'); if(ex) ex.remove();
  const popup=document.createElement('div');
  popup.id='tipoPopup';
  popup.style.cssText='position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px)';
  popup.innerHTML=`<div style="background:#1a181d;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:24px;max-width:460px;width:100%;max-height:80vh;overflow-y:auto;animation:scaleIn .2s ease">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1rem;color:#fff">${tipo}</div>
        <div><div style="font-weight:700;font-size:0.88rem">${TIPO_NOMBRES[tipo]}</div><div style="font-size:0.7rem;color:#a4a8c0">${personas.length} persona${personas.length>1?'s':''} · ${TRIADA[tipo]==='Corazon'?'Corazón':TRIADA[tipo]}</div></div>
      </div>
      <button onclick="document.getElementById('tipoPopup').remove()" style="width:26px;height:26px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#a4a8c0;cursor:pointer;font-size:0.82rem;display:flex;align-items:center;justify-content:center">✕</button>
    </div>
    <div style="font-size:0.73rem;color:#a4a8c0;background:rgba(255,255,255,0.04);border-radius:8px;padding:10px;margin-bottom:12px;line-height:1.6">${TIPO_COMUNICACION[tipo]}</div>
    <div style="display:flex;flex-direction:column;gap:7px">
      ${personas.map(p=>`<div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.04);border-radius:8px;padding:9px 12px"><div><div style="font-weight:600;font-size:0.8rem">${esc(p.nombre)}</div><div style="font-size:0.67rem;color:#a4a8c0">${esc(p.email)} · ${p.scores[p.tipo]}%</div></div><button onclick="document.getElementById('tipoPopup').remove();openPersonModal(${allPersons.indexOf(p)},'perfil')" style="padding:4px 9px;font-size:0.63rem;font-weight:700;border-radius:6px;border:1px solid ${color}44;background:${color}18;color:${color};cursor:pointer;font-family:'Exo 2',sans-serif;flex-shrink:0">Ver</button></div>`).join('')}
    </div>
  </div>`;
  popup.addEventListener('click',e=>{if(e.target===popup)popup.remove();});
  document.body.appendChild(popup);
  if(!document.getElementById('scaleInStyle')){const s=document.createElement('style');s.id='scaleInStyle';s.textContent='@keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}';document.head.appendChild(s);}
}

function renderRituales(){
  const grid=document.getElementById('ritualesGrid'); if(!grid) return;
  const tc={Cuerpo:0,Corazon:0,Cabeza:0}; allPersons.forEach(p=>tc[TRIADA[p.tipo]]++);
  const dom=allPersons.length?Object.entries(tc).sort((a,b)=>b[1]-a[1])[0][0]:'Cabeza';
  const typeCount={}; allPersons.forEach(p=>{typeCount[p.tipo]=(typeCount[p.tipo]||0)+1;});
  const rituales=[
    {t:'🔁 Retrospectivas periódicas',d:'Instancia mensual de revisión colectiva: qué funcionó, qué no, qué cambiar. Especialmente recomendada para equipos con T1, T6 o T8. Formato: 45 min, facilitador neutral, preguntas abiertas. Evitar que se convierta en un espacio de crítica sin propuesta.',recomendada:!!(typeCount[1]||typeCount[6]||typeCount[8])},
    {t:'🌟 Reconocimiento explícito y frecuente',d:'Práctica semanal de reconocimiento de aportes específicos — no genéricos. Crítica para equipos con T2, T3 o T4. Puede ser informal (en reuniones) o formal (tablero de reconocimiento). La frecuencia importa más que la solemnidad.',recomendada:!!(typeCount[2]||typeCount[3]||typeCount[4])},
    {t:'🧭 Check-in emocional al inicio de reuniones',d:'2-3 minutos donde cada persona comparte brevemente su estado. Desbloquea la comunicación para equipos con T9, T2 y T6. Normaliza la vulnerabilidad. Recomendado para equipos donde las tensiones no se expresan directamente.',recomendada:!!(typeCount[9]||typeCount[2]||typeCount[6])},
    {t:'🎯 Definición colectiva de estándares',d:'Reunión anual o semestral para acordar los criterios de calidad y éxito del equipo. Esencial para equipos con T1 y T8. Evita conflictos por estándares implícitos no compartidos. El proceso de acuerdo es tan importante como el resultado.',recomendada:!!(typeCount[1]||typeCount[8])},
    {t:'💡 Espacio de innovación sin presión de resultado',d:'Bloque mensual de 60-90 min para explorar ideas sin presión de implementación inmediata. Ideal para equipos con T7, T4 y T5. Debe tener reglas explícitas: no juzgar, no requerir viabilidad inmediata, registrar todo.',recomendada:!!(typeCount[7]||typeCount[4]||typeCount[5])},
    {t:'📊 Dashboard de avance compartido',d:'Visibilidad permanente del progreso colectivo hacia las metas. Fundamental para T3 y T1. Reduce la ansiedad del T6. Puede ser digital o físico. La transparencia en el avance genera confianza y motivación colectiva.',recomendada:!!(typeCount[3]||typeCount[1]||typeCount[6])},
    {t:'🤝 Conversaciones 1:1 regulares',d:'Encuentros individuales mensuales entre líder y cada persona del equipo. Críticas para T2, T4 y T9, que necesitan espacio personal para abrirse. Agenda sugerida: estado personal, avances, obstáculos, necesidades. Sin agenda formal rígida.',recomendada:!!(typeCount[2]||typeCount[4]||typeCount[9])},
    {t:'🌅 Cierre de ciclos y celebraciones',d:'Instancia explícita de cierre al terminar proyectos o períodos. Imprescindible para equipos con T7 (que saltan al siguiente) y T3 (que minimizan logros). Incluir: qué se logró, qué se aprendió, cómo afectó al equipo. Celebrar antes de avanzar.',recomendada:!!(typeCount[7]||typeCount[3])}
  ];
  grid.innerHTML=rituales.map(r=>`
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,${r.recomendada?'0.12':'0.05'});border-radius:10px;padding:14px;${r.recomendada?'border-top:2px solid #e4c76a;':''}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:0.8rem;font-weight:700;color:${r.recomendada?'#e4c76a':'#a4a8c0'}">${r.t}</span>
        ${r.recomendada?'<span style="font-size:0.58rem;padding:1px 6px;border-radius:20px;background:rgba(228,199,106,0.15);color:#e4c76a;border:1px solid rgba(228,199,106,0.25);font-weight:700">RECOMENDADO</span>':''}
      </div>
      <div style="font-size:0.71rem;color:#a4a8c0;line-height:1.65">${r.d}</div>
    </div>`).join('');
}

function renderPuntosCriticos(){
  const el=document.getElementById('puntosCriticos'); if(!el) return;
  if(!allPersons.length){ el.innerHTML='<div class="punto-critico"><p class="pc-text">Sin datos disponibles</p></div>'; return; }
  const puntos=[];
  const tc={}; allPersons.forEach(p=>{tc[p.tipo]=(tc[p.tipo]||0)+1;});
  const triC={Cuerpo:0,Corazon:0,Cabeza:0}; allPersons.forEach(p=>triC[TRIADA[p.tipo]]++);
  const total=allPersons.length;
  const maxTriada=Math.max(...Object.values(triC));
  if(maxTriada>total*0.65){ const domT=Object.entries(triC).find(([,v])=>v===maxTriada)[0]; const label=domT==='Corazon'?'Corazón':domT; puntos.push({title:`Desequilibrio de tríadas: ${label} predomina con ${Math.round(maxTriada/total*100)}%`,text:`Un equipo con más del 65% de un solo centro puede tener puntos ciegos importantes en los otros dos. Recomendamos complementar con perfiles del centro ${domT==='Cuerpo'?'Cabeza o Corazón':domT==='Corazon'?'Cabeza o Cuerpo':'Corazón o Cuerpo'} para mayor equilibrio sistémico.`}); }
  const criticalAbsent=[3,8].filter(t=>!tc[t]);
  if(criticalAbsent.length) puntos.push({title:`Ausencia de perfiles de alta ejecución (T${criticalAbsent.join(', T')})`,text:`Los Tipos ${criticalAbsent.join(' y ')} aportan decisión, orientación a resultados y respuesta rápida ante la adversidad. Su ausencia puede ralentizar significativamente la ejecución en proyectos de alta presión o en momentos de crisis.`});
  const tensions=[];
  for(let i=0;i<allPersons.length;i++)for(let j=i+1;j<allPersons.length;j++){const a=allPersons[i],b=allPersons[j],k=`${Math.min(a.tipo,b.tipo)}-${Math.max(a.tipo,b.tipo)}`;if(TENSIONES[k])tensions.push(`${esc(a.nombre)} (T${a.tipo}) y ${esc(b.nombre)} (T${b.tipo})`);}
  if(tensions.length) puntos.push({title:`${tensions.length} par${tensions.length>1?'es':''} con tensión tipológica identificada`,text:`Los siguientes pares merecen atención especial en la gestión de la convivencia: ${tensions.slice(0,4).join(' · ')}. Se recomienda diseñar instancias de feedback cruzado facilitado y definir acuerdos de comunicación explícitos.`});
  if((tc[9]||0)>total*0.3) puntos.push({title:`Alta presencia de T9 (${tc[9]} personas · ${Math.round((tc[9]/total)*100)}%)`,text:`Los T9 tienden a evitar el conflicto y pueden no expresar su desacuerdo abiertamente. En equipo de alta concentración T9, las tensiones quedan subterráneas y pueden explotar de forma imprevista. Crear mecanismos de feedback anónimos y reuniones estructuradas ayuda a que sus perspectivas reales emerjan.`});
  if((tc[6]||0)>total*0.3) puntos.push({title:`Alta presencia de T6 (${tc[6]} personas · ${Math.round((tc[6]/total)*100)}%)`,text:`Alta capacidad de anticipar riesgos, pero el equipo puede paralizarse ante la incertidumbre o el cambio. El liderazgo debe ser especialmente claro, consistente y tranquilizador. Evitar cambios abruptos sin comunicación previa y sin contexto sólido.`});
  if((tc[7]||0)>total*0.3) puntos.push({title:`Alta presencia de T7 (${tc[7]} personas · ${Math.round((tc[7]/total)*100)}%)`,text:`Alta creatividad e innovación, pero puede haber dificultad para cerrar proyectos y sostener compromisos de largo plazo. Es fundamental tener mecanismos de seguimiento, cierre de ciclos y celebración de cierres para no acumular proyectos iniciados sin terminar.`});
  if(!puntos.length) puntos.push({title:'El equipo no presenta alertas críticas de convivencia',text:'La composición actual no genera tensiones de alta intensidad evidentes. Para mantener el buen clima, recomendamos instancias regulares de retroalimentación entre tipos y actividades de integración basadas en el Eneagrama aplicado al contexto organizacional.'});
  el.innerHTML=puntos.map(p=>`<div class="punto-critico"><div class="pc-title">${p.title}</div><div class="pc-text">${p.text}</div></div>`).join('');
}

// ═══════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════
function openPersonModal(idx, tab){
  currentModalIdx=idx; currentModalTab=tab||'perfil';
  const p=filteredPersons[idx]; if(!p) return;
  document.getElementById('modalPersonTitle').textContent=p.nombre+' · T'+p.tipo+' '+TIPO_CORTO[p.tipo];
  renderModalContent(p, currentModalTab);
  const overlay=document.getElementById('personModalOverlay');
  overlay.classList.remove('hidden'); overlay.classList.add('is-open');
}

function renderModalContent(p, tab){
  const color=TIPO_COLORS[p.tipo];
  const maxScore=Math.max(...Object.values(p.scores));
  const barsHtml=Array.from({length:9},(_,i)=>i+1).map(t=>{
    const sc=p.scores[t]||0, h=Math.round((sc/maxScore)*50), isBase=t===p.tipo;
    return `<div class="msc"><div class="msc-wrap"><div class="msc-bar" style="height:${h}px;background:${isBase?color:'rgba(255,255,255,0.12)'}"></div></div><div class="msc-n" style="color:${isBase?color:'#a4a8c0'}">${t}</div><div class="msc-p" style="color:${isBase?color:'#a4a8c0'}">${sc}%</div></div>`;
  }).join('');
  const lid=LIDERAZGO_POTENCIAL[p.tipo];
  const a1c=TIPO_COLORS[p.ala1]||'#a4a8c0', a2c=TIPO_COLORS[p.ala2]||'#a4a8c0';
  const tStyle=(a)=>a?'background:rgba(107,225,227,0.15);color:#6be1e3;border-color:rgba(107,225,227,0.3)':'background:transparent;color:#a4a8c0;border-color:rgba(255,255,255,0.1)';
  const tabsHtml=`<div style="display:flex;gap:4px;margin-bottom:14px"><button class="m-tab-btn" onclick="switchModalTab('perfil')" style="${tStyle(tab==='perfil')}">Perfil RRHH</button><button class="m-tab-btn" onclick="switchModalTab('informe')" style="${tStyle(tab==='informe')}">Vista Informe</button></div>`;

  let body='';
  if(tab==='perfil'){
    body=`
      <div style="border-left:3px solid ${color};padding-left:14px;margin-bottom:14px">
        <div class="modal-type-num" style="color:${color}">${p.tipo}</div>
        <div class="modal-type-name">${TIPO_NOMBRES[p.tipo]}</div>
        <div style="font-size:0.72rem;color:#a4a8c0;margin-bottom:2px">${TIPO_SUBTITULO[p.tipo]}</div>
        <div class="modal-p-name">${esc(p.nombre)} · ${esc(p.email)}</div>
      </div>
      <div class="modal-sec"><div class="modal-sec-title">Scores</div><div class="modal-scores">${barsHtml}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Descripción</div><div class="modal-sec-text">${TIPO_DESCRIPCION[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Rol en el equipo</div><div class="modal-sec-text">${TIPO_ROL_EQUIPO[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Motivador principal</div><div class="modal-sec-text">${TIPO_MOTIVADOR[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Punto ciego</div><div class="modal-sec-text" style="color:#ffb86c">${TIPO_PUNTO_CIEGO[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Fortalezas</div><div class="modal-tags">${(TIPO_FORTALEZAS[p.tipo]||[]).map(f=>`<span class="modal-tag">${f}</span>`).join('')}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Potencial de liderazgo</div><div class="modal-sec-text"><strong style="color:${lid.nivel==='Alto'?'#50fa7b':lid.nivel==='Medio'?'#e4c76a':'#a4a8c0'}">${lid.nivel}</strong> — ${lid.razon}</div></div>
      <div class="modal-sec">
        <div class="modal-sec-title">Alas</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:5px">
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:9px"><div style="font-size:1.4rem;font-weight:900;color:${a1c};line-height:1">${p.ala1}</div><div style="font-size:0.7rem;font-weight:600;color:${a1c}">${TIPO_CORTO[p.ala1]}</div><div style="font-size:0.64rem;color:#a4a8c0">${p.alaScore1}% ${p.alaDominante===p.ala1?'<strong style="color:#e4c76a">· Dom.</strong>':''}</div></div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:9px"><div style="font-size:1.4rem;font-weight:900;color:${a2c};line-height:1">${p.ala2}</div><div style="font-size:0.7rem;font-weight:600;color:${a2c}">${TIPO_CORTO[p.ala2]}</div><div style="font-size:0.64rem;color:#a4a8c0">${p.alaScore2}% ${p.alaDominante===p.ala2?'<strong style="color:#e4c76a">· Dom.</strong>':''}</div></div>
        </div>
      </div>
      <div class="modal-sec"><div class="modal-sec-title">Integración y estrés</div><div class="flechas-grid"><div class="fl-card fl-int"><div class="fl-label">↗ Crecimiento</div><div class="fl-num" style="color:#10b981">${p.integracion}</div><div class="fl-text">Hacia ${TIPO_CORTO[p.integracion]}</div></div><div class="fl-card fl-des"><div class="fl-label">↘ Estrés</div><div class="fl-num" style="color:#e17bd7">${p.desintegracion}</div><div class="fl-text">Hacia ${TIPO_CORTO[p.desintegracion]}</div></div></div></div>
      <div class="modal-sec"><div class="modal-sec-title">Cómo comunicarse</div><div class="modal-sec-text">${TIPO_COMUNICACION[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Feedback 1:1</div><div class="modal-sec-text">${TIPO_FEEDBACK_11[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Señales de burnout</div><div class="modal-sec-text" style="color:#ffb86c">${(TIPO_BURNOUT_SENALES[p.tipo]||[]).slice(0,4).join(' · ')}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Cómo liderarlo/a</div><div class="modal-sec-text">${TIPO_COMO_LIDERAR[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Estrategia de retención</div><div class="modal-sec-text">${TIPO_RETENCION[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Gestión del conflicto</div><div class="modal-sec-text">${TIPO_CONFLICTO_GESTION[p.tipo]}</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Desarrollo recomendado</div><div class="modal-sec-text">${TIPO_DESARROLLO[p.tipo]}</div></div>`;
  } else {
    body=`
      <div style="border-left:3px solid ${color};padding-left:14px;margin-bottom:14px">
        <div class="modal-type-num" style="color:${color}">${p.tipo}</div>
        <div class="modal-type-name">${TIPO_NOMBRES[p.tipo]}</div>
        <div class="modal-p-name">${esc(p.nombre)} · Evaluado: ${p.fecha||'Sin fecha'}</div>
      </div>

      <!-- BOTÓN INFORME COMPLETO — abre en ventana nueva -->
      <button onclick="verInformeCompleto(${currentModalIdx})"
        style="width:100%;padding:11px;border-radius:10px;border:1px solid rgba(107,225,227,0.35);background:linear-gradient(135deg,rgba(107,225,227,0.12),rgba(225,123,215,0.12));color:#fff;font-family:'Exo 2',sans-serif;font-weight:700;font-size:0.82rem;cursor:pointer;margin-bottom:14px;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s"
        onmouseover="this.style.background='linear-gradient(135deg,rgba(107,225,227,0.22),rgba(225,123,215,0.22))'"
        onmouseout="this.style.background='linear-gradient(135deg,rgba(107,225,227,0.12),rgba(225,123,215,0.12))'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        Ver informe completo de ${esc(p.nombre.split(' ')[0])}
      </button>

      <div class="modal-sec"><div class="modal-sec-title">Distribución de scores</div><div class="modal-scores">${barsHtml}</div></div>
      <div class="modal-sec">
        <div class="modal-sec-title">Score base</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:4px"><div style="flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden"><div style="height:100%;width:${p.scores[p.tipo]}%;background:linear-gradient(90deg,${color},#e4c76a);border-radius:3px"></div></div><span style="font-size:0.78rem;font-weight:700;color:${color}">${p.scores[p.tipo]}%</span></div>
      </div>
      <div class="inf-preview"><div class="inf-sec-title">Fortalezas naturales</div><ul class="inf-list">${(TIPO_FORTALEZAS[p.tipo]||[]).map(f=>`<li>${f}</li>`).join('')}</ul></div>
      <div class="inf-preview" style="margin-top:8px"><div class="inf-sec-title">Áreas de desarrollo</div><div style="font-size:0.76rem;color:#a4a8c0;line-height:1.65">${TIPO_DESARROLLO[p.tipo]}</div></div>
      <div class="modal-sec" style="margin-top:12px">
        <div class="modal-sec-title">Niveles de salud psicológica</div>
        <div class="health-grid">
          <div class="h-card h-sano"><div class="h-label">Nivel Sano</div><div class="h-text">${TIPO_NIVEL_SANO[p.tipo]}</div></div>
          <div class="h-card h-promedio"><div class="h-label">Nivel Promedio</div><div class="h-text">${TIPO_ROL_EQUIPO[p.tipo]}. Opera con sus patrones automáticos.</div></div>
          <div class="h-card h-insano"><div class="h-label">Bajo estrés</div><div class="h-text">${TIPO_NIVEL_INSANO[p.tipo]}</div></div>
        </div>
      </div>
      <div class="modal-sec"><div class="modal-sec-title">Integración y estrés</div><div class="flechas-grid"><div class="fl-card fl-int"><div class="fl-label">↗ Crecimiento</div><div class="fl-num" style="color:#10b981">${p.integracion}</div><div class="fl-text">Hacia ${TIPO_CORTO[p.integracion]}: ${TIPO_DESCRIPCION[p.integracion].substring(0,65)}...</div></div><div class="fl-card fl-des"><div class="fl-label">↘ Estrés</div><div class="fl-num" style="color:#e17bd7">${p.desintegracion}</div><div class="fl-text">Hacia ${TIPO_CORTO[p.desintegracion]}: patrones de mayor tensión bajo presión.</div></div></div></div>
      <div class="modal-sec"><div class="modal-sec-title">En el trabajo</div><div class="modal-sec-text"><strong style="color:#e4c76a">Motivación:</strong> ${TIPO_MOTIVADOR[p.tipo]}</div><div class="modal-sec-text" style="margin-top:5px"><strong style="color:#6be1e3">Rol:</strong> ${TIPO_ROL_EQUIPO[p.tipo]}.</div></div>
      <div class="modal-sec"><div class="modal-sec-title">Recomendaciones RRHH</div><div class="modal-sec-text">${TIPO_FEEDBACK_11[p.tipo].substring(0,200)}...</div></div>`;
  }
  document.getElementById('personModalContent').innerHTML=tabsHtml+body;
}

function switchModalTab(tab){
  currentModalTab=tab;
  const p=filteredPersons[currentModalIdx]; if(!p) return;
  renderModalContent(p,tab);
}

// ── Ver informe completo — en ventana nueva, sin reemplazar el panel ───────────
function verInformeCompleto(idx){
  const p=filteredPersons[idx]; if(!p) return;
  const payload={
    Nombre:p._nombre||p.nombre.split(' ')[0]||'',
    Apellido:p._apellido||p.nombre.split(' ').slice(1).join(' ')||'',
    Correo:p.email, Fecha:p.fecha, User:p.user,
    Respuestas:p.respuestas,
    Eneatipo:p.tipo,
    EneatipoNombre:'Tipo '+p.tipo+': '+TIPO_NOMBRES[p.tipo],
    Informe:'Tipo '+p.tipo+': '+TIPO_NOMBRES[p.tipo],
    scores:p.scores, percentages:p.scores
  };
  // Guardar con ambas claves que lee el Informe
  sessionStorage.setItem('eneagramaUserData',  JSON.stringify(payload));
  sessionStorage.setItem('EneagramaUserData',  JSON.stringify(payload));
  // Abrir en ventana nueva — el panel queda intacto
  window.open('../../Informe/index.html', '_blank', 'noopener');
}

function closePersonModal(){
  const overlay=document.getElementById('personModalOverlay');
  overlay.classList.add('hidden'); overlay.classList.remove('is-open');
  const box=document.getElementById('personModalBox');
  box.classList.remove('is-full');
  document.getElementById('modalBackdrop').classList.add('hidden');
}

function expandPersonModal(){
  const box=document.getElementById('personModalBox');
  const btn=document.getElementById('btnExpand');
  const isFull=box.classList.contains('is-full');
  if(!isFull){
    box.classList.add('is-full');
    document.getElementById('modalBackdrop').classList.remove('hidden');
    btn.innerHTML=`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>`;
  } else {
    box.classList.remove('is-full');
    document.getElementById('modalBackdrop').classList.add('hidden');
    btn.innerHTML=`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function setText(id,value){ const el=document.getElementById(id); if(el) el.textContent=value; }
function esc(str){ const d=document.createElement('div'); d.appendChild(document.createTextNode(str||'')); return d.innerHTML; }