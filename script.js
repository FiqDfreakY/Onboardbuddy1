/* =============================================
   OnboardBuddy — script.js
   NusaTech Internal Onboarding AI Agent
   ============================================= */

'use strict';

/* ─────────────────────────────────────────────
   1. KNOWLEDGE BASE
   Array of objects: id, kategori, keywords[], jawaban, chips[]
   ───────────────────────────────────────────── */
const KB = [
  // ── Akun & Akses ──
  {
    id: 'akun-01',
    kategori: 'Akun & Akses',
    keywords: ['akun', 'email', 'corporate', 'aktivasi', 'buat akun', 'daftar', 'aktivasi email'],
    jawaban: 'Akun email korporat Anda dibuat otomatis oleh tim IT saat hari pertama. Cek inbox email pribadi yang Anda daftarkan ke HRD — Anda akan menerima tautan aktivasi. Jika belum masuk dalam 2 jam, hubungi it-support@nusatech.id.',
    chips: ['Cara reset password', 'Apa itu SSO?', 'Setup VPN'],
  },
  {
    id: 'akun-02',
    kategori: 'Akun & Akses',
    keywords: ['password', 'kata sandi', 'reset', 'lupa', 'ganti password', 'ubah password'],
    jawaban: 'Untuk reset password korporat:\n1. Kunjungi portal.nusatech.id/reset\n2. Masukkan NIP karyawan Anda\n3. Ikuti tautan yang dikirim ke email recovery\n\nPassword wajib minimal 12 karakter, mengandung huruf besar, angka, dan simbol. Ganti password setiap 90 hari.',
    chips: ['Aktifkan 2FA', 'Kebijakan keamanan password', 'Kontak IT Support'],
  },
  {
    id: 'akun-03',
    kategori: 'Akun & Akses',
    keywords: ['sso', 'single sign on', 'login', 'masuk', 'autentikasi'],
    jawaban: 'NusaTech menggunakan SSO (Single Sign-On) berbasis Okta. Setelah akun aktif, Anda cukup login sekali di portal.nusatech.id dan semua aplikasi internal (Jira, Confluence, GitLab) dapat diakses tanpa login ulang.',
    chips: ['Cara mengakses GitLab', 'Apa itu 2FA?', 'Setup VPN'],
  },
  {
    id: 'akun-04',
    kategori: 'Akun & Akses',
    keywords: ['vpn', 'akses remote', 'remote access', 'dari rumah', 'luar kantor'],
    jawaban: 'Akses VPN menggunakan Cisco AnyConnect:\n1. Download dari it-portal.nusatech.id/vpn\n2. Install dan masukkan server: vpn.nusatech.id\n3. Login dengan kredensial SSO + kode 2FA\n\nVPN wajib aktif saat mengakses resource internal dari luar jaringan kantor.',
    chips: ['Aktifkan 2FA', 'Kebijakan WFH', 'Kontak IT Support'],
  },

  // ── Tools Developer ──
  {
    id: 'tools-01',
    kategori: 'Tools Developer',
    keywords: ['jira', 'tiket', 'task', 'sprint', 'backlog', 'issue', 'project management'],
    jawaban: 'Tim engineering NusaTech menggunakan Jira untuk manajemen proyek. Akses di jira.nusatech.id. Anda akan ditambahkan ke board tim oleh Tech Lead Anda di hari pertama. Panduan penggunaan Jira ada di Confluence: confluence.nusatech.id/jira-guide.',
    chips: ['Cara akses Confluence', 'Apa itu GitLab?', 'Setup IDE'],
  },
  {
    id: 'tools-02',
    kategori: 'Tools Developer',
    keywords: ['gitlab', 'git', 'repository', 'repo', 'source code', 'kode', 'version control', 'commit', 'push', 'pull'],
    jawaban: 'Repository kode dikelola di GitLab: gitlab.nusatech.id. Minta Tech Lead untuk menambahkan Anda ke group proyek. Workflow standar kami: feature branch → merge request → review → merge ke main. Panduan lengkap di Confluence/gitlab-workflow.',
    chips: ['Cara clone repo GitLab', 'Cara akses Confluence', 'Cara akses Jira'],
  },
  {
    id: 'tools-03',
    kategori: 'Tools Developer',
    keywords: ['confluence', 'dokumentasi', 'wiki', 'panduan', 'knowledge base', 'dokumen'],
    jawaban: 'Confluence adalah pusat dokumentasi NusaTech. Akses di confluence.nusatech.id. Anda bisa menemukan arsitektur sistem, runbook, SOP, dan catatan sprint. Setiap tim memiliki space masing-masing. Gunakan search (/) untuk menemukan dokumen spesifik.',
    chips: ['Cara menggunakan Jira', 'Akses Slack', 'Panduan onboarding'],
  },
  {
    id: 'tools-04',
    kategori: 'Tools Developer',
    keywords: ['slack', 'komunikasi', 'chat tim', 'channel', 'pesan', 'diskusi'],
    jawaban: 'Slack adalah platform komunikasi utama NusaTech. Setelah akun aktif, Anda akan otomatis bergabung ke #general, #engineering, dan channel tim Anda. Channel penting:\n• #announcements — pengumuman resmi\n• #tech-support — bantuan IT\n• #random — obrolan santai\nGunakan /onboarding di Slack untuk panduan cepat.',
    chips: ['Cara akses Jira', 'Cara akses Confluence', 'Kontak IT Support'],
  },
  {
    id: 'tools-05',
    kategori: 'Tools Developer',
    keywords: ['ide', 'editor', 'vscode', 'vs code', 'visual studio', 'setup development', 'setup dev', 'environment'],
    jawaban: 'IDE yang direkomendasikan adalah VS Code. Setup environment development:\n1. Install VS Code + extension pack NusaTech (cari "NusaTech Dev Pack" di marketplace)\n2. Clone repo konfigurasi: gitlab.nusatech.id/infra/dev-setup\n3. Jalankan script setup.sh (Mac/Linux) atau setup.ps1 (Windows)\n\nDokumentasi lengkap di Confluence/dev-environment.',
    chips: ['Cara clone repo GitLab', 'Setup VPN', 'Akun & akses tools'],
  },

  // ── Kebijakan HR ──
  {
    id: 'hr-01',
    kategori: 'Kebijakan HR',
    keywords: ['cuti', 'liburan', 'hari libur', 'ijin', 'izin', 'annual leave', 'cuti tahunan', 'cuti sakit'],
    jawaban: 'Kebijakan cuti NusaTech:\n• Cuti tahunan: 12 hari/tahun (mulai aktif setelah probasi 3 bulan)\n• Cuti sakit: tidak terbatas, wajib lampirkan surat dokter untuk lebih dari 2 hari\n• Cuti melahirkan: 3 bulan (ibu), 5 hari (ayah)\n\nAjukan cuti melalui portal.nusatech.id/leave minimal H-3 untuk cuti tahunan.',
    chips: ['Jam kerja normal', 'Kebijakan WFH', 'Kontak HRD'],
  },
  {
    id: 'hr-02',
    kategori: 'Kebijakan HR',
    keywords: ['jam kerja', 'jam masuk', 'jam pulang', 'jam kantor', 'working hours', 'shift', 'jadwal'],
    jawaban: 'Jam kerja standar NusaTech:\n• Senin–Jumat: 09.00 – 18.00 WIB (termasuk 1 jam istirahat)\n• Fleksibel: core hours wajib hadir 10.00–16.00\n• Lembur harus disetujui manajer dan dikompensasi sesuai aturan UU\n\nKetidakhadiran harap informasikan ke manajer langsung dan HR sebelum pukul 09.00.',
    chips: ['Kebijakan WFH', 'Cara ajukan cuti', 'Kontak HRD'],
  },
  {
    id: 'hr-03',
    kategori: 'Kebijakan HR',
    keywords: ['wfh', 'work from home', 'remote', 'bekerja dari rumah', 'hybrid', 'kerja remote'],
    jawaban: 'Kebijakan WFH NusaTech (hybrid model):\n• Maksimal 3 hari WFH per minggu\n• WFH wajib konfirmasi ke manajer sehari sebelumnya via Slack\n• Tetap wajib hadir saat standup, sprint planning, dan demo (kecuali kondisi darurat)\n• Koneksi internet dan perangkat WFH menjadi tanggung jawab karyawan\n\nVPN wajib aktif saat WFH.',
    chips: ['Setup VPN', 'Jam kerja kantor', 'Kebijakan cuti'],
  },
  {
    id: 'hr-04',
    kategori: 'Kebijakan HR',
    keywords: ['gaji', 'payroll', 'slip gaji', 'kompensasi', 'benefit', 'tunjangan', 'bpjs'],
    jawaban: 'Gaji dibayarkan setiap tanggal 25. Slip gaji tersedia di portal.nusatech.id/payroll. Benefit yang disediakan:\n• BPJS Kesehatan & Ketenagakerjaan (ditanggung perusahaan 100%)\n• Asuransi kesehatan tambahan (rawat inap & jalan)\n• Makan siang di kantor (hari kerja)\n• Internet allowance untuk WFH: Rp 300.000/bulan\n\nDetail lebih lanjut hubungi hr@nusatech.id.',
    chips: ['Kebijakan cuti', 'Kontak HRD', 'Jam kerja'],
  },

  // ── Keamanan ──
  {
    id: 'security-01',
    kategori: 'Keamanan',
    keywords: ['2fa', 'two factor', 'autentikasi dua faktor', 'otp', 'google authenticator', 'mfa', 'keamanan akun'],
    jawaban: 'Aktifkan 2FA untuk semua akun korporat:\n1. Login ke portal.nusatech.id/security\n2. Pilih "Enable 2FA"\n3. Scan QR code dengan Google Authenticator atau Authy\n4. Masukkan kode 6 digit untuk verifikasi\n\n2FA wajib diaktifkan dalam 48 jam sejak akun dibuat. Backup codes disimpan di tempat aman.',
    chips: ['Kebijakan password', 'Keamanan data', 'Kontak IT Security'],
  },
  {
    id: 'security-02',
    kategori: 'Keamanan',
    keywords: ['data', 'keamanan data', 'confidential', 'rahasia', 'nda', 'kebocoran data', 'privasi', 'perlindungan data'],
    jawaban: 'Kebijakan keamanan data NusaTech:\n• Semua data klien bersifat CONFIDENTIAL — tidak boleh dibagikan ke pihak luar\n• Dilarang menyimpan data sensitif di perangkat pribadi atau cloud personal\n• Gunakan hanya Google Drive korporat (drive.nusatech.id) untuk berbagi file\n• Laporkan insiden kebocoran data SEGERA ke security@nusatech.id dan manajer Anda',
    chips: ['Kebijakan password', 'Aktifkan 2FA', 'Kontak IT Security'],
  },
  {
    id: 'security-03',
    kategori: 'Keamanan',
    keywords: ['phishing', 'scam', 'email mencurigakan', 'spam', 'malware', 'virus', 'serangan', 'hacking'],
    jawaban: 'Jika menerima email mencurigakan (phishing):\n1. JANGAN klik tautan atau unduh lampiran\n2. Forward email tersebut ke security@nusatech.id\n3. Hapus email dari inbox\n4. Jika terlanjur klik, SEGERA hubungi IT Security: ext. 1337\n\nIngat: IT NusaTech tidak pernah meminta password via email!',
    chips: ['Kebijakan password', 'Keamanan data', 'Kontak IT Security'],
  },

  // ── Rencana 30-60-90 Hari ──
  {
    id: 'plan-01',
    kategori: 'Rencana 30-60-90 Hari',
    keywords: ['30 hari', 'bulan pertama', 'minggu pertama', 'awal', 'apa yang harus dilakukan', 'mulai', 'onboarding awal'],
    jawaban: 'Rencana 30 Hari Pertama:\n📚 Minggu 1-2: Orientasi\n• Setup semua tools (email, Jira, GitLab, Slack)\n• Baca dokumentasi arsitektur di Confluence\n• Ikuti sesi onboarding dengan HRD dan Tech Lead\n\n🔍 Minggu 3-4: Eksplorasi\n• Review codebase utama proyek Anda\n• Pair programming dengan anggota tim\n• Selesaikan 2-3 tiket "good first issue" di Jira\n• 1-on-1 dengan manajer langsung',
    chips: ['Rencana 60 hari', 'Rencana 90 hari', 'Apa yang harus saya kerjakan hari ini?'],
  },
  {
    id: 'plan-02',
    kategori: 'Rencana 30-60-90 Hari',
    keywords: ['60 hari', 'bulan kedua', 'dua bulan', 'kontribusi', 'berkontribusi'],
    jawaban: 'Rencana 60 Hari (Bulan Kedua):\n🛠️ Kontribusi Nyata:\n• Ambil ownership minimal 1 fitur kecil secara mandiri\n• Mulai review kode milik rekan tim\n• Berkontribusi ke dokumentasi Confluence tim\n• Presentasi mini (lightning talk) di sprint demo\n\n🤝 Relasi:\n• 1-on-1 dengan setidaknya 5 kolega dari tim berbeda\n• Bergabung di 1 komunitas internal (tech guild, book club, dsb.)',
    chips: ['Rencana 30 hari', 'Rencana 90 hari', 'Progress checklist saya'],
  },
  {
    id: 'plan-03',
    kategori: 'Rencana 30-60-90 Hari',
    keywords: ['90 hari', 'bulan ketiga', 'tiga bulan', 'probasi', 'evaluasi', 'mandiri'],
    jawaban: 'Rencana 90 Hari (Bulan Ketiga):\n🎯 Kemandirian Penuh:\n• Selesaikan semua item onboarding checklist\n• Deliver fitur/perbaikan dengan dampak terukur\n• Buat OKR pribadi untuk kuartal berikutnya bersama manajer\n\n📊 Evaluasi:\n• Probasi berakhir di bulan ke-3 — jadwalkan review dengan manajer\n• Kumpulkan feedback 360° dari rekan tim\n• Tetapkan area pengembangan diri untuk 6 bulan ke depan',
    chips: ['Rencana 30 hari', 'Rencana 60 hari', 'Eskalasi ke manajer'],
  },

  // ── Kontak & Eskalasi ──
  {
    id: 'kontak-01',
    kategori: 'Kontak & Eskalasi',
    keywords: ['kontak', 'hubungi', 'it support', 'helpdesk', 'bantuan teknis', 'tech support', 'telepon it'],
    jawaban: 'Kontak IT Support NusaTech:\n📧 Email: it-support@nusatech.id\n📞 Ext: 1001 (jam kerja)\n💬 Slack: #tech-support\n🎫 Tiket: jira.nusatech.id/helpdesk\n\nResponse time: P1 (kritis) 1 jam, P2 (tinggi) 4 jam, P3 (normal) 1 hari kerja.',
    chips: ['Kontak HRD', 'Kontak IT Security', 'Eskalasi ke manajer'],
  },
  {
    id: 'kontak-02',
    kategori: 'Kontak & Eskalasi',
    keywords: ['hrd', 'hr', 'human resource', 'sdm', 'kontak hr', 'personalia', 'payroll contact'],
    jawaban: 'Kontak HRD NusaTech:\n📧 Email: hr@nusatech.id\n📞 Ext: 1010\n💬 Slack: #hr-helpdesk\n\nUntuk urusan: cuti, payroll, benefit, kebijakan kerja, sertifikat kerja, dan dokumen ketenagakerjaan. Jam layanan: Senin–Jumat 09.00–17.00 WIB.',
    chips: ['Kebijakan cuti', 'Kebijakan WFH', 'Kontak IT Support'],
  },
  {
    id: 'kontak-03',
    kategori: 'Kontak & Eskalasi',
    keywords: ['security', 'keamanan', 'it security', 'insiden', 'darurat keamanan', 'lapor insiden'],
    jawaban: 'Kontak IT Security NusaTech:\n📧 Email: security@nusatech.id\n📞 Ext: 1337 (tersedia 24/7 untuk insiden kritis)\n💬 Slack: #security-incident\n\nGunakan untuk: laporan phishing, kebocoran data, akses tidak sah, malware, atau insiden keamanan apapun. JANGAN tunda pelaporan insiden keamanan!',
    chips: ['Kebijakan password', 'Aktifkan 2FA', 'Keamanan data'],
  },
  {
    id: 'kontak-04',
    kategori: 'Kontak & Eskalasi',
    keywords: ['eskalasi', 'eskalasi ke manajer', 'kontak manajer', 'manajer', 'mentor', 'buddy', 'eskalasi masalah', 'lapor ke manajer'],
    jawaban: 'Panduan Eskalasi Bertingkat NusaTech:\n\n1️⃣  Buka tiket helpdesk\n    jira.nusatech.id/helpdesk — untuk masalah teknis (akun, tools, akses)\n    📞 IT Support: it-support@nusatech.id | ext. 1001\n\n2️⃣  Hubungi Mentor / Buddy\n    Setiap karyawan baru mendapat buddy — cek email perkenalan dari HRD\n    💬 Slack: cari nama buddy Anda di direktori @nusatech\n\n3️⃣  Hubungi Manajer Langsung\n    📧 Kirim email atau Slack DM ke manajer Anda\n    📞 Nomor internal tersedia di direktori portal.nusatech.id/directory\n    Gunakan untuk: hambatan pekerjaan, keputusan prioritas, konflik tim\n\n4️⃣  Hubungi HRD (isu non-teknis)\n    📧 hr@nusatech.id | ext. 1010 | Slack: #hr-helpdesk\n    Gunakan untuk: konflik interpersonal, kebijakan perusahaan, kompensasi',
    chips: ['Kontak IT Support', 'Kontak HRD', 'Kontak IT Security'],
  },
];

