import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("[DEV] Contact form:", { name, email, subject, message });
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(apiKey);

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from: `Portfolio <${fromEmail}>`,
      to: ["vansh@dev-vansh.in"],
      replyTo: email,
      subject: `${subject || "New message"} — ${name}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 0;">
          <p style="margin: 0 0 24px; color: #333; font-size: 15px; line-height: 1.6;">
            New message from your portfolio contact form.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px; width: 70px; vertical-align: top;">From</td>
              <td style="padding: 8px 0; color: #111; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #111;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Subject</td>
              <td style="padding: 8px 0; color: #111; font-size: 14px;">${subject || "—"}</td>
            </tr>
          </table>

          <div style="padding: 16px; background: #f9f9f9; border-radius: 8px; border-left: 3px solid #e5a03e;">
            <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="margin: 24px 0 0; color: #aaa; font-size: 11px;">
            Sent via portfolio contact form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: unknown) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}
