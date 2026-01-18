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
import {GameService, GameCreationParams} from "./gamesService"
import {Game} from "./game";


@Route("games")
export class GamesController extends Controller {
    @Get("{gameId}")
    public async getGame(
        @Path() gameId: number,
    ): Promise<Game | null> {
        return new GameService().get(gameId);
    }

}