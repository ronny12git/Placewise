# Job Portal - Complete Project Structure

## Backend Structure (/backend)
```
backend/
├── config/
│   ├── db.js                    # MongoDB connection
│   └── cloudinary.js            # Cloudinary configuration
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── profileController.js     # User profile operations
│   ├── companyController.js     # Company CRUD operations
│   ├── jobController.js         # Job CRUD operations
│   ├── applicationController.js # Application management
│   ├── savedJobController.js    # Saved jobs operations
│   └── adminController.js       # Admin dashboard & management
├── middleware/
│   ├── auth.js                  # JWT authentication & authorization
│   └── error.js                 # Error handling middleware
├── models/
│   ├── User.js                  # User schema (Student/Recruiter/Admin)
│   ├── Company.js               # Company schema
│   ├── Job.js                   # Job posting schema
│   ├── Application.js           # Job application schema
│   └── SavedJob.js              # Saved jobs schema
├── routes/
│   ├── authRoutes.js            # Auth endpoints
│   ├── profileRoutes.js         # Profile endpoints
│   ├── companyRoutes.js         # Company endpoints
│   ├── jobRoutes.js             # Job endpoints
│   ├── applicationRoutes.js     # Application endpoints
│   ├── savedJobRoutes.js        # Saved jobs endpoints
│   └── adminRoutes.js           # Admin endpoints
├── utils/
│   ├── sendEmail.js             # Email sending utility
│   └── emailTemplates.js        # Email HTML templates
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js                    # Express server entry point
```

## Frontend Structure (/frontend)
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.js        # Navigation bar
│   │   │   ├── Footer.js        # Footer component
│   │   │   ├── JobCard.js       # Job listing card
│   │   │   ├── Loader.js        # Loading spinner
│   │   │   └── Modal.js         # Modal component
│   │   ├── student/
│   │   │   ├── ProfileForm.js   # Student profile editor
│   │   │   ├── ApplicationCard.js # Application status card
│   │   │   └── ResumeUpload.js  # Resume upload component
│   │   ├── recruiter/
│   │   │   ├── JobForm.js       # Job posting form
│   │   │   ├── ApplicantCard.js # Applicant details card
│   │   │   └── CompanyForm.js   # Company profile form
│   │   └── admin/
│   │       ├── StatsCard.js     # Dashboard stats widget
│   │       ├── UserTable.js     # Users management table
│   │       └── ApprovalCard.js  # Job/Company approval card
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── ForgotPassword.js # Forgot password
│   │   │   └── ResetPassword.js # Reset password
│   │   ├── common/
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── Jobs.js          # Browse jobs page
│   │   │   ├── JobDetails.js    # Single job details
│   │   │   └── NotFound.js      # 404 page
│   │   ├── student/
│   │   │   ├── Dashboard.js     # Student dashboard
│   │   │   ├── Profile.js       # Student profile page
│   │   │   ├── MyApplications.js # Applications list
│   │   │   └── SavedJobs.js     # Saved jobs list
│   │   ├── recruiter/
│   │   │   ├── Dashboard.js     # Recruiter dashboard
│   │   │   ├── CompanyProfile.js # Company profile page
│   │   │   ├── PostJob.js       # Post new job
│   │   │   ├── MyJobs.js        # Posted jobs list
│   │   │   └── JobApplicants.js # Job applicants page
│   │   └── admin/
│   │       ├── Dashboard.js     # Admin dashboard
│   │       ├── ManageUsers.js   # Users management
│   │       ├── ManageCompanies.js # Companies management
│   │       └── ManageJobs.js    # Jobs management
│   ├── context/
│   │   └── AuthContext.js       # Authentication context
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── utils/
│   │   ├── constants.js         # App constants
│   │   └── helpers.js           # Helper functions
│   ├── App.js                   # Main app component
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Features Implemented

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (Student, Recruiter, Admin)
- ✅ Password hashing with bcrypt
- ✅ Password reset via email
- ✅ Protected routes on both frontend and backend

### Student Features
- ✅ Profile management (bio, skills, education, experience)
- ✅ Resume upload to Cloudinary
- ✅ Browse and search jobs with filters
- ✅ Apply for jobs with cover letter
- ✅ Track application status
- ✅ Save jobs for later
- ✅ View recommended jobs based on skills
- ✅ Receive email notifications

### Recruiter Features
- ✅ Company profile creation and management
- ✅ Company logo upload
- ✅ Post job listings
- ✅ View and manage posted jobs
- ✅ View all applicants for jobs
- ✅ Update application status
- ✅ Filter applicants by status
- ✅ Dashboard with statistics
- ✅ Email notifications to applicants

### Admin Features
- ✅ Dashboard with comprehensive statistics
- ✅ User management (view, activate/deactivate, delete)
- ✅ Company approval/rejection
- ✅ Job approval/rejection
- ✅ View all applications
- ✅ Charts and analytics

### Technical Features
- ✅ File upload (Resume, Profile Images, Company Logos)
- ✅ Cloudinary integration for cloud storage
- ✅ Email notifications (Nodemailer + Gmail)
- ✅ Advanced search and filtering
- ✅ Pagination
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ Security headers
- ✅ CORS configuration
- ✅ Responsive design with Tailwind CSS

## Environment Setup

### Backend Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=wankhaderohan285@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=wankhaderohan285@gmail.com
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

### Frontend Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Installation & Running

### Backend
```bash
cd backend
npm install
# Configure .env file
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Configure .env file
npm start
```

The backend will run on http://localhost:5000
The frontend will run on http://localhost:3000

## API Documentation

All API endpoints are documented in backend/README.md

## Default Test Accounts

After setup, you can create accounts:
- Student: role="student"
- Recruiter: role="recruiter"
- Admin: role="admin" (create manually in DB or via API)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Bcrypt
- Cloudinary
- Nodemailer
- Multer

### Frontend
- React
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast
- React Icons
- Chart.js