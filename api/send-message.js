// api/contact.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ⭐ edit only these
const OWNER_EMAIL = "yaseenkannemeyer@gmail.com"; // ← owner receives full quote details
const FROM_EMAIL = "onboarding@resend.dev"; // ← use this for testing

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, messageHtml, messagePlain } = req.body || {};

  // ✔ safer validation
  if (!name || !email || !subject || (!messageHtml && !messagePlain)) {
    return res.status(400).json({
      error: "Missing required contact fields",
    });
  }

  // ✔ fallback plain message
  const safePlain =
    messagePlain ||
    messageHtml?.replace(/<[^>]+>/g, "") ||
    "No message content";

  const safeHtml =
    messageHtml || `<p style="white-space:pre-line;">${safePlain}</p>`;

  const emailPayload = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    replyTo: email,
    subject: `Website Contact — ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="background:#f7f7f7;margin:0;padding:0;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;border:1px solid #eee;overflow:hidden;">
          
          <div style="background:#111;padding:22px 28px;">
            <h1 style="margin:0;color:#fff;font-size:18px;">New Contact Message</h1>
            <p style="margin:4px 0 0;color:#aaa;font-size:12px;">Submitted from website form</p>
          </div>

          <div style="padding:26px 28px;">
            
            <p style="margin:0 0 10px;font-size:14px;">
              <strong>Name:</strong> ${name}
            </p>

            <p style="margin:0 0 10px;font-size:14px;">
              <strong>Email:</strong> 
              <a href="mailto:${email}" style="color:#2563eb;">${email}</a>
            </p>

            <p style="margin:0 0 20px;font-size:14px;">
              <strong>Subject:</strong> ${subject}
            </p>

            <div style="border-top:1px solid #eee;padding-top:16px;font-size:14px;line-height:1.6;color:#333;">
              ${safeHtml}
            </div>

          </div>

          <div style="background:#fafafa;padding:14px 28px;font-size:11px;color:#999;">
            Reply directly to respond to ${name}.
          </div>

        </div>
      </body>
      </html>
    `,
    text: `New contact message

Name: ${name}
Email: ${email}
Subject: ${subject}

${safePlain}`,
  };

  try {
    await resend.emails.send(emailPayload);

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.error("Contact email failed:", error);
    return res.status(500).json({
      error: "Failed to send contact email",
    });
  }
}
