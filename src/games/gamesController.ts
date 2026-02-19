import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
    Query,
    SuccessResponse,
    Delete,
    Put,
    Patch,
    Request,
} from "@tsoa/runtime";
import {GameService, GameCreationParams} from "./gamesService"
import {Game} from "./game";
import {games, users} from "../db/schema";

type GameWithLinks = Game & {
    _links: {
        self: { href: string };
        collection: { href: string };
        owner: { href: string };
    };
};

@Route("games")
export class GamesController extends Controller {
    @Get("{gameId}")
    public async getGame(
        @Path() gameId: number,
    ): Promise<GameWithLinks | null> {
        const game = await new GameService().get(gameId);
        if (!game) {
            this.setStatus(404);
            return { error: "Game not found." } as any;
        }
        return {
            ...game,
            _links: {
                self: { href: `/games/${gameId}` },
                collection: {href: `/games` },
                owner: { href: `/users/${(game as any).userId}` },
            }
        }
    }

    @Get("")
    public async getAllGames(
        @Request() req: any,
        @Query() name?: string,
        @Query() sys?: string
    ): Promise<GameWithLinks[]> {
        // Requires auth middleware that sets req.user = { id: number, ... }.
        const userId = req?.user?.id as number | undefined;
        const games = await new GameService().getAll(name, undefined, undefined, sys, userId);

        return games.map((game) => ({
            ...game,
            _links: {
                self: { href: `/games/${game.id}` },
                collection: {href: `/games` },
                owner: { href: `/users/${game.userId}` },
            }
        }));
    }

    @SuccessResponse("204", "No games found.")
    @Delete("{gameId}")
    public async deleteGame(
        @Path() gameId: number,
    ): Promise<void> {
        this.setStatus(204);
        return new GameService().delete(gameId);
    }

    @Put("{gameId}")
    public async replaceGame(
        @Body() requestBody: GameCreationParams,
        @Path() gameId: number,
    ): Promise<GameWithLinks> {
        const game = await new GameService().replace(gameId, requestBody);
        return {
            ...game,
            _links: {
                self: { href: `/games/${game.id}` },
                collection: {href: `/games` },
                owner: { href: `/users/${(game as any).userId}` },
            }
        }
    }

    @Patch("{gameId}")
    public async updateGame(
        @Body() requestBody: Partial<GameCreationParams>,
        @Path() gameId: number,
    ): Promise<GameWithLinks> {
        const game = await new GameService().update(gameId, requestBody);
        return {
            ...game,
            _links: {
                self: { href: `/games/${game.id}` },
                collection: {href: `/games` },
                owner: { href: `/users/${(game as any).userId}` },
            }
        }
    }

    // TODO: Add trade-offer endpoints, e.g.:
    // POST /games/{gameId}/offers -> create offer for this game (auth required).
    // GET /games/{gameId}/offers -> owner views incoming offers (auth required).

}
