import { WhatsAppProvider } from "../infrastructure/notifications/WhatsAppProvider.js";
import type { INotificationPayload } from "../core/interfaces/INotificationProvider.js";

export class NotificationService {
  private static providers = [new WhatsAppProvider()]; // Podés agregar un EmailProvider acá

  static async notifyStatusChange(payload: INotificationPayload) {
    const sendPromises = this.providers.map((provider) =>
      provider.send(payload),
    );

    try {
      await Promise.all(sendPromises);
    } catch (error) {
      console.error("Failed to send some notifications:", error);
    }
  }
}
