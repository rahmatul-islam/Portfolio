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
      hero_tag: '// সফটওয়্যার ইঞ্জিনিয়ারিং আন্ডারগ্রাজুয়েট — লেভেল ২, টার্ম ২, বাংলাদেশ',
      hero_title_1: 'Building',
      hero_title_2: 'Software,',
      hero_title_3: 'Structurally.',
      hero_sub: 'আমি বিশ্বাস করি, Software Engineering শুধু code লেখা নয়—এটি মানুষের বাস্তব সমস্যাকে বোঝা, সেটিকে ছোট ছোট অংশে ভেঙে দেখা, এবং একটি সহজ, নির্ভরযোগ্য ও অর্থবহ সমাধান তৈরি করার প্রক্রিয়া।',
      hero_desc: 'আমি সফটওয়্যার ইঞ্জিনিয়ারিং-এর একজন আন্ডারগ্রাজুয়েট শিক্ষার্থী, এবং Java আমার মূল ভাষা। আমি Java ব্যবহার করে Data Structures and Algorithms এবং সমস্যা সমাধান অনুশীলন করি। এছাড়াও আমি Go, Python, Flutter, Dart, SQL, HTML, CSS, Git, GitHub, GitLab এবং REST API নিয়ে কাজ করি। Backend development-এ আমার আগ্রহ রয়েছে, এবং ভবিষ্যতে Artificial Intelligence, Machine Learning ও DevOps শেখার পরিকল্পনা করছি।',
      btn_projects: 'প্রজেক্ট দেখুন',
      btn_resume: 'রিজিউমি দেখুন',
      m_focus1: 'Java কোর',
      m_focus2: 'Java-তে ডিএসএ অনুশীলন',
      m_focus3: 'Flutter ও ব্যাকএন্ড লার্নিং',
      sch_header: 'সিস্টেম আর্কিটেকচার লার্নিং ভিজ্যুয়ালাইজার',
      sch_sub: 'একটি রিকোয়েস্ট পাইপলাইনে সাধারণ ব্যাকএন্ড কম্পোনেন্টগুলো কীভাবে একে অপরের সাথে যোগাযোগ করতে পারে, তা বোঝার জন্য একটি শিক্ষামূলক ভিজ্যুয়ালাইজেশন। সাধারণ ভূমিকা ও ডিপেন্ডেন্সি জানতে যেকোনো কম্পোনেন্ট সিলেক্ট করুন।',
      sch_req: 'রিকোয়েস্ট ট্রেস',
      sch_ping: 'সব হাইলাইট',
      sch_insp: 'কম্পোনেন্ট ইন্সপেক্টর',
      sch_insp_sim: '● সিমুলেটেড',
      sch_insp_empty: 'সাধারণ ভূমিকা ও ডিপেন্ডেন্সি জানতে ডায়াগ্রাম থেকে একটি কম্পোনেন্ট সিলেক্ট করুন। এখানে দেখানো প্রতিটি মান শেখার উদ্দেশ্যে সিমুলেটেড।',
      sch_pill: 'কনসেপ্ট',
      sch_spark: 'সিমুলেটেড ফ্লো · শেষ ২৪ স্যাম্পল',
      sch_deps: 'ডিপেন্ডেন্সি',
      sch_sys_head: 'সিমুলেটেড ডেটা — আসল ট্রাফিক নয়',
      sch_sys_reqs: 'রিকোয়েস্ট (সিম)',
      sch_sys_p99: 'রেসপন্স টাইম (সিম)',
      sch_sys_thr: 'ফ্লো রেট (সিম)',
      sch_sys_err: 'এরর রেট (সিম)',
      sch_lg_node: 'কম্পোনেন্ট',
      sch_health: '৮/৮ কম্পোনেন্ট · শিক্ষামূলক ভিজ্যুয়ালাইজেশন',
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
      v_avail: 'সফটওয়্যার ইঞ্জিনিয়ারিং-এর আন্ডারগ্রাজুয়েট শিক্ষার্থী — সক্রিয়ভাবে শিখছি, প্রজেক্ট বানাচ্ছি এবং সহযোগিতার জন্য প্রস্তুত।',
      sec_skills: '02 // দক্ষতা ও স্ট্যাক ডিপেন্ডেন্সি ম্যাপ',
      skills_head: 'টেকনিক্যাল স্ট্যাক স্কিমেটিক্স',
      skills_desc: 'নিচের যেকোনো টেকনোলজি ট্যাগে মাউস হভার করলে দেখতে পাবেন সেটি আমার স্ট্যাকের আর কোন কোন প্রযুক্তির সাথে যুক্ত।',
      sg_lang: 'প্রোগ্রামিং ল্যাঙ্গুয়েজ',
      sg_frameworks: 'ডেভেলপমেন্ট টুলস ও টেকনোলজি',
      sg_learning: 'ভবিষ্যতের লার্নিং রোডম্যাপ',
      sg_learning_note: 'ভবিষ্যতের জন্য শেখার পরিকল্পনা — বর্তমান দক্ষতা নয়।',
      sg_vis: 'জাভা ডিএসএ ও সমস্যা সমাধান ভিজ্যুয়ালাইজার',
      sec_work: '03 // প্রজেক্ট ব্লুপ্রিন্টস',
      proj_head: 'রিয়েল প্রজেক্ট ও অনুশীলন',
      proj_desc: 'এগুলো আমি নিজে তৈরি করা প্রজেক্ট — Flutter মোবাইল অ্যাপ্লিকেশন, Java ডেস্কটপ সিস্টেম এবং ডাটাবেস-ভিত্তিক টুল। পাশাপাশি Java, Data Structures ও Algorithms, ব্যাকএন্ডের মূল বিষয়, REST API এবং ভার্সন কন্ট্রোলে আমার অনুশীলন চলছে।',
      f_all: 'সব প্রজেক্ট (০৬)',
      f_mobile: 'FLUTTER ও মোবাইল',
      f_java: 'JAVA ও ডেস্কটপ',
      f_ai: 'AI ও ডেটা',
      p1_desc: 'Flutter দিয়ে তৈরি একটি ক্রস-প্লাটফর্ম পার্সোনাল ফাইন্যান্স অ্যাপ, যা নিজের অর্থের পুরো নিয়ন্ত্রণ নিতে সাহায্য করে — ক্যাটাগরি সহ আয় ও খরচ ট্র্যাকিং, মাসিক বাজেট ব্যবস্থাপনা, ইন্টারঅ্যাক্টিভ অ্যানালিটিক্স চার্ট, CSV এক্সপোর্ট, বায়োমেট্রিক লক এবং ডার্ক/লাইট থিম। সব ডেটা SQLite-এর মাধ্যমে ডিভাইসেই সংরক্ষিত থাকে, আর একটি কোডবেস থেকেই Android, iOS, Web ও Desktop চলে।',
      p2_desc: 'নাগরিক পরিচয় রেকর্ড ব্যবস্থাপনার জন্য Java Swing ও MySQL দিয়ে তৈরি একটি ডেস্কটপ অ্যাপ্লিকেশন। সাইনআপে OTP-ভিত্তিক ইমেইল ভেরিফিকেশন রয়েছে, এবং অনুমোদিত ব্যবহারকারীরা একটি পরিষ্কার GUI ড্যাশবোর্ডের মাধ্যমে নাগরিক রেকর্ড যোগ, দেখা, হালনাগাদ ও মুছে ফেলতে পারেন — কাগুজে পদ্ধতির সম্পূর্ণ ডিজিটাল বিকল্প।',
      p3_desc: 'স্মার্ট বাংলাদেশ ভিশন ২০৪১-এর সাথে সঙ্গতিপূর্ণ একটি AI-ভিত্তিক নাগরিক সমস্যা প্রতিবেদন প্ল্যাটফর্ম। একজন নাগরিক কোনো সমস্যার (গর্ত, ময়লা, নষ্ট স্ট্রিটলাইট) ছবি তুললে অন-ডিভাইস AI সেটি শনাক্ত করে, GPS অবস্থান সংগ্রহ করে এবং প্রতিবেদনটি সরাসরি অ্যাডমিন GIS ড্যাশবোর্ডে দেখা যায়। একই ধরনের প্রতিবেদন স্বয়ংক্রিয়ভাবে একত্রিত হয়, কর্তৃপক্ষ কাজ বরাদ্দ করে এবং নাগরিক সমাধান নিশ্চিত করেন।',
      p4_desc: 'Java Swing ও MySQL দিয়ে তৈরি একটি ডেস্কটপ HR টুল, যা কর্মীদের রেকর্ড ব্যবস্থাপনাকে সহজ করে — নাম, পদবি, বেতন, NID, শিক্ষাগত যোগ্যতা ও জন্মতারিখ সহ নতুন কর্মী যোগ করা, সব রেকর্ড দেখা, তথ্য হালনাগাদ করা এবং কর্মী মুছে ফেলা। অটো-জেনারেটেড কর্মী আইডি ও পরিষ্কার Swing GUI সহ।',
      p5_desc: 'ফেস রিকগনিশন প্রযুক্তি ব্যবহার করে ঐতিহ্যবাহী ম্যানুয়াল রোল কল প্রতিস্থাপনকারী একটি AI-ভিত্তিক স্মার্ট হল অ্যাক্সেস ও অ্যাটেন্ডেন্স সিস্টেম। তিনটি রোল-ভিত্তিক পোর্টাল — শিক্ষার্থী (ডিজিটাল আইডি কার্ড ও লাইভ স্ট্যাটাস), গেট সিকিউরিটি (Google ML Kit ব্যবহার করে রিয়েল-টাইম ফেস স্ক্যানার) এবং হল কর্তৃপক্ষ (লাইভ পরিসংখ্যান ও শিক্ষার্থী নিবন্ধন)। Appwrite Realtime-এর মাধ্যমে সব অ্যাটেন্ডেন্স ডেটা তাৎক্ষণিকভাবে ক্লাউডে সিংক হয়।',
      p6_desc: 'Java-তে লেখা Data Structures ও Algorithms সমাধানের একটি সংগ্রহ, যা সমস্যা সমাধানের দক্ষতা, যুক্তিচিন্তা এবং মূল ধারণাগুলো বোঝার ওপর গুরুত্ব দেয়।',
      p_details: 'বিস্তারিত দেখুন',
      sec_exp: '04 // ইঞ্জিনিয়ারিং লগ ও রিভিশনস',
      exp_head: 'পরিবর্তন লগ ও মাইলফলক',
      th_date: 'সময়কাল',
      th_role: 'ভূমিকা / মাইলফলক',
      th_org: 'প্রতিষ্ঠান',
      th_status: 'স্ট্যাটাস',
      r3_title: 'বিএসসি ইন সফটওয়্যার ইঞ্জিনিয়ারিং — লেভেল ২, টার্ম ২',
      r3_desc: 'ফোকাস: Java, ডিএসএ ও সমস্যা সমাধান, Flutter, ডাটাবেস, ব্যাকএন্ড ডেভেলপমেন্ট, REST API শেখা এবং ভার্সন কন্ট্রোল।',
      r2_title: 'প্রোগ্রামিং ফাউন্ডেশন ও ডেভেলপমেন্ট দক্ষতা',
      r2_desc: 'Java, Go, Python, C, Flutter, Dart, SQL, HTML, CSS, Git, GitHub এবং GitLab শেখা ও অনুশীলন।',
      r1_title: 'সফটওয়্যার ইঞ্জিনিয়ারিং যাত্রার সূচনা',
      r1_desc: 'প্রোগ্রামিং, OOP, সমস্যা সমাধান, ভার্সন কন্ট্রোল এবং ওয়েব ডেভেলপমেন্টের মূল বিষয়গুলোর ভিত্তি তৈরি।',
      sec_contact: '05 // ট্রান্সমিশন ও যোগাযোগ',
      c_title: 'চলুন শিখি, বানাই এবং একসাথে কাজ করি।',
      c_sub: 'আমি বর্তমানে Java, Data Structures ও Algorithms, সমস্যা সমাধান, Flutter, ব্যাকএন্ড ডেভেলপমেন্ট, REST API, ডাটাবেস এবং বাস্তব প্রজেক্টের মাধ্যমে সফটওয়্যার ইঞ্জিনিয়ারিং-এর ভিত্তি শক্তিশালী করছি। শেখার সহযোগিতা, শিক্ষার্থী প্রজেক্ট এবং এন্ট্রি-লেভেল সুযোগের জন্য নির্দ্বিধায় যোগাযোগ করুন।',
      c_copy_btn: 'কপি',
      c_alt_title: 'অন্যান্য যোগাযোগ ইমেইল',
      c_alt_uni: 'বিশ্ববিদ্যালয়',
      c_alt_personal: 'ব্যক্তিগত',
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
      hero_tag: '// SOFTWARE ENGINEERING UNDERGRADUATE — LEVEL 2, TERM 2, BANGLADESH',
      hero_title_1: 'Building',
      hero_title_2: 'Software,',
      hero_title_3: 'Structurally.',
      hero_sub: 'I believe Software Engineering is not just about writing code—it is the process of understanding real human problems, breaking them down, and creating simple, reliable, and meaningful solutions.',
      hero_desc: 'I am an undergraduate Software Engineering student with Java as my core language. I practice Data Structures and Algorithms and problem solving using Java. I also work with Go, Python, Flutter, Dart, SQL, HTML, CSS, Git, GitHub, GitLab, and REST APIs. I am interested in backend development, and I plan to learn Artificial Intelligence, Machine Learning, and DevOps in the future.',
      btn_projects: 'View Projects',
      btn_resume: 'View Résumé',
      m_focus1: 'Java Core',
      m_focus2: 'Java DSA Practice',
      m_focus3: 'Flutter & Backend Learning',
      sch_header: 'SYSTEM ARCHITECTURE LEARNING VISUALIZER',
      sch_sub: 'An educational visualization for understanding how common backend components can communicate in a request pipeline. Select a component to explore its general role and dependencies.',
      sch_req: 'TRACE REQUEST',
      sch_ping: 'HIGHLIGHT ALL',
      sch_insp: 'COMPONENT INSPECTOR',
      sch_insp_sim: '● SIMULATED',
      sch_insp_empty: 'Select a component from the diagram to explore its general role and dependencies. All values shown here are simulated for learning.',
      sch_pill: 'CONCEPT',
      sch_spark: 'SIMULATED FLOW · LAST 24 SAMPLES',
      sch_deps: 'DEPENDENCIES',
      sch_sys_head: 'SIMULATED DATA — NOT REAL TRAFFIC',
      sch_sys_reqs: 'REQUESTS (SIM)',
      sch_sys_p99: 'RESPONSE TIME (SIM)',
      sch_sys_thr: 'FLOW RATE (SIM)',
      sch_sys_err: 'ERROR RATE (SIM)',
      sch_lg_node: 'COMPONENT',
      sch_health: '8/8 COMPONENTS · EDUCATIONAL VISUALIZATION',
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
      v_avail: 'Undergraduate Software Engineering student — actively learning, building projects, and open to collaboration.',
      sec_skills: '02 // Skills & Stack Dependency Map',
      skills_head: 'Technical Stack Schematics',
      skills_desc: 'Hover over any technology tag to see which other tools in my stack it connects to.',
      sg_lang: 'Programming Languages',
      sg_frameworks: 'Development Tools & Technologies',
      sg_learning: 'Future Learning Roadmap',
      sg_learning_note: 'Planned learning goals for the future — not current skills.',
      sg_vis: 'Java DSA & Problem-Solving Visualizer',
      sec_work: '03 // Project Blueprints',
      proj_head: 'Real Projects & Practice',
      proj_desc: 'These are projects I have built myself — Flutter mobile applications, Java desktop systems and database-backed tools — alongside my ongoing practice in Java, Data Structures and Algorithms, backend fundamentals, REST APIs, and version control.',
      f_all: 'ALL PROJECTS (06)',
      f_mobile: 'FLUTTER & MOBILE',
      f_java: 'JAVA & DESKTOP',
      f_ai: 'AI & DATA',
      p1_desc: 'A cross-platform personal finance app built with Flutter that helps users take full control of their money — income and expense tracking with categories, monthly budget management, interactive analytics charts, CSV export, biometric lock and dark/light theme. Everything is stored locally on-device with SQLite, and one codebase runs on Android, iOS, Web and Desktop.',
      p2_desc: 'A desktop application for managing citizen identity records, built with Java Swing and MySQL. Signup is protected with OTP-based email verification, and authorised users can add, view, update and delete citizen records through a clean GUI dashboard — a fully digital replacement for manual, paper-based identity management.',
      p3_desc: 'An AI-powered civic issue reporting platform aligned with the Smart Bangladesh Vision 2041. A citizen photographs a problem — a pothole, garbage, a broken streetlight — on-device AI classifies it, GPS captures the location, and the report appears live on an admin GIS dashboard. Duplicate reports are clustered automatically, authorities assign the work, and citizens verify the fix.',
      p4_desc: 'A desktop HR tool built with Java Swing and MySQL that streamlines employee record management — add employees with full details (name, designation, salary, NID, education, date of birth), view all records, update information and remove employees, with auto-generated employee IDs and a clean Swing GUI.',
      p5_desc: 'An AI-based smart hall access and attendance system that replaces manual roll calls with face recognition. Three role-based portals — Student (digital ID card and live status), Gate Security (real-time face scanner using Google ML Kit) and Hall Authority (live statistics and student registration) — with attendance data syncing instantly to the cloud through Appwrite Realtime.',
      p6_desc: 'A collection of Data Structures and Algorithms solutions written in Java, focused on improving problem-solving skills, logical thinking, and understanding core concepts.',
      p_details: 'View Details',
      sec_exp: '04 // Engineering Log & Revisions',
      exp_head: 'Changelog & Milestones',
      th_date: 'TIMEFRAME',
      th_role: 'ROLE / MILESTONE',
      th_org: 'ORGANIZATION',
      th_status: 'STATUS',
      r3_title: 'B.Sc. in Software Engineering — Level 2, Term 2',
      r3_desc: 'Focus: Java, DSA and problem solving, Flutter, databases, backend development, REST API learning, and version control.',
      r2_title: 'Programming Foundations & Development Skills',
      r2_desc: 'Learning and practicing Java, Go, Python, C, Flutter, Dart, SQL, HTML, CSS, Git, GitHub, and GitLab.',
      r1_title: 'Started Software Engineering Journey',
      r1_desc: 'Built foundational knowledge of programming, OOP, problem solving, version control, and web development fundamentals.',
      sec_contact: '05 // Transmission & Contact',
      c_title: 'Let\'s learn, build, and collaborate.',
      c_sub: 'I am currently strengthening my software engineering foundations through Java, Data Structures and Algorithms, problem solving, Flutter, backend development, REST APIs, databases, and practical projects. Feel free to contact me for learning collaboration, student projects, and entry-level opportunities.',
      c_copy_btn: 'COPY',
      c_alt_title: 'OTHER CONTACT EMAILS',
      c_alt_uni: 'University',
      c_alt_personal: 'Personal',
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
     05. SYSTEM TOPOLOGY SIMULATOR
     ------------------------------------------------------------------------ */
  // The topology card engine (tooltip, inspector, live metrics, request
  // traces, ping mesh) lives in topology.js.

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
        // A card can belong to more than one group, e.g. data-category="mobile ai".
        const category = (card.getAttribute('data-category') || '').split(/\s+/);
        // Cancel any pending hide timer so quickly switching filters
        // can't leave cards stuck at display:none.
        clearTimeout(card._hideTimer);
        if (filter === 'all' || category.includes(filter)) {
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
      title: 'Expense Tracker App',
      fig: 'FIG. 01 // PROJECT SPECIFICATION',
      tags: ['Completed Project', 'Flutter', 'Dart', 'SQLite', 'Material 3'],
      body: `
        <h4>Overview</h4>
        <p>A cross-platform personal finance app built with Flutter that helps users take full control of their money. Every record is stored locally on the device in a SQLite database.</p>
        <br>
        <h4>Key Features</h4>
        <ul>
          <li><strong>Income &amp; expense tracking:</strong> entries organised by category.</li>
          <li><strong>Monthly budget management:</strong> set a budget and follow spending against it.</li>
          <li><strong>Interactive analytics charts:</strong> see clearly where the money goes.</li>
          <li><strong>CSV export:</strong> take the data out for backup or offline review.</li>
          <li><strong>Biometric lock:</strong> protect the app with a device unlock.</li>
          <li><strong>Dark / light theme:</strong> Material 3 styling in both modes.</li>
        </ul>
        <br>
        <h4>Platforms</h4>
        <p>Android, iOS, Web and Desktop from a single Flutter codebase.</p>
        <br>
        <h4>Storage</h4>
        <p>On-device SQLite — a personal project, no server side user data.</p>
      `
    },
    proj2: {
      title: 'Identity Management System',
      fig: 'FIG. 02 // PROJECT SPECIFICATION',
      tags: ['Completed Project', 'Java Swing', 'MySQL', 'JavaMail API', 'OTP'],
      body: `
        <h4>Overview</h4>
        <p>A desktop application for managing citizen identity records, built with Java Swing and MySQL. It replaces manual, paper-based identity management with a fully digital record system.</p>
        <br>
        <h4>Key Features</h4>
        <ul>
          <li><strong>Secure authentication:</strong> login protects the record dashboard.</li>
          <li><strong>OTP email verification:</strong> signup is confirmed with a one-time password sent through the JavaMail API.</li>
          <li><strong>Record management:</strong> authorised users can add, view, update and delete citizen records.</li>
          <li><strong>Clean Swing dashboard:</strong> a simple GUI instead of registers and paper files.</li>
          <li><strong>MySQL persistence:</strong> records are kept in a relational database.</li>
        </ul>
      `
    },
    proj3: {
      title: 'Nagar-Drishti (নগর-দৃষ্টি)',
      fig: 'FIG. 03 // PROJECT SPECIFICATION',
      tags: ['Completed Project', 'Flutter', 'Riverpod', 'Appwrite', 'TensorFlow Lite', 'PostGIS'],
      body: `
        <h4>Overview</h4>
        <p>An AI-powered civic issue reporting platform aligned with the Smart Bangladesh Vision 2041. A citizen reports a problem with a photograph, and that report reaches an admin GIS dashboard together with its exact location.</p>
        <br>
        <h4>Key Features</h4>
        <ul>
          <li><strong>Photo reporting:</strong> citizens photograph a pothole, garbage or a broken streetlight.</li>
          <li><strong>On-device classification:</strong> a TensorFlow Lite model labels the issue on the phone itself.</li>
          <li><strong>GPS capture &amp; GIS dashboard:</strong> each report carries its location into a PostGIS-backed admin map.</li>
          <li><strong>Duplicate clustering:</strong> repeated reports of the same issue are grouped automatically.</li>
          <li><strong>Work loop:</strong> authorities assign the work, citizens verify the fix.</li>
          <li><strong>Offline-first:</strong> the app keeps working without a connection and syncs later.</li>
          <li><strong>Structure:</strong> Riverpod for state management, Appwrite for backend services.</li>
        </ul>
        <br>
        <h4>Scope Note</h4>
        <p>Image classification uses a pre-trained on-device model — applied AI tooling inside a product, not AI/ML research. The platform is designed to scale from a university campus to a city.</p>
      `
    },
    proj4: {
      title: 'Employee Management System (EmpSys)',
      fig: 'FIG. 04 // PROJECT SPECIFICATION',
      tags: ['Completed Project', 'Java Swing', 'MySQL', 'Desktop GUI', 'CRUD'],
      body: `
        <h4>Overview</h4>
        <p>A desktop-based HR tool built with Java Swing and MySQL that streamlines employee record management.</p>
        <br>
        <h4>Key Features</h4>
        <ul>
          <li><strong>Add employees:</strong> full details — name, designation, salary, NID, education and date of birth.</li>
          <li><strong>View records:</strong> every employee listed in one clear table view.</li>
          <li><strong>Update information:</strong> edit an existing record when details change.</li>
          <li><strong>Remove employees:</strong> delete a record that is no longer needed.</li>
          <li><strong>Auto-generated employee IDs:</strong> unique numbering without manual bookkeeping.</li>
          <li><strong>Clean Swing GUI</strong> with MySQL storage behind it.</li>
        </ul>
      `
    },
    proj5: {
      title: 'IntelliLog',
      fig: 'FIG. 05 // PROJECT SPECIFICATION',
      tags: ['Completed Project', 'Flutter', 'Google ML Kit', 'Appwrite', 'Realtime Sync'],
      body: `
        <h4>Overview</h4>
        <p>An AI-based smart hall access and attendance system that replaces traditional manual roll calls with face recognition.</p>
        <br>
        <h4>Three Role-Based Portals</h4>
        <ul>
          <li><strong>Student:</strong> digital ID card with live attendance status.</li>
          <li><strong>Gate Security:</strong> real-time face scanner built on Google ML Kit.</li>
          <li><strong>Hall Authority:</strong> live statistics and student registration.</li>
        </ul>
        <br>
        <h4>Key Features</h4>
        <ul>
          <li><strong>Instant cloud sync:</strong> attendance data updates through Appwrite Realtime — no manual refresh.</li>
          <li><strong>Shared records:</strong> all three portals read the same up-to-date data.</li>
        </ul>
        <br>
        <h4>Scope Note</h4>
        <p>Face detection and recognition use Google ML Kit's pre-built on-device models.</p>
      `
    },
    proj6: {
      title: 'Java DSA Practice',
      fig: 'FIG. 06 // LEARNING PROJECT SPECIFICATION',
      tags: ['Learning Project', 'Java', 'DSA', 'OOP'],
      body: `
        <h4>Overview</h4>
        <p>A collection of Data Structures and Algorithms solutions written in Java, focused on improving problem-solving skills, logical thinking, and understanding core concepts.</p>
        <br>
        <h4>Learning Goals</h4>
        <ul>
          <li><strong>Understand first:</strong> trace how a data structure behaves before writing the code.</li>
          <li><strong>Write readable Java:</strong> clear naming, small methods and proper OOP structure.</li>
          <li><strong>Compare approaches:</strong> look at time and space complexity, not only at a working answer.</li>
          <li><strong>Practise consistently:</strong> solve problems regularly and revisit the ones that were hard.</li>
        </ul>
        <br>
        <h4>Status</h4>
        <p>Ongoing learning practice as a Software Engineering undergraduate — not a deployed product.</p>
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
    line.innerHTML = `<span class="term-ps1">ratul@se:~$</span> ${escapeHtml(cmd)}`;
    termOutput.appendChild(line);

    const res = document.createElement('div');
    res.className = 'term-line';

    switch (cmd) {
      case 'help':
        res.innerHTML = `Available HUD commands:<br>
          - <span class="term-cmd">skills</span>: List my current stack and learning roadmap<br>
          - <span class="term-cmd">projects</span>: List my learning projects<br>
          - <span class="term-cmd">contact</span>: View contact channels<br>
          - <span class="term-cmd">matrix</span>: Show the specification matrix<br>
          - <span class="term-cmd">theme [cyan|emerald|amber|amethyst]</span>: Switch accent color<br>
          - <span class="term-cmd">quote</span>: Random engineering wisdom<br>
          - <span class="term-cmd">clear</span>: Clear console buffer`;
        break;
      case 'skills':
        res.innerHTML = 'Languages: Java (core — OOP, DSA, problem solving), Go, Python, C, Dart, SQL, HTML, CSS.<br>Tools: Flutter, REST API (learning), Git, GitHub, GitLab.<br>Future roadmap: AI, ML, DevOps.';
        break;
      case 'projects':
        res.innerHTML = 'Projects: 1. Expense Tracker App (Flutter) | 2. Identity Management System (Java) | 3. Nagar-Drishti (Flutter + AI) | 4. EmpSys (Java) | 5. IntelliLog (Flutter + AI) | 6. Java DSA Practice (learning)';
        break;
      case 'contact':
        res.innerHTML = 'Primary: <a href="mailto:rahmatulislam.se@gmail.com">rahmatulislam.se@gmail.com</a><br>University: <a href="mailto:2303016@bdu.ac.bd">2303016@bdu.ac.bd</a> · Personal: <a href="mailto:rahmatulislam@proton.me">rahmatulislam@proton.me</a><br>Phone: <a href="tel:+8801521715025">+880 1521 715025</a><br>GitHub: github.com/rahmatul-islam · LinkedIn: linkedin.com/in/rahmatul-islam-447b39341';
        break;
      case 'matrix':
        res.innerHTML = 'Name: Rahmatul Islam (Ratul) | Discipline: Software Engineering (SE) | Level: Level 2, Term 2 | Degree: B.Sc. in Software Engineering | Location: Bangladesh';
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
    const email = 'rahmatulislam.se@gmail.com';
    const onOk = () => {
      playSound(800, 0.15);
      showToast('📋 Email copied to clipboard: rahmatulislam.se@gmail.com');
    };
    const onFail = () => showToast('❌ Copy failed — email: rahmatulislam.se@gmail.com');

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
        // Labels without a numeric target (e.g. the hero focus tags) are not counters.
        if (!Number.isFinite(target)) { counterObserver.unobserve(valEl); return; }
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
     17. LIVE CONCURRENCY & DSA VISUALIZER
     ------------------------------------------------------------------------ */
  // The upgraded Concurrency Lab + BST Lab engine lives in viz-core.js (pure
  // simulation logic) and visualizer.js (UI rendering). Loaded after this file.


});
