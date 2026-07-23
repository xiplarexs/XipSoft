interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export function getEmailVerificationTemplate(
  code: string,
  purpose: string,
  email: string
): EmailTemplate {
  const subject =
    purpose === "password_reset"
      ? "sifre Sıfırlama Kodu"
      : "E-posta Dogrulama Kodu";

  return {
    to: email,
    subject,
    html: `<p>Dogrulama kodunuz: <b>${code}</b></p>`,
  };
}

export async function sendEmail(_template: EmailTemplate): Promise<boolean> {
  console.warn("[email-service] sendEmail called but email service is not configured");
  return false;
}
