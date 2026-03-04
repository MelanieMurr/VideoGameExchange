import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Patch,
    Query,
    Route,
    SuccessResponse,
    Request,
} from "@tsoa/runtime";
import { OffersService, OfferCreateParams } from "./offersService";
import { Offer, OfferStatus } from "./offer";

type OfferWithLinks = Offer & {
    _links: {
        self: { href: string };
        collection: { href: string };
    };
};

@Route("offers")
export class OffersController extends Controller {
    @SuccessResponse("201", "Created")
    @Post("")
    public async createOffer(
        @Request() req: any,
        @Body() body: Omit<OfferCreateParams, "requesterUserId">
    ): Promise<OfferWithLinks> {
        const requesterUserId = req?.user?.id as number | undefined;
        if (!requesterUserId) {
            this.setStatus(401);
            return { error: "Unauthorized" } as any;
        }
        const offer = await new OffersService().createOffer({ ...body, requesterUserId });
        this.setStatus(201);
        return {
            ...offer,
            _links: {
                self: { href: `/offers/${offer.id}` },
                collection: { href: `/offers` },
            },
        };
    }

    @Get("")
    public async listOffersForOwner(
        @Request() req: any,
        @Query() status?: OfferStatus,
    ): Promise<OfferWithLinks[]> {
        const ownerUserId = req?.user?.id as number | undefined;
        if (!ownerUserId) {
            this.setStatus(401);
            return [{ error: "Unauthorized" } as any];
        }
        const offers = await new OffersService().listForOwner(ownerUserId, status);
        return offers.map((offer) => ({
            ...offer,
            _links: {
                self: { href: `/offers/${offer.id}` },
                collection: { href: `/offers` },
            },
        }));
    }

    @Patch("{offerId}")
    public async updateOfferStatus(
        @Request() req: any,
        @Path() offerId: number,
        @Body() body: { status: OfferStatus }
    ): Promise<OfferWithLinks> {
        const ownerUserId = req?.user?.id as number | undefined;
        if (!ownerUserId) {
            this.setStatus(401);
            return { error: "Unauthorized" } as any;
        }
        const offer = await new OffersService().updateStatus(
            offerId,
            ownerUserId,
            body.status
        );

        return {
            ...offer,
            _links: {
                self: { href: `/offers/${offer.id}` },
                collection: { href: `/offers` },
            },
        };
    }
}