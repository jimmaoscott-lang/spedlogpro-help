// Shared by every lesson page: the menu, Previous/Next, the "I did this" tick, and the red
// pen loops. A page names itself with <body data-lesson="roster">. Ticks are kept only in this
// browser (localStorage); nothing is ever sent anywhere.
(function () {
  const lessons = window.LESSONS || [];
  const here = document.body.dataset.lesson;
  // The NEW starburst for a lesson added in a newer app version (`newIn` in lessons.js).
  const badge = (v) => `<span class="newburst" title="New in version ${v}"><span class="burst">NEW</span><small>for version ${v} and beyond</small></span>`;
  const done = (id) => { try { return localStorage.getItem('done:' + id) === '1'; } catch (e) { return false; } };

  // ---- the menu ----
  const menu = document.getElementById('menu');
  if (menu) {
    let group = null;
    let startNo = 0;
    for (const l of lessons) {
      if (l.group !== group) {
        group = l.group;
        const h = document.createElement('h4');
        h.textContent = group;
        menu.appendChild(h);
      }
      const a = document.createElement('a');
      const tick = document.createElement('span');
      tick.className = 'tick';
      if (l.group === 'Start here') { startNo += 1; tick.textContent = String(startNo); }
      if (done(l.id)) { tick.className = 'tick ok'; tick.textContent = '✓'; }
      a.appendChild(tick);
      a.appendChild(document.createTextNode(l.title));
      if (l.newIn) a.insertAdjacentHTML('beforeend', badge(l.newIn));
      if (l.url) a.href = l.url;
      else { a.className = 'soonlink'; const s = document.createElement('span'); s.className = 'soon'; s.textContent = 'soon'; a.appendChild(s); }
      if (l.id === here) a.classList.add('here');
      menu.appendChild(a);
    }
  }

  // ---- Previous / Next (skips lessons not built yet) ----
  const nav = document.getElementById('lesson-nav');
  const i = lessons.findIndex((l) => l.id === here);
  if (nav && i !== -1) {
    const built = (k) => lessons[k] && lessons[k].url;
    let p = i - 1; while (p >= 0 && !built(p)) p -= 1;
    let n = i + 1; while (n < lessons.length && !built(n)) n += 1;
    const prev = p >= 0 ? `<a href="${lessons[p].url}"><small>← Previous</small><b>${lessons[p].title}</b>${lessons[p].newIn ? badge(lessons[p].newIn) : ''}</a>`
                        : `<a href="../"><small>← Back to</small><b>All lessons</b></a>`;
    const next = n < lessons.length ? `<a class="next" href="${lessons[n].url}"><small>Next →</small><b>${lessons[n].title}</b>${lessons[n].newIn ? badge(lessons[n].newIn) : ''}</a>`
                                    : `<a class="next" href="../"><small>You've reached the end →</small><b>All lessons</b></a>`;
    nav.innerHTML = prev + next;
  }

  // ---- copyright notice at the foot of every lesson ----
  const main = document.querySelector('main');
  if (main) {
    const f = document.createElement('p');
    f.className = 'notice';
    f.textContent = '© 2026 J. Scott. All rights reserved. All students shown are made up.';
    main.appendChild(f);
  }

  // ---- "I did this" ----
  const did = document.getElementById('did');
  if (did && here) {
    did.checked = done(here);
    did.addEventListener('change', () => {
      try { localStorage.setItem('done:' + here, did.checked ? '1' : '0'); } catch (e) {}
      const t = document.querySelector('#menu a.here .tick');
      if (t) { t.className = did.checked ? 'tick ok' : 'tick'; if (did.checked) t.textContent = '✓'; }
      if (window.refreshNewBadges) window.refreshNewBadges(here);
    });
  }
  if (window.refreshNewBadges) window.refreshNewBadges(here);

  // ---- red pen loops ----
  // Drawn figures: items marked data-pen get a loop (items sharing a value share one loop).
  // Real screenshots: <div class="fig" data-pens="cx,cy,rx,ry; …"> in the picture's own pixels
  // (1100 x 820 unless data-w / data-h say otherwise).
  function loop(cx, cy, rx, ry, seed) {
    let d = '';
    for (let k = 0; k <= 68; k += 1) {
      const t = (2 * Math.PI * k) / 60 - 0.6;
      const w = 1 + 0.05 * Math.sin(3 * t + seed) + 0.03 * Math.sin(7 * t + seed * 2);
      const g = 1 + 0.06 * (k / 68);
      d += (k ? ' L' : 'M') + (cx + rx * w * g * Math.cos(t)).toFixed(1) + ',' + (cy + ry * w * g * Math.sin(t)).toFixed(1);
    }
    return d;
  }
  function drawPens() {
    document.querySelectorAll('.fig').forEach((fig, n) => {
      let svg = fig.querySelector('svg.auto');
      const spots = fig.dataset.pens;
      const items = fig.querySelectorAll('[data-pen]');
      if (!spots && !items.length) return;
      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'pen auto');
        fig.appendChild(svg);
      }
      if (spots) {
        const w = Number(fig.dataset.w || 1100), h = Number(fig.dataset.h || 820);
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.innerHTML = spots.split(';').map((s, k) => {
          const [cx, cy, rx, ry] = s.split(',').map(Number);
          return `<path d="${loop(cx, cy, rx, ry, n + k + 1)}"/>`;
        }).join('');
        return;
      }
      const box = fig.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      const groups = new Map();
      items.forEach((el) => {
        const key = el.dataset.pen === '1' ? el : el.dataset.pen;
        const r = el.getBoundingClientRect();
        const g = groups.get(key) || { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity };
        g.l = Math.min(g.l, r.left); g.t = Math.min(g.t, r.top); g.r = Math.max(g.r, r.right); g.b = Math.max(g.b, r.bottom);
        groups.set(key, g);
      });
      svg.innerHTML = [...groups.values()].map((g, k) =>
        `<path d="${loop((g.l + g.r) / 2 - box.left, (g.t + g.b) / 2 - box.top, (g.r - g.l) / 2 + 12, (g.b - g.t) / 2 + 9, n + k + 1)}"/>`
      ).join('');
    });
  }
  window.addEventListener('load', drawPens);
  window.addEventListener('resize', drawPens);
  window.drawPens = drawPens;

  // Click a real screenshot to see it full size.
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.fig img.shot');
    if (img) window.open(img.src, '_blank');
  });
})();
