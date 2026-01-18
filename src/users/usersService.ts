import type {User} from "./user";
import {createDbConnection} from "../db/utils";
import {users} from "../db/schema";
import {eq, and} from "drizzle-orm";

export type UserCreationParams = Pick<User, "name" | "email" | "address" | "password">;
export type UserPublic = Pick<User, "id" | "name" | "email" | "address">;

export class UsersService {
    public async get(id: number): Promise<UserPublic | null> {
        const db = createDbConnection();
        const rows = await db.select()
            .from(users)
            .where(eq(users.id, id));
        if(!rows) {
            return null;
        }
        const user = rows[0];
        return {
            id,
            email: user.email,
            name: user.name,
            address: user.address,
        };
    }

    public async getAll(name?: string, email?: string): Promise<UserPublic[]> {
        const db = createDbConnection();
        const rows = await db.select()
            .from(users)
            .where(
            and(
                name ? eq(users.name, name) : undefined,
                email ? eq(users.email, email): undefined
            )
            )
        const ret: UserPublic[] = rows.map(x => ({
            id: x.id,
            name: x.name,
            address: x.address,
            email: x.email
        }));
        return ret;

    }

    public async create(userCreationParams: UserCreationParams): Promise<UserPublic> {
        const db = createDbConnection();
        const [{userId}] = await db.insert(users).values({
            name: userCreationParams.name,
            email: userCreationParams.email,
            address: userCreationParams.address,
            password: userCreationParams.password,
        }).returning({userId: users.id});

        return {
            id: userId,
            name: userCreationParams.name,
            email: userCreationParams.email,
            address: userCreationParams.address,
        }
    }

    public async update(id: number, userCreationParams: Partial<UserCreationParams>): Promise<UserPublic> {
        const db = createDbConnection();
        const [result] = await db.update(users)
            .set({ name: userCreationParams.name, email: userCreationParams.email, address: userCreationParams.address, password: userCreationParams.password })
            .where(eq(users.id, id)).returning();
        return {
            id: result.id,
            name: result.name,
            email: result.email,
            address: result.address
        }
    }

    public async replace(id: number, userCreationParams: UserCreationParams): Promise<UserPublic> {
        const db = createDbConnection();
        const [result] = await db.update(users)
            .set({ name: userCreationParams.name, email: userCreationParams.email, address: userCreationParams.address, password: userCreationParams.password })
            .where(eq(users.id, id)).returning();

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            address: result.address
        }
    }

    public async delete(id: number) {
        const db = createDbConnection();
        await db.delete(users).where(eq(users.id, id));
    }
}