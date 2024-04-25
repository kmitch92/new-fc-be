require('dotenv').config({ path: './config.env' });

import express, { response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Card } from './models/Card';
import { Deck } from './models/Deck';

const app = express();
const PORT = process.env.PORT || 5000;
const errorHandler = require('./middleware/error');

connectDB();

app.use(express.json());
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/private', require('./routes/private'));

//ErrorHandler (Should be last piece of middleware)
app.use(errorHandler);

// post a deck
app.post('/api/decks', async (req, res) => {
  try {
    const postedDeck = req.body.deck.cards;
    const cardsArr = postedDeck.map((card) => {
      const newCard = new Card({
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
    const newDeck = new Deck({
      name: req.body.deck.name,
      description: req.body.deck.description,
      cards: cardsArr,
      dateCreated: new Date(),
      lastUpdated: new Date(),
    });
    await newDeck.save();
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message, error });
  }
});
//get deck by id
app.get('/api/decks/:deckid', async (req, res) => {
  try {
    const { deckid } = req.params;
    const deck = await Deck.findById(deckid);
    return res.status(200).json(deck);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
// update a deck with one or many cards
app.put('/api/decks/:deckid', async (req, res) => {
  try {
    const { deckid } = req.params;
    const newCards = req.body.newCards;
    await Deck.findByIdAndUpdate(deckid, { $addToSet: { cards: newCards } });
    return res.status(200).json({ message: 'Deck updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
// delete a deck by id
app.delete('/api/decks/:deckid', async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
// users
app.post('/api/user', async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
app.get('/api/user/:email', async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
app.put('/api/user/:id', async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
app.delete('/api/user/:id', async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
process.on('unhandledRejection', (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});
