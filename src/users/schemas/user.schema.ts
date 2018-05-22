import * as crypto from 'crypto';
import * as mongoose from 'mongoose';

/**
 * A Validation function for properties
 */
const validateProperty = property => {
  return !this.updated || property.length;
};

/**
 * A Validation function for password
 */
const validatePassword = password => {
  return password && password.length > 6;
};

export const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateProperty, 'Please, fill in your First Name'],
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateProperty, 'Please, fill in your Last Name'],
  },
  displayName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    validate: [validateProperty, 'Please fill in your Email'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    default: '',
    validate: [
      validatePassword,
      'Password should contain at least 6 characters',
    ],
  },
  salt: String,
  provider: String,
  avatarUrl: String,
  roles: {
    type: [{ type: String, enum: ['user', 'admin'] }],
    default: ['user'],
  },
  updatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reading: {
    epubUrl: {
      type: String,
      default: '',
    },
    bookmark: {
      type: String,
      default: '',
    },
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Validate email is not taken
UserSchema.path('email').validate((value, respond) => {
  return this.constructor
    .findOne({ email: value })
    .exec()
    .then(user => {
      if (user) {
        if (this.id === user.id) {
          return respond(true);
        }
        return respond(false);
      }
      return respond(true);
    })
    .catch(err => {
      throw err;
    });
}, 'The specified email address is already in use.');

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  // Handle new/update passwords
  if (!this.isModified('password')) {
    return next();
  }

  // Make salt with a callback
  this.makeSalt((saltErr, salt) => {
    if (saltErr) {
      return next(saltErr);
    }
    this.salt = salt;
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      return next();
    });
  });
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    const defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    } else {
      throw new Error('Missing Callback');
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto
        .pbkdf2Sync(
          password,
          salt,
          defaultIterations,
          defaultKeyLength,
          'sha512',
        )
        .toString('base64');
    }

    return crypto.pbkdf2(
      password,
      salt,
      defaultIterations,
      defaultKeyLength,
      'sha512',
      (err, key) => {
        if (err) {
          return callback(err);
        } else {
          return callback(null, key.toString('base64'));
        }
      },
    );
  },
};
