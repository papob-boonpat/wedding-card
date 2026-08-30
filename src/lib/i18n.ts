export const LANGS = ["en", "th"] as const;
export type Lang = (typeof LANGS)[number];

export const dict = {
  en: {
    tapToOpen: "Tap to open",
    openEnvelope: "Open the envelope",
    tapOrSwipe: "Tap or swipe the card",
    rsvp: "RSVP",
    cardFront: "Wedding invitation, front",
    cardBack: "Wedding invitation, back",
    showFront: "Show front of card",
    showBack: "Show back of card",
    rsvpTitle: "RSVP",
    rsvpIntro: "We can't wait to celebrate with you.",
    name: "Name",
    partySize: "Number of people",
    side: "Side",
    groom: "Groom",
    bride: "Bride",
    send: "Send RSVP",
    sending: "Sending…",
    back: "Back to the invitation",
    thankYou: "Thank you!",
    received: "Your RSVP has been received.",
    errName: "Please enter your name",
    errPartySize: "Enter a number between 1 and 20",
    errSide: "Please choose a side",
    errNetwork: "Could not submit your RSVP. Please try again.",
  },
  th: {
    tapToOpen: "แตะเพื่อเปิด",
    openEnvelope: "เปิดซองจดหมาย",
    tapOrSwipe: "แตะหรือปัดการ์ด",
    rsvp: "ตอบรับคำเชิญ",
    cardFront: "การ์ดเชิญงานแต่งงาน ด้านหน้า",
    cardBack: "การ์ดเชิญงานแต่งงาน ด้านหลัง",
    showFront: "ดูด้านหน้าการ์ด",
    showBack: "ดูด้านหลังการ์ด",
    rsvpTitle: "ตอบรับคำเชิญ",
    rsvpIntro: "เรารอคอยที่จะเฉลิมฉลองร่วมกับคุณ",
    name: "ชื่อ",
    partySize: "จำนวนผู้เข้าร่วม",
    side: "ฝ่าย",
    groom: "เจ้าบ่าว",
    bride: "เจ้าสาว",
    send: "ส่งคำตอบรับ",
    sending: "กำลังส่ง…",
    back: "กลับไปที่การ์ดเชิญ",
    thankYou: "ขอบคุณค่ะ!",
    received: "เราได้รับคำตอบรับของคุณแล้ว",
    errName: "กรุณากรอกชื่อของคุณ",
    errPartySize: "กรุณากรอกตัวเลข 1 ถึง 20",
    errSide: "กรุณาเลือกฝ่าย",
    errNetwork: "ไม่สามารถส่งคำตอบรับได้ กรุณาลองอีกครั้ง",
  },
} satisfies Record<Lang, Record<string, string>>;

export type MessageKey = keyof (typeof dict)["en"];

/** Pick a language from the client's device settings. Falls back to English. */
export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const l of langs) {
    if (l?.toLowerCase().startsWith("th")) return "th";
    if (l?.toLowerCase().startsWith("en")) return "en";
  }
  return "en";
}
