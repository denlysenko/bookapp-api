import { Schema } from 'mongoose';

export const LogSchema = new Schema({
  action: String,
  userId: Schema.Types.ObjectId,
  createdAt: Date,
  bookId: Schema.Types.ObjectId,
});
