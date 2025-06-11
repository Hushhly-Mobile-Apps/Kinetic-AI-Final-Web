# 🚀 Kinetic AI - Frontend & Backend Integration Guide

Panduan lengkap untuk menjalankan frontend dan backend secara bersamaan dengan progress tracking di terminal.

## 📋 Prerequisites

### Software Requirements
- **Node.js** (v16 atau lebih baru) - [Download](https://nodejs.org/)
- **Python** (v3.8 atau lebih baru) - [Download](https://python.org/)
- **Git** (opsional) - [Download](https://git-scm.com/)

### Verifikasi Instalasi
```bash
node --version
python --version
npm --version
```

## 🎯 Cara Menjalankan Integrasi

### Metode 1: Menggunakan Script Otomatis (Recommended)

#### Windows:
```bash
# Double-click file atau jalankan di Command Prompt
start-integration.bat
```

#### Cross-Platform:
```bash
# Menggunakan npm script
npm run integration

# Atau langsung dengan Node.js
node start-integration.js
```

### Metode 2: Manual Setup

#### 1. Setup Backend
```bash
cd backend

# Buat virtual environment (recommended)
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Jalankan backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Setup Frontend (Terminal baru)
```bash
# Install dependencies
npm install

# Jalankan frontend
npm run dev
```

## 📊 Progress Tracking Features

Script integrasi menyediakan:

### Real-time Progress Display
```
╔══════════════════════════════════════════════════════════════╗
║ KINETIC AI - FRONTEND & BACKEND INTEGRATION STATUS          ║
╠══════════════════════════════════════════════════════════════╣
║ Backend (FastAPI):  ████████████████████ 100% ║
║ Frontend (Next.js): ████████████████████ 100% ║
║ Total Progress:     ████████████████████ 100% ║
║ Elapsed Time: 45s                                            ║
╚══════════════════════════════════════════════════════════════╝
```

### Status Indicators
- 🚀 **Starting**: Service sedang dimulai
- ✅ **Ready**: Service berhasil berjalan
- ❌ **Error**: Terjadi kesalahan
- 🎉 **Complete**: Integrasi berhasil

### Progress Percentage
- **Backend Progress**: 0-100% (FastAPI startup)
- **Frontend Progress**: 0-100% (Next.js compilation)
- **Total Progress**: Rata-rata kedua service

## 🌐 Service URLs

Setelah integrasi berhasil:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js Application |
| **Backend API** | http://localhost:8000 | FastAPI Server |
| **API Documentation** | http://localhost:8000/docs | Swagger UI |
| **API Redoc** | http://localhost:8000/redoc | ReDoc Documentation |

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill process if needed
taskkill /PID <process_id> /F
```

#### 2. Python Dependencies Error
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies with verbose output
pip install -r requirements.txt -v
```

#### 3. Node.js Dependencies Error
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

#### 4. Permission Errors (Windows)
```bash
# Run as Administrator
# Right-click Command Prompt -> "Run as administrator"
```

### Environment Variables

Buat file `.env` di folder `backend` jika diperlukan:
```env
# Database
DATABASE_URL=sqlite:///./kineticai.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# File Upload
MAX_FILE_SIZE=100MB
UPLOAD_DIR=./uploads
```

## 🔧 Advanced Configuration

### Custom Ports
Edit `start-integration.js` untuk mengubah port:
```javascript
// Backend port (line ~85)
const backendProcess = spawn('python', ['-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', '8001']);

// Frontend port (line ~125)
const frontendProcess = spawn('npm', ['run', 'dev', '--', '--port', '3001']);
```

### Development vs Production
```bash
# Development (dengan hot reload)
npm run integration

# Production build
npm run build
npm start
```

## 📱 Sharing with Client

### Progress Screenshots
Script akan menampilkan progress real-time yang bisa di-screenshot untuk client:

1. **Startup Phase**: 0-50%
2. **Loading Phase**: 50-90%
3. **Ready Phase**: 90-100%
4. **Complete**: 100% dengan URL akses

### Demo URLs untuk Client
```
🌐 Frontend Demo: http://localhost:3000
📚 API Documentation: http://localhost:8000/docs
🔧 Backend Health: http://localhost:8000/health
```

## 🚦 Stopping Services

```bash
# Graceful shutdown
Ctrl + C

# Force stop (jika diperlukan)
Ctrl + C (dua kali)
```

## 📞 Support

Jika mengalami masalah:
1. Periksa log error di terminal
2. Pastikan semua dependencies terinstall
3. Cek apakah port 3000 dan 8000 tersedia
4. Restart terminal dan coba lagi

---

**Happy Coding! 🎉**