import mongoose, { Document, Schema } from 'mongoose';

/**
 * User Document Interface
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  points: number;
  level: number;
  itemsPosted: number;
  itemsClaimed: number;
  itemsReturned: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Schema
 */
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // IMPORTANT: do not return password by default
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    itemsPosted: {
      type: Number,
      default: 0,
      min: 0,
    },
    itemsClaimed: {
      type: Number,
      default: 0,
      min: 0,
    },
    itemsReturned: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

/**
 * User Model
 */
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
