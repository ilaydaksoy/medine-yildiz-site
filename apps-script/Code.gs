/**
 * Google Apps Script - Randevu Sistemi
 *
 * Özellikler:
 * - Tarih/saat seçimi + çakışma kontrolü
 * - Google Calendar'a otomatik ekleme
 * - Danışana + diyetisyene otomatik e-posta
 * - Google Sheets'e satır ekleme (Excel için Sheets'ten .xlsx indirilebilir)
 *
 * Kurulum için: apps-script/README.md
 */

const CONFIG = {
  TIMEZONE: "Europe/Istanbul",
  SLOT_MINUTES: 60,
  WORK_HOURS: {
    // 0=Pazar ... 6=Cumartesi
    1: { startHour: 9, endHour: 18 }, // Pzt
    2: { startHour: 9, endHour: 18 }, // Sal
    3: { startHour: 9, endHour: 18 }, // Çar
    4: { startHour: 9, endHour: 18 }, // Per
    5: { startHour: 9, endHour: 18 }, // Cum
    6: { startHour: 9, endHour: 14 }, // Cmt
  },
  CALENDAR_ID: "primary", // İsterseniz özel bir takvim ID'si yazın
  SHEET_ID: "YOUR_SHEET_ID",
  SHEET_NAME: "Randevular",
  DIETITIAN_EMAIL: "YOUR_DIETITIAN_EMAIL",
};

function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) ? e.parameter.page : "book";
  if (page === "book") {
    return HtmlService.createHtmlOutputFromFile("Index")
      .setTitle("Randevu Al")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "appointment" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAvailableSlots(dateStr) {
  const date = parseDateOnly_(dateStr);
  if (!date) return [];

  const day = date.getDay();
  const hours = CONFIG.WORK_HOURS[day];
  if (!hours) return [];

  const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const events = calendar.getEvents(dayStart, dayEnd);

  const slots = [];
  for (let h = hours.startHour; h < hours.endHour; h++) {
    const start = new Date(date);
    start.setHours(h, 0, 0, 0);
    const end = new Date(start.getTime() + CONFIG.SLOT_MINUTES * 60 * 1000);
    if (end.getHours() > hours.endHour || (end.getHours() === hours.endHour && end.getMinutes() > 0)) continue;

    if (!hasConflict_(events, start, end)) {
      slots.push(formatTime_(start));
    }
  }

  return slots;
}

function bookAppointment(payload) {
  validateConfig_();

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const p = normalizePayload_(payload);
    const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
    const sheet = getOrCreateSheet_();

    const start = parseDateTime_(p.date, p.time);
    const end = new Date(start.getTime() + CONFIG.SLOT_MINUTES * 60 * 1000);

    // Çakışma kontrolü (lock altında tekrar kontrol)
    const conflicts = calendar.getEvents(start, end);
    if (conflicts && conflicts.length > 0) {
      sheet.appendRow([new Date(), p.name, p.email, p.phone, p.date, p.time, CONFIG.SLOT_MINUTES, p.service, p.notes, "", "REJECTED_CONFLICT"]);
      return { ok: false, message: "Seçtiğiniz saat dolu. Lütfen başka bir saat seçin." };
    }

    const title = `Randevu - ${p.name}`;
    const description = [
      `Danışan: ${p.name}`,
      `E-posta: ${p.email}`,
      `Telefon: ${p.phone || "-"}`,
      `Hizmet: ${p.service || "-"}`,
      `Not: ${p.notes || "-"}`,
    ].join("\n");

    const event = calendar.createEvent(title, start, end, { description });
    const eventId = event.getId();

    // Sheets'e yaz
    sheet.appendRow([new Date(), p.name, p.email, p.phone, p.date, p.time, CONFIG.SLOT_MINUTES, p.service, p.notes, eventId, "CONFIRMED"]);

    // E-posta (danışan + diyetisyen)
    const whenText = `${p.date} ${p.time} (Türkiye saati)`;

    const ics = buildIcs_({
      uid: eventId,
      start,
      end,
      summary: title,
      description,
    });
    const icsBlob = Utilities.newBlob(ics, "text/calendar", "randevu.ics");

    // Danışana
    MailApp.sendEmail({
      to: p.email,
      subject: "Randevunuz alındı",
      htmlBody: `
        <p>Merhaba <b>${escapeHtml_(p.name)}</b>,</p>
        <p>Randevunuz oluşturuldu:</p>
        <ul>
          <li><b>Tarih/Saat:</b> ${escapeHtml_(whenText)}</li>
          <li><b>Süre:</b> ${CONFIG.SLOT_MINUTES} dk</li>
          <li><b>Hizmet:</b> ${escapeHtml_(p.service || "-")}</li>
        </ul>
        <p>Takviminize eklemek için ekteki <b>.ics</b> dosyasını kullanabilirsiniz.</p>
      `,
      attachments: [icsBlob],
    });

    // Diyetisyene
    MailApp.sendEmail({
      to: CONFIG.DIETITIAN_EMAIL,
      subject: `Yeni randevu: ${p.name} - ${whenText}`,
      htmlBody: `
        <p>Yeni randevu alındı:</p>
        <ul>
          <li><b>Danışan:</b> ${escapeHtml_(p.name)}</li>
          <li><b>E-posta:</b> ${escapeHtml_(p.email)}</li>
          <li><b>Telefon:</b> ${escapeHtml_(p.phone || "-")}</li>
          <li><b>Tarih/Saat:</b> ${escapeHtml_(whenText)}</li>
          <li><b>Süre:</b> ${CONFIG.SLOT_MINUTES} dk</li>
          <li><b>Hizmet:</b> ${escapeHtml_(p.service || "-")}</li>
          <li><b>Not:</b> ${escapeHtml_(p.notes || "-")}</li>
        </ul>
      `,
      attachments: [icsBlob],
    });

    return { ok: true, message: "Randevunuz oluşturuldu. E-posta gönderildi." };
  } finally {
    lock.releaseLock();
  }
}

