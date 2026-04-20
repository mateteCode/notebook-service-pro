import nodemailer from "nodemailer";
import dotenv from "dotenv";
import type {
  INotificationChannel,
  NotificationPayload,
} from "./INotificationChannel.js";

export class EmailChannel implements INotificationChannel {
  private transporter;

  constructor() {
    dotenv.config();
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      if (!payload.to || !payload.to.includes("@")) return false;

      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-w-lg mx-auto p-4 border rounded-lg">
          <h2 style="color: #2563eb;">Notebook Service Pro</h2>
          <h3>${payload.subject}</h3>
          <p>${payload.message}</p>
          ${payload.link ? `<a href="${payload.link}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Ver mi equipo</a>` : ""}
          <p style="color: #666; font-size: 12px; margin-top: 30px;">Por favor no respondas a este correo automatizado.</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: `"Taller Service Pro" <${process.env.EMAIL_USER}>`,
        to: payload.to,
        subject: payload.subject,
        html: htmlTemplate,
      });

      console.log(`📧 Email enviado exitosamente a ${payload.to}`);
      return true;
    } catch (error) {
      console.error(`❌ Error enviando email a ${payload.to}:`, error);
      return false;
    }
  }
}
