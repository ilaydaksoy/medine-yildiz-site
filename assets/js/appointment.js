/**
 * Appointment integration (Google Apps Script Web App embedded via iframe)
 *
 * 1) Deploy the Apps Script as a Web App
 * 2) Paste your deployment URL into APPOINTMENT_WEBAPP_URL below
 */
(function () {
  "use strict";

  /**
   * Seçenek 0 (en kolay): Calendly (randevu + mail bildirimleri Calendly tarafında)
   * - Profil/booking URL'nizi buraya yazın:
   */
  const CALENDLY_URL = "https://calendly.com/dyt-eminedemirkaya/yeni-randevu?hide_gdpr_banner=1&text_color=246b2d&primary_color=e2202b";

  /**
   * Seçenek A (önerilen): Google Apps Script Web App (randevu + çakışma + mail + sheets)
   * - Web App URL'ini buraya yapıştırın:
   *   Örn: https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxx/exec
   */
  const APPOINTMENT_WEBAPP_URL = "YOUR_APPS_SCRIPT_WEBAPP_URL";

  /**
   * Seçenek B (CEO'nun istediği gibi): Google Calendar embed (SADECE görüntüleme)
   * - Paylaştığınız embed URL'ini buraya yapıştırın.
   * - Bu yöntem randevu oluşturmaz / çakışma engellemez / otomatik mail+Sheets yapmaz.
   */
  const GOOGLE_CALENDAR_EMBED_URL = "https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FIstanbul&showPrint=0&mode=MONTH&src=ZHl0LmVtaW5lZGVtaXJrYXlhQGdtYWlsLmNvbQ&src=ZTc3N2JkMTM0ZWNiNGRiN2RkZDU0YjlhOWQyZDk1YjY4NWQ2ODg3ZDYwOWFlYTA0OTIzNGJmZGRiMjc2N2Q4MEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udHVya2lzaCNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=dHIudHVya2lzaCNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23039be5&color=%23795548&color=%230b8043&color=%230b8043";

  const HAS_CALENDLY = !!(CALENDLY_URL && CALENDLY_URL.startsWith("http"));

  const BOOKING_URL = HAS_CALENDLY
    ? CALENDLY_URL
    : ((APPOINTMENT_WEBAPP_URL && APPOINTMENT_WEBAPP_URL !== "YOUR_APPS_SCRIPT_WEBAPP_URL")
      ? `${APPOINTMENT_WEBAPP_URL}?page=book`
      : ((GOOGLE_CALENDAR_EMBED_URL && GOOGLE_CALENDAR_EMBED_URL !== "YOUR_GOOGLE_CALENDAR_EMBED_URL")
        ? GOOGLE_CALENDAR_EMBED_URL
        : ""));

  function setAppointmentUrls() {
    const iframe = document.getElementById("appointmentIframe");
    const link = document.getElementById("appointmentFallbackLink");
    const hint = document.getElementById("appointmentSetupHint");
    const calendlyContainer = document.getElementById("calendlyContainer");
    if (!iframe || !link) return;

    if (!BOOKING_URL) {
      iframe.style.display = "none";
      if (hint) hint.style.display = "block";
      link.href = "#";
      link.textContent = "ayar sayfasını görmek için URL tanımlayın";
      if (calendlyContainer) calendlyContainer.style.display = "none";
      return;
    }

    if (hint) hint.style.display = "none";
    link.href = BOOKING_URL;

    // Calendly varsa: iframe'i kapat, Calendly'yi göster
    if (HAS_CALENDLY && calendlyContainer) {
      iframe.style.display = "none";
      calendlyContainer.style.display = "block";

      const modalEl = document.getElementById("appointmentModal");
      const initCalendlyOnce = () => {
        // widget.js bazen otomatik init eder; doluysa tekrar init etmeyelim
        if (calendlyContainer.querySelector("iframe")) return;
        if (window.Calendly && typeof window.Calendly.initInlineWidget === "function") {
          window.Calendly.initInlineWidget({
            url: CALENDLY_URL,
            parentElement: calendlyContainer,
          });
        }
      };

      if (modalEl) {
        modalEl.addEventListener("shown.bs.modal", initCalendlyOnce);
      } else {
        initCalendlyOnce();
      }
      return;
    }

    // Calendly yoksa: iframe ile devam (Apps Script / Google Calendar)
    iframe.style.display = "block";
    if (calendlyContainer) calendlyContainer.style.display = "none";

    // Lazy-load iframe only when modal is opened (better performance)
    const modalEl = document.getElementById("appointmentModal");
    if (!modalEl) {
      iframe.src = BOOKING_URL;
      return;
    }

    modalEl.addEventListener("shown.bs.modal", () => {
      if (!iframe.src) iframe.src = BOOKING_URL;
    });

    modalEl.addEventListener("hidden.bs.modal", () => {
      // Optional: keep loaded so user can reopen without losing state.
      // If you want to reset each time, uncomment below:
      // iframe.src = "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setAppointmentUrls);
  } else {
    setAppointmentUrls();
  }
})();


