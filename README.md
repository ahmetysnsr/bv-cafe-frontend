# 🤖 BV Robotik Cafe - Frontend

Bu proje, **BV Robotik Cafe** için geliştirilmiş, masalardaki QR kodlar üzerinden sipariş alınmasını ve bu siparişlerin otonom robotlara iletilmesini sağlayan modern, hızlı ve responsive bir web arayüzüdür.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)

## 🌐 Canlı Demo (Live URL)

Projenin çalışan güncel haline aşağıdaki bağlantıdan ulaşabilirsiniz:
👉 **[https://ahmetysnsr.github.io/bv-cafe-frontend/](https://ahmetysnsr.github.io/bv-cafe-frontend/)**

---

## ✨ Öne Çıkan Özellikler

Sistem, güvenliği ve hızı ön planda tutan bir dizi gelişmiş özellik sunar:

- **⏳ Dinamik ve Süreli QR Kodlar:** Masalarda bulunan QR kodlar dışarıdan taranıp sipariş verilmesini engellemek için her 5 dakikada bir otomatik yenilenir. Süresi dolan kodla sipariş verilemez.
- **📍 Geofencing (Konum Doğrulama):** Kullanıcının masada/ofiste olduğunu kanıtlaması için tarayıcı üzerinden konum doğrulaması (GPS Geolocation) yapılır. Sadece belirli bir yarıçap (radius) içerisinden sipariş gönderilebilir.
- **🛡️ Mükerrer Sipariş Koruması (Idempotency):** Ağ bağlantısı koptuğunda veya butona çift tıklandığında siparişin iki kere işlenmemesi için kriptografik `Idempotency Key` mimarisi kullanılır.
- **🤖 Otonom Robot Entegrasyonu:** Sipariş alındığı an, kullanıcının masasına (Örn: Saha-Cafe_0_16) otonom hizmet sağlayan Saha Robotik donanımlarına otomatik yönlendirme ve POST payload gönderimi yapılır.
- **🌍 Çoklu Dil Seçeneği (i18n):** Müşteriler tek dokunuşla Türkçe (TR) ve İngilizce (EN) dilleri arasında anında geçiş yapabilir.
- **🎛️ Gelişmiş Yönetim Paneli (Admin):** Yetkili kişilerin masa tanımlayabileceği, ürün ekleyip çıkartabileceği ve sistem ayarlarını (QR süresi, konum toleransı) canlı düzenleyebileceği bir admin ekranı mevcuttur.
- **💅 Pürüzsüz UX/UI (MUI & Framer Motion):** Tüm işlemler arası geçişler, sepet animasyonları ve uyarı mesajları kullanıcı dostu ve akıcı bir karanlık tema (Dark Mode) tasarımıyla sunulur.

## 🚀 Kurulum & Çalıştırma (Lokal)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Çevresel Değişkenleri Ayarlayın:**
   Kök dizinde `.env` dosyası oluşturun ve backend API adresini girin:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```

4. **Derleme (Production Build):**
   ```bash
   npm run build
   ```

## 🏗 Teknolojiler
- **Framework:** React 18 & Vite
- **Dil:** TypeScript
- **Stil & UI:** Material UI (MUI), Emotion, Framer Motion
- **State Yönetimi:** Zustand
- **Yönlendirme:** React Router (HashRouter)
- **Çoklu Dil:** React-i18next
- **CI/CD:** GitHub Actions ile otomatik GitHub Pages deployment

---
*Geliştirme süreci tamamen temiz mimari prensiplerine sadık kalınarak hazırlanmıştır.*
