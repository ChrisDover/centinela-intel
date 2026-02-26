import { getSequenceEmail, type SequenceDay } from "../lib/emails/conversion-sequence";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const to = "chris@centinelaintel.com";

async function main() {
  for (const day of [3, 7, 14] as SequenceDay[]) {
    const email = getSequenceEmail(day, {
      unsubscribeUrl: "https://centinelaintel.com/api/unsubscribe?token=preview",
    });
    const res = await resend.emails.send({
      from: "Centinela Intel <intel@centinelaintel.com>",
      to,
      subject: `[PREVIEW Day ${day}] ${email.subject}`,
      html: email.html,
    });
    console.log(`Day ${day}: ${res.data?.id || res.error?.message}`);
    await new Promise(r => setTimeout(r, 600));
  }
}
main();
