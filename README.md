# 🪡 CANTING — Platform Rekomendasi Batik Tegalan

CANTING adalah platform web untuk mencari dan merekomendasikan batik Tegalan terbaik menggunakan metode **SPK (Sistem Pendukung Keputusan) TOPSIS** berbasis lokasi pengguna. Platform ini membantu pengguna menemukan produk batik terbaik dari sanggar-sanggar batik di Kota Tegal berdasarkan kriteria harga, jarak, kualitas, popularitas, dan desain.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi](#️-teknologi)
- [Struktur Project](#-struktur-project)
- [Cara Menjalankan](#-cara-menjalankan)
- [Penjelasan Database](#️-penjelasan-database)
- [Penjelasan SPK TOPSIS](#-penjelasan-spk-topsis)
- [API Endpoints](#-api-endpoints)
- [Peran Pengguna](#-peran-pengguna)
- [Halaman Aplikasi](#-halaman-aplikasi)

---

## ✨ Fitur Utama

- 🔍 **Pencarian Produk Batik** — filter berdasarkan wilayah, kategori batik, dan rentang harga
- 🤖 **Rekomendasi SPK TOPSIS** — ranking produk batik terbaik berdasarkan bobot kriteria yang dipilih user secara dinamis
- 📍 **Berbasis Lokasi** — menghitung jarak user ke sanggar secara real-time menggunakan rumus Haversine
- 🗺️ **Peta Interaktif** — menampilkan titik lokasi semua sanggar terdaftar menggunakan Leaflet OpenStreetMap
- ⭐ **Sistem Ulasan & Rating** — user dapat memberikan rating kualitas, popularitas, dan desain produk
- 👤 **Multi Role** — Super Admin, Admin Sanggar, dan User biasa
- 🔐 **Autentikasi JWT** — login, register, lupa password dengan OTP via email
- 📱 **Responsive** — dapat diakses dari HP, tablet, dan desktop
- 🧮 **Audit TOPSIS** — Super Admin dapat melihat riwayat sesi SPK lengkap beserta perhitungan step-by-step dari `v_topsis_base` sampai `v_topsis_hasil`

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
├── Frontend/                        # Aplikasi React + TypeScript
│   ├── public/                      # Asset statis (gambar, icon)
│   └── src/
│       ├── assets/                  # SVG, pattern batik, hero image
│       ├── lib/                     # utils.ts (helper umum)
│       ├── components/
│       │   ├── layouts/             # MainLayout, AdminLayout, AdminSanggarLayout,
│       │   │                        # SuperAdminLayout, AuthLayout
│       │   ├── UI/                  # Button, Card, Input, Select, LoginStatusOverlay
│       │   ├── Map/                 # MapComponent (detail produk), SanggarMap (katalog)
│       │   ├── Product/             # ProductCard, ProductCardHome
│       │   ├── Sanggar/             # SanggarCard, SanggarCarousel
│       │   └── superAdmin/          # FilterDropdown, Pagination, StarRating
│       ├── pages/
│       │   ├── Home/                # Landing page
│       │   ├── Katalog/             # Katalog produk + SPK TOPSIS
│       │   ├── ProductDetail/       # Detail produk & ulasan
│       │   ├── SanggarDetail/       # Detail sanggar & produknya
│       │   ├── ProdukList/          # Semua produk
│       │   ├── admin/               # Login, Register, ForgotPassword (shared auth pages)
│       │   ├── adminSanggar/        # Dashboard Admin Sanggar
│       │   │                        # (Dashboard, Products, Reviews, Settings,
│       │   │                        #  productFormModal, productStore, reviewStore,
│       │   │                        #  useProducts, useReviews, useMySanggar)
│       │   └── superAdmin/          # Dashboard Super Admin
│       │                            # (Dashboard, Sanggar, Produk, Kategori, Region,
│       │                            #  Reviews, Pengguna, SpkSessions,
│       │                            #  useSpkSessions, useUsers, useSanggar,
│       │                            #  useProdukAdmin, useReviewsAdmin, useRegion,
│       │                            #  useCategories, useDashboardSummary,
│       │                            #  userFormModal, sanggarEditModal, ProdukEditModal,
│       │                            #  categoryFormModal, regionFormModal,
│       │                            #  UserStore, sanggarEditStore, produkEditStore,
│       │                            #  RegionStore, CategoryStore)
│       ├── services/                # api.ts — semua axios API calls
│       ├── stores/                  # useAuthStore (Zustand)
│       ├── types/                   # auth.ts, index.ts
│       └── routes/                  # index.tsx + ProtectedRoute.tsx
│
├── backend/                         # API Server Express + TypeScript
│   ├── src/
│   │   ├── config/                  # prisma.ts
│   │   ├── controllers/             # auth, user, product, sanggar, review, region,
│   │   │                            # batikCategory, criteria, recommendation,
│   │   │                            # spkSession, weightHistory, dashboard
│   │   ├── routes/                  # auth, user, product, sanggar, review, region,
│   │   │                            # batikCategory, criteria, recommendation,
│   │   │                            # spkSession, weightHistory, dashboard
│   │   ├── services/                # recommendationService, spkSessionService,
│   │   │                            # weightingService, authService
│   │   ├── middlewares/             # authMiddleware.ts (JWT verify + authorizeRoles)
│   │   └── utils/                   # response.ts, mailer.ts
│   └── prisma/
│       ├── schema.prisma            # Model database
│       ├── seed.ts                  # Data awal
│       └── migrations/              # History migrasi
│
└── README.md
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js >= 18
- MySQL / MariaDB
- npm

### 1. Setup Database

Import file SQL ke MySQL/phpMyAdmin:
```
batiktegal.sql
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `backend/.env`:
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

# Jalankan backend (development)
npm run dev
```

Backend berjalan di: `http://localhost:3000`

### 3. Setup Frontend

```bash
cd Frontend
npm install
```

Buat file `Frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

Frontend berjalan di: `http://localhost:5173`

---

## 🗄️ Penjelasan Database

Database: **batiktegal** (MySQL/MariaDB)

### Tabel Utama

| Tabel | Fungsi |
|---|---|
| `users` | Data pengguna — role: SUPER_ADMIN, ADMIN, USER |
| `regions` | Wilayah kecamatan di Kota Tegal (Tegal Barat, Timur, Selatan, Margadana) |
| `sanggars` | Data sanggar batik — nama, alamat, koordinat (lat/lon), relasi ke region & admin |
| `batik_categories` | Kategori batik (Gaya Pesisiran, Pedalaman, Kontemporer) |
| `products` | Produk batik — harga, stok, deskripsi, gambar (base64), relasi ke sanggar & kategori |
| `reviews` | Ulasan produk — quality, popularity, design (1-5), komentar |
| `criterias` | Kriteria SPK TOPSIS (Harga, Jarak, Kualitas, Popularitas, Desain) |
| `weight_histories` | Riwayat bobot kriteria yang dipilih user tiap sesi SPK |
| `spk_sessions` | Sesi SPK — lokasi user, filter wilayah/kategori/harga, relasi ke weight_history |

### View SQL TOPSIS

View dibuat manual di database, diquery berantai untuk perhitungan TOPSIS:

| View | Fungsi |
|---|---|
| `v_topsis_base` | Data mentah produk + jarak Haversine + rata-rata review per produk per session |
| `v_topsis_pembagi` | Hitung √(Σx²) per kriteria per session — untuk normalisasi vektor |
| `v_topsis_norm_terbobot` | Normalisasi × bobot: `xij / √(Σxij²) × wj` |
| `v_topsis_ideal` | Solusi ideal positif (A+) dan negatif (A-) per session |
| `v_topsis_jarak` | D+ = jarak ke A+, D- = jarak ke A- per produk |
| `v_topsis_hasil` | Skor preferensi akhir: `D- / (D+ + D-)`, range 0–1 |

---

## 📊 Penjelasan SPK TOPSIS

TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) digunakan untuk meranking produk batik terbaik. **TOPSIS bukan filter** — semua produk yang lolos klasifikasi awal tetap masuk perhitungan dan diranking berdasarkan skor.

### 5 Kriteria

| Kode | Kriteria | Atribut | Sumber Data |
|---|---|---|---|
| C1 | Harga | **Cost** — makin murah makin baik | `products.price` |
| C2 | Jarak | **Cost** — makin dekat makin baik | Haversine(userLat, userLon, sanggar.lat, sanggar.lon) |
| C3 | Kualitas | **Benefit** — makin tinggi makin baik | AVG(reviews.quality) |
| C4 | Popularitas | **Benefit** | AVG(reviews.popularity) |
| C5 | Desain | **Benefit** | AVG(reviews.design) |

### Alur Lengkap

```
1. User pilih kriteria di 2 dropdown Katalog
        ↓
2. POST /api/weight-histories
   → kriteria dipilih = bobot 5, lainnya = bobot 1
   → disimpan ke tabel weight_histories
        ↓
3. POST /api/recommendations/run
   → simpan spk_sessions (lokasi user GPS, filter, weightHistoryId)
        ↓
4. Query view SQL berantai:
   v_topsis_base
     → v_topsis_pembagi
       → v_topsis_norm_terbobot
         → v_topsis_ideal
           → v_topsis_jarak
             → v_topsis_hasil
        ↓
5. Return hasil terurut ranking 1 = skor tertinggi (terbaik)
```

### Rumus TOPSIS

```
Normalisasi  : rij  = xij / √(Σxij²)
Terbobot     : vij  = wj × rij
Ideal A+     : max(vij) untuk Benefit,  min(vij) untuk Cost
Ideal A-     : min(vij) untuk Benefit,  max(vij) untuk Cost
Jarak D+     : √Σ(vij - A+j)²
Jarak D-     : √Σ(vij - A-j)²
Skor         : Ci   = D-i / (D+i + D-i)   →  range 0 sampai 1
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api`

### Auth
| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| POST | `/auth/login` | Public | Login, return JWT token |
| POST | `/auth/register` | Public | Daftar akun baru |
| POST | `/auth/forgot-password` | Public | Kirim OTP ke email |
| POST | `/auth/verify-otp` | Public | Verifikasi OTP |
| POST | `/auth/reset-password` | Public | Reset password baru |

### Produk
| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/products` | Public | Daftar produk (filter: sanggarId, regionId, categoryId, minPrice, maxPrice) |
| GET | `/products/:id` | Public | Detail produk + sanggar + ulasan |
| POST | `/products` | Admin Sanggar | Tambah produk |
| PUT | `/products/:id` | Admin Sanggar | Edit produk miliknya |
| DELETE | `/products/:id` | Admin / Super Admin | Hapus produk |

### Sanggar
| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/sanggars` | Public | Daftar semua sanggar |
| GET | `/sanggars/me` | Admin Sanggar | Sanggar milik admin yang login |
| GET | `/sanggars/:id` | Public | Detail sanggar + produknya |
| POST | `/sanggars` | Admin Sanggar | Buat sanggar |
| PUT | `/sanggars/:id` | Admin Sanggar / Super Admin | Edit sanggar |
| DELETE | `/sanggars/:id` | Super Admin | Hapus sanggar |

### SPK TOPSIS
| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| POST | `/weight-histories` | Public | Buat bobot SPK dari kriteria yang dipilih |
| POST | `/recommendations/run` | Public | Jalankan TOPSIS, return ranking produk |
| GET | `/spk-sessions` | Super Admin | Daftar semua sesi SPK (urutan terbaru/terlama) |
| GET | `/spk-sessions/:sessionId/detail` | Super Admin | Detail satu sesi — full 6 step TOPSIS (base → pembagi → norm_terbobot → ideal → jarak → hasil) |

### Lainnya
| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/regions` | Public | Daftar wilayah |
| POST | `/reviews` | Public | Tambah ulasan produk |
| GET | `/batik-categories` | Public | Daftar kategori batik |
| GET | `/dashboard/summary` | Super Admin | Statistik ringkasan |
| GET | `/users` | Super Admin | Kelola pengguna |

---

## 👥 Peran Pengguna

| Role | Akses |
|---|---|
| **Super Admin** | Kelola semua user, sanggar, wilayah, kategori, produk, kriteria SPK, lihat semua ulasan, audit riwayat sesi SPK TOPSIS |
| **Admin Sanggar** | Kelola produk sanggar miliknya, lihat ulasan produknya, edit profil sanggar |
| **User** | Lihat katalog, beri ulasan & rating produk, jalankan SPK TOPSIS |
| **Tamu (tanpa login)** | Lihat katalog, detail produk & sanggar, jalankan SPK TOPSIS |

---

## 📱 Halaman Aplikasi

| Halaman | URL | Deskripsi |
|---|---|---|
| Home | `/` | Landing page — hero search, carousel sanggar rekomendasi, produk rating tertinggi, tentang |
| Katalog | `/katalog` | Daftar produk + filter wilayah/kategori/harga + SPK TOPSIS dengan peta sanggar |
| Detail Produk | `/produk/:id` | Info lengkap produk, ulasan (6 terbaru + lihat semua), lokasi sanggar di peta |
| Detail Sanggar | `/sanggar/:id` | Info sanggar, daftar produknya |
| Semua Produk | `/produk` | Daftar semua produk |
| Hasil Rekomendasi | `/rekomendasi/hasil` | Hasil ranking TOPSIS — skor, jarak, harga |
| Login | `/login` | Halaman login |
| Register | `/register` | Halaman daftar akun |
| Lupa Password | `/forgot-password` | Reset password via OTP email |
| Dashboard Admin Sanggar | `/admin-sanggar` | Kelola produk, ulasan, profil sanggar |
| Dashboard Super Admin | `/super-admin` | Kelola seluruh data platform |
| SPK Sessions | `/super-admin/spk-sessions` | Riwayat semua sesi SPK TOPSIS — search, sort terbaru/terlama, dan detail perhitungan lengkap per sesi |

---

## 👨‍💻 Developer

**CANTING** — Dibuat sebagai project UAS Pemrograman Web  
Universitas · Semester 4 · 2026