/* ─────────────────────────────────────────────
   2. ONBOARDING CHECKLIST (10 tugas)
   Tersimpan di localStorage
   ───────────────────────────────────────────── */
const CHECKLIST_TASKS = [
  { id: 'task-1',  label: 'Aktivasi akun email korporat' },
  { id: 'task-2',  label: 'Aktifkan Two-Factor Authentication (2FA)' },
  { id: 'task-3',  label: 'Setup VPN (Cisco AnyConnect)' },
  { id: 'task-4',  label: 'Login ke Jira dan bergabung ke board tim' },
  { id: 'task-5',  label: 'Login ke GitLab dan clone repo pertama' },
  { id: 'task-6',  label: 'Bergabung ke channel Slack yang relevan' },
  { id: 'task-7',  label: 'Baca dokumentasi arsitektur di Confluence' },
  { id: 'task-8',  label: 'Setup environment development (IDE + tools)' },
  { id: 'task-9',  label: 'Jadwalkan 1-on-1 dengan manajer langsung' },
  { id: 'task-10', label: 'Selesaikan sesi orientasi HRD' },
];

const LS_KEY = 'onboardbuddy_checklist';

/* ─────────────────────────────────────────────
   3. UTILITY HELPERS
   ───────────────────────────────────────────── */

/** Normalise teks: huruf kecil, hapus tanda baca */
function normalise(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Periksa apakah keyword cocok dengan input menggunakan batas kata (word boundary).
 *  Keyword multi-kata dicocokkan sebagai frasa utuh; keyword satu kata
 *  harus dikelilingi oleh non-huruf agar tidak mencocokkan substring acak. */
function keywordMatches(normInput, normKw) {
  // Escape karakter regex khusus dalam keyword
  const escaped = normKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Batas kata: (?<!\w) dan (?!\w) — tidak bergantung pada \b agar aman untuk
  // kata non-ASCII dan frasa multi-kata yang diawali/diakhiri spasi.
  const pattern = new RegExp('(?<![a-z0-9])' + escaped + '(?![a-z0-9])');
  return pattern.test(normInput);
}

/** Hitung skor keyword match untuk satu entri KB.
 *  Setiap keyword yang cocok menyumbang skor = jumlah kata dalam keyword
 *  (frasa lebih panjang = lebih spesifik = skor lebih tinggi). */
function scoreEntry(normInput, entry) {
  let score = 0;
  for (const kw of entry.keywords) {
    const normKw = normalise(kw);
    if (keywordMatches(normInput, normKw)) {
      score += normKw.split(' ').length;
    }
  }
  return score;
}

/**
 * Cari semua entri KB beserta skornya, lalu kembalikan objek hasil:
 * {
 *   best: entri skor tertinggi | null,
 *   bestScore: number,
 *   runner: entri skor runner-up | null,   ← hanya jika ambiguitas
 *   ambiguous: boolean
 * }
 *
 * Ambiguitas terjadi bila selisih skor antara #1 dan #2 ≤ AMBIGUITY_DELTA
 * DAN keduanya berasal dari kategori berbeda — artinya pertanyaan user
 * bisa bermakna lebih dari satu hal.
 */
function matchIntent(rawInput) {
  const THRESHOLD       = 1;   // skor minimum agar dianggap cocok
  const AMBIGUITY_DELTA = 1;   // selisih skor #1 vs #2 yang dianggap ambigu

  const norm    = normalise(rawInput);
  const scored  = KB
    .map((entry) => ({ entry, score: scoreEntry(norm, entry) }))
    .filter((r)  => r.score >= THRESHOLD)
    .sort((a, b) => b.score - a.score);   // descending

  if (scored.length === 0) {
    return { best: null, bestScore: 0, runner: null, ambiguous: false };
  }

  const best      = scored[0].entry;
  const bestScore = scored[0].score;

  // Cek ambiguitas: ada runner-up dari kategori berbeda dengan skor sangat dekat
  const runnerUp  = scored.find(
    (r) => r.entry.kategori !== best.kategori &&
           (bestScore - r.score) <= AMBIGUITY_DELTA
  );

  return {
    best,
    bestScore,
    runner:    runnerUp ? runnerUp.entry : null,
    ambiguous: !!runnerUp,
  };
}

/* ─────────────────────────────────────────────
   4. DOM REFERENCES
   ───────────────────────────────────────────── */
const chatMessages  = document.getElementById('chatMessages');
const quickReplies  = document.getElementById('quickReplies');
const chatForm      = document.getElementById('chatForm');
const chatInput     = document.getElementById('chatInput');
const checklistEl   = document.getElementById('checklistItems');
const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const progressBar   = document.getElementById('progressBar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar       = document.getElementById('sidebar');

/* ─────────────────────────────────────────────
   5. CHECKLIST — render & state
   ───────────────────────────────────────────── */

/** Ambil status checklist dari localStorage */
function loadChecklist() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
}

/** Simpan status checklist ke localStorage */
function saveChecklist(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

/** Render ulang seluruh checklist dan progress bar */
function renderChecklist() {
  const state = loadChecklist();
  checklistEl.innerHTML = '';

  CHECKLIST_TASKS.forEach((task) => {
    const done = !!state[task.id];

    const li = document.createElement('li');
    li.className = 'task-item' + (done ? ' done' : '');
    li.setAttribute('role', 'listitem');

    const cb = document.createElement('input');
    cb.type    = 'checkbox';
    cb.id      = task.id;
    cb.checked = done;
    cb.setAttribute('aria-label', task.label);

    const lbl = document.createElement('label');
    lbl.htmlFor     = task.id;
    lbl.textContent = task.label;

    cb.addEventListener('change', () => {
      const s = loadChecklist();
      if (cb.checked) {
        s[task.id] = true;
      } else {
        delete s[task.id];
      }
      saveChecklist(s);
      renderChecklist();
    });

    li.appendChild(cb);
    li.appendChild(lbl);
    checklistEl.appendChild(li);
  });

  // Update progress bar
  const doneCount = Object.keys(state).filter(k => state[k]).length;
  const pct = Math.round((doneCount / CHECKLIST_TASKS.length) * 100);
  progressFill.style.width  = pct + '%';
  progressLabel.textContent = doneCount + '/' + CHECKLIST_TASKS.length;
  progressBar.setAttribute('aria-valuenow', doneCount);
}

/* ─────────────────────────────────────────────
   6. CHAT MESSAGE RENDERING
   ───────────────────────────────────────────── */

/**
 * Tambahkan pesan ke area chat.
 * @param {'agent'|'user'} role
 * @param {string} text - plain text (bukan HTML)
 */
function appendMessage(role, text) {
  const row = document.createElement('div');
  row.className = 'msg-row msg-enter' + (role === 'user' ? ' msg-row-user' : '');

  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'avatar avatar-' + role;
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'agent' ? 'OB' : 'Anda';

  // Bubble
  const bubble = document.createElement('div');
  bubble.className = 'bubble-' + role;

  // Render teks dengan baris baru (tanpa innerHTML)
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (i > 0) bubble.appendChild(document.createElement('br'));
    bubble.appendChild(document.createTextNode(line));
  });

  row.appendChild(role === 'agent' ? avatar : bubble);
  row.appendChild(role === 'agent' ? bubble : avatar);

  chatMessages.appendChild(row);
  scrollToBottom();

  return row;
}

