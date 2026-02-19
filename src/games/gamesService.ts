import type {Game} from "./game";
import {createDbConnection} from "../db/utils";
import {games} from "../db/schema";
import {eq, and, ne} from "drizzle-orm";

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
            id: game.id,
            userId: game.userId,
            name: game.name,
            condition: game.condition,
            publisher: game.publisher,
            publishYear: game.publishYear,
            sys: game.sys,
        };
    }

    public async getWithUserId(id: number, userId: number): Promise<Game | null> {
        const db = createDbConnection();
        const rows = await db.select()
            .from(games)
            .where(and(eq(games.id, id), eq(games.userId, userId)));
        if (!rows) {
            return null;
        }
        const game = rows[0];
        return {
            id: game.id,
            userId: game.userId,
            name: game.name,
            condition: game.condition,
            publisher: game.publisher,
            publishYear: game.publishYear,
            sys: game.sys,
        }
    }

    public async getAll(
        name: string | undefined,
        publisher: string | undefined,
        publishYear: number | undefined,
        sys: string | undefined,
        excludeUserId: number | undefined
    ): Promise<Game[]> {
        const db = createDbConnection();
        const rows = await db.select()
            .from(games)
            .where(and(
                name ? eq(games.name, name) : undefined,
                publisher ? eq(games.publisher, publisher) : undefined,
                publishYear ? eq(games.publishYear, publishYear) : undefined,
                sys ? eq(games.sys, sys) : undefined,
                excludeUserId ? ne(games.userId, excludeUserId) : undefined
            ));
        return rows.map((x) => ({
            id: x.id,
            userId: x.userId,
            name: x.name,
            condition: x.condition,
            publisher: x.publisher,
            publishYear: x.publishYear,
            sys: x.sys,
        }));
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
            userId: userId,
            name: gameCreationParams.name,
            publisher: gameCreationParams.publisher,
            publishYear: gameCreationParams.publishYear,
            condition: gameCreationParams.condition,
            sys: gameCreationParams.sys,
        }
    }

    public async update(id: number, gameCreationParams: Partial<GameCreationParams>): Promise<Game> {
        const db = createDbConnection();
        const [result] = await db
            .update(games)
            .set({ name: gameCreationParams.name, publisher: gameCreationParams.publisher, publishYear: gameCreationParams.publishYear, condition: gameCreationParams.condition, sys: gameCreationParams.sys })
            .where(eq(games.id, id)).returning();

        return {
            id: result.id,
            userId: result.userId,
            name: result.name,
            publisher: result.publisher,
            publishYear: result.publishYear,
            condition: result.condition,
            sys: result.sys,
        };
    }

    public async replace(id: number, gameCreationParams: GameCreationParams): Promise<Game> {
        const db = createDbConnection();
        const [result] = await db
            .update(games)
            .set({ name: gameCreationParams.name, publisher: gameCreationParams.publisher, publishYear: gameCreationParams.publishYear, condition: gameCreationParams.condition, sys: gameCreationParams.sys })
        .where(eq(games.id, id)).returning();

        return {
            id: result.id,
            userId: result.userId,
            name: result.name,
            publisher: result.publisher,
            publishYear: result.publishYear,
            condition: result.condition,
            sys: result.sys,
        };
    }

    public async delete(id: number): Promise<void> {
        const db = createDbConnection();
        await db.delete(games).where(eq(games.id, id));
    }
}