import mongoose from 'mongoose';
import Game from '../backend/api/db/schema/gameSchema.js';

const MONGODB_URL = "mongodb+srv://neu:banana1234@neuwebdev.avfbwtp.mongodb.net/sudoku";

async function run() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');

    const res = await Game.updateMany(
      { completed: true, $or: [ { completionCount: { $exists: false } }, { completionCount: 0 } ] },
      { $set: { completionCount: 1 } }
    );

    console.log('Update result:', res);
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();