/** Scroll ke pesan terbawah */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ─────────────────────────────────────────────
   7. TYPING INDICATOR
   ───────────────────────────────────────────── */

let typingRow = null;

function showTyping() {
  if (typingRow) return;

  typingRow = document.createElement('div');
  typingRow.className = 'msg-row msg-enter';
  typingRow.setAttribute('aria-label', 'OnboardBuddy sedang mengetik');

  const avatar = document.createElement('div');
  avatar.className = 'avatar avatar-agent';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = 'OB';

  const bubble = document.createElement('div');
  bubble.className = 'bubble-agent flex gap-1 items-center py-2';

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'typing-dot';
    bubble.appendChild(dot);
  }

  typingRow.appendChild(avatar);
  typingRow.appendChild(bubble);
  chatMessages.appendChild(typingRow);
  scrollToBottom();
}

function hideTyping() {
  if (typingRow) {
    typingRow.remove();
    typingRow = null;
  }
}

/* ─────────────────────────────────────────────
   8. QUICK REPLY CHIPS
   ───────────────────────────────────────────── */

/** Tampilkan chips; klik chip → simulasi input user */
function showChips(chips) {
  quickReplies.innerHTML = '';
  if (!chips || chips.length === 0) return;

  chips.forEach((label) => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'chip';
    btn.textContent = label;
    btn.setAttribute('aria-label', 'Tanya: ' + label);

    btn.addEventListener('click', () => {
      handleUserMessage(label);
    });

    quickReplies.appendChild(btn);
  });
}

