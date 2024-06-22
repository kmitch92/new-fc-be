"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.CardSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CardSchema = new mongoose_1.Schema({
    frontField: {
        type: String,
        required: true,
    },
    backField: {
        type: String,
        required: true,
    },
    extraField: {
        type: String,
    },
    imageURL: {
        type: String,
    },
    tags: {
        type: [String],
    },
    answerType: {
        type: String,
        required: true,
    },
    lastReviewed: {
        type: Date,
        required: true,
    },
    nextReview: {
        type: Date,
        required: true,
    },
    totalReviews: {
        type: Number,
        required: true,
    },
    failedReviews: {
        type: Number,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
});
exports.Card = (0, mongoose_1.model)('Card', exports.CardSchema);
//# sourceMappingURL=Card.js.map