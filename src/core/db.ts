import mongoose, { model, Schema } from "mongoose";

mongoose.connect("mongodb://leaky:bucket@localhost:27017/users", {
    authSource: "admin",
});

export interface IUser {
    tokens: number;
    lastRefill: Date;
    _id: string;
}

const userSchema = new Schema<IUser>({
    tokens: { type: Number, required: true },
    lastRefill: { type: Date, required: true },
});

const User = model("User", userSchema);

export default User;