/** Hapus semua chips */
function clearChips() {
  quickReplies.innerHTML = '';
}

/* ─────────────────────────────────────────────
   9. PROACTIVE RECOMMENDATION — intent "next_task"
   Mendeteksi pertanyaan tentang tugas/aktivitas berikutnya menggunakan
   dua lapisan: (a) frasa lengkap eksak, (b) kombinasi token sinyal.
   ───────────────────────────────────────────── */

// Frasa lengkap — cocok jika salah satu ada di input (substring)
const PROACTIVE_PHRASES = [
  'tugas hari ini',
  'task hari ini',
  'harus kerjakan apa',
  'mulai dari mana',
  'checklist saya',
  'progress saya',
  'apa yang belum selesai',
  'yang belum selesai',
  'belum selesai',
  'tugas berikutnya',
  'next task',
  'to do',
  'ngerjain apa',
  'ngapain hari ini',
  'harus ngapain',
  'mau ngapain',
  'kerja apa',
  'lanjut apa',
  'selanjutnya apa',
  'berikutnya apa',
  'apa selanjutnya',
  'apa berikutnya',
];

// Token sinyal — Lapisan 2 terpicu jika input mengandung ≥1 dari kolom AKTIVITAS
// DAN ≥1 dari kolom WAKTU/URUTAN, sehingga butuh dua konteks berbeda sekaligus.
const PROACTIVE_ACTIVITY_TOKENS = [
  'kerjakan', 'ngerjain', 'ngerjakan', 'kerjain', 'dikerjakan',
  'lakukan', 'lanjutkan', 'todo', 'checklist', 'progress',
];
const PROACTIVE_TIME_TOKENS = [
  'hari ini', 'sekarang', 'duluan', 'pertama kali',
  'mulai dari', 'selanjutnya', 'berikutnya', 'next',
];

