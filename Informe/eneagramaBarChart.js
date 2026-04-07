/**
 * eneagramaBarChart.js
 * Gráfico de barras Eneagrama — rediseño visual completo
 */

(function () {
  'use strict';

  window.renderEneagramaBarChart = function (containerId, scores, baseType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tipos   = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const nombres = {
      1:'Reformador', 2:'Ayudador',     3:'Triunfador',
      4:'Individualista', 5:'Investigador', 6:'Leal',
      7:'Entusiasta',  8:'Desafiador',  9:'Pacificador'
    };

    // Paleta por tipo — colores vibrantes distintos
    const PALETA = {
      1: { from: '#a855f7', to: '#7c3aed', glow: '#a855f7' },
      2: { from: '#ec4899', to: '#be185d', glow: '#ec4899' },
      3: { from: '#f59e0b', to: '#d97706', glow: '#f59e0b' },
      4: { from: '#6366f1', to: '#4338ca', glow: '#6366f1' },
      5: { from: '#14b8a6', to: '#0f766e', glow: '#14b8a6' },
      6: { from: '#84cc16', to: '#4d7c0f', glow: '#84cc16' },
      7: { from: '#fb923c', to: '#c2410c', glow: '#fb923c' },
      8: { from: '#f87171', to: '#b91c1c', glow: '#f87171' },
      9: { from: '#38bdf8', to: '#0369a1', glow: '#38bdf8' }
    };

    const W          = 640;
    const H          = 400;
    const barW       = 48;
    const gap        = 14;
    const startX     = 48;
    const chartTop   = 24;
    const chartBottom= H - 72;
    const chartH     = chartBottom - chartTop;

    const ns  = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.width  = '100%';
    svg.style.height = 'auto';

    // ── Defs: gradientes + filtros glow ─────────────────────────
    const defs = document.createElementNS(ns, 'defs');

    tipos.forEach(t => {
      const p   = PALETA[t];
      const grad = document.createElementNS(ns, 'linearGradient');
      grad.setAttribute('id',  `grad${t}`);
      grad.setAttribute('x1',  '0%');
      grad.setAttribute('y1',  '0%');
      grad.setAttribute('x2',  '0%');
      grad.setAttribute('y2',  '100%');
      const s1 = document.createElementNS(ns, 'stop');
      s1.setAttribute('offset', '0%');
      s1.setAttribute('stop-color', p.from);
      const s2 = document.createElementNS(ns, 'stop');
      s2.setAttribute('offset', '100%');
      s2.setAttribute('stop-color', p.to);
      grad.appendChild(s1);
      grad.appendChild(s2);
      defs.appendChild(grad);

      // Filtro glow para barra base
      const filter = document.createElementNS(ns, 'filter');
      filter.setAttribute('id', `glow${t}`);
      filter.setAttribute('x', '-30%');
      filter.setAttribute('y', '-30%');
      filter.setAttribute('width', '160%');
      filter.setAttribute('height', '160%');
      const feGaussian = document.createElementNS(ns, 'feGaussianBlur');
      feGaussian.setAttribute('stdDeviation', '4');
      feGaussian.setAttribute('result', 'blur');
      const feMerge = document.createElementNS(ns, 'feMerge');
      const n1 = document.createElementNS(ns, 'feMergeNode');
      n1.setAttribute('in', 'blur');
      const n2 = document.createElementNS(ns, 'feMergeNode');
      n2.setAttribute('in', 'SourceGraphic');
      feMerge.appendChild(n1);
      feMerge.appendChild(n2);
      filter.appendChild(feGaussian);
      filter.appendChild(feMerge);
      defs.appendChild(filter);
    });
    svg.appendChild(defs);

    // ── Fondo oscuro ──────────────────────────────────────────────
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width',  W);
    bg.setAttribute('height', H);
    bg.setAttribute('fill',   '#0f0f1a');
    bg.setAttribute('rx',     '12');
    svg.appendChild(bg);

    // ── Líneas de grilla ─────────────────────────────────────────
    [0, 25, 50, 75, 100].forEach(val => {
      const y = chartBottom - (val / 100) * chartH;

      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', startX - 4);
      line.setAttribute('y1', y);
      line.setAttribute('x2', W - 8);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', val === 0 ? '#ffffff' : '#334155');
      line.setAttribute('stroke-width', val === 0 ? '1' : '0.6');
      line.setAttribute('stroke-dasharray', val === 0 ? 'none' : '4,4');
      svg.appendChild(line);

      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', startX - 8);
      lbl.setAttribute('y', y + 4);
      lbl.setAttribute('text-anchor', 'end');
      lbl.setAttribute('font-size', '9');
      lbl.setAttribute('fill', '#64748b');
      lbl.setAttribute('font-family', 'Poppins, sans-serif');
      lbl.textContent = val + '%';
      svg.appendChild(lbl);
    });

    // ── Barras ───────────────────────────────────────────────────
    tipos.forEach((t, idx) => {
      const val    = Math.max(0, Math.min(100, scores[t] || 0));
      const x      = startX + idx * (barW + gap);
      const bH     = Math.max(2, (val / 100) * chartH);
      const y      = chartBottom - bH;
      const isBase = t === baseType;
      const p      = PALETA[t];

      // Barra glow (sombra de color) — solo para base
      if (isBase) {
        const glowRect = document.createElementNS(ns, 'rect');
        glowRect.setAttribute('x',      x - 3);
        glowRect.setAttribute('y',      y - 3);
        glowRect.setAttribute('width',  barW + 6);
        glowRect.setAttribute('height', bH + 6);
        glowRect.setAttribute('fill',   p.from);
        glowRect.setAttribute('rx',     '7');
        glowRect.setAttribute('opacity','0.25');
        glowRect.setAttribute('filter', `url(#glow${t})`);
        svg.appendChild(glowRect);
      }

      // Barra principal
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x',       x);
      rect.setAttribute('y',       y);
      rect.setAttribute('width',   barW);
      rect.setAttribute('height',  bH);
      rect.setAttribute('fill',    `url(#grad${t})`);
      rect.setAttribute('rx',      '6');
      rect.setAttribute('opacity', isBase ? '1' : '0.55');
      svg.appendChild(rect);

      // Brillo superior (highlight)
      const shine = document.createElementNS(ns, 'rect');
      shine.setAttribute('x',       x + 4);
      shine.setAttribute('y',       y + 3);
      shine.setAttribute('width',   barW - 8);
      shine.setAttribute('height',  Math.min(bH * 0.4, 20));
      shine.setAttribute('fill',    'rgba(255,255,255,0.12)');
      shine.setAttribute('rx',      '4');
      svg.appendChild(shine);

      // Valor encima de la barra
      if (val > 0) {
        const valBg = document.createElementNS(ns, 'rect');
        valBg.setAttribute('x',      x + barW/2 - 16);
        valBg.setAttribute('y',      y - 22);
        valBg.setAttribute('width',  32);
        valBg.setAttribute('height', 18);
        valBg.setAttribute('fill',   isBase ? p.from : 'rgba(255,255,255,0.08)');
        valBg.setAttribute('rx',     '4');
        svg.appendChild(valBg);

        const valText = document.createElementNS(ns, 'text');
        valText.setAttribute('x',           x + barW / 2);
        valText.setAttribute('y',           y - 8);
        valText.setAttribute('text-anchor', 'middle');
        valText.setAttribute('font-size',   isBase ? '11' : '10');
        valText.setAttribute('font-weight', '700');
        valText.setAttribute('fill',        isBase ? '#fff' : '#cbd5e1');
        valText.setAttribute('font-family', 'Poppins, sans-serif');
        valText.textContent = val + '%';
        svg.appendChild(valText);
      }

      // Número del tipo
      const numText = document.createElementNS(ns, 'text');
      numText.setAttribute('x',           x + barW / 2);
      numText.setAttribute('y',           chartBottom + 18);
      numText.setAttribute('text-anchor', 'middle');
      numText.setAttribute('font-size',   isBase ? '15' : '12');
      numText.setAttribute('font-weight', '800');
      numText.setAttribute('fill',        isBase ? p.from : '#94a3b8');
      numText.setAttribute('font-family', 'Poppins, sans-serif');
      numText.textContent = t;
      svg.appendChild(numText);

      // Nombre del tipo
      const nameText = document.createElementNS(ns, 'text');
      nameText.setAttribute('x',           x + barW / 2);
      nameText.setAttribute('y',           chartBottom + 32);
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size',   '7');
      nameText.setAttribute('fill',        isBase ? p.from : '#64748b');
      nameText.setAttribute('font-family', 'Poppins, sans-serif');
      nameText.textContent = nombres[t];
      svg.appendChild(nameText);

      // Indicador tipo base
      if (isBase) {
        const star = document.createElementNS(ns, 'text');
        star.setAttribute('x',           x + barW / 2);
        star.setAttribute('y',           chartBottom + 48);
        star.setAttribute('text-anchor', 'middle');
        star.setAttribute('font-size',   '9');
        star.setAttribute('fill',        p.from);
        star.textContent = '▲';
        svg.appendChild(star);
      }
    });

    container.innerHTML = '';
    container.appendChild(svg);
  };

})();