// ----------------- Helpers -----------------

function validateConfig_() {
  if (!CONFIG.SHEET_ID || CONFIG.SHEET_ID === "YOUR_SHEET_ID") {
    throw new Error("CONFIG.SHEET_ID ayarlı değil.");
  }
  if (!CONFIG.DIETITIAN_EMAIL || CONFIG.DIETITIAN_EMAIL === "YOUR_DIETITIAN_EMAIL") {
    throw new Error("CONFIG.DIETITIAN_EMAIL ayarlı değil.");
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "KayitZamani",
      "AdSoyad",
      "Email",
      "Telefon",
      "Tarih",
      "Saat",
      "SureDakika",
      "Hizmet",
      "Not",
      "CalendarEventId",
      "Durum",
    ]);
  }
  return sheet;
}

function normalizePayload_(payload) {
  const p = payload || {};
  const name = (p.name || "").toString().trim();
  const email = (p.email || "").toString().trim();
  const phone = (p.phone || "").toString().trim();
  const date = (p.date || "").toString().trim(); // yyyy-mm-dd
  const time = (p.time || "").toString().trim(); // HH:MM
  const service = (p.service || "").toString().trim();
  const notes = (p.notes || "").toString().trim();

  if (!name) throw new Error("Ad Soyad zorunlu.");
  if (!email || !email.includes("@")) throw new Error("Geçerli bir e-posta zorunlu.");
  if (!date) throw new Error("Tarih zorunlu.");
  if (!time) throw new Error("Saat zorunlu.");

  return { name, email, phone, date, time, service, notes };
}

function parseDateOnly_(dateStr) {
  if (!dateStr) return null;
  // yyyy-mm-dd
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDateTime_(dateStr, timeStr) {
  // yyyy-mm-dd + HH:MM
  const iso = `${dateStr}T${timeStr}:00`;
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) throw new Error("Tarih/saat çözümlenemedi.");
  return dt;
}

function formatTime_(d) {
  return Utilities.formatDate(d, CONFIG.TIMEZONE, "HH:mm");
}

function hasConflict_(events, slotStart, slotEnd) {
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const s = ev.getStartTime();
    const e = ev.getEndTime();
    if (s < slotEnd && e > slotStart) return true;
  }
  return false;
}

function buildIcs_({ uid, start, end, summary, description }) {
  const dtStart = formatIcsUtc_(start);
  const dtEnd = formatIcsUtc_(end);
  const now = formatIcsUtc_(new Date());

  // Basit ICS (Outlook/Apple/Google uyumlu)
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NutriLife//Randevu//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${sanitizeIcs_(uid)}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${sanitizeIcs_(summary)}`,
    `DESCRIPTION:${sanitizeIcs_(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function formatIcsUtc_(d) {
  return Utilities.formatDate(d, "UTC", "yyyyMMdd'T'HHmmss'Z'");
}

function sanitizeIcs_(s) {
  return (s || "")
    .toString()
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function escapeHtml_(s) {
  return (s || "").toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


