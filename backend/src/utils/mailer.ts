import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: `"CANTING" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Kode OTP Reset Password - CANTING',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6aa300;">Reset Password</h2>
        <p>Kamu meminta reset password untuk akun CANTING. Gunakan kode OTP berikut:</p>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; border-radius: 8px; margin: 16px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${otp}</span>
        </div>
        <p>Kode ini berlaku selama <b>10 menit</b>. Jangan berikan kode ini ke siapa pun.</p>
        <p style="color: #888; font-size: 12px;">Kalau kamu tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });
};