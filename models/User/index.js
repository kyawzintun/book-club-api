const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const { isPassword } = require('./validate');
const { hashPassword } = require('./middleware');
const { comparePassword } = require('./methods');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [{ validator: value => isEmail(value), msg: 'Invalid email.' }],
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    validate: [{ validator: isPassword, msg: 'Invalid password.' }],
  },
  address: {
    type: String,
    required: true
  },
}, { timestamps: true });

/**
 * Middleware
 */
userSchema.pre('save', hashPassword);

/**
 * Methods.
 */
userSchema.methods.comparePassword = comparePassword;

module.exports = mongoose.model('User', userSchema);
