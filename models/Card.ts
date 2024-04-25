import { model, Schema, Document } from 'mongoose';

export interface ICard extends Document {
  frontField: string;
  backField: string;
  extraField?: string;
  imageURL?: string;
  tags?: string[];
  answerType: string;
  lastReviewed: Date;
  nextReview: Date;
  totalReviews: number;
  failedReviews: number;
  dateCreated: Date;
}

export const CardSchema: Schema = new Schema<ICard>({
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

export const Card = model<ICard>('Card', CardSchema);