/**
 * Kembalikan true jika input cocok dengan intent "next_task".
 * Menggunakan batas kata (keywordMatches) agar token pendek seperti
 * "ini" tidak cocok di dalam kata lain.
 */
function isProactiveQuery(normInput) {
  // Lapisan 1: frasa lengkap (substring sederhana sudah cukup karena frasa cukup spesifik)
  if (PROACTIVE_PHRASES.some((p) => normInput.includes(p))) return true;

  // Lapisan 2: kombinasi token aktivitas + token waktu/urutan
  const hasActivity = PROACTIVE_ACTIVITY_TOKENS.some((t) => keywordMatches(normInput, t));
  const hasTime     = PROACTIVE_TIME_TOKENS.some((t) => keywordMatches(normInput, t));
  return hasActivity && hasTime;
}

/**
 * Bangun respons proaktif berdasarkan status checklist.
 * Menampilkan: progress, 1 tugas prioritas utama, 2 tugas berikutnya sebagai gambaran.
 */
function buildProactiveResponse() {
  const state     = loadChecklist();
  const pending   = CHECKLIST_TASKS.filter((t) => !state[t.id]);
  const doneCount = CHECKLIST_TASKS.length - pending.length;

  if (pending.length === 0) {
    return (
      '🎉 Luar biasa! Semua 10 tugas onboarding sudah selesai!\n\n' +
      'Saatnya fokus pada kontribusi nyata:\n' +
      '• Pelajari rencana 30-60-90 hari ke depan\n' +
      '• Ambil tiket pertama di Jira\n' +
      '• Jadwalkan 1-on-1 lanjutan dengan manajer Anda'
    );
  }

  // Tugas prioritas utama (indeks 0) + 2 gambaran berikutnya (indeks 1-2)
  const [first, ...rest] = pending;
  const upcoming = rest.slice(0, 2);

  let response =
    `📊 Progress onboarding Anda: ${doneCount} dari ${CHECKLIST_TASKS.length} tugas selesai.\n\n` +
    `✅ Prioritas utama hari ini:\n→ ${first.label}\n`;

  if (upcoming.length > 0) {
    response +=
      `\n📋 Setelah itu, lanjutkan dengan:\n` +
      upcoming.map((t, i) => `${i + 2}. ${t.label}`).join('\n');
  }

  response += '\n\nCentang tugas di checklist sidebar setelah selesai ya! 💪';
  return response;
}

