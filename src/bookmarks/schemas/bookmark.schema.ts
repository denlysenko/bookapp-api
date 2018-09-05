import { Schema } from 'mongoose';

import { BOOKMARKS } from '../../constants';

export const BookmarkSchema = new Schema({
  bookId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: [BOOKMARKS.MUSTREAD, BOOKMARKS.WISHLIST, BOOKMARKS.FAVOURITE],
  },
});
