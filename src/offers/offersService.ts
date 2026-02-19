import { createDbConnection } from "../db/utils";
import { offers, games, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { Offer, OfferStatus } from "./offer";
import { enqueueNotification } from "../notifs/producer";

export type OfferCreateParams = {
  requesterUserId: number;
  offeredGameId: number;
  requestedGameId: number;
};

export class OffersService {
    public async createOffer(params: OfferCreateParams): Promise<Offer> {
        const db = createDbConnection();


        const [requestedGame] = await db.select().from(games).where(eq(games.id, params.requestedGameId));
        if (!requestedGame) throw new Error("Requested game not found.");

        const ownerUserId = requestedGame.userId;

        const [createdOffer] = await db.insert(offers).values({
            requesterUserId: params.requesterUserId,
            ownerUserId,
            offeredGameId: params.offeredGameId,
            requestedGameId: params.requestedGameId,
            status: "pending",
        }).returning();

        const [requester] = await db.select().from(users).where(eq(users.id, params.requesterUserId));
        const [owner] = await db.select().from(users).where(eq(users.id, ownerUserId));

        await enqueueNotification({
            type: "offer_created",
            recipients: [requester.email, owner.email],
            data: { offerId: createdOffer.id, ...params },
        });
        return createdOffer as Offer;
    }

    public async updateStatus(offerId: number, ownerUserId: number, status: OfferStatus): Promise<Offer> {
        const db = createDbConnection();
        const [existingOffer] = await db.select().from(offers).where(eq(offers.id, offerId));
        if (!existingOffer) throw new Error("Offer not found.");
        if (existingOffer.ownerUserId !== ownerUserId) throw new Error("Offer does not belong to the user.");

        const [updatedOffer] = await db.update(offers).set({ status, updatedAt: new Date() }).where(eq(offers.id, offerId)).returning();

        const [requester] = await db.select().from(users).where(eq(users.id, updatedOffer.requesterUserId));
        const [owner] = await db.select().from(users).where(eq(users.id, updatedOffer.ownerUserId));

        await enqueueNotification({
            type: status === "accepted" ? "offer_accepted" : "offer_rejected",
            recipients: [requester.email, owner.email],
            data: { offerId: updatedOffer.id, status },
        });
        return updatedOffer as Offer;
    }
}