/* ─────────────────────────────────────────────
   10. FALLBACK RESPONSE
   ───────────────────────────────────────────── */

// Satu entri per kategori — memastikan saran fallback selalu bisa dijawab KB
const FALLBACK_SUGGESTIONS = [
  { text: 'Cara aktivasi akun email korporat', kategori: 'Akun & Akses' },
  { text: 'Cara setup VPN',                    kategori: 'Akun & Akses' },
  { text: 'Cara menggunakan Jira',              kategori: 'Tools Developer' },
  { text: 'Cara akses Confluence',              kategori: 'Tools Developer' },
  { text: 'Apa kebijakan WFH di NusaTech?',    kategori: 'Kebijakan HR' },
  { text: 'Berapa hari cuti tahunan?',          kategori: 'Kebijakan HR' },
  { text: 'Aktifkan 2FA',                       kategori: 'Keamanan' },
  { text: 'Keamanan data di NusaTech',          kategori: 'Keamanan' },
  { text: 'Apa rencana 30 hari pertama?',       kategori: 'Rencana 30-60-90 Hari' },
  { text: 'Kontak IT Support',                  kategori: 'Kontak & Eskalasi' },
  { text: 'Eskalasi ke manajer',                kategori: 'Kontak & Eskalasi' },
];

/**
 * Ambil `count` saran acak dari daftar fallback.
 * @param {number} count
 * @param {string|null} excludeKategori - kategori yang baru saja dijawab; saran
 *   dari kategori ini dikeluarkan terlebih dahulu agar tidak mengulang topik.
 */
