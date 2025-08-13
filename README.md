# School Management System

A comprehensive web-based school management system built with Node.js, Express, MongoDB, and Next.js. This system provides role-based access control for administrators, teachers, and students with modern UI/UX design.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Role-based Access Control**: Three user roles (Admin, Teacher, Student)
- **JWT Authentication**: Secure token-based authentication
- **Admin-only Registration**: Only administrators can create new user accounts
- **Password Security**: Bcrypt hashing for password protection

### 👨‍💼 Admin Dashboard
- **User Management**: View, edit, and delete users
- **Teacher Assignment**: Assign subjects to teachers
- **Student Management**: Manage student information
- **Role-based Filtering**: Filter users by role (student/teacher)
- **Real-time Updates**: Instant data refresh after operations

### 👨‍🏫 Teacher Dashboard
- **Student List**: View all students with filtering capabilities
- **Grade Management**: Add and update student grades for assigned subjects
- **Subject Assignment**: View assigned teaching subjects
- **Performance Tracking**: Monitor student progress

### 👨‍🎓 Student Dashboard
- **Personal Profile**: View personal information and academic details
- **Grade Overview**: See all grades with letter grade calculations
- **Class Information**: View subject assignments and teacher information
- **Collapsible Sections**: Organized information display

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface with water-blue theme
- **Role-specific Navigation**: Dynamic navigation based on user role
- **Real-time Feedback**: Loading states and success/error messages
- **Mobile Responsive**: Works on all device sizes

## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: UI library with hooks
- **Axios**: HTTP client for API calls
- **jwt-decode**: Client-side token decoding
- **CSS-in-JS**: Inline styling for components

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (running locally or cloud instance)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd School-Management
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/schoolDB
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  username: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'teacher', 'student']),
  subject: String (for teachers),
  createdAt: Date,
  updatedAt: Date
}
```

### Student Model
```javascript
{
  name: String,
  userId: ObjectId (ref: User),
  grades: [{
    subject: String,
    score: Number
  }],
  classId: ObjectId (ref: Class),
  createdAt: Date,
  updatedAt: Date
}
```

### Class Model
```javascript
{
  name: String,
  teacherId: ObjectId (ref: User),
  students: [ObjectId] (ref: Student),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `GET /api/users?role=student|teacher|admin` - Get users by role (admin only)
- `PUT /api/users/:id` - Update user information (admin only)
- `PUT /api/users/:id/subject` - Assign subject to teacher (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Students
- `GET /api/students` - Get all students (admin/teacher)
- `POST /api/students/grade` - Update student grade (teacher only)
- `GET /api/students/profile` - Get student's own profile

## 👥 User Roles & Permissions

### Admin
- Create, edit, and delete users
- Assign subjects to teachers
- View all students and teachers
- Access to all system features

### Teacher
- View student list
- Update grades for assigned subjects
- View assigned subjects
- Access to teacher-specific features

### Student
- View personal profile
- View grades and academic information
- View class and teacher information
- Limited to student-specific features

## 🎨 UI Components

### Navigation
- Dynamic navigation based on user role
- Profile and logout functionality
- Responsive design

### Forms
- Login and registration forms
- Profile editing forms
- Grade update forms
- User management forms

### Tables
- Student lists with filtering
- User management tables
- Grade display tables

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Role-based Middleware**: Route protection based on user roles
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Configure MongoDB connection string
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🔄 Version History

- **v1.0.0**: Initial release with basic functionality
- Role-based access control
- User management system
- Grade management
- Modern UI/UX design

---

**Built with ❤️ for educational institutions**
