# SpeakSmart - English Learning Platform

A modern, responsive web application for interactive English language learning with separate dashboards for students and teachers.

## Features

### For Students
- **Interactive Learning Content** - Grammar, Vocabulary, Speaking, and Listening modules
- **Quiz System** - Multiple-choice, fill-in-the-blank, and listening-based questions
- **Digital Flashcards** - Vocabulary practice with pronunciation and examples
- **Progress Tracking** - Detailed analytics and skill-based progress charts
- **AI Chatbot** - Voice-enabled conversation practice with speech-to-text
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 👩‍🏫 For Teachers
- **Student Management** - View and track all student progress
- **Quiz Creation** - Create and manage custom quizzes
- **Analytics Dashboard** - Class performance insights and reports
- **Material Management** - Upload and organize learning resources

### General Features
- **Dual Authentication** - Separate login systems for students and teachers
- **Dark/Light Mode** - Theme toggle for better user experience
- **Real-time Updates** - Live progress tracking and notifications
- **Secure API** - JWT-based authentication with rate limiting

## Tech Stack

### Frontend
- **React.js** - Modern UI library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware

### Database
- **MySQL** - Production-ready relational database
- **mysql2** - Fast MySQL driver with promise support
- **Connection Pooling** - Optimized database connections

> **Note**: The project now uses MySQL instead of JSON files. See `MYSQL_SETUP_GUIDE.md` for setup instructions.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- **MySQL Server 8.0+** (https://dev.mysql.com/downloads/mysql/)
- **MySQL Workbench** (https://dev.mysql.com/downloads/workbench/)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd speaksmart
   ```

2. **Setup MySQL Database**
   ```bash
   # Open MySQL Workbench and run:
   CREATE DATABASE english_learning_platform;
   USE english_learning_platform;
   SOURCE database/schema.sql;
   ```
   
   📖 **Detailed MySQL setup**: See `MYSQL_SETUP_GUIDE.md`

3. **Install dependencies**
   ```bash
   npm run install-all
   ```

4. **Environment Configuration**
   - Update `server/.env` with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=english_learning_platform
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your-secret-key
   ```

5. **Test Database Connection**
   ```bash
   cd server
   node test-db.js
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) concurrently.

### Alternative Setup (Manual)

1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

3. **Setup Backend** (in a new terminal)
   ```bash
   cd server
   npm install
   npm run dev
   ```

## Usage

### Getting Started

1. **Access the Application**
   - Open http://localhost:3000 in your browser
   - You'll see the homepage with login/signup options

2. **Create an Account**
   - Click "Sign Up" and choose your role (Student or Teacher)
   - Fill in your details and create an account

3. **For Students**
   - Access your dashboard to see progress overview
   - Navigate to Learning section for structured lessons
   - Take quizzes to test your knowledge
   - Use flashcards for vocabulary practice
   - Chat with the AI assistant for conversation practice
   - Track your progress in the Progress section

4. **For Teachers**
   - Access the teacher dashboard to manage students
   - View student progress and analytics
   - Create and manage quizzes
   - Upload learning materials

### Demo Accounts

**Admin Account:**
- Email: admin@speaksmart.com
- Password: admin123

**Create your own accounts:**
- Use the signup page to create student/teacher accounts
- Admin can create users via the admin dashboard

## Project Structure

```
english-learning-platform/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── models/           # Database models (ORM)
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Main server file
├── database/             # MySQL schema & seed data
│   └── schema.sql        # Database structure
├── MYSQL_SETUP_GUIDE.md  # Detailed MySQL setup
├── MYSQL_QUICK_REFERENCE.md  # Quick commands
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Student Routes
- `GET /api/student/dashboard` - Student dashboard data
- `POST /api/student/progress` - Update progress
- `GET /api/student/materials` - Get learning materials

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/classes` - Get all classes
- `POST /api/admin/classes` - Create class
- `POST /api/admin/classes/:id/assign` - Assign student to class

### Teacher Routes
- `GET /api/teacher/dashboard` - Teacher dashboard data
- `GET /api/teacher/students` - Get all students
- `POST /api/teacher/quizzes` - Create quiz
- `GET /api/teacher/analytics` - Class analytics

### Quiz Routes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers

## Customization

### Themes
The application supports both light and dark themes. You can customize colors in `client/src/styles/index.css`:

```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  /* Add your custom colors */
}
```

### Adding New Features
1. **Frontend**: Add new components in `client/src/components/`
2. **Backend**: Add new routes in `server/routes/`
3. **Database**: Create migrations or update `database/schema.sql`
4. **Models**: Add new models in `server/models/index.js`

## Deployment

### Frontend (Netlify/Vercel)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder to your hosting service

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` directory
3. Update the client's API base URL

### Full Stack (AWS/DigitalOcean)
1. Set up a server with Node.js
2. Clone the repository
3. Install dependencies and start with PM2
4. Configure nginx as a reverse proxy

## Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 salt rounds)
- Prepared statements (SQL injection prevention)
- Connection pooling with mysql2
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- Role-based access control (RBAC)

## Database Documentation

📖 **Complete MySQL Setup Guide**: `MYSQL_SETUP_GUIDE.md`

🚀 **Quick Reference**: `MYSQL_QUICK_REFERENCE.md`

📊 **Implementation Details**: `MYSQL_IMPLEMENTATION_SUMMARY.md`

☁️ **AWS RDS Migration**: `AWS_RDS_QUICK_START.md`

### Key Features:
- Normalized schema with 8 tables
- Foreign key constraints for data integrity
- Indexed columns for fast queries
- Connection pooling (10 concurrent connections)
- Prepared statements for security
- Transaction support
- **AWS RDS support** for cloud deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Include steps to reproduce the problem
4. Provide system information (OS, Node.js version, etc.)

## Future Enhancements

- [ ] Real-time chat between students and teachers
- [ ] Video lessons integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with machine learning
- [ ] Integration with external APIs (Google Translate, etc.)
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Advanced quiz types (drag-and-drop, audio recording)
- [ ] Gamification features (badges, leaderboards)
- [ ] Social learning features (study groups, forums)

## Acknowledgments

- React.js team for the amazing framework
- Lucide React for beautiful icons
- Recharts for data visualization
- All contributors and testers

---

**Happy Learning with SpeakSmart!**