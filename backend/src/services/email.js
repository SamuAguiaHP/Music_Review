const nodemailer = require('nodemailer');

// 1. Configura o "carteiro" com as credenciais do Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 2. Função que escreve e envia a carta
async function sendRecoveryEmail(userEmail, resetLink) {
  try {
    await transporter.sendMail({
      from: '"Equipe Music Review" <suporte@musicreview.com.br>',
      to: userEmail,
      subject: 'Recuperação de Senha 🎵',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #a855f7;">Recuperação de Senha</h2>
          <p>Olá!</p>
          <p>Recebemos um pedido para redefinir a senha da sua conta no <strong>Music Review</strong>.</p>
          <p>Para criar uma nova senha, clique no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Minha Senha</a>
          </div>
          <p style="color: #777; font-size: 12px;">Se você não fez essa solicitação, pode ignorar este e-mail com segurança.</p>
        </div>
      `,
    });
    console.log(`E-mail de recuperação enviado para: ${userEmail}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Falha no envio de e-mail');
  }
}

module.exports = { sendRecoveryEmail };