import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  value: { type: String, unique: true, required: true, dropDups: true },
  count: Number,
});
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, dropDups: true },
  password: String,
  token: String,
  language: String,
  learnedWords: [String],
});
const bookSchema = new mongoose.Schema({
  hash: { type: String, unique: true, required: true, dropDups: true },
  name: String,
  views: Number,
  words: [{ value: String, count: Number }],
});

export const Word = mongoose.model('Word', wordSchema);
export const User = mongoose.model('User', userSchema);
export const Book = mongoose.model('Book', bookSchema);
