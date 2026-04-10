# MAHLUK HIDUP - Frontend

> **Pusat Intelijen Pertanian & Drone Monitoring** - Platform monitoring pertanian berbasis web dengan visualisasi geospasial, analitik drone, dan manajemen perusahaan.

## 🌱 Fitur Utama

### Monitoring Geospasial
- Peta interaktif dengan Leaflet untuk visualisasi sektor pertanian
- Detail informasi per sektor: kesehatan tanaman, kondisi tanah, cuaca, risiko hama
- Rekomendasi AI Agronom untuk setiap sektor
- Potensi proyeksi finansial per lahan

### Analitik Dashboard
- Grafik pendapatan dan panen (Recharts)
- Statistik keseluruhan: total panen, lahan produktif, kesehatan tanaman
- Distribusi jenis tanaman (Pie Chart)

### Manajemen Perusahaan & Cabang
- CRUD perusahaan dan cabang
- Pencarian dan filtering
- Koordinat GPS untuk setiap cabang

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM 7 |
| **State Management** | Zustand 5 |
| **Data Fetching** | TanStack React Query 5 + Axios |
| **Styling** | Tailwind CSS 4 |
| **Maps** | Leaflet + React-Leaflet |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **Linting** | ESLint + TypeScript ESLint |

## 📁 Struktur Folder

```
frontend/
├── src/
│   ├── api/                    # API client & endpoints
│   │   ├── client.ts           # Axios instance dengan interceptor
│   │   └── company.api.ts      # Company & Branch API calls
│   ├── components/             # Reusable UI components
│   │   └── ui/                 # Button, Card, MapView
│   ├── pages/                  # Route pages
│   │   ├── Login.tsx           # Login page
│   │   ├── Dashboard.tsx       # Main dashboard (monitoring, analytics, drones)
│   │   └── CompanyManagement.tsx # CRUD perusahaan & cabang
│   ├── store/                  # Zustand stores
│   │   └── useAuthStore.ts     # Authentication state
│   ├── types/                  # TypeScript type definitions
│   │   └── company.types.ts    # Company & Branch DTOs
│   ├── App.tsx                 # Main app & routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles & Tailwind config
├── public/                     # Static assets
├── .env                        # Environment variables (tidak di-commit)
└── vite.config.ts              # Vite configuration
```

## 🚀 Memulai

### Prasyarat
- **Node.js** >= 18
- **npm** / **yarn** / **pnpm**

### Instalasi

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env .env.local
# Edit .env.local sesuai konfigurasi backend
```

### Development

```bash
# Jalankan development server
npm run dev

# Buka http://localhost:5173
```

### Build

```bash
# Build untuk production
npm run build

# Preview hasil build
npm run preview
```

### Linting

```bash
# Jalankan ESLint
npm run lint
```

## ⚙️ Environment Variables

Buat file `.env.local` dan konfigurasi variabel berikut:

```env
# Backend API URL
VITE_API_URL=http://localhost:4000
```

## 🔐 Autentikasi

Aplikasi ini menggunakan **Zustand** untuk state management autentikasi. Pengguna harus login terlebih dahulu untuk mengakses halaman Dashboard.

- **Login Page**: `/login`
- **Dashboard**: `/dashboard/*` (protected)

## 📄 Halaman

### Login
Form autentikasi dengan desain modern dan branding Mahluk Hidup.

### Dashboard
Terdiri dari beberapa tab:
- **Monitor Geospasial**: Peta interaktif dengan marker sektor pertanian
- **Analitik Keseluruhan**: Grafik dan statistik pendapatan, panen, dan kesehatan tanaman
- **Analisa Drone**: Status dan kesehatan drone (battery, health, task)
- **Manajemen Perusahaan**: CRUD perusahaan dan cabang

## 🎨 Design System

- **Warna Utama**: Emerald (`#10b981`) - Pertanian
- **Warna Sekunder**: Sky Blue (`#0ea5e9`) - Drone
- **Warna Aksen**: Amber (`#f59e0b`) - Panen
- **Background**: Dark Navy (`#0b1730`)
- **Font**: Outfit + Manrope (Cyber style)
- **Glassmorphism**: Efek blur dan transparansi untuk card

## 📦 API Integration

API client menggunakan **Axios** dengan:
- Base URL dari `VITE_API_URL`
- Interceptor untuk menambahkan token JWT
- Auto redirect ke `/login` jika token expired (401)

## 🗺️ Peta

MapView menggunakan **Leaflet** dengan fitur:
- Marker interaktif untuk setiap sektor
- Custom popup dengan informasi lengkap
- Zoom dan center otomatis

## 📊 Charts

Menggunakan **Recharts** untuk:
- Area Chart: Tren pendapatan dan panen
- Pie Chart: Distribusi jenis tanaman

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'feat: tambah fitur baru'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buka Pull Request

## 📝 License

Private - Milik MAHLUK HIDUP

---

**Dibuat dengan menggunakan React + Vite + TypeScript**
