# 🚗 Digital Parking Management System

Sistem manajemen parkir digital menggunakan React JS (Frontend) dan Laravel (Backend) dengan fitur QR Code untuk check-in dan check-out kendaraan.

## 🚀 Fitur

- ✅ Check-in kendaraan dengan generate QR Code
- ✅ Check-out dengan scan QR Code
- ✅ Kalkulasi biaya parkir otomatis
- ✅ Dashboard admin dengan grafik
- ✅ Laporan harian dan bulanan
- ✅ Export laporan ke Excel/PDF
- ✅ Manajemen tarif parkir
- ✅ Multi-user (Admin & Operator)

## 🛠️ Tech Stack

**Frontend:**
- React JS + Vite
- React Router
- Tailwind CSS
- Axios
- html5-qrcode (QR Scanner)
- qrcode.react (QR Generator)
- Recharts (Charts)

**Backend:**
- Laravel 10/11
- MySQL
- Laravel Sanctum (Authentication)
- Laravel Excel (Export)

## 📦 Installation

### Prerequisites
- PHP >= 8.1
- Composer
- Node.js >= 18
- MySQL

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📝 API Documentation

Coming soon...

## 🤝 Contributing

Pull requests are welcome!

## 📄 License

MIT License