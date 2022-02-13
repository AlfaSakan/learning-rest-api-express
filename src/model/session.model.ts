import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  UpdatedAt: Date;
}

const SessionSchema = new mongoose.Schema(
  {
    user: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model<SessionDocument>("Session", SessionSchema);

export default Session;
