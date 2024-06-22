"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: './config.env' });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const Card_1 = require("./models/Card");
const Deck_1 = require("./models/Deck");
const spacedRepetition_1 = require("./logic/spacedRepetition");
const error_1 = __importDefault(require("./middleware/error"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// const errorHandler = require('./middleware/error');
(0, db_1.connectDB)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/private', require('./routes/private'));
//ErrorHandler (Should be last piece of middleware)
app.use(error_1.default);
// post a deck
app.post('/api/decks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postedDeck = req.body.deck.cards;
        const cardsArr = postedDeck.map((card) => {
            const newCard = new Card_1.Card({
                frontField: card.frontField,
                backField: card.backField,
                answerType: card.answerType,
                lastReviewed: new Date(),
                nextReview: new Date(),
                totalReviews: 0,
                failedReviews: 0,
                dateCreated: new Date(),
            });
            return newCard;
        });
        const newDeck = new Deck_1.Deck({
            name: req.body.deck.name,
            description: req.body.deck.description,
            cards: cardsArr,
            dateCreated: new Date(),
            lastUpdated: new Date(),
        });
        yield newDeck.save();
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message, error });
    }
}));
//get deck by id
app.get('/api/decks/:deckid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deckid } = req.params;
        const deck = yield Deck_1.Deck.findById(deckid);
        return res.status(200).json(deck);
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
// update a deck with one or many new cards
app.put('/api/decks/addcards/:deckid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deckid } = req.params;
        const cards = req.body.newCards;
        const newCards = cards.map((card) => {
            return new Card_1.Card({
                frontField: card.frontField,
                backField: card.backField,
                extraField: card.extraField || '',
                imageURL: card.imageURL || '',
                tags: card.tags || [],
                answerType: card.answerType,
                lastReviewed: new Date(),
                nextReview: new Date(),
                totalReviews: 0,
                failedReviews: 0,
                dateCreated: new Date(),
            });
        });
        yield Deck_1.Deck.findByIdAndUpdate(deckid, {
            $addToSet: { cards: newCards },
            lastUpdated: Date.now(),
        });
        return res.status(200).json({ message: 'Deck updated successfully' });
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
// update a card new nextReview dates
app.put('/api/decks/updatecard/:deckid/:cardid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deckid, cardid } = req.params;
        const { success } = req.body;
        const card = yield Deck_1.Deck.findOne({ _id: deckid, 'cards._id': cardid });
        const newNextReview = (0, spacedRepetition_1.spacedRepetition)(card, success);
        return res.status(200).json({ message: 'Card updated successfully' });
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
// update a single card within a deck
app.put('/api/decks/updatecard/:deckid/:cardid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deckid, cardid } = req.params;
        const { frontField, backField, extraField, imageURL, tags, answerType } = req.body;
        yield Deck_1.Deck.findOneAndUpdate({ _id: deckid, 'cards._id': cardid }, {
            $set: {
                'cards.$.frontField': frontField,
                'cards.$.backField': backField,
                'cards.$.extraField': extraField,
                'cards.$.imageURL': imageURL,
                'cards.$.tags': tags,
                'cards.$.answerType': answerType,
            },
        }, { new: true });
        return res.status(200).json({ message: 'Card updated successfully' });
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
// delete a single card within a deck
app.delete('/api/decks/deletecard/:deckid/:cardid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deckid, cardid } = req.params;
        yield Deck_1.Deck.findByIdAndUpdate(deckid, {
            $pull: { cards: { _id: cardid } },
            lastUpdated: Date.now(),
        });
        return res.status(200).json({ message: 'Card deleted successfully' });
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
// update the deck details
app.put('/api/decks/updatedeck/:deckid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deckid } = req.params;
        const { name, description } = req.body;
        yield Deck_1.Deck.findByIdAndUpdate(deckid, {
            name,
            description,
            lastUpdated: Date.now(),
        });
        return res.status(200).json({ message: 'Deck updated successfully' });
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
// delete a deck by id
app.delete('/api/decks/deletedeck/:deckid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deckid } = req.params;
        yield Deck_1.Deck.findByIdAndDelete(deckid);
        return res.status(200).json({ message: 'Deck deleted successfully' });
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
// users
app.post('/api/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
app.get('/api/user/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
app.put('/api/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
app.delete('/api/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        console.log(error.message);
        express_1.response.status(500).send({ message: error.message });
    }
}));
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
process.on('unhandledRejection', (error, promise) => {
    console.log(`Logged Error: ${error}`);
    server.close(() => process.exit(1));
});
//# sourceMappingURL=index.js.map