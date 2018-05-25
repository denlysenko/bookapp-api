// Tokens
export const PUB_SUB = 'PUB_SUB';
export const SUBSCRIPTIONS_SERVER = 'SUBSCRIPTIONS_SERVER';

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export enum Bookmarks {
  MUSTREAD,
  WISHLIST,
  FAVOURITE,
}

export const USER_VALIDATION_ERRORS = {
  FIRST_NAME_REQUIRED_ERR: 'FIRST_NAME_REQUIRED_ERR',
  LAST_NAME_REQUIRED_ERR: 'LAST_NAME_REQUIRED_ERR',
  EMAIL_REQUIRED_ERR: 'EMAIL_REQUIRED_ERR',
  EMAIL_INVALID_ERR: 'EMAIL_INVALID_ERR',
  PASSWORD_LENGTH_ERR: 'PASSWORD_LENGTH_ERR',
  EMAIL_IN_USE_ERR: 'EMAIL_IN_USE_ERR',
  MISSING_CALLBACK_ERR: 'MISSING_CALLBACK_ERR',
  MISSING_PASSWORD_OR_SALT: 'MISSING_PASSWORD_OR_SALT',
  EMAIL_NOT_FOUND_ERR: 'EMAIL_NOT_FOUND_ERR',
  TOKEN_NOT_FOUND_ERR: 'TOKEN_NOT_FOUND_ERR',
};

export const BOOK_VALIDATION_ERRORS = {
  TITLE_REQUIRED_ERR: 'TITLE_REQUIRED_ERR',
  AUTHOR_REQUIRED_ERR: 'AUTHOR_REQUIRED_ERR',
};

export const BOOKMARK_ERRORS = {
  BOOKMARK_UNIQUE_ERR: 'BOOKMARK_UNIQUE_ERR',
  BOOKMARK_NOT_FOUND_ERR: 'BOOKMARK_NOT_FOUND_ERR',
};
