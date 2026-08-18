import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

/** Sends the passwordless sign-in link via EmailJS. Template's "To Email" field must be `{{email}}`. */
export async function sendSignInEmail({ toEmail, link }: { toEmail: string; link: string }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error("EmailJS is not configured — check NEXT_PUBLIC_EMAILJS_* env vars.");
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { email: toEmail, link },
    { publicKey: PUBLIC_KEY }
  );
}
