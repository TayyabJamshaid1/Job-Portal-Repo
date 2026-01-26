import mongoose, { Mongoose, Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  name: string;
  userName: string;
  phoneNumber: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  role: string;
  deletedAt?: Date;
}
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
   role: {
      type: String,
      enum: ["admin", "applicant", "employer"],
      default: "applicant",
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  //   next();
});

const User = models?.User || model<IUser>("User", userSchema);
export default User;
