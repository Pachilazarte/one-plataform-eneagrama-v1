(function () {
  'use strict';

  // EneagramaTheme se verifica en tiempo de uso, no de carga

  /* ===========================================================
     ALGORITMO CORRECTO: PI->T1, PII->T2, PIII->T3... PIX->T9
     Mapeo directo seccion -> tipo (segun eneagramaCalc.js del proyecto)
     Score = suma de respuestas de esa seccion / (n x 5) x 100
  =========================================================== */
  const SECCION_A_TIPO = {
    'PI':1,'PII':2,'PIII':3,'PIV':4,'PV':5,'PVI':6,'PVII':7,'PVIII':8,'PIX':9,
  };

  const TYPE_NAMES = {
    1:'El Perfeccionista',2:'El Ayudador',3:'El Triunfador',4:'El Individualista',
    5:'El Investigador',6:'El Leal',7:'El Entusiasta',8:'El Desafiador',9:'El Pacificador',
  };
  const TYPE_TRIADA = {1:'Cuerpo',2:'Corazon',3:'Corazon',4:'Corazon',5:'Cabeza',6:'Cabeza',7:'Cabeza',8:'Cuerpo',9:'Cuerpo'};
  const TYPE_EMOCION = {1:'Ira reprimida',2:'Verguenza',3:'Verguenza',4:'Verguenza',5:'Miedo',6:'Miedo',7:'Miedo',8:'Ira expresada',9:'Ira adormecida'};
  const TYPE_PASION  = {1:'Ira',2:'Orgullo',3:'Engano',4:'Envidia',5:'Avaricia',6:'Miedo',7:'Gula',8:'Lujuria',9:'Pereza'};
  const TYPE_VIRTUD  = {1:'Serenidad',2:'Humildad',3:'Autenticidad',4:'Ecuanimidad',5:'No apego',6:'Valentia',7:'Sobriedad',8:'Inocencia',9:'Accion'};
  const TYPE_INTEG   = {1:7,2:4,3:6,4:1,5:8,6:9,7:5,8:2,9:3};
  const TYPE_DESINT  = {1:4,2:8,3:9,4:2,5:7,6:3,7:1,8:5,9:6};
  const TYPE_COLOR   = {1:[168,52,44],2:[190,75,115],3:[190,130,35],4:[95,75,155],5:[52,90,158],6:[45,115,95],7:[200,145,35],8:[148,42,42],9:[72,132,92]};

  const SECTION_TITLES = [
    'Carta Personal de Bienvenida','Historia y Origen del Eneagrama',
    'Las Tres Triadas - Centros de Inteligencia','Los Niveles de Desarrollo Psicologico',
    'Alas - Los Matices del Caracter','Flechas - Integracion y Desintegracion',
    'Los 27 Subtipos Instintivos','Tu Perfil Eneagramatico: Quien Sos',
    'Tus Fortalezas y Puntos de Cuidado','Comunicacion Estrategica por Eneatipo',
    'Liderazgo y Equipos desde tu Eneatipo','Plan de Desarrollo Personal 90 Dias',
    'Herramientas Practicas y Compromisos',
  ];

  /* ===========================================================
     ALAS
  =========================================================== */
  const TYPE_ALAS = {
    1:{a:{num:9,n:'1w9 - El Idealista sereno',d:'Mas tranquilo, reflexivo y reservado. Equilibra la exigencia con una paciencia contemplativa profunda.'},
       b:{num:2,n:'1w2 - El Defensor apasionado',d:'Mas empatico, calido y activo socialmente. Combina la rectitud moral con deseo genuino de ayudar.'}},
    2:{a:{num:1,n:'2w1 - El Altruista etico',d:'Mas principista, organizado y criterioso. Ayuda desde un sentido profundo del deber y la correccion.'},
       b:{num:3,n:'2w3 - El Anfitrion ambicioso',d:'Mas extrovertido y orientado al reconocimiento. Combina la generosidad con una presencia carismatica.'}},
    3:{a:{num:2,n:'3w2 - El Encantador',d:'Mas orientado a las personas y carismatico. Combina la ambicion de logros con calidez genuina.'},
       b:{num:4,n:'3w4 - El Profesional',d:'Mas introspectivo, creativo y profundo. Equilibra el exito con busqueda de autenticidad real.'}},
    4:{a:{num:3,n:'4w3 - La Estrella',d:'Mas extrovertido, ambicioso y orientado a destacar. La creatividad al servicio de la visibilidad.'},
       b:{num:5,n:'4w5 - El Bohemio',d:'Mas introvertido, intelectual y original. La profundidad emocional se funde con el rigor analitico.'}},
    5:{a:{num:4,n:'5w4 - El Iconoclasta',d:'Mas creativo e individualista. El analisis riguroso al servicio de una vision unica y profunda.'},
       b:{num:6,n:'5w6 - El Solucionador',d:'Mas leal, practico y orientado a sistemas. El conocimiento al servicio de la seguridad colectiva.'}},
    6:{a:{num:5,n:'6w5 - El Defensor',d:'Mas analitico y autonomo en la busqueda de seguridad. Combina lealtad con mente investigadora.'},
       b:{num:7,n:'6w7 - El Companero',d:'Mas sociable, espontaneo y con redes de apoyo amplias. Equilibra la precaucion con el entusiasmo.'}},
    7:{a:{num:6,n:'7w6 - El Entretenido',d:'Mas responsable, leal y comprometido. El entusiasmo con un ancla de responsabilidad real.'},
       b:{num:8,n:'7w8 - El Realista',d:'Mas directo, asertivo y tolerante al riesgo. La vision expansiva con determinacion de ejecutar.'}},
    8:{a:{num:7,n:'8w7 - El Independiente',d:'Mas expansivo, aventurero y de alto impacto. Combina la fuerza con energia visionaria y dinamica.'},
       b:{num:9,n:'8w9 - El Oso',d:'Mas tranquilo, contenido y protector. La fortaleza que cuida sin necesitar confrontacion permanente.'}},
    9:{a:{num:8,n:'9w8 - El Arbitro',d:'Mas asertivo y capaz de tomar postura firme. La armonia que puede defender sus valores con claridad.'},
       b:{num:1,n:'9w1 - El Sonador',d:'Mas idealista, ordenado y orientado a principios. La paz interior al servicio de un proposito etico.'}},
  };

  /* ===========================================================
     DATOS POR ENEATIPO - contenido personalizado completo
  =========================================================== */
  const TD = {
    1:{
      lema:'Tiene que estar bien hecho! Como podemos mejorar esto al maximo nivel?',
      motivador:'Mejorar el mundo con estandares elevados y actuar con integridad absoluta en cada accion.',
      miedo:'Ser corrupto, imperfecto o defectuoso; no estar a la altura de su propio ideal interior.',
      deseo:'Ser bueno e integro; mejorar las cosas para que funcionen como deberian funcionar.',
      preguntaFav:'Como se hace correctamente? Como podemos mejorar esto? Cual es el procedimiento correcto?',
      fortalezas:[
        'Estandares eticos que elevan la calidad del entorno colectivo de forma sostenida y consistente.',
        'Capacidad de detectar errores antes de que escalen a problemas mayores en los proyectos.',
        'Disciplina y organizacion que crean sistemas confiables y procesos robustos y reproducibles.',
        'Sentido de justicia que protege los derechos de todos los integrantes del equipo por igual.',
        'Perseverancia para completar lo que inicia sin atajos ni compromisos de calidad en el proceso.',
        'Voz etica que actua como brujula moral confiable para todo el equipo cuando la situacion lo exige.',
      ],
      cuidados:[
        'Perfeccionismo que paraliza decisiones o crea atmosferas tensas y juzgadoras para el equipo.',
        'Autocritica y critica a los demas que desgasta vinculos valiosos con el tiempo sin resolverlos.',
        'Rigidez ante metodos alternativos igualmente validos - "diferente" no significa "incorrecto".',
        'Dificultad para delegar por miedo a que no se haga exactamente como lo haria uno mismo.',
        'Represion de la ira que se acumula silenciosamente y estalla de forma inesperada y desproporcionada.',
        'Dificultad para celebrar logros - siempre hay algo que pudo ser mejor o mas perfecto aun.',
      ],
      comunicacion_hacer:['Se claro sobre los estandares esperados desde el inicio.','Reconoce sus logros con hechos concretos y especificos.','Dale espacio para revisar antes de presentar.','Acepta su feedback detallado como un regalo genuino.'],
      comunicacion_evitar:['Criticar errores sin reconocer primero los logros conseguidos.','Cambiar criterios sin explicacion ni aviso previo al equipo.','Microgestion - necesita autonomia sobre su propio proceso.','Pedir "hacerlo rapido aunque salga mal".'],
      liderazgo:[
        'Lideras desde el ejemplo: mostras con tu propio trabajo el estandar que esperas de los demas.',
        'Tu equipo sabe que pueden confiar en tus criterios porque son consistentes y bien fundamentados.',
        'Tenes la capacidad de construir sistemas y procesos que perduran mas alla de los proyectos.',
        'En momentos de crisis etica, tu voz es la que orienta al grupo hacia lo correcto con claridad.',
        'Tu reto es aprender a liderar desde la inspiracion y la confianza, ademas de desde el estandar.',
        'Cuando delegas con confianza real, multiplicas el compromiso y la autonomia del equipo completo.',
      ],
      equipos:[
        'Aportas estructura, rigor y calidad sostenida que eleva el estandar de todo el equipo.',
        'Actuas como guardian natural de los procesos y los valores que el grupo acordo sostener.',
        'Tu punto de mejora es aprender a celebrar los avances parciales sin esperar la perfeccion final.',
        'Cuando confias en el proceso del otro aunque sea diferente al tuyo, multiplicas el compromiso.',
      ],
      comunicacionEstilo:'Tu comunicacion tiende a ser precisa, estructurada y orientada a la correccion. Priorizas la exactitud sobre la conexion emocional cuando hay presion. El riesgo es que la otra persona sienta que la estas evaluando mas que escuchando.',
      conflictoEstilo:'Frente al conflicto, tu tendencia es senalar lo incorrecto con claridad y buscar la solucion objetivamente correcta. Tu ventaja es la claridad; tu riesgo es que la otra persona sienta que el proceso es un juicio, no una conversacion.',
      desarrollo:['Practicar la aceptacion activa: lo bien hecho hoy es suficiente para avanzar manana.','Aprender a delegar con confianza - "diferente" no es sinonimo de "incorrecto" ni de "peor".','Desarrollar la capacidad de celebrar y reconocer logros parciales del equipo con genuino entusiasmo.','Trabajar la expresion saludable de la frustracion antes de que se acumule hasta el desborde.','Integrar la espontaneidad y la alegria del punto de integracion (T7) en el cotidiano.'],
      escenarios:[
        {label:'Situacion A',title:'Un colega no cumple estandares de calidad acordados',natural:'Tu tendencia es senalar directamente los errores y explicar cual es el modo correcto de hacerlo.',why:'Tu capacidad de identificar el problema con precision y proponer la solucion correcta es exactamente lo que se necesita.',adjust:'Antes de senalar el error, reconoce el esfuerzo genuino que la persona puso. La critica sin reconocimiento previo genera resistencia en lugar de mejora sostenida.'},
        {label:'Situacion B',title:'El equipo propone un metodo diferente al tuyo',natural:'Tu tendencia es defender el proceso correcto y senalar las fallas del metodo alternativo con argumentos solidos.',why:'Tu orientacion a los procesos protege al equipo de errores costosos que un metodo no validado puede generar.',adjust:'Antes de rechazar el metodo diferente, pregunta genuinamente que ventajas ven en el. A veces hay sabiduria en lo diferente que vale la pena integrar.'},
        {label:'Situacion C',title:'Tenes que entregar algo con tiempo insuficiente',natural:'Tu tendencia es resistirte a entregar algo que no cumple el estandar que consideras minimamente aceptable.',why:'Tu orientacion a la calidad protege la reputacion del equipo y el valor del trabajo entregado.',adjust:'Practica la regla del 80%: con el 80% de la perfeccion deseada, podes entregar valor real. Comunica claramente que quedo pendiente y por que.'},
        {label:'Situacion D',title:'Un miembro del equipo cometio un error grave',natural:'Tu tendencia es analizar el error en detalle, identificar la causa raiz y establecer el proceso correcto para que no se repita.',why:'Tu capacidad de aprendizaje sistematico de los errores es uno de los recursos mas valiosos para el equipo a largo plazo.',adjust:'Antes del analisis tecnico, asegurate de que la persona se sienta segura para hablar del error sin miedo al juicio. El aprendizaje solo ocurre en un clima de seguridad psicologica.'},
      ],
      plan90:{
        m1:[['Registrar el critico interno en accion','Cada vez que te juzgues a vos mismo con dureza, escribilo. Cuantas veces por dia? Que lo dispara?','Diario'],
            ['Observar el impacto de tu estandar en el equipo','Anota situaciones donde tu exigencia elevo al equipo y otras donde lo tensiono innecesariamente.','Semanal'],
            ['Pedir feedback honesto sobre tu estilo','Pregunta a dos personas: "Cuando mi orientacion a la calidad suma? Cuando resta o bloquea?"','Una vez']],
        m2:[['Practicar el 80% suficiente','Elegi una tarea esta semana donde entregas con 80% de perfeccion. Observa que consecuencias concretas tiene.','Una vez/semana'],
            ['Celebrar un logro sin mencionar lo que falto','Reconoce publicamente un resultado positivo del equipo sin agregar ninguna observacion de mejora.','Semanal'],
            ['Delegar algo que normalmente retenes','Delega una tarea con expectativas claras de resultado. Solta el metodo sin intervenir en el proceso.','Quincenal']],
        m3:[['Integrar espontaneidad de T7 una vez por semana','Agenda una actividad sin objetivo de mejora - solo disfrute genuino, sin evaluar si lo hiciste "bien".','Semanal'],
            ['Facilitar una revision sin critica','En una revision de equipo, solo hace preguntas abiertas. No senales errores. Solo pregunta.','Una vez'],
            ['Solicitar feedback 360','Pedi feedback a tu lider, un par y un colaborador sobre tu impacto como referente de calidad y tu apertura.','Una vez al cierre']],
      },
      checkin:['Hubo algo que hice bien hoy que merezca reconocimiento genuino, sin condiciones ni "peros"?','Mi critica interna me ayudo a crecer esta semana o simplemente me paralizo?','Donde mi estandar elevo al equipo? Donde lo tensiono mas de lo necesario?','Delegue algo con confianza real, soltando el metodo y no solo el resultado esperado?','Me permiti un momento de disfrute esta semana sin evaluarlo ni mejorarlo?'],
      commitment:['Practicar la aceptacion: lo suficientemente bueno de hoy es suficiente para avanzar manana.','Delegar con confianza real, soltando el metodo despues de definir el resultado esperado.','Celebrar logros parciales del equipo con la misma energia que dedico a la mejora continua.'],
    },

    2:{
      lema:'Como puedo ayudarte? Lo que necesites, aqui estoy para vos.',
      motivador:'Sentirse amado y necesario brindando apoyo, carino y ayuda incondicional a quienes le rodean.',
      miedo:'No ser amado ni querido; ser rechazado o percibido como prescindible e innecesario para los demas.',
      deseo:'Sentirse amado; ser reconocido como alguien cuya presencia importa y hace la diferencia real.',
      preguntaFav:'Quien necesita ayuda ahora? Quien no esta bien? Como puedo ser util en este momento concreto?',
      fortalezas:['Empatia profunda que conecta autenticamente con las necesidades emocionales ajenas de forma sostenida.','Calidez que crea ambientes de trabajo seguros y psicologicamente confiables para todo el equipo.','Motiva a otros haciendolos sentir genuinamente valorados, vistos y reconocidos en su aporte.','Red de relaciones amplia basada en generosidad real, incondicional y consistente en el tiempo.','Intuicion social para detectar quien necesita que y cuando intervenir con apoyo o presencia.','Motor emocional del equipo: cuando hay tension, suaviza; cuando hay apatia, conecta y reactiva.'],
      cuidados:['Dificultad severa para establecer limites - asume responsabilidades de otros hasta el agotamiento.','Busqueda de reconocimiento que puede derivar en manipulacion emocional sutil cuando no llega.','Descuida sistematicamente sus propias necesidades hasta llegar al colapso fisico o emocional.','Puede generar dependencia en lugar de promover la autonomia real de las personas que ayuda.','Resentimiento silencioso cuando el esfuerzo no es valorado ni correspondido por los demas.','Mas comodo dando que aceptando ayuda, cuidado o reconocimiento genuino de quienes le rodean.'],
      comunicacion_hacer:['Expresa gratitud genuina y especifica por su aporte y presencia.','Invitalo a compartir sus propias necesidades sin que se sienta egoista.','Crea espacios donde pueda recibir apoyo sin verguenza ni incomodidad.','Recordale que puede poner limites y seguir siendo valioso para todos.'],
      comunicacion_evitar:['Ignorar su esfuerzo - necesita sentir que importa y que se ve.','Explotarlo por su tendencia natural a decir siempre que si a todo.','Criticarlo publicamente - lo afecta con profundidad y duracion.','Pedir objetividad total en conflictos donde hay dimensiones relacionales.'],
      liderazgo:['Lideras desde la conexion: creas el clima emocional que hace posible el compromiso genuino del equipo.','Tu equipo siente que alguien realmente se preocupa por ellos, y eso multiplica el rendimiento sostenido.','Tenes una habilidad natural para leer el estado emocional del grupo y actuar sobre el con precision.','En momentos de tension, tu presencia calma y reencuadra antes de que el conflicto escale mas.','Tu reto mas profundo es aprender a liderar tambien poniendo limites claros desde un lugar de cuidado.','Cuando cuidas tu propia energia, tu capacidad de cuidar al equipo se vuelve mas sostenible y genuina.'],
      equipos:['Sos el corazon emocional del equipo - quien mantiene el pegamento afectivo que une a las personas.','Creas una cultura de cuidado genuino que mejora el bienestar y la retencion del talento de forma real.','Tu punto de mejora es aprender a recibir ayuda con la misma apertura con que la das generosamente.','Cuando pones limites saludables, modelas una cultura de respeto mutuo que el equipo puede aprender.'],
      comunicacionEstilo:'Tu comunicacion es calida, empatica y orientada al vinculo. Priorizas la conexion emocional sobre la directness cuando hay presion. El riesgo es suavizar tanto el mensaje que el otro no recibe con claridad lo que necesita escuchar.',
      conflictoEstilo:'Frente al conflicto, tu primera tendencia es preservar el vinculo y bajar la tension a cualquier costo. Tu ventaja es la conexion humana; tu riesgo es ceder demasiado para mantener la armonia sin resolver el fondo real del problema.',
      desarrollo:['Aprender a identificar y expresar las propias necesidades sin culpa ni disculpas exageradas.','Practicar el "no" como acto de amor propio y honestidad, no como rechazo hacia el otro.','Desarrollar la capacidad de recibir ayuda, reconocimiento y cuidado de otros con apertura real.','Trabajar la humildad autentica: ayudar desde la libertad y el amor, no desde el miedo a no ser necesario.','Integrar la profundidad y el autoconocimiento del punto de integracion (T4) en la vida cotidiana.'],
      escenarios:[
        {label:'Situacion A',title:'Alguien del equipo pide tu ayuda cuando ya estas al limite',natural:'Tu tendencia es decir que si y asumir la carga adicional aunque no tenes espacio real para hacerlo bien.',why:'Tu genuina orientacion a las personas hace que quieras estar disponible para quienes te necesitan.',adjust:'Practica la honestidad cuidadosa: "Quiero ayudarte y en este momento no tengo la capacidad de hacerlo bien. Podemos buscar otra solucion juntos?" Ese limite es tambien un acto de cuidado.'},
        {label:'Situacion B',title:'Tu aporte al equipo no es reconocido publicamente',natural:'Tu tendencia es sentir resentimiento interno sin expresarlo, y trabajar mas para finalmente ser visto.',why:'Tu orientacion al reconocimiento como validacion de amor hace que el silencio se sienta como rechazo.',adjust:'Aprende a comunicar proactivamente tu propio aporte: "Trabaje en X y llegamos al resultado Y." No es vanidad - es visibilidad legitima de un trabajo real.'},
        {label:'Situacion C',title:'Tenes que dar feedback correctivo a alguien que queres',natural:'Tu tendencia es suavizar tanto el mensaje que la persona no entiende la gravedad de lo que necesita cambiar.',why:'Tu orientacion al vinculo hace que quieras proteger a la persona de la incomodidad del feedback directo.',adjust:'El feedback verdaderamente cuidadoso es el que llega con claridad. Un mensaje suavizado que no se entiende no ayuda a nadie. Combina la calidez con la directness.'},
        {label:'Situacion D',title:'El equipo te pide que tomes una posicion dificil en un conflicto',natural:'Tu tendencia es intentar mediar sin tomar partido, esperando que ambas partes lleguen solas al acuerdo.',why:'Tu capacidad de ver las necesidades de todos los involucrados es genuinamente valiosa en conflictos complejos.',adjust:'A veces la mediacion requiere tomar partido. Tu voz y tu perspectiva son valiosas - usarlas activamente es tambien un acto de cuidado hacia el equipo.'},
      ],
      plan90:{
        m1:[['Detectar el patron de dar sin recibir','Anota esta semana cuantas veces ayudaste y cuantas veces expresaste lo que vos necesitabas.','Semanal'],
            ['Registrar emociones propias antes de ayudar','Antes de cada acto de ayuda, preguntate: "Que estoy sintiendo yo ahora mismo?"','Diario'],
            ['Pedir feedback sobre tu patron de limites','Pregunta a alguien de confianza: "Cuando crees que doy demasiado sin pedir nada?"','Una vez']],
        m2:[['Practicar pedir ayuda activamente','Una vez por semana, pedile algo concreto a alguien del equipo o tu circulo cercano.','Semanal'],
            ['Decir no en una situacion de bajo riesgo','Elegi una situacion menor y declina sin disculpa excesiva. Observa que cambia.','Una vez/semana'],
            ['Expresar una necesidad propia en conversacion','En una conversacion de esta semana, comparti algo que vos necesitas sin redirigirlo al otro.','Semanal']],
        m3:[['Integrar reflexion de T4 cada semana','Reserva 15 minutos semanales solo para tu propia vida interior, sin pensar en nadie mas.','Semanal'],
            ['Recibir un reconocimiento sin minimizarlo','La proxima vez que te reconozcan, practica solo decir "gracias" sin restarle valor.','Cuando suceda'],
            ['Solicitar feedback 360','Pedi feedback sobre tu capacidad de poner limites y tu autenticidad en el cuidado del equipo.','Una vez al cierre']],
      },
      checkin:['Exprese algo que yo necesitaba esta semana, sin esperar que el otro lo adivine?','Puse algun limite necesario aunque me generara incomodidad o culpa?','Recibi ayuda o reconocimiento esta semana con apertura genuina y sin minimizarlo?','Ayude desde el amor y la eleccion libre, o desde el miedo a no ser necesario o querido?','Dedique tiempo real a mi propia vida interior sin agenda de dar al otro?'],
      commitment:['Identificar y expresar mis propias necesidades sin culpa ni disculpa excesiva.','Poner limites claros como acto de amor propio y de respeto mutuo genuino.','Recibir cuidado y reconocimiento con la misma apertura con que los doy.'],
    },

    3:{
      lema:'Cual es el resultado? Vamos a lograrlo. Ya tengo el plan.',
      motivador:'Sentirse valioso siendo exitoso, productivo y reconocido por sus logros tangibles y visibles.',
      miedo:'Ser un fracasado; que sus logros no sean suficientes para merecer amor y aceptacion genuine.',
      deseo:'Sentirse valioso; ser admirado y reconocido por sus resultados segun los estandares del entorno.',
      preguntaFav:'Que hay que lograr? Cual es el objetivo concreto? Cuando lo presentamos y como lo hacemos visible?',
      fortalezas:['Energia contagiosa que impulsa al equipo hacia resultados con urgencia y determinacion genuina.','Capacidad adaptativa para presentarse efectivamente en cualquier contexto o audiencia con naturalidad.','Eficiencia y orientacion a objetivos que optimiza tiempos y recursos de forma notable y sostenida.','Habilidad natural para el marketing personal y la comunicacion de ideas con impacto y claridad.','Resiliencia: se recupera rapido de los fracasos y vuelve a la accion sin paralizarse ni rumiar.','Inspira con el ejemplo - lidera desde los resultados concretos, no solo desde el discurso motivacional.'],
      cuidados:['Puede priorizar la imagen publica sobre la autenticidad genuina en situaciones de presion.','Dificultad para conectar emocionalmente - puede ver a las personas como medios para un fin.','Sobrecarga de trabajo para evitar confrontar el vacio interior que aparece cuando para.','Tendencia a decir lo que el entorno quiere escuchar para obtener aprobacion y validacion.','Evita activamente la vulnerabilidad, limitando la profundidad real de las relaciones que construye.','Bajo estres extremo: desconexion total y procrastinacion (movimiento a T9 desintegrado).'],
      comunicacion_hacer:['Presenta objetivos con metricas y plazos claramente definidos.','Reconoce sus logros publicamente y con especificidad concreta.','Dale libertad para disenar como alcanzar los objetivos del proyecto.','Invitalo a reflexionar sobre el impacto humano de su trabajo.'],
      comunicacion_evitar:['Trabajo sin reconocimiento visible por sus resultados y esfuerzo.','Reuniones largas sin agenda ni conclusiones concretas y accionables.','Microgestion del proceso - necesita autonomia real para operar.','Pedirle vulnerabilidad sin haber construido confianza previa.'],
      liderazgo:['Lideras desde la accion: donde otros dudan, vos empezas. Esa energia concreta mueve montanas.','Tu capacidad de transformar objetivos ambiguos en planes concretos y ejecutables es excepcional.','Inspiras con el ejemplo - tu productividad y compromiso elevan el estandar real del equipo.','En momentos de presion, tu resiliencia y orientacion al resultado estabilizan y orientan al grupo.','Tu reto mas profundo es aprender a liderar desde el ser genuino ademas del hacer y del lograr.','Cuando te mostras autentico, incluyendo tus dudas, el equipo confia en vos de forma mas profunda.'],
      equipos:['Sos el motor de accion del equipo - quien convierte ideas en resultados concretos y medibles.','Tu energia y optimismo sobre lo posible contagian y movilizan a quienes trabajan con vos.','Tu punto de mejora es aprender a ver el valor del proceso y de las personas mas alla del resultado.','Cuando te mostras autentico con tus dudas y limitaciones, el equipo te sigue con mas lealtad real.'],
      comunicacionEstilo:'Tu comunicacion es directa, eficiente y orientada al resultado. Priorizas la claridad sobre la conexion emocional cuando hay presion. El riesgo es que la otra persona sienta que la conversacion es un briefing y no un intercambio genuino entre personas.',
      conflictoEstilo:'Frente al conflicto, tu tendencia es ir al punto, identificar la solucion y seguir avanzando. Tu ventaja es la velocidad de resolucion; tu riesgo es que la otra persona sienta que el problema fue resuelto sin que se sintiera escuchada realmente.',
      desarrollo:['Aprender a valorarse por quien se es genuinamente, no por lo que se logra o aparenta.','Practicar la vulnerabilidad genuina en relaciones de confianza, sin reencuadrarla como debilidad.','Desarrollar la capacidad de estar presente en el proceso, no solo orientado hacia el resultado final.','Trabajar la autenticidad: actuar desde los valores reales, no desde la imagen que el entorno espera.','Integrar la lealtad y el compromiso genuino del punto de integracion (T6) en el dia a dia.'],
      escenarios:[
        {label:'Situacion A',title:'El proyecto que lideras va mas lento de lo esperado',natural:'Tu tendencia es acelerar el ritmo, presionar al equipo y encontrar formas de compensar el tiempo perdido.',why:'Tu orientacion al resultado y tu capacidad de mantener el foco en el objetivo son exactamente lo que el equipo necesita para no perder el rumbo.',adjust:'Antes de presionar, pregunta genuinamente que esta frenando al equipo. A veces el problema de velocidad tiene causas relacionales o estructurales que la presion no resuelve y puede empeorar.'},
        {label:'Situacion B',title:'Alguien del equipo tiene un rendimiento bajo y sostenido',natural:'Tu tendencia es senalar directamente el problema de rendimiento y establecer expectativas claras y medibles.',why:'Tu claridad sobre los estandares de rendimiento protege al equipo y al proyecto de consecuencias mayores.',adjust:'Antes de la conversacion sobre rendimiento, toma tiempo para entender que esta pasando con la persona. La performance baja casi siempre tiene contexto humano que vale conocer antes de actuar.'},
        {label:'Situacion C',title:'Te piden compartir algo personal con el equipo',natural:'Tu tendencia es compartir una version pulida y positiva de tu historia, enfatizando los logros y minimizando las dificultades.',why:'Tu capacidad de comunicar con impacto y de enmarcar tu historia de forma inspiradora es genuinamente valiosa para el equipo.',adjust:'La historia que mas conecta con las personas no es la de los logros - es la de las dificultades genuinas. Mostrar vulnerabilidad real te acerca mas profundamente a tu equipo.'},
        {label:'Situacion D',title:'El equipo logra un resultado importante',natural:'Tu tendencia es celebrar rapido y enfocarte en el proximo objetivo mientras el equipo todavia esta procesando el logro.',why:'Tu orientacion al futuro y a los proximos desafios mantiene el momentum y la energia alta del equipo.',adjust:'Antes de mirar al proximo objetivo, detente en el logro presente. Nombra quien aporto que. Deja que el equipo lo celebre genuinamente. Esos momentos construyen cultura y lealtad real.'},
      ],
      plan90:{
        m1:[['Registrar el "ser vs. parecer"','Cada dia anota una accion desde lo que realmente sos y una desde la imagen. Cuantas de cada una?','Diario'],
            ['Observar el trabajo sin audiencia','Elegi una tarea esta semana que hagas solo para vos, sin contarle a nadie el resultado.','Semanal'],
            ['Pedir feedback sobre autenticidad','Pregunta a alguien de confianza: "Cuando sentis que soy autentico? Cuando no tanto?"','Una vez']],
        m2:[['Compartir una vulnerabilidad real','En una conversacion de confianza, conta algo que te costo o donde fallaste sin reencuadrarlo como exito.','Una vez/semana'],
            ['Celebrar un proceso sin resultado visible','Reconoce el esfuerzo de alguien del equipo aunque no tenga resultado medible todavia.','Semanal'],
            ['Hacer algo sin objetivo de resultado','Dedicate a una actividad que no produzca nada medible - solo por el proceso en si mismo.','Una vez']],
        m3:[['Integrar lealtad de T6 cada semana','Una vez por semana, preguntate: "Que compromiso genuino estoy sosteniendo mas alla del resultado?"','Semanal'],
            ['Liderar desde la escucha activa','En una reunion, solo escucha y hace preguntas. No presentes ni propongas soluciones.','Una vez'],
            ['Solicitar feedback 360','Pedi feedback sobre tu autenticidad, tu conexion emocional y tu presencia real en el equipo.','Una vez al cierre']],
      },
      checkin:['Actue desde quien realmente soy esta semana, o desde quien creo que el entorno quiere ver?','Me permiti ser vulnerable en alguna conversacion importante esta semana?','Valore el proceso de alguien del equipo mas alla de su resultado visible y medible?','Hice algo esta semana sin audiencia, solo para mi y sin contar el resultado?','Que compromiso genuino sostuve esta semana mas alla del rendimiento y los logros?'],
      commitment:['Actuar desde los valores reales, no desde la imagen que el entorno espera y premia.','Practicar la vulnerabilidad genuina en las relaciones de confianza del equipo.','Valorar el proceso y las personas mas alla de los resultados medibles y visibles.'],
    },

    4:{
      lema:'Quiero ser autentico y unico. Necesito sentir profundamente.',
      motivador:'Crear una identidad significativa y unica; ser comprendido en su profundidad emocional genuina.',
      miedo:'No tener identidad propia; ser ordinario, sin significado o profundamente defectuoso en lo esencial.',
      deseo:'Encontrar el yo autentico; ser reconocido y valorado por su singularidad interior genuina.',
      preguntaFav:'Quien soy realmente? Que hace que esto sea unico? Por que todos parecen tener lo que me falta?',
      fortalezas:['Creatividad que aporta perspectivas unicas imposibles de obtener desde lo convencional o lo ordinario.','Empatia profunda con el dolor ajeno - los demas se sienten genuinamente comprendidos y acompanados.','Capacidad de dar sentido estetico y significado profundo al trabajo del equipo mas alla de la funcion.','Autenticidad que inspira a otros a ser mas genuinos y a explorar su propia profundidad interior.','Intuicion aguda sobre el estado emocional real del grupo, incluso lo no dicho ni reconocido todavia.','Transforma el sufrimiento en creacion: convierte las crisis en oportunidades genuinas de significado.'],
      cuidados:['Intensidad emocional que puede desestabilizar dinamicas del equipo en momentos criticos de presion.','Melancolia o envidia que nubla la percepcion de lo positivo, lo disponible y lo que ya se tiene.','Tendencia a dramatizar o quedarse atrapado en el problema sin dar el paso hacia la accion concreta.','Sensacion de incomprension cronica que genera distanciamiento voluntario de quienes lo rodean.','Dificultad para concretar proyectos cuando el entusiasmo inicial decae y queda solo la ejecucion.','Comparacion constante con los demas que genera insatisfaccion cronica con lo propio y lo logrado.'],
      comunicacion_hacer:['Reconoce su contribucion unica y lo que diferencia genuinamente su aporte.','Crea espacio para su perspectiva antes de buscar soluciones al problema.','Conecta las tareas con un proposito mayor y genuinamente significativo.','Dale tiempo para procesar emocionalmente antes de pedir una decision.'],
      comunicacion_evitar:['Pedir uniformidad - necesita expresar su singularidad de forma genuina.','Trivializar sus emociones o pedirle que "sea mas positivo" o practico.','Rutina excesiva sin variacion creativa ni autonomia en el proceso.','Compararlo con otros o recordarle como lo hacen los demas.'],
      liderazgo:['Lideras desde la profundidad: creas un espacio donde las cosas importan genuinamente al equipo.','Tu capacidad de dar significado al trabajo transforma la rutina en proposito compartido y sentido real.','Aportas la dimension humana y estetica que convierte un proyecto funcional en algo memorable.','En momentos de crisis emocional del equipo, tu profundidad y presencia son un recurso valioso real.','Tu reto es aprender a anclar esa profundidad genuina en compromisos concretos y sostenidos en el tiempo.','Cuando gestionas tu intensidad emocional, tu liderazgo gana en consistencia y confiabilidad real.'],
      equipos:['Sos el alma creativa del equipo - quien innova desde lo profundo donde otros simplemente copian.','Tu presencia da a los demas permiso implicito de ser mas autenticos y genuinos en su trabajo.','Tu punto de mejora es anclar la creatividad y la vision en compromisos concretos y medibles.','Cuando gestionas tu intensidad, tu liderazgo gana en la confianza que el equipo deposita en vos.'],
      comunicacionEstilo:'Tu comunicacion es expresiva, profunda y cargada de significado emocional genuino. El riesgo es que la intensidad de tu expresion haga que el mensaje central se pierda detras de la riqueza emocional del relato.',
      conflictoEstilo:'Frente al conflicto, tu tendencia es sentirlo profundamente y necesitar espacio para procesarlo antes de poder dialogar. Tu ventaja es la profundidad de comprension; tu riesgo es que el procesamiento interno se vuelva tan largo que el conflicto escale antes de que puedas intervenir.',
      desarrollo:['Aprender a encontrar la ecuanimidad mas alla de los estados emocionales pasajeros del dia a dia.','Practicar el movimiento hacia la accion concreta aunque el estado emocional interno no sea el optimo.','Desarrollar la capacidad de apreciar lo ordinario y lo cotidiano como genuinamente extraordinario.','Trabajar la envidia transformandola en admiracion e inspiracion genuina para el propio crecimiento.','Integrar los principios, la disciplina y la capacidad de accion objetiva del punto de integracion (T1).'],
      escenarios:[
        {label:'Situacion A',title:'El equipo te pide entregar antes de que te sientas listo',natural:'Tu tendencia es resistirte a presentar algo que no captura completamente la vision que tenes en mente.',why:'Tu orientacion a la autenticidad y a la expresion genuina de la vision completa es una fuente de calidad real.',adjust:'Practica la entrega iterativa: presenta lo que tenes con claridad sobre que falta y por que. La imperfeccion comunicada honestamente genera mas confianza que la perfeccion prometida sin entrega.'},
        {label:'Situacion B',title:'El equipo propone una solucion que sentis que le falta profundidad',natural:'Tu tendencia es senalar lo que falta, lo superficial del enfoque, y proponer una vision mas completa.',why:'Tu capacidad de ver la dimension de sentido y profundidad que otros no ven es genuinamente valiosa.',adjust:'Antes de senalar lo que falta, valida lo que hay. Luego pregunta: "Podemos agregar una dimension que creo que haria esto mas significativo?" La propuesta abre mas que la critica.'},
        {label:'Situacion C',title:'Estas en un periodo de baja energia creativa y motivacion',natural:'Tu tendencia es aislarte, esperar a que la inspiracion vuelva y evitar mostrar tu estado al equipo.',why:'Tu orientacion a la autenticidad hace que no quieras presentar una version disminuida de vos mismo.',adjust:'La baja de energia creativa es parte del ciclo, no una senal de defecto. Comunicar honestamente tu estado al equipo ("estoy en un momento de recarga") genera confianza y humanidad.'},
        {label:'Situacion D',title:'Alguien del equipo recibe el reconocimiento que esperabas vos',natural:'Tu tendencia es sentir envidia y retirarte, convenciendote de que tu aporte no fue visto ni valorado.',why:'Tu orientacion a ser reconocido en tu singularidad es genuina y tiene valor para tu motivacion.',adjust:'Practica transformar la envidia en informacion: "Que aporto esa persona que yo tambien puedo desarrollar?" La admiracion genuina amplia tu repertorio en lugar de limitarlo.'},
      ],
      plan90:{
        m1:[['Registrar el patron de anhelo','Cada vez que sientas que "te falta algo", anota que es exactamente. Que patron ves al fin de la semana?','Diario'],
            ['Observar la intensidad emocional','Marca en escala 1-5 tu intensidad emocional cada dia. Que la dispara hacia arriba?','Diario'],
            ['Pedir feedback sobre tu presencia en el equipo','Pregunta: "Cuando mi intensidad suma al equipo? Cuando lo desestabiliza sin querer?"','Una vez']],
        m2:[['Completar un proyecto pequeno sin esperar inspiracion','Elegi algo que empezaste y terminalo esta semana, aunque el entusiasmo inicial ya no este.','Una vez/semana'],
            ['Practicar la gratitud concreta cada dia','Anota cada dia tres cosas concretas que valoras de tu vida actual tal como es ahora.','Diario'],
            ['Hacer algo ordinario extraordinariamente bien','Elegi una tarea rutinaria y ponele toda la atencion que le pondrias a algo que te importa profundamente.','Semanal']],
        m3:[['Integrar disciplina de T1 como habito','Elegi un habito de orden o estructura y sostenelo durante todo el mes sin excepcion alguna.','Diario'],
            ['Actuar desde la decision aunque no te sientas ready','En una situacion donde tu tendencia seria esperar el momento ideal, actua con la informacion disponible.','Cuando surja'],
            ['Solicitar feedback 360','Pedi feedback sobre tu consistencia, tu capacidad de concretar y tu impacto real en el equipo.','Una vez al cierre']],
      },
      checkin:['Complete algo que empece esta semana, aunque el entusiasmo inicial ya no estuviera presente?','Practique la gratitud por lo que tengo, sin compararlo con lo que me falta o envidio?','Aporte mi perspectiva unica de forma que sumo concretamente al equipo esta semana?','Gestione mi intensidad emocional para no desestabilizar el entorno mas de lo necesario?','Me permiti ser ordinario en algo esta semana sin sentir que eso me define como persona?'],
      commitment:['Anclar la creatividad en compromisos concretos que pueda sostener hasta el final real.','Practicar la ecuanimidad: el estado emocional no determina la capacidad de actuar y contribuir.','Transformar la envidia en admiracion e inspiracion genuina para mi propio crecimiento.'],
    },

    5:{
      lema:'Necesito entenderlo profundamente antes de actuar. Dejame analizar.',
      motivador:'Comprender el mundo acumulando conocimiento; sentirse capaz y competente antes de comprometerse.',
      miedo:'Ser incompetente; verse agotado o invadido por las demandas emocionales del entorno social.',
      deseo:'Ser capaz y competente; comprender el mundo con suficiente profundidad para no depender de nadie.',
      preguntaFav:'Por que funciona asi? Que datos concretos tenemos? Cual es el mecanismo subyacente real?',
      fortalezas:['Analisis profundo que previene errores costosos antes de que ocurran en los proyectos reales.','Independencia que permite trabajo autonomo de alta calidad sostenida sin necesitar supervision.','Pensamiento sistemico para resolver problemas complejos con soluciones elegantes y bien fundamentadas.','Objetividad que equilibra la toma de decisiones emocionales con datos y analisis rigurosos.','Construye conocimiento especializado y robusto de forma sostenida a lo largo del tiempo real.','Anticipa consecuencias de largo plazo que otros no ven en el calor del momento o la urgencia.'],
      cuidados:['Aislamiento que dificulta genuinamente la colaboracion y el trabajo compartido con el equipo.','Paralisis por analisis - espera certeza absoluta antes de comprometerse con cualquier accion.','Desconexion emocional percibida como frialdad o falta de interes real en las personas del equipo.','Tendencia a acaparar informacion como forma de poder y de control sobre el entorno y los demas.','Dificultad para delegar o confiar en el criterio ajeno - cree que nadie lo hara con el mismo rigor.','Puede ser extremadamente introvertido bajo alta demanda social y emocionalmente inaccesible.'],
      comunicacion_hacer:['Presenta datos y fundamentos solidos antes de pedirle decisiones importantes.','Respeta su necesidad de tiempo a solas para procesar antes de responder.','Reconoce su expertise con precision y detalle concreto y especifico.','Dale proyectos donde pueda profundizar con autonomia real y sin interferencias.'],
      comunicacion_evitar:['Reuniones sin agenda o sorpresas emocionales no anunciadas de antemano.','Exigir respuestas inmediatas bajo presion sin tiempo de procesamiento.','Invasion de su espacio personal o interrupciones frecuentes en el trabajo.','Pedirle que lidere la dinamica social o emocional del grupo.'],
      liderazgo:['Lideras desde el conocimiento: tu expertise crea confianza solida y genuina en quienes trabajan con vos.','Tu analisis anticipa riesgos que nadie mas ve, protegiendo al equipo de errores costosos y evitables.','Aportas la profundidad de pensamiento que convierte decisiones impulsivas en estrategias bien fundadas.','En proyectos complejos, tu vision sistemica es invaluable para mantener la coherencia del conjunto.','Tu reto es aprender a compartir ese conocimiento y a liderar tambien desde la conexion humana real.','Cuando compartis lo que sabes generosamente, el impacto de tu liderazgo se multiplica en el equipo.'],
      equipos:['Sos el cerebro estrategico del equipo - quien anticipa lo que nadie mas ve ni considera.','Tu analisis riguroso eleva la calidad de las decisiones colectivas de forma sostenida y consistente.','Tu punto de mejora es salir de la mente y entrar en la arena compartida de la accion y la conexion.','Cuando compartis tu conocimiento de forma accesible, multiplicas el impacto real del equipo entero.'],
      comunicacionEstilo:'Tu comunicacion es precisa, tecnica y bien estructurada. Priorizas la exactitud y el fundamento sobre la conexion emocional. El riesgo es que la densidad tecnica de tu comunicacion haga que el interlocutor pierda el hilo central del mensaje.',
      conflictoEstilo:'Frente al conflicto, tu tendencia es analizarlo objetivamente y buscar la solucion racional correcta. Tu ventaja es la objetividad; tu riesgo es que la otra persona sienta que el dialogo es un ejercicio analitico en lugar de una conversacion humana real.',
      desarrollo:['Aprender a actuar con informacion suficiente, no perfecta - el 70% es suficiente para avanzar.','Practicar la presencia corporal y la conexion emocional con las personas del equipo cotidianamente.','Desarrollar la capacidad de compartir conocimiento sin retenerlo como forma de control o poder.','Trabajar la generosidad real: dar sin calcular cuanto te queda despues de haber dado.','Integrar la asertividad y la accion directa del punto de integracion (T8) en situaciones que lo requieren.'],
      escenarios:[
        {label:'Situacion A',title:'El equipo necesita una decision urgente con datos incompletos',natural:'Tu tendencia es pedir mas tiempo para recopilar la informacion que falta antes de comprometerte con una respuesta.',why:'Tu orientacion a la exactitud protege al equipo de decisiones mal fundamentadas que pueden tener consecuencias costosas.',adjust:'Practica la regla del 70%: con el 70% de los datos que queres tener, podes dar una recomendacion solida y util. Comunica explicitamente que informacion adicional mejoraria la decision.'},
        {label:'Situacion B',title:'Alguien te pide que participes activamente en una reunion grupal',natural:'Tu tendencia es observar, tomar notas y esperar el momento preciso para contribuir - que a veces nunca llega.',why:'Tu orientacion a contribuir solo cuando tenes algo valioso y bien pensado para agregar es genuinamente respetuosa.',adjust:'En reuniones, comprometete a intervenir al menos una vez antes de que el tema se cierre. Tu perspectiva en desarrollo vale tanto como tu perspectiva completamente procesada.'},
        {label:'Situacion C',title:'El equipo te pide que compartas lo que sabes sobre un tema',natural:'Tu tendencia es compartir de forma muy detallada y exhaustiva, asegurandote de que el otro entiende todo el contexto.',why:'Tu orientacion a la completitud y al rigor hace que la informacion que compartis sea genuinamente confiable y valiosa.',adjust:'Pregunta primero que nivel de detalle necesita el otro. A veces la sintesis de tres puntos clave tiene mas impacto que el desarrollo exhaustivo completo de todos los matices.'},
        {label:'Situacion D',title:'Alguien del equipo te interrumpe con una consulta emocional',natural:'Tu tendencia es incomodarte con la interrupcion y buscar resolver el problema practico lo antes posible.',why:'Tu orientacion a la eficiencia y a tu propio espacio de concentracion es legitima y necesita ser respetada.',adjust:'Antes de ir a la solucion, pregunta: "Queres que te ayude a resolver algo o necesitas que te escuche por un momento?" Esa pregunta cambia la calidad de toda la conversacion.'},
      ],
      plan90:{
        m1:[['Registrar el patron de retencion de informacion','Anota cada semana que informacion guardaste para vos que podria haber sido util para el equipo.','Semanal'],
            ['Observar nivel de energia en interacciones sociales','Marca tu energia antes y despues de interacciones grupales. Que las drena? Que las recarga?','Semanal'],
            ['Pedir feedback sobre tu accesibilidad','Pregunta: "Cuando sentis que puedo colaborar bien? Cuando te parece que me cierro al contacto?"','Una vez']],
        m2:[['Compartir conocimiento proactivamente sin que lo pidan','Una vez por semana, comparti un insight o recurso con alguien del equipo sin esperar que te lo pidan.','Semanal'],
            ['Actuar antes de tener todos los datos ideales','Elegi una decision pendiente y tomala con el 70% de la informacion disponible hoy mismo.','Una vez/semana'],
            ['Tener una conversacion de conexion pura','Una vez por semana, tenes una conversacion donde el objetivo no es resolver nada sino solo conectar.','Semanal']],
        m3:[['Integrar asertividad de T8 en situaciones dificiles','Elegi una situacion donde tu tendencia seria retirarte y en cambio expresa tu posicion con claridad.','Cuando surja'],
            ['Estar presente corporalmente en reuniones','En reuniones, asegurate de estar presente fisicamente - no solo mentalmente sino con el cuerpo.','Siempre'],
            ['Solicitar feedback 360','Pedi feedback sobre tu accesibilidad, generosidad con el conocimiento y presencia real en el equipo.','Una vez al cierre']],
      },
      checkin:['Comparti algun conocimiento con el equipo esta semana sin esperar que me lo pidieran?','Actue con informacion suficiente o espere la certeza perfecta que raramente llega?','Tuve una conversacion donde mi objetivo principal fue conectar genuinamente, no resolver?','Estuve presente corporalmente en las interacciones del equipo, no solo en mi propia mente?','Exprese mi posicion con claridad en alguna situacion donde antes me hubiera retirado?'],
      commitment:['Compartir el conocimiento generosamente, sin retenerlo como forma de control o poder.','Actuar con informacion suficiente en lugar de esperar la certeza absoluta que nunca llega.','Practicar la presencia y la conexion emocional con las personas reales del equipo.'],
    },

    6:{
      lema:'Que podria salir mal? Necesito estar preparado y saber con quien cuento.',
      motivador:'Tener seguridad, apoyo y orientacion; construir sistemas y lealtades que protejan ante la incertidumbre.',
      miedo:'Quedarse sin apoyo ni seguridad; ser abandonado en territorio sin referencias ni respaldo real.',
      deseo:'Tener seguridad genuina y apoyo real; construir vinculos de confianza profundos y duraderos.',
      preguntaFav:'Que podria salir mal? Quien apoya esta decision? Realmente podemos confiar en esta persona?',
      fortalezas:['Lealtad profunda que crea cohesion grupal duradera en cualquier contexto de presion o cambio.','Anticipacion de riesgos que protege activamente al equipo de errores costosos y evitables.','Compromiso inquebrantable incluso cuando otros abandonan el barco en momentos dificiles.','Sentido del deber que impulsa la responsabilidad colectiva del equipo de forma consistente.','Identifica problemas sistemicos antes de que nadie mas los vea o los considere relevantes.','Sistema inmune del equipo: cuestiona lo que otros aceptan sin analizar con espiritu critico genuino.'],
      cuidados:['Ansiedad cronica que puede contagiarse al equipo y paralizar la accion en momentos criticos.','Duda excesiva que retrasa decisiones importantes en los momentos donde se necesita mas velocidad.','Proyecta amenazas donde no las hay, creando falsas alarmas sistematicas que desgastan al equipo.','Dependencia de figuras de autoridad para validar sus propias decisiones y criterios internos.','Actitud reactiva o contradictoria bajo alta presion e incertidumbre sostenida en el tiempo.','Dificultad para confiar en su propio criterio - busca validacion constante de otros para actuar.'],
      comunicacion_hacer:['Explica el contexto completo y los fundamentos antes de pedir accion.','Genera entorno estable con expectativas claras y predecibles en el tiempo.','Valida sus preocupaciones antes de avanzar con la solucion propuesta.','Mostra consistencia total entre lo que decis y lo que haces en la practica.'],
      comunicacion_evitar:['Cambios abruptos sin explicacion ni tiempo de adaptacion adecuado.','Ambiguedad o incertidumbre no explicada en el liderazgo y la direccion.','Ignorar sus preguntas de riesgo y de seguridad como si fueran irrelevantes.','Contradicciones o cambios de postura sin justificacion clara y honesta.'],
      liderazgo:['Lideras desde la lealtad: las personas saben que podes contar con vos en los momentos mas dificiles.','Tu capacidad de anticipar riesgos salva proyectos completos de errores que nadie mas habia previsto.','Creas culturas de confianza y responsabilidad donde las personas se sienten realmente seguras.','En momentos de incertidumbre, tu capacidad de hacer las preguntas dificiles estabiliza al grupo.','Tu reto es aprender a actuar con valentia desde tu propio criterio sin necesitar validacion externa.','Cuando actuas con decision propia, inspiras al equipo a hacer lo mismo con mayor confianza.'],
      equipos:['Sos el sistema inmune del equipo - quien protege contra errores que nadie mas habia anticipado.','Tu lealtad y compromiso crean una cultura de responsabilidad colectiva genuina y sostenida.','Tu punto de mejora es confiar en tu propio criterio y actuar desde el con decision y sin pedir permiso.','Cuando actuas con valentia propia, inspiras al equipo a asumir mas responsabilidad y riesgo real.'],
      comunicacionEstilo:'Tu comunicacion es cuidadosa, precisa y orientada a validar la seguridad del proceso. El riesgo es que la precaucion constante en tu comunicacion suene negativista y genere ansiedad en el equipo en lugar de la seguridad que buscas crear.',
      conflictoEstilo:'Frente al conflicto, tu tendencia es anticipar todas las posibles consecuencias negativas antes de actuar. Tu ventaja es la preparacion; tu riesgo es que la anticipacion de lo peor se convierta en la profecia que se cumple porque paraliza la accion necesaria.',
      desarrollo:['Aprender a confiar en el propio criterio sin necesitar validacion externa constante de otros.','Practicar la accion decisiva con informacion suficiente, aunque la certeza total no exista todavia.','Desarrollar la valentia como musculo real: actuar a pesar del miedo, no en ausencia de el.','Trabajar la diferenciacion clara entre riesgos reales que merecen atencion y riesgos imaginados.','Integrar la paz interior y la capacidad de soltar el control del punto de integracion (T9).'],
      escenarios:[
        {label:'Situacion A',title:'El equipo tiene que tomar una decision con alta incertidumbre',natural:'Tu tendencia es generar todas las preguntas de riesgo posibles y solicitar mas informacion antes de decidir.',why:'Tu capacidad de anticipar riesgos protege al equipo de errores que otros no habrian previsto ni considerado.',adjust:'Hace las preguntas de riesgo, y luego pregunta: "Cual es el peor escenario real si avanzamos ahora?" En general, el peor escenario es manejable. Esa pregunta ancla la ansiedad en la realidad.'},
        {label:'Situacion B',title:'El equipo propone algo nuevo e incierto que no ha sido probado',natural:'Tu tendencia es resistirte, senalar los riesgos y buscar la validacion de una autoridad antes de avanzar.',why:'Tu orientacion a la seguridad y a los sistemas probados protege al equipo de cambios que podrian salir mal.',adjust:'Practica separar la evaluacion del riesgo de la decision de si avanzar. Podes identificar los riesgos y proponer como mitigarlos, sin que eso bloquee el movimiento del equipo hacia lo nuevo.'},
        {label:'Situacion C',title:'Tu lider te da autonomia completa en un proyecto importante',natural:'Tu tendencia es sentir incomodidad con la autonomia total y buscar formas de validar tus decisiones.',why:'Tu orientacion a la seguridad hace que la autonomia sin estructura de respaldo se sienta riesgosa.',adjust:'La autonomia es una senal de confianza genuina en tu criterio. Practica tomarla como tal: "Me dieron autoridad real sobre esto. Voy a usarla." Luego actua y reporta los resultados.'},
        {label:'Situacion D',title:'Un proyecto que lideras enfrenta una crisis inesperada',natural:'Tu tendencia es activar el modo de anticipacion de todos los posibles escenarios negativos que pueden seguir.',why:'Tu capacidad de anticipar consecuencias y prepararte para ellas es exactamente lo que se necesita en una crisis.',adjust:'Luego de mapear los riesgos, elegi el siguiente paso mas pequeno que podes dar ahora con la informacion disponible. La accion pequena y concreta reduce la ansiedad mas que el analisis exhaustivo.'},
      ],
      plan90:{
        m1:[['Registrar la ansiedad anticipatoria','Anota cada semana que riesgos imaginaste que luego no se materializaron. Que porcentaje fue real?','Semanal'],
            ['Observar el patron de validacion','Cada vez que busques validacion externa antes de actuar, anotalo. Cuantas veces por semana?','Semanal'],
            ['Pedir feedback sobre tu impacto en el clima del equipo','Pregunta: "Cuando mi anticipacion suma? Cuando genera ansiedad innecesaria en el grupo?"','Una vez']],
        m2:[['Actuar desde el criterio propio una vez por semana','Una vez por semana, toma una decision de mediano alcance sin consultar a nadie antes.','Semanal'],
            ['Practicar la pregunta "Es real este riesgo ahora?"','Ante cada preocupacion, preguntate: "Esto esta pasando ahora o lo estoy imaginando?" Anota la respuesta.','Diario'],
            ['Hacer algo valiente pequeno cada semana','Cada semana, hace algo que te genere incomodidad por el miedo a fallar o a ser cuestionado.','Semanal']],
        m3:[['Integrar serenidad de T9 antes de decisiones','Practica 10 minutos de silencio o respiracion antes de tomar decisiones importantes del proyecto.','Diario'],
            ['Liderar desde la conviccion propia en incertidumbre','En la proxima situacion de incertidumbre grupal, se vos quien estabilice desde tu conviccion real.','Cuando surja'],
            ['Solicitar feedback 360','Pedi feedback sobre tu valentia, tu autonomia en las decisiones y tu impacto en la cohesion del equipo.','Una vez al cierre']],
      },
      checkin:['Tome alguna decision esta semana desde mi propio criterio, sin buscar validacion externa?','Distingui entre un riesgo real y uno imaginado en alguna situacion concreta de esta semana?','Hice algo que me generaba incomodidad por el miedo, siendo valiente desde adentro?','Mi anticipacion de riesgos sumo al equipo esta semana o genero ansiedad innecesaria?','Practique un momento de serenidad antes de reaccionar a una situacion de tension real?'],
      commitment:['Confiar en el propio criterio y actuar desde el, sin necesitar validacion externa constante.','Practicar la valentia como musculo real: actuar a pesar del miedo, no en su ausencia.','Diferenciar con claridad entre riesgos reales que merecen atencion y riesgos imaginados.'],
    },

    7:{
      lema:'Hay miles de posibilidades! Por que limitarnos a solo una?',
      motivador:'Ser libre y feliz; experimentar todo lo que la vida ofrece sin limitaciones ni dolor interno.',
      miedo:'Quedarse atrapado en el dolor o el aburrimiento; perderse experiencias por limitaciones externas.',
      deseo:'Ser feliz y plenamente satisfecho; tener libertad para explorar y experimentar todo lo posible.',
      preguntaFav:'Que mas podemos explorar? Que opciones nuevas existen? Que posibilidades aun no consideramos?',
      fortalezas:['Energia e innovacion que mantienen al equipo motivado y orientado al futuro con genuino entusiasmo.','Optimismo contagioso que transforma las crisis en oportunidades reales de crecimiento y cambio.','Pensamiento lateral que genera ideas unicas que otros simplemente no pueden ver ni imaginar.','Adaptabilidad natural ante cambios rapidos y entornos dinamicos e impredecibles del mercado.','Sintesis entre disciplinas distintas - conecta puntos inesperados con naturalidad y creatividad.','Hace que el trabajo parezca una aventura genuina - su entusiasmo es un recurso valioso del equipo.'],
      cuidados:['Dispersion cronica que impide concretar los proyectos que entusiastamente inicia con energia.','Huye del dolor, el conflicto o el aburrimiento a traves de la hiperactividad y los nuevos proyectos.','Compromisos excesivos que acumula con entusiasmo y luego no puede cumplir con la misma energia.','Dificultad para profundizar - tiende a ir de flor en flor sin echar raices en ninguna parte real.','Puede trivializar problemas serios con humor inapropiado que no registra la gravedad del momento.','Bajo estres extremo: perfeccionismo y critica afilada (movimiento a T1 en desintegracion real).'],
      comunicacion_hacer:['Enmarca las tareas como nuevas aventuras con desafios creativos genuinos.','Permitile explorar opciones antes de comprometerse con el camino final.','Ayudalo a establecer prioridades y compromisos realistas para el periodo.','Conecta el trabajo con el impacto positivo concreto que genera en el mundo.'],
      comunicacion_evitar:['Rutina repetitiva sin variacion, creatividad ni novedad genuinas.','Paredes y limitaciones rigidas sin espacio real para innovar y explorar.','Pedirle que se quede con un solo enfoque fijo para siempre sin flexibilidad.','Ignorar su entusiasmo o no celebrar juntos los logros que se van alcanzando.'],
      liderazgo:['Lideras desde la vision y el entusiasmo: contagias el sentido de lo posible a todo el equipo.','Tu capacidad de ver oportunidades donde otros ven solo problemas es un activo estrategico real.','Aportas la energia innovadora que mantiene al equipo motivado en proyectos largos y complejos.','En momentos de estancamiento, tu pensamiento lateral desbloquea situaciones que parecen cerradas.','Tu reto mas profundo es aprender a cerrar lo que abris con la misma energia y compromiso del inicio.','Cuando profundizas en lugar de iniciar algo nuevo, tu impacto en el equipo se multiplica realmente.'],
      equipos:['Sos el combustible creativo del equipo - donde otros ven limites, vos ves posibilidades genuinas.','Tu optimismo y energia son recursos reales y valiosos en los momentos de dificultad grupal.','Tu punto de mejora es sostener los compromisos hasta el cierre real con la energia del inicio.','Cuando profundizas en un tema, tu aporte se vuelve exponencialmente mas valioso para el equipo.'],
      comunicacionEstilo:'Tu comunicacion es expansiva, entusiasta y cargada de posibilidades y opciones. El riesgo es que el receptor no pueda distinguir que es prioritario de lo que es solo una idea interesante, perdiendo la claridad del mensaje central.',
      conflictoEstilo:'Frente al conflicto, tu tendencia es reencuadrarlo positivamente, buscar el punto en comun y avanzar. Tu ventaja es la energia de resolucion; tu riesgo es que el reencuadre se convierta en evitar el conflicto necesario que el equipo necesita transitar para crecer.',
      desarrollo:['Aprender a encontrar la satisfaccion profunda en el momento presente, no en el proximo estimulo.','Practicar el cierre de compromisos como acto real de integridad y respeto por los demas.','Desarrollar la capacidad de estar con el dolor y el aburrimiento sin huir hacia lo nuevo.','Trabajar la sobriedad: la profundidad de una experiencia genuina supera a mil superficiales.','Integrar la profundidad, la concentracion y la capacidad de estar solo del punto de integracion (T5).'],
      escenarios:[
        {label:'Situacion A',title:'El equipo necesita enfocarse en un solo objetivo complejo',natural:'Tu tendencia es proponer multiples enfoques simultaneos y ver limitante la restriccion a un solo camino.',why:'Tu capacidad de ver multiples posibilidades es genuinamente valiosa para asegurarse de que el camino elegido es realmente el mejor.',adjust:'Proposicion: "Analicemos tres caminos posibles en 20 minutos, eligamos el mejor con criterios claros y despues me comprometo completamente con ese." Eso honra tu proceso sin bloquear el del equipo.'},
        {label:'Situacion B',title:'Un proyecto que iniciaste con entusiasmo se vuelve rutinario',natural:'Tu tendencia es buscar formas de renovar el proyecto, agregar dimensiones nuevas o iniciar algo diferente.',why:'Tu orientacion a la novedad y la estimulacion genuina mantiene alta la energia creativa del proceso.',adjust:'Antes de cambiar el proyecto, preguntate: "El proyecto cambio o soy yo quien necesita encontrar la novedad dentro de lo que ya esta?" A veces la profundidad es la novedad que estabas buscando.'},
        {label:'Situacion C',title:'El equipo tiene que sentarse con el malestar de un fracaso',natural:'Tu tendencia es reencuadrar rapidamente el fracaso como aprendizaje y proponer el proximo paso a dar.',why:'Tu orientacion al futuro y al aprendizaje es genuinamente valiosa para que el equipo no se quede paralizado.',adjust:'Antes del reencuadre positivo, deja que el equipo sienta el fracaso completamente. Unos minutos de "esto dolio" son necesarios para el procesamiento genuino. El aprendizaje que sigue es mas solido despues de eso.'},
        {label:'Situacion D',title:'Tenes multiples compromisos abiertos y uno de ellos requiere cierre urgente',natural:'Tu tendencia es iniciar el cierre del compromiso urgente mientras mentalmente exploras nuevas posibilidades.',why:'Tu energia y capacidad de gestion multiple son genuinamente altas y te permiten manejar varias cosas a la vez.',adjust:'Practica el cierre completo: cerra el compromiso urgente completamente antes de abrir el siguiente. El cierre limpio genera mas energia disponible que la gestion simultanea de muchas aperturas.'},
      ],
      plan90:{
        m1:[['Hacer inventario de compromisos abiertos','Lista todo lo que prometiste o iniciaste y esta incompleto. Cuantos hay? Que patron ves?','Una vez'],
            ['Observar el impulso de iniciar algo nuevo','Cada vez que quieras empezar algo nuevo, anotalo. Cuantas veces por semana surge ese impulso?','Semanal'],
            ['Pedir feedback sobre tu confiabilidad real','Pregunta: "Soy confiable en mis compromisos? Donde me ven fallar mas seguido en el cierre?"','Una vez']],
        m2:[['Cerrar antes de abrir - sin excepciones','Esta semana no asumas ningun compromiso nuevo hasta tener espacio real para cumplir los que ya tenes.','Semanal'],
            ['Practicar la profundidad deliberada','Elegi un tema o proyecto y dedicale mas tiempo del que considerarias "suficiente" - profundiza mas.','Semanal'],
            ['Estar con el malestar 20 minutos mas','Cuando sientas el impulso de escapar hacia algo nuevo, quedate con lo que estas haciendo 20 minutos mas.','Cuando surja']],
        m3:[['Integrar profundidad de T5 semanalmente','Dedica 30 minutos a estudiar un tema en profundidad sin pasar a otro hasta completarlo genuinamente.','Semanal'],
            ['Cerrar el compromiso mas importante abierto','Identifica el compromiso mas significativo que tenes abierto y cerralo completamente este mes.','Una vez'],
            ['Solicitar feedback 360','Pedi feedback sobre tu confiabilidad, capacidad de cerrar y profundidad en los proyectos del equipo.','Una vez al cierre']],
      },
      checkin:['Cerre algo que tenia abierto esta semana, con la misma energia que le puse al inicio?','Me quede con el malestar o el aburrimiento en algun momento sin huir hacia algo nuevo?','Profundice en un tema esta semana en lugar de iniciar algo diferente y mas estimulante?','Cumpli los compromisos que asumi antes de asumir nuevos compromisos adicionales?','Encontre satisfaccion genuina en el momento presente, no en el proximo estimulo esperado?'],
      commitment:['Cerrar los compromisos con la misma energia con que los abri, hasta el final real.','Practicar la profundidad: una experiencia profunda genuina supera a mil superficiales.','Quedarme con el malestar sin huir - la incomodidad tambien tiene algo valioso que ensenar.'],
    },

    8:{
      lema:'Vamos directo al grano. Yo me hago cargo de esto ahora mismo.',
      motivador:'Ser autosuficiente y controlar su destino; proteger a los vulnerables ante la injusticia real.',
      miedo:'Ser controlado, danado o traicionado; mostrarse debil o perder el dominio propio en alguna situacion.',
      deseo:'Protegerse y proteger a los suyos; tener control real sobre su vida y entorno inmediato.',
      preguntaFav:'Quien manda aqui? Quien es el responsable real? Que accion concreta tomamos ahora mismo?',
      fortalezas:['Decision y valentia para enfrentar lo que otros evitan activamente a toda costa en el grupo.','Protege activamente al equipo ante amenazas externas con firmeza y claridad genuinas.','Liderazgo natural en contextos de crisis y alta presion sostenida - donde otros se paralizan.','Honestidad directa que elimina la ambiguedad danina de las conversaciones importantes.','Energia que moviliza recursos y personas hacia donde se necesitan con urgencia y precision.','No le teme al conflicto - puede nombrar lo que nadie quiere decir en voz alta en el equipo.'],
      cuidados:['Tendencia al control que puede percibirse como tirania por las personas que trabajan con vos.','Intensidad que intimida y bloquea la participacion genuina de personas mas sensibles del equipo.','Dificultad profunda para mostrar vulnerabilidad real o pedir ayuda cuando se necesita.','Confrontaciones innecesarias que danan relaciones valiosas y la confianza del equipo.','Impulsividad ante la provocacion con consecuencias costosas para el clima y los resultados.','Puede dejar rastro de destruccion relacional sin registrarlo ni darse cuenta del impacto real.'],
      comunicacion_hacer:['Se directo, honesto y sin rodeos desde el primer momento de la conversacion.','Dale autonomia y autoridad real en su area de responsabilidad.','Reconoce su fuerza y valentia - le importa genuinamente el respeto mutuo.','Invitalo a escuchar otras perspectivas antes de tomar la decision final.'],
      comunicacion_evitar:['Manipulacion, indirectas o juegos de poder velados que se sientan deshonestos.','Microgestion o cuestionamiento publico de sus decisiones tomadas.','Debilidad o falta de conviccion en tu propio liderazgo y posicion.','Confrontarlo publicamente sin haber hablado primero en privado.'],
      liderazgo:['Lideras desde la fortaleza: creas el espacio donde las decisiones se toman y las cosas avanzan.','Tu capacidad de absorber presion y proteger al grupo en momentos de crisis es genuinamente excepcional.','Aportas la claridad de direccion que elimina la paralisis cuando el equipo no sabe que hacer.','En momentos donde nadie quiere hablar del elefante en la sala, vos lo nombras y empezas a resolverlo.','Tu reto mas profundo es aprender que la verdadera fortaleza incluye la capacidad de mostrarse vulnerable.','Cuando mostras vulnerabilidad, el equipo confia en vos mas profundamente que con la coraza puesta.'],
      equipos:['Sos la columna vertebral del equipo en momentos de crisis - quien no entra en panico ni en analisis.','Tu directness y valentia crean una cultura donde los problemas se nombran y se resuelven genuinamente.','Tu punto de mejora es usar tu fortaleza al servicio del equipo entero, no solo de tu propia vision.','Cuando mostras vulnerabilidad real, el equipo te sigue con una lealtad mas profunda y duradera.'],
      comunicacionEstilo:'Tu comunicacion es directa, concisa y orientada a la accion y la resolucion. Priorizas la claridad total sobre la suavidad o el contexto. El riesgo es que la directness sin contexto emocional se sienta agresiva para personas que necesitan espacio para procesar.',
      conflictoEstilo:'Frente al conflicto, tu tendencia es ir directamente al punto y resolverlo rapidamente. Tu ventaja es la velocidad de resolucion; tu riesgo es que la otra persona sienta que el conflicto fue cerrado antes de que ella pudiera procesar completamente lo que paso.',
      desarrollo:['Aprender que mostrar vulnerabilidad real es un acto de fortaleza genuina, no de debilidad.','Practicar la escucha activa y completa antes de responder - la perspectiva del otro amplia la tuya.','Desarrollar la ternura y la capacidad de dar sin necesitar controlar el resultado final.','Trabajar la impulsividad: la pausa reflexiva de 10 segundos multiplica la efectividad de la accion.','Integrar la ternura, la vulnerabilidad y el dar sin control del punto de integracion (T2).'],
      escenarios:[
        {label:'Situacion A',title:'Un miembro del equipo comete un error grave que afecta al proyecto',natural:'Tu tendencia es confrontar directamente el error, senalar su responsabilidad y exigir la correccion inmediata.',why:'Tu capacidad de nombrar los problemas con claridad y exigir responsabilidad protege los resultados del equipo.',adjust:'Antes de la confrontacion, toma 10 segundos para preguntar: "Que necesita esta persona ahora mismo para poder mejorar genuinamente?" La respuesta cambia el tono de la conversacion completa.'},
        {label:'Situacion B',title:'El equipo resiste una decision que tomaste',natural:'Tu tendencia es defender la decision con mayor firmeza y senalar por que las objeciones son incorrectas.',why:'Tu conviccion y determinacion en las decisiones que tomaste da al equipo una referencia de direccion clara.',adjust:'Antes de defender la decision, escucha genuinamente la resistencia: "Contame que ves vos que yo puedo estar perdiendo." A veces la resistencia del equipo tiene informacion valiosa que mejora tu decision.'},
        {label:'Situacion C',title:'Alguien del equipo enfrenta una situacion dificil personal',natural:'Tu tendencia es ofrecer soluciones practicas e inmediatas y proponer los proximos pasos concretos a seguir.',why:'Tu orientacion a resolver problemas con eficiencia es genuinamente valiosa en situaciones que requieren accion.',adjust:'Antes de las soluciones, pregunta: "Necesitas que te ayude a resolverlo o necesitas que te escuche?" Esa distincion cambia completamente la calidad y el impacto de tu presencia.'},
        {label:'Situacion D',title:'Un colega te da feedback directo sobre algo que hiciste',natural:'Tu tendencia es responder con argumentos de por que tu enfoque fue correcto o senalar sus propias areas de mejora.',why:'Tu orientacion a la autodefensa protege tu autonomia y tu autoridad frente a los cuestionamientos externos.',adjust:'Practica el silencio de 5 segundos despues de recibir feedback: escucha completamente, pedi un ejemplo concreto y agradeci antes de responder. Eso es fortaleza genuina, no debilidad.'},
      ],
      plan90:{
        m1:[['Registrar reacciones impulsivas y su impacto','Cada vez que reacciones intensamente, anota que paso y como quedo el otro. Que patron ves?','Semanal'],
            ['Observar el impacto de tu intensidad en otros','Despues de cada conversacion dificil, preguntate: como quedo el otro? y vos?','Semanal'],
            ['Pedir feedback sobre tu impacto real','Pregunta a alguien de confianza: "Cuando mi directness suma genuinamente? Cuando la gente se cierra?"','Una vez']],
        m2:[['Practicar la pausa de 10 segundos','En situaciones de tension real, conta hasta 10 antes de responder. Anota si cambia el resultado.','Siempre'],
            ['Hacer algo por alguien sin agenda de resultado','Una vez por semana, ayuda a alguien del equipo sin que tenga nada que ver con tus objetivos.','Semanal'],
            ['Mostrarte vulnerable en una conversacion','En una conversacion de confianza, comparti algo donde no tenes todas las respuestas o te sentis inseguro.','Una vez']],
        m3:[['Integrar ternura de T2 en el cotidiano','Una vez por semana, tenes una conversacion donde el unico objetivo es preguntar como esta el otro genuinamente.','Semanal'],
            ['Liderar desde la escucha en una reunion','En una reunion importante, no hables primero. Escucha todas las perspectivas antes de dar la tuya.','Una vez'],
            ['Solicitar feedback 360','Pedi feedback sobre tu capacidad de escuchar, tu impacto en el clima y tu vulnerabilidad real.','Una vez al cierre']],
      },
      checkin:['Me permiti mostrar vulnerabilidad real o pedir ayuda en alguna situacion de esta semana?','Escuche la perspectiva del otro completamente antes de dar la mia en conversaciones importantes?','Mi directness fue al servicio del equipo o de mi propia necesidad de control y de tener razon?','Hice la pausa de 10 segundos antes de responder en alguna situacion de tension real?','Hice algo por alguien esta semana sin que tenga ninguna relacion con mis propios objetivos?'],
      commitment:['Practicar la vulnerabilidad genuina como acto de fortaleza real, no de debilidad.','Escuchar completamente antes de responder - la perspectiva del otro siempre amplia la mia.','Usar mi fortaleza al servicio del equipo entero, no solo de mi propia vision y agenda.'],
    },

    9:{
      lema:'Todo puede resolverse si encontramos el punto de acuerdo verdadero.',
      motivador:'Mantener la paz interior y exterior; que todos esten bien y nada importante se interrumpa.',
      miedo:'La perdida, la separacion y el conflicto que destruye la armonia y las conexiones valiosas.',
      deseo:'Tener paz interior genuina; ser parte de algo sin tensiones que amenacen la union real.',
      preguntaFav:'Como podemos llegar a un acuerdo real para todos? Que necesita cada persona para estar bien?',
      fortalezas:['Mediacion natural que resuelve conflictos sin generar heridas ni ganadores y perdedores claros.','Capacidad de ver multiples perspectivas simultaneamente sin identificarse con ninguna en particular.','Paciencia genuina que sostiene procesos largos sin desgastarse visiblemente ni perder la calma.','Presencia calmante que estabiliza al equipo en situaciones de crisis y de alta presion sostenida.','Inclusion genuina: hace que todos se sientan escuchados, valorados y pertenecientes al grupo.','Estabilidad y consistencia que el equipo puede tomar como base segura y confiable en el tiempo.'],
      cuidados:['Pasividad o postergacion que bloquea decisiones urgentes e importantes para el equipo real.','Dificultad para establecer prioridades claras - todo parece igual de importante y urgente.','Adaptacion excesiva que le hace perder su propia voz, perspectiva y agenda personal genuina.','Evita conflictos necesarios, dejando que problemas serios escalen sin ninguna intervencion oportuna.','Energia difusa que no se traduce en accion concreta ni en direccion clara para el equipo.','Puede desaparecer emocionalmente del grupo precisamente cuando mas se le necesita estar presente.'],
      comunicacion_hacer:['Dale tiempo real para procesar antes de pedirle una respuesta concreta.','Invitalo activamente y de forma explicita a compartir su perspectiva.','Reconoce su contribucion silenciosa que muchos no ven ni agradecen.','Crea estructuras claras que le ayuden a establecer prioridades reales.'],
      comunicacion_evitar:['Cambios abruptos sin explicacion ni tiempo de adaptacion adecuado.','Asumir que esta de acuerdo porque no expreso desacuerdo activamente.','Pedirle que tome partido en conflictos sin preparacion ni contexto.','Sobrecargarlo con multiples demandas simultaneas urgentes sin prioridad.'],
      liderazgo:['Lideras desde la armonia: creas el espacio donde todos pueden contribuir su mejor version real.','Tu capacidad de mediar y sintetizar perspectivas distintas es un recurso estrategico genuino.','Aportas la estabilidad emocional que sostiene al equipo en los momentos de mayor tension y presion.','En situaciones de conflicto, tu perspectiva encuentra salidas que nadie mas habia visto todavia.','Tu reto mas profundo es aprender a liderar con intencion propia, no solo facilitando la de los demas.','Cuando expresas tu propia perspectiva, le das al equipo algo unico y valioso que solo vos podes dar.'],
      equipos:['Sos el pegamento humano del equipo - la persona que armoniza diferencias sin crear nuevas heridas.','Tu capacidad de incluir a todos crea una cultura de pertenencia genuina y sostenida en el tiempo.','Tu punto de mejora es tomar partido activamente y liderar cuando la situacion lo requiere con claridad.','Cuando expresas tu perspectiva propia con claridad, el equipo gana algo que solo vos podes ofrecer.'],
      comunicacionEstilo:'Tu comunicacion es conciliadora, empatica y orientada al consenso y la armonia. El riesgo es que sea tan indirecta que el receptor no entienda con claridad que estas pidiendo, proponiendo o sintiendo en realidad.',
      conflictoEstilo:'Frente al conflicto, tu tendencia es buscar el punto de acuerdo que hace posible la paz entre las partes. Tu ventaja es la mediacion; tu riesgo es evitar el conflicto necesario que, aunque incomodo, es lo que el equipo necesita transitar para crecer realmente.',
      desarrollo:['Aprender a moverse con intencion propia sin esperar la presion o el permiso externo de otros.','Practicar la expresion activa de la propia perspectiva en situaciones de grupo importantes.','Desarrollar la capacidad de establecer prioridades claras y sostenerlas frente a otras demandas.','Trabajar el conflicto necesario: iniciar conversaciones dificiles antes de que escalen solos.','Integrar la direccion propia, el enfoque y la autoafirmacion del punto de integracion (T3).'],
      escenarios:[
        {label:'Situacion A',title:'El equipo necesita una direccion clara y vos sos el lider',natural:'Tu tendencia es facilitar la conversacion grupal para que el equipo llegue solo al consenso sobre la direccion.',why:'Tu capacidad de facilitar el pensamiento colectivo es genuinamente valiosa y genera mas compromiso con la decision.',adjust:'Hay momentos en que el equipo necesita que el lider proponga una direccion, no que facilite el proceso. Practica decir: "Mi propuesta es X. Que ven ustedes que yo puedo estar perdiendo?" Eso combina tu direccion con tu escucha.'},
        {label:'Situacion B',title:'Hay un conflicto abierto entre dos miembros del equipo',natural:'Tu tendencia es buscar el punto en comun, bajar la temperatura y esperar que el tiempo resuelva el resto.',why:'Tu capacidad de encontrar el terreno compartido entre posiciones opuestas es genuinamente valiosa para el equipo.',adjust:'Luego de bajar la temperatura, facilita un cierre con compromisos concretos. El conflicto que baja de temperatura pero no cierra con acuerdos vuelve mas grande. Vos podes ser quien lo cierre genuinamente.'},
        {label:'Situacion C',title:'Alguien te pide tu opinion honesta sobre un trabajo',natural:'Tu tendencia es encontrar lo positivo, minimizar lo que no funciona y evitar decir algo que pueda incomodar.',why:'Tu orientacion a la armonia hace que quieras que la persona se sienta bien consigo misma y su trabajo.',adjust:'El feedback verdaderamente cuidadoso incluye lo que no funciona. Podes decir: "Lo que funciona muy bien es X. Lo que creo que podria ser mejor es Y." Esa honestidad es un acto de respeto genuino real.'},
        {label:'Situacion D',title:'Tenes multiples pedidos urgentes y no podes cumplir todos',natural:'Tu tendencia es intentar responder a todos para no decepcionar a nadie y terminar sin poder cumplir ninguno bien.',why:'Tu orientacion a la inclusion y al cuidado hace que no quieras que nadie sienta que no importa para vos.',adjust:'Practica la priorizacion explicita: "Puedo hacer X esta semana. Y puede esperar hasta la proxima. Esta bien?" Esa claridad respeta mas al otro que el "si a todo" que luego no puede cumplirse.'},
      ],
      plan90:{
        m1:[['Registrar perspectivas no expresadas','Cada vez que salgas de una conversacion con algo que quisiste decir y no dijiste, anotalo.','Semanal'],
            ['Observar el patron de postergacion de decisiones','Anota que decisiones postergaste esta semana y por que. Que tenian en comun?','Semanal'],
            ['Pedir feedback sobre tu voz en el equipo','Pregunta: "Cuando sentis que aporto mi perspectiva real? Cuando te parece que me adapto sin opinion?"','Una vez']],
        m2:[['Expresar la propia perspectiva activamente en reuniones','En cada reunion importante esta semana, comparti tu perspectiva real antes de que el tema se cierre.','Semanal'],
            ['Tomar una decision sin buscar consenso previo','Elegi una decision que normalmente consultarias y tomala desde tu propio criterio primero.','Una vez/semana'],
            ['Iniciar la conversacion dificil mas pendiente','Identifica la tension mas antigua que estas evitando. Esta semana, inicia esa conversacion concreta.','Una vez']],
        m3:[['Integrar direccion propia de T3','Establece una meta personal concreta para este trimestre y comunicala activamente a tu entorno cercano.','Una vez'],
            ['Propone una direccion concreta sin esperar','En una situacion grupal, propone una direccion sin esperar que alguien mas lo haga primero.','Cuando surja'],
            ['Solicitar feedback 360','Pedi feedback sobre tu presencia, tu decision y tu capacidad de liderar desde tu propia perspectiva.','Una vez al cierre']],
      },
      checkin:['Exprese mi perspectiva real en alguna situacion de grupo esta semana, sin esperar la invitacion?','Inicie alguna conversacion dificil que venia postergando durante demasiado tiempo?','Tome alguna decision importante desde mi propio criterio sin buscar consenso previo de todos?','Estableci una prioridad clara y la sostuve aunque otros me pidieran algo diferente esta semana?','Movi algo hacia adelante desde mi propia intencion genuina, sin esperar la presion del exterior?'],
      commitment:['Expresar la propia perspectiva activamente, sin esperar la invitacion explicita de los demas.','Iniciar conversaciones dificiles antes de que los problemas escalen solos sin intervencion.','Liderar con intencion propia genuina, no solo facilitando la agenda y la vision de otros.'],
    },
  };

  /* ===========================================================
     CONTENIDO TEORICO UNIVERSAL
  =========================================================== */
  const HISTORIA_TIMELINE = [
    ['Antiguedad','Raices en la sabiduria sufi, filosofia pitagorica y misticismo cristiano oriental. El simbolo fue transmitido oralmente en escuelas esotericas.'],
    ['1877-1949','George Gurdjieff introduce el simbolo en Occidente como sistema filosofico de transformacion y evolucion - no para tipos de personalidad.'],
    ['Decadas 1950','Oscar Ichazo integra psicologia, espiritualidad y filosofia. Identifica los 9 eneatipos con sus pasiones, virtudes, fijaciones y santos ideales.'],
    ['Decadas 1970','Claudio Naranjo lleva el Eneagrama a la psicologia moderna. Lo combina con enfoques terapeuticos gestalticos y lo populariza en Occidente.'],
    ['Decadas 1980','Helen Palmer, Don Riso y otros sistematizan el modelo. Entra en universidades y empresas de EE.UU. y Europa como herramienta de desarrollo.'],
    ['Decadas 1990','Riso y Hudson publican "La Sabiduria del Eneagrama". Lapid-Bogda lo aplica al liderazgo organizacional. Expansion global definitiva del modelo.'],
    ['Hoy','Mas de 30 millones de personas usan el Eneagrama. Estandar en coaching, psicoterapia, seleccion de personal y desarrollo de liderazgo en organizaciones.'],
  ];

  const TRIADAS_DATA = [
    {nombre:'TRIADA DEL CUERPO - Tipos 1 . 8 . 9',centro:'Instinto y accion',emocion:'IRA',color:[160,50,50],
     items:['Tipo 1: transforma la ira en critica y autocorreccion interna constante e implacable.','Tipo 8: expresa la ira directamente como fuerza, control y dominio sobre el entorno.','Tipo 9: adormece la ira propia y su agenda personal para mantener la paz exterior a toda costa.','Trabajo central: canalizar la energia instintiva con sabiduria, sin negarla ni imponerla sobre los demas.']},
    {nombre:'TRIADA DEL CORAZON - Tipos 2 . 3 . 4',centro:'Emocion e imagen',emocion:'VERGUENZA',color:[180,80,120],
     items:['Tipo 2: evita la verguenza siendo indispensable y necesario para todos los que le rodean.','Tipo 3: evita la verguenza siendo exitoso y admirado publicamente por sus logros visibles.','Tipo 4: siente la verguenza como defecto propio permanente; busca su valor en ser unico y especial.','Trabajo central: encontrar el propio valor intrinseco sin depender de la validacion y aprobacion ajenas.']},
    {nombre:'TRIADA DE LA CABEZA - Tipos 5 . 6 . 7',centro:'Pensamiento y analisis',emocion:'MIEDO',color:[50,100,170],
     items:['Tipo 5: se aisla del mundo para sentirse seguro acumulando conocimiento y recursos intelectuales.','Tipo 6: anticipa permanentemente amenazas y busca sistemas de seguridad y figuras de autoridad.','Tipo 7: huye del miedo hacia la estimulacion constante, las opciones ilimitadas y las experiencias positivas.','Trabajo central: desarrollar confianza interior sin depender de la certeza, el analisis o la huida permanente.']},
  ];

  const FLECHAS_ROWS = [
    ['Tipo 1','-> T7: Integra espontaneidad, alegria y disfrute sin culpa.','-> T4: Melancolia, irracionalidad, sentimiento de defecto.'],
    ['Tipo 2','-> T4: Integra autoconocimiento y honestidad con las propias necesidades.','-> T8: Agresividad, control y manipulacion para obtener lo que necesita.'],
    ['Tipo 3','-> T6: Integra lealtad, compromiso y honestidad sobre sus limitaciones.','-> T9: Indiferencia, desconexion y procrastinacion inexplicable.'],
    ['Tipo 4','-> T1: Integra principios, disciplina y capacidad de accion objetiva.','-> T2: Sobre-implicacion, dependencia emocional e idealizacion.'],
    ['Tipo 5','-> T8: Integra asertividad, presencia corporal y accion directa.','-> T7: Dispersion, hiperactividad mental y fuga en fantasias.'],
    ['Tipo 6','-> T9: Integra paz interior y capacidad de soltar el control constante.','-> T3: Competitividad, imagen inflada y workaholism defensivo.'],
    ['Tipo 7','-> T5: Integra profundidad, concentracion y capacidad de estar solo.','-> T1: Critica extrema, rigidez y perfeccionismo paralizante.'],
    ['Tipo 8','-> T2: Integra ternura, vulnerabilidad y dar sin necesitar control.','-> T5: Aislamiento, paranoia y acumulacion obsesiva de recursos.'],
    ['Tipo 9','-> T3: Integra direccion propia, enfoque y capacidad de autoafirmarse.','-> T6: Ansiedad, hipervigilancia y rigidez en rutinas de control.'],
  ];

  const SUBTIPOS_DATA = [
    {nombre:'AUTOCONSERVACION (AC)',sub:'Supervivencia, salud, recursos',color:[140,80,40],
     items:['La persona AC tiende a ser mas practica, ansiosa respecto a su bienestar fisico y mas introvertida.','Su pregunta central: Estoy seguro? Tengo suficiente? Mi entorno inmediato es estable y confiable?','T1 AC: perfeccionismo enfocado en la salud, economia y orden domestico cotidiano.','T2 AC: cuida de sus seres queridos mas cercanos antes que de grupos amplios o colectivos.','T8 AC: protege con ferocidad su espacio, privacidad y recursos personales de cualquier intrusion.']},
    {nombre:'SOCIAL (SOC)',sub:'Pertenencia, estatus, comunidad',color:[50,100,160],
     items:['La persona SOC es la mas extrovertida de los tres subtipos del mismo tipo en su expresion.','Su pregunta central: Pertenezco? Cual es mi rol y posicion real dentro del grupo al que pertenezco?','T3 SOC: exito visible para el grupo, networking constante, imagen publica cuidada y gestionada.','T5 SOC: comparte conocimiento con su tribu selecta de referencia intelectual y profesional.','T9 SOC: la armonia del grupo como mision personal; mediador natural entre las distintas partes.']},
    {nombre:'SEXUAL / SINTONIA (SX)',sub:'Intensidad relacional, atraccion',color:[160,60,120],
     items:['La persona SX es la mas intensa y apasionada de los tres subtipos del mismo tipo en general.','Su pregunta central: Hay quimica real aqui? Existe una conexion verdadera con esta persona?','T4 SX: intensidad emocional maxima en las relaciones intimas; el amor como experiencia total absoluta.','T6 SX: lealtad absoluta a una persona o causa; el desafio como forma de testear la confianza real.','T7 SX: busqueda de la experiencia mas intensa posible, el siguiente gran amor o proyecto total.']},
  ];

  const COMM_GUIA = [
    ['T1','Estandares e integridad. Presenta el "como correcto" desde el inicio de la conversacion.','Imprecision, atajos o bajar el estandar sin justificacion clara y honesta.'],
    ['T2','Reconocimiento y conexion. Empeza siempre por el vinculo antes que por la tarea en si.','Frialdad, ignorar la dimension emocional o la relacion personal.'],
    ['T3','Logros y eficiencia. Directo al resultado, enmarcalo como exito visible y concreto.','Rodeos, falta de claridad o trabajo sin visibilidad ni reconocimiento.'],
    ['T4','Autenticidad y singularidad. Reconoce su perspectiva unica antes de ir a la tarea.','Uniformidad, comparaciones con otros o ignorar su aporte especial.'],
    ['T5','Datos y logica. Da informacion completa antes de la reunion, sin sorpresas de ningun tipo.','Imprecision, apuro o invasion del espacio personal durante el proceso.'],
    ['T6','Seguridad y claridad. Explica el contexto completo y quien respalda la decision tomada.','Cambios abruptos, ambiguedad o inconsistencia del liderazgo en el tiempo.'],
    ['T7','Posibilidades y libertad. Enmarcalo como aventura con multiples opciones genuinas.','Rutina rigida, limitaciones sin explicar o foco unico obligatorio permanente.'],
    ['T8','Respeto y accion directa. Sin rodeos, reconoce su autoridad real en su area.','Manipulacion, debilidad, indirectas o falta de conviccion clara en el liderazgo.'],
    ['T9','Armonia e inclusion. Explica el contexto con paciencia y pedi activamente su opinion.','Presion para decidir rapido o cambios sin tiempo de preparacion previa.'],
  ];

  const COMM_ERRORES = [
    ['T1','Tan critico que genera verguenza y bloqueo en el receptor - incluso cuando tiene razon objetiva.'],
    ['T2','Promete mas de lo que puede dar por necesidad de aprobacion - genera expectativas rotas sistematicamente.'],
    ['T3','Dice lo que el otro quiere escuchar para obtener validacion - la mascara destruye la confianza.'],
    ['T4','Se expresa con tal intensidad emocional que el mensaje real se pierde detras del drama de la emocion.'],
    ['T5','Da tanta informacion tecnica y detalle que el receptor pierde el hilo y el punto central del mensaje.'],
    ['T6','Tan precavido en el mensaje que suena negativista y paralizante para el equipo que lo escucha.'],
    ['T7','Tan entusiasta que el receptor no puede distinguir que es prioritario de lo que es solo una idea.'],
    ['T8','Tan directo que resulta agresivo - atropella sin intencion a quien necesita contexto y calma para procesar.'],
    ['T9','Tan indirecto que el receptor no sabe que esta pidiendo ni que quiere o necesita realmente.'],
  ];

  const ORG_TIPOS = [
    ['Tipo 1','Alto protocolo, normas estrictas. Cultura de calidad total. Fuerte en medicina, auditoria, derecho.'],
    ['Tipo 2','Centrada en bienestar de personas. Foco en necesidades emocionales. Fuerte en ONGs, educacion y salud.'],
    ['Tipo 3','Agil, orientada a resultados, cuida su imagen. Fuerte en ventas, marketing, startups y consultoria.'],
    ['Tipo 4','Diferenciada, con estilo propio inconfundible. Fuerte en diseno, moda, arte y produccion creativa.'],
    ['Tipo 5','Gestiona informacion con rigor extremo. Prioriza el conocimiento. Fuerte en tecnologia e investigacion.'],
    ['Tipo 6','Planificacion detallada, sistemas de seguridad robustos. Fuerte en seguros, banca y protocolo estricto.'],
    ['Tipo 7','Generadora de ideas, vanguardista. Fuerte en innovacion, entretenimiento y emprendimiento disruptivo.'],
    ['Tipo 8','Dominante en su sector, liderazgo directo y exigente. Fuerte en industrias competitivas jerarquizadas.'],
    ['Tipo 9','Armonia, cooperacion y procesos estables. Fuerte en mediacion, diplomacia y gestion de comunidades.'],
  ];

  const TENSION_COMPL = [
    ['T1 vs T7','Perfeccionismo vs. espontaneidad.','El 1 aporta rigor; el 7 aporta vision. Definir nivel minimo de calidad aceptable antes de iniciar.'],
    ['T2 vs T5','Conexion vs. autonomia.','Respetar ritmos distintos con limites explicitos acordados entre ambas partes en el equipo.'],
    ['T3 vs T4','Imagen vs. autenticidad.','Valorar tanto el logro como el proceso creativo y la expresion personal singular del T4.'],
    ['T6 vs T7','Precaucion vs. optimismo.','El 6 aporta rigor preventivo; el 7 aporta energia innovadora. Evaluar riesgos con entusiasmo real.'],
    ['T8 vs T9','Velocidad vs. ritmo.','El 8 aporta impulso; el 9 aporta estabilidad. Acordar tiempos explicitos con criterios claros.'],
    ['T5 vs T2','Independencia vs. vinculacion.','El 5 aporta analisis riguroso; el 2 aporta inteligencia emocional. Definir limites de contacto.'],
  ];

  const FRASES_APERTURA = [
    ['"Quiero revisar esto porque valoro la calidad de tu trabajo y quiero que este en su mejor version."','Para dar feedback correctivo al Tipo 1 o cuando queres senalar algo con cuidado.'],
    ['"Valoro profundamente lo que aportas al equipo y hay algo importante que quiero compartir contigo."','Para conversaciones dificiles con el Tipo 2 que requieren equilibrio entre cuidado y directness.'],
    ['"Tengo algo concreto que revisar. Son 5 minutos y tiene impacto directo en los resultados del proyecto."','Para conversaciones eficientes con el Tipo 3 que prioriza el tiempo y los resultados medibles.'],
    ['"Quiero hablarte con cuidado porque valoro tu perspectiva unica y necesito genuinamente tu punto de vista."','Para conversaciones con el Tipo 4 donde la singularidad y la autenticidad son centrales.'],
    ['"Tengo datos y una observacion especifica para analizar juntos que ajustar en el proceso actual."','Para conversaciones con el Tipo 5 que necesita evidencia y estructura antes de cualquier decision.'],
    ['"Quiero que estes preparado para esto. Necesito que sepas que tenes mi respaldo completo en esta situacion."','Para conversaciones con el Tipo 6 donde la seguridad y el apoyo son condicion de apertura real.'],
    ['"Tengo algo para explorar juntos - creo que hay una oportunidad importante que podemos aprovechar bien."','Para conversaciones con el Tipo 7 enmarcadas como posibilidad y no como limitacion ni problema.'],
    ['"Sere directo porque te respeto. Hay algo que afecta los resultados y necesitamos hablarlo ahora mismo."','Para conversaciones con el Tipo 8 donde la directness y el respeto son condicion de credibilidad.'],
    ['"Note algo que quiero compartirte con cuidado. Tenes un momento para hablar sin apuro?"','Para conversaciones con el Tipo 9 donde la calma y el espacio son condiciones de presencia real.'],
  ];

  const COACHING_Q = [
    ['Para desbloquear el avance','Que esta frenando el avance en este momento? Que opcion no consideraste todavia en el proceso?'],
    ['Para clarificar el proximo paso','Cual es el UN paso que podes hacer hoy para avanzar con lo que tenes disponible ahora mismo?'],
    ['Para generar aprendizaje','Que aprendiste de esta experiencia que no sabias antes? Que harias diferente la proxima vez?'],
    ['Para fortalecer la autonomia','Que necesitas para poder avanzar con mas confianza sin necesitar aprobacion o validacion constante?'],
    ['Para desarrollar perspectiva','Si el resultado fuera el doble de bueno de lo que esperas, que estarias haciendo diferente ahora mismo?'],
    ['Para generar compromiso genuino','Que compromisos concretos estas dispuesto a asumir antes de nuestra proxima conversacion de seguimiento?'],
  ];

  /* ===========================================================
     UTILS
  =========================================================== */
  function safeJson(v){if(typeof v!=='string')return v;try{return JSON.parse(v);}catch{return v;}}
  function txt(v,fb=''){return String(v??fb).trim();}
  function fmtDate(d){const dt=d?new Date(d):new Date();return isNaN(dt)?new Date().toLocaleDateString('es-AR'):dt.toLocaleDateString('es-AR');}
  function yearOf(d){const dt=d?new Date(d):new Date();return isNaN(dt)?String(new Date().getFullYear()):String(dt.getFullYear());}
  function firstName(full){return txt(full,'Participante').split(/\s+/)[0]||'Participante';}

  /* ===========================================================
     EXTRACCION DE SCORES - algoritmo correcto PI->T1 ... PIX->T9
  =========================================================== */
  function extractScores(data){
    // Replica EXACTAMENTE EneagramaCalc.calcularEneagrama() del Informe oficial:
    // Mapeo directo: PI=T1, PII=T2, PIII=T3, PIV=T4, PV=T5, PVI=T6, PVII=T7, PVIII=T8, PIX=T9
    // Score = suma de valores de esa seccion / (n * 5) * 100
    var SECCION_A_TIPO = {PI:1,PII:2,PIII:3,PIV:4,PV:5,PVI:6,PVII:7,PVIII:8,PIX:9};
    var raw = String(data.Respuestas || data.respuestas || '');
    var scores = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
    var counts  = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};

    if(raw.length > 5){
      var sectionRegex = /\{(PVIII|PVII|PIX|PVI|PIV|PIII|PII|PV|PI)\s*:[^-]*-([^}]+)\}/g;
      var match;
      while((match = sectionRegex.exec(raw)) !== null){
        var secName = match[1].trim();
        var tipo = SECCION_A_TIPO[secName];
        if(!tipo) continue;
        var pairsStr = match[2].trim();
        pairsStr.split(',').forEach(function(p){
          var parts = p.trim().split(';');
          if(parts.length === 2){
            var val = parseInt(parts[1], 10);
            if(!isNaN(val) && val >= 1 && val <= 5){
              scores[tipo] += val;
              counts[tipo]++;
            }
          }
        });
      }
      // PORCENTAJE CORRECTO: proporcion del total -> suma = 100%
      var totalRaw = 0;
      for(var t = 1; t <= 9; t++) totalRaw += scores[t];
      var result = {};
      for(var t = 1; t <= 9; t++){
        result[t] = totalRaw > 0 ? Math.round((scores[t] / totalRaw) * 100) : 0;
      }
      // Ajuste de redondeo para que sumen exactamente 100
      var suma = 0;
      for(var t = 1; t <= 9; t++) suma += result[t];
      if(suma !== 100 && totalRaw > 0){
        var maxT = 1;
        for(var t = 2; t <= 9; t++) if(scores[t] > scores[maxT]) maxT = t;
        result[maxT] += (100 - suma);
      }
      return result;
    }

    // Fallback: si no hay Respuestas, distribucion uniforme
    return {1:11,2:11,3:11,4:11,5:11,6:11,7:11,8:12,9:11};
  }


  function determineType(data, scores){
    // Usar siempre el score mas alto, igual que EneagramaCalc.determinarResultado()
    return parseInt(Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0],10);
  }

