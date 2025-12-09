import mongoose from "mongoose";

const wordList = [
  "Coconut","Red","House","Blue","Green","Sunny","River","Mountain",
  "Happy","Tree","Orange","Cloud","Moon","Star","Flower","Golden",
  "Silver","Tiger","Lion","Ocean"
];

// Generate unique name
function generateUniqueName() {
  const words = [];
  for (let i = 0; i < 3; i++) {
    words.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return words.join(" ");
}

const gameSchema = new mongoose.Schema({
  title: { type: String, unique: true, default: generateUniqueName },
  difficulty: { type: String, enum: ["EASY", "NORMAL"], required: true },
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  completionCount: { type: Number, default: 0 },
  board: { type: Array, default: [] },
  solutionBoard: { type: Array, default: [] },
  author: { type: String, default: "Anonymous" }
});

export default mongoose.model("Game", gameSchema);
