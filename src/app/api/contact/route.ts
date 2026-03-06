import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { validateName, validateEmail, validateMessage, sanitize } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter: max 3 requests per IP per 60 seconds
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return false;
    }

    entry.count++;
    return entry.count > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
    try {
        // Rate limiting
        const ip = req.headers.get("x-forwarded-for") ?? "unknown";
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { success: false, error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { name, email, message } = body;

        // Server-side validation
        const nameError = validateName(name ?? "");
        if (nameError) {
            return NextResponse.json({ success: false, error: nameError }, { status: 400 });
        }

        const emailError = validateEmail(email ?? "");
        if (emailError) {
            return NextResponse.json({ success: false, error: emailError }, { status: 400 });
        }

        const messageError = validateMessage(message ?? "");
        if (messageError) {
            return NextResponse.json({ success: false, error: messageError }, { status: 400 });
        }

        // Sanitize inputs for the HTML email
        const safeName = sanitize(name.trim());
        const safeEmail = sanitize(email.trim());
        const safeMessage = sanitize(message.trim());

        // Send via Resend
        const { error } = await resend.emails.send({
            from: "Portfolio Contact <contact@dev-vansh.in>",
            to: ["vansh@dev-vansh.in", "3333vansh@gmail.com"],
            subject: `New message from ${safeName}`,
            replyTo: safeEmail,
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; border: 1px solid #1a1a2e; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #00f0ff20, #a855f720); padding: 24px 32px; border-bottom: 1px solid #1a1a2e;">
                        <h1 style="margin: 0; color: #00f0ff; font-size: 18px; font-weight: 600;">New Portfolio Message</h1>
                    </div>
                    <div style="padding: 32px;">
                        <div style="margin-bottom: 20px;">
                            <p style="margin: 0 0 4px; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">From</p>
                            <p style="margin: 0; color: #e0e0e8; font-size: 16px;">${safeName}</p>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <p style="margin: 0 0 4px; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                            <p style="margin: 0; color: #00f0ff;">${safeEmail}</p>
                        </div>
                        <div style="margin-bottom: 0;">
                            <p style="margin: 0 0 4px; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                            <div style="background: #111; border: 1px solid #1a1a2e; border-radius: 8px; padding: 16px; margin-top: 8px;">
                                <p style="margin: 0; color: #e0e0e8; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
                            </div>
                        </div>
                    </div>
                    <div style="padding: 16px 32px; border-top: 1px solid #1a1a2e; text-align: center;">
                        <p style="margin: 0; color: #444; font-size: 11px;">Sent from dev-vansh.in portfolio contact form</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to send message. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Contact API error:", err);
        return NextResponse.json(
            { success: false, error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
