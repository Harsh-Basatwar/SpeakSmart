const fs = require('fs');
const path = require('path');

// Simple JSON-based database for demo purposes
// In production, use a proper database like MongoDB, PostgreSQL, etc.

const dbPath = path.join(__dirname, '../../database');
const usersFile = path.join(dbPath, 'users.json');
const quizzesFile = path.join(dbPath, 'quizzes.json');
const progressFile = path.join(dbPath, 'progress.json');
const flashcardsFile = path.join(dbPath, 'flashcards.json');
const classesFile = path.join(dbPath, 'classes.json');

// Ensure database directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Initialize files if they don't exist
const initializeFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// Initialize default data
initializeFile(usersFile, []);
initializeFile(classesFile, []);
initializeFile(quizzesFile, [
  {
    id: 1,
    title: 'Grammar Basics',
    description: 'Test your understanding of basic English grammar',
    difficulty: 'Beginner',
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: 'Which of the following is a correct sentence?',
        type: 'multiple-choice',
        options: [
          'She go to school every day.',
          'She goes to school every day.',
          'She going to school every day.',
          'She gone to school every day.'
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: 'Fill in the blank: "I _____ been waiting for an hour."',
        type: 'fill-blank',
        options: ['have', 'has', 'had', 'having'],
        correctAnswer: 0
      }
    ]
  }
]);
initializeFile(progressFile, {});
initializeFile(flashcardsFile, [
  { id: 1, word: 'abundant', meaning: 'existing in large quantities', example: 'The forest has abundant wildlife.', level: 'intermediate', learned: false },
  { id: 2, word: 'achieve', meaning: 'to successfully complete or accomplish', example: 'She worked hard to achieve her goals.', level: 'beginner', learned: false },
  { id: 3, word: 'analyze', meaning: 'to examine in detail', example: 'Scientists analyze data to find patterns.', level: 'intermediate', learned: false },
  { id: 4, word: 'approach', meaning: 'to come near or closer to', example: 'The deadline is approaching quickly.', level: 'beginner', learned: false },
  { id: 5, word: 'benefit', meaning: 'an advantage or profit gained', example: 'Exercise has many health benefits.', level: 'beginner', learned: false },
  { id: 6, word: 'challenge', meaning: 'a difficult task or situation', example: 'Learning a new language is a challenge.', level: 'beginner', learned: false },
  { id: 7, word: 'collaborate', meaning: 'to work together with others', example: 'Teams collaborate to solve problems.', level: 'intermediate', learned: false },
  { id: 8, word: 'comprehensive', meaning: 'complete and including everything', example: 'The report provides comprehensive analysis.', level: 'advanced', learned: false },
  { id: 9, word: 'consequence', meaning: 'a result or effect of an action', example: 'Every decision has consequences.', level: 'intermediate', learned: false },
  { id: 10, word: 'demonstrate', meaning: 'to show clearly by example', example: 'The teacher will demonstrate the experiment.', level: 'intermediate', learned: false },
  { id: 11, word: 'efficient', meaning: 'working in a well-organized way', example: 'This method is more efficient than the old one.', level: 'intermediate', learned: false },
  { id: 12, word: 'enhance', meaning: 'to improve or increase', example: 'Music can enhance your mood.', level: 'intermediate', learned: false },
  { id: 13, word: 'establish', meaning: 'to set up or create', example: 'They plan to establish a new business.', level: 'intermediate', learned: false },
  { id: 14, word: 'evaluate', meaning: 'to judge or assess the value of', example: 'Teachers evaluate student performance.', level: 'intermediate', learned: false },
  { id: 15, word: 'fundamental', meaning: 'basic and essential', example: 'Reading is a fundamental skill.', level: 'advanced', learned: false },
  { id: 16, word: 'generate', meaning: 'to produce or create', example: 'Solar panels generate electricity.', level: 'intermediate', learned: false },
  { id: 17, word: 'implement', meaning: 'to put a plan into action', example: 'The company will implement new policies.', level: 'advanced', learned: false },
  { id: 18, word: 'indicate', meaning: 'to point out or show', example: 'The signs indicate the right direction.', level: 'intermediate', learned: false },
  { id: 19, word: 'influence', meaning: 'to have an effect on', example: 'Parents influence their children\'s behavior.', level: 'intermediate', learned: false },
  { id: 20, word: 'maintain', meaning: 'to keep in good condition', example: 'Regular exercise helps maintain health.', level: 'beginner', learned: false },
  { id: 21, word: 'obvious', meaning: 'easily seen or understood', example: 'The answer was obvious to everyone.', level: 'beginner', learned: false },
  { id: 22, word: 'participate', meaning: 'to take part in', example: 'Students participate in class discussions.', level: 'intermediate', learned: false },
  { id: 23, word: 'perspective', meaning: 'a particular way of viewing things', example: 'Everyone has a different perspective.', level: 'advanced', learned: false },
  { id: 24, word: 'potential', meaning: 'having the capacity to develop', example: 'She has great potential as a leader.', level: 'intermediate', learned: false },
  { id: 25, word: 'previous', meaning: 'existing or occurring before', example: 'His previous job was in marketing.', level: 'beginner', learned: false },
  { id: 26, word: 'principle', meaning: 'a fundamental rule or belief', example: 'Honesty is an important principle.', level: 'intermediate', learned: false },
  { id: 27, word: 'process', meaning: 'a series of actions or steps', example: 'Learning is a continuous process.', level: 'beginner', learned: false },
  { id: 28, word: 'require', meaning: 'to need or demand', example: 'This job requires good communication skills.', level: 'beginner', learned: false },
  { id: 29, word: 'significant', meaning: 'important or notable', example: 'This discovery is very significant.', level: 'intermediate', learned: false },
  { id: 30, word: 'strategy', meaning: 'a plan of action', example: 'We need a new marketing strategy.', level: 'intermediate', learned: false },
  { id: 31, word: 'structure', meaning: 'the arrangement of parts', example: 'The building has a strong structure.', level: 'intermediate', learned: false },
  { id: 32, word: 'technique', meaning: 'a way of doing something', example: 'She learned a new painting technique.', level: 'intermediate', learned: false },
  { id: 33, word: 'theory', meaning: 'an idea or explanation', example: 'Einstein\'s theory changed physics.', level: 'advanced', learned: false },
  { id: 34, word: 'tradition', meaning: 'a custom passed down over time', example: 'Family traditions are important to us.', level: 'beginner', learned: false },
  { id: 35, word: 'unique', meaning: 'being the only one of its kind', example: 'Every snowflake is unique.', level: 'beginner', learned: false },
  { id: 36, word: 'variable', meaning: 'able to change or be changed', example: 'Weather conditions are variable.', level: 'advanced', learned: false },
  { id: 37, word: 'virtual', meaning: 'existing in computer simulation', example: 'Virtual reality is becoming popular.', level: 'intermediate', learned: false },
  { id: 38, word: 'wisdom', meaning: 'the quality of having experience and knowledge', example: 'Age often brings wisdom.', level: 'intermediate', learned: false },
  { id: 39, word: 'accomplish', meaning: 'to complete successfully', example: 'We accomplished our mission.', level: 'intermediate', learned: false },
  { id: 40, word: 'brilliant', meaning: 'exceptionally clever or talented', example: 'She came up with a brilliant solution.', level: 'intermediate', learned: false }
]);

// Load data
let users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
let quizzes = JSON.parse(fs.readFileSync(quizzesFile, 'utf8'));
let progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
let flashcards = JSON.parse(fs.readFileSync(flashcardsFile, 'utf8'));
let classes = JSON.parse(fs.readFileSync(classesFile, 'utf8'));

const saveClasses = () => {
  fs.writeFileSync(classesFile, JSON.stringify(classes, null, 2));
};

// Save functions
const saveUsers = () => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const saveQuizzes = () => {
  fs.writeFileSync(quizzesFile, JSON.stringify(quizzes, null, 2));
};

const saveProgress = () => {
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
};

const saveFlashcards = () => {
  fs.writeFileSync(flashcardsFile, JSON.stringify(flashcards, null, 2));
};

module.exports = {
  users,
  quizzes,
  progress,
  flashcards,
  classes,
  saveUsers,
  saveQuizzes,
  saveProgress,
  saveFlashcards,
  saveClasses
};