// DESPUÉS — los 2 tipos con mayor score excluyendo el base, igual que calculoEneagramaTotal.js:
function determineWing(scores,domType){
  var otrosTipos=[1,2,3,4,5,6,7,8,9].filter(function(t){return t!==domType;});
  otrosTipos.sort(function(a,b){return (scores[b]||0)-(scores[a]||0);});
  var ala1Num=otrosTipos[0];
  var ala2Num=otrosTipos[1];
  // Retornar el ala dominante (mayor score) en formato TYPE_ALAS si existe, o genérico
  var alaA=TYPE_ALAS[domType]&&TYPE_ALAS[domType].a;
  var alaB=TYPE_ALAS[domType]&&TYPE_ALAS[domType].b;
  // Si el ala1 coincide con la definición de TYPE_ALAS, usar esos datos enriquecidos
  if(alaA&&alaA.num===ala1Num) return alaA;
  if(alaB&&alaB.num===ala1Num) return alaB;
  // Fallback genérico
  return {num:ala1Num, n:'Tipo '+ala1Num, d:'Ala con mayor influencia en el perfil.'};
}

  function buildVars(data,scores,domType,wing){
    const full=txt(data.NombreCompleto)||`${txt(data.Nombre)} ${txt(data.Apellido)}`.trim()||txt(data.userName)||txt(data.User)||'Participante';
    const d=data.Fecha||data.fecha||new Date().toISOString();
    return{
      NOMBRE:firstName(full),NOMBRE_COMPLETO:full,
      FECHA:fmtDate(d),FECHA_ANO:yearOf(d),
      ADMIN:txt(data.Usuario_Admin||data.Admin||data.empresa||data.userName||'ONE . Escencial'),
      TIPO_NUM:domType,TIPO_NOMBRE:TYPE_NAMES[domType],
      TIPO_LABEL:`Tipo ${domType} - ${TYPE_NAMES[domType]}`,
      TRIADA:TYPE_TRIADA[domType],EMOCION:TYPE_EMOCION[domType],
      PASION:TYPE_PASION[domType],VIRTUD:TYPE_VIRTUD[domType],
      INTEGRACION:TYPE_INTEG[domType],DESINTEGRACION:TYPE_DESINT[domType],
      ALA:wing,SCORES:scores,
    };
  }

  /* ===========================================================
     BUILDERS DE SECCIONES
  =========================================================== */
  function sec01_welcome(vars){
    const t=vars.TIPO_NUM,td=TD[t];
    return{title:SECTION_TITLES[0],blocks:[
      {type:'paragraph',size:9.8,lineH:5.0,text:
        `Buenos Aires, ${vars.FECHA}\n\n${vars.NOMBRE}:\n\nEste material no es un documento generico. Fue construido especificamente para vos a partir de los resultados de tu evaluacion de Eneagrama, con un solo objetivo: ayudarte a comprender en profundidad tu patron motivacional dominante y a liderar tu vida desde un lugar mas consciente y autentico.\n\nEl Eneagrama responde a la pregunta mas importante que podemos hacernos: Por que actuo asi? No que hago, ni cuanto se, sino que me mueve desde adentro. Esta herramienta describe tu motivacion profunda, tu miedo central y el deseo esencial que organiza tu conducta - muchas veces sin que vos mismo lo sepas con claridad.\n\nTu evaluacion indica que tu eneatipo dominante es el Tipo ${t} - ${TYPE_NAMES[t]}. Esto significa que tu brujula motivacional central se orienta hacia: ${td.motivador}\n\nEn momentos de crecimiento y seguridad, tu tipo integra las cualidades sanas del Eneatipo ${vars.INTEGRACION} - ${TYPE_NAMES[vars.INTEGRACION]}. Ese es el camino de tu expansion mas profunda.\n\nBajo estres elevado, podes activar patrones del Eneatipo ${vars.DESINTEGRACION} - ${TYPE_NAMES[vars.DESINTEGRACION]}. Reconocer esas senales temprano es parte central del trabajo de desarrollo personal.\n\n${vars.NOMBRE}, este material te acompanara en ese viaje. No para cambiar quien sos - ese nunca sera el objetivo - sino para ampliar tu rango de respuestas y vivir desde tu version mas integrada y consciente.\n\nCon confianza en tu potencial,\nEquipo de Desarrollo - ONE . Escencial | ${vars.FECHA_ANO}`},
    ]};
  }

  function sec02_historia(vars){
    return{title:SECTION_TITLES[1],intro:'El Eneagrama tiene raices milenarias que convergen en un poderoso modelo contemporaneo de desarrollo humano.',blocks:[
      {type:'subtitle',text:'Linea de Tiempo Historica'},
      {type:'table',headers:['Periodo','Hito Historico'],colWidths:[0.22,0.78],headerBg:[13,30,58],rows:HISTORIA_TIMELINE},
      {type:'divider'},
      {type:'subtitle',text:'Premisas Fundamentales del Modelo'},
      {type:'bullets',items:['El Eneagrama mide motivaciones profundas, miedos y deseos centrales - no comportamientos superficiales ni habilidades tecnicas.','Ningun eneatipo es superior a otro: cada uno aporta dones unicos e indispensables al equipo y a la organizacion.','El modelo describe el QUE y el POR QUE de la conducta, no el CUANTO sabe ni la capacidad tecnica de la persona.','Los perfiles son estables en su nucleo, pero el nivel de desarrollo varia segun el trabajo interior sostenido.','El Eneagrama NO diagnostica trastornos psicologicos - es una herramienta de crecimiento, no clinica.','Toda persona puede mostrar conductas de varios tipos, pero solo uno sera el patron motivacional dominante de toda su vida.']},
      {type:'infoCard',title:'PRINCIPIO CLAVE',color:[13,30,58],text:'El Eneagrama responde "Por que actua asi esta persona?" - no "Que hace?" ni "Cuanto sabe?". Describe la motivacion profunda y el miedo central. Es una brujula del alma, no una sentencia de caracter.'},
    ]};
  }

  function sec03_triadas(vars){
    const t=vars.TIPO_NUM;
    return{title:SECTION_TITLES[2],intro:'El Eneagrama organiza los 9 tipos en tres grupos segun el centro de inteligencia dominante con el que perciben y responden al mundo.',blocks:[
      ...TRIADAS_DATA.flatMap(g=>[
        {type:'infoCard',title:g.nombre,color:g.color,text:`Centro: ${g.centro} . Emocion subyacente: ${g.emocion}`},
        {type:'bullets',items:g.items},
      ]),
      {type:'divider'},
      {type:'quote',text:'Bajo estres elevado, la persona regresa a la emocion no resuelta de su triada: el tipo de Cuerpo se vuelve mas rigido o explosivo; el tipo de Corazon mas ansioso por su imagen; el tipo de Cabeza mas paralizado por el analisis o el miedo. Conocer tu triada es conocer tu talon de Aquiles emocional.'},
      {type:'highlight',title:`TU TRIADA - TIPO ${t}`,color:TYPE_COLOR[t],bg:[246,249,253],text:`${vars.NOMBRE}, tu eneatipo ${t} pertenece a la Triada del ${vars.TRIADA}. La emocion subyacente de tu centro es: ${vars.EMOCION}. Esta es la emocion que, de no ser gestionada conscientemente, organiza tus reacciones automaticas ante el mundo y ante los demas.`},
    ]};
  }

  function sec04_niveles(vars){
    return{title:SECTION_TITLES[3],intro:'Riso y Hudson identificaron 9 niveles de salud psicologica para cada tipo - del mas sano al mas disfuncional.',blocks:[
      {type:'infoCard',title:'NIVELES SANOS (7-9)',color:[13,100,50],text:'Accede a las virtudes del tipo. Alta autoconciencia, contribucion genuina y flexibilidad en el comportamiento.'},
      {type:'bullets',items:['Integracion de las cualidades sanas del punto de integracion (flecha positiva).','Alta autoconciencia: la persona se ve a si misma con claridad y ecuanimidad real.','Contribucion genuina al entorno sin necesidad de validacion ni reconocimiento externos.','Flexibilidad para adoptar conductas de otros tipos cuando el contexto lo requiere genuinamente.']},
      {type:'infoCard',title:'NIVELES PROMEDIO (4-6)',color:[180,120,20],text:'La persona funciona pero con patrones automaticos de defensa en operacion permanente.'},
      {type:'bullets',items:['El ego toma el control: se afirman comportamientos automaticos y estrategias rigidas de defensa.','Rigidez progresiva: dificultad creciente para ver otras perspectivas o metodos igualmente validos.','El punto de estres (flecha negativa) empieza a influir con mayor frecuencia observable en la conducta.','Mecanismos de defensa activos que distorsionan sutilmente la percepcion de la realidad del otro.']},
      {type:'infoCard',title:'NIVELES BAJOS (1-3)',color:[180,50,50],text:'Los mecanismos de defensa se vuelven destructivos. Distorsion grave de la realidad y las relaciones.'},
      {type:'bullets',items:['Mecanismos de defensa activamente daninos para uno mismo y para los demas del entorno.','Distorsion grave de la realidad: proyecciones intensas, paranoia o disociacion observable.','Destruccion de relaciones, reputacion y oportunidades de manera compulsiva e involuntaria.','Posible aparicion de trastornos de personalidad reconocibles clinicamente en los casos extremos.']},
      {type:'divider'},
      {type:'bullets',items:['Los perfiles de menores de 20 anos son menos confiables por la alta plasticidad conductual activa del cerebro.','Entre 30 y 40 anos, el perfil natural suele consolidarse y ser mas predecible y estable en el tiempo.','El coaching y la retroalimentacion 360 aceleran el desarrollo del autocontrol en cualquier etapa vital.','El desarrollo conductual no es cambiar quien sos - es expandir el rango de respuestas disponibles.']},
    ]};
  }

