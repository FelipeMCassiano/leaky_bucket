import jwt from "jsonwebtoken";
import { Next, ParameterizedContext } from "koa";
import Router from "koa-router";
import { IUser } from "../core/db";
import {
    findUserById,
    refillUserTokens,
    verifyIfUserHasTokenAvailable,
} from "../core/leaky-bucket";

export const SECRET =
    process.env.SECRET ??
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export const authMiddleware = async (
    ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
    next: Next
) => {
    try {
        const token = ctx.header.authorization?.split(" ")[1]!;
        const decoded: any = jwt.verify(token, SECRET);
        const user = await findUserById(decoded.userId);
        if (!user) {
            ctx.status = 403;
            ctx.body = { error: "Unauthorized" };
            return;
        }
        ctx.state.user = user;
        await next();
    } catch (err) {
        ctx.status = 403;
        ctx.body = { error: "Unauthorized" };
    }
};

export const validateTokens = async (
    ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
    next: Next
) => {
    const user: IUser = ctx.state.user;

    const refilledUser = await refillUserTokens(user);

    const hasTokens = await verifyIfUserHasTokenAvailable(refilledUser);

    if (!hasTokens) {
        ctx.status = 429;
        return;
    }

    ctx.state.user = refilledUser;

    await next();
};
