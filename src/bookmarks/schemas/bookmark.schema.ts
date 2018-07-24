import { Schema, set } from 'mongoose';

import { BOOKMARKS } from '../../constants';

set('debug', true);

export const BookmarkSchema = new Schema({
  bookId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: [BOOKMARKS.MUSTREAD, BOOKMARKS.WISHLIST, BOOKMARKS.FAVOURITE],
  },
});
