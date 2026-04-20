const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDnDfNfgmyYhyoLVve8iThB15yXgwI5MjU');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQLite Database Setup
const dbPath = path.join(__dirname, 'speaksmart.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize Database Tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT DEFAULT 'student',
    googleId TEXT,
    avatar TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Flashcards table
  db.run(`CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    example TEXT,
    difficulty TEXT DEFAULT 'beginner',
    category TEXT DEFAULT 'general'
  )`);

  // User Progress table
  db.run(`CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    quizScores TEXT,
    lessonsCompleted INTEGER DEFAULT 0,
    flashcardsLearned TEXT,
    totalStudyTime INTEGER DEFAULT 0,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id)
  )`);

  // Learning Videos table
  db.run(`CREATE TABLE IF NOT EXISTS learning_videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    videoUrl TEXT NOT NULL,
    thumbnail TEXT,
    category TEXT DEFAULT 'general',
    duration INTEGER,
    difficulty TEXT DEFAULT 'beginner'
  )`);

  // Insert sample flashcards
  const flashcards = [
    ['abundant', 'existing in large quantities; plentiful', 'The forest has abundant wildlife.', 'intermediate', 'vocabulary'],
    ['achieve', 'to successfully complete or accomplish', 'She worked hard to achieve her goals.', 'beginner', 'general'],
    ['analyze', 'to examine in detail', 'Scientists analyze data to find patterns.', 'intermediate', 'academic'],
    ['approach', 'to come near or closer to', 'The deadline is approaching quickly.', 'beginner', 'general'],
    ['benefit', 'an advantage or profit gained from something', 'Exercise has many health benefits.', 'beginner', 'general'],
    ['challenge', 'a difficult task or situation', 'Learning a new language is a challenge.', 'beginner', 'general'],
    ['communicate', 'to share or exchange information', 'We communicate through email daily.', 'beginner', 'general'],
    ['demonstrate', 'to show clearly by example', 'The teacher will demonstrate the experiment.', 'intermediate', 'academic'],
    ['develop', 'to grow or cause to grow gradually', 'Children develop language skills naturally.', 'beginner', 'general'],
    ['efficient', 'working in a well-organized way', 'This new system is more efficient.', 'intermediate', 'business'],
    ['environment', 'the surroundings or conditions', 'We must protect our environment.', 'beginner', 'general'],
    ['establish', 'to set up or create', 'They plan to establish a new company.', 'intermediate', 'business'],
    ['evaluate', 'to judge or assess the value of', 'Teachers evaluate student performance.', 'intermediate', 'academic'],
    ['experience', 'knowledge gained through practice', 'She has years of teaching experience.', 'beginner', 'general'],
    ['fundamental', 'forming a necessary base or core', 'Reading is fundamental to learning.', 'intermediate', 'academic'],
    ['generate', 'to produce or create', 'Solar panels generate electricity.', 'intermediate', 'science'],
    ['identify', 'to recognize or establish who someone is', 'Can you identify the problem?', 'beginner', 'general'],
    ['implement', 'to put a plan into effect', 'We will implement the new policy next month.', 'advanced', 'business'],
    ['influence', 'the capacity to affect someone or something', 'Parents have great influence on children.', 'intermediate', 'general'],
    ['maintain', 'to keep in good condition', 'Regular exercise helps maintain health.', 'beginner', 'general'],
    ['opportunity', 'a chance for advancement or progress', 'This job offers great opportunities.', 'beginner', 'general'],
    ['participate', 'to take part in an activity', 'Students participate in class discussions.', 'beginner', 'general'],
    ['perspective', 'a particular way of viewing things', 'Everyone has a different perspective.', 'intermediate', 'general'],
    ['potential', 'having the capacity to develop', 'She has great potential as a leader.', 'intermediate', 'general'],
    ['previous', 'existing or occurring before', 'In the previous lesson, we learned grammar.', 'beginner', 'general'],
    ['process', 'a series of actions to achieve a result', 'Learning is a gradual process.', 'beginner', 'general'],
    ['require', 'to need for a particular purpose', 'This job requires good communication skills.', 'beginner', 'general'],
    ['significant', 'important or notable', 'There was a significant improvement.', 'intermediate', 'academic'],
    ['strategy', 'a plan of action to achieve a goal', 'We need a new marketing strategy.', 'intermediate', 'business'],
    ['structure', 'the arrangement of parts in something', 'The essay has a clear structure.', 'beginner', 'academic'],
    ['technique', 'a way of carrying out an activity', 'She uses effective study techniques.', 'intermediate', 'general'],
    ['technology', 'the application of scientific knowledge', 'Technology changes rapidly.', 'beginner', 'general'],
    ['traditional', 'existing in or as part of a tradition', 'Traditional methods are still useful.', 'intermediate', 'general'],
    ['understand', 'to perceive the meaning of', 'Do you understand the instructions?', 'beginner', 'general'],
    ['variety', 'a number of different types', 'The menu offers a variety of dishes.', 'beginner', 'general'],
    
    // Additional vocabulary words
    ['beautiful', 'pleasing to the senses or mind', 'The sunset was beautiful tonight.', 'beginner', 'vocabulary'],
    ['magnificent', 'impressively beautiful or elaborate', 'The palace was magnificent.', 'intermediate', 'vocabulary'],
    ['serendipity', 'pleasant surprise or fortunate accident', 'Meeting you was pure serendipity.', 'advanced', 'vocabulary'],
    ['collaborate', 'work jointly on an activity', 'We need to collaborate on this project.', 'intermediate', 'business'],
    ['negotiate', 'discuss to reach an agreement', 'They will negotiate the contract terms.', 'intermediate', 'business'],
    ['entrepreneur', 'person who starts a business', 'She is a successful entrepreneur.', 'advanced', 'business'],
    ['innovative', 'featuring new methods or ideas', 'The company has an innovative approach.', 'intermediate', 'business'],
    ['resilient', 'able to recover quickly from difficulties', 'Children are naturally resilient.', 'intermediate', 'vocabulary'],
    ['perseverance', 'persistence in doing something', 'Success requires perseverance.', 'advanced', 'vocabulary'],
    ['eloquent', 'fluent and persuasive in speaking', 'She gave an eloquent speech.', 'advanced', 'vocabulary'],
    ['articulate', 'express thoughts clearly', 'He can articulate complex ideas well.', 'intermediate', 'vocabulary'],
    ['comprehensive', 'complete and including everything', 'We need a comprehensive plan.', 'intermediate', 'academic'],
    ['meticulous', 'showing great attention to detail', 'Her work is always meticulous.', 'advanced', 'vocabulary'],
    ['diligent', 'having or showing care in work', 'He is a diligent student.', 'intermediate', 'vocabulary'],
    ['conscientious', 'wishing to do right thing', 'She is very conscientious about her duties.', 'advanced', 'vocabulary'],
    ['ambitious', 'having strong desire for success', 'He has ambitious career goals.', 'intermediate', 'vocabulary'],
    ['optimistic', 'hopeful and confident about future', 'She remains optimistic despite challenges.', 'intermediate', 'vocabulary'],
    ['pessimistic', 'tending to see worst aspect', 'Don\'t be so pessimistic about the outcome.', 'intermediate', 'vocabulary'],
    ['enthusiastic', 'showing intense enjoyment', 'The students were enthusiastic about learning.', 'intermediate', 'vocabulary'],
    ['sophisticated', 'having great knowledge or experience', 'She has sophisticated taste in art.', 'advanced', 'vocabulary'],
    ['genuine', 'truly what it is said to be', 'His concern for others is genuine.', 'intermediate', 'vocabulary'],
    ['authentic', 'of undisputed origin', 'This is an authentic Italian recipe.', 'intermediate', 'vocabulary'],
    ['versatile', 'able to adapt to many functions', 'She is a versatile performer.', 'intermediate', 'vocabulary'],
    ['competent', 'having necessary ability or knowledge', 'He is competent in multiple languages.', 'intermediate', 'vocabulary'],
    ['proficient', 'competent or skilled', 'She is proficient in computer programming.', 'intermediate', 'vocabulary'],
    ['exceptional', 'unusually good or outstanding', 'His performance was exceptional.', 'intermediate', 'vocabulary'],
    ['extraordinary', 'very unusual or remarkable', 'It was an extraordinary achievement.', 'intermediate', 'vocabulary'],
    ['remarkable', 'worthy of attention', 'She made remarkable progress.', 'intermediate', 'vocabulary'],
    ['outstanding', 'exceptionally good', 'His work is always outstanding.', 'intermediate', 'vocabulary'],
    ['excellent', 'extremely good', 'The food quality is excellent.', 'beginner', 'vocabulary'],
    ['superior', 'higher in rank or quality', 'This product has superior quality.', 'intermediate', 'vocabulary'],
    ['inferior', 'lower in rank or quality', 'This material is inferior to the original.', 'intermediate', 'vocabulary'],
    
    // Additional Essential Vocabulary
    ['adventure', 'an exciting or unusual experience', 'Their trip to the mountains was a great adventure.', 'beginner', 'vocabulary'],
    ['ancient', 'belonging to the very distant past', 'The ancient ruins tell stories of the past.', 'intermediate', 'vocabulary'],
    ['brilliant', 'exceptionally clever or talented', 'She came up with a brilliant solution.', 'intermediate', 'vocabulary'],
    ['curious', 'eager to know or learn something', 'Children are naturally curious about the world.', 'beginner', 'vocabulary'],
    ['delicious', 'having a pleasant taste', 'The homemade pizza was absolutely delicious.', 'beginner', 'vocabulary'],
    ['enormous', 'very large in size or quantity', 'The elephant was enormous compared to other animals.', 'intermediate', 'vocabulary'],
    ['fantastic', 'extraordinarily good or attractive', 'The concert was fantastic last night.', 'beginner', 'vocabulary'],
    ['generous', 'showing kindness by giving more than necessary', 'He was generous with his time and money.', 'intermediate', 'vocabulary'],
    ['hilarious', 'extremely amusing', 'The comedy show was absolutely hilarious.', 'intermediate', 'vocabulary'],
    ['incredible', 'impossible to believe; extraordinary', 'The view from the mountain was incredible.', 'intermediate', 'vocabulary'],
    ['joyful', 'feeling or expressing great happiness', 'The wedding was a joyful celebration.', 'beginner', 'vocabulary'],
    ['knowledge', 'facts and information acquired through experience', 'Education helps us gain knowledge and wisdom.', 'intermediate', 'academic'],
    ['luxurious', 'extremely comfortable and expensive', 'They stayed in a luxurious hotel during vacation.', 'advanced', 'vocabulary'],
    ['mysterious', 'difficult to understand or explain', 'The old castle had a mysterious atmosphere.', 'intermediate', 'vocabulary'],
    ['necessary', 'required to be done or present', 'It is necessary to study for the exam.', 'beginner', 'general'],
    ['obvious', 'easily perceived or understood', 'The answer to the question was obvious.', 'beginner', 'general'],
    ['peaceful', 'free from disturbance; tranquil', 'The garden was a peaceful place to relax.', 'beginner', 'vocabulary'],
    ['quality', 'the standard of something measured against other things', 'This restaurant is known for its high quality food.', 'beginner', 'general'],
    ['reliable', 'consistently good in quality or performance', 'She is a reliable friend who always helps.', 'intermediate', 'vocabulary'],
    ['successful', 'accomplishing an aim or purpose', 'The business became very successful over time.', 'intermediate', 'business'],
    ['tremendous', 'very great in amount or intensity', 'The team made a tremendous effort to win.', 'intermediate', 'vocabulary'],
    ['unique', 'being the only one of its kind', 'Each snowflake has a unique pattern.', 'intermediate', 'vocabulary'],
    ['valuable', 'worth a great deal of money or highly useful', 'Time is the most valuable resource we have.', 'intermediate', 'vocabulary'],
    ['wonderful', 'inspiring delight or admiration', 'We had a wonderful time at the beach.', 'beginner', 'vocabulary'],
    
    // Business & Professional Terms
    ['achievement', 'a thing done successfully with effort', 'Graduating from university was a great achievement.', 'intermediate', 'business'],
    ['budget', 'an estimate of income and expenditure', 'We need to create a budget for the project.', 'intermediate', 'business'],
    ['client', 'a person who uses professional services', 'The lawyer met with her client yesterday.', 'intermediate', 'business'],
    ['deadline', 'the latest time by which something should be completed', 'The project deadline is next Friday.', 'intermediate', 'business'],
    ['efficient', 'achieving maximum productivity with minimum effort', 'The new system is more efficient than the old one.', 'intermediate', 'business'],
    ['feedback', 'information about reactions to a product or performance', 'Customer feedback helps improve our services.', 'intermediate', 'business'],
    ['goal', 'the object of a person\'s ambition or effort', 'Her goal is to become a successful entrepreneur.', 'beginner', 'business'],
    ['investment', 'the action of investing money for profit', 'Education is the best investment for the future.', 'intermediate', 'business'],
    ['leadership', 'the action of leading a group of people', 'Good leadership is essential for team success.', 'advanced', 'business'],
    ['management', 'the process of dealing with or controlling things', 'Effective time management is crucial for productivity.', 'intermediate', 'business'],
    ['network', 'a group of interconnected people or things', 'Building a professional network is important for career growth.', 'intermediate', 'business'],
    ['opportunity', 'a set of circumstances that makes it possible to do something', 'This internship is a great opportunity to learn.', 'intermediate', 'business'],
    ['presentation', 'the action of showing something to an audience', 'She gave an excellent presentation to the board.', 'intermediate', 'business'],
    ['quality', 'the standard of something as measured against other things', 'We focus on delivering high-quality products.', 'intermediate', 'business'],
    ['responsibility', 'the state of being accountable for something', 'With great power comes great responsibility.', 'intermediate', 'business'],
    ['solution', 'a means of solving a problem', 'We need to find a creative solution to this challenge.', 'intermediate', 'business'],
    ['teamwork', 'the combined action of a group working together', 'Good teamwork leads to better results.', 'intermediate', 'business'],
    
    // Academic & Educational Terms
    ['analysis', 'detailed examination of elements or structure', 'The data analysis revealed interesting patterns.', 'advanced', 'academic'],
    ['concept', 'an abstract idea or general notion', 'The concept of gravity is fundamental in physics.', 'intermediate', 'academic'],
    ['definition', 'a statement of the exact meaning of a word', 'Please provide a clear definition of the term.', 'intermediate', 'academic'],
    ['evidence', 'the available body of facts indicating something is true', 'Scientists need evidence to support their theories.', 'intermediate', 'academic'],
    ['hypothesis', 'a supposition made as a starting point for investigation', 'The researcher tested her hypothesis through experiments.', 'advanced', 'academic'],
    ['interpretation', 'the action of explaining the meaning of something', 'Different people may have different interpretations of the poem.', 'advanced', 'academic'],
    ['knowledge', 'facts and information acquired by learning', 'Knowledge is power in today\'s information age.', 'intermediate', 'academic'],
    ['literature', 'written works regarded as having artistic merit', 'Shakespeare\'s works are classics of English literature.', 'intermediate', 'academic'],
    ['methodology', 'a system of methods used in a particular area of study', 'The research methodology was carefully designed.', 'advanced', 'academic'],
    ['observation', 'the action of watching something carefully', 'Scientific observation requires careful attention to detail.', 'intermediate', 'academic'],
    ['principle', 'a fundamental truth serving as the foundation for reasoning', 'The principle of equality is important in democracy.', 'intermediate', 'academic'],
    ['research', 'the systematic investigation into materials and sources', 'Medical research has led to many life-saving treatments.', 'intermediate', 'academic'],
    ['theory', 'a supposition intended to explain something', 'Einstein\'s theory of relativity changed our understanding of physics.', 'advanced', 'academic'],
    
    // Daily Life & Common Words
    ['breakfast', 'the first meal of the day', 'I usually have cereal for breakfast.', 'beginner', 'general'],
    ['comfortable', 'providing physical ease and relaxation', 'This chair is very comfortable to sit in.', 'beginner', 'general'],
    ['dangerous', 'able or likely to cause harm or injury', 'Driving too fast can be dangerous.', 'beginner', 'general'],
    ['exercise', 'activity requiring physical effort to sustain health', 'Regular exercise is important for good health.', 'beginner', 'general'],
    ['favorite', 'preferred before all others of the same kind', 'Pizza is my favorite food.', 'beginner', 'general'],
    ['grocery', 'items of food sold in a grocery store', 'I need to buy groceries for dinner tonight.', 'beginner', 'general'],
    ['healthy', 'in good physical or mental condition', 'Eating vegetables helps you stay healthy.', 'beginner', 'general'],
    ['important', 'of great significance or value', 'It\'s important to arrive on time for the meeting.', 'beginner', 'general'],
    ['journey', 'an act of traveling from one place to another', 'The journey to the airport took two hours.', 'beginner', 'general'],
    ['kitchen', 'a room where food is prepared and cooked', 'She is cooking dinner in the kitchen.', 'beginner', 'general'],
    ['library', 'a building containing books for people to read or borrow', 'Students often study at the library.', 'beginner', 'general'],
    ['medicine', 'the science of diagnosing and treating disease', 'Take this medicine twice a day after meals.', 'beginner', 'general'],
    ['neighbor', 'a person living next door or very near', 'Our neighbor is very friendly and helpful.', 'beginner', 'general'],
    ['opinion', 'a view or judgment formed about something', 'Everyone has the right to express their opinion.', 'beginner', 'general'],
    ['problem', 'a matter requiring a solution', 'We need to solve this problem quickly.', 'beginner', 'general'],
    ['question', 'a sentence worded to elicit information', 'Please raise your hand if you have a question.', 'beginner', 'general'],
    ['restaurant', 'a place where people pay to sit and eat meals', 'We went to a new Italian restaurant last night.', 'beginner', 'general'],
    ['shopping', 'the action of buying goods from stores', 'I enjoy shopping for clothes on weekends.', 'beginner', 'general'],
    ['telephone', 'a system for transmitting voices over a distance', 'Please answer the telephone when it rings.', 'beginner', 'general'],
    ['vacation', 'an extended period of leisure and recreation', 'We\'re planning a vacation to Europe next summer.', 'beginner', 'general'],
    ['weather', 'the state of the atmosphere at a particular time', 'The weather forecast says it will rain tomorrow.', 'beginner', 'general']
  ];

  const stmt = db.prepare('INSERT OR REPLACE INTO flashcards (word, meaning, example, difficulty, category) VALUES (?, ?, ?, ?, ?);');
  flashcards.forEach(card => stmt.run(card));
  stmt.finalize();

  // Insert sample learning videos
  const videos = [
    ['English Grammar Basics', 'Learn fundamental English grammar rules', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'grammar', 600, 'beginner'],
    ['Vocabulary Building Techniques', 'Effective methods to expand your vocabulary', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'vocabulary', 900, 'intermediate'],
    ['Pronunciation Practice', 'Master English pronunciation with these exercises', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'pronunciation', 720, 'beginner'],
    ['Business English Essentials', 'Professional English for workplace communication', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'business', 1200, 'advanced'],
    ['Conversation Skills', 'Improve your English conversation abilities', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'speaking', 800, 'intermediate']
  ];

  const videoStmt = db.prepare('INSERT OR REPLACE INTO learning_videos (title, description, videoUrl, thumbnail, category, duration, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?);');
  videos.forEach(video => videoStmt.run(video));
  videoStmt.finalize();
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ message: 'Server error' });
        }
        
        const token = jwt.sign(
          { id: this.lastID, email, role },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        
        // Initialize user progress
        db.run(
          'INSERT INTO user_progress (userId, quizScores, flashcardsLearned) VALUES (?, ?, ?)',
          [this.lastID, '[]', '[]']
        );
        
        res.status(201).json({
          token,
          user: { id: this.lastID, name, email, role }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });
});

