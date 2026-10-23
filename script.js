(function () {
  'use strict';

  // Web Audio switch synth
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  let sfxEnabled = true;

  const audioToggle = document.getElementById('audioToggle');
  const audioDot = document.getElementById('audioDot');
  const audioLabel = document.getElementById('audioLabel');

  function playTactileClick(freq = 190) {
    if (!sfxEnabled || !AudioCtx) return;
    try {
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(48, audioCtx.currentTime + 0.045);

      gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (err) {}
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      audioToggle.setAttribute('aria-pressed', String(sfxEnabled));
      if (audioDot) audioDot.classList.toggle('muted', !sfxEnabled);
      if (audioLabel) audioLabel.textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
      if (sfxEnabled) playTactileClick(260);
    });
  }

  function animateSwap(container) {
    if (!container) return;
    container.classList.remove('fade-swap');
    void container.offsetWidth;
    container.classList.add('fade-swap');
  }

// Entry chapters modal logic
  const captchaModal = document.getElementById('captchaModal');
  const enterMonographBtn = document.getElementById('enterMonographBtn');
  const chapterItems = document.querySelectorAll('.modal-chapter-item');

  function unlockSite() {
    playTactileClick(260);
    try {
      sessionStorage.setItem('tg_verified', 'true');
    } catch (e) {}
    if (captchaModal) captchaModal.classList.add('unlocked');
    document.body.classList.remove('modal-locked');
  }

  try {
    if (sessionStorage.getItem('tg_verified') === 'true' && captchaModal) {
      captchaModal.classList.add('unlocked');
      document.body.classList.remove('modal-locked');
    }
  } catch (e) {}

  // Clicking a chapter row opens its tagline preview inside the modal
  chapterItems.forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.closest('[data-chapter-jump]')) return;
      playTactileClick(210);
      chapterItems.forEach(other => {
        const isCurrent = other === item;
        other.classList.toggle('active', isCurrent);
        const toggleIcon = other.querySelector('.mc-toggle');
        if (toggleIcon) toggleIcon.textContent = isCurrent ? '−' : '+';
      });
    });
  });

  if (enterMonographBtn) {
    enterMonographBtn.addEventListener('click', unlockSite);
  }

  document.querySelectorAll('[data-chapter-jump]').forEach(link => {
    link.addEventListener('click', () => {
      unlockSite();
    });
  });

  // Chessboard & navigation (Clean, warm-minimalist chess pieces)
  const boardEl = document.getElementById('blurryChessboard');
  const heroSection = document.getElementById('heroSection');
  if (boardEl) {
    const pieces = {
      9:  { g: '♖', c: 'accent-ivory' },
      14: { g: '♕', c: 'accent-warm' },
      18: { g: '♗', c: 'accent-ivory' },
      21: { g: '♘', c: 'accent-warm' },
      27: { g: '♔', c: 'accent-warm' },
      28: { g: '♕', c: 'accent-ivory' },
      34: { g: '♗', c: 'accent-warm' },
      45: { g: '♘', c: 'accent-ivory' },
      50: { g: '♙', c: 'accent-ivory' },
      53: { g: '♖', c: 'accent-warm' }
    };

    boardEl.innerHTML = '';
    for (let i = 0; i < 64; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const tile = document.createElement('div');
      tile.className = 'cb-tile ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
      if (pieces[i]) {
        tile.classList.add(pieces[i].c);
        tile.textContent = pieces[i].g;
      }
      boardEl.appendChild(tile);
    }

    if (heroSection) {
      heroSection.addEventListener('mousemove', e => {
        const r = heroSection.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        boardEl.style.transform = `rotateX(${55 - y * 6}deg) rotateZ(${-18 + x * 8}deg) scale(1.08)`;
      });
    }
  }

  const readingRule = document.getElementById('readingRule');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (readingRule) readingRule.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const open = mobileDrawer.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.textContent = open ? 'Close' : 'Menu';
    });
    document.querySelectorAll('.m-link').forEach(l => {
      l.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.textContent = 'Menu';
      });
    });
  }

  // Force A & B tabs
  const aiManuscript = document.getElementById('aiManuscript');
  document.querySelectorAll('[data-ai-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      playTactileClick(210);
      document.querySelectorAll('[data-ai-filter]').forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      if (aiManuscript) aiManuscript.setAttribute('data-filter', btn.getAttribute('data-ai-filter'));
    });
  });

  const bioTabs = {
    genetic: {
      tTitle: 'Single-Gene Blood Cures & Targeted mRNA Care',
      tBody: 'Approved CRISPR therapies are already curing inherited sickle-cell disease and beta-thalassemia in hospital patients, while programmable mRNA vaccines and CAR-T therapies train a patient’s own immune cells to clear specific blood cancers.',
      fTitle: 'Safe Polygenic Editing & Pre-Symptom Reversal',
      fBody: 'Treating complex conditions shaped by dozens of interacting genes, such as Alzheimer’s or systemic cellular aging, remains in early lab research and requires decades of long-term safety proof before routine use.'
    },
    regenerative: {
      tTitle: 'Cultured Skin Grafts, Corneas & Cartilage Scaffolds',
      tBody: 'Clinics today use biodegradable collagen scaffolds seeded with a patient’s own cells to repair localized knee cartilage, severe burns, and damaged corneas without immune rejection.',
      fTitle: 'Bioprinted Solid Organs on Demand',
      fBody: 'Growing fully vascularized solid organs, such as a human kidney, liver, or heart, from a patient’s own cells to end transplant waiting lists remains a long-term goal requiring breakthroughs in capillary growth.'
    },
    ecological: {
      tTitle: 'Pilot Enzymatic Recycling & Brewed Insulin',
      tBody: 'Engineered microbes already brew human insulin and essential medicines in steel tanks, while pilot facilities use custom enzymes to break polyester waste down into clean monomers at low temperatures.',
      fTitle: 'Planetary-Scale Atmospheric & Ocean Remediation',
      fBody: 'Deploying engineered organisms in open ecosystems to capture gigatons of carbon or clear ocean microplastics remains speculative and demands strict biological containment locks.'
    }
  };

  const bioComparer = document.getElementById('bioComparer');
  document.querySelectorAll('[data-bio-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = bioTabs[btn.getAttribute('data-bio-tab')];
      if (!d) return;
      playTactileClick(195);
      document.querySelectorAll('[data-bio-tab]').forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      document.getElementById('bioTodayTitle').textContent = d.tTitle;
      document.getElementById('bioTodayBody').textContent = d.tBody;
      document.getElementById('bioFutureTitle').textContent = d.fTitle;
      document.getElementById('bioFutureBody').textContent = d.fBody;
      animateSwap(bioComparer);
    });
  });

  // Force C: surgical tremor damping canvas & surgeon biometrics
  const pad = document.getElementById('tremorPad');
  const clearPadBtn = document.getElementById('clearPadBtn');
  const statStress = document.getElementById('statStress');
  const statFatigue = document.getElementById('statFatigue');
  const statCog = document.getElementById('statCog');
  const statScore = document.getElementById('statScore');
  const statBar = document.getElementById('statBar');
  const tremorDot = document.getElementById('tremorDot');
  const tremorStateText = document.getElementById('tremorStateText');
  const tremorSampleCount = document.getElementById('tremorSampleCount');

  if (pad) {
    const ctx = pad.getContext('2d');
    let drawing = false;
    let smoothX = 0, smoothY = 0;
    let lastRawX = 0, lastRawY = 0;
    let sampleCount = 0;
    let cumulativeSpeed = 0;

const resetAnalytics = () => {
      sampleCount = 0;
      cumulativeSpeed = 0;
      if (statStress) statStress.textContent = '— (0%)';
      if (statFatigue) statFatigue.textContent = '— (0%)';
      if (statCog) statCog.textContent = '—';
      if (statScore) statScore.textContent = '—';
      if (statBar) statBar.style.width = '0%';
      if (tremorDot) tremorDot.classList.remove('live');
      if (tremorStateText) tremorStateText.textContent = 'READY · DRAG CURSOR TO READ SURGEON BIOMETRICS';
      if (tremorSampleCount) tremorSampleCount.textContent = 'HR: — BPM';
    };

    const drawBaseline = () => {
      ctx.clearRect(0, 0, pad.width, pad.height);
      ctx.strokeStyle = 'rgba(20,22,28,0.16)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(30, 92);
      ctx.bezierCurveTo(180, 22, 340, 162, 490, 92);
      ctx.stroke();
      ctx.setLineDash([]);
      resetAnalytics();
    };
    drawBaseline();

    const getCoords = e => {
      const r = pad.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: ((cx - r.left) / r.width) * pad.width, y: ((cy - r.top) / r.height) * pad.height };
    };

    const startDraw = e => {
      drawing = true;
      const p = getCoords(e);
      smoothX = p.x;
      smoothY = p.y;
      lastRawX = p.x;
      lastRawY = p.y;
      if (tremorDot) tremorDot.classList.add('live');
      if (tremorStateText) tremorStateText.textContent = 'MONITORING SURGEON STRESS, FATIGUE & COGNITIVE LOAD...';
    };

    const moveDraw = e => {
      if (!drawing) return;
      const p = getCoords(e);

      const moveSpeed = Math.hypot(p.x - lastRawX, p.y - lastRawY);
      cumulativeSpeed += moveSpeed;
      sampleCount++;

      const fatiguePct = Math.min(68, Math.round(8 + sampleCount * 0.32));
      const avgSpeed = cumulativeSpeed / sampleCount;
      const stressPct = Math.min(82, Math.max(16, Math.round(14 + avgSpeed * 1.8 + (fatiguePct * 0.25))));

      const shakeAmp = 7.5 + (fatiguePct * 0.08);
      const tremorOffsetX = (Math.random() - 0.5) * shakeAmp;
      const tremorOffsetY = (Math.random() - 0.5) * shakeAmp;
      const rawX = p.x + tremorOffsetX;
      const rawY = p.y + tremorOffsetY;

      ctx.strokeStyle = 'rgba(20, 22, 28, 0.26)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(lastRawX, lastRawY);
      ctx.lineTo(rawX, rawY);
      ctx.stroke();

      const nx = smoothX + (p.x - smoothX) * 0.22;
      const ny = smoothY + (p.y - smoothY) * 0.22;
      ctx.strokeStyle = '#B84A32';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(smoothX, smoothY);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      const t = Math.max(0, Math.min(1, (nx - 30) / 460));
      const idealY =
        Math.pow(1 - t, 3) * 92 +
        3 * Math.pow(1 - t, 2) * t * 22 +
        3 * (1 - t) * Math.pow(t, 2) * 162 +
        Math.pow(t, 3) * 92;
      const pathErrorPx = Math.abs(ny - idealY);
      const stabilityScore = Math.round(Math.max(76, Math.min(99, 100 - pathErrorPx * 0.32)));

      const stressLabel = stressPct < 32 ? `Calm (${stressPct}%)` : stressPct < 58 ? `Moderate (${stressPct}%)` : `Elevated (${stressPct}%)`;
      const fatigueLabel = fatiguePct < 25 ? `Low (${fatiguePct}%)` : fatiguePct < 48 ? `Moderate (${fatiguePct}%)` : `High (${fatiguePct}%)`;
      const cogLabel = pathErrorPx < 18 ? 'Focused (Low)' : pathErrorPx < 42 ? 'Moderate Load' : 'High Demand';
      const heartRate = Math.min(108, Math.round(70 + stressPct * 0.38));

      if (statStress) statStress.textContent = stressLabel;
      if (statFatigue) statFatigue.textContent = fatigueLabel;
      if (statCog) statCog.textContent = cogLabel;
      if (statScore) statScore.textContent = stabilityScore + '% Safe';
      if (statBar) statBar.style.width = stabilityScore + '%';
      if (tremorSampleCount) tremorSampleCount.textContent = `HR: ${heartRate} BPM`;

      lastRawX = rawX;
      lastRawY = rawY;
      smoothX = nx;
      smoothY = ny;
    };

    const stopDraw = () => {
      if (!drawing) return;
      drawing = false;
      if (tremorDot) tremorDot.classList.remove('live');
      if (sampleCount > 0 && tremorStateText) {
        tremorStateText.textContent = 'BIOMETRICS LOGGED · ROBOTIC STABILIZATION ACTIVE';
      }
    };

    pad.addEventListener('mousedown', startDraw);
    pad.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', stopDraw);
    pad.addEventListener('touchstart', startDraw, { passive: true });
    pad.addEventListener('touchmove', moveDraw, { passive: true });
    window.addEventListener('touchend', stopDraw);
    if (clearPadBtn) {
      clearPadBtn.addEventListener('click', () => {
        playTactileClick(160);
        drawBaseline();
      });
    }
  }

  // Force D: neural privacy switches
  const priv1 = document.getElementById('priv1');
  const priv2 = document.getElementById('priv2');
  const hmiExplanation = document.getElementById('hmiExplanation');

  document.querySelectorAll('[data-hmi-switch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOn = btn.classList.toggle('on');
      btn.setAttribute('aria-pressed', String(isOn));
      playTactileClick(isOn ? 240 : 135);

      const label = btn.querySelector('.switch-state');
      if (label) {
        label.textContent = isOn ? 'ON' : 'OFF';
        label.className = 'index-note switch-state ' + (isOn ? 'text-cyan' : 'text-coral');
      }

      if (document.querySelectorAll('[data-hmi-switch].on').length === 2) {
        priv1.classList.remove('exposed');
        priv2.classList.remove('exposed');
        hmiExplanation.innerHTML = '<strong>Safeguards active:</strong> The decoder outputs only the words the patient consciously intends to speak (<span class="text-cyan">underlined</span>). Unspoken private thoughts stay redacted and unrecorded.';
      } else {
        priv1.classList.add('exposed');
        priv2.classList.add('exposed');
        hmiExplanation.innerHTML = '<strong class="text-coral">Safeguard removed:</strong> Notice how the patient’s private anxieties in red are now exposed and logged.';
      }
    });
  });

  // Chapter 03: 2045 timeline & image loader
  function createArchivalFallbackSvg(plate, title) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#0D1524"/>
      <g stroke="rgba(45,212,191,0.14)" stroke-width="1">
        <line x1="0" y1="150" x2="800" y2="150"/><line x1="0" y1="300" x2="800" y2="300"/><line x1="0" y1="450" x2="800" y2="450"/>
        <line x1="200" y1="0" x2="200" y2="600"/><line x1="400" y1="0" x2="400" y2="600"/><line x1="600" y1="0" x2="600" y2="600"/>
      </g>
      <circle cx="400" cy="300" r="150" fill="none" stroke="rgba(217,107,78,0.45)" stroke-dasharray="6 6" stroke-width="2"/>
      <circle cx="400" cy="300" r="75" fill="none" stroke="rgba(45,212,191,0.5)" stroke-width="1.5"/>
      <text x="400" y="285" text-anchor="middle" fill="#2DD4BF" font-family="monospace" font-size="16" letter-spacing="3">${plate}</text>
      <text x="400" y="325" text-anchor="middle" fill="#F4F0E6" font-family="Georgia, serif" font-size="24">${title}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  const chronicleData = {
    '07:00': {
      meta: '07:00 AM · RAGHAV’S VERANDA · IMAGINED SCENARIO · 2045',
      title: 'A Home That Adapts Without Watching',
      story: 'At seventy-four, Raghav wakes to warm October sunlight across his lime-plaster wall. Humid mornings make his left knee stiff, and the terracotta floor tiles notice his slower step using simple pressure sensors; there isn’t a single camera in the house. In the kitchen, the counter quietly lowers two inches while the decoction brews, and a soft woven band on his wrist steadies his hand just enough to pour hot filter coffee into his favorite brass tumbler.',
      detail: 'Raghav still grinds his Chikmagalur coffee beans by hand in a forty-year-old brass mill. The home removes the physical frustration of aging while leaving the morning rituals he loves untouched.',
      localImg: 'assets/img/0700-kitchen.jpg',
      remoteImg: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
      plate: 'PLATE 01 · HABITAT-IND',
      telemetry: 'CAMERAS: 0 · PRESSURE SENSORS ONLY',
      coords: 'LAT 12.97° N · 77.59° E · 07:00 IST'
    },
    '09:30': {
      meta: '09:30 AM · NEIGHBORHOOD SHALA · IMAGINED SCENARIO · 2045',
      title: 'Making Invisible Physics Visible',
      story: 'Ten-year-old Aarav is building a bamboo-strip arch bridge with three classmates. When their span keeps twisting, they ask their table’s learning companion why. Instead of handing them the answer, an overhead lamp projects gentle stress lines directly onto their bamboo splints, letting the children see how weight flows into the riverbanks as they press on the bridge with their own hands.',
      detail: 'There is glue on their fingers and lively debate around the table. The software never grades their chatter; it gives them a lens to discover the answer together.',
      localImg: 'assets/img/0930-school.jpg',
      remoteImg: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
      plate: 'PLATE 02 · STUDIO-B',
      telemetry: 'OPTICAL PROJECTION · ZERO GRADING SURVEILLANCE',
      coords: 'LAT 12.98° N · 77.60° E · 09:30 IST'
    },
    '12:00': {
      meta: '12:00 PM · COMMUNITY HEALTH CLINIC · IMAGINED SCENARIO · 2045',
      title: 'Twenty Unhurried Minutes With the Doctor',
      story: 'Dr. Kavita Rao sits with a local weaver whose chronic joint inflammation has puzzled clinics for years. Using a rapid cellular assay, the clinic’s diagnostic tool compares her immune markers against millions of molecular pathways and flags a subtle protein trigger. Because the software handled the three hours of chart paperwork, Dr. Rao spends twenty unhurried minutes simply listening to her patient.',
      detail: 'High-speed biological analysis doesn’t make the appointment faster and colder; it buys back time for human conversation.',
      localImg: 'assets/img/1200-clinic.jpg',
      remoteImg: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80',
      plate: 'PLATE 03 · CLINIC-C',
      telemetry: 'ASSAY TIME: 11 SEC · CONSULTATION: 20 MIN',
      coords: 'LAT 28.61° N · 77.20° E · 12:00 IST'
    },
    '15:30': {
      meta: '03:30 PM · SUNDARBANS MANGROVE ESTUARY · IMAGINED SCENARIO · 2045',
      title: 'Sharing the Heavy Load in the Estuary',
      story: 'Along a recovering delta coastline, ecologists and young apprentices are planting native mangrove saplings to buffer cyclone surges. Two legged utility rovers wade through knee-deep tidal mud carrying heavy coir baskets and biodegradable seed mats, taking the back-breaking strain off the human crew while stepping carefully around mudskipper burrows.',
      detail: 'The crew finishes the afternoon with mud on their boots, healthy backs, and pride in watching the kingfishers return to their coastline.',
      localImg: 'assets/img/1530-marsh.jpg',
      remoteImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
      plate: 'PLATE 04 · ESTUARY-D',
      telemetry: 'ROVER PAYLOAD: 140 KG · BURROW AVOIDANCE: ACTIVE',
      coords: 'LAT 21.94° N · 88.89° E · 15:30 IST'
    },
    '20:00': {
      meta: '08:00 PM · THE COURTYARD VERANDA · IMAGINED SCENARIO · 2045',
      title: 'The Brass Switch by the Door',
      story: 'As monsoon rain begins to tap on the clay roof tiles, Raghav, his daughter, and Aarav gather around a wooden table for dinner. On his way to the veranda, Raghav flips a heavy brass toggle switch by the door, physically cutting power to every ambient sensor and assistant in the house. For the rest of the evening, there are no notifications, no summaries, and no screens.',
      detail: 'The truest sign of a humane technological future is how effortlessly it lets you turn it off.',
      localImg: 'assets/img/2000-porch.jpg',
      remoteImg: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
      plate: 'PLATE 05 · COMMONS-E',
      telemetry: 'HARDWARE CUTOFF: ENGAGED · OFFLINE SANCTUARY',
      coords: 'LAT 12.97° N · 77.59° E · 20:00 IST'
    }
  };

  const cImage = document.getElementById('cImage');
  const chronicleStage = document.getElementById('chronicleStage');
  const hourButtons = Array.from(document.querySelectorAll('[data-hour]'));

  function loadSmartChronicleImage(item) {
    if (!cImage) return;
    cImage.onerror = function () {
      if (cImage.src.indexOf(item.remoteImg) === -1) {
        cImage.src = item.remoteImg;
      } else {
        cImage.onerror = null;
        cImage.src = createArchivalFallbackSvg(item.plate, item.title);
      }
    };
    cImage.src = item.localImg;
  }

  function activateChronicleHour(btn) {
    const d = chronicleData[btn.getAttribute('data-hour')];
    if (!d) return;
    playTactileClick(215);
    hourButtons.forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });
    document.getElementById('cMeta').textContent = d.meta;
    document.getElementById('cTitle').textContent = d.title;
    document.getElementById('cStory').textContent = d.story;
    document.getElementById('cDetail').textContent = d.detail;

    const plateEl = document.getElementById('cPlateId');
    const telEl = document.getElementById('cTelemetry');
    const coordEl = document.getElementById('cCoords');
    if (plateEl) plateEl.textContent = d.plate;
    if (telEl) telEl.textContent = d.telemetry;
    if (coordEl) coordEl.textContent = d.coords;

    loadSmartChronicleImage(d);
    animateSwap(chronicleStage);
  }

  loadSmartChronicleImage(chronicleData['07:00']);
  hourButtons.forEach(btn => {
    btn.addEventListener('click', () => activateChronicleHour(btn));
  });

  // Chapter 04: ethical principles
  const pContent = {
    dignity: {
      h: 'Machines handle the heavy lifting so people have unhurried time for care.',
      b: 'Putting Dignity first means we refuse to use algorithms to turn nurses, teachers, or logistics workers into timed cogs. Hospital rovers move heavy supply carts so nurses can sit unhurried beside frightened patients, and every high-stakes medical or legal choice requires human accountability.'
    },
    freedom: {
      h: 'Your inner thoughts, emotions, and biological data belong solely to you.',
      b: 'As wearables and neural sensors advance, Cognitive Freedom sets an unbreakable boundary around the human mind. Assistive devices must process signals locally on hardware owned by the patient, with physical cutoff switches and zero commercial harvesting.'
    },
    fairness: {
      h: 'Breakthroughs in healing and learning reach rural clinics before luxury markets.',
      b: 'A cure is not a triumph if it is priced only for the wealthy. Universal Access ties public investment in AI diagnostics and cellular therapies to open licensing, so a child in a district clinic receives the same standard of care as a major metro hospital.'
    },
    sustainability: {
      h: 'Every datacenter and bioreactor must help repair the living Earth.',
      b: 'We cannot build a thriving future on an exhausted planet. Biosphere Repair directs AI and synthetic biology toward circular materials, drought-resilient crops, and enzymatic plastic recycling, while holding compute infrastructure to strict clean-energy budgets.'
    },
    opportunity: {
      h: 'Productivity gains translate into lifelong learning, local craft, and family time.',
      b: 'When automation multiplies economic output, the dividend should belong to everyone. Shared Time uses adaptive tools to help workers master new crafts while channeling technological wealth into shorter workweeks, community studios, and arts.'
    }
  };

  const principleOutput = document.getElementById('principleOutput');
  document.querySelectorAll('[data-p]').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = pContent[btn.getAttribute('data-p')];
      if (!d) return;
      playTactileClick(200);
      document.querySelectorAll('[data-p]').forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      document.getElementById('pHead').textContent = d.h;
      document.getElementById('pBody').textContent = d.b;
      animateSwap(principleOutput);
    });
  });

  // Chapter 05: broadsheet composer, print seal & clipboard copy
  const wIntel = document.getElementById('wIntel');
  const wWell = document.getElementById('wWell');
  const wEarth = document.getElementById('wEarth');
  const wBond = document.getElementById('wBond');
  const bSeal = document.getElementById('bSeal');
  const stampBroadsheetBtn = document.getElementById('stampBroadsheetBtn');
  const copyCharterBtn = document.getElementById('copyCharterBtn');
  const broadsheetStamp = document.getElementById('broadsheetStamp');
  const stampHash = document.getElementById('stampHash');
  const stampFeedback = document.getElementById('stampFeedback');

  function updateComposer() {
    if (!wIntel || !wWell || !wEarth || !wBond) return;
    const i = parseInt(wIntel.value, 10);
    const w = parseInt(wWell.value, 10);
    const e = parseInt(wEarth.value, 10);
    const b = parseInt(wBond.value, 10);

    document.getElementById('nIntel').textContent = i;
    document.getElementById('nWell').textContent = w;
    document.getElementById('nEarth').textContent = e;
    document.getElementById('nBond').textContent = b;

    const sum = i + w + e + b;
    document.getElementById('seg1').style.width = ((i / sum) * 100).toFixed(1) + '%';
    document.getElementById('seg2').style.width = ((w / sum) * 100).toFixed(1) + '%';
    document.getElementById('seg3').style.width = ((e / sum) * 100).toFixed(1) + '%';
    document.getElementById('seg4').style.width = ((b / sum) * 100).toFixed(1) + '%';

    const code = `${i}${w}${e}${b}`;
    if (bSeal) bSeal.textContent = `SEAL #TG-2045-${code.slice(0, 4)}`;

    const avg = sum / 4;
    const spread = (Math.abs(i - avg) + Math.abs(w - avg) + Math.abs(e - avg) + Math.abs(b - avg)) / 4;

    let out;
    if (spread < 10 && avg >= 70) {
      out = {
        ed: 'COMPOSED EDITION · BALANCED PRIORITIES',
        title: 'A Quietly Capable Commonwealth',
        desc: 'You have imagined a world where advanced science and cellular medicine work quietly beneath a warm, unhurried public life. Technology is judged not by spectacle, but by how many healthy years and quiet evenings it returns to families and neighborhoods.',
        tech: '<strong>Primary technologies:</strong> Co-reasoning scientific AI, preventative cellular diagnostics, enzymatic recycling, and hardware privacy switches.',
        ethics: 'Making sure that preventative health sensors and helpful ambient systems never turn into subtle pressure to optimize every quiet hour of private life.',
        action: 'Fund open-source medical research, pass strict on-device privacy laws for wearables, and protect screen-free neighborhood gathering spaces.'
      };
    } else if (i >= w && i >= e && i >= b) {
      out = {
        ed: 'COMPOSED EDITION · LED BY DISCOVERY',
        title: 'The Great Scientific Commons',
        desc: 'Your world places open curiosity and shared discovery at the center of public life. Global research libraries and simulation labs work together to unlock clean energy materials, rare-disease cures, and deep-ocean science.',
        tech: '<strong>Primary technologies:</strong> Open science models, molecular and material simulators, universal tutoring companions, and public research archives.',
        ethics: 'Preventing a divide between technical specialists and the broader public, and making sure rapid discovery never outpaces ecological safety.',
        action: 'Build publicly funded AI research libraries open to every school and university, with transparent safety audits before deployment.'
      };
    } else if (w >= i && w >= e && w >= b) {
      out = {
        ed: 'COMPOSED EDITION · LED BY PUBLIC HEALTH',
        title: 'A Sanctuary of Care and Longevity',
        desc: 'You have prioritized the healing of the human body and the dignity of every stage of life. Neighborhood clinics focus on early cellular repair, soft exosuits help older adults live independently, and caregiving is honored as society’s most important work.',
        tech: '<strong>Primary technologies:</strong> Precision gene and RNA therapies, soft mobility exosuits, tactile neural prosthetics, and community health studios.',
        ethics: 'Guaranteeing that regenerative treatments and assistive interfaces are universally covered rather than becoming a privilege of wealth.',
        action: 'Expand public funding for rare-disease and assistive-robotics trials, and design clinical tools directly with nurses and patients.'
      };
    } else if (e >= i && e >= w && e >= b) {
      out = {
        ed: 'COMPOSED EDITION · LED BY ECOLOGICAL REPAIR',
        title: 'The Regenerative Biosphere',
        desc: 'In the future you built, industry takes its cues from forests and watersheds. Synthetic biology replaces petrochemicals with living materials, field rovers help rewild coastlines, and cities operate as clean circular ecosystems.',
        tech: '<strong>Primary technologies:</strong> Enzymatic plastic and carbon cycling, coastal restoration rovers, biodegradable electronics, and low-energy computing.',
        ethics: 'Practicing deep ecological humility by requiring strict biological containment on engineered microbes so wild ecosystems remain safe.',
        action: 'Tie AI and biotech research grants to measurable biodiversity and carbon goals, and enforce universal right-to-repair laws.'
      };
    } else {
      out = {
        ed: 'COMPOSED EDITION · LED BY HUMAN CONNECTION',
        title: 'The Unhurried Republic',
        desc: 'You have chosen a future where human relationships, local craft, and mental sanctuary come first. Technology is deliberately calm, modest, and strictly bounded, automating drudgery in the background so people can gather in workshops, parks, and around dinner tables.',
        tech: '<strong>Primary technologies:</strong> Calm screen-free interfaces, on-device privacy firewalls, community craft automation, and protected offline hours.',
        ethics: 'Making sure that communities who choose a slower, low-tech rhythm of life still enjoy full access to modern medicine and economic security.',
        action: 'Protect screen-free childhood education, outlaw attention-harvesting feeds, and invest in public libraries, parks, and local maker studios.'
      };
    }

    document.getElementById('bEdition').textContent = out.ed;
    document.getElementById('bTitle').textContent = out.title;
    document.getElementById('bDesc').textContent = out.desc;
    document.getElementById('bTech').innerHTML = out.tech;
    document.getElementById('bEthics').textContent = out.ethics;
    document.getElementById('bAction').textContent = out.action;
  }

  [wIntel, wWell, wEarth, wBond].forEach(el => {
    if (el) el.addEventListener('input', updateComposer);
  });

  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      playTactileClick(230);
      const v = btn.getAttribute('data-preset').split(',').map(Number);
      wIntel.value = v[0];
      wWell.value = v[1];
      wEarth.value = v[2];
      wBond.value = v[3];
      updateComposer();
      animateSwap(document.getElementById('broadsheetPage'));
    });
  });

  if (stampBroadsheetBtn) {
    stampBroadsheetBtn.addEventListener('click', () => {
      playTactileClick(275);
      const code = `${wIntel.value}-${wWell.value}-${wEarth.value}-${wBond.value}`;
      if (broadsheetStamp) broadsheetStamp.classList.add('stamped');
      if (stampHash) stampHash.textContent = `CHARTER #TG-${code} · VERIFIED`;
      if (stampFeedback) stampFeedback.textContent = `✓ Broadsheet sealed with Charter #TG-${code}. Opening print view...`;
      setTimeout(() => {
        window.print();
      }, 350);
    });
  }

  if (copyCharterBtn) {
    copyCharterBtn.addEventListener('click', () => {
      playTactileClick(245);
      const code = `${wIntel.value}-${wWell.value}-${wEarth.value}-${wBond.value}`;
      const title = document.getElementById('bTitle').textContent.trim();
      const desc = document.getElementById('bDesc').textContent.trim();
      const summary = `TechnoGenesis 2045 Charter (#TG-${code}): ${title} — ${desc}`;
      if (broadsheetStamp) broadsheetStamp.classList.add('stamped');
      if (stampHash) stampHash.textContent = `CHARTER #TG-${code} · COPIED`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summary).then(() => {
          if (stampFeedback) stampFeedback.textContent = `✓ Copied Charter #TG-${code} summary to clipboard!`;
        }).catch(() => {
          if (stampFeedback) stampFeedback.textContent = `✓ Charter #TG-${code} generated!`;
        });
      } else if (stampFeedback) {
        stampFeedback.textContent = `✓ Charter #TG-${code} generated!`;
      }
    });
  }

  updateComposer();

  // Keyboard shortcuts (Escape to unlock modal, 1-5 for Chapter 03 timeline)
  window.addEventListener('keydown', e => {
    const inInput = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');

    if (e.key === 'Escape') {
      if (captchaModal && !captchaModal.classList.contains('unlocked')) {
        unlockSite('✓ Keyboard bypass recognized. Opening monograph...');
      }
      return;
    }

    if (inInput) return;

    if (['1', '2', '3', '4', '5'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      if (hourButtons[idx]) activateChronicleHour(hourButtons[idx]);
    }
  });
})();