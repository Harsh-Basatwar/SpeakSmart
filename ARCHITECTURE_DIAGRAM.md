# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React App)                              │
│                         http://localhost:3000                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  Login   │  │  Signup  │  │ Student  │  │ Teacher  │               │
│  │  Page    │  │  Page    │  │Dashboard │  │Dashboard │               │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘               │
│       │             │              │              │                      │
│       └─────────────┴──────────────┴──────────────┘                     │
│                            │                                             │
│                     ┌──────▼──────┐                                     │
│                     │  AuthContext │                                     │
│                     │  (JWT Token) │                                     │
│                     └──────┬──────┘                                     │
│                            │                                             │
│                     ┌──────▼──────┐                                     │
│                     │   api.js    │                                     │
│                     │   (Axios)   │                                     │
│                     └──────┬──────┘                                     │
└────────────────────────────┼────────────────────────────────────────────┘
                             │ HTTP/HTTPS
                             │ Authorization: Bearer <token>
┌────────────────────────────▼────────────────────────────────────────────┐
│                      SERVER (Express.js)                                 │
│                     http://localhost:5000                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Middleware Layer                            │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  • helmet (Security headers)                                     │   │
│  │  • cors (Cross-origin)                                           │   │
│  │  • express.json (Body parser)                                    │   │
│  │  • authenticateToken (JWT verification)                          │   │
│  │  • requireRole (Authorization)                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                             │                                             │
│  ┌──────────────────────────▼──────────────────────────────────────┐   │
│  │                      API Routes                                   │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  /api/auth/*      → routes/auth.js                               │   │
│  │  /api/admin/*     → routes/admin.js     (requireRole: admin)     │   │
│  │  /api/teacher/*   → routes/teacher.js   (requireRole: teacher)   │   │
│  │  /api/student/*   → routes/student.js   (requireRole: student)   │   │
│  │  /api/quizzes/*   → routes/quiz.js      (authenticated)          │   │
│  │  /api/flashcards/*→ routes/flashcards.js (authenticated)         │   │
│  └──────────────────────────┬───────────────────────────────────────┘   │
│                             │                                             │
│  ┌──────────────────────────▼──────────────────────────────────────┐   │
│  │                      Models Layer                                 │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  models/index.js                                                  │   │
│  │  ├─ User.findAll()                                                │   │
│  │  ├─ User.create()                                                 │   │
│  │  ├─ Quiz.findById()                                               │   │
│  │  ├─ Progress.update()                                             │   │
│  │  ├─ Class.assignStudent()                                         │   │
│  │  └─ Flashcard.findAll()                                           │   │
│  └──────────────────────────┬───────────────────────────────────────┘   │
│                             │                                             │
│  ┌──────────────────────────▼──────────────────────────────────────┐   │
│  │                  Database Connection Pool                         │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  config/database.js                                               │   │
│  │  • mysql2.createPool()                                            │   │
│  │  • connectionLimit: 10                                            │   │
│  │  • promisePool.execute() (prepared statements)                    │   │
│  └──────────────────────────┬───────────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────────────┘
                             │ MySQL Protocol
                             │ Port 3306
┌────────────────────────────▼────────────────────────────────────────────┐
│                      MySQL Database Server                               │
│                         localhost:3306                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Database: english_learning_platform                                     │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         Tables                                    │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                   │   │
│  │  users                    quiz_attempts                           │   │
│  │  ├─ id (PK)               ├─ id (PK)                             │   │
│  │  ├─ name                  ├─ user_id (FK)                        │   │
│  │  ├─ email (UNIQUE)        ├─ quiz_id (FK)                        │   │
│  │  ├─ password              ├─ score                               │   │
│  │  ├─ role (ENUM)           └─ completed_at                        │   │
│  │  └─ created_at                                                    │   │
│  │                                                                   │   │
│  │  user_progress            flashcards                              │   │
│  │  ├─ id (PK)               ├─ id (PK)                             │   │
│  │  ├─ user_id (FK, UNIQUE)  ├─ word                                │   │
│  │  ├─ total_progress        ├─ meaning                             │   │
│  │  ├─ completed_modules     ├─ example                             │   │
│  │  └─ streak_days           └─ level (ENUM)                        │   │
│  │                                                                   │   │
│  │  classes                  quizzes                                 │   │
│  │  ├─ id (PK)               ├─ id (PK)                             │   │
│  │  ├─ name                  ├─ title                               │   │
│  │  ├─ level (ENUM)          ├─ description                         │   │
│  │  └─ teacher_id (FK)       ├─ difficulty (ENUM)                   │   │
│  │                           ├─ time_limit                           │   │
│  │  class_students           └─ created_by (FK)                     │   │
│  │  ├─ id (PK)                                                       │   │
│  │  ├─ class_id (FK)         quiz_questions                          │   │
│  │  └─ student_id (FK)       ├─ id (PK)                             │   │
│  │                           ├─ quiz_id (FK)                         │   │
│  │                           ├─ question                             │   │
│  │                           ├─ options (JSON)                       │   │
│  │                           └─ correct_answer                       │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Indexes (Performance)                        │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  • idx_email ON users(email)                                     │   │
│  │  • idx_role ON users(role)                                       │   │
│  │  • idx_user_id ON user_progress(user_id)                         │   │
│  │  • idx_quiz_id ON quiz_questions(quiz_id)                        │   │
│  │  • idx_level ON flashcards(level)                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  Foreign Key Constraints                          │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  • user_progress.user_id → users.id (CASCADE)                    │   │
│  │  • classes.teacher_id → users.id (SET NULL)                      │   │
│  │  • class_students.class_id → classes.id (CASCADE)                │   │
│  │  • class_students.student_id → users.id (CASCADE)                │   │
│  │  • quizzes.created_by → users.id (SET NULL)                      │   │
│  │  • quiz_questions.quiz_id → quizzes.id (CASCADE)                 │   │
│  │  • quiz_attempts.user_id → users.id (CASCADE)                    │   │
│  │  • quiz_attempts.quiz_id → quizzes.id (CASCADE)                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                            REQUEST FLOW EXAMPLE
═══════════════════════════════════════════════════════════════════════════

1. USER SIGNUP
   ┌─────────────────────────────────────────────────────────────────┐
   │ Client: POST /api/auth/signup                                    │
   │ Body: { name, email, password, role }                            │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Server: routes/auth.js                                           │
   │ • Validate input                                                 │
   │ • Hash password (bcrypt)                                         │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Model: User.create()                                             │
   │ • INSERT INTO users (name, email, password, role)                │
   │ • If student: INSERT INTO user_progress (user_id)                │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ MySQL: Execute prepared statement                                │
   │ • Return insertId                                                │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Server: Generate JWT token                                       │
   │ • jwt.sign({ userId, email, role })                              │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Response: { token, user }                                        │
   │ Client stores token in localStorage                              │
   └─────────────────────────────────────────────────────────────────┘


2. AUTHENTICATED REQUEST (Get Flashcards)
   ┌─────────────────────────────────────────────────────────────────┐
   │ Client: GET /api/flashcards                                      │
   │ Headers: { Authorization: "Bearer <token>" }                     │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Middleware: authenticateToken                                    │
   │ • Verify JWT token                                               │
   │ • Extract user info (userId, role)                               │
   │ • Attach to req.user                                             │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Route: routes/flashcards.js                                      │
   │ • Call Flashcard.findAll()                                       │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Model: Flashcard.findAll()                                       │
   │ • SELECT * FROM flashcards ORDER BY word                         │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ MySQL: Execute query with connection pool                        │
   │ • Use indexed column for fast retrieval                          │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Response: [{ id, word, meaning, example, level }, ...]           │
   │ Client displays flashcards                                       │
   └─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                          SECURITY LAYERS
═══════════════════════════════════════════════════════════════════════════

Layer 1: Network
  • CORS (only allow localhost:3000)
  • Helmet (security headers)

Layer 2: Authentication
  • JWT token verification
  • Token expiry (7 days)

Layer 3: Authorization
  • requireRole middleware
  • Role-based access control (student/teacher/admin)

Layer 4: Database
  • Prepared statements (SQL injection prevention)
  • Password hashing (bcrypt, 12 rounds)
  • Connection pooling (resource management)

Layer 5: Data Integrity
  • Foreign key constraints
  • UNIQUE constraints
  • NOT NULL constraints
  • ENUM types


═══════════════════════════════════════════════════════════════════════════
                        PERFORMANCE OPTIMIZATIONS
═══════════════════════════════════════════════════════════════════════════

1. Connection Pooling
   • Reuse connections (max 10)
   • Automatic queue management
   • Keep-alive enabled

2. Prepared Statements
   • Query plan caching
   • Parameter escaping
   • Faster execution

3. Indexes
   • Fast lookups on email, role
   • Foreign key indexes
   • Composite indexes where needed

4. Efficient Queries
   • JOINs instead of N+1 queries
   • SELECT specific columns
   • LIMIT result sets

5. Data Types
   • ENUM for fixed values
   • JSON for complex data
   • INT for IDs (auto-increment)


═══════════════════════════════════════════════════════════════════════════
```
