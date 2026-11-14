import "server-only";

import { Resend } from "resend";

export async function sendVerificationEmail(email: string, otp: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Email delivery is not configured.");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: `Your Planify verification code: ${otp}`,
    text: `Your Planify verification code is ${otp}. It expires in 10 minutes.\n\nKoodhka xaqiijinta Planify waa ${otp}. Wuxuu dhacayaa 10 daqiiqo gudahood.`,
    html: `<div style="font-family:Arial,sans-serif;color:#18211c;max-width:520px;margin:auto;padding:32px"><p style="color:#315d3c;font-weight:700;letter-spacing:.12em">PLANIFY</p><h1 style="font-size:24px">Verify your email</h1><p>Enter this code to finish creating your account. It expires in 10 minutes.</p><div style="font-size:32px;font-weight:700;letter-spacing:.3em;background:#f1f5ef;border-radius:12px;padding:18px;text-align:center;color:#173f2b">${otp}</div><p style="margin-top:24px">Iimaylkaaga xaqiiji</p><p>Geli koodhkan si aad u dhammaystirto samaynta akoonka. Wuxuu dhacayaa 10 daqiiqo gudahood.</p><p style="font-size:12px;color:#768078">If you did not request this code, you can ignore this email.</p></div>`,
  });

  if (error) {
    console.error("Resend verification email rejected the request", {
      code: error.name,
      statusCode: error.statusCode,
      message: error.message,
    });
    throw new Error("Email delivery failed.");
  }
}