function getRandomSuggestions(count = 3, excludeKategori = null) {
  const pool = excludeKategori
    ? FALLBACK_SUGGESTIONS.filter((s) => s.kategori !== excludeKategori)
    : FALLBACK_SUGGESTIONS;
  // Fallback aman: jika pool terlalu kecil setelah filter, gunakan semua
  const source = pool.length >= count ? pool : FALLBACK_SUGGESTIONS;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((s) => s.text);
}

function buildFallbackResponse(suggestions) {
  return (
    'Maaf, saya belum yakin dengan pertanyaan Anda. 🤔\n\n' +
    'Mungkin maksud Anda salah satu dari ini?\n' +
    suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n') +
    '\n\nAtau hubungi langsung:\n' +
    '• IT Support: it-support@nusatech.id | ext. 1001\n' +
    '• HRD: hr@nusatech.id | ext. 1010'
  );
}

/* ─────────────────────────────────────────────
   11. CORE MESSAGE HANDLER
   ───────────────────────────────────────────── */

function handleUserMessage(rawText) {
  const text = rawText.trim();
  if (!text) return;

  // Tampilkan pesan user
  appendMessage('user', text);
  clearChips();
  chatInput.value = '';

  // Typing indicator
  showTyping();

  // Simulasi delay agent (lebih natural)
  const delay = 600 + Math.random() * 600;

  setTimeout(() => {
    hideTyping();

    const norm = normalise(text);

    // Cek proactive query terlebih dahulu
    if (isProactiveQuery(norm)) {
      const resp = buildProactiveResponse();
      appendMessage('agent', resp);
      showChips(['Rencana 30 hari', 'Rencana 60 hari', 'Eskalasi ke manajer']);
      return;
    }

    // Intent matching dengan deteksi ambiguitas
    const { best, ambiguous, runner } = matchIntent(text);

    if (!best) {
      // Tidak ada entri yang memenuhi threshold → fallback
      // Hindari menyarankan topik dari kategori yang baru saja dijawab
      // (lacak dari pesan agent terakhir yang berhasil — simpan di closure)
      const suggestions = getRandomSuggestions(3, handleUserMessage._lastKategori || null);
      appendMessage('agent', buildFallbackResponse(suggestions));
      showChips(suggestions.slice(0, 3));
    } else if (ambiguous && runner) {
      // Dua entri dari kategori berbeda dengan skor sangat dekat → minta klarifikasi
      appendMessage(
        'agent',
        'Pertanyaan Anda bisa bermakna lebih dari satu hal. Maksud Anda yang mana? 🤔'
      );
      // Tampilkan chip klarifikasi: label yang secara eksplisit menyebut topik
      showChips([
        best.chips[0]   || best.kategori,
        runner.chips[0] || runner.kategori,
      ]);
    } else {
      // Satu pemenang jelas — catat kategori untuk dieksklusi dari fallback berikutnya
      handleUserMessage._lastKategori = best.kategori;
      appendMessage('agent', best.jawaban);
      showChips(best.chips || []);
    }
  }, delay);
}

