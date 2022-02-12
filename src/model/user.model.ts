import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparedPassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async (next) => {
  let user = this as unknown as UserDocument;

  // Only hash the password if it has been modified (or is new)
  if (user.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hash(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

UserSchema.methods.comparedPassword = async (candidatePassword: string) => {
  try {
    const user = this as unknown as UserDocument;
    return bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    return false;
  }
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
