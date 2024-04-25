import { ICard, CardSchema } from './Card';
import { Document, Schema, model } from 'mongoose';

export interface IDeck extends Document {
  name: string;
  description: string;
  cards: ICard[];
  dateCreated: Date;
  lastUpdated: Date;
}

export const DeckSchema: Schema = new Schema<IDeck>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cards: {
    type: [CardSchema],
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

export const Deck = model<IDeck>('Deck', DeckSchema);
