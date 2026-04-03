/**
 * eneagramaCalc.js - WRAPPER
 * Delega todo a calculoEneagramaTotal.js que debe cargarse antes.
 * No hace ningun calculo propio.
 */
(function () {
  'use strict';
  // calculoEneagramaTotal.js ya expuso window.EneagramaCalc y window.CalculoEneagrama
  // Este archivo existe solo para compatibilidad con el index.html del Informe
  if (!window.EneagramaCalc) {
    console.error('ERROR: calculoEneagramaTotal.js debe cargarse antes de eneagramaCalc.js');
  }
})();