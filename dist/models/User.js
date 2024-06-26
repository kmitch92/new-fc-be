"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// import mongoose from 'mongoose';
const bcrypt_1 = __importDefault(require("bcrypt"));
// import jwt from 'jsonwebtoken';
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const Card_1 = require("./Card");
// define user schema
const UserSchema = new mongoose_1.Schema({
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
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Deck',
        required: true,
        default: [],
    },
    orphanCards: {
        type: [Card_1.CardSchema],
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
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = bcrypt_1.default.hashSync(this.password, salt);
        next();
    });
});
UserSchema.methods.matchPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
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
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
};
exports.User = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=User.js.map