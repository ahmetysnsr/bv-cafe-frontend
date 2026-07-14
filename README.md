# 🤖 BV Robotik Cafe - Frontend

Bu proje, **BV Robotik Cafe** için geliştirilmiş, masalardaki QR kodlar üzerinden sipariş alınmasını ve bu siparişlerin otonom robotlara iletilmesini sağlayan modern, hızlı ve responsive bir web arayüzüdür.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)

## 🌐 Canlı Demo (Live URL)

Projenin çalışan güncel haline aşağıdaki bağlantıdan ulaşabilirsiniz:
👉 **[https://ahmetysnsr.github.io/bv-cafe-frontend/](https://ahmetysnsr.github.io/bv-cafe-frontend/)**

---

## ✨ Özellikler

- **QR Tabanlı Sipariş:** Masalara özel üretilen benzersiz QR kodlar ile anında menüye erişim.
- **Canlı Robot Entegrasyonu:** Verilen siparişlerin gerçek zamanlı olarak Saha Robotik altyapısına (API) iletilmesi.
- **Çift Dil Desteği:** Türkçe ve İngilizce (i18n) arayüz desteği.
- **Güvenli Sipariş:** "Idempotency Key" mimarisi ile ağ kopmalarında veya çift tıklamalarda mükerrer siparişin önüne geçilmesi.
- **Modern Arayüz:** Material UI (MUI) ve Framer Motion ile tasarlanmış pürüzsüz animasyonlar ve karanlık (Dark) mod tasarımı.
- **Yönetim Paneli:** Ürün yönetimi, masa kontrolü ve sipariş takibi için Admin arayüzü.

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
