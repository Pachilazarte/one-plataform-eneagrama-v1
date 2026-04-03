/**
 * eneagramaWheel.js
 * Genera el gráfico SVG del Eneagrama con los 9 tipos,
 * marcando el tipo base y las alas del evaluado.
 */

(function () {
  'use strict';

  /**
   * Renderiza la rueda del Eneagrama en el contenedor indicado.
   * @param {string} containerId - ID del elemento SVG o div contenedor
   * @param {object} resultado - { base, ala1, ala2, alaDominante, integracion, desintegracion, scores }
   */
  window.renderEneagramaWheel = function (containerId, resultado) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { base, ala1, ala2, integracion, desintegracion, scores } = resultado;

    const W = 500;
    const H = 500;
    const CX = W / 2;
    const CY = H / 2;
    const R_outer = 210;    // Radio exterior del anillo de segmentos
    const R_inner = 140;    // Radio interior del anillo
    const R_center = 125;   // Radio para los nodos del diagrama interno
    const R_label = 230;    // Radio para las etiquetas

    // Colores por eneatipo
    const TYPE_COLORS = {
      1: '#6e3eab', 2: '#953a90', 3: '#e2b808',
      4: '#47278c', 5: '#342f1d', 6: '#6e3eab',
      7: '#e2b808', 8: '#280640', 9: '#47278c'
    };

    const TYPE_NAMES = {
      1: 'Reformador', 2: 'Ayudador', 3: 'Triunfador',
      4: 'Individualista', 5: 'Investigador', 6: 'Leal',
      7: 'Entusiasta', 8: 'Desafiador', 9: 'Pacificador'
    };

    // Las líneas internas del Eneagrama: triángulo (3-6-9) + heptágono (1-4-2-8-5-7-1)
    const LINEAS_INTERNAS = [
      [3, 6], [6, 9], [9, 3],          // triángulo
      [1, 4], [4, 2], [2, 8], [8, 5], [5, 7], [7, 1]  // heptágono
    ];

    // Las flechas de integración/desintegración
    const FLECHAS_MAP = {
      1: { int: 7, des: 4 }, 2: { int: 4, des: 8 }, 3: { int: 6, des: 9 },
      4: { int: 1, des: 2 }, 5: { int: 8, des: 7 }, 6: { int: 9, des: 3 },
      7: { int: 5, des: 1 }, 8: { int: 2, des: 5 }, 9: { int: 3, des: 6 }
    };

    // Posición de cada tipo en el círculo (tipo 9 arriba, sentido horario)
    function typeToAngle(t) {
      // Tipo 9 = -90° (arriba), tipo 1 = -90 + 40 = -50°, etc.
      return -90 + (t - 9) * 40; // Cada tipo = 40° (360/9)
    }

    function polarToCart(angle, r) {
      const rad = (angle * Math.PI) / 180;
      return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
    }

    // Construir SVG
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('xmlns', ns);
    svg.style.width = '100%';
    svg.style.height = 'auto';

    // Definiciones (gradientes, filtros)
    const defs = document.createElementNS(ns, 'defs');

    // Filtro glow para el tipo base
    const filter = document.createElementNS(ns, 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-30%'); filter.setAttribute('y', '-30%');
    filter.setAttribute('width', '160%'); filter.setAttribute('height', '160%');
    const feGaussianBlur = document.createElementNS(ns, 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '4');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    const feMerge = document.createElementNS(ns, 'feMerge');
    const feMergeNode1 = document.createElementNS(ns, 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS(ns, 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // ── Fondo circular degradado ──
    const bgCircle = document.createElementNS(ns, 'circle');
    bgCircle.setAttribute('cx', CX); bgCircle.setAttribute('cy', CY);
    bgCircle.setAttribute('r', R_outer + 30);
    bgCircle.setAttribute('fill', '#0d0620');
    bgCircle.setAttribute('opacity', '0.6');
    svg.appendChild(bgCircle);

    // ── Segmentos del anillo exterior ──
    for (let t = 1; t <= 9; t++) {
      const startAngle = typeToAngle(t) - 20;
      const endAngle = typeToAngle(t) + 20;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1o = CX + R_outer * Math.cos(startRad);
      const y1o = CY + R_outer * Math.sin(startRad);
      const x2o = CX + R_outer * Math.cos(endRad);
      const y2o = CY + R_outer * Math.sin(endRad);
      const x1i = CX + R_inner * Math.cos(startRad);
      const y1i = CY + R_inner * Math.sin(startRad);
      const x2i = CX + R_inner * Math.cos(endRad);
      const y2i = CY + R_inner * Math.sin(endRad);

      const path = document.createElementNS(ns, 'path');
      const d = [
        `M ${x1i} ${y1i}`,
        `L ${x1o} ${y1o}`,
        `A ${R_outer} ${R_outer} 0 0 1 ${x2o} ${y2o}`,
        `L ${x2i} ${y2i}`,
        `A ${R_inner} ${R_inner} 0 0 0 ${x1i} ${y1i}`,
        'Z'
      ].join(' ');
      path.setAttribute('d', d);

      const isBase = t === base;
      const isAla = t === ala1 || t === ala2;

      if (isBase) {
        path.setAttribute('fill', TYPE_COLORS[t]);
        path.setAttribute('opacity', '1');
        path.setAttribute('filter', 'url(#glow)');
      } else if (isAla) {
        path.setAttribute('fill', TYPE_COLORS[t]);
        path.setAttribute('opacity', '0.55');
      } else {
        path.setAttribute('fill', '#ffffff');
        path.setAttribute('opacity', '0.08');
      }
      svg.appendChild(path);

      // Separadores entre segmentos
      const sep = document.createElementNS(ns, 'line');
      const sepPt = polarToCart(typeToAngle(t) + 20, R_outer);
      const sepPtIn = polarToCart(typeToAngle(t) + 20, R_inner);
      sep.setAttribute('x1', sepPtIn.x); sep.setAttribute('y1', sepPtIn.y);
      sep.setAttribute('x2', sepPt.x); sep.setAttribute('y2', sepPt.y);
      sep.setAttribute('stroke', '#280640'); sep.setAttribute('stroke-width', '2');
      svg.appendChild(sep);
    }

    // ── Círculo interior (borde) ──
    const innerBorder = document.createElementNS(ns, 'circle');
    innerBorder.setAttribute('cx', CX); innerBorder.setAttribute('cy', CY);
    innerBorder.setAttribute('r', R_inner);
    innerBorder.setAttribute('fill', 'none');
    innerBorder.setAttribute('stroke', '#6e3eab');
    innerBorder.setAttribute('stroke-width', '1');
    innerBorder.setAttribute('opacity', '0.3');
    svg.appendChild(innerBorder);

    // ── Líneas internas del Eneagrama ──
    LINEAS_INTERNAS.forEach(([a, b]) => {
      const ptA = polarToCart(typeToAngle(a), R_center);
      const ptB = polarToCart(typeToAngle(b), R_center);
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', ptA.x); line.setAttribute('y1', ptA.y);
      line.setAttribute('x2', ptB.x); line.setAttribute('y2', ptB.y);
      line.setAttribute('stroke', '#6e3eab');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('opacity', '0.35');
      svg.appendChild(line);
    });

    // ── Flechas de integración (verde) y desintegración (magenta) ──
    const arrFn = FLECHAS_MAP[base];

    function drawArrow(from, to, color, dasharray = '') {
      const ptA = polarToCart(typeToAngle(from), R_center);
      const ptB = polarToCart(typeToAngle(to), R_center);

      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', ptA.x); line.setAttribute('y1', ptA.y);
      line.setAttribute('x2', ptB.x); line.setAttribute('y2', ptB.y);
      line.setAttribute('stroke', color); line.setAttribute('stroke-width', '2.5');
      line.setAttribute('opacity', '0.9');
      if (dasharray) line.setAttribute('stroke-dasharray', dasharray);

      // Marcador de flecha manual
      const dx = ptB.x - ptA.x, dy = ptB.y - ptA.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / len, uy = dy / len;
      const perpx = -uy, perpy = ux;
      const arrowSize = 10;
      const tip = { x: ptB.x - ux * 8, y: ptB.y - uy * 8 };
      const left = { x: tip.x - ux * arrowSize + perpx * arrowSize * 0.4, y: tip.y - uy * arrowSize + perpy * arrowSize * 0.4 };
      const right = { x: tip.x - ux * arrowSize - perpx * arrowSize * 0.4, y: tip.y - uy * arrowSize - perpy * arrowSize * 0.4 };

      const arrowHead = document.createElementNS(ns, 'polygon');
      arrowHead.setAttribute('points', `${ptB.x},${ptB.y} ${left.x},${left.y} ${right.x},${right.y}`);
      arrowHead.setAttribute('fill', color);
      arrowHead.setAttribute('opacity', '0.9');

      svg.appendChild(line);
      svg.appendChild(arrowHead);
    }

    // Flecha integración (crece hacia)
    drawArrow(base, arrFn.int, '#10b981');
    // Flecha desintegración (estrés)
    drawArrow(base, arrFn.des, '#953a90', '6,3');

    // ── Nodos en los puntos del círculo interior ──
    for (let t = 1; t <= 9; t++) {
      const pt = polarToCart(typeToAngle(t), R_center);
      const isBase = t === base;
      const isAla = t === ala1 || t === ala2;

      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', pt.x); circle.setAttribute('cy', pt.y);
      circle.setAttribute('r', isBase ? 14 : (isAla ? 10 : 7));
      circle.setAttribute('fill', isBase ? TYPE_COLORS[t] : (isAla ? TYPE_COLORS[t] : '#1a0d30'));
      circle.setAttribute('stroke', isBase ? '#ffffff' : '#6e3eab');
      circle.setAttribute('stroke-width', isBase ? '2' : '1');
      circle.setAttribute('opacity', isBase ? '1' : (isAla ? '0.8' : '0.5'));
      if (isBase) circle.setAttribute('filter', 'url(#glow)');
      svg.appendChild(circle);

      const numText = document.createElementNS(ns, 'text');
      numText.setAttribute('x', pt.x); numText.setAttribute('y', pt.y + 5);
      numText.setAttribute('text-anchor', 'middle');
      numText.setAttribute('font-size', isBase ? '14' : (isAla ? '11' : '9'));
      numText.setAttribute('font-weight', 'bold');
      numText.setAttribute('fill', '#ffffff');
      numText.setAttribute('font-family', 'Poppins, sans-serif');
      numText.textContent = t;
      svg.appendChild(numText);
    }

    // ── Etiquetas del número en el anillo ──
    for (let t = 1; t <= 9; t++) {
      const angle = typeToAngle(t);
      const pt = polarToCart(angle, (R_outer + R_inner) / 2);
      const isBase = t === base;
      const isAla = t === ala1 || t === ala2;

      if (!isBase && !isAla) continue; // Solo mostrar etiqueta para base y alas

      const label = document.createElementNS(ns, 'text');
      label.setAttribute('x', pt.x); label.setAttribute('y', pt.y + 5);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', isBase ? '20' : '14');
      label.setAttribute('font-weight', '800');
      label.setAttribute('fill', '#ffffff');
      label.setAttribute('font-family', 'Poppins, sans-serif');
      label.textContent = t;
      svg.appendChild(label);
    }

    // ── Etiquetas de tipo (exterior) ──
    for (let t = 1; t <= 9; t++) {
      const angle = typeToAngle(t);
      const pt = polarToCart(angle, R_label);
      const isBase = t === base;
      const isAla = t === ala1 || t === ala2;

      // Número exterior
      const numLabel = document.createElementNS(ns, 'text');
      numLabel.setAttribute('x', pt.x); numLabel.setAttribute('y', pt.y - 8);
      numLabel.setAttribute('text-anchor', 'middle');
      numLabel.setAttribute('font-size', isBase ? '16' : '13');
      numLabel.setAttribute('font-weight', '800');
      numLabel.setAttribute('fill', isBase ? '#e2b808' : (isAla ? '#c0c0c0' : '#ffffff'));
      numLabel.setAttribute('opacity', isBase ? '1' : (isAla ? '0.8' : '0.4'));
      numLabel.setAttribute('font-family', 'Poppins, sans-serif');
      numLabel.textContent = t;
      svg.appendChild(numLabel);

      // Nombre del tipo
      const nameLabel = document.createElementNS(ns, 'text');
      nameLabel.setAttribute('x', pt.x); nameLabel.setAttribute('y', pt.y + 8);
      nameLabel.setAttribute('text-anchor', 'middle');
      nameLabel.setAttribute('font-size', isBase ? '9.5' : '8');
      nameLabel.setAttribute('font-weight', isBase ? '700' : '400');
      nameLabel.setAttribute('fill', isBase ? '#e2b808' : (isAla ? '#c0c0c0' : '#ffffff'));
      nameLabel.setAttribute('opacity', isBase ? '1' : (isAla ? '0.7' : '0.35'));
      nameLabel.setAttribute('font-family', 'Poppins, sans-serif');
      nameLabel.textContent = TYPE_NAMES[t];
      svg.appendChild(nameLabel);
    }

    // ── Centro: número del eneatipo ──
    const centerText = document.createElementNS(ns, 'text');
    centerText.setAttribute('x', CX); centerText.setAttribute('y', CY + 15);
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('font-size', '48');
    centerText.setAttribute('font-weight', '800');
    centerText.setAttribute('fill', '#e2b808');
    centerText.setAttribute('font-family', 'Poppins, sans-serif');
    centerText.setAttribute('filter', 'url(#glow)');
    centerText.textContent = base;
    svg.appendChild(centerText);

    const centerLabel = document.createElementNS(ns, 'text');
    centerLabel.setAttribute('x', CX); centerLabel.setAttribute('y', CY + 35);
    centerLabel.setAttribute('text-anchor', 'middle');
    centerLabel.setAttribute('font-size', '10');
    centerLabel.setAttribute('font-weight', '600');
    centerLabel.setAttribute('fill', '#c0c0c0');
    centerLabel.setAttribute('font-family', 'Poppins, sans-serif');
    centerLabel.textContent = 'Tipo Base';
    svg.appendChild(centerLabel);

    // Leyenda de flechas
    const legY = H - 25;
    // Verde = integración
    const l1 = document.createElementNS(ns, 'line');
    l1.setAttribute('x1', 20); l1.setAttribute('y1', legY);
    l1.setAttribute('x2', 50); l1.setAttribute('y2', legY);
    l1.setAttribute('stroke', '#10b981'); l1.setAttribute('stroke-width', '2.5');
    svg.appendChild(l1);
    const t1 = document.createElementNS(ns, 'text');
    t1.setAttribute('x', 55); t1.setAttribute('y', legY + 4);
    t1.setAttribute('font-size', '9'); t1.setAttribute('fill', '#10b981');
    t1.setAttribute('font-family', 'Poppins, sans-serif');
    t1.textContent = `→ ${integracion} (Integración)`;
    svg.appendChild(t1);

    // Magenta = desintegración
    const l2 = document.createElementNS(ns, 'line');
    l2.setAttribute('x1', 20); l2.setAttribute('y1', legY - 15);
    l2.setAttribute('x2', 50); l2.setAttribute('y2', legY - 15);
    l2.setAttribute('stroke', '#953a90'); l2.setAttribute('stroke-width', '2');
    l2.setAttribute('stroke-dasharray', '6,3');
    svg.appendChild(l2);
    const t2 = document.createElementNS(ns, 'text');
    t2.setAttribute('x', 55); t2.setAttribute('y', legY - 11);
    t2.setAttribute('font-size', '9'); t2.setAttribute('fill', '#953a90');
    t2.setAttribute('font-family', 'Poppins, sans-serif');
    t2.textContent = `→ ${desintegracion} (Desintegración)`;
    svg.appendChild(t2);

    container.innerHTML = '';
    container.appendChild(svg);
  };

})();
