import express, {json, urlencoded, Response as ExResponse, Request as ExRequest} from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";

export const app = express();

app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on("finish", () => {
        const durationMs = Date.now() - startedAt;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${durationMs}ms`);
    });
    next();
});

app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on("finish", () => {
        const durationMs = Date.now() - startedAt;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${durationMs}ms`);
    });
    next();
});

app.use(
    urlencoded({
        extended: true,
    })
);
app.use(json());

app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
        const token = auth.slice("Bearer ".length).trim();
        const userId = Number(token);
        if (!Number.isNaN(userId)) {
            (req as any).user = { id: userId };
        }
    }
    next();
});

app.use((err: any, req: ExRequest, res: ExResponse, next: express.NextFunction) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || "Internal server error." });
});

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    return res.send(
        swaggerUi.generateHTML(await import("../build/swagger.json"))
    );
});

RegisterRoutes(app);
