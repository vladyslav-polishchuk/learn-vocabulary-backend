import mongoose from 'mongoose';

export default async function getDB(): Promise<any> {
  await mongoose.connect(
    'mongodb+srv://learn-vocabulary-backend-demo:password_password@cluster0.gglsz.mongodb.net/bookabulary?retryWrites=true&w=majority'
  );

  const wordSchema = new mongoose.Schema({
    value: { type: String, unique: true, required: true, dropDups: true },
    count: Number,
  });
  const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, dropDups: true },
    password: String,
    token: String,
    learnedWords: [String],
  });
  const bookSchema = new mongoose.Schema({
    hash: { type: String, unique: true, required: true, dropDups: true },
    name: String,
    words: [{ value: String, count: Number }],
  });

  const Word = mongoose.model('Word', wordSchema);
  const User = mongoose.model('User', userSchema);
  const Book = mongoose.model('Book', bookSchema);

  return { Word, User, Book };
}
