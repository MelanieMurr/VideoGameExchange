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
} from "tsoa";
import {UsersService, UserCreationParams, UserPublic} from "./usersService";
import {GameCreationParams, GameService} from "../games/gamesService";
import {Game} from "../games/game";


@Route("users")
export class UsersController extends Controller {
    @Get("{userId}")
    public async getUser(
        @Path() userId: number,
    ): Promise<UserPublic | null> {
        return new UsersService().get(userId);
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createUser(
        @Body() requestBody: UserCreationParams
    ): Promise<UserPublic> {
        this.setStatus(201);
        return new UsersService().create(requestBody);
    }

    @Get("")
    public async getAll(
        @Query() name?: string,
        @Query() email?: string
    ): Promise<UserPublic[]> {
        return new UsersService().getAll(name, email);
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
    ): Promise<UserPublic> {
        return new UsersService().replace(userId, requestBody);
    }

    @Patch("{userId}")
    public async update(
        @Body() requestBody: Partial<UserCreationParams>,
        @Path() userId: number,
    ): Promise<UserPublic> {
        return new UsersService().update(userId, requestBody);
    }

    @Post("{userId}/games")
    public async addGameToUser(
        @Path() userId: number,
        @Body() requestBody: GameCreationParams
    ): Promise<Game> {
        return new GameService().create(userId, requestBody);
    }
    // users/userId/games, users/userId/games/gameId etc
    // reference GamesService instead of UsersService
}