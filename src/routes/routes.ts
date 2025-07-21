import jwt from "jsonwebtoken";
import Router from "koa-router";
import User, { IUser } from "../core/db";
import { deductUserTokens } from "../core/leaky-bucket";
import { authMiddleware, SECRET, validateTokens } from "./middlewares";

export const router = new Router();

router.post("/user", async (ctx, next) => {
    const user: IUser = await User.create({
        tokens: 10,
        lastRefill: Date.now(),
    });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    ctx.status = 201;
    ctx.body = { token, user };
});

router.post("/try", authMiddleware, validateTokens, async (ctx, next) => {
    const rand = Math.floor(Math.random() * 6);

    const user = ctx.state.user;
    if (rand > 3) {
        ctx.status = 200;
        ctx.body = { status: "success", remainingTokens: user.tokens };
        return;
    }

    const updatedUser = await deductUserTokens(user._id);

    ctx.status = 400;
    ctx.body = { status: "failure", remainingTokens: updatedUser.tokens };
});
