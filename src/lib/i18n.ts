export const LANGS = ["en", "th"] as const;
export type Lang = (typeof LANGS)[number];

export const dict = {
  en: {
    tapToOpen: "Tap to open",
    openEnvelope: "Open the invitation",
    tapOrSwipe: "Tap or swipe to turn the card",
    rsvp: "RSVP",
    location: "📍 Location",
    cardFront: "Front of the wedding invitation",
    cardBack: "Back of the wedding invitation",
    showFront: "Turn card to the front",
    showBack: "Turn card to the back",
    rsvpTitle: "Kindly RSVP",
    rsvpIntro: "We can't wait to celebrate with you.",
    name: "Your name",
    partySize: "How many will attend?",
    side: "Whose guest are you?",
    groom: "Groom's side",
    bride: "Bride's side",
    send: "Send RSVP",
    sending: "Sending…",
    back: "Back to the invitation",
    thankYou: "Thank you!",
    received: "We've received your reply — see you there!",
    errName: "Please enter your name",
    errPartySize: "Please enter a number from 1 to 20",
    errSide: "Please let us know whose guest you are",
    errNetwork: "Something went wrong. Please try again.",
  },
  th: {
    tapToOpen: "แตะเพื่อเปิด",
    openEnvelope: "เปิดการ์ดเชิญ",
    tapOrSwipe: "แตะหรือปัดเพื่อพลิกการ์ด",
    rsvp: "ตอบรับคำเชิญ",
    location: "📍 สถานที่",
    cardFront: "การ์ดเชิญงานแต่งงาน ด้านหน้า",
    cardBack: "การ์ดเชิญงานแต่งงาน ด้านหลัง",
    showFront: "พลิกไปด้านหน้าการ์ด",
    showBack: "พลิกไปด้านหลังการ์ด",
    rsvpTitle: "ตอบรับคำเชิญ",
    rsvpIntro: "เรารอคอยที่จะได้เฉลิมฉลองร่วมกับคุณ",
    name: "ชื่อของคุณ",
    partySize: "มาร่วมงานกี่ท่าน?",
    side: "คุณเป็นแขกของฝ่ายใด?",
    groom: "ฝ่ายเจ้าบ่าว",
    bride: "ฝ่ายเจ้าสาว",
    send: "ส่งคำตอบรับ",
    sending: "กำลังส่ง…",
    back: "กลับไปที่การ์ดเชิญ",
    thankYou: "ขอบคุณค่ะ!",
    received: "เราได้รับคำตอบรับของคุณแล้ว แล้วพบกันในงานนะคะ",
    errName: "กรุณากรอกชื่อของคุณ",
    errPartySize: "กรุณากรอกตัวเลขตั้งแต่ 1 ถึง 20",
    errSide: "กรุณาเลือกว่าคุณเป็นแขกของฝ่ายใด",
    errNetwork: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง",
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
