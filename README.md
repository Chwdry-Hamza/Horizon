# HORIZON - Luxury Real Estate Website

Profesyonel gayrimenkul web sitesi ve admin paneli. Dubai'deki lüks mülklerin yönetimi için tam özellikli platform.

## 🌟 Özellikler

### 📱 Kullanıcı Tarafı
- ✅ Responsive tasarım (Mobile, Tablet, Desktop)
- ✅ Light/Dark mode desteği (SVG iconlar ile)
- ✅ Animasyonlu scroll efektleri
- ✅ Profesyonel sayfa geçişleri
- ✅ 5 ana sayfa:
  - Ana Sayfa (index.html)
  - İlanlar (properties.html)
  - Hakkımızda (about.html)
  - Blog/Journal (journal.html)
  - İletişim (contact.html)
- ✅ Detaylı ilan sayfası (property-detail.html)
  - 8 resimli galeri sistemi
  - Mortgage hesaplayıcı
  - Google Maps entegrasyonu
  - Sosyal medya paylaşım
  - Benzer ilanlar önerisi

### 👨‍💼 Admin Paneli
- ✅ Güvenli giriş sistemi
- ✅ İlan yönetimi (CRUD):
  - Yeni ilan ekleme
  - İlan düzenleme
  - İlan silme
  - Featured/Sold işaretleme
- ✅ İstatistik dashboard
- ✅ Ayarlar sayfası:
  - Username değiştirme
  - Password değiştirme
  - Email güncelleme

### 🔧 Backend
- ✅ Node.js + Express REST API
- ✅ JSON database (değiştirilebilir)
- ✅ CORS desteği
- ✅ 8 endpoint

## 📦 Kurulum

### 1. Gereksinimler
```bash
Node.js v14+ yüklü olmalı
```

### 2. Bağımlılıkları Yükleyin
```bash
cd /Users/r00t/Desktop/RealEstate
npm install
```

### 3. Serveri Başlatın
```bash
npm start
```

Alternatif olarak (auto-restart için):
```bash
npm run dev
```

## 🚀 Kullanım

### Ana Site
Tarayıcınızda açın:
```
http://localhost:3000
```

### Admin Panel
Tarayıcınızda açın:
```
http://localhost:3000/admin/login.html
```

**Varsayılan Giriş Bilgileri:**
- Username: `admin`
- Password: `admin123`

⚠️ **ÖNEMLİ:** İlk girişten sonra şifrenizi değiştirin!

## 📁 Proje Yapısı

```
RealEstate/
├── index.html              # Ana sayfa
├── properties.html         # İlanlar listesi
├── property-detail.html    # Detaylı ilan sayfası
├── about.html              # Hakkımızda
├── journal.html            # Blog/Journal
├── contact.html            # İletişim
├── style.css               # Ana CSS
├── script.js               # Ana JavaScript
├── server.js               # Backend API
├── package.json            # NPM packages
│
├── data/                   # Database
│   ├── properties.json     # İlanlar
│   └── admin.json          # Admin bilgileri
│
└── admin/                  # Admin Panel
    ├── login.html          # Giriş sayfası
    ├── dashboard.html      # İlan yönetimi
    ├── settings.html       # Ayarlar
    ├── admin-style.css     # Admin CSS
    └── admin-script.js     # Admin JavaScript
```

## 🔌 API Endpoints

### Properties
```
GET    /api/properties          # Tüm ilanları getir
GET    /api/properties/:id      # Tek ilan getir
POST   /api/properties          # Yeni ilan ekle
PUT    /api/properties/:id      # İlan güncelle
DELETE /api/properties/:id      # İlan sil
```

### Admin
```
POST   /api/admin/login         # Admin girişi
GET    /api/admin/settings      # Ayarları getir
PUT    /api/admin/settings      # Ayarları güncelle
```

## 🎨 Tema Renkleri

### Dark Theme (Varsayılan)
```css
Background: #0b0b0b
Cards: #141414
Accent: #cfa16b (Altın)
Text: #e0e0e0
```

### Light Theme
```css
Background: #f8f8f8
Cards: #ffffff
Accent: #cfa16b (Altın)
Text: #1a1a1a
```

## ⚙️ Ayarlar

### Admin Şifresi Değiştirme
1. Admin panele giriş yapın
2. "Settings" sayfasına gidin
3. "Change Password" formunu doldurun
4. "Update Password" butonuna tıklayın

### Yeni İlan Ekleme
1. Dashboard'a gidin
2. "+ Add New Property" butonuna tıklayın
3. Formu doldurun:
   - Başlık, lokasyon, fiyat
   - Oda, banyo sayıları
   - Özellikler (her satıra bir tane)
   - Görsel URL'leri (her satıra bir tane)
4. "Save Property" butonuna tıklayın

### İlan Düzenleme
1. Dashboard'da ilanın yanındaki ✏️ ikonuna tıklayın
2. Bilgileri güncelleyin
3. "Save Property" butonuna tıklayın

### İlan Silme
1. Dashboard'da ilanın yanındaki 🗑️ ikonuna tıklayın
2. Onaylayın

## 🔒 Güvenlik

⚠️ **ÖNEMLİ GÜVENLİK NOTLARI:**

1. **Üretim (Production) için:**
   - Şifreleri hash'leyin (bcrypt kullanın)
   - JWT token sistemi ekleyin
   - HTTPS kullanın
   - Environment variables kullanın (.env)
   - Rate limiting ekleyin

2. **Mevcut Durum:**
   - Bu versiyon geliştirme (development) içindir
   - Şifreler düz metin olarak saklanıyor
   - Gerçek projede kullanmadan önce güvenlik güncellemeleri yapın

## 📱 Responsive Breakpoints

```css
Desktop:  > 1024px
Tablet:   768px - 1024px
Mobile:   < 768px
```

## 🎯 Tarayıcı Desteği

- ✅ Chrome (Son 2 versiyon)
- ✅ Firefox (Son 2 versiyon)
- ✅ Safari (Son 2 versiyon)
- ✅ Edge (Son 2 versiyon)

## 🐛 Sorun Giderme

### Server başlamıyor
```bash
# Port 3000 kullanımda olabilir
# package.json'da portu değiştirin veya:
lsof -ti:3000 | xargs kill
```

### Admin panele giriş yapamıyorum
```bash
# data/admin.json dosyasını kontrol edin
# Gerekirse şifre sıfırlayın
```

### İlanlar görünmüyor
```bash
# data/properties.json dosyasını kontrol edin
# Boşsa örnek veri ekleyin
```

## 📝 Notlar

- Tüm fiyatlar AED (Birleşik Arap Emirlikleri Dirhemi) cinsindendir
- Görseller Unsplash'tan placeholder olarak kullanılmıştır
- Google Maps API key gerektirir (production için)

## 🚧 Gelecek Güncellemeler

- [ ] Gerçek veritabanı (MongoDB/PostgreSQL)
- [ ] Görsel upload sistemi
- [ ] Email bildirimleri
- [ ] Gelişmiş arama ve filtreleme
- [ ] Kullanıcı favorileri
- [ ] Property karşılaştırma

## 📄 Lisans

Bu proje özel kullanım içindir.

## 👨‍💻 Geliştirici

HORIZON Real Estate