/* ─────────────────────────────────────────────
   12. FORM SUBMIT & EVENT LISTENERS
   ───────────────────────────────────────────── */

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleUserMessage(chatInput.value);
});

// Enter key (handled by submit event above for <form>)
// Sudah di-handle via form submit.

// Mobile sidebar toggle
sidebarToggle.addEventListener('click', () => {
  const isOpen = sidebar.classList.contains('open');

  if (isOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

function openSidebar() {
  sidebar.classList.add('open');
  sidebarToggle.setAttribute('aria-expanded', 'true');

  // Overlay
  let overlay = document.getElementById('sidebarOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebarOverlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeSidebar);
  }
  overlay.classList.add('open');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarToggle.setAttribute('aria-expanded', 'false');
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.classList.remove('open');
}

/* ─────────────────────────────────────────────
   13. WELCOME MESSAGE
   Tampilkan saat halaman pertama kali dibuka
   ───────────────────────────────────────────── */
function showWelcome() {
  const hour  = new Date().getHours();
  const salam = hour < 12 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : 'Selamat sore';

  appendMessage(
    'agent',
    `${salam}! 👋 Saya OnboardBuddy, asisten onboarding Anda di NusaTech.\n\n` +
    `Saya bisa membantu Anda dengan:\n` +
    `• Setup akun & akses (email, VPN, SSO)\n` +
    `• Tools developer (Jira, GitLab, Slack, VS Code)\n` +
    `• Kebijakan HR (cuti, WFH, jam kerja)\n` +
    `• Keamanan (password, 2FA, data)\n` +
    `• Rencana 30-60-90 hari\n` +
    `• Kontak & eskalasi\n\n` +
    `Ketik pertanyaan Anda atau pilih topik di bawah!`
  );

  showChips([
    'Cara aktivasi akun email',
    'Apa yang harus saya kerjakan hari ini?',
    'Cara setup VPN',
    'Kebijakan WFH NusaTech',
  ]);
}

/* ─────────────────────────────────────────────
   14. INIT
   ───────────────────────────────────────────── */
function init() {
  renderChecklist();
  showWelcome();
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', init);
