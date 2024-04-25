// import mongoose from 'mongoose';
import bycrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { model, Schema, Document } from 'mongoose';
import { CardSchema, ICard } from './Card';

//declare user type
export interface IUser extends Document {
  getResetPasswordToken(): string;
  getSignedToken(): string;
  resetPasswordToken?: string;
  resetPasswordExpire?: string;
  matchPassword(password: string): boolean | PromiseLike<boolean>;
  username: string;
  password: string;
  email: string;
  credits: number;
  decks: Schema.Types.ObjectId[];
  orphanCards: ICard[];
  createdAt: Date;
  lastLogin: Date;
  profile: {
    firstName: String;
    lastName: String;
    avatar: String;
    phone: String;
    address: {
      street1: String;
      street2: String;
      city: String;
      state: String;
      country: String;
      zip: String;
    };
  };
  active: true;
}
// define user schema
const UserSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    index: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, 'Please use minimum of 8 characters'],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Can't be blank"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
    unique: true,
    index: true,
  },
  credits: {
    type: Number,
  },
  decks: {
    type: [Schema.Types.ObjectId],
    ref: 'Deck',
    required: true,
    default: [],
  },
  orphanCards: {
    type: [CardSchema],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    phone: String,
    address: {
      street1: String,
      street2: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    required: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,

  active: { type: Boolean, default: true },
});

UserSchema.pre<IUser>('save', async function (next: any) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = bycrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password: string) {
  return await bycrypt.compare(password, this.password);
};

// UserSchema.methods.incrementCredits = async function (amount: number) {
//     this.credits += amount;
//     await this.save();
//     }

// UserSchema.methods.getSignedToken = function (password: string) {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

export const User = model<IUser>('User', UserSchema);
