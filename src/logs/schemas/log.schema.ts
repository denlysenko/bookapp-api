import { Schema } from 'mongoose';

export const LogSchema = new Schema({
  action: String,
  userId: Schema.Types.ObjectId,
  createdAt: Date,
  book: {
    title: String,
    author: String,
  },
});
