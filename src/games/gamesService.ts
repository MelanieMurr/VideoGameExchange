import type {Game} from "./game";
import {createDbConnection} from "../db/utils";
import {games} from "../db/schema";
import {eq, and} from "drizzle-orm";

export type GameCreationParams = Pick<Game, "name" | "condition" | "publisher" | "publishYear" | "sys">;

export class GameService {
    public async get(id: number): Promise<Game | null> {
        const db = createDbConnection();
        const rows = await db.select()
            .from(games)
            .where(eq(games.id, id));
        if (!rows) {
            return null;
        }
        const game = rows[0];
        return {
            id,
            name: game.name,
            condition: game.condition,
            publisher: game.publisher,
            publishYear: game.publishYear,
            sys: game.sys,
        };
    }

    public async create(userId: number, gameCreationParams: GameCreationParams): Promise<Game> {
        const db = createDbConnection();
        const [{gameId}] = await db.insert(games).values({
            name: gameCreationParams.name,
            publisher: gameCreationParams.publisher,
            publishYear: gameCreationParams.publishYear,
            condition: gameCreationParams.condition,
            sys: gameCreationParams.sys,
            userId: userId,
        }).returning({gameId: games.id});

        return {
            id: gameId,
            name: gameCreationParams.name,
            publisher: gameCreationParams.publisher,
            publishYear: gameCreationParams.publishYear,
            condition: gameCreationParams.condition,
            sys: gameCreationParams.sys,
        }
    }
}