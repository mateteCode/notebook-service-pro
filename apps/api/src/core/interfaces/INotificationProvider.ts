export interface INotificationPayload {
  to: string; // Email o Celular
  customerName: string;
  deviceName: string;
  status: string;
  link?: string; // Link al timeline del cliente
}

export interface INotificationProvider {
  send(payload: INotificationPayload): Promise<void>;
}
