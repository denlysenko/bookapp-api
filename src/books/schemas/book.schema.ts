// tslint:disable:only-arrow-functions
import * as mongoose from 'mongoose';
import { slugify } from 'utils/slugify';

import { BOOK_VALIDATION_ERRORS } from '../../constants';

export const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: BOOK_VALIDATION_ERRORS.TITLE_REQUIRED_ERR,
    trim: true,
  },
  author: {
    type: String,
    required: BOOK_VALIDATION_ERRORS.AUTHOR_REQUIRED_ERR,
    trim: true,
  },
  coverUrl: String,
  epubUrl: String,
  description: String,
  slug: String,
  total_rating: {
    type: Number,
    default: 0,
  },
  total_rates: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// makes slug for book before saving
BookSchema.pre('save', function(next) {
  this.slug = slugify(this.title);
  next();
});

BookSchema.virtual('url').get(function() {
  return slugify(this.author) + '/' + this.slug;
});

// to access virtual property from Angular
BookSchema.set('toJSON', { virtuals: true });
