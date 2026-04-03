/**
 * eneagramaData.js
 * Base de conocimiento de los 9 eneatipos para el informe.
 */

(function () {
  'use strict';

  window.ENEAGRAMA_DATA = {

    tipos: {
      1: {
        nombre: "El Reformador",
        subtitulo: "El tipo idealista de sólidos principios",
        descripcion: "Las personas del Tipo 1 poseen una brújula moral interna muy desarrollada. Tienen un agudo sentido de lo correcto y lo incorrecto, y se esfuerzan constantemente por mejorar tanto a sí mismas como al mundo que las rodea. Su perfeccionismo nace de una convicción genuina: las cosas pueden y deben hacerse bien.",
        color: "#6e3eab",
        colorAlt: "#47278c",
        icono: "⚖️",
        emocionBasica: "Ira reprimida (resentimiento)",
        motivacionProfunda: "Ser buena persona, ética, tener la razón y ser coherente con sus valores",
        miedoProfundo: "Ser corrupto, malo o defectuoso",
        deseoBasico: "Tener integridad y ser equilibrado",
        pecadoCapital: "Ira / Perfeccionismo",
        virtud: "Serenidad",
        fortalezas: [
          "Ético y principista",
          "Responsable y organizado",
          "Perfeccionista orientado a la calidad",
          "Capaz de distinguir lo correcto",
          "Disciplinado y persistente",
          "Honesto y directo"
        ],
        areas_desarrollo: [
          "Tendencia a la autocrítica excesiva",
          "Rigidez ante formas distintas de hacer las cosas",
          "Dificultad para delegar sin controlar",
          "Represión de la ira que se convierte en resentimiento",
          "Impaciencia ante la imperfección ajena"
        ],
        en_trabajo: "En el ámbito laboral, el Tipo 1 es un profesional íntegro que garantiza calidad y cumple sus compromisos. Es el guardián de los estándares y los procesos. Puede ser un excelente auditor, consultor, líder de calidad o cualquier rol donde la precisión y la ética sean centrales. Su desafío es aprender a valorar los aportes de quienes trabajan diferente.",
        en_equipo: "Eleva el nivel del equipo con su compromiso. Necesita sentir que las normas son respetadas. Se frustra ante la mediocridad o la falta de compromiso. Es el que señala los errores con la intención genuina de mejorar.",
        camino_crecimiento: "El camino de integración del Tipo 1 pasa por conectar con la espontaneidad y el placer del Tipo 7. Aprender que la perfección no siempre es el camino más sabio, y que la aceptación de lo imperfecto es en sí misma una virtud profunda.",
        niveles: {
          sano: "Sabio, perceptivo, realista y noble. Moralmente heroico sin perder la calidez humana.",
          promedio: "Crítico consigo mismo y con los demás. Moralista. Se siente el único que sabe cómo deben hacerse las cosas.",
          insano: "Obsesivo, punitivo, intolerante. La ira reprimida explota en crisis de control."
        }
      },

      2: {
        nombre: "El Ayudador",
        subtitulo: "El tipo preocupado y orientado a los demás",
        descripcion: "Las personas del Tipo 2 tienen una capacidad extraordinaria para percibir las necesidades de los demás y responder a ellas. Son cálidas, generosas y genuinamente interesadas en el bienestar de quienes los rodean. Su mayor alegría es sentirse útiles y necesarios.",
        color: "#953a90",
        colorAlt: "#6e3eab",
        icono: "🤝",
        emocionBasica: "Orgullo (soberbia)",
        motivacionProfunda: "Ser amado y apreciado; ser indispensable para los demás",
        miedoProfundo: "No ser amado o querido; ser considerado egoísta",
        deseoBasico: "Sentirse amado y dar amor",
        pecadoCapital: "Orgullo",
        virtud: "Humildad",
        fortalezas: [
          "Empático y genuinamente comprensivo",
          "Generoso sin condiciones aparentes",
          "Excelente para conectar emocionalmente",
          "Intuitivo sobre las necesidades ajenas",
          "Cálido y afectuoso",
          "Comprometido con el bienestar del otro"
        ],
        areas_desarrollo: [
          "Dificultad para reconocer y expresar sus propias necesidades",
          "Tendencia a dar para luego esperar reconocimiento",
          "Pérdida de identidad en el servicio al otro",
          "Dificultad para establecer límites saludables",
          "Orgullo encubierto: creer que sabe mejor que otros lo que necesitan"
        ],
        en_trabajo: "El Tipo 2 es el alma del equipo. Crea vínculos, sostiene emocionalmente a sus compañeros y tiene un radar exquisito para el clima organizacional. Brilla en roles de RRHH, coaching, atención al cliente, docencia y liderazgo empático. Su reto es aprender a cuidarse sin sentir que es egoísta.",
        en_equipo: "Es el pegamento emocional del grupo. Apoya, contiene y celebra los logros ajenos. Puede volverse indispensable y luego resentirse si no es reconocido suficientemente.",
        camino_crecimiento: "La integración del Tipo 2 lleva al Tipo 4: encontrar su propia profundidad emocional, sus necesidades legítimas y su identidad más allá del servicio a otros.",
        niveles: {
          sano: "Generoso, altruista y con amor incondicional genuino por sí mismo y por los demás.",
          promedio: "Servicial pero expectante. Da con la condición implícita de ser reconocido y necesitado.",
          insano: "Manipulador y demandante. El resentimiento aflora cuando el sacrificio no es valorado."
        }
      },

      3: {
        nombre: "El Triunfador",
        subtitulo: "El tipo adaptable y orientado al éxito",
        descripcion: "Las personas del Tipo 3 son enérgicas, ambiciosas y naturalmente orientadas al logro. Tienen una capacidad innata para adaptarse al entorno y proyectar la imagen que necesitan para alcanzar sus objetivos. Son los campeones del rendimiento y la eficiencia.",
        color: "#e2b808",
        colorAlt: "#b88917",
        icono: "🏆",
        emocionBasica: "Decepción (vanidad)",
        motivacionProfunda: "Ser valioso y admirado; destacar y ser exitoso",
        miedoProfundo: "Ser un fracasado o ser percibido como incompetente o sin valor",
        deseoBasico: "Sentirse valioso y aceptado",
        pecadoCapital: "Vanidad / Deceit",
        virtud: "Autenticidad",
        fortalezas: [
          "Altamente eficiente y orientado a resultados",
          "Capacidad natural de liderazgo y motivación",
          "Adaptable y carismático",
          "Enfocado en metas y estrategias",
          "Proyecta confianza y competencia",
          "Excelente comunicador en contextos profesionales"
        ],
        areas_desarrollo: [
          "Confusión entre la imagen y la identidad real",
          "Dificultad para conectar con la autenticidad profunda",
          "Workaholism como mecanismo de validación",
          "Competitividad que puede dañar vínculos",
          "Dificultad para la intimidad genuina"
        ],
        en_trabajo: "El Tipo 3 es el motor de cualquier organización. Sabe cómo alcanzar metas, inspire al equipo con su energía y entiende perfectamente las dinámicas de éxito. Es ideal para roles de liderazgo, ventas, management y cualquier posición donde los resultados sean visibles. Su desafío es aprender que el ser vale más que el hacer.",
        en_equipo: "Eleva la productividad y el estándar de desempeño. Puede competir cuando debería colaborar. Es un generador natural de motivación cuando aprende a liderar desde la autenticidad.",
        camino_crecimiento: "La integración del Tipo 3 pasa por el Tipo 6: aprender a confiar en el proceso sin necesitar el reconocimiento inmediato, valorar la lealtad y la profundidad sobre el brillo superficial.",
        niveles: {
          sano: "Auténtico, modelo inspirador que logra grandes cosas desde su verdad interior.",
          promedio: "Orientado a la imagen. Trabaja para ser admirado más que para ser genuino.",
          insano: "Engañoso y manipulador. Capaz de falsificar logros o identidad para mantener la imagen."
        }
      },

      4: {
        nombre: "El Individualista",
        subtitulo: "El tipo romántico e introspectivo",
        descripcion: "Las personas del Tipo 4 poseen una riqueza emocional y una profundidad interior excepcionales. Son sensibles, auténticos y están constantemente en búsqueda de identidad y significado. Su mundo interno es vasto y complejo, y su mayor don es transformar el dolor en belleza.",
        color: "#47278c",
        colorAlt: "#280640",
        icono: "🎭",
        emocionBasica: "Envidia",
        motivacionProfunda: "Encontrar su identidad única y sentido de significado personal",
        miedoProfundo: "No tener identidad o significado personal; ser ordinario o defectuoso",
        deseoBasico: "Ser auténtico y encontrar su sentido de identidad",
        pecadoCapital: "Envidia",
        virtud: "Ecuanimidad",
        fortalezas: [
          "Profundidad emocional excepcional",
          "Creatividad e intuición artística",
          "Autenticidad y rechazo de la superficialidad",
          "Capacidad para transformar experiencias en significado",
          "Empatía con el sufrimiento ajeno",
          "Sensibilidad estética y simbólica"
        ],
        areas_desarrollo: [
          "Tendencia a la melancolía y el ensimismamiento",
          "Envidia que puede paralizar la acción",
          "Dificultad para valorar lo ordinario y cotidiano",
          "Altibajos emocionales intensos",
          "Sensación crónica de ser incomprendido"
        ],
        en_trabajo: "El Tipo 4 aporta originalidad, profundidad y creatividad a cualquier equipo. Sobresale en roles artísticos, terapéuticos, de diseño y en cualquier campo donde la visión única sea valorada. Su desafío es aprender a actuar incluso cuando el entorno no refleja su mundo interior.",
        en_equipo: "Aporta perspectivas únicas e innovadoras. Puede retirarse cuando no se siente comprendido. Necesita que sus emociones sean valoradas para dar lo mejor de sí.",
        camino_crecimiento: "La integración del Tipo 4 pasa por el Tipo 1: desarrollar disciplina y comprometerse con la acción concreta, dejando de esperar las condiciones perfectas para crear.",
        niveles: {
          sano: "Inspirado, creativo, capaz de renovarse y transformar sus experiencias en arte y significado.",
          promedio: "Introspectivo y melancólico. Se siente diferente y especial, pero también inferior.",
          insano: "Autodestructivo, alienado. La envidia y el resentimiento bloquean cualquier conexión real."
        }
      },

      5: {
        nombre: "El Investigador",
        subtitulo: "El tipo vehemente y cerebral",
        descripcion: "Las personas del Tipo 5 poseen una mente extraordinariamente aguda y una capacidad de análisis que pocas personas pueden igualar. Son observadores meticulosos que prefieren comprender el mundo antes de actuar en él. Su independencia intelectual es su mayor fortaleza.",
        color: "#342f1d",
        colorAlt: "#210d41",
        icono: "🔬",
        emocionBasica: "Avaricia (retención)",
        motivacionProfunda: "Ser capaz y competente; comprender el mundo",
        miedoProfundo: "Ser inútil, incompetente o incapaz",
        deseoBasico: "Ser competente y capaz de entender el mundo",
        pecadoCapital: "Avaricia / Retención",
        virtud: "Desapego",
        fortalezas: [
          "Mente analítica excepcional",
          "Capacidad de concentración profunda",
          "Independencia y objetividad",
          "Innovador y visionario en su campo",
          "Meticuloso y preciso",
          "Perspicaz e intuitivo en el análisis"
        ],
        areas_desarrollo: [
          "Tendencia al aislamiento y la desconexión social",
          "Dificultad para pasar del análisis a la acción",
          "Gestión de recursos emocionales como si fueran escasos",
          "Dificultad para la intimidad y el contacto emocional",
          "Puede parecer frío o inaccesible"
        ],
        en_trabajo: "El Tipo 5 es el experto por excelencia. Su análisis profundo, su capacidad de síntesis y su objetividad lo hacen invaluable en roles de investigación, estrategia, tecnología, consultoría técnica y cualquier área que requiera conocimiento profundo. Necesita autonomía y espacio para pensar.",
        en_equipo: "Aporta rigor, profundidad y perspectivas que otros no ven. Prefiere roles con límites claros. No disfruta de dinámicas muy emocionales o de trabajo excesivamente colaborativo.",
        camino_crecimiento: "La integración del Tipo 5 pasa por el Tipo 8: aprender a actuar con confianza desde el conocimiento que ya posee, sin esperar tener todas las respuestas antes de moverse.",
        niveles: {
          sano: "Pionero visionario, capaz de ver el mundo de un modo completamente nuevo y compartirlo.",
          promedio: "Acumula conocimiento pero se retira del mundo. Teme el compromiso emocional.",
          insano: "Aislado, nihilista. El desapego se convierte en desconexión total de la realidad."
        }
      },

      6: {
        nombre: "El Leal",
        subtitulo: "El tipo comprometido y orientado a la seguridad",
        descripcion: "Las personas del Tipo 6 son el corazón de cualquier comunidad. Son comprometidas, leales y confiables hasta en las circunstancias más difíciles. Tienen una aguda capacidad para prever problemas y su sentido de responsabilidad es profundo.",
        color: "#6e3eab",
        colorAlt: "#280640",
        icono: "🛡️",
        emocionBasica: "Miedo / Ansiedad",
        motivacionProfunda: "Tener seguridad, apoyo y certeza; sentir que pueden confiar",
        miedoProfundo: "No tener apoyo o guía; quedar desamparado",
        deseoBasico: "Tener seguridad y apoyo",
        pecadoCapital: "Cobardía / Miedo",
        virtud: "Coraje",
        fortalezas: [
          "Extraordinariamente leal y comprometido",
          "Perspicaz para anticipar riesgos",
          "Responsable y confiable",
          "Defensor natural de los débiles",
          "Trabaja bien bajo estructuras claras",
          "Construye comunidad y pertenencia"
        ],
        areas_desarrollo: [
          "Ansiedad anticipatoria que puede paralizar",
          "Dificultad para confiar en su propio criterio",
          "Ambivalencia ante la autoridad (obedece y desafía)",
          "Proyección de sus miedos en el exterior",
          "Tendencia a buscar señales de peligro donde no las hay"
        ],
        en_trabajo: "El Tipo 6 es el pilar de confianza del equipo. Anticipa problemas antes de que ocurran, cumple lo que promete y construye relaciones de largo plazo. Sobresale en gestión de riesgos, RRHH, roles de coordinación y cualquier entorno donde la confiabilidad sea central.",
        en_equipo: "Garantiza la cohesión y la confianza del grupo. Necesita un liderazgo claro y consistente. Es el que pregunta lo que nadie se anima a preguntar y anticipa los obstáculos.",
        camino_crecimiento: "La integración del Tipo 6 pasa por el Tipo 9: encontrar paz interna y confianza en el fluir de la vida, sin necesitar certezas externas para actuar.",
        niveles: {
          sano: "Estable, valiente y comprometido. Apoya a los demás desde la confianza genuina.",
          promedio: "Ansioso y dubitativo. Oscila entre la obediencia y el desafío a la autoridad.",
          insano: "Paranoico y autodestructivo. El miedo toma el control de todas las decisiones."
        }
      },

      7: {
        nombre: "El Entusiasta",
        subtitulo: "El tipo productivo y ajetreado",
        descripcion: "Las personas del Tipo 7 traen alegría, energía y posibilidades a todo lo que tocan. Son optimistas irremediables que ven oportunidades donde otros ven problemas. Su vitalidad es contagiosa y su capacidad para imaginar futuros brillantes es un don extraordinario.",
        color: "#e2b808",
        colorAlt: "#b88917",
        icono: "✨",
        emocionBasica: "Gula / Ansiedad encubierta",
        motivacionProfunda: "Ser feliz y estar satisfecho; tener todo lo que necesitan",
        miedoProfundo: "Ser privado, estar atrapado en el dolor o estar limitado",
        deseoBasico: "Estar satisfecho y contento; tener sus necesidades cubiertas",
        pecadoCapital: "Gula",
        virtud: "Sobriedad",
        fortalezas: [
          "Optimismo genuino y contagioso",
          "Creatividad e innovación constante",
          "Versatilidad y adaptabilidad",
          "Capacidad para conectar ideas aparentemente dispares",
          "Entusiasmo que motiva a los demás",
          "Sentido del humor e ingenio"
        ],
        areas_desarrollo: [
          "Dificultad para sostener el compromiso a largo plazo",
          "Evitación del dolor y la profundidad emocional",
          "Dispersión: demasiados proyectos simultáneos",
          "Impulsividad en las decisiones",
          "Dificultad para estar presente cuando las cosas se ponen difíciles"
        ],
        en_trabajo: "El Tipo 7 es el generador de ideas y el motor de la innovación. Aporta energía, creatividad y visión estratégica. Sobresale en emprendimiento, marketing, innovación, roles creativos y cualquier entorno dinámico. Su reto es aprender a profundizar y sostener los proyectos hasta su culminación.",
        en_equipo: "Genera entusiasmo y eleva el ánimo del grupo. Puede perder el interés cuando la tarea se vuelve rutinaria. Es el que siempre tiene una nueva idea y el que hace que trabajar sea divertido.",
        camino_crecimiento: "La integración del Tipo 7 pasa por el Tipo 5: aprender a profundizar, a concentrarse en una sola cosa y a encontrar riqueza en la profundidad más que en la amplitud.",
        niveles: {
          sano: "Alegre, agradecido y muy capaz. Sus dones se focalizan en objetivos verdaderamente significativos.",
          promedio: "Disperso y hiperactivo. Busca la estimulación constante para evitar el vacío interior.",
          insano: "Compulsivo y escapista. La ansiedad subyacente explota ante cualquier límite."
        }
      },

      8: {
        nombre: "El Desafiador",
        subtitulo: "El tipo poderoso y dominante",
        descripcion: "Las personas del Tipo 8 son fuerzas de la naturaleza: directas, poderosas y comprometidas con la justicia. Tienen una capacidad extraordinaria para tomar decisiones difíciles y mover montañas cuando algo les importa. Su fuerza es un don al servicio de los demás cuando está bien canalizado.",
        color: "#280640",
        colorAlt: "#210d41",
        icono: "⚡",
        emocionBasica: "Lujuria / Exceso",
        motivacionProfunda: "Ser autosuficiente y en control de su vida; proteger a los vulnerables",
        miedoProfundo: "Ser controlado, dañado o violado por otros",
        deseoBasico: "Protegerse y determinar su propio curso de acción",
        pecadoCapital: "Lujuria / Exceso",
        virtud: "Inocencia",
        fortalezas: [
          "Liderazgo natural y poderoso",
          "Valentía y determinación",
          "Protector nato de los vulnerables",
          "Decisiones rápidas y contundentes",
          "Resistencia y capacidad de sobreponerse",
          "Honestidad directa y sin rodeos"
        ],
        areas_desarrollo: [
          "Dificultad para mostrar vulnerabilidad",
          "Tendencia a intimidar sin darse cuenta",
          "Exceso de control que puede alienar a otros",
          "Dificultad para la intimidad emocional profunda",
          "Puede ser inflexible ante posiciones que percibe como débiles"
        ],
        en_trabajo: "El Tipo 8 es el líder natural que mueve organizaciones. Toma decisiones difíciles con firmeza, protege a su equipo y no se detiene ante los obstáculos. Es ideal para roles de alta dirección, emprendimiento, negociación y cualquier contexto donde se requiera audacia y visión.",
        en_equipo: "Define la dirección y despeja los obstáculos. Genera respeto y a veces temor. Cuando aprende a escuchar, su liderazgo se vuelve transformador. Es el que defiende al equipo ante el exterior.",
        camino_crecimiento: "La integración del Tipo 8 pasa por el Tipo 2: aprender a dar desde la generosidad genuina, a mostrar la ternura que protege celosamente y a liderar desde el amor más que desde el control.",
        niveles: {
          sano: "Poderoso y magnánimo. Su fuerza está al servicio de los demás de manera heroica.",
          promedio: "Dominante y controlador. Usa el poder para evitar sentirse vulnerable.",
          insano: "Destructivo y despiadado. El miedo a ser controlado lo lleva a controlar brutalmente."
        }
      },

      9: {
        nombre: "El Pacificador",
        subtitulo: "El tipo acomodadizo y humilde",
        descripcion: "Las personas del Tipo 9 tienen el don extraordinario de ver múltiples perspectivas y encontrar el valor en cada una de ellas. Son el centro de gravedad de cualquier grupo: su presencia calma, su perspectiva integra y su paciencia es casi ilimitada. Cuando despiertan su propio poder, son agentes de paz transformadora.",
        color: "#47278c",
        colorAlt: "#6e3eab",
        icono: "🌿",
        emocionBasica: "Pereza / Inercia",
        motivacionProfunda: "Tener paz interior y exterior; evitar el conflicto y la tensión",
        miedoProfundo: "Perder la conexión con los demás; fragmentación",
        deseoBasico: "Mantener la paz de mente interna",
        pecadoCapital: "Pereza / Inercia",
        virtud: "Acción",
        fortalezas: [
          "Capacidad excepcional para mediar y unir",
          "Perspectiva amplia e integradora",
          "Paciencia y estabilidad emocional",
          "Empático y genuinamente receptivo",
          "No reactivo: puede mantener la calma bajo presión",
          "Aceptación natural de las diferencias"
        ],
        areas_desarrollo: [
          "Dificultad para reconocer y afirmar sus propias necesidades",
          "Tendencia a la procrastinación y la inercia",
          "Evitación del conflicto incluso cuando es necesario",
          "Dificultad para tomar posición y mantenerla",
          "Pérdida de sí mismo al fusionarse con el entorno"
        ],
        en_trabajo: "El Tipo 9 es el mediador y el integrador por excelencia. Su capacidad para ver todas las perspectivas lo hace invaluable en gestión de conflictos, trabajo colaborativo, recursos humanos y roles de coordinación. Su reto es aprender a afirmarse y a actuar con mayor decisión.",
        en_equipo: "Crea armonía y facilita la cooperación. Puede postergar decisiones difíciles. Cuando está comprometido de verdad, su estabilidad es el ancla que el equipo necesita.",
        camino_crecimiento: "La integración del Tipo 9 pasa por el Tipo 3: aprender a comprometerse con metas propias, a actuar con energía y a permitirse sobresalir sin sentir que esto rompe la armonía.",
        niveles: {
          sano: "Indómito e integrador. Capaz de unir a personas y solucionar conflictos profundos.",
          promedio: "Complaciente y difuso. Se pierde en los deseos y perspectivas ajenas.",
          insano: "Disociado y apático. La negación del conflicto se convierte en anulación total de sí mismo."
        }
      }
    },

    // Nombres de las alas
    alaDescripcion: (base, ala) => {
      const nombres = {
        1: "Reformador", 2: "Ayudador", 3: "Triunfador", 4: "Individualista",
        5: "Investigador", 6: "Leal", 7: "Entusiasta", 8: "Desafiador", 9: "Pacificador"
      };
      return `${base}w${ala} — Ala ${nombres[ala]}`;
    }
  };

})();
