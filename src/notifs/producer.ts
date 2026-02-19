import type { NotificationEvent } from "./types";
import { kafka } from "./kafka";

const topic = process.env.KAFKA_TOPIC ?? "email_notifications";

let producer: ReturnType<typeof kafka.producer> | null = null;

async function getProducer() {
    if (!producer) {
        producer = kafka.producer();
        await producer.connect();
    }
    return producer;
}

export async function enqueueNotification(event: NotificationEvent) {
    const prod = await getProducer();
    await prod.send({
        topic,
        messages: [{ value: JSON.stringify(event) }],
    });
}

