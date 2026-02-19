export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface Offer {
    id: number;
    requesterUserId: number;
    ownerUserId: number;
    offeredGameId: number;
    requestedGameId: number;
    status: OfferStatus;
    createdAt: Date;
    updatedAt: Date;
}