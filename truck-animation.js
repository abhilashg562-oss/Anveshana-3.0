// ── Truck Dashboard Animation Script ── 
// Self-contained for truck.html integration

// ── Generate stars ──
const starsEl = document.getElementById('stars');
if (starsEl) {
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `
      width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;
      top:${Math.random()*90}%;left:${Math.random()*100}%;
      animation-delay:${Math.random()*3}s;animation-duration:${1.5+Math.random()*2}s;
    `;
    starsEl.appendChild(s);
  }
}

// ── Generate rain ──
const windshield = document.getElementById('windshield');
if (windshield) {
  for (let i = 0; i < 15; i++) {
    const r = document.createElement('div');
    r.className = 'raindrop';
    r.style.cssText = `
      left:${Math.random()*100}%;
      height:${15+Math.random()*25}px;
      animation-duration:${0.4+Math.random()*0.4}s;
      animation-delay:${Math.random()*0.8}s;
      top:-30px;
    `;
    windshield.appendChild(r);
  }
}

// ── Utility functions ──
function showPhaseTitle(text, duration=2000) {
  const el = document.getElementById('phaseTitle');
  if (!el) return;
  el.textContent = text;
  el.style.transition = 'opacity 0.5s';
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, duration - 500);
}

function flashAlert(color='rgba(255,68,68,0.08)', times=3) {
  const el = document.getElementById('alertFlash');
  if (!el) return;
  let count = 0;
  const interval = setInterval(() => {
    el.style.background = color;
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 150);
    if (++count >= times) clearInterval(interval);
  }, 300);
}

function setFill(pct) {
  const circumference = 2 * Math.PI * 24; // ~151
  const dash = (pct / 100) * circumference;
  const arc = document.getElementById('fillArc');
  if (!arc) return;
  arc.setAttribute('stroke-dasharray', `${dash} ${circumference - dash}`);
  arc.style.stroke = pct > 80 ? '#ff4444' : pct > 50 ? '#ffaa00' : '#00ff88';
  const fillPct = document.getElementById('fillPct');
  if (fillPct) {
    fillPct.textContent = pct + '%';
    fillPct.style.fill = pct > 80 ? '#ff4444' : pct > 50 ? '#ffaa00' : '#00ff88';
  }

  // truck fill bar (82px = 100%)
  const fillBar = document.getElementById('fillBar');
  if (fillBar) {
    fillBar.setAttribute('width', Math.round(pct * 0.82));
    fillBar.style.fill = pct > 80 ? '#ff4444' : pct > 50 ? '#ffaa00' : '#00ff88';
  }
}

function setMinimapTruck(x, y) {
  const m = document.getElementById('mTruck');
  if (m) {
    m.setAttribute('cx', x);
    m.setAttribute('cy', y);
  }
}

function collectBin(binId, mmBinId, currentFill, newFill, label, cb) {
  // Flash green
  flashAlert('rgba(0,255,136,0.08)', 2);

  // Activate compactor light
  const indCompactor = document.getElementById('indCompactor');
  if (indCompactor) indCompactor.className = 'ind-dot on-amber';

  // Update HUD
  const statusBar = document.getElementById('statusBar');
  if (statusBar) statusBar.textContent = `⬡ COLLECTING — ${label}`;
  const hudPhase = document.getElementById('hud-phase');
  if (hudPhase) hudPhase.textContent = 'PHASE: COLLECTING';

  // Particles
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const x = 50 + (Math.random()-0.5)*20;
    const y = 43 + (Math.random()-0.5)*5;
    p.style.cssText = `left:${x}%;top:${y}%;z-index:15;`;
    windshield.appendChild(p);
    p.style.transition = `all ${0.5+Math.random()*0.5}s`;
    setTimeout(() => {
      p.style.opacity = '1';
      p.style.transform = `translate(${(Math.random()-0.5)*40}px,${-20-Math.random()*30}px)`;
      p.style.opacity = '0';
    }, 50);
    setTimeout(() => p.remove(), 1000);
  }

  // Animate bin disappearing
  const bin = document.getElementById(binId);
  if (bin) {
    bin.classList.add('collected');
    setTimeout(() => bin.style.display = 'none', 600);
  }

  // Grey out minimap bin
  const mb = document.getElementById(mmBinId);
  if (mb) { 
    mb.style.fill = 'rgba(100,100,100,0.3)'; 
    mb.setAttribute('r', '2'); 
  }

  // Animate fill rising
  let fill = currentFill;
  const target = newFill;
  const step = () => {
    fill = Math.min(fill + 2, target);
    setFill(fill);
    if (fill < target) requestAnimationFrame(step);
    else {
      if (indCompactor) indCompactor.className = 'ind-dot';
      setTimeout(cb, 500);
    }
  };
  setTimeout(step, 300);
}

