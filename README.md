# Portfolio — M. Asmaul Habib

Website portfolio freelance IT Developer (single-page, statis) dengan:

- Tema hijau tua (dark) + toggle light
- Bilingual **EN / ID** (default English, tersimpan di localStorage)
- Animasi: kartun developer, typed role, counters, reveal, tilt, scroll progress
- 6 jasa IT, 6 project portfolio (Project Highlights), cara pemesanan 4 langkah, form kontak → WhatsApp
- Kontak: WhatsApp, Email (placeholder — ganti dengan kontak asli Anda)

---

## Struktur File

```
portopolio/
├── index.html       → halaman utama (semua konten di sini)
├── styles.css       → styling & tema (hijau tua + light)
├── script.js        → animasi, toggle bahasa/tema, form → WhatsApp
├── assets/          → gambar portfolio (portfolio-1.png s.d. portfolio-6.png)
├── serve_https.py   → (opsional) server HTTPS lokal untuk testing
├── start.sh         → script menjalankan server HTTPS lokal
├── vercel.json      → konfigurasi deploy ke Vercel
└── README.md
```

---

## 1. Jalan Lokal (Testing)

**Cara A (start.sh):**
```bash
./start.sh
```

**Cara B (Python):**
```bash
python3 serve_https.py 4433
```

Buka `https://localhost:4433` di browser.

> Sertifikat self-signed → browser akan tampilkan peringatan, klik "Advanced → Proceed".

---

## 2. Upload ke GitHub

1. Buat repository baru di https://github.com/new (public atau private).
   Jangan centang "Add a README" (biar tidak bentrok).

2. Dari folder proyek:
```bash
git init
git add .
git commit -m "Initial commit: portfolio Asmaul Habib"
git branch -M main
git remote add origin https://github.com/NAMA_AKUN/NAMA_REPO.git
git push -u origin main
```

3. Setelah push, link repository siap diimport ke Vercel.

---

## 3. Deploy ke Vercel

### Cara 1 — Import dari GitHub (default)
1. Buka https://vercel.com → klik **Add New… → Project**
2. Pilih repository-portfolio Anda → klik **Import**
3. Setelan (biarkan default, bukan wajib diubah):
   - **Framework Preset**: `Other`
   - **Build Command**: `(kosongkan)`
   - **Output Directory**: `(kosongkan)`
4. Klik **Deploy** → selesai, Vercel otomatis mendeteksi halaman statis.

Site langsung online di `https://your-project.vercel.app`.

### Cara 2 — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel          # deploy (production)
vercel --prod   # deploy ke production setelah preview
```

---

## 4. Custom Domain (Opsional)

Di dashboard Vercel → project → **Settings → Domains**:
- Tambahkan domain Anda lalu ikuti instruksi DNS (A record / CNAME) dari Vercel.

---

## 5. Mengganti Kontak Asli

Nomor WhatsApp & email masih **placeholder**:

**index.html** — cari & ganti semua:
- `6280000000000` → nomor WhatsApp Anda (format internasional tanpa `+`, mis. `6281234567890`)
- `habib@freelancer.com` → email asli Anda
- Teks `+62 8XX-XXXX-XXXX` dan `habib@freelancer.com` di bagian Kontak

Setelah diganti, push ulang ke GitHub → Vercel otomatis redeploy.

---

## 6. Mengganti Gambar Portfolio

Gambar proyek ada di folder `assets/` (`640×400 px`):
- `portfolio-1.png` → Business Dashboard
- `portfolio-2.png` → CRM System
- `portfolio-3.png` → API Integration
- `portfolio-4.png` → GPS Tracking System
- `portfolio-5.png` → Online Shop
- `portfolio-6.png` → AI Agentic E-Commerce

Ganti file dengan screenshot asli proyek Anda (nama file tetap, ukuran bebas — CSS memotong otomatis via `object-fit: cover`).

---

## Catatan

- `serve_https.py` & `start.sh` hanya untuk lokal, **tidak dipakai di Vercel**.
- Vercel hanya melayani file statis (`index.html`, `styles.css`, `script.js`, `assets/`).
- Ubah bahasa di website via tombol **EN/ID** di navbar (tersimpan otomatis).