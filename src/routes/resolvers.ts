import { deductUserTokens } from "../core/leaky-bucket";
import { PixInput, PixResponse } from "../core/types";

export const resolvers = {
    pix: async (
        { input }: { input: PixInput },
        ctx: any
    ): Promise<PixResponse> => {
        console.log("input ", input);
        const rand = Math.floor(Math.random() * 6);

        const user = ctx.user!;
        console.log("user from pix: ", user);
        if (rand > 3) {
            return { status: "success", remainingTokens: user.tokens };
        }

        const updatedUser = await deductUserTokens(user._id);

        return {
            status: "failure",
            remainingTokens: updatedUser.tokens,
        };
    },
};
