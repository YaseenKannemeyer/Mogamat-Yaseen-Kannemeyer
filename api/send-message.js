import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, messageHtml, messagePlain } = req.body;

  if (!name || !email || !subject || !messageHtml) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // replace with your verified sender
      to: ["yaseenkannemeyer@gmail.com"], // replace with your recipient
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="margin-bottom: 4px;">New message from ${name}</h2>
          <p style="margin: 0; color: #666; font-size: 14px;">${email}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 16px;">${messageHtml}</div>
        </div>
      `,
      text: `From: ${name} (${email})\nSubject: ${subject}\n\n${messagePlain}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
