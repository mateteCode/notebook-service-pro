export interface NotificationPayload {
  to: string; // Email o Teléfono
  subject: string; // Asunto o Título
  message: string; // Cuerpo del mensaje
  link?: string; // Link opcional
}

export interface INotificationChannel {
  send(payload: NotificationPayload): Promise<boolean>;
}
