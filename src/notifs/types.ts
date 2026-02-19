export type NotificationType =
    | "password_changed"
    | "offer_created"
    | "offer_accepted"
    | "offer_rejected";

export interface NotificationEvent {
    type: NotificationType;
    recipients: string[];
    data: Record<string, unknown>;
}