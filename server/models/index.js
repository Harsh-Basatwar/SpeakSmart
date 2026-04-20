const { promisePool } = require('../config/database');

// ═══════════════════════════════════════════════════════════════════════════
// USER MODEL
// ═══════════════════════════════════════════════════════════════════════════

const User = {
  async findAll(role = null) {
    const query = role 
      ? 'SELECT id, name, email, role, created_at, last_active FROM users WHERE role = ?'
      : 'SELECT id, name, email, role, created_at, last_active FROM users';
    const [rows] = await promisePool.execute(query, role ? [role] : []);
    return rows;
  },

  async findById(id) {
    const [rows] = await promisePool.execute(
      'SELECT id, name, email, role, created_at, last_active FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async create(userData) {
    try {
      const { name, email, password, role = 'student' } = userData;
      const [result] = await promisePool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role]
      );
      
      // Create progress record for students
      if (role === 'student') {
        await promisePool.execute(
          'INSERT INTO user_progress (user_id) VALUES (?)',
          [result.insertId]
        );
      }
      
      return { id: result.insertId, name, email, role };
    } catch (error) {
      console.error('User.create error:', error.message);
      throw error;
    }
  },

  async update(id, updates) {
    const fields = [];
    const values = [];
    
    if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.email) { fields.push('email = ?'); values.push(updates.email); }
    if (updates.password) { fields.push('password = ?'); values.push(updates.password); }
    if (updates.role) { fields.push('role = ?'); values.push(updates.role); }
    
    values.push(id);
    
    await promisePool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  },

  async delete(id) {
    await promisePool.execute('DELETE FROM users WHERE id = ?', [id]);
  },

  async updateLastActive(id) {
    await promisePool.execute(
      'UPDATE users SET last_active = NOW() WHERE id = ?',
      [id]
    );
  },

  async getWithProgress(id) {
    const [rows] = await promisePool.execute(
      `SELECT u.*, 
              COALESCE(up.total_progress, 0) as total_progress,
              COALESCE(up.completed_modules, 0) as completed_modules,
              COALESCE(up.flashcards_learned, 0) as flashcards_learned,
              COALESCE(up.streak_days, 0) as streak_days
       FROM users u
       LEFT JOIN user_progress up ON u.id = up.user_id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS MODEL
// ═══════════════════════════════════════════════════════════════════════════

const Progress = {
  async get(userId) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM user_progress WHERE user_id = ?',
      [userId]
    );
    return rows[0] || { total_progress: 0, completed_modules: 0, flashcards_learned: 0, streak_days: 0 };
  },

  async update(userId, progressData) {
    const { total_progress, completed_modules, flashcards_learned, streak_days } = progressData;
    await promisePool.execute(
      `INSERT INTO user_progress (user_id, total_progress, completed_modules, flashcards_learned, streak_days)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       total_progress = VALUES(total_progress),
       completed_modules = VALUES(completed_modules),
       flashcards_learned = VALUES(flashcards_learned),
       streak_days = VALUES(streak_days)`,
      [userId, total_progress || 0, completed_modules || 0, flashcards_learned || 0, streak_days || 0]
    );
  },

  async reset(userId) {
    await promisePool.execute(
      'UPDATE user_progress SET total_progress = 0, completed_modules = 0, flashcards_learned = 0, streak_days = 0 WHERE user_id = ?',
      [userId]
    );
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ MODEL
// ═══════════════════════════════════════════════════════════════════════════

const Quiz = {
  async findAll() {
    const [quizzes] = await promisePool.execute(
      'SELECT q.*, u.name as creator_name FROM quizzes q LEFT JOIN users u ON q.created_by = u.id ORDER BY q.created_at DESC'
    );
    
    // Get questions for each quiz
    for (let quiz of quizzes) {
      const [questions] = await promisePool.execute(
        'SELECT id, question, type, options, correct_answer FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index',
        [quiz.id]
      );
      quiz.questions = questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }));
    }
    
    return quizzes;
  },

  async findById(id) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM quizzes WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const quiz = rows[0];
    const [questions] = await promisePool.execute(
      'SELECT id, question, type, options, correct_answer FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index',
      [id]
    );
    
    quiz.questions = questions.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));
    
    return quiz;
  },

  async create(quizData, createdBy) {
    const { title, description, difficulty, timeLimit, questions } = quizData;
    
    const [result] = await promisePool.execute(
      'INSERT INTO quizzes (title, description, difficulty, time_limit, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, description, difficulty || 'Beginner', timeLimit || 300, createdBy]
    );
    
    const quizId = result.insertId;
    
    // Insert questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await promisePool.execute(
        'INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer, order_index) VALUES (?, ?, ?, ?, ?, ?)',
        [quizId, q.question, q.type || 'multiple-choice', JSON.stringify(q.options), q.correctAnswer, i]
      );
    }
    
    return this.findById(quizId);
  },

  async update(id, quizData) {
    const { title, description, difficulty, timeLimit, questions } = quizData;
    
    await promisePool.execute(
      'UPDATE quizzes SET title = ?, description = ?, difficulty = ?, time_limit = ? WHERE id = ?',
      [title, description, difficulty, timeLimit, id]
    );
    
    // Delete old questions and insert new ones
    if (questions) {
      await promisePool.execute('DELETE FROM quiz_questions WHERE quiz_id = ?', [id]);
      
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await promisePool.execute(
          'INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer, order_index) VALUES (?, ?, ?, ?, ?, ?)',
          [id, q.question, q.type || 'multiple-choice', JSON.stringify(q.options), q.correctAnswer, i]
        );
      }
    }
    
    return this.findById(id);
  },

  async delete(id) {
    await promisePool.execute('DELETE FROM quizzes WHERE id = ?', [id]);
  },

  async recordAttempt(userId, quizId, score, totalQuestions, timeTaken) {
    await promisePool.execute(
      'INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, time_taken) VALUES (?, ?, ?, ?, ?)',
      [userId, quizId, score, totalQuestions, timeTaken]
    );
  },

  async getUserAttempts(userId) {
    const [rows] = await promisePool.execute(
      `SELECT qa.*, q.title as quiz_title 
       FROM quiz_attempts qa 
       JOIN quizzes q ON qa.quiz_id = q.id 
       WHERE qa.user_id = ? 
       ORDER BY qa.completed_at DESC`,
      [userId]
    );
    return rows;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CLASS MODEL
// ═══════════════════════════════════════════════════════════════════════════

const Class = {
  async findAll() {
    const [classes] = await promisePool.execute(
      `SELECT c.*, u.name as teacher_name 
       FROM classes c 
       LEFT JOIN users u ON c.teacher_id = u.id 
       ORDER BY c.created_at DESC`
    );
    
    // Get student IDs for each class
    for (let cls of classes) {
      const [students] = await promisePool.execute(
        'SELECT student_id FROM class_students WHERE class_id = ?',
        [cls.id]
      );
      cls.studentIds = students.map(s => s.student_id);
    }
    
    return classes;
  },

  async findById(id) {
    const [rows] = await promisePool.execute(
      `SELECT c.*, u.name as teacher_name 
       FROM classes c 
       LEFT JOIN users u ON c.teacher_id = u.id 
       WHERE c.id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const cls = rows[0];
    const [students] = await promisePool.execute(
      'SELECT student_id FROM class_students WHERE class_id = ?',
      [id]
    );
    cls.studentIds = students.map(s => s.student_id);
    
    return cls;
  },

  async create(classData) {
    const { name, level, teacherId } = classData;
    const [result] = await promisePool.execute(
      'INSERT INTO classes (name, level, teacher_id) VALUES (?, ?, ?)',
      [name, level || 'Beginner', teacherId || null]
    );
    return this.findById(result.insertId);
  },

  async update(id, classData) {
    const { name, level, teacherId } = classData;
    await promisePool.execute(
      'UPDATE classes SET name = ?, level = ?, teacher_id = ? WHERE id = ?',
      [name, level, teacherId || null, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    await promisePool.execute('DELETE FROM classes WHERE id = ?', [id]);
  },

  async assignStudent(classId, studentId) {
    await promisePool.execute(
      'INSERT IGNORE INTO class_students (class_id, student_id) VALUES (?, ?)',
      [classId, studentId]
    );
    return this.findById(classId);
  },

  async removeStudent(classId, studentId) {
    await promisePool.execute(
      'DELETE FROM class_students WHERE class_id = ? AND student_id = ?',
      [classId, studentId]
    );
    return this.findById(classId);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// FLASHCARD MODEL
// ═══════════════════════════════════════════════════════════════════════════

const Flashcard = {
  async findAll(level = null) {
    const query = level
      ? 'SELECT * FROM flashcards WHERE level = ? ORDER BY word'
      : 'SELECT * FROM flashcards ORDER BY word';
    const [rows] = await promisePool.execute(query, level ? [level] : []);
    return rows;
  },

  async findById(id) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM flashcards WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async create(flashcardData) {
    const { word, meaning, example, level, pronunciation } = flashcardData;
    const [result] = await promisePool.execute(
      'INSERT INTO flashcards (word, meaning, example, level, pronunciation) VALUES (?, ?, ?, ?, ?)',
      [word, meaning, example, level || 'beginner', pronunciation]
    );
    return this.findById(result.insertId);
  },

  async update(id, flashcardData) {
    const { word, meaning, example, level, pronunciation } = flashcardData;
    await promisePool.execute(
      'UPDATE flashcards SET word = ?, meaning = ?, example = ?, level = ?, pronunciation = ? WHERE id = ?',
      [word, meaning, example, level, pronunciation, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    await promisePool.execute('DELETE FROM flashcards WHERE id = ?', [id]);
  }
};

module.exports = {
  User,
  Progress,
  Quiz,
  Class,
  Flashcard
};
