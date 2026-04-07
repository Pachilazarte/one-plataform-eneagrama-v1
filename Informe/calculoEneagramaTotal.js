(function () {
  'use strict';

  // Mapeo real de cada pregunta 1-90 a su tipo
  // Coincide exactamente con el array QUESTIONS del test
var QUESTIONS_TY = [
    1,1,1,1,1,1,1,1,1,1,
    2,2,2,2,2,2,2,2,2,2,
    3,3,3,3,3,3,3,3,3,3,
    4,4,4,4,4,4,4,4,4,4,
    5,5,5,5,5,5,5,5,5,5,
    6,6,6,6,6,6,6,6,6,6,
    7,7,7,7,7,7,7,7,7,7,
    8,8,8,8,8,8,8,8,8,8,
    9,9,9,9,9,9,9,9,9,9
];

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
      var p    = pair.split(';');
      var qNum = parseInt(p[0], 10);
      var val  = parseInt(p[1], 10);
      if (qNum >= 1 && qNum <= 90 && val >= 1 && val <= 5) {
        answers[qNum - 1] = val;
      }
    });

    // 2. Sumar raw por tipo y contar preguntas respondidas por tipo
    var raw      = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
    var countQ   = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
    for (var i = 0; i < QUESTIONS_TY.length; i++) {
      var tipo = QUESTIONS_TY[i];
      if (answers[i] !== undefined) {
        raw[tipo]    += answers[i];
        countQ[tipo] += 1;
      }
    }

    // 3. Normalización absoluta por tipo
    // Todo 1 = 0%, Todo 5 = 100%
    // Fórmula: (raw - min) / (max - min) × 100
    // min = preguntas_respondidas × 1
    // max = preguntas_respondidas × 5
    var scores = {};
    var maxT   = 1;
    for (var t = 1; t <= 9; t++) {
      var n   = countQ[t];
      var min = n * 1;
      var max = n * 5;
      if (n === 0 || max === min) {
        scores[t] = 0;
      } else {
        scores[t] = Math.round(((raw[t] - min) / (max - min)) * 100);
        if (scores[t] < 0)   scores[t] = 0;
        if (scores[t] > 100) scores[t] = 100;
      }
      if (raw[t] > raw[maxT]) maxT = t;
    }

    // 4. Tipo base = el de mayor score
    var base = 1;
    for (var t4 = 2; t4 <= 9; t4++) {
      if (scores[t4] > scores[base]) base = t4;
    }

    // 5. Alas = los 2 tipos con mayor score (excluyendo base)
    var otrosTipos = [1,2,3,4,5,6,7,8,9].filter(function(t) { return t !== base; });
    otrosTipos.sort(function(a, b) { return scores[b] - scores[a]; });
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

  window.CalculoEneagrama = { calcularEneagrama: calcularEneagrama };
  window.EneagramaCalc = {
    calcularEneagrama: calcularEneagrama,
    parseRespuestas:   function(s) { return s; },
    calcularScores:    function(s) {
      var r = calcularEneagrama(s);
      return { normalized: r.scores, raw: r.rawScores };
    }
  };

})();