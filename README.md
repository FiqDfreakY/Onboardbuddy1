# OnboardBuddy 🤖

> Asisten onboarding berbasis AI untuk karyawan IT baru di **NusaTech** — dibangun dengan HTML5, Tailwind CSS, dan Vanilla JavaScript murni.

---

## 📁 Struktur File

```
onboardbuddy/
├── index.html   — Struktur halaman (chat UI + sidebar checklist)
├── style.css    — Custom styles (animasi, bubble, chips, checklist)
├── script.js    — Knowledge base, intent matching, dan logika chat
└── README.md    — Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

### Opsi 1 — VS Code Live Server (Direkomendasikan)

1. Pastikan ekstensi **Live Server** sudah terinstal di VS Code.
2. Buka folder project di VS Code.
3. Klik kanan `index.html` → **"Open with Live Server"**.
4. Browser akan membuka `http://127.0.0.1:5500` secara otomatis.

### Opsi 2 — Python HTTP Server

```bash
# Python 3
python -m http.server 8080
# Buka browser: http://localhost:8080
```

### Opsi 3 — Node.js `serve`

```bash
npx serve .
# Buka URL yang tertera di terminal
```

> ⚠️ **Jangan buka `index.html` langsung via `file://`** — beberapa browser memblokir fitur localStorage pada protokol file.

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|-----------|
| 💬 Chat UI | Bubble pesan user & agent, indikator mengetik, auto-scroll |
| ⌨️ Kirim dengan Enter | Tekan Enter atau klik tombol Kirim |
| 🧠 Intent Matching | Berbasis skor keyword (normalise → lowercase + hapus tanda baca) |
| 🔁 Quick Reply Chips | Muncul setelah setiap jawaban agent |
| 📋 Checklist Onboarding | 10 tugas, checkbox, progress bar — tersimpan di localStorage |
| 🎯 Rekomendasi Proaktif | Tanya "apa yang harus saya kerjakan hari ini?" |
| 🛡️ XSS-Safe | Render pesan dengan `textContent` / `createTextNode` |
| ♿ Aksesibel | `aria-live`, `aria-label`, `role`, kontras WCAG AA |
| 📱 Responsif | Mobile-first; sidebar muncul sebagai panel geser di layar kecil |

---

## 🗂️ Kategori Knowledge Base (22 Entri)

| # | Kategori | Jumlah Entri |
|---|----------|:---:|
| 1 | Akun & Akses | 4 |
| 2 | Tools Developer | 5 |
| 3 | Kebijakan HR | 4 |
| 4 | Keamanan | 3 |
| 5 | Rencana 30-60-90 Hari | 3 |
| 6 | Kontak & Eskalasi | 3 |

---

## 🧪 Contoh Pertanyaan Uji

Berikut pertanyaan yang dapat Anda coba untuk menguji setiap kategori:

### Akun & Akses
- `"Bagaimana cara aktivasi akun email korporat?"`
- `"Lupa password, bagaimana cara reset?"`
- `"Apa itu SSO di NusaTech?"`
- `"Bagaimana cara setup VPN?"`

### Tools Developer
- `"Bagaimana cara menggunakan Jira?"`
- `"Di mana repository GitLab kita?"`
- `"Apa itu Confluence?"`
- `"Cara install IDE yang direkomendasikan?"`
- `"Bagaimana bergabung ke Slack?"`

### Kebijakan HR
- `"Berapa hari cuti tahunan saya?"`
- `"Jam kerja kantor jam berapa?"`
- `"Bagaimana kebijakan WFH NusaTech?"`
- `"Kapan gaji dibayarkan?"`

### Keamanan
- `"Bagaimana cara aktifkan 2FA?"`
- `"Apa kebijakan keamanan data?"`
- `"Saya menerima email phishing, apa yang harus dilakukan?"`

### Rencana 30-60-90 Hari
- `"Apa yang harus saya lakukan di 30 hari pertama?"`
- `"Rencana bulan kedua seperti apa?"`
- `"Apa target di 90 hari pertama?"`

### Kontak & Eskalasi
- `"Bagaimana cara menghubungi IT Support?"`
- `"Kontak HRD NusaTech apa?"`
- `"Nomor darurat IT Security berapa?"`

### Rekomendasi Proaktif
- `"Apa yang harus saya kerjakan hari ini?"`
- `"Mulai dari mana ya?"`
- `"Checklist saya progress-nya bagaimana?"`

### Fallback (skor rendah)
- `"Gimana cuaca hari ini?"` → agent akan menampilkan 3 saran dan kontak eskalasi

---

## 💾 localStorage

Status checklist disimpan dengan key `onboardbuddy_checklist` di localStorage browser. Untuk reset:

```javascript
// Buka DevTools Console (F12), jalankan:
localStorage.removeItem('onboardbuddy_checklist');
location.reload();
```

---

## 🛠️ Teknologi

- **HTML5** — Semantic markup, ARIA
- **Tailwind CSS v3** — via CDN (tidak perlu instalasi)
- **Vanilla JavaScript** — ES6+, tanpa framework/library eksternal

---

## 📝 Catatan Pengembangan

- Seluruh kode berjalan di browser — tidak ada server, tidak ada API call.
- Knowledge base dapat diperluas dengan menambahkan objek baru ke array `KB` di `script.js`.
- Intent matching menggunakan skor sederhana; dapat ditingkatkan dengan TF-IDF atau fuzzy matching di masa depan.
- Ambang batas matching (`THRESHOLD`) saat ini bernilai `1` — turunkan ke `0` untuk mematikan fallback.
