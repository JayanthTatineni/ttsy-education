import type { LessonDetail, TopicGame } from "@/types/domain";

const GAME_LIBRARY: Record<string, TopicGame> = {
  "addition-within-10": {
    title: "Target Total",
    subtitle: "Hit the sum before the timer in your head runs out.",
    goal: "Pick the right sum on each round.",
    rounds: [
      { prompt: "4 + 3 = ?", options: ["6", "7", "8", "9"], correctAnswer: "7", celebration: "You hit the target total." },
      { prompt: "2 + 6 = ?", options: ["8", "7", "6", "9"], correctAnswer: "8", celebration: "That total was spot on." },
      { prompt: "5 + 1 = ?", options: ["5", "6", "7", "8"], correctAnswer: "6", celebration: "Quick math win." },
    ],
  },
  "subtraction-within-10": {
    title: "Take Away Trail",
    subtitle: "Keep the trail moving by choosing the amount left.",
    goal: "Find the answer after taking some away.",
    rounds: [
      { prompt: "9 - 3 = ?", options: ["5", "6", "7", "8"], correctAnswer: "6", celebration: "Trail clear." },
      { prompt: "8 - 5 = ?", options: ["2", "3", "4", "5"], correctAnswer: "3", celebration: "Nice subtraction step." },
      { prompt: "6 - 2 = ?", options: ["3", "4", "5", "6"], correctAnswer: "4", celebration: "You kept the pace going." },
    ],
  },
  "intro-to-multiplication": {
    title: "Array Builder",
    subtitle: "Read the array and pick the matching product.",
    goal: "Turn equal groups into multiplication facts.",
    rounds: [
      { prompt: "3 rows of 4 = ?", options: ["7", "10", "12", "16"], correctAnswer: "12", celebration: "Array complete." },
      { prompt: "2 groups of 6 = ?", options: ["8", "10", "12", "14"], correctAnswer: "12", celebration: "Groups matched perfectly." },
      { prompt: "5 groups of 3 = ?", options: ["10", "12", "15", "18"], correctAnswer: "15", celebration: "That product lands." },
    ],
  },
  "division-as-equal-groups": {
    title: "Share It Out",
    subtitle: "Split objects into equal groups and choose the amount in each group.",
    goal: "Use division to share fairly.",
    rounds: [
      { prompt: "12 shared by 3 = ?", options: ["3", "4", "5", "6"], correctAnswer: "4", celebration: "Fair share found." },
      { prompt: "20 shared by 5 = ?", options: ["3", "4", "5", "6"], correctAnswer: "4", celebration: "That group size fits." },
      { prompt: "15 shared by 5 = ?", options: ["2", "3", "4", "5"], correctAnswer: "3", celebration: "Even groups for the win." },
    ],
  },
  "equivalent-fractions": {
    title: "Fraction Match",
    subtitle: "Spot the fraction that names the same amount.",
    goal: "Match equivalent fractions fast.",
    rounds: [
      { prompt: "Which matches 1/2?", options: ["1/4", "2/4", "3/4", "5/6"], correctAnswer: "2/4", celebration: "Those fractions match." },
      { prompt: "Which matches 3/4?", options: ["2/8", "4/6", "6/8", "5/12"], correctAnswer: "6/8", celebration: "Equivalent and elegant." },
      { prompt: "1/2 = __/8", options: ["2", "3", "4", "5"], correctAnswer: "4", celebration: "Number line nailed." },
    ],
  },
  "states-of-matter": {
    title: "Matter Sort",
    subtitle: "Pick the property or example that matches the state of matter.",
    goal: "Sort solids, liquids, and gases.",
    rounds: [
      { prompt: "Which sample is a gas?", options: ["air", "rock", "ice cube", "juice"], correctAnswer: "air", celebration: "That sample spreads out like a gas." },
      { prompt: "Which state keeps its own shape?", options: ["solid", "liquid", "gas", "steam"], correctAnswer: "solid", celebration: "Shape held steady." },
      { prompt: "A liquid changes shape to fit its container. True or false?", options: ["true", "false"], correctAnswer: "true", celebration: "Container clue solved." },
    ],
  },
  "simple-forces": {
    title: "Force Lab",
    subtitle: "Choose the force idea that best matches the setup.",
    goal: "Identify pushes, pulls, and balanced motion.",
    rounds: [
      { prompt: "Which force slows a sliding book?", options: ["gravity", "friction", "sound", "light"], correctAnswer: "friction", celebration: "Friction found." },
      { prompt: "Equal pulls in opposite directions are...", options: ["balanced", "invisible", "louder", "magnetic"], correctAnswer: "balanced", celebration: "Balanced forces lock in." },
      { prompt: "Gravity pulls objects toward...", options: ["Earth", "the Moon only", "water only", "nothing"], correctAnswer: "Earth", celebration: "Gravity check complete." },
    ],
  },
};

export function getTopicGameForLesson(lesson: LessonDetail): TopicGame | null {
  return GAME_LIBRARY[lesson.slug] ?? null;
}
