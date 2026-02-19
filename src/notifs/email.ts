import nodemailer from "nodemailer";
import type { NotificationEvent } from "./types";

function buildEmail(event: NotificationEvent) {
    switch (event.type) {
        case "password_changed":
            return {
                subject: "Your password was changed.",
                text: "Your account password has been updated!",
            };
        case "offer_created":
            return {
                subject: "New game offer!",
                text: `A new game offer was created! Offer ID: ${event.data.offerId}`,
            };
        case "offer_accepted":
            return {
                subject: "Accepted offer!",
                text: `Offer has been accepted! Offer ID: ${event.data.offerId}`,
            };
        case "offer_rejected":
            return {
                subject: "Rejected offer!",
                text: `Offer has been rejected! Offer ID: ${event.data.offerId}`,
            };
    }
}

export async function sendEmail (event: NotificationEvent) {
    const host = process.env.SMTP_HOST;
    if (!host) {
        console.log("SMTP not configured! Email will be sent: ", event);
        return;
    }

    const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT ?? "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });

    const from = process.env.SMTP_FROM ?? "no-reply@mycrappyapiexample.com";
    const { subject, text } = buildEmail(event);

    await transporter.sendMail({
        from,
        to: event.recipients.join(","),
        subject,
        text,
    });
}