# 🪡 CANTING — Platform Rekomendasi Batik Tegalan

CANTING adalah platform web untuk mencari dan merekomendasikan batik Tegalan terbaik menggunakan metode **SPK (Sistem Pendukung Keputusan) TOPSIS** berbasis lokasi pengguna. Platform ini membantu pengguna menemukan produk batik terbaik dari sanggar-sanggar batik di Kota Tegal berdasarkan kriteria harga, jarak, kualitas, popularitas, dan desain.

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Struktur Project](#struktur-project)
- [Cara Menjalankan](#cara-menjalankan)
- [Penjelasan Database](#penjelasan-database)
- [Penjelasan SPK TOPSIS](#penjelasan-spk-topsis)
- [API Endpoints](#api-endpoints)
- [Peran Pengguna](#peran-pengguna)

---

## ✨ Fitur Utama

- 🔍 **Pencarian Produk Batik** — filter berdasarkan wilayah, kategori, dan rentang harga
- 🤖 **Rekomendasi SPK TOPSIS** — ranking produk batik terbaik berdasarkan bobot kriteria yang dipilih user
- 📍 **Berbasis Lokasi** — menghitung jarak user ke sanggar menggunakan rumus Haversine
- 🗺️ **Peta Interaktif** — menampilkan titik lokasi semua sanggar terdaftar
- ⭐ **Sistem Ulasan & Rating** — user dapat memberikan rating kualitas, popularitas, dan desain
- 👤 **Multi Role** — Super Admin, Admin Sanggar, dan User biasa
- 🔐 **Autentikasi JWT** — login, register, lupa password dengan OTP via email
- 📱 **Responsive** — dapat diakses dari HP, tablet, dan desktop

---

## 🛠️ Teknologi

### Frontend
| Teknologi | Versi | Fungsi |
|---|---|---|
| React | 19 | UI Library |
| TypeScript | 6 | Type Safety |
| Vite | 8 | Build Tool |
| TailwindCSS | 3 | Styling |
| React Router DOM | 7 | Routing |
| TanStack Query | 5 | Data Fetching & Caching |
| Axios | 1 | HTTP Client |
| Zustand | 5 | State Management (Auth) |
| React Leaflet | 5 | Peta Interaktif |
| Framer Motion | 12 | Animasi |
| Zod | 4 | Validasi Form |
| React Hook Form | 7 | Form Management |
| Recharts | 3 | Grafik Dashboard |
| Lucide React | 1 | Icon |

### Backend
| Teknologi | Versi | Fungsi |
|---|---|---|
| Node.js + Express | 5 | Web Server |
| TypeScript | 5 | Type Safety |
| Prisma ORM | 6 | Database Access |
| MySQL / MariaDB | 10.4+ | Database |
| JWT | 9 | Autentikasi |
| Bcrypt | 6 | Hash Password |
| Nodemailer | 9 | Kirim Email OTP |
| UUID | 14 | Generate Session ID |
| ts-node-dev | 2 | Hot Reload Dev |

---

## 📁 Struktur Project

```
uassss/
├── Frontend/                  # Aplikasi React
│   ├── public/                # Asset statis (gambar, icon)
│   ├── src/
│   │   ├── assets/            # Asset komponen (SVG, pattern)
│   │   ├── components/        # Komponen reusable
│   │   │   ├── layouts/       # Layout (Navbar, Footer, Sidebar)
│   │   │   ├── UI/            # Komponen UI dasar (Button, Card, Input)
│   │   │   ├── Map/           # Komponen peta Leaflet
│   │   │   ├── Product/       # Card produk
│   │   │   └── Sanggar/       # Card & carousel sanggar
│   │   ├── pages/             # Halaman-halaman aplikasi
│   │   │   ├── Home/          # Landing page
│   │   │   ├── Katalog/       # Katalog produk + SPK TOPSIS
│   │   │   ├── ProductDetail/ # Detail produk & ulasan
│   │   │   ├── SanggarDetail/ # Detail sanggar
│   │   │   ├── ProdukList/    # Daftar semua produk
│   │   │   ├── RecommendationResult/ # Hasil ranking TOPSIS
│   │   │   ├── Form/         # Login, Register, Forgot Password
│   │   │   ├── adminSanggar/  # Dashboard Admin Sanggar
│   │   │   └── superAdmin/    # Dashboard Super Admin
│   │   ├── services/          # API calls (axios)
│   │   ├── stores/            # Zustand store (auth)
│   │   ├── types/             # TypeScript types
│   │   ├── hooks/             # Custom hooks
│   │   └── routes/            # Routing & Protected Route
│   ├── .env                   # Variabel environment frontend
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                   # API Server Express
│   ├── src/
│   │   ├── config/            # Konfigurasi Prisma
│   │   ├── controllers/       # Logic request handler
│   │   ├── routes/            # Definisi endpoint API
│   │   ├── services/          # Business logic (TOPSIS, SPK)
│   │   ├── middlewares/       # Auth middleware (JWT)
│   │   └── utils/             # Helper (response, mailer)
│   ├── prisma/
│   │   ├── schema.prisma      # Definisi model database
│   │   ├── seed.ts            # Data awal database
│   │   └── migrations/        # History migrasi database
│   ├── .env                   # Variabel environment backend
│   └── package.json
│
└── README.md
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js >= 18
- MySQL / MariaDB
- npm

### 1. Clone & Setup Database

Import file SQL ke MySQL/phpMyAdmin:
```
batiktegal.sql
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
```

Isi file `backend/.env`:
```env
DATABASE_URL="mysql://root:@localhost:3306/batiktegal"
JWT_SECRET="your_jwt_secret_key"
PORT=3000
EMAIL_USER="emailkamu@gmail.com"
EMAIL_PASS="app_password_gmail"
```

```bash
# Generate Prisma client
npm run prisma:generate

# Jalankan backend
npm run dev
```

Backend berjalan di: `http://localhost:3000`

### 3. Setup Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Buat file .env
```

Isi file `Frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

```bash
# Jalankan frontend
npm run dev
```

Frontend berjalan di: `http://localhost:5173`

---

## 🗄️ Penjelasan Database

Database: **batiktegal** (MySQL/MariaDB)

### Tabel Utama

| Tabel | Fungsi |
|---|---|
| `users` | Data pengguna (Super Admin, Admin, User) |
| `regions` | Wilayah kecamatan di Kota Tegal |
| `sanggars` | Data sanggar batik (nama, alamat, koordinat) |
| `batik_categories` | Kategori batik (Pesisiran, Pedalaman, Kontemporer) |
| `products` | Produk batik di tiap sanggar |
| `reviews` | Ulasan produk (kualitas, popularitas, desain) |
| `criterias` | Kriteria SPK TOPSIS |
| `weight_histories` | Riwayat bobot kriteria yang dipilih user |
| `spk_sessions` | Sesi pencarian SPK per user |

### View SQL TOPSIS

View dibuat manual di database untuk perhitungan TOPSIS:

| View | Fungsi |
|---|---|
| `v_topsis_base` | Data mentah produk + hitung jarak Haversine + avg review |
| `v_topsis_pembagi` | Hitung √(Σx²) per kriteria untuk normalisasi |
| `v_topsis_norm_terbobot` | Normalisasi × bobot = xij / √(Σxij²) × wj |
| `v_topsis_ideal` | Solusi ideal positif (A+) dan negatif (A-) |
| `v_topsis_jarak` | Jarak D+ ke A+ dan D- ke A- |
| `v_topsis_hasil` | Skor preferensi = D- / (D+ + D-) |

---

## 📊 Penjelasan SPK TOPSIS

TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) digunakan untuk meranking produk batik terbaik.

### 5 Kriteria

| Kode | Kriteria | Atribut | Sumber Data |
|---|---|---|---|
| C1 | Harga | Cost (makin murah makin baik) | `products.price` |
| C2 | Jarak | Cost (makin dekat makin baik) | Haversine(userLat, userLon, sanggar.lat, sanggar.lon) |
| C3 | Kualitas | Benefit (makin tinggi makin baik) | AVG(reviews.quality) |
| C4 | Popularitas | Benefit | AVG(reviews.popularity) |
| C5 | Desain | Benefit | AVG(reviews.design) |

### Alur Perhitungan

```
1. User pilih kriteria di dropdown Katalog
        ↓
2. Backend buat bobot: kriteria dipilih = 5, lainnya = 1
   → disimpan ke tabel weight_histories
        ↓
3. Backend buat spk_session (lokasi user + bobot + filter)
        ↓
4. Query view SQL berantai:
   v_topsis_base → v_topsis_pembagi → v_topsis_norm_terbobot
   → v_topsis_ideal → v_topsis_jarak → v_topsis_hasil
        ↓
5. Return hasil dengan skor 0-1, diurutkan dari tertinggi
```

### Rumus TOPSIS

```
Normalisasi  : rij = xij / √(Σxij²)
Terbobot     : vij = wj × rij
Ideal A+     : max(vij) untuk Benefit, min(vij) untuk Cost
Ideal A-     : min(vij) untuk Benefit, max(vij) untuk Cost
Jarak D+     : √Σ(vij - A+j)²
Jarak D-     : √Σ(vij - A-j)²
Skor         : Ci = D-i / (D+i + D-i)   → range 0 sampai 1
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| POST | `/auth/login` | Public | Login |
| POST | `/auth/register` | Public | Register |
| POST | `/auth/forgot-password` | Public | Kirim OTP reset password |
| POST | `/auth/verify-otp` | Public | Verifikasi OTP |
| POST | `/auth/reset-password` | Public | Reset password |
| GET | `/products` | Public | Daftar produk (filter: sanggarId, regionId, categoryId, harga) |
| GET | `/products/:id` | Public | Detail produk |
| POST | `/products` | Admin Sanggar | Tambah produk |
| PUT | `/products/:id` | Admin Sanggar | Edit produk |
| DELETE | `/products/:id` | Admin/Super Admin | Hapus produk |
| GET | `/sanggars` | Public | Daftar sanggar |
| GET | `/sanggars/me` | Admin Sanggar | Sanggar milik admin login |
| GET | `/sanggars/:id` | Public | Detail sanggar |
| POST | `/reviews` | Public | Tambah ulasan |
| GET | `/regions` | Public | Daftar wilayah |
| GET | `/batik-categories` | Public | Daftar kategori batik |
| POST | `/weight-histories` | Public | Buat bobot SPK |
| POST | `/recommendations/run` | Public | Jalankan TOPSIS |
| GET | `/dashboard/summary` | Super Admin | Statistik dashboard |
| GET | `/users` | Super Admin | Kelola pengguna |

---

## 👥 Peran Pengguna

| Role | Akses |
|---|---|
| **Super Admin** | Kelola semua user, sanggar, wilayah, kategori, produk, kriteria SPK |
| **Admin Sanggar** | Kelola produk sanggar miliknya, lihat ulasan, edit profil sanggar |
| **User** | Lihat katalog, beri ulasan & rating, jalankan SPK TOPSIS |
| **Tamu (tanpa login)** | Lihat katalog, lihat detail produk & sanggar, jalankan SPK TOPSIS |

---

## 📱 Halaman Aplikasi

| Halaman | URL | Deskripsi |
|---|---|---|
| Home | `/` | Landing page, hero, sanggar rekomendasi, produk unggulan |
| Katalog | `/katalog` | Daftar produk + filter + SPK TOPSIS |
| Detail Produk | `/produk/:id` | Info produk, ulasan, lokasi sanggar di peta |
| Detail Sanggar | `/sanggar/:id` | Info sanggar dan daftar produknya |
| Semua Produk | `/produk` | Daftar semua produk |
| Hasil Rekomendasi | `/rekomendasi/hasil` | Hasil ranking TOPSIS |
| Login | `/login` | Halaman login |
| Dashboard Admin Sanggar | `/admin-sanggar` | Kelola produk & ulasan sanggar |
| Dashboard Super Admin | `/super-admin` | Kelola seluruh data platform |

---

## 👨‍💻 Developer

**CANTING** — Dibuat sebagai project UAS Pemrograman Web  
Universitas · Semester 4 · 2026
