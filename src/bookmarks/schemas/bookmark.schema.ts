import { Schema } from 'mongoose';

export const BookmarkSchema = new Schema({
  bookId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  type: Number,
});
