import type {
  INotificationChannel,
  NotificationPayload,
} from "./INotificationChannel.js";
import { EmailChannel } from "./EmailChannel.js";

export class NotificationManager {
  private channels: INotificationChannel[] = [];

  constructor() {
    this.channels.push(new EmailChannel());
    // TODO: Add more Channels: new WhatsAppChannel()
  }

  async notifyAll(payload: NotificationPayload) {
    // Ejecuta todos los canales en paralelo
    const promises = this.channels.map((channel) => channel.send(payload));
    await Promise.allSettled(promises);
  }
}

// Exportamos una única instancia (Singleton) para usar en toda la app
export const notifier = new NotificationManager();
