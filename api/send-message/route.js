import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, subject, messageHtml, messagePlain } = body;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "yaseenkannemeyer@gmail.com",
      replyTo: email,
      subject: `Website Contact — ${subject}`,
      html: messageHtml,
      text: messagePlain,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
