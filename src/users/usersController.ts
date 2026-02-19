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
} from "@tsoa/runtime";
import {UsersService, UserCreationParams, UserPublic} from "./usersService";
import {GameCreationParams, GameService} from "../games/gamesService";
import {Game} from "../games/game";
import {games, users} from "../db/schema";
type UserPublicLinks = UserPublic & {
    _links: {
        self: { href: string };
        collection: { href: string };
        owner: { href: string };
    };
};
type UserGameWithLinks = Game & {
    _links: {
        self: { href: string };
        collection: { href: string };
        owner: { href: string };
    };
};

@Route("users")
export class UsersController extends Controller {
    @Get("{userId}")
    public async getUser(
        @Path() userId: number,
    ): Promise<UserPublicLinks | null> {
        const user = await new UsersService().get(userId);
        if (!user) {
            this.setStatus(404);
            return { error: "Game not found." } as any;
        }
        return {
            ...user,
            _links: {
                self: { href: `/users/${userId}` },
                collection: {href: `/users` },
                owner: { href: `/users/${(user as any).userId}` },
            }
        }
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createUser(
        @Body() requestBody: UserCreationParams
    ): Promise<UserPublicLinks> {
        const user = await new UsersService().create(requestBody);
        this.setStatus(201);
        return {
            ...user,
            _links: {
                self: { href: `/users/${user.id}` },
                collection: { href: `/users` },
                owner: { href: `/users/${user.id}` },
            }
        }
    }

    @Get("")
    public async getAll(
        @Query() name?: string,
        @Query() email?: string
    ): Promise<UserPublicLinks[]> {
        const user = await new UsersService().getAll(name, email);
        return user.map((user) => ({
            ...user,
            _links: {
                self: { href: `/users/${user.id}` },
                collection: { href: `/users` },
                owner: { href: `/users/${user.id}` },
            }
        }));
    }

    @SuccessResponse("204", "No Content")
    @Delete("{userId}")
    public async delete(
        @Path() userId: number,
    ): Promise<void> {
        this.setStatus(204);
        return new UsersService().delete(userId);
    }

    @Put("{userId}")
    public async replace(
        @Body() requestBody: UserCreationParams,
        @Path() userId: number,
    ): Promise<UserPublicLinks> {
        const user = await new UsersService().replace(userId, requestBody);
        return {
            ...user,
            _links: {
                self: { href: `/users/${user.id}` },
                collection: { href: `/users` },
                owner: { href: `/users/${user.id}` },
            }
        }
    }

    @Patch("{userId}")
    public async update(
        @Body() requestBody: Partial<UserCreationParams>,
        @Path() userId: number,
    ): Promise<UserPublicLinks> {
        const user = await new UsersService().update(userId, requestBody);
        if (!requestBody || Object.keys(requestBody).length === 0) {
            this.setStatus(400);
            return { error: "No fields provided to update." } as any;
        }
        return {
            ...user,
            _links: {
                self: { href: `/users/${user.id}` },
                collection: { href: `/users` },
                owner: { href: `/users/${user.id}` },
            }
        }
    }

    @Post("{userId}/games")
    public async addGameToUser(
        @Path() userId: number,
        @Body() requestBody: GameCreationParams
    ): Promise<UserGameWithLinks> {
        const userGame = await new GameService().create(userId, requestBody);
        return {
            ...userGame,
            _links: {
                self: { href: `users/${userId}/games` },
                collection: {href: `users/games` },
                owner: { href: `/users/${(games as any).userId}` },
            }
        }
    }

    @Get("{userId}/games/{gameId}")
    public async getGame(
        @Path() gameId: number,
        @Path() userId: number,
    ): Promise<UserGameWithLinks | { error: string}> {
        // Duplicate route signature with getUserGame below; delete one of them.
        const userGame = await new GameService().getWithUserId(gameId, userId);
        if (!userGame) {
            this.setStatus(404);
            return { error: "Game not found." };
        }
        return {
            ...userGame,
            _links: {
                self: { href: `/users/${userId}/games/${gameId}` },
                collection: {href: `/games` },
                owner: { href: `/users/${userId}` },
            }
        }
    }


    @Put("{userId}/games/{gameId}")
    public async replaceGame(
        @Body() requestBody: GameCreationParams,
        @Path() gameId: number,
        @Path() userId: number,
    ): Promise<UserGameWithLinks> {
        // Duplicate route signature with replaceUserGame below; delete one of them.
        const userGame = await new GameService().replace(gameId, requestBody);
        return {
            ...userGame,
            _links: {
                self: { href: `/users/${userId}/games` },
                collection: {href: `/games` },
                owner: { href: `/users/${(games as any).userId}` },
            }
        }
    }

    @Patch("{userId}/games/{gameId}")
    public async updateGame(
        @Body() requestBody: Partial<GameCreationParams>,
        @Path() gameId: number,
    ): Promise<UserGameWithLinks> {
        // Duplicate route signature with updateUserGame below; delete one of them.
        const userGame = await new GameService().update(gameId, requestBody);
        return {
            ...userGame,
            _links: {
                self: { href: `/users/${users.id}/games/${gameId}` },
                collection: {href: `/games` },
                owner: { href: `/users/${(games as any).userId}` },
            }
        }
    }

    @SuccessResponse("204", "No Content")
    @Delete("{userId}/games/{gameId}")
    public async deleteGame(
        @Path() userId: number,
        @Path() gameId: number,
    ): Promise<void> {
        this.setStatus(204);
        return new GameService().delete(gameId);
    }



    // TODO: Add trade-offer routes under users:
    // GET /users/{userId}/offers?status=pending -> owner views incoming offers (auth required).
    // PATCH /users/{userId}/offers/{offerId} -> accept/reject offer (auth required).
    // TODO: Enforce that only the game owner can accept/reject offers.

}
