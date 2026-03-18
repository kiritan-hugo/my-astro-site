import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function post({ request }) {
  const form = await request.formData();

  const name = form.get("name");
  const email = form.get("email");
  const message = form.get("message");

  // メール送信
  await resend.emails.send({
    from: "お問い合わせ <noreply@yourdomain.com>",
    to: "andeslife2022@gmail.com"
    subject: "【重要】andes-life.comからの問い合わせメール",
    text: `
名前: ${name}
メールアドレス: ${email}

内容:
${message}
    `,
  });

  // サンクスページへリダイレクト
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/contact/thanks",
    },
  });
}