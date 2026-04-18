import 'server-only';
import { transporter } from "@/lib/mailer";
import { render } from '@react-email/render';

export async function sendEmail({
  node,
  to,
  subject
}: {
  node: React.ReactNode
  to: string
  subject: string
}) {
  try {
    const html = await render(node);

    await transporter.sendMail({
      from: `Biyaheng Tipid <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Auth Error:", error);
    return { success: false, error: "Failed to send email." };
  }
}