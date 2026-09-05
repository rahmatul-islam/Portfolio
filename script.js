/* ==========================================================================
   RAHMATUL ISLAM (RATUL) — PORTFOLIO SCHEMATIC INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     01. BILINGUAL DICTIONARY (BENGALI & ENGLISH)
     ------------------------------------------------------------------------ */
  const i18n = {
    bn: {
      nav_about: '01 // পরিচিতি',
      nav_skills: '02 // দক্ষতা ও ফ্লো',
      nav_work: '03 // স্কিমেটিক্স',
      nav_exp: '04 // রিভিশন লগ',
      nav_contact: '05 // যোগাযোগ',
      theme_btn: 'থিম',
      tb_name: 'প্রকৌশলী',
      tb_disc: 'বিষয়',
      hero_tag: '// SWE আন্ডারগ্রাজুয়েট — লেভেল ২ টার্ম ২, বাংলাদেশ',
      hero_title_1: 'Building',
      hero_title_2: 'Software,',
      hero_title_3: 'Structurally.',
      hero_sub: 'আমি বিশ্বাস করি, Software Engineering শুধু code লেখা নয়—এটি মানুষের বাস্তব সমস্যাকে বোঝা, সেটিকে ছোট ছোট অংশে ভেঙে দেখা, এবং একটি সহজ, নির্ভরযোগ্য ও অর্থবহ সমাধান তৈরি করার প্রক্রিয়া।',
      btn_projects: 'প্রজেক্ট স্কিমেটিক্স',
      btn_resume: 'রিজিউমি ডাউনলোড',
      m_projects: 'সিস্টেম প্রজেক্টস',
      m_dsa: 'ডিএসএ সমস্যা সমাধান',
      sch_header: 'সিস্টেম টপোলজি সিমুলেটর v1.0',
      sch_ping: 'পিং নোডস',
      sec_about: '01 // আর্কিটেকচারাল পটভূমি',
      about_head: 'Engineering Philosophy',
      about_p1: 'আমি বিশ্বাস করি, Software Engineering শুধু code লেখা নয়—এটি মানুষের বাস্তব সমস্যাকে বোঝা, সেটিকে ছোট ছোট অংশে ভেঙে দেখা, এবং একটি সহজ, নির্ভরযোগ্য ও অর্থবহ সমাধান তৈরি করার প্রক্রিয়া।',
      about_p2: 'আমি এমন সফটওয়্যার তৈরি করতে আগ্রহী, যা শুধু কাজই করে না, বরং ব্যবহারকারী ও ডেভেলপার—দুজনের জন্যই পরিষ্কার, রক্ষণাবেক্ষণযোগ্য এবং সময়ের সঙ্গে উন্নত করা সহজ হয়। আমার কাছে ভালো code মানে কেবল complex logic নয়; ভালো code মানে clarity, consistency, thoughtful design এবং দায়িত্বশীল সিদ্ধান্ত।',
      about_p3: 'Software Engineering নিয়ে পড়াশোনার পাশাপাশি আমি প্রতিদিন programming-এর ভিত্তিগুলো আরও গভীরভাবে শেখার চেষ্টা করি। বিশেষভাবে আমার আগ্রহ রয়েছে backend development, API design, problem solving, software architecture, databases এবং আধুনিক development workflow নিয়ে।',
      about_p4: 'আমি বিশ্বাস করি, শক্তিশালী সফটওয়্যার তৈরি হয় ধৈর্য, নিয়মিত অনুশীলন এবং শেখার মানসিকতা থেকে। তাই Data Structures & Algorithms অনুশীলন, ছোট ছোট প্রজেক্ট তৈরি, GitHub-এ কাজ করা এবং open-source culture বোঝার মাধ্যমে নিজেকে প্রতিনিয়ত উন্নত করার চেষ্টা করি।',
      about_p5: 'আমার লক্ষ্য শুধু একজন programmer হওয়া নয়—এমন একজন software engineer হওয়া, যিনি প্রযুক্তির মাধ্যমে মানুষের জন্য বাস্তব মূল্য তৈরি করতে পারেন; যিনি শেখেন, শেয়ার করেন, এবং একটি ভালো solution তৈরির আগে সমস্যাটিকে সত্যিকারভাবে বুঝতে চেষ্টা করেন।',
      spec_title: 'স্পেসিফিকেশন ম্যাট্রিক্স',
      k_name: 'পূর্ণ নাম',
      k_nick: 'ডাকনাম',
      k_degree: 'ডিগ্রি ও টার্ম',
      k_institute: 'বিশ্ববিদ্যালয়',
      k_focus: 'প্রধান ফোকাস',
      k_status: 'বর্তমান স্ট্যাটাস',
      v_avail: 'গ্রীষ্ম / শরৎ ২০২৬ ইন্টার্নশিপ ও প্রজেক্টের জন্য প্রস্তুত',
      sec_skills: '02 // দক্ষতা ও স্ট্যাক ডিপেন্ডেন্সি ম্যাপ',
      skills_head: 'টেকনিক্যাল স্ট্যাক স্কিমেটিক্স',
      skills_desc: 'নিচের টেকনোলজি ট্যাগে মাউস হভার করলে দেখতে পাবেন কীভাবে প্রতিটি প্রযুক্তি একে অপরের সাথে সিস্টেম আর্কিটেকচারে অ্যারো ভেক্টরের মাধ্যমে সংযুক্ত।',
      sg_lang: 'প্রোগ্রামিং ল্যাঙ্গুয়েজ',
      sg_frameworks: 'ফ্রেমওয়ার্ক, স্টোরেজ ও ডেভঅপস',
      sg_learning: 'চলমান গবেষণা ও আরঅ্যান্ডডি',
      sec_work: '03 // প্রজেক্ট ব্লুপ্রিন্টস',
      proj_head: 'নির্বাচিত প্রজেক্ট স্কিমেটিক্স',
      proj_desc: 'প্রতিটি প্রজেক্ট কোনো না কোনো রিয়েল-ওয়ার্ল্ড প্রকৌশল জটিলতা নিরসনের সচেষ্ট প্রচেষ্টা — মেমরি অপ্টিমাইজেশন থেকে শুরু করে কনকারেন্ট মেসেজিং পর্যন্ত।',
      f_all: 'সকল স্কিমেটিক্স (০৪)',
      f_dist: 'ডিস্ট্রিবিউটেড ও ব্যাকএন্ড',
      f_full: 'ফুল-স্ট্যাক',
      f_ml: 'এমএল ও ফাস্ট-এপিআই',
      p1_desc: 'একটি lightweight high-concurrency job scheduler যা একাধিক worker নোডের মধ্যে task ডিস্ট্রিবিউট করে, worker ফেইল করলে Heartbeat detection ও automatic retry নিশ্চিত করে।',
      p2_desc: 'বিশ্ববিদ্যালয়ের শিক্ষার্থীদের ব্যবহৃত বই ও ল্যাব ইকুইপমেন্ট কেনাবেচার সুরক্ষিত প্ল্যাটফর্ম — যেখানে JWT Auth, PostgreSQL Full-Text Search এবং ইমেজ ক্যাশিং ইমপ্লিমেন্ট করা হয়েছে।',
      p3_desc: 'WebSocket-ভিত্তিক ডিস্ট্রিবিউটেড চ্যাট ইঞ্জিন যা Redis Adapter দিয়ে ক্লাস্টার স্কেলিং, Presence tracking এবং Message Ack & Retry Guarantee নিশ্চিত করে।',
      p4_desc: 'TF-IDF এবং TF-Vector Cosine Similarity অ্যালগরিদম ব্যবহার করে রেজুমি থেকে কী-ওয়ার্ড ও এক্সপেরিয়েন্স এক্সট্র্যাক্ট করে স্কোরের ভিত্তিতে সর্টিং করার অটোমেটেড পাইপলাইন।',
      p_details: 'সিস্টেম স্পেক দেখুন',
      sec_exp: '04 // ইঞ্জিনিয়ারিং লগ ও রিভিশনস',
      exp_head: 'পরিবর্তন লগ ও মাইলফলক',
      th_date: 'সময়কাল',
      th_role: 'ভূমিকা / মাইলফলক',
      th_org: 'প্রতিষ্ঠান',
      th_status: 'স্ট্যাটাস',
      r3_title: 'বিএসএসসি ইন সফটওয়্যার ইঞ্জিনিয়ারিং — লেভেল ২, টার্ম ২',
      r3_desc: 'সফটওয়্যার আর্কিটেকচার, ব্যাকএন্ড সিস্টেম, ডাটাবেস ডিজাইন ও হাই-পারফর্ম্যান্স API ডেভেলপমেন্ট।',
      r2_title: 'অ্যালগরিদম ও ওপেন-সোর্স অবদান',
      r2_desc: '৬০০+ ডাটা স্ট্রাকচার ও অ্যালগরিদম সমস্যা সমাধান; ফুল-স্ট্যাক প্রজেক্ট ও ব্যাকএন্ড সিস্টেম নির্মাণ।',
      r1_title: 'সফটওয়্যার ইঞ্জিনিয়ারিং-এ ভর্তি',
      r1_desc: 'কম্পিউটার সায়েন্স ফান্ডামেন্টালস, C/C++, Python এবং অবজেক্ট-ওরিয়েন্টেড সফটওয়্যার ইঞ্জিনিয়ারিং চর্চার সূচনা।',
      sec_contact: '05 // ট্রান্সমিশন ও যোগাযোগ',
      c_title: 'চলুন মজবুত সফটওয়্যার বানাই —',
      c_sub: 'আপনি কি ব্যাকএন্ড ইঞ্জিনিয়ারিং ইন্টার্নশিপ, সিস্টেম আর্কিটেকচার রিভিউ বা কোনো নতুন ওপেন-সোর্স প্রজেক্ট নিয়ে আলোচনা করতে চান? ইমেইল বা লিঙ্কডইনে বার্তা পাঠাতে পারেন।',
      c_res_btn: 'রিজিউমি (পিডিএফ)',
      foot_built: 'ভ্যানিলা HTML/CSS/JS এবং SVG ভেক্টর স্কিমেটিক্স দ্বারা তৈরি'
    },
    en: {
      nav_about: '01 // About',
      nav_skills: '02 // Skills & Flow',
      nav_work: '03 // Schematics',
      nav_exp: '04 // Revision Log',
      nav_contact: '05 // Contact',
      theme_btn: 'Theme',
      tb_name: 'ENGINEER',
      tb_disc: 'DISCIPLINE',
      hero_tag: '// SWE UNDERGRADUATE — LEVEL 2 TERM 2, BANGLADESH',
      hero_title_1: 'Building',
      hero_title_2: 'Software,',
      hero_title_3: 'Structurally.',
      hero_sub: 'I believe Software Engineering is not just about writing code—it is the process of understanding real human problems, breaking them down, and creating simple, reliable, and meaningful solutions.',
      btn_projects: 'View Schematics',
      btn_resume: 'Download Résumé',
      m_projects: 'System Projects',
      m_dsa: 'DSA Problems',
      sch_header: 'SYSTEM TOPOLOGY SIMULATOR v1.0',
      sch_ping: 'PING ALL NODES',
      sec_about: '01 // Architectural Background',
      about_head: 'Engineering Philosophy',
      about_p1: 'I believe Software Engineering is not just about writing code—it is the process of understanding real human problems, breaking them down into manageable components, and creating simple, reliable, and meaningful solutions.',
      about_p2: 'I am passionate about building software that doesn\'t just work, but remains clean, maintainable, and easy to evolve for both users and developers. To me, great code isn\'t merely complex logic; great code means clarity, consistency, thoughtful design, and responsible decision-making.',
      about_p3: 'Alongside my Software Engineering studies, I strive to deepen my understanding of core programming fundamentals every day. My key interests lie in backend development, API design, problem-solving, software architecture, databases, and modern development workflows.',
      about_p4: 'I believe resilient software comes from patience, consistent practice, and a continuous learning mindset. I actively refine my craft through Data Structures & Algorithms practice, building system projects, collaborating on GitHub, and embracing open-source culture.',
      about_p5: 'My goal is not merely to be a programmer—but to become a software engineer who creates real human value through technology: someone who learns, shares, and truly understands a problem before engineering a solution.',
      spec_title: 'SPECIFICATION MATRIX',
      k_name: 'FULL NAME',
      k_nick: 'NICKNAME',
      k_degree: 'DEGREE & TERM',
      k_institute: 'UNIVERSITY',
      k_focus: 'PRIMARY FOCUS',
      k_status: 'CURRENT STATUS',
      v_avail: 'Available for Summer / Autumn 2026 Internships & Collaborations',
      sec_skills: '02 // Skills & Stack Dependency Map',
      skills_head: 'Technical Stack Schematics',
      skills_desc: 'Hover over tech tags to visually inspect how components connect to each other across backend architectural layers.',
      sg_lang: 'Programming Languages',
      sg_frameworks: 'Frameworks, Storage & DevOps',
      sg_learning: 'Active Engineering Research',
      sec_work: '03 // Project Blueprints',
      proj_head: 'Selected System Schematics',
      proj_desc: 'Each project addresses a real-world engineering challenge — from concurrent task distribution to realtime WebSocket state synchronization.',
      f_all: 'ALL SCHEMATICS (04)',
      f_dist: 'DISTRIBUTED & BACKEND',
      f_full: 'FULL-STACK',
      f_ml: 'ML & FASTAPI',
      p1_desc: 'Lightweight high-concurrency job scheduler distributing tasks across worker nodes with Heartbeat monitoring and automatic retries.',
      p2_desc: 'Secure campus peer marketplace featuring JWT Auth, PostgreSQL Full-Text Search, and image caching for 400+ active student users.',
      p3_desc: 'Distributed WebSocket chat server engine with Redis Pub/Sub multi-instance scaling and message delivery guarantees.',
      p4_desc: 'Automated resume parsing & matching pipeline using TF-IDF and Cosine Similarity vector scores built with Python & FastAPI.',
      p_details: 'View System Spec',
      sec_exp: '04 // Engineering Log & Revisions',
      exp_head: 'Changelog & Milestones',
      th_date: 'TIMEFRAME',
      th_role: 'ROLE / MILESTONE',
      th_org: 'ORGANIZATION',
      th_status: 'STATUS',
      r3_title: 'B.Sc. in Software Engineering — Level 2, Term 2',
      r3_desc: 'Software architecture, backend systems, database design & high-performance REST/gRPC API development.',
      r2_title: 'Algorithms & Open Source Core',
      r2_desc: 'Solved 600+ Data Structures & Algorithms problems; built full-stack campus platforms and background schedulers.',
      r1_title: 'Admitted to Software Engineering (SWE)',
      r1_desc: 'Initiated computer science fundamentals, C/C++, Python & object-oriented software engineering paradigms.',
      sec_contact: '05 // Transmission & Contact',
      c_title: 'Let\'s build reliable software —',
      c_sub: 'Interested in backend engineering internships, architecture reviews, or open-source collaboration? Feel free to reach out via email or LinkedIn.',
      c_res_btn: 'Résumé (PDF)',
      foot_built: 'BUILT WITH VANILLA HTML/CSS/JS & SVG VECTOR SCHEMATICS'
    }
  };

  let currentLang = 'bn';

  function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn' : 'en');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });

    document.getElementById('langBn').classList.toggle('active', lang === 'bn');
    document.getElementById('langEn').classList.toggle('active', lang === 'en');

    try { localStorage.setItem('ratul_lang', lang); } catch (e) {}
  }

  // Restore the visitor's previously chosen language (defaults to Bangla).
  let savedLang = null;
  try { savedLang = localStorage.getItem('ratul_lang'); } catch (e) {}
  if (savedLang === 'en' || savedLang === 'bn') updateLanguage(savedLang);

  document.getElementById('langToggle')?.addEventListener('click', () => {
    playSound(600, 0.05);
    updateLanguage(currentLang === 'bn' ? 'en' : 'bn');
  });

  /* ------------------------------------------------------------------------
     02. AUDIO SYNTHESIZER
     ------------------------------------------------------------------------ */
  let soundMuted = true;
  const audioToggleBtn = document.getElementById('audioToggle');

  audioToggleBtn?.addEventListener('click', () => {
    soundMuted = !soundMuted;
    audioToggleBtn.classList.toggle('sound-muted', soundMuted);
    if (!soundMuted) playSound(800, 0.1);
    showToast(soundMuted ? '🔊 Sound Muted' : '🔊 Sound Enabled');
  });

  // A single shared AudioContext — creating one per beep leaks contexts and
  // browsers cap concurrent contexts (~6), after which all sounds die.
  let sharedAudioCtx = null;

  function playSound(freq = 440, duration = 0.08, type = 'sine') {
    if (soundMuted) return;
    try {
      if (!sharedAudioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        sharedAudioCtx = new Ctx();
      }
      if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();

      const osc = sharedAudioCtx.createOscillator();
      const gain = sharedAudioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, sharedAudioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, sharedAudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, sharedAudioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(sharedAudioCtx.destination);
      osc.start();
      osc.stop(sharedAudioCtx.currentTime + duration);
    } catch (e) {}
  }

  /* ------------------------------------------------------------------------
     03. CUSTOM CURSOR & COORDINATES
     ------------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorCoords = document.getElementById('cursorCoords');
  const tbCoords = document.getElementById('tbCoords');

  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot && cursorRing) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorRing.style.left = `${mouseX}px`;
      cursorRing.style.top = `${mouseY}px`;
    }

    const coordStr = `X:${String(mouseX).padStart(3, '0')} Y:${String(mouseY).padStart(3, '0')}`;
    if (cursorCoords) cursorCoords.textContent = coordStr;
    if (tbCoords) tbCoords.textContent = coordStr;

    updateStampCompass(mouseX, mouseY);
  });

  function updateStampCompass(mx, my) {
    const stampEl = document.getElementById('interactiveStamp');
    const stampArrow = document.getElementById('stampCompassArrow');
    if (!stampEl || !stampArrow) return;

    const rect = stampEl.getBoundingClientRect();
    const stampX = rect.left + rect.width / 2;
    const stampY = rect.top + rect.height / 2;

    const rad = Math.atan2(my - stampY, mx - stampX);
    const deg = rad * (180 / Math.PI) + 90;
    stampArrow.setAttribute('transform', `translate(90, 90) rotate(${deg})`);
  }

  document.querySelectorAll('a, button, .tag, .sch-node-group, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.style.transform = 'translate(-50%, -50%) scale(1.4)';
      playSound(520, 0.04);
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  /* ------------------------------------------------------------------------
     04. BACKGROUND CANVAS GRID
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Resolve canvas colors from the active theme's CSS variables so the
    // background follows theme switches instead of staying Blueprint Cyan.
    function hexToRgbTriplet(hex) {
      const m = /^#?([0-9a-fA-F]{6})$/.exec(hex || '');
      if (!m) return null;
      const n = parseInt(m[1], 16);
      return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    }

    function readCanvasColors() {
      const s = getComputedStyle(document.documentElement);
      return {
        accent2: s.getPropertyValue('--accent-2-rgb').trim() || '94, 234, 212',
        paper: hexToRgbTriplet(s.getPropertyValue('--paper').trim()) || '14, 28, 46'
      };
    }

    let canvasColors = readCanvasColors();
    new MutationObserver(() => { canvasColors = readCanvasColors(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 180);
      gradient.addColorStop(0, `rgba(${canvasColors.accent2}, 0.08)`);
      gradient.addColorStop(1, `rgba(${canvasColors.paper}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = `rgba(${canvasColors.accent2}, 0.4)`;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  /* ------------------------------------------------------------------------
     04b. MOBILE NAVIGATION TOGGLE
     ------------------------------------------------------------------------ */
  const mainNav = document.getElementById('mainNav');
  const navBurger = document.getElementById('navBurger');

  navBurger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = mainNav?.classList.toggle('nav-open');
    navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
    playSound(520, 0.05);
  });

  mainNav?.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      navBurger?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------------
     05. INTERACTIVE SCHEMATIC SIMULATOR
     ------------------------------------------------------------------------ */
  const schLogContent = document.getElementById('schLogContent');

  document.querySelectorAll('.sch-node-group').forEach(group => {
    group.addEventListener('click', () => {
      const nodeName = group.getAttribute('data-node-name') || 'Node';
      playSound(700, 0.1);

      const rect = group.querySelector('rect, polygon, ellipse, path');
      if (rect) {
        rect.style.stroke = 'var(--accent)';
        setTimeout(() => rect.style.stroke = '', 800);
      }

      if (schLogContent) {
        schLogContent.innerHTML = `<strong style="color:var(--accent)">[SELECTED]</strong> ${nodeName} — System operational. Latency 2.4ms.`;
      }
    });
  });

  document.getElementById('pulseSimBtn')?.addEventListener('click', () => {
    playSound(900, 0.2);
    showToast('⚡ Signal Pulse Sent Across All Nodes');

    document.querySelectorAll('.signal-pulse').forEach(p => {
      // Remember each pulse's own base radius — they don't all start at 3.5.
      if (!p.dataset.baseR) p.dataset.baseR = p.getAttribute('r') || '3.5';
      p.setAttribute('r', '7');
      setTimeout(() => p.setAttribute('r', p.dataset.baseR), 600);
    });

    if (schLogContent) {
      schLogContent.innerHTML = '<span style="color:var(--accent-2)">[PING_SURGE] All 7 Nodes Responded (200 OK) — System Health: 100%</span>';
    }
  });

  /* ------------------------------------------------------------------------
     06. THEME ACCENT SELECTOR ENGINE
     ------------------------------------------------------------------------ */
  const themeBtn = document.getElementById('themeBtn');
  const themeDropdown = document.querySelector('.theme-dropdown');
  const themeOpts = document.querySelectorAll('.theme-opt');

  themeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown?.classList.toggle('open');
    playSound(550, 0.05);
  });

  document.addEventListener('click', () => themeDropdown?.classList.remove('open'));

  // Dismiss the mobile nav when clicking anywhere outside of it.
  document.addEventListener('click', (e) => {
    if (mainNav?.classList.contains('nav-open') && !mainNav.contains(e.target)) {
      mainNav.classList.remove('nav-open');
      navBurger?.setAttribute('aria-expanded', 'false');
    }
  });

  themeOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-theme-set');
      document.documentElement.setAttribute('data-theme', theme);

      themeOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      localStorage.setItem('ratul_theme', theme);
      playSound(650, 0.1);
      showToast(`🎨 Theme switched to ${opt.textContent.trim()}`);
    });
  });

  const savedTheme = localStorage.getItem('ratul_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeOpts.forEach(o => {
      o.classList.toggle('active', o.getAttribute('data-theme-set') === savedTheme);
    });
  }

  /* ------------------------------------------------------------------------
     07. SKILL GRAPH CONNECTOR
     ------------------------------------------------------------------------ */
  const skillNodes = document.querySelectorAll('.skill-node');

  skillNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const connects = (node.getAttribute('data-connects') || '').split(',');

      node.classList.add('highlighted');

      skillNodes.forEach(other => {
        const otherTech = other.getAttribute('data-tech');
        if (connects.includes(otherTech)) {
          other.classList.add('highlighted');
        }
      });
    });

    node.addEventListener('mouseleave', () => {
      skillNodes.forEach(n => n.classList.remove('highlighted'));
    });
  });

  /* ------------------------------------------------------------------------
     08. PROJECT FILTERING ENGINE
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards = document.querySelectorAll('.proj-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playSound(580, 0.06);

      const filter = btn.getAttribute('data-filter');

      projCards.forEach(card => {
        const category = card.getAttribute('data-category');
        // Cancel any pending hide timer so quickly switching filters
        // can't leave cards stuck at display:none.
        clearTimeout(card._hideTimer);
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          card._hideTimer = setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     09. PROJECT SPECIFICATION MODALS
     ------------------------------------------------------------------------ */
  const projSpecs = {
    proj1: {
      title: 'Distributed Task Scheduler',
      fig: 'FIG. 01 // ARCHITECTURAL SPECIFICATION',
      tags: ['Go (Golang)', 'Redis', 'Docker', 'gRPC', 'Heartbeat Protocol'],
      body: `
        <h4>Architecture Overview</h4>
        <p>A distributed task execution engine designed to handle asynchronous background jobs across multiple worker nodes without a single point of failure.</p>
        <br>
        <h4>Key Technical Implementations</h4>
        <ul>
          <li><strong>Worker Heartbeat Monitoring:</strong> Master node maintains a Redis Hash with TTL ping records to auto-detect crashed worker instances.</li>
          <li><strong>Task Re-queueing Mechanism:</strong> Unacknowledged jobs are atomically re-assigned via Lua scripts in Redis.</li>
          <li><strong>gRPC Communication:</strong> High-performance binary serialization for inter-node communication.</li>
        </ul>
      `
    },
    proj2: {
      title: 'Campus Peer Marketplace',
      fig: 'FIG. 02 // ARCHITECTURAL SPECIFICATION',
      tags: ['React.js', 'Node.js', 'PostgreSQL', 'Express', 'JWT Auth'],
      body: `
        <h4>Architecture Overview</h4>
        <p>Full-stack marketplace created for 400+ UFTB university students to buy, sell, and exchange textbooks and engineering lab devices.</p>
        <br>
        <h4>Key Technical Implementations</h4>
        <ul>
          <li><strong>PostgreSQL Full-Text Search:</strong> Indexed search queries for instant title and ISBN lookups.</li>
          <li><strong>Security & Authentication:</strong> HttpOnly JWT cookie verification with rate-limiting middleware.</li>
        </ul>
      `
    },
    proj3: {
      title: 'Realtime Messaging Engine',
      fig: 'FIG. 03 // ARCHITECTURAL SPECIFICATION',
      tags: ['TypeScript', 'Socket.io', 'Redis Pub/Sub', 'Express'],
      body: `
        <h4>Architecture Overview</h4>
        <p>Horizontal-scaling WebSocket chat infrastructure supporting presence notifications and chat channels.</p>
        <br>
        <h4>Key Technical Implementations</h4>
        <ul>
          <li><strong>Redis Pub/Sub Adapter:</strong> Broadcasts messages across multiple Node.js WebSocket process instances.</li>
          <li><strong>Delivery Guarantees:</strong> Message sequence IDs with client-side optimistic updates and ACK retry timers.</li>
        </ul>
      `
    },
    proj4: {
      title: 'AI Resume Screener & Matcher',
      fig: 'FIG. 04 // ARCHITECTURAL SPECIFICATION',
      tags: ['Python 3', 'FastAPI', 'scikit-learn', 'NLP', 'PyMuPDF'],
      body: `
        <h4>Architecture Overview</h4>
        <p>Automated NLP resume screening engine deployed during the campus career fair to rank applicant resumes against job requirements.</p>
        <br>
        <h4>Key Technical Implementations</h4>
        <ul>
          <li><strong>Text Extraction & Normalization:</strong> PDF parsing via PyMuPDF with lemmatization and stop-word removal.</li>
          <li><strong>Vector Space Matching:</strong> TF-IDF matrix vectorization with Cosine Similarity scoring.</li>
        </ul>
      `
    }
  };

  const projModal = document.getElementById('projModal');
  const projModalBody = document.getElementById('projModalBody');
  const closeProjModalBtn = document.getElementById('closeProjModal');

  document.querySelectorAll('.modal-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-proj');
      const spec = projSpecs[projId];
      if (spec && projModalBody) {
        projModalBody.innerHTML = `
          <span class="proj-fig" style="display:block;margin-bottom:8px;">${spec.fig}</span>
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:26px;margin-bottom:16px;color:var(--ink);">${spec.title}</h2>
          <div class="stack-tags" style="margin-bottom:24px;">
            ${spec.tags.map(t => `<span>${t}</span>`).join('')}
          </div>
          <div class="modal-spec-text" style="color:var(--muted);line-height:1.8;">
            ${spec.body}
          </div>
        `;
        projModal?.classList.add('open');
        playSound(640, 0.1);
      }
    });
  });

  closeProjModalBtn?.addEventListener('click', () => projModal?.classList.remove('open'));

  /* ------------------------------------------------------------------------
     10. RESUME MODAL CONTROLLER
     ------------------------------------------------------------------------ */
  const resumeModal = document.getElementById('resumeModal');
  const openResumeModalBtn = document.getElementById('openResumeModal');
  const contactResumeTrigger = document.getElementById('contactResumeTrigger');
  const closeResumeModalBtn = document.getElementById('closeResumeModal');

  function openResume() {
    resumeModal?.classList.add('open');
    playSound(600, 0.1);
  }

  openResumeModalBtn?.addEventListener('click', openResume);
  contactResumeTrigger?.addEventListener('click', openResume);
  closeResumeModalBtn?.addEventListener('click', () => resumeModal?.classList.remove('open'));

  /* ------------------------------------------------------------------------
     11. INTERACTIVE TERMINAL HUD (Cmd+K)
     ------------------------------------------------------------------------ */
  const termModal = document.getElementById('termModal');
  const termTrigger = document.getElementById('termTrigger');
  const closeTermBtn = document.getElementById('closeTermBtn');
  const termInput = document.getElementById('termInput');
  const termOutput = document.getElementById('termOutput');

  function toggleTerminal() {
    termModal?.classList.toggle('open');
    if (termModal?.classList.contains('open')) {
      termInput?.focus();
      playSound(750, 0.1);
    }
  }

  termTrigger?.addEventListener('click', toggleTerminal);
  closeTermBtn?.addEventListener('click', () => termModal?.classList.remove('open'));

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggleTerminal();
    }
    if (e.key === 'Escape') {
      termModal?.classList.remove('open');
      projModal?.classList.remove('open');
      resumeModal?.classList.remove('open');
    }
  });

  termInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.value.trim().toLowerCase();
      termInput.value = '';
      executeCommand(cmd);
    }
  });

  // Escape user-provided strings before they touch innerHTML.
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function executeCommand(cmd) {
    if (!termOutput) return;

    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-ps1">ratul@uftb:~$</span> ${escapeHtml(cmd)}`;
    termOutput.appendChild(line);

    const res = document.createElement('div');
    res.className = 'term-line';

    switch (cmd) {
      case 'help':
        res.innerHTML = `Available HUD commands:<br>
          - <span class="term-cmd">skills</span>: List technical languages & systems<br>
          - <span class="term-cmd">projects</span>: Display architectural schematics<br>
          - <span class="term-cmd">contact</span>: View transmission channels<br>
          - <span class="term-cmd">matrix</span>: Display metrics<br>
          - <span class="term-cmd">theme [cyan|emerald|amber|amethyst]</span>: Switch accent color<br>
          - <span class="term-cmd">quote</span>: Random engineering wisdom<br>
          - <span class="term-cmd">clear</span>: Clear console buffer`;
        break;
      case 'skills':
        res.innerHTML = 'Languages: Go, Python, TS, C++, SQL. Frameworks: React, Node.js, PostgreSQL, Docker, Redis.';
        break;
      case 'projects':
        res.innerHTML = '1. Distributed Task Scheduler | 2. Campus Marketplace | 3. Realtime Chat Engine | 4. Resume Screener ML';
        break;
      case 'contact':
        res.innerHTML = 'Email: ratul@uftb.edu.bd | GitHub: github.com/rahmatul-islam | LinkedIn: linkedin.com/in/rahmatul-islam';
        break;
      case 'matrix':
        res.innerHTML = 'Name: Rahmatul Islam (Ratul) | Department: Software Engineering (Level 2 Term 2) | University: UFTB';
        break;
      case 'clear':
        termOutput.innerHTML = '';
        return;
      case 'quote':
        res.innerHTML = '<span style="color:var(--accent)">"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra</span>';
        break;
      default:
        if (cmd.startsWith('theme ')) {
          const t = cmd.split(' ')[1];
          if (['cyan', 'emerald', 'amber', 'amethyst'].includes(t)) {
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('ratul_theme', t);
            // Keep the palette dropdown's active marker in sync.
            themeOpts.forEach(o => o.classList.toggle('active', o.getAttribute('data-theme-set') === t));
            res.innerHTML = `Theme set to: ${escapeHtml(t)}`;
          } else {
            res.innerHTML = 'Invalid theme option. Use: cyan, emerald, amber, amethyst';
          }
        } else if (cmd !== '') {
          res.innerHTML = `Command not recognized: "${escapeHtml(cmd)}". Type <span class="term-cmd">help</span> for assistance.`;
        }
    }

    termOutput.appendChild(res);
    termOutput.scrollTop = termOutput.scrollHeight;
    playSound(500, 0.05);
  }

  /* ------------------------------------------------------------------------
     12. COPY EMAIL TOAST
     ------------------------------------------------------------------------ */
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  // Fallback for non-secure contexts / denied clipboard permission.
  function legacyCopyText(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  }

  copyEmailBtn?.addEventListener('click', () => {
    const email = 'ratul@uftb.edu.bd';
    const onOk = () => {
      playSound(800, 0.15);
      showToast('📋 Email copied to clipboard: ratul@uftb.edu.bd');
    };
    const onFail = () => showToast('❌ Copy failed — email: ratul@uftb.edu.bd');

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(onOk).catch(() => (legacyCopyText(email) ? onOk() : onFail()));
    } else {
      legacyCopyText(email) ? onOk() : onFail();
    }
  });

  function showToast(msg) {
    const box = document.getElementById('toastBox');
    if (!box) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `<span>${msg}</span>`;
    box.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ------------------------------------------------------------------------
     13. INTERSECTION OBSERVER & COUNTERS
     ------------------------------------------------------------------------ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .dim').forEach(el => io.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const valEl = entry.target;
        const target = parseFloat(valEl.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const step = target / 40;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          valEl.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
        }, 30);

        counterObserver.unobserve(valEl);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.metric-val').forEach(el => counterObserver.observe(el));

  /* ------------------------------------------------------------------------
     14. 3D TILT & PARALLAX ANIMATION ON CARDS
     ------------------------------------------------------------------------ */
  // Only run the tilt effect on devices with a real hover-capable pointer.
  // The inline transform used to permanently override the CSS :hover lift and
  // the inline transition override killed the .reveal fade — now the inline
  // transform is cleared on leave and transitions stay CSS-controlled
  // (see the .tilting helper class in styles.css).
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.proj-card, .spec-card, .schematic-card');

    tiltCards.forEach(card => {
      card.addEventListener('mouseenter', () => card.classList.add('tilting'));

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
        const rotateY = ((x - centerX) / centerX) * 5;  // max 5 deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.012, 1.012, 1.012)`;
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('tilting');
        card.style.transform = ''; // hand control back to CSS (:hover lift, reveal)
      });
    });
  }

  /* ------------------------------------------------------------------------
     15. RIPPLE RAYS ON CLICK
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.btn, .tag, .filter-btn, .pill-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'click-ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ------------------------------------------------------------------------
     16. SCHEMATIC WIRE GLOW ON HOVER
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.sch-node-group').forEach(node => {
    node.addEventListener('mouseenter', () => {
      document.querySelectorAll('.sch-wire').forEach(wire => {
        wire.classList.add('wire-glowing');
      });
    });
    node.addEventListener('mouseleave', () => {
      document.querySelectorAll('.sch-wire').forEach(wire => {
        wire.classList.remove('wire-glowing');
      });
    });
  });

  /* ------------------------------------------------------------------------
     17. LIVE CONCURRENCY & ALGORITHM PIPELINE VISUALIZER ENGINE
     ------------------------------------------------------------------------ */
  const btnVisWorker = document.getElementById('btnVisWorker');
  const btnVisTree = document.getElementById('btnVisTree');
  const visWorkerView = document.getElementById('visWorkerView');
  const visTreeView = document.getElementById('visTreeView');

  btnVisWorker?.addEventListener('click', () => {
    btnVisWorker.classList.add('active');
    btnVisTree?.classList.remove('active');
    if (visWorkerView) visWorkerView.style.display = 'block';
    if (visTreeView) visTreeView.style.display = 'none';
    playSound(600, 0.05);
  });

  btnVisTree?.addEventListener('click', () => {
    btnVisTree.classList.add('active');
    btnVisWorker?.classList.remove('active');
    if (visTreeView) visTreeView.style.display = 'block';
    if (visWorkerView) visWorkerView.style.display = 'none';
    playSound(600, 0.05);
  });

  // WORKER PIPELINE LOGIC
  const btnPushJob = document.getElementById('btnPushJob');
  const qSlots = document.querySelectorAll('#qSlots .q-slot');
  const visLog = document.getElementById('visLog');
  const workers = [
    { el: document.getElementById('w1'), name: 'Worker #1', busy: false },
    { el: document.getElementById('w2'), name: 'Worker #2', busy: false },
    { el: document.getElementById('w3'), name: 'Worker #3', busy: false }
  ];

  let jobCounter = 100;
  let queue = [];

  btnPushJob?.addEventListener('click', () => {
    jobCounter++;
    const jobId = `JOB #${jobCounter}`;
    playSound(720, 0.08);

    if (queue.length < 5) {
      queue.push(jobId);
      updateQueueUI();
      if (visLog) visLog.textContent = `[CHAN_PUSH] Dispatched ${jobId} to buffered channel. Capacity: ${queue.length}/5`;
      processQueue();
    } else {
      if (visLog) visLog.innerHTML = `<span style="color:var(--accent)">[WARN] Channel Full! Capacity limit (5/5) reached. Blocked until worker frees slot.</span>`;
    }
  });

  function updateQueueUI() {
    qSlots.forEach((slot, idx) => {
      if (idx < queue.length) {
        slot.textContent = queue[idx];
        slot.className = 'q-slot filled';
      } else {
        slot.textContent = 'EMPTY';
        slot.className = 'q-slot empty';
      }
    });
  }

  function processQueue() {
    if (queue.length === 0) return;

    const freeWorker = workers.find(w => !w.busy);
    if (freeWorker) {
      const task = queue.shift();
      updateQueueUI();

      freeWorker.busy = true;
      if (freeWorker.el) {
        freeWorker.el.classList.add('busy');
        freeWorker.el.querySelector('.w-status').textContent = `PROCESSING ${task}`;
      }

      if (visLog) visLog.textContent = `[EXEC] ${freeWorker.name} acquired ${task} from channel (Goroutine async execution).`;

      setTimeout(() => {
        freeWorker.busy = false;
        if (freeWorker.el) {
          freeWorker.el.classList.remove('busy');
          freeWorker.el.querySelector('.w-status').textContent = 'IDLE';
        }
        if (visLog) visLog.textContent = `[DONE] ${freeWorker.name} completed ${task}. Slot released (200 OK).`;
        processQueue();
      }, 2200 + Math.random() * 800);
    }
  }

  // BST IN-ORDER TRAVERSAL ANIMATION LOGIC
  const btnTraverseTree = document.getElementById('btnTraverseTree');
  const treeLog = document.getElementById('treeLog');
  const traverseOrder = ['tn20', 'tn30', 'tn40', 'tn50', 'tn60', 'tn70', 'tn80'];
  let isTraversing = false;

  btnTraverseTree?.addEventListener('click', () => {
    if (isTraversing) return;
    isTraversing = true;
    playSound(800, 0.1);

    if (treeLog) treeLog.textContent = '[ALGO_START] Initiating In-Order DFS Traversal (Left -> Root -> Right)...';

    let step = 0;
    const interval = setInterval(() => {
      document.querySelectorAll('.tnode').forEach(n => n.classList.remove('active-node'));

      if (step < traverseOrder.length) {
        const nodeEl = document.getElementById(traverseOrder[step]);
        if (nodeEl) nodeEl.classList.add('active-node');
        const val = nodeEl ? nodeEl.textContent : '';
        if (treeLog) treeLog.textContent = `[TRAVERSE_STEP ${step + 1}/7] Visited Node Key: ${val} (Pointer: 0x7FFF5F_${val})`;
        playSound(440 + step * 60, 0.08);
        step++;
      } else {
        clearInterval(interval);
        isTraversing = false;
        if (treeLog) treeLog.innerHTML = '<span style="color:var(--accent-2)">[ALGO_COMPLETE] In-Order Traversal Result: [20, 30, 40, 50, 60, 70, 80] — Sorted 100%.</span>';
      }
    }, 700);
  });

});
