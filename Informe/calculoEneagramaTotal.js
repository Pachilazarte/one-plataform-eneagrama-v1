/**
 * calculoEneagramaTotal.js
 * UNICA fuente de calculo del Eneagrama para toda la plataforma.
 * Test, Informe web, Informe PDF y Manual PDF usan este mismo modulo.
 *
 * LOGICA CORRECTA (la del Manual PDF personalizado):
 *   - Mapea cada pregunta a su tipo real via QUESTIONS_TY
 *   - pct[t] = raw[t] / totalRaw * 100  ->  suma = 100%
 *   - Alas = los dos tipos ADYACENTES al tipo base en el circulo (no ranking global)
 */

(function () {
  'use strict';

  // Tipo real de cada pregunta 1-90: [1,2,3,4,5,6,7,8,9] x 10 rondas
  var QUESTIONS_TY = [
    1,2,3,4,5,6,7,8,9, 1,2,3,4,5,6,7,8,9, 1,2,3,4,5,6,7,8,9,
    1,2,3,4,5,6,7,8,9, 1,2,3,4,5,6,7,8,9, 1,2,3,4,5,6,7,8,9,
    1,2,3,4,5,6,7,8,9, 1,2,3,4,5,6,7,8,9, 1,2,3,4,5,6,7,8,9,
    1,2,3,4,5,6,7,8,9
  ];

  // Adyacentes en el circulo del Eneagrama (alas reales)
  var ADYACENTES = {
    1:[9,2], 2:[1,3], 3:[2,4], 4:[3,5], 5:[4,6],
    6:[5,7], 7:[6,8], 8:[7,9], 9:[8,1]
  };

  var FLECHAS = {
    1:{integracion:7,desintegracion:4}, 2:{integracion:4,desintegracion:8},
    3:{integracion:6,desintegracion:9}, 4:{integracion:1,desintegracion:2},
    5:{integracion:8,desintegracion:7}, 6:{integracion:9,desintegracion:3},
    7:{integracion:5,desintegracion:1}, 8:{integracion:2,desintegracion:5},
    9:{integracion:3,desintegracion:6}
  };

  function calcularEneagrama(rawString) {
    // 1. Parsear pares numeroPreg;valor
    var answers = {};
    var pairs = (rawString || '').match(/\d+;\d+/g) || [];
    pairs.forEach(function(pair) {
      var p = pair.split(';');
      var qNum = parseInt(p[0], 10);
      var val  = parseInt(p[1], 10);
      if (qNum >= 1 && qNum <= 90 && val >= 1 && val <= 5) {
        answers[qNum - 1] = val;
      }
    });

// 2. Sumar por tipo real
    var raw = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
    for (var i = 0; i < QUESTIONS_TY.length; i++) {
      if (answers[i] !== undefined) raw[QUESTIONS_TY[i]] += answers[i];
    }

    // 3. Porcentajes suma=100%
    var totalRaw = 0;
    for (var t = 1; t <= 9; t++) totalRaw += raw[t];
    var scores = {};
    var maxT = 1;
    for (var t2 = 1; t2 <= 9; t2++) {
      scores[t2] = totalRaw > 0 ? Math.round((raw[t2] / totalRaw) * 100) : 0;
      if (raw[t2] > raw[maxT]) maxT = t2;
    }
    var suma = 0;
    for (var t3 = 1; t3 <= 9; t3++) suma += scores[t3];
    if (suma !== 100 && totalRaw > 0) scores[maxT] += (100 - suma);

    // 4. Tipo base = mayor score final (para que coincida con lo visual)
    var base = 1;
    for (var t4 = 2; t4 <= 9; t4++) {
      if (scores[t4] > scores[base]) base = t4;
    }


// 5. Alas = los 2 tipos con mayor puntaje raw (excluyendo el tipo base)
var otrosTipos = [1,2,3,4,5,6,7,8,9].filter(function(t) { return t !== base; });
otrosTipos.sort(function(a, b) { return raw[b] - raw[a]; });
var ala1 = otrosTipos[0];
var ala2 = otrosTipos[1];

    return {
      base:           base,
      ala1:           ala1,
      ala2:           ala2,
      alaDominante:   ala1,
      alaScore1:      scores[ala1],
      alaScore2:      scores[ala2],
      integracion:    FLECHAS[base].integracion,
      desintegracion: FLECHAS[base].desintegracion,
      scores:         scores,
      rawScores:      raw
    };
  }

  // API publica
  window.CalculoEneagrama = { calcularEneagrama: calcularEneagrama };

  // Compatibilidad con EneagramaCalc (usado por Informe/index.html y pdfGenerator)
  window.EneagramaCalc = {
    calcularEneagrama:  calcularEneagrama,
    parseRespuestas:    function(s) { return s; },
    calcularScores:     function(s) { return { normalized: calcularEneagrama(s).scores, raw: calcularEneagrama(s).rawScores }; }
  };

})();