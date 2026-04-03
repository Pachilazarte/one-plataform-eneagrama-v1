    (function () {

        /* ══════════════════════════════════════════════════════════
        FONDO — estrellas sutiles, fieles a la imagen original
        Pocas estrellas, sin exagerar, parpadeo lento
        ══════════════════════════════════════════════════════════ */
        (function initStars() {
            var canvas = document.getElementById('starsCanvas');
            if (!canvas) return;
            var ctx = canvas.getContext('2d');

            function resize() {
                canvas.width  = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            // Estrellas normales — pocas, sutiles
            var STAR_COUNT = 120;
            var stars = [];
            for (var i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x:     Math.random(),
                    y:     Math.random(),
                    r:     Math.random() * 1.1 + 0.15,
                    a:     Math.random() * 0.45 + 0.12,
                    phase: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.28 + 0.08,
                    glow:  Math.random() < 0.08
                });
            }

            // Destellos — muy pocos, como en la foto
            var FLARE_COUNT = 5;
            var flares = [];
            for (var j = 0; j < FLARE_COUNT; j++) {
                flares.push({
                    x:     Math.random(),
                    y:     Math.random(),
                    r:     Math.random() * 1.2 + 0.9,
                    a:     Math.random() * 0.35 + 0.25,
                    phase: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.15 + 0.06
                });
            }

            function draw(t) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var W = canvas.width, H = canvas.height;

                for (var si = 0; si < stars.length; si++) {
                    var s  = stars[si];
                    var al = s.a * (0.75 + 0.25 * Math.sin(t * s.speed + s.phase));
                    ctx.beginPath();
                    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,' + al.toFixed(3) + ')';
                    ctx.fill();
                    if (s.glow) {
                        var g = ctx.createRadialGradient(s.x*W, s.y*H, 0, s.x*W, s.y*H, s.r * 4.5);
                        g.addColorStop(0, 'rgba(210,220,255,' + (al * 0.4).toFixed(3) + ')');
                        g.addColorStop(1, 'rgba(210,220,255,0)');
                        ctx.beginPath();
                        ctx.arc(s.x * W, s.y * H, s.r * 4.5, 0, Math.PI * 2);
                        ctx.fillStyle = g;
                        ctx.fill();
                    }
                }

                for (var fi = 0; fi < flares.length; fi++) {
                    var f  = flares[fi];
                    var fc = f.a * (0.65 + 0.35 * Math.sin(t * f.speed + f.phase));
                    var cx = f.x * W, cy = f.y * H;
                    var len = f.r * 7;

                    ctx.beginPath();
                    ctx.arc(cx, cy, f.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,' + fc.toFixed(3) + ')';
                    ctx.fill();

                    var fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, f.r * 6);
                    fg.addColorStop(0, 'rgba(200,210,255,' + (fc * 0.38).toFixed(3) + ')');
                    fg.addColorStop(1, 'rgba(200,210,255,0)');
                    ctx.beginPath();
                    ctx.arc(cx, cy, f.r * 6, 0, Math.PI * 2);
                    ctx.fillStyle = fg;
                    ctx.fill();

                    ctx.save();
                    ctx.globalAlpha  = fc * 0.38;
                    ctx.strokeStyle  = 'rgba(255,255,255,0.65)';
                    ctx.lineWidth    = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy);
                    ctx.moveTo(cx, cy - len); ctx.lineTo(cx, cy + len);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            var last = 0;
            function animate(ts) {
                var t = ts / 1000;
                if (t - last > 0.05) { draw(t); last = t; }
                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        })();

        /* ══════════════════════════════════════════════════════════
        CONFIG — NO TOCAR
        ══════════════════════════════════════════════════════════ */
        var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTG4ijRmyn_RdN88lGAudFiXF0_8A78GukRfvCCncO5S7G5wLe938iqveW4EMG1ZAS/exec';
        var PAGE_LABELS = ['PI','PII','PIII','PIV','PV','PVI','PVII','PVIII','PIX','PX','PXI','PXII'];

        var TYPE_NAMES = [null,
            'Tipo 1: El Reformador','Tipo 2: El Ayudador','Tipo 3: El Triunfador',
            'Tipo 4: El Individualista','Tipo 5: El Investigador','Tipo 6: El Leal',
            'Tipo 7: El Entusiasta','Tipo 8: El Desafiante','Tipo 9: El Pacificador'
        ];

        /* ══════════════════════════════════════════════════════════
        PREGUNTAS — corregidas (ortografía + D. Milano)
        ty: NUNCA MODIFICADO
        ══════════════════════════════════════════════════════════ */
        var QUESTIONS = [
            {t:"¿Con qué frecuencia sentís la necesidad de corregir errores o mejorar las cosas a tu alrededor, incluso cuando nadie te lo ha pedido?", ty:1},
            {t:"Tiendes a anticipar las necesidades de los demás antes de que te las expresen, sintiendo satisfacción al ayudarlos?", ty:2},
            {t:"¿Cuán importante es para ti proyectar una imagen de éxito y logro en tu entorno profesional y social?", ty:3},
            {t:"Sentís que hay algo único y diferente en vos que te distingue de las demás personas?", ty:4},
            {t:"Preferís observar y analizar las situaciones antes de participar activamente en ellas?", ty:5},
            {t:"Te encontrás frecuentemente anticipando posibles problemas o escenarios negativos antes de tomar decisiones?", ty:6},
            {t:"Solés tener múltiples planes e ideas emocionantes, sintiendo inquietud cuando la rutina se vuelve monótona?", ty:7},
            {t:"Te resulta natural tomar el control de las situaciones y defender tus puntos de vista con firmeza?", ty:8},
            {t:"Preferís mantener la armonía y evitar conflictos, incluso si eso significa postergar tus propias necesidades?", ty:9},
            {t:"Te resulta difícil relajarte cuando sabés que hay tareas pendientes o cosas que podrían hacerse mejor?", ty:1},
            {t:"Sentís incomodidad o frustración cuando tus esfuerzos por ayudar a otros no son reconocidos o valorados?", ty:2},
            {t:"Adaptás tu comportamiento o presentación según el contexto para causar una mejor impresión?", ty:3},
            {t:"Experimentás emociones intensas que parecen más profundas que las de quienes te rodean?", ty:4},
            {t:"Necesitás tiempo a solas para recargar energías después de interacciones sociales prolongadas?", ty:5},
            {t:"Buscás constantemente respaldo o confirmación antes de comprometerte con decisiones importantes?", ty:6},
            {t:"Te cuesta permanecer enfocado en una sola actividad cuando surgen nuevas oportunidades interesantes?", ty:7},
            {t:"Valorás la honestidad directa y te incomoda cuando las personas son evasivas o indecisas?", ty:8},
            {t:"Te cuesta expresar tus opiniones cuando difieren de las del grupo o podrían generar tensión?", ty:9},
            {t:"Tenés un crítico interno que constantemente evalúa si estás haciendo las cosas de manera correcta?", ty:1},
            {t:"Te sentís más valorado cuando estás siendo útil o indispensable para alguien?", ty:2},
            {t:"Medís tu autoestima en función de tus logros y el reconocimiento que recibís?", ty:3},
            {t:"Sentís nostalgia por experiencias o conexiones que parecen más auténticas o significativas que tu realidad actual?", ty:4},
            {t:"Preferís acumular conocimiento y recursos antes de actuar, para sentirte preparado?", ty:5},
            {t:"Cuestionás las intenciones de los demás hasta que demuestran ser confiables?", ty:6},
            {t:"Evitás conscientemente situaciones o emociones que puedan resultar dolorosas o limitantes?", ty:7},
            {t:"Sentís la necesidad de proteger a quienes percibís como vulnerables o en desventaja?", ty:8},
            {t:"Postergás la toma de decisiones importantes o te distraés con tareas menos relevantes?", ty:9},
            {t:"Sentís resentimiento cuando otros no cumplen con los mismos estándares de responsabilidad que vos mantenés?", ty:1},
            {t:"Te resulta más fácil identificar las necesidades ajenas que reconocer las tuyas propias?", ty:2},
            {t:"Te sentís incómodo con el fracaso al punto de evitar situaciones donde podrías no destacar?", ty:3},
            {t:"Sentís que algo esencial falta en tu vida, incluso cuando las cosas van objetivamente bien?", ty:4},
            {t:"Te resulta agotador cuando otros demandan demasiado de tu tiempo o energía emocional?", ty:5},
            {t:"Sentís tensión entre confiar en figuras de autoridad y cuestionarlas al mismo tiempo?", ty:6},
            {t:"Mantenés múltiples opciones abiertas porque comprometerte con una sola te genera ansiedad?", ty:7},
            {t:"Te resulta difícil mostrar vulnerabilidad, prefiriendo proyectar fortaleza en todo momento?", ty:8},
            {t:"Adoptás las opiniones o preferencias de otros para mantener la paz, aunque no coincidan con las tuyas?", ty:9},
            {t:"Experimentás frustración cuando las reglas o procedimientos no se siguen adecuadamente?", ty:1},
            {t:"Sentís que das más en las relaciones de lo que recibís, pero te cuesta expresarlo directamente?", ty:2},
            {t:"Te enfocás intensamente en tus metas, a veces descuidando tu bienestar emocional o relaciones personales?", ty:3},
            {t:"Tendés a idealizar lo que no tenés mientras desvalorizás lo que está presente en tu vida?", ty:4},
            {t:"Necesitás tiempo para prepararte antes de expresar tus ideas en lugar de hacerlo espontáneamente?", ty:5},
            {t:"Tendés a planificar exhaustivamente para minimizar riesgos e imprevistos?", ty:6},
            {t:"Reencuadrás las experiencias negativas buscando el lado positivo rápidamente?", ty:7},
            {t:"Cuando hay un problema, preferís hablarlo de frente antes que dejarlo sin resolver?", ty:8},
            {t:"Te fusionás con las agendas de otros, perdiendo contacto con tus propias prioridades y deseos?", ty:9},
            {t:"Sentís que hay una forma correcta de hacer las cosas y te frustrás cuando no se respeta?", ty:1},
            {t:"Modificás tu comportamiento para ser querido o aceptado por las personas importantes en tu vida?", ty:2},
            {t:"Te resulta difícil desconectar del trabajo o pausar tu búsqueda de objetivos para simplemente estar?", ty:3},
            {t:"Sentís atracción por la belleza, el arte o experiencias que expresan profundidad emocional?", ty:4},
            {t:"Establecés límites claros en tu vida para proteger tu espacio personal y privacidad?", ty:5},
            {t:"Te cuesta confiar en tu propio juicio, buscando validación externa frecuentemente?", ty:6},
            {t:"Preferís mantener las conversaciones ligeras y optimistas, evitando temas pesados o dolorosos?", ty:7},
            {t:"Tenés poca paciencia con la debilidad o la victimización, tanto en vos como en otros?", ty:8},
            {t:"Encontrás difícil identificar qué es realmente importante para vos entre todas las demandas externas?", ty:9},
            {t:"Cuando terminás una tarea, solés revisarla varias veces para asegurarte de que no haya errores?", ty:1},
            {t:"Tendés a intuir cuando alguien necesita ayuda antes de que te lo pidan y actuar de inmediato?", ty:2},
            {t:"Te comparás frecuentemente con otros en términos de logros o éxito para medir tu progreso?", ty:3},
            {t:"Sentís que pocas personas realmente comprenden la profundidad de tus experiencias internas?", ty:4},
            {t:"Preferís entender completamente un tema antes de compartir tu opinión o involucrarte?", ty:5},
            {t:"Antes de tomar una decisión importante, necesitás consultar con personas de confianza para validarla?", ty:6},
            {t:"Cuando enfrentás situaciones difíciles, tu primer impulso es buscar algo positivo o una nueva salida?", ty:7},
            {t:"Cuando alguien es injusto o deshonesto, tendés a confrontarlo directamente sin rodeos?", ty:8},
            {t:"Cuando hay tensión entre personas cercanas, sentís la necesidad de mediar y restaurar la armonía?", ty:9},
            {t:"Sentís tensión interna cuando alguien hace algo de manera incorrecta o ineficiente frente a vos?", ty:1},
            {t:"Te cuesta decir que no cuando alguien te pide un favor, incluso cuando no tenés tiempo o energía?", ty:2},
            {t:"Tendés a presentar la mejor versión posible de vos mismo en situaciones sociales o profesionales?", ty:3},
            {t:"A veces te quedás atrapado en emociones difíciles más tiempo del que considerarías razonable?", ty:4},
            {t:"Tendés a retirarte emocionalmente cuando las situaciones se vuelven muy intensas o demandantes?", ty:5},
            {t:"Tendés a imaginar lo que podría salir mal en una situación incluso cuando todo parece estar bien?", ty:6},
            {t:"Te aburris rápidamente de las rutinas y buscás activamente nuevas experiencias o proyectos?", ty:7},
            {t:"Te incomoda profundamente depender de otros o necesitar apoyo externo para lograr tus objetivos?", ty:8},
            {t:"A veces te dás cuenta de que perdiste de vista tus propias necesidades por enfocarte en las de otros?", ty:9},
            {t:"Te resulta difícil disfrutar el tiempo libre cuando sentís que podrías estar siendo más productivo?", ty:1},
            {t:"Tu bienestar emocional depende en gran parte de que las personas cercanas estén bien?", ty:2},
            {t:"Te resulta difícil descansar genuinamente cuando sentís que otros avanzan más rápido que vos?", ty:3},
            {t:"Buscás crear experiencias que reflejen auténticamente quién sos sin importar la opinión ajena?", ty:4},
            {t:"Valorás tu independencia y autonomía por encima de la conexión social frecuente?", ty:5},
            {t:"La lealtad y la confianza son valores que definís como absolutamente no negociables para vos?", ty:6},
            {t:"Te resulta difícil comprometerte con una sola opción cuando hay muchas posibilidades disponibles?", ty:7},
            {t:"En situaciones de conflicto, tendés a intensificar la confrontación antes que buscar una salida?", ty:8},
            {t:"Te resulta difícil mantener impulso en proyectos propios cuando no hay presión externa que te mueva?", ty:9},
            {t:"Tenés estándares muy altos para vos mismo que a veces te resultan difíciles de sostener?", ty:1},
            {t:"Sentís que tu valor como persona está ligado a cuánto podés hacer por los demás?", ty:2},
            {t:"El reconocimiento público de tus logros te importa significativamente más que el proceso en sí?", ty:3},
            {t:"Sentís una tensión permanente entre querer pertenecer y necesitar ser diferente al mismo tiempo?", ty:4},
            {t:"Sentís que tus recursos emocionales son limitados y debés administrarlos cuidadosamente?", ty:5},
            {t:"Sentís incomodidad ante la ambigüedad o cuando no sabés exactamente qué esperar de una situación?", ty:6},
            {t:"Preferís mantener tu agenda flexible en lugar de planificar todo con anticipación detallada?", ty:7},
            {t:"Tendés a ocupar el espacio con seguridad y decisión cuando entrás a una situación nueva?", ty:8},
            {t:"Preferís encontrar puntos en común con las personas antes que enfatizar diferencias que separan?", ty:9}
        ];

        /* ══════════════════════════════════════════════════════════
        ESTADO
        ══════════════════════════════════════════════════════════ */
        var QperPage   = 6;
        var totalPages = Math.ceil(QUESTIONS.length / QperPage);
        var answers    = {};
        var pageTimes  = {};
        var pageStart  = null;
        var curPage    = 0;
        var userName   = '';
        var userLast   = '';
        var userEmail  = '';

        /* ══════════════════════════════════════════════════════
    CACHÉ DE RESPUESTAS — localStorage
    Si el usuario sale accidentalmente, no pierde el test
    TTL: 2 horas (suficiente para completar el test)
    ══════════════════════════════════════════════════════ */
    var TEST_CACHE_KEY = 'one_test_draft';
    var TEST_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 horas en ms

    function saveTestCache() {
        try {
            localStorage.setItem(TEST_CACHE_KEY, JSON.stringify({
                ts:        Date.now(),
                answers:   answers,
                pageTimes: pageTimes,
                curPage:   curPage,
                userName:  userName,
                userLast:  userLast,
                userEmail: userEmail
            }));
        } catch(e) {}
    }

    function loadTestCache() {
        try {
            var raw = localStorage.getItem(TEST_CACHE_KEY);
            if (!raw) return null;
            var p = JSON.parse(raw);
            if (Date.now() - p.ts > TEST_CACHE_TTL) {
                localStorage.removeItem(TEST_CACHE_KEY);
                return null;
            }
            return p;
        } catch(e) { return null; }
    }

    function clearTestCache() {
        try { localStorage.removeItem(TEST_CACHE_KEY); } catch(e) {}
    }

        /* ══════════════════════════════════════════════════════════
        HELPERS — NO TOCAR (lógica de envío intacta)
        ══════════════════════════════════════════════════════════ */
        function recordTime(pg) {
            if (pageStart !== null) {
                var s = Math.floor((Date.now() - pageStart) / 1000);
                pageTimes[pg] = (pageTimes[pg] || 0) + s;
                pageStart = null;
            }
        }
        function fmtTime(s) { return Math.floor(s/60)+'m '+(s%60)+'s'; }

        function buildRespuestas() {
            var parts = [];
            for (var pg = 0; pg < totalPages; pg++) {
                var s0  = pg * QperPage;
                var s1  = Math.min(s0 + QperPage, QUESTIONS.length);
                var lbl = PAGE_LABELS[pg] || ('P'+(pg+1));
                var qp  = [];
                for (var i = s0; i < s1; i++) qp.push((i+1)+';'+(answers[i]||0));
                parts.push('{'+lbl+': '+fmtTime(pageTimes[pg]||0)+' - '+qp.join(', ')+'}');
            }
            return parts.join(' ');
        }

        function getSession() {
            var ks = ['usuarioAdmin','emailAdmin','userName','userEmail','userRole',
                    'packStatus','isLoggedIn','fromUserboard','sessionStartTime',
                    'isThisFirstTime_Log_From_LiveServer'];
            var o = {};
            ks.forEach(function(k){ o[k]=sessionStorage.getItem(k)||''; });
            o.userName     = (o.userName     ||'').trim();
            o.usuarioAdmin = (o.usuarioAdmin ||'').trim();
            o.emailAdmin   = (o.emailAdmin   ||'').trim();
            return o;
        }

        /* ══════════════════════════════════════════════════════════
        UI HELPERS
        ══════════════════════════════════════════════════════════ */
        function updateHeaderProgress(pct) {
            var hp = document.getElementById('headerProgress');
            var hf = document.getElementById('headerProgressFill');
            var hpct = document.getElementById('headerProgressPct');
            if (!hp) return;
            hp.style.display = 'flex';
            if (hf) hf.style.width = pct + '%';
            if (hpct) hpct.textContent = pct + '%';
        }

        /* ══════════════════════════════════════════════════════════
        FLUJO DEL TEST
        ══════════════════════════════════════════════════════════ */
        function startTest() {
            userName  = (document.getElementById('userName').value     ||'').trim();
            userLast  = (document.getElementById('userLastName').value ||'').trim();
            userEmail = (document.getElementById('userEmail').value    ||'').trim();
            if (!userName || !userLast || !userEmail) {
                alert('Por favor, completá todos los campos');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
                alert('Por favor, ingresá un correo electrónico válido');
                return;
            }
            document.getElementById('registrationScreen').classList.add('hidden');
            document.getElementById('testScreen').classList.remove('hidden');
            showPage();
        }

        function showPage() {
            pageStart = Date.now();
            var s0  = curPage * QperPage;
            var ctr = document.getElementById('questionsContainer');
            ctr.innerHTML = '';

            for (var i = 0; i < QperPage && (s0+i) < QUESTIONS.length; i++) {
                var qi = s0 + i;
                var q  = QUESTIONS[qi];

                var card = document.createElement('div');
                card.className = 'question-card fade-up';
                card.style.animationDelay = (i * 0.055) + 's';
                if (answers[qi] !== undefined) card.classList.add('answered');

                var td = document.createElement('div');
                td.className   = 'question-text';
                td.textContent = q.t;
                card.appendChild(td);

                var sd = document.createElement('div');
                sd.className = 'scale-options';

                for (var v = 1; v <= 5; v++) {
                    var op = document.createElement('div');
                    op.className = 'scale-option';
                    var rb = document.createElement('input');
                    rb.type  = 'radio';
                    rb.id    = 'q'+qi+'v'+v;
                    rb.name  = 'q'+qi;
                    rb.value = v;
                    if (answers[qi] === v) rb.checked = true;
                    rb.addEventListener('change', (function(qii, vv, cardEl) {
                        return function() {
                            answers[qii] = vv;
                            cardEl.classList.add('answered');
                            checkDone();
                        };
                    })(qi, v, card));
                    var lb = document.createElement('label');
                    lb.htmlFor     = 'q'+qi+'v'+v;
                    lb.textContent = v;
                    op.appendChild(rb);
                    op.appendChild(lb);
                    sd.appendChild(op);
                }
                card.appendChild(sd);
                ctr.appendChild(card);
            }
            updateUI();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    function checkDone() {
        var s0 = curPage * QperPage;
        var ok = true;
        for (var i = s0; i < s0+QperPage && i < QUESTIONS.length; i++) {
            if (answers[i] === undefined) { ok = false; break; }
        }
        document.getElementById('nextBtn').disabled = !ok;
        saveTestCache(); // ← agregar esta línea
        }

        function updateUI() {
            // ✅ CORRECCIÓN: "Página" con tilde
            document.getElementById('pageInfo').textContent = 'Página '+(curPage+1)+' de '+totalPages;
            var done = Object.keys(answers).length;
            var pct  = Math.round(done / QUESTIONS.length * 100);
            var fill = document.getElementById('progressFill');
            var ppct = document.getElementById('progressPercent');
            if (fill) fill.style.width = pct+'%';
            if (ppct) ppct.textContent = pct+'%';
            updateHeaderProgress(pct);
            var prevBtn = document.getElementById('prevBtn');
            var nextBtn = document.getElementById('nextBtn');
            if (prevBtn) prevBtn.style.display = curPage > 0 ? 'inline-flex' : 'none';
            if (nextBtn) nextBtn.textContent = curPage === totalPages-1 ? 'Enviar datos →' : 'Siguiente →';
            checkDone();
        }

        function nextPage() {
            recordTime(curPage);
            if (curPage < totalPages-1) { curPage++; showPage(); }
            else { calcResults(); }
        }

        function prevPage() {
            recordTime(curPage);
            if (curPage > 0) { curPage--; showPage(); }
        }

        /* ══════════════════════════════════════════════════════════
        CÁLCULO Y ENVÍO — NO TOCAR
        ══════════════════════════════════════════════════════════ */
        function calcResults() {
            var scores = [0,0,0,0,0,0,0,0,0,0];
            QUESTIONS.forEach(function(q, i){ if(answers[i]) scores[q.ty]+=answers[i]; });
            var maxS=0, dom=1;
            for (var t=1;t<=9;t++) { if(scores[t]>maxS){maxS=scores[t];dom=t;} }
            showResults(dom, scores);
        }

        function showResults(dom, scores) {
                clearTestCache(); // ← limpiar borrador al completar el test
            var sess  = getSession();
            var now   = new Date();
            var fecha = now.toLocaleDateString('es-AR')+', '+now.toLocaleTimeString('es-AR');
            var total = 0;
            for (var i=1;i<=9;i++) total+=scores[i];
            var pct=[0,0,0,0,0,0,0,0,0,0];
            for (var t=1;t<=9;t++) pct[t]=total>0?Math.round((scores[t]/total)*100):0;
            var loginUser=(sess.userName||'').trim();
            var scoresObj={};
            for (var ts=1;ts<=9;ts++) scoresObj[ts]=scores[ts]||0;
            var payload={
                Nombre:userName, Apellido:userLast, Correo:userEmail,
                Fecha:fecha, Usuario_Admin:sess.usuarioAdmin||'',
                Email_Admin:sess.emailAdmin||'', User:loginUser, Username:loginUser,
                Respuestas:buildRespuestas(), Eneatipo:dom,
                EneatipoNombre:TYPE_NAMES[dom], Informe:TYPE_NAMES[dom],
                scores:scoresObj, percentages:pct
            };
            console.log('SESSION TEST:', sess);
            console.log('PAYLOAD FINAL:', payload);
            sessionStorage.setItem('eneagramaUserData', JSON.stringify(payload));
            sessionStorage.setItem('EneagramaUserData', JSON.stringify(payload));
            doSend(dom, scores, pct);
        }

function doSend(dom, scores, pct) {

            // ── Pantalla de carga ──────────────────────────────
            document.getElementById('testScreen').classList.add('hidden');
            document.getElementById('registrationScreen').classList.add('hidden');
            document.getElementById('resultScreen').classList.add('hidden');
            var loadingScreen = document.createElement('div');
            loadingScreen.id = 'sendingScreen';
            loadingScreen.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;font-family:Exo 2,sans-serif';
            loadingScreen.innerHTML =
                '<img src="../img/one-iconocolor.png" style="width:80px;height:80px;border-radius:50%;animation:spin 1.5s linear infinite" onerror="this.src=\'../img/one-icononegro.png\'">' +
                '<p style="color:#fff;font-size:1rem;font-weight:600;margin:0">Generando tu informe...</p>' +
                '<p style="color:#a4a8c0;font-size:0.8rem;margin:0">Por favor esperá unos segundos</p>' +
                '<style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
            document.body.appendChild(loadingScreen);
            // ──────────────────────────────────────────────────

            var sess  = getSession();
            var now   = new Date();
            var fecha = now.toLocaleString('es-AR',{
                day:'2-digit',month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false
            });
            var loginUser=(sess.userName||'').trim();
            var adminUser=(sess.usuarioAdmin||'').trim();
            var fila=[fecha,adminUser,sess.emailAdmin,loginUser,userName,userLast,userEmail,buildRespuestas()];
            var fd1=new URLSearchParams();
            fd1.append('data', JSON.stringify({nombreHoja:'Respuestas',fila:fila}));

            fetch(GOOGLE_SCRIPT_URL,{method:'POST',body:fd1})
                .then(function(r){return r.text();})
                .then(function(t){
                    var res1;
                    try{res1=JSON.parse(t);}catch(e){throw new Error(t);}
                    if(!res1||res1.success===false) throw new Error(res1.error||'Error paso 1');
                    var rowNum=res1.row;
                    var eid=res1.eneagrama_id||res1.Eneagrama_id||'';
                    sessionStorage.setItem('eneagrama_row',rowNum);
                    sessionStorage.setItem('eneagrama_id',eid);
                    sessionStorage.setItem('eneagrama_autoPDF','1');
                    var iframe=document.createElement('iframe');
                    iframe.style.display='none';
                    iframe.src='../Informe/index.html';
                    document.body.appendChild(iframe);
                    setTimeout(function(){try{document.body.removeChild(iframe);}catch(e){}},60000);
                    console.log('[Test] Fila guardada → row='+rowNum+' id='+eid);
                })
                .catch(function(e){console.error('Error guardando fila:',e);});

            // Mostrar resultado inmediatamente
setTimeout(function() {
    var sending = document.getElementById('sendingScreen');
    if (sending) sending.remove();
    document.getElementById('testScreen').classList.add('hidden');
    document.getElementById('registrationScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');
}, 8000); // 8 segundos — suficiente para que el PDF se genere y suba
        }

        /* ══════════════════════════════════════════════════════════
        REINICIO
        ══════════════════════════════════════════════════════════ */
    function restartTest() {
        clearTestCache(); // ← agregar esta línea
            curPage=0; answers={}; pageTimes={}; pageStart=null;
            userName=''; userLast=''; userEmail='';
            document.getElementById('userName').value='';
            document.getElementById('userLastName').value='';
            document.getElementById('userEmail').value='';
            var sm=document.getElementById('successMsg');
            if(sm) sm.classList.add('hidden');
            var hp=document.getElementById('headerProgress');
            if(hp) hp.style.display='none';
            document.getElementById('resultScreen').classList.add('hidden');
            document.getElementById('registrationScreen').classList.remove('hidden');
            window.scrollTo({top:0,behavior:'smooth'});
        }

        /* ══════════════════════════════════════════════════════════
        INIT
        ══════════════════════════════════════════════════════════ */
function init() {
        // ── Limpiar estado anterior ────────────────────────────
        var oldScreen = document.getElementById('sendingScreen');
        if (oldScreen) oldScreen.remove();
        sessionStorage.removeItem('eneagrama_row');
        sessionStorage.removeItem('eneagrama_id');
        sessionStorage.removeItem('eneagrama_autoPDF');
        // ── Restaurar borrador si existe ──────────────────────
        var draft = loadTestCache();
        if (draft && Object.keys(draft.answers).length > 0) {
            var contestadas = Object.keys(draft.answers).length;
            var confirmar = confirm(
                'Tenés ' + contestadas + ' respuestas guardadas de una sesión anterior.\n' +
                '¿Querés continuar desde donde dejaste?'
            );
            if (confirmar) {
                answers   = draft.answers;
                pageTimes = draft.pageTimes || {};
                curPage   = draft.curPage   || 0;
                userName  = draft.userName  || '';
                userLast  = draft.userLast  || '';
                userEmail = draft.userEmail || '';
                var elUN = document.getElementById('userName');
                var elUL = document.getElementById('userLastName');
                var elUE = document.getElementById('userEmail');
                if (elUN && userName)  elUN.value = userName;
                if (elUL && userLast)  elUL.value = userLast;
                if (elUE && userEmail) elUE.value = userEmail;
            } else {
                clearTestCache();
            }
        }

        // ── Listeners — null-check en todos para evitar crash
        //    cuando init() corre con el resultScreen visible
        var startBtn   = document.getElementById('startBtn');
        var prevBtn    = document.getElementById('prevBtn');
        var nextBtn    = document.getElementById('nextBtn');
        var restartBtn = document.getElementById('restartBtn');
        var backBtn    = document.getElementById('backPanelBtn');

        if (startBtn)   startBtn.addEventListener('click', startTest);
        if (prevBtn)    prevBtn.addEventListener('click', prevPage);
        if (nextBtn)    nextBtn.addEventListener('click', nextPage);
        if (restartBtn) restartBtn.addEventListener('click', restartTest);
        if (backBtn)    backBtn.addEventListener('click', function(){
            window.location.href = '../Userboard/Index.html';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.startTest  = startTest;
    window.prevPage   = prevPage;
    window.nextPage   = nextPage;
    window.restartTest = restartTest;

    })();