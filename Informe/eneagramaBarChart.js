/**
 * eneagramaBarChart.js
 * Genera el gráfico de barras con los 9 scores del Eneagrama.
 */

(function () {
  'use strict';

  window.renderEneagramaBarChart = function (containerId, scores, baseType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tipos = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const nombres = {
      1: 'Reformador', 2: 'Ayudador', 3: 'Triunfador',
      4: 'Individualista', 5: 'Investigador', 6: 'Leal',
      7: 'Entusiasta', 8: 'Desafiador', 9: 'Pacificador'
    };
    const colores = {
      1: '#6e3eab', 2: '#953a90', 3: '#e2b808',
      4: '#47278c', 5: '#342f1d', 6: '#6e3eab',
      7: '#e2b808', 8: '#280640', 9: '#47278c'
    };

    const W = 600;
    const H = 380;
    const barW = 46;
    const gap = 16;
    const startX = 40;
    const chartTop = 30;
    const chartBottom = H - 70;
    const chartH = chartBottom - chartTop;

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';

    // Grilla
    for (let i = 0; i <= 5; i++) {
      const val = i * 20;
      const y = chartBottom - (val / 100) * chartH;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', startX - 5); line.setAttribute('y1', y);
      line.setAttribute('x2', W - 10); line.setAttribute('y2', y);
      line.setAttribute('stroke', '#ffffff'); line.setAttribute('stroke-width', '0.5');
      line.setAttribute('opacity', i === 0 ? '0.4' : '0.12');
      svg.appendChild(line);

      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', startX - 8); lbl.setAttribute('y', y + 4);
      lbl.setAttribute('text-anchor', 'end'); lbl.setAttribute('font-size', '9');
      lbl.setAttribute('fill', '#c0c0c0'); lbl.setAttribute('font-family', 'Poppins, sans-serif');
      lbl.textContent = val;
      svg.appendChild(lbl);
    }

    // Barras
    tipos.forEach((t, idx) => {
      const val = scores[t] || 0;
      const x = startX + idx * (barW + gap);
      const bH = (val / 100) * chartH;
      const y = chartBottom - bH;
      const isBase = t === baseType;
      const color = colores[t];

      // Barra con gradiente inline
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x); rect.setAttribute('y', y);
      rect.setAttribute('width', barW); rect.setAttribute('height', bH);
      rect.setAttribute('fill', color);
      rect.setAttribute('rx', '5');
      rect.setAttribute('opacity', isBase ? '1' : '0.45');
      if (isBase) {
        // Glow effect simulado
        rect.setAttribute('style', `filter: drop-shadow(0 0 8px ${color}88)`);
      }
      svg.appendChild(rect);

      // Valor encima
      const valText = document.createElementNS(ns, 'text');
      valText.setAttribute('x', x + barW / 2); valText.setAttribute('y', y - 6);
      valText.setAttribute('text-anchor', 'middle');
      valText.setAttribute('font-size', isBase ? '14' : '11');
      valText.setAttribute('font-weight', '800');
      valText.setAttribute('fill', isBase ? '#e2b808' : '#ffffff');
      valText.setAttribute('font-family', 'Poppins, sans-serif');
      valText.setAttribute('opacity', isBase ? '1' : '0.7');
      valText.textContent = val;
      svg.appendChild(valText);

      // Número del tipo
      const numText = document.createElementNS(ns, 'text');
      numText.setAttribute('x', x + barW / 2); numText.setAttribute('y', chartBottom + 18);
      numText.setAttribute('text-anchor', 'middle');
      numText.setAttribute('font-size', isBase ? '16' : '13');
      numText.setAttribute('font-weight', '800');
      numText.setAttribute('fill', isBase ? '#e2b808' : '#ffffff');
      numText.setAttribute('font-family', 'Poppins, sans-serif');
      numText.setAttribute('opacity', isBase ? '1' : '0.5');
      numText.textContent = t;
      svg.appendChild(numText);

      // Nombre del tipo (dos líneas)
      const name = nombres[t];
      const words = name.split(' ');
      const line1 = words[0] || '';

      const nameText = document.createElementNS(ns, 'text');
      nameText.setAttribute('x', x + barW / 2); nameText.setAttribute('y', chartBottom + 34);
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size', '7.5');
      nameText.setAttribute('fill', isBase ? '#e2b808' : '#c0c0c0');
      nameText.setAttribute('font-family', 'Poppins, sans-serif');
      nameText.setAttribute('opacity', isBase ? '0.9' : '0.4');
      nameText.textContent = line1;
      svg.appendChild(nameText);

      // Indicador base
      if (isBase) {
        const star = document.createElementNS(ns, 'text');
        star.setAttribute('x', x + barW / 2); star.setAttribute('y', chartBottom + 50);
        star.setAttribute('text-anchor', 'middle');
        star.setAttribute('font-size', '10');
        star.setAttribute('fill', '#e2b808');
        star.textContent = '▲';
        svg.appendChild(star);
      }
    });

    container.innerHTML = '';
    container.appendChild(svg);
  };

})();