// ── Main animation sequence ──
let animTimeout = null;
const timeouts = [];
function later(fn, ms) { timeouts.push(setTimeout(fn, ms)); return ms; }
function clearAll() { timeouts.forEach(clearTimeout); timeouts.length = 0; }

function initAnimation() {
  clearAll();

  // Reset state
  ['bin1','bin2','bin3'].forEach(id => {
    const b = document.getElementById(id);
    if (b) {
      b.classList.remove('collected');
      b.style.display = 'block';
      b.style.opacity = '1';
      b.style.transform = '';
    }
  });
  ['mbin1','mbin2','mbin3'].forEach(id => {
    const b = document.getElementById(id);
    if (b) {
      b.style.fill = id === 'mbin1' ? '#ffaa00' : '#ff4444';
      b.setAttribute('r', '3');
    }
  });
  setFill(0);
  const hudBins = document.getElementById('hud-bins');
  if (hudBins) hudBins.textContent = 'BINS COLLECTED: 0/3';
  const hudPhase = document.getElementById('hud-phase');
  if (hudPhase) hudPhase.textContent = 'PHASE: PATROLLING';
  const hudSpeed = document.getElementById('hud-speed');
  if (hudSpeed) hudSpeed.textContent = 'SPEED: 42 km/h';
  const hudDist = document.getElementById('hud-dist');
  if (hudDist) hudDist.textContent = 'DIST TO DUMP: 4.2 km';
  const hudEta = document.getElementById('hud-eta');
  if (hudEta) hudEta.textContent = 'ETA: 6 min';
  const hudLoc = document.getElementById('hud-loc');
  if (hudLoc) hudLoc.textContent = 'LOC: Kuvempunagar';
  const statusBar = document.getElementById('statusBar');
  if (statusBar) statusBar.textContent = '⬡ PATROLLING ROUTE — MONITORING BIN FILL LEVELS';
  const routeStops = document.getElementById('routeStops');
  if (routeStops) routeStops.textContent = 'Next stop: Vijayanagar High (85%)';
  const indCompactor = document.getElementById('indCompactor');
  if (indCompactor) indCompactor.className = 'ind-dot';
  const indDump = document.getElementById('indDump');
  if (indDump) indDump.className = 'ind-dot';
  const horizon = document.getElementById('horizon');
  if (horizon) horizon.classList.remove('visible');
  const chimneySmoke = document.getElementById('chimney-smoke');
  if (chimneySmoke) chimneySmoke.style.opacity = '0';
  setMinimapTruck(60, 40);
  const speedVal = document.getElementById('speedVal');
  if (speedVal) speedVal.textContent = '42';
  const phaseTitle = document.getElementById('phaseTitle');
  if (phaseTitle) phaseTitle.style.opacity = '0';

  // Move bins into view (stagger)
  const bin1 = document.getElementById('bin1');
  if (bin1) bin1.style.left = '62%';
  const bin2 = document.getElementById('bin2');
  if (bin2) bin2.style.left = '57%';
  const bin3 = document.getElementById('bin3');
  if (bin3) bin3.style.left = '67%';

  let t = 0;

  // Phase 1: Patrol
  later(() => {
    showPhaseTitle('PATROLLING', 2000);
  }, t += 500);

  // Approach bin 1
  later(() => {
    if (hudLoc) hudLoc.textContent = 'LOC: Vijayanagar';
    if (statusBar) statusBar.textContent = '⬡ APPROACHING — Vijayanagar (85%) — HIGH PRIORITY';
    if (routeStops) routeStops.textContent = 'Next stop: Vijayanagar (85% full)';
    flashAlert('rgba(255,170,0,0.06)', 2);
    setMinimapTruck(55, 40);
  }, t += 2500);

  // Collect bin 1
  later(() => {
    showPhaseTitle('COLLECTING BIN', 1500);
    if (hudSpeed) hudSpeed.textContent = 'SPEED: 0 km/h';
    if (speedVal) speedVal.textContent = '0';
    collectBin('bin1', 'mbin1', 0, 38, 'Vijayanagar (85%)', () => {
      if (hudBins) hudBins.textContent = 'BINS COLLECTED: 1/3';
      if (hudSpeed) hudSpeed.textContent = 'SPEED: 38 km/h';
      if (speedVal) speedVal.textContent = '38';
    });
  }, t += 2000);

  // Approach bin 2
  later(() => {
    if (hudLoc) hudLoc.textContent = 'LOC: Bannimantap';
    if (statusBar) statusBar.textContent = '⬡ APPROACHING — Bannimantap (100%) — FULL!';
    if (routeStops) routeStops.textContent = 'Next stop: Bannimantap (FULL!)';
    flashAlert('rgba(255,68,68,0.1)', 3);
    setMinimapTruck(48, 42);
  }, t += 3000);

  // Collect bin 2
  later(() => {
    showPhaseTitle('URGENT COLLECTION', 1500);
    if (hudSpeed) hudSpeed.textContent = 'SPEED: 0 km/h';
    if (speedVal) speedVal.textContent = '0';
    collectBin('bin2', 'mbin2', 38, 72, 'Bannimantap (100%)', () => {
      if (hudBins) hudBins.textContent = 'BINS COLLECTED: 2/3';
      if (hudSpeed) hudSpeed.textContent = 'SPEED: 35 km/h';
      if (speedVal) speedVal.textContent = '35';
    });
  }, t += 2500);

  // Approach bin 3
  later(() => {
    if (hudLoc) hudLoc.textContent = 'LOC: Kuvempunagar';
    if (statusBar) statusBar.textContent = '⬡ APPROACHING — Kuvempunagar (98%) — CRITICAL!';
    if (routeStops) routeStops.textContent = 'Next stop: Kuvempunagar (98% full)';
    flashAlert('rgba(255,68,68,0.1)', 4);
    setMinimapTruck(40, 45);
  }, t += 3000);

  // Collect bin 3
  later(() => {
    showPhaseTitle('CRITICAL COLLECTION', 1500);
    if (hudSpeed) hudSpeed.textContent = 'SPEED: 0 km/h';
    if (speedVal) speedVal.textContent = '0';
    collectBin('bin3', 'mbin3', 72, 97, 'Kuvempunagar (98%)', () => {
      if (hudBins) hudBins.textContent = 'BINS COLLECTED: 3/3';
      if (hudSpeed) hudSpeed.textContent = 'SPEED: 40 km/h';
      if (speedVal) speedVal.textContent = '40';
    });
  }, t += 2500);

  // ── Phase 2: Drive to dump ──
  later(() => {
    showPhaseTitle('HEADING TO DUMP SITE', 2000);
    if (hudPhase) hudPhase.textContent = 'PHASE: TRANSIT TO DUMP';
    if (statusBar) statusBar.textContent = '⬡ TRUCK FULL — ROUTING TO DUMP SITE';
    const routeName = document.getElementById('routeName');
    if (routeName) routeName.textContent = 'DUMP SITE — 4.2 km';
    if (routeStops) routeStops.textContent = 'All bins collected ✓ Heading to dump';
    setMinimapTruck(30, 35);
    // Show horizon buildings
    const horizonEl = document.getElementById('horizon');
    if (horizonEl) horizonEl.classList.add('visible');
  }, t += 3500);

  // ETA countdown
  const etas = ['5 min','4 min','3 min','2 min','1 min'];
  const dists = ['3.5 km','2.8 km','2.0 km','1.2 km','0.4 km'];
  etas.forEach((eta, i) => {
    later(() => {
      if (hudEta) hudEta.textContent = `ETA: ${eta}`;
      if (hudDist) hudDist.textContent = `DIST TO DUMP: ${dists[i]}`;
      setMinimapTruck(30 - i*4, 35 - i*3);
    }, t + 500 + i * 1000);
  });

  // ── Phase 3: Dump ──
  later(() => {
    showPhaseTitle('ARRIVING AT DUMP SITE', 2000);
    if (hudPhase) hudPhase.textContent = 'PHASE: DUMPING';
    if (hudSpeed) hudSpeed.textContent = 'SPEED: 5 km/h';
    if (speedVal) speedVal.textContent = '5';
    if (hudLoc) hudLoc.textContent = 'LOC: DUMP SITE';
    if (statusBar) statusBar.textContent = '⬡ ARRIVED AT DUMP SITE — INITIATING DUMP SEQUENCE';
    const indDumpEl = document.getElementById('indDump');
    if (indDumpEl) indDumpEl.className = 'ind-dot on-amber';
    const chimneySmokeEl = document.getElementById('chimney-smoke');
    if (chimneySmokeEl) chimneySmokeEl.style.opacity = '1';
    setMinimapTruck(13, 13);
    flashAlert('rgba(0,200,255,0.06)', 2);
  }, t += 5500);

  // Dump sequence - fill level drops
  later(() => {
    showPhaseTitle('DUMPING WASTE', 2000);
    if (hudSpeed) hudSpeed.textContent = 'SPEED: 0 km/h';
    if (speedVal) speedVal.textContent = '0';
    if (statusBar) statusBar.textContent = '⬡ COMPACTOR ACTIVE — EJECTING WASTE';
    const indCompactorEl = document.getElementById('indCompactor');
    if (indCompactorEl) indCompactorEl.className = 'ind-dot on-red';
    const indDumpEl2 = document.getElementById('indDump');
    if (indDumpEl2) indDumpEl2.className = 'ind-dot on-red';

    // Shake truck
    const truckEl = document.getElementById('truck');
    if (truckEl) truckEl.style.animation = 'truckBounce 0.3s ease-in-out infinite alternate, dumpShake 0.15s ease-in-out infinite';

    // Dump particles (multicolor debris)
    const colors = ['#88aa44','#665533','#443322','#aabb55','#776644'];
    for (let i = 0; i < 20; i++) {
      const dp = document.createElement('div');
      dp.className = 'dump-particle';
      dp.style.cssText = `
        left:${35+Math.random()*20}%;top:${40+Math.random()*15}%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
      `;
      windshield.appendChild(dp);
      setTimeout(() => {
        dp.style.transition = `all ${0.8+Math.random()*0.8}s`;
        dp.style.opacity = '1';
        dp.style.transform = `translate(${(Math.random()-0.5)*80}px, ${20+Math.random()*60}px) rotate(${Math.random()*360}deg)`;
        dp.style.opacity = '0';
      }, 50 + i * 100);
      setTimeout(() => dp.remove(), 2500);
    }

    // Animate fill dropping
    let fill = 97;
    const dropStep = () => {
      fill = Math.max(fill - 3, 0);
      setFill(fill);
      if (fill > 0) requestAnimationFrame(dropStep);
      else {
        if (truckEl) truckEl.style.animation = 'truckBounce 0.3s ease-in-out infinite alternate';
        if (indCompactorEl) indCompactorEl.className = 'ind-dot';
        const indDumpEl3 = document.getElementById('indDump');
        if (indDumpEl3) indDumpEl3.className = 'ind-dot on-green';
        setTimeout(() => {
          if (indDumpEl3) indDumpEl3.className = 'ind-dot';
        }, 2000);
      }
    };
    setTimeout(dropStep, 300);
  }, t += 2000);

  // Phase 4: Complete
  later(() => {
    showPhaseTitle('ROUTE COMPLETE ✓', 3000);
    const hudPhaseEl = document.getElementById('hud-phase');
    if (hudPhaseEl) hudPhaseEl.textContent = 'PHASE: COMPLETE';
    if (statusBar) statusBar.textContent = '⬡ DUMP COMPLETE — TRUCK CLEAR — RETURNING TO BASE';
    const routeNameEl = document.getElementById('routeName');
    if (routeNameEl) routeNameEl.textContent = 'ROUTE COMPLETE — RETURNING';
    if (routeStops) routeStops.textContent = '3 bins cleared · 0% fill · Ready for next route';
    const hudBinsEl = document.getElementById('hud-bins');
    if (hudBinsEl) hudBinsEl.textContent = 'BINS COLLECTED: 3/3 ✓';
    flashAlert('rgba(0,255,136,0.1)', 3);
    if (hudSpeed) hudSpeed.textContent = 'SPEED: 45 km/h';
    if (speedVal) speedVal.textContent = '45';
  }, t += 3000);

  // Auto-restart
  later(() => {
    initAnimation();
  }, t += 5000);
}

// ── Clock ──
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const timeDisplay = document.getElementById('timeDisplay');
  if (timeDisplay) timeDisplay.textContent = `${h}:${m}`;
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateClock, 30000);
    updateClock();
    initAnimation();
  });
} else {
  setInterval(updateClock, 30000);
  updateClock();
  initAnimation();
}