// Flashcards Routes
app.get('/api/flashcards', authenticateToken, (req, res) => {
  console.log('Fetching flashcards...');
  db.all('SELECT * FROM flashcards ORDER BY difficulty, word', (err, flashcards) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    console.log(`Found ${flashcards.length} flashcards`);
    res.json(flashcards);
  });
});

app.post('/api/flashcards/learned', authenticateToken, (req, res) => {
  const { flashcardId } = req.body;
  
  db.get('SELECT flashcardsLearned FROM user_progress WHERE userId = ?', [req.user.id], (err, progress) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    
    let learnedCards = progress ? JSON.parse(progress.flashcardsLearned || '[]') : [];
    if (!learnedCards.includes(flashcardId)) {
      learnedCards.push(flashcardId);
    }
    
    db.run(
      'UPDATE user_progress SET flashcardsLearned = ?, lastUpdated = CURRENT_TIMESTAMP WHERE userId = ?',
      [JSON.stringify(learnedCards), req.user.id],
      (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ message: 'Flashcard marked as learned' });
      }
    );
  });
});

// Progress Routes
app.get('/api/progress', authenticateToken, (req, res) => {
  console.log(`Fetching progress for user ${req.user.id}`);
  db.get('SELECT * FROM user_progress WHERE userId = ?', [req.user.id], (err, progress) => {
    if (err) {
      console.error('Progress fetch error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!progress) {
      console.log('Creating initial progress record');
      db.run(
        'INSERT INTO user_progress (userId, quizScores, flashcardsLearned) VALUES (?, ?, ?)',
        [req.user.id, '[]', '[]'],
        function(err) {
          if (err) {
            console.error('Progress creation error:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          res.json({
            quizScores: [],
            lessonsCompleted: 0,
            flashcardsLearned: [],
            totalStudyTime: 0
          });
        }
      );
    } else {
      console.log('Found existing progress record');
      res.json({
        quizScores: JSON.parse(progress.quizScores || '[]'),
        lessonsCompleted: progress.lessonsCompleted,
        flashcardsLearned: JSON.parse(progress.flashcardsLearned || '[]'),
        totalStudyTime: progress.totalStudyTime
      });
    }
  });
});

app.post('/api/progress/quiz', authenticateToken, (req, res) => {
  const { score, totalQuestions, quizTitle, timeSpent } = req.body;
  console.log(`Saving quiz score for user ${req.user.id}: ${score}% on "${quizTitle}"`);
  
  db.get('SELECT * FROM user_progress WHERE userId = ?', [req.user.id], (err, progress) => {
    if (err) {
      console.error('Error fetching progress:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    let scores = progress ? JSON.parse(progress.quizScores || '[]') : [];
    const newScore = { 
      score, 
      totalQuestions, 
      quizTitle: quizTitle || 'Quiz',
      timeSpent: timeSpent || 0,
      date: new Date().toISOString() 
    };
    scores.push(newScore);
    
    if (!progress) {
      // Create new progress record
      db.run(
        'INSERT INTO user_progress (userId, quizScores, flashcardsLearned, lessonsCompleted, totalStudyTime) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, JSON.stringify(scores), '[]', 0, timeSpent || 0],
        (err) => {
          if (err) {
            console.error('Error creating progress:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          console.log('Created new progress record with quiz score');
          res.json({ message: 'Quiz score saved' });
        }
      );
    } else {
      // Update existing progress
      const newTotalTime = (progress.totalStudyTime || 0) + (timeSpent || 0);
      db.run(
        'UPDATE user_progress SET quizScores = ?, totalStudyTime = ?, lastUpdated = CURRENT_TIMESTAMP WHERE userId = ?',
        [JSON.stringify(scores), newTotalTime, req.user.id],
        (err) => {
          if (err) {
            console.error('Error updating progress:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          console.log('Updated progress with new quiz score');
          res.json({ message: 'Quiz score updated' });
        }
      );
    }
  });
});

// Learning Videos Routes
app.get('/api/videos', authenticateToken, (req, res) => {
  db.all('SELECT * FROM learning_videos ORDER BY difficulty, title', (err, videos) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(videos);
  });
});

// Simple fallback responses
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm here to help you learn English. What would you like to practice today?";
  } else if (lowerMessage.includes('grammar')) {
    return "Grammar is important for clear communication! What specific grammar topic would you like to learn about?";
  } else if (lowerMessage.includes('vocabulary')) {
    return "Building vocabulary is key to fluency! I can help explain words and their usage. What words interest you?";
  } else {
    return "That's interesting! Keep practicing your English - every conversation helps you improve. What else would you like to discuss?";
  }
};

// Chatbot Route (no auth required for demo)
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Chatbot request:', message);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are an English learning assistant. Help users improve their English skills. Keep responses short and helpful. User message: "${message}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Chatbot response:', text);
    res.json({ response: text });
  } catch (error) {
    console.error('Chatbot error:', error);
    // Use fallback response if AI fails
    const fallbackResponse = getFallbackResponse(req.body.message || '');
    res.json({ response: fallbackResponse });
  }
});

