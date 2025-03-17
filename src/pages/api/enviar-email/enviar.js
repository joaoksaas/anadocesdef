// pages/api/sendEmail.js
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendEmail(req, res) {
  try {
    await sendgrid.send({
      to: req.body.email, // Email do destinatário
      from: "anadocesuepg2024@gmail.com", // Seu email verificado no SendGrid
      subject: "Recuperar a senha XD",
      text: "Clique no link para mudar sua senha.",
      html: "<a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>Clique aqui para mudar sua senha</a>",
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