function sec05_alas(vars){
  const t=vars.TIPO_NUM;
  const alas=TYPE_ALAS[t];
    const rows=Object.entries(TYPE_ALAS).map(([tn,aw])=>[`Tipo ${tn}`,aw.a.n,aw.b.n]);
    return{title:SECTION_TITLES[4],intro:'Las alas son los tipos adyacentes al propio eneatipo. Anaden matices unicos al perfil dominante sin cambiar su nucleo motivacional.',blocks:[
      {type:'table',headers:['Tipo','Ala A','Ala B'],colWidths:[0.10,0.45,0.45],headerBg:[13,30,58],compact:true,rows},
      {type:'divider'},
      {type:'highlight',title:`TUS ALAS - TIPO ${t}`,color:TYPE_COLOR[t],bg:[246,249,253],text:`Para tu eneatipo ${t}, las dos alas posibles son:\n\n${alas.a.n}: ${alas.a.d}\n\n${alas.b.n}: ${alas.b.d}\n\nObserva cual colorea mas tu experiencia cotidiana.`},
      {type:'infoCard',title:'COMO IDENTIFICAR TU ALA',color:[13,30,58],text:'La personalidad dominante suele ser la que mas se activo durante la infancia como estrategia de adaptacion. Preguntate: cual de los dos tipos adyacentes reconoces mas en vos cuando estas bajo presion o en situaciones de alta exigencia personal o profesional?'},
    ]};
  }

  function sec06_flechas(vars){
    const t=vars.TIPO_NUM;
    return{title:SECTION_TITLES[5],intro:'En estres, el tipo activa lo disfuncional del tipo hacia el que apunta su flecha. En seguridad, integra las cualidades sanas del tipo opuesto.',blocks:[
      {type:'table',headers:['Tipo','Integracion (seguridad) - cualidades sanas','Desintegracion (estres) - conductas disfuncionales'],colWidths:[0.10,0.45,0.45],headerBg:[13,30,58],compact:true,rows:FLECHAS_ROWS},
      {type:'divider'},
      {type:'twoColumn',leftTitle:`TU INTEGRACION - Tipo ${vars.INTEGRACION}`,rightTitle:`TU DESINTEGRACION - Tipo ${vars.DESINTEGRACION}`,
        leftItems:[`En momentos de crecimiento y seguridad, integras las cualidades sanas del Tipo ${vars.INTEGRACION} - ${TYPE_NAMES[vars.INTEGRACION]}.`,`Esto significa acceder a: ${TD[vars.INTEGRACION].motivador.toLowerCase()}`,`La virtud de integracion que cultivas es: ${TYPE_VIRTUD[vars.INTEGRACION]}`,`Este movimiento requiere trabajo consciente e intencional - no ocurre automaticamente.`],
        rightItems:[`Bajo estres elevado, podes activar patrones del Tipo ${vars.DESINTEGRACION} - ${TYPE_NAMES[vars.DESINTEGRACION]}.`,`Las senales de alerta incluyen: ${TD[vars.DESINTEGRACION].cuidados[0].toLowerCase()}`,`La pasion que se activa en desintegracion es: ${TYPE_PASION[vars.DESINTEGRACION]}`,`Reconocer estas senales temprano es el primer paso para redirigir el patron automatico.`]},
      {type:'infoCard',title:'COMO TRABAJAR CON LAS FLECHAS',color:[13,30,58],text:'El movimiento hacia el punto de integracion NO es un proceso automatico - requiere un esfuerzo consciente y una reflexion interna sostenida. El punto de desintegracion no es algo "malo": es una indicacion de que la persona necesita descanso, apoyo o un cambio de estrategia urgente. Reconocer que provoco el movimiento hacia el estres es el primer paso hacia la recuperacion genuina.'},
    ]};
  }

  function sec07_subtipos(vars){
    const t=vars.TIPO_NUM;
    return{title:SECTION_TITLES[6],intro:'Cada eneatipo se expresa de forma unica segun cual de los tres instintos biologicos es dominante en la persona. Esto crea 27 perfiles unicos dentro del modelo.',blocks:[
      ...SUBTIPOS_DATA.flatMap(g=>[
        {type:'infoCard',title:g.nombre,color:g.color,text:`Foco: ${g.sub}`},
        {type:'bullets',items:g.items},
      ]),
      {type:'divider'},
      {type:'infoCard',title:'POR QUE LOS SUBTIPOS SON TAN IMPORTANTES',color:[13,30,58],text:`El subtipo puede hacer que dos personas del mismo eneatipo parezcan completamente distintas. Como Tipo ${t} - ${TYPE_NAMES[t]}, tu subtipo instintivo dominante (AC, SOC o SX) modifica significativamente como expresas tu patron central en el dia a dia y en las relaciones.`},
    ]};
  }

  function sec08_perfil(vars,scores){
    const t=vars.TIPO_NUM,td=TD[t];
    const scoreRows=Object.entries(scores).sort((a,b)=>parseInt(a[0])-parseInt(b[0])).map(([tn,sc])=>[`Tipo ${tn} - ${TYPE_NAMES[parseInt(tn)]}`,`${sc}%`,TYPE_TRIADA[parseInt(tn)],parseInt(tn)===t?'DOMINANTE':'-']);
    return{title:SECTION_TITLES[7],intro:`${vars.NOMBRE}, tu eneatipo dominante es el Tipo ${t} - ${TYPE_NAMES[t]}. A continuacion encontras el mapa completo de tu perfil y lo que significa concretamente para tu vida y tu liderazgo.`,blocks:[
      {type:'highlight',title:`ENEATIPO ${t} - ${TYPE_NAMES[t].toUpperCase()}`,color:TYPE_COLOR[t],bg:[246,249,253],text:td.lema},
      {type:'subtitle',text:'Tus coordenadas motivacionales'},
      {type:'table',headers:['Dimension','Tu patron central'],colWidths:[0.28,0.72],headerBg:TYPE_COLOR[t],rows:[
        ['Motivador central',td.motivador],['Miedo central',td.miedo],['Deseo central',td.deseo],
        ['Pasion (sombra a trabajar)',`${vars.PASION} - La emocion que mueve conductas automaticas no conscientes en tu tipo.`],
        ['Virtud (crecimiento)',`${vars.VIRTUD} - El estado al que llegas cuando trabajas conscientemente tu patron de tipo.`],
        ['Pregunta favorita',td.preguntaFav],
      ]},
      {type:'divider'},
      {type:'subtitle',text:'Tu distribucion de puntajes por eneatipo'},
      {type:'table',headers:['Eneatipo','Puntaje','Triada','Nota'],colWidths:[0.40,0.15,0.20,0.25],headerBg:[13,30,58],compact:true,rows:scoreRows},
      {type:'divider'},
      {type:'twoColumn',leftTitle:'Tu ala dominante probable',rightTitle:'Tus flechas de movimiento',
        leftItems:[`Ala probable: ${vars.ALA.n}`,vars.ALA.d,'Las alas modifican la expresion del tipo sin cambiar su nucleo motivacional central.','Observa cual reconoces mas en vos cuando estas bajo presion real.'],
        rightItems:[`Integracion (crecimiento): Tipo ${vars.INTEGRACION} - ${TYPE_NAMES[vars.INTEGRACION]}`,`Desintegracion (estres): Tipo ${vars.DESINTEGRACION} - ${TYPE_NAMES[vars.DESINTEGRACION]}`,'Trabajar activamente hacia la integracion es el camino de expansion mas directo disponible.','Reconocer las senales de desintegracion temprano permite redirigir el patron.']},
    ]};
  }

  function sec09_fortalezas(vars){
    const t=vars.TIPO_NUM,td=TD[t];
    return{title:SECTION_TITLES[8],intro:'Conocer tus fortalezas naturales te permite potenciarlas intencionalmente. Conocer tus puntos de cuidado te permite anticipar patrones antes de que generen problemas reales.',blocks:[
      {type:'subtitle',text:`Fortalezas naturales del Tipo ${t}`},
      {type:'numbered',items:td.fortalezas},
      {type:'divider'},
      {type:'subtitle',text:'Puntos de cuidado y areas de desarrollo activo'},
      {type:'bullets',items:td.cuidados,bulletColor:[180,50,50]},
      {type:'divider'},
      {type:'subtitle',text:`Como comunicarse efectivamente con el Tipo ${t}`},
      {type:'twoColumn',leftTitle:'Lo que suma en la comunicacion',rightTitle:'Lo que cierra o bloquea',leftItems:td.comunicacion_hacer,rightItems:td.comunicacion_evitar},
      {type:'divider'},
      {type:'highlight',title:'TU ESTILO DE COMUNICACION NATURAL',color:TYPE_COLOR[t],bg:[246,249,253],text:td.comunicacionEstilo},
      {type:'divider'},
      {type:'highlight',title:'TU RELACION CON EL CONFLICTO',color:TYPE_COLOR[t],bg:[246,249,253],text:td.conflictoEstilo},
      {type:'infoCard',title:`VALOR DEL TIPO ${t} EN EL EQUIPO`,color:TYPE_COLOR[t],text:`${vars.NOMBRE}, en el equipo aportas principalmente desde ${td.motivador.toLowerCase()}. Tu presencia genera un valor diferencial que no puede reproducirse desde otros estilos. El reto es que ese valor este disponible en su version mas sana, consciente y sostenible en el tiempo.`},
    ]};
  }

  function sec10_comunicacion(vars){
    const t=vars.TIPO_NUM;
    return{title:SECTION_TITLES[9],intro:'La Regla de Platino: trata a los demas como ELLOS quieren ser tratados - no como tu quieres ser tratado. Adaptar tu mensaje es la clave de la comunicacion estrategica.',blocks:[
      {type:'subtitle',text:'Guia Rapida de Comunicacion por Tipo'},
      {type:'table',headers:['Tipo','Que valoran . Como abrirles','Que los cierra'],colWidths:[0.08,0.50,0.42],headerBg:[13,30,58],rows:COMM_GUIA},
      {type:'divider'},
      {type:'subtitle',text:'Errores frecuentes de comunicacion por tipo'},
      {type:'table',headers:['Tipo','Error mas comun al comunicar'],colWidths:[0.10,0.90],headerBg:[13,30,58],compact:true,rows:COMM_ERRORES},
      {type:'divider'},
      {type:'subtitle',text:'Tu perfil de comunicacion personal'},
      {type:'highlight',title:`TIPO ${t} - TU ESTILO COMUNICACIONAL`,color:TYPE_COLOR[t],bg:[246,249,253],text:`${vars.NOMBRE}, tu patron central de comunicacion esta orientado a: ${TD[t].motivador.toLowerCase()}. Esto significa que tendes a comunicar desde ese filtro motivacional, lo que puede ser una fortaleza enorme cuando el contexto lo requiere - y un obstaculo cuando el otro necesita algo diferente.`},
      {type:'divider'},
      {type:'subtitle',text:'Tensiones naturales entre tipos y claves de resolucion'},
      {type:'table',headers:['Tipos','Tension tipica','Clave de resolucion'],colWidths:[0.14,0.38,0.48],headerBg:[13,30,58],compact:true,rows:TENSION_COMPL},
    ]};
  }

  function sec11_liderazgo(vars){
    const t=vars.TIPO_NUM,td=TD[t];
    return{title:SECTION_TITLES[10],intro:'Tu eneatipo define como lideras, como trabajas en equipo y como respondes bajo presion. Esta seccion te muestra ese mapa completo en detalle personalizado.',blocks:[
      {type:'subtitle',text:`Tu estilo de liderazgo natural - Tipo ${t}`},
      {type:'numbered',items:td.liderazgo},
      {type:'divider'},
      {type:'subtitle',text:'Tu rol natural en equipos'},
      {type:'bullets',items:td.equipos},
      {type:'divider'},
      {type:'subtitle',text:'Escenarios de liderazgo situacional'},
      {type:'infoCard',title:'PRINCIPIO FUNDAMENTAL',color:[13,30,58],text:'El liderazgo efectivo no es aplicar siempre el mismo estilo. Es saber cuando usar tus fortalezas naturales y cuando ajustar tu respuesta al contexto, la persona y la situacion especifica que enfrentas.'},
      ...td.escenarios.map(s=>({type:'scenario',...s})),
      {type:'divider'},
      {type:'subtitle',text:'El Eneagrama en los tipos organizacionales'},
      {type:'paragraph',text:'Las organizaciones tambien desarrollan un estilo eneagramatico colectivo fruto de su cultura fundacional y sus lideres historicos.',size:9.2},
      {type:'table',headers:['Tipo Org.','Caracteristicas Clave'],colWidths:[0.14,0.86],headerBg:[13,30,58],compact:true,rows:ORG_TIPOS},
    ]};
  }

  function sec12_plan(vars){
    const t=vars.TIPO_NUM,plan=TD[t].plan90;
    return{title:SECTION_TITLES[11],intro:'El conocimiento sin accion no produce resultados. Este plan de 90 dias esta disenado para que implementes los aprendizajes de este material de forma gradual, medible y sostenible.',blocks:[
      {type:'infoCard',title:'MES 1 - AUTOCONOCIMIENTO Y OBSERVACION (Dias 1-30)',color:[20,20,30],text:'El primer mes es de observacion activa. Sin cambiar nada, observa con los ojos nuevos que te dio este material. Registra patrones, reacciones y senales de tu eneatipo de forma objetiva y sin juicio.'},
      {type:'table',headers:['Accion','Como implementarla','Frecuencia'],colWidths:[0.30,0.48,0.22],headerBg:[20,20,30],compact:true,rows:plan.m1},
      {type:'infoCard',title:'MES 2 - PRACTICA DELIBERADA (Dias 31-60)',color:[13,100,50],text:'El segundo mes es de practica activa. Elegi 2 o 3 habilidades de desarrollo y ponelas en practica consciente e intencionada. La incomodidad es senal de aprendizaje real y genuino.'},
      {type:'table',headers:['Accion','Como implementarla','Frecuencia'],colWidths:[0.30,0.48,0.22],headerBg:[13,100,50],compact:true,rows:plan.m2},
      {type:'infoCard',title:'MES 3 - CONSOLIDACION E INTEGRACION (Dias 61-90)',color:[130,80,10],text:'El tercer mes es de integracion real. Las practicas del mes 2 empiezan a naturalizarse. Suma profundidad: facilita conversaciones de feedback estructurado sobre tu evolucion.'},
      {type:'table',headers:['Accion','Como implementarla','Frecuencia'],colWidths:[0.30,0.48,0.22],headerBg:[130,80,10],compact:true,rows:plan.m3},
    ]};
  }

  function sec13_herramientas(vars){
    const t=vars.TIPO_NUM,td=TD[t];
    return{title:SECTION_TITLES[12],intro:'Esta seccion te entrega herramientas listas para usar en tu practica cotidiana de autoconocimiento, liderazgo y desarrollo personal.',blocks:[
      {type:'subtitle',text:'Herramienta 1 - Check-in semanal de autoconciencia (10 min cada viernes)'},
      {type:'bullets',items:td.checkin},
      {type:'divider'},
      {type:'subtitle',text:'Herramienta 2 - Habilidades de desarrollo para tu eneatipo'},
      {type:'numbered',items:td.desarrollo},
      {type:'divider'},
      {type:'subtitle',text:'Herramienta 3 - Frases de apertura para conversaciones dificiles por tipo'},
      {type:'table',headers:['Frase de apertura efectiva','Cuando usarla'],colWidths:[0.60,0.40],headerBg:[13,30,58],rows:FRASES_APERTURA},
      {type:'divider'},
      {type:'subtitle',text:'Herramienta 4 - Preguntas poderosas de coaching para el equipo'},
      {type:'table',headers:['Objetivo','Pregunta'],colWidths:[0.28,0.72],headerBg:[13,30,58],compact:true,rows:COACHING_Q},
      {type:'divider'},
      {type:'infoCard',title:'TU DECLARACION PERSONAL DE DESARROLLO',color:TYPE_COLOR[t],text:`Yo, ${vars.NOMBRE_COMPLETO}, me comprometo a trabajar conscientemente mi patron de Tipo ${t} - ${TYPE_NAMES[t]} durante los proximos 90 dias, desde un lugar de autoconciencia, compasion y disciplina genuina.`},
      {type:'subtitle',text:`Mis compromisos concretos - Tipo ${t}`},
      {type:'numbered',items:td.commitment},
      {type:'table',headers:['#','Mi compromiso concreto','Fecha inicio','Como lo medire'],colWidths:[0.06,0.44,0.20,0.30],rows:[
        ['Ej.',`Practicar la ${vars.VIRTUD.toLowerCase()} en situaciones cotidianas del trabajo`,'01/09/2026','Registro semanal de situaciones donde lo aplique'],
        ['1',' ',' ',' '],['2',' ',' ',' '],['3',' ',' ',' '],
      ]},
      {type:'divider'},
      {type:'subtitle',text:'Lecturas recomendadas para tu desarrollo'},
      {type:'bullets',items:['"La Sabiduria del Eneagrama" - Don Richard Riso & Russ Hudson (base teorica fundamental del modelo)','"Caracter y Neurosis" - Claudio Naranjo (pasiones, virtudes y trabajo interior profundo de cada tipo)','"The Complete Enneagram" - Beatrice Chestnut (los 27 subtipos instintivos en detalle completo)','"Bringing Out the Best in Yourself at Work" - Ginger Lapid-Bogda (aplicacion organizacional del Eneagrama)','"Dare to Lead" - Brene Brown (liderazgo vulnerable y construccion de cultura autentica y sostenida)']},
      {type:'quote',text:`"El liderazgo mas autentico comienza cuando dejas de actuar el personaje y empezas a ser quien realmente sos. El Eneagrama es el espejo que hace posible esa transicion genuina." - ONE . Escencial`},
      {type:'paragraph',size:9.2,color:[100,90,110],text:`${vars.NOMBRE}, este material fue desarrollado con el compromiso de ONE . Escencial de acompanarte en el camino del autoconocimiento. El desarrollo personal no es un evento - es una practica continua. El Eneagrama no es una etiqueta ni una condena: es una invitacion profunda a conocerte y a elegir, cada dia, desde tu version mas consciente y expandida.`},
    ]};
  }

  /* ===========================================================
     BUILD MODEL
  =========================================================== */
  // Usa EneagramaCalc si esta cargado (mismo modulo que el Informe)
  // Si no, usa QUESTIONS_TY interno (mismo resultado)
  function _calcFromRespuestas(rawString){
    // SIEMPRE usar calculoEneagramaTotal.js - fuente unica de verdad
    if(window.CalculoEneagrama && typeof window.CalculoEneagrama.calcularEneagrama==='function'){
      return window.CalculoEneagrama.calcularEneagrama(rawString);
    }
    // Fallback si calculoEneagramaTotal.js no esta cargado
    return _calcInterno(rawString);
  }

  // Calculo correcto usando el tipo real de cada pregunta (q.ty del test)
  // Mismo resultado que el test y el informe
  var QUESTIONS_TY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  function _calcInterno(rawString){
    // Parsear todas las respuestas individuales
    var answers = {};
    var pairRegex = /(\d+);(\d+)/g, pm;
    // Extraer pares question;value de todo el string
    var allPairs = rawString.match(/\d+;\d+/g) || [];
    allPairs.forEach(function(pair){
      var p = pair.split(';');
      var qNum = parseInt(p[0],10);
      var val  = parseInt(p[1],10);
      // DESPUÉS — correcto, acepta las 90 preguntas:
if(qNum>=1 && qNum<=90 && val>=1 && val<=5) answers[qNum-1]=val;
    });

    // Sumar por tipo real de cada pregunta
    var raw={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
    for(var i=0;i<QUESTIONS_TY.length;i++){
      if(answers[i]) raw[QUESTIONS_TY[i]]+=answers[i];
    }

    var tot=0; for(var t=1;t<=9;t++) tot+=raw[t];
    var base=1;
    for(var t=1;t<=9;t++) if(raw[t]>raw[base]) base=t;

    var pct={};
    for(var t=1;t<=9;t++) pct[t]=tot>0?Math.round(raw[t]/tot*100):0;
    var s=0; for(var t=1;t<=9;t++) s+=pct[t];
    if(s!==100) pct[base]+=(100-s);

    var baseFinal = 1;
for(var t=2;t<=9;t++) if(pct[t]>pct[baseFinal]) baseFinal=t;

return {base:baseFinal, scores:pct, rawScores:raw};
  }

  function buildModel(data){
    var calc, scores, domType;

    if(data._resultado && data._resultado.base>=1 && data._resultado.base<=9){
      // Ruta Informe: _resultado calculado por calculoEneagramaTotal.js
      // scores ya estan correctos (suma=100%)
      calc = data._resultado;
      domType = calc.base;
      scores = calc.scores || {};

    } else if(data.Respuestas){
      // Ruta principal: calcular desde Respuestas con q.ty
      calc = _calcFromRespuestas(data.Respuestas);
      domType = calc.base;
      scores  = calc.scores;

    } else {
      domType = parseInt(data.Eneatipo||1,10);
      scores={1:10,2:10,3:10,4:10,5:10,6:10,7:10,8:10,9:10};
      scores[domType]=20;
    }

// DESPUÉS — determineWing ya usa scores directamente, no necesita calcWing separado:
const wing = determineWing(scores, domType);
    const vars = buildVars(data, scores, domType, wing);
    const td   = TD[domType];

    const summary = `${vars.NOMBRE} muestra un patron motivacional dominante de Eneatipo ${domType} - ${TYPE_NAMES[domType]}. Triada: ${vars.TRIADA}. Emocion subyacente: ${vars.EMOCION}. Pasion: ${vars.PASION}. Virtud de crecimiento: ${vars.VIRTUD}. Integracion hacia T${vars.INTEGRACION}. Ala probable: ${wing.n}.`;

    return {
      fullName:   vars.NOMBRE_COMPLETO,
      firstName:  vars.NOMBRE,
      typeNum:    domType,
      typeName:   TYPE_NAMES[domType],
      typeLabel:  vars.TIPO_LABEL,
      dateText:   vars.FECHA,
      admin:      vars.ADMIN,
      scores,
      lema:       td.lema,
      summary,
      sections: [
        sec01_welcome(vars), sec02_historia(vars), sec03_triadas(vars), sec04_niveles(vars),
        sec05_alas(vars),    sec06_flechas(vars),  sec07_subtipos(vars), sec08_perfil(vars, scores),
        sec09_fortalezas(vars), sec10_comunicacion(vars), sec11_liderazgo(vars),
        sec12_plan(vars),    sec13_herramientas(vars),
      ],
    };
  }

  /* ===========================================================
     PUBLIC API - compatible con el index.html existente
  =========================================================== */
  async function generarManualEneagrama(dataInput){
    // Leer de ambas claves de sessionStorage (el test usa minuscula, el Userboard mayuscula)
    var source = dataInput;
    if(!source && typeof sessionStorage !== 'undefined'){
      var d1 = safeJson(sessionStorage.getItem('EneagramaUserData'));
      var d2 = safeJson(sessionStorage.getItem('eneagramaUserData'));
      // Preferir el que tenga Respuestas (string no vacio)
      if(d1 && d1.Respuestas) source = d1;
      else if(d2 && d2.Respuestas) source = d2;
      else source = d1 || d2;
    }
    if(!source)throw new Error('No hay datos del participante para generar el material.');
    // DEBUG - remover despues
    console.log('[EneagramaManual] data keys:', Object.keys(source));
    console.log('[EneagramaManual] Respuestas:', source.Respuestas ? source.Respuestas.substring(0,80) : 'UNDEFINED');
    console.log('[EneagramaManual] Eneatipo:', source.Eneatipo);
    console.log('[EneagramaManual] scores:', source.scores);
    const model=buildModel(source);
    console.log('[EneagramaManual] domType calculado:', model.typeNum);
    const doc=window.EneagramaTheme.render(model);
    const fileName=`Material_Eneagrama_${model.fullName.replace(/\s+/g,'_')}_T${model.typeNum}.pdf`;
    doc.save(fileName);
    return{ok:true,fileName,typeNum:model.typeNum,typeName:model.typeName,scores:model.scores};
  }

  // ================================================================
  // API PUBLICA - compatible con Informe/index.html de la plataforma
  // ================================================================

  // generarPDFEneagrama(userData, resultado, onBase64Ready)
  // El Informe llama esta funcion con:
  //   userData   = _eneagramaUserData (tiene Respuestas, Nombre, Apellido, etc.)
  //   resultado  = _eneagramaResultado (calculado por EneagramaCalc, tiene .base, .scores, etc.)
  //   onBase64Ready = callback opcional para subir a Drive
  window.generarPDFEneagrama = function(userData, resultado, onBase64Ready) {
    // resultado ya viene calculado por EneagramaCalc - usarlo directamente
    var data = Object.assign({}, userData || {});
    // Inyectar el resultado de EneagramaCalc para que buildModel lo use
    if(resultado){
      data._resultado = resultado;
    }
    var model = buildModel(data);
    var doc   = window.EneagramaTheme.render(model);
    var fileName = 'Material_Eneagrama_' + model.fullName.replace(/\s+/g,'_') + '_T' + model.typeNum + '.pdf';
    doc.save(fileName);
    var b64 = doc.output('datauristring').split(',')[1];
    if(typeof onBase64Ready === 'function') onBase64Ready(b64);
    return b64;
  };

  window.generarManualEneagrama = generarManualEneagrama;
  window.descargarManualEneagrama = generarManualEneagrama;
  window.EneagramaManual = {generar:generarManualEneagrama, descargar:generarManualEneagrama};
})();