import { kafka } from "./notifs/kafka";
import { sendEmail } from "./notifs/email";
import { NotificationEvent } from "./notifs/types";

const topic = process.env.NOTIF_TOPIC ?? "email_notifications";

async function run() {
    const consumer = kafka.consumer ({
        groupId: process.env.KAFKA_GROUP_ID ?? "notification-service",
    });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString()) as NotificationEvent;
            await sendEmail(event);
        },
    });
}

run().catch((err) => {
    console.error("Error in notifier:", err);
    process.exit(1);
});
