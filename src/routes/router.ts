import jwt from "jsonwebtoken";
import { graphqlHTTP } from "koa-graphql";
import Router from "koa-router";
import User, { IUser } from "../core/db";
import { schema } from "../core/schema";
import { authMiddleware, SECRET, validateTokens } from "./middlewares";
import { resolvers } from "./resolvers";

export const router = new Router();
router.all(
    "/graphql",
    authMiddleware,
    validateTokens,
    graphqlHTTP(async (req, ctx, koaCtx) => {
        console.log("Koa context user:", koaCtx.state.user);

        return {
            schema: schema,
            rootValue: resolvers,
            graphiql: true,
            context: {
                user: koaCtx.state.user,
            },
        };
    })
);

router.post("/user", async (ctx) => {
    const user: IUser = await User.create({
        tokens: 10,
        lastRefill: Date.now(),
    });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    ctx.status = 201;
    ctx.body = { token, user };
});
router.get("/status", authMiddleware, async (ctx, next) => {
    ctx.body = {
        data: ctx.state.user as IUser,
    };
});
