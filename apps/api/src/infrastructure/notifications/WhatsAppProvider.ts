import type {
  INotificationProvider,
  INotificationPayload,
} from "../../core/interfaces/INotificationProvider.ts";

export class WhatsAppProvider implements INotificationProvider {
  async send(payload: INotificationPayload): Promise<void> {
    const message = `Hola ${payload.customerName}! Tu equipo ${payload.deviceName} ha pasado al estado: ${payload.status}. Podes seguirlo acá: ${payload.link}`;

    // En una implementación real, aquí llamarías a Twilio o Meta API.
    // Por ahora, simulamos el log en consola.
    console.log(`[WhatsApp Sent to ${payload.to}]: ${message}`);
  }
}
