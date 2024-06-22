"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = exports.DeckSchema = void 0;
const Card_1 = require("./Card");
const mongoose_1 = require("mongoose");
exports.DeckSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cards: {
        type: [Card_1.CardSchema],
        required: true,
        default: [],
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});
exports.Deck = (0, mongoose_1.model)('Deck', exports.DeckSchema);
//# sourceMappingURL=Deck.js.map