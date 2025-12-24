# Google Apps Script ile Ücretsiz Randevu Sistemi (Calendar + Mail + Sheets)

Bu klasördeki kodu **Google Apps Script** projesine kopyalayarak:

- **Tarih + saat seçimi**
- **Google Calendar’a otomatik ekleme**
- **Çakışma engelleme**
- **Danışan + diyetisyen maili**
- **Google Sheets’e satır ekleme** (Excel için Sheets’ten `.xlsx` indirebilirsiniz)

özelliklerini ücretsiz olarak çalıştırabilirsiniz.

## 1) Google Sheets hazırlığı

- Google Drive → **Yeni** → **Google E-Tablolar**
- Dosya adını örn. `Randevular` yapın
- URL’deki ID’yi kopyalayın:
  - `https://docs.google.com/spreadsheets/d/`**SHEET_ID**`/edit`

## 2) Google Apps Script projesi

- `script.google.com` → **Yeni proje**
- `Code.gs` içeriğini silip bu repodaki `apps-script/Code.gs` içeriğini yapıştırın
- **+** → **HTML** → dosya adını `Index` yapın → `apps-script/Index.html` içeriğini yapıştırın

## 3) Ayarlar (zorunlu)

`Code.gs` içindeki `CONFIG` alanlarını düzenleyin:

- `SHEET_ID`: Sheets ID
- `DIETITIAN_EMAIL`: randevu bildirimini alacak e-posta
- `CALENDAR_ID`: `primary` bırakabilirsiniz veya özel takvim ID’si yazabilirsiniz
- `SLOT_MINUTES`: randevu süresi (dk)

## 4) Yetkilendirme (ilk çalıştırma)

Apps Script editöründe:
- `getAvailableSlots` fonksiyonunu seçip **Çalıştır** deyin
- Google izinlerini verin (Calendar + Sheets + Mail)

## 5) Web App olarak yayınlama (iframe için)

- **Deploy (Dağıt)** → **New deployment**
- Type: **Web app**
- Execute as: **Me**
- Who has access: **Anyone** (site üzerinden erişim için)
- Deploy → size bir **Web App URL** verir (…`/exec`)

## 6) Sitenize bağlama (bu repo)

Bu projede modal/iframe entegrasyonu hazır:

- `assets/js/appointment.js` dosyasında:
  - `APPOINTMENT_WEBAPP_URL` alanına kendi Web App URL’nizi yapıştırın

Sonra sitede:
- Header’da ve Hero’da **Randevu Al** butonu modal’ı açar.

## Notlar

- **Spam koruması**: “Anyone” erişimde kötüye kullanım olabilir. Basit koruma için `bookAppointment` içine bir `token` kontrolü ekleyebilirsiniz (siteye gömülü gizli anahtar gibi). Daha güçlü koruma için reCAPTCHA/Turnstile + proxy gerekir.
- **Google kotaları**: Ücretsiz hesaplarda günlük e-posta ve çağrı limitleri var; yoğun kullanımda kota dolabilir.


