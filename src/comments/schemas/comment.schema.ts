import { Schema } from 'mongoose';

export const CommentSchema = new Schema({
  bookId: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  text: String,
});