// Student Dashboard Route
app.get('/api/student/dashboard', authenticateToken, (req, res) => {
  db.get('SELECT * FROM user_progress WHERE userId = ?', [req.user.id], (err, progress) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    
    const stats = {
      totalProgress: 0,
      completedModules: progress ? progress.lessonsCompleted : 0,
      quizScores: progress ? JSON.parse(progress.quizScores || '[]') : [],
      flashcardsLearned: progress ? JSON.parse(progress.flashcardsLearned || '[]').length : 0,
      streakDays: 7 // Mock data
    };
    
    // Calculate total progress
    const totalItems = 100; // Mock total
    const completed = stats.completedModules + stats.flashcardsLearned + stats.quizScores.length;
    stats.totalProgress = Math.min(Math.round((completed / totalItems) * 100), 100);
    
    res.json({
      stats,
      recentActivity: [
        { type: 'quiz', description: 'Completed Grammar Quiz', date: new Date().toISOString() },
        { type: 'flashcard', description: 'Learned 5 new words', date: new Date().toISOString() }
      ]
    });
  });
});

// Test database connection
db.get('SELECT COUNT(*) as count FROM flashcards', (err, row) => {
  if (err) {
    console.error('❌ Database test failed:', err.message);
  } else {
    console.log(`📚 Database ready: ${row.count} flashcards loaded`);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Database: SQLite (speaksmart.db)`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});