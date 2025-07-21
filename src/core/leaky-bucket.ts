import User, { IUser } from "./db";

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export const findUserById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
};
export const deductUserTokens = async (id: string): Promise<IUser> => {
    const user = await User.findByIdAndUpdate(
        id,
        { $inc: { tokens: -1 } },
        { new: true }
    );
    return user!;
};

export const verifyIfOneHourPassed = (lastRefill: Date): boolean => {
    const now = Date.now();

    const diff = Math.abs(lastRefill.getTime() - now);

    return diff >= ONE_HOUR_IN_MS;
};

export const refillUserTokens = async (user: IUser): Promise<IUser> => {
    const oneHourPassed = verifyIfOneHourPassed(user.lastRefill);
    if (!oneHourPassed) {
        return user;
    }

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
        {
            _id: user._id,
            tokens: { $lt: 10 },
        },
        {
            $inc: { tokens: 1 },
            $set: { lastRefill: new Date() },
        },
        { new: true }
    );
    return updatedUser ? updatedUser : user;
};
export const verifyIfUserHasTokenAvailable = async (
    user?: IUser
): Promise<boolean> => {
    if (!user || user.tokens < 1) {
        return false;
    }
    return true;
};
