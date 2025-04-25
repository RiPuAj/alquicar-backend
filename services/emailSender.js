import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailSender {
    static transporter = null;


    static async getEmailSender() {
        if (!EmailSender.transporter) {
            EmailSender.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            });
;
        }

        return EmailSender.transporter;
    }

    static async sendConfirmationEmail({ email, name, token }) {
        const transporter = await EmailSender.getEmailSender();

        console.log(name, email, token);

        transporter.sendMail({
            from: '"Alquicar" <alquicar03@gmail.com>',
            to: email,
            subject: 'Confirma tu correo',
            html: `
              <h3>Hola ${name}</h3>
              <p>Gracias por registrarte. Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
              <a href="https://localhost:3000/auth/verify?token=${token}">Confirmar cuenta</a>
            `
          });    
    }
    
}