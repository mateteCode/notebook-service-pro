import { Schema, model, type TypeKeyBaseType } from "mongoose";
import { UserRole, type IUser } from "../../core/interfaces/IUser.ts";

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    phoneNumber: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<IUser>("User", UserSchema);
