# Job Portal Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory and add the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string_here

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=wankhaderohan285@gmail.com
EMAIL_PASSWORD=your_app_specific_password_here
EMAIL_FROM=wankhaderohan285@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
```

### 3. MongoDB Setup
- Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- Create a new cluster
- Get your connection string and add it to MONGO_URI in .env

### 4. Cloudinary Setup
- Create a free account at https://cloudinary.com
- Get your Cloud Name, API Key, and API Secret from the dashboard
- Add them to the .env file

### 5. Gmail Setup for Email Notifications
- Enable 2-Factor Authentication on your Gmail account
- Go to https://myaccount.google.com/apppasswords
- Generate an App Password for "Mail"
- Use this App Password in EMAIL_PASSWORD in .env

### 6. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on http://localhost:5000

### 7. API Testing
Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- GET /api/auth/logout - Logout user
- PUT /api/auth/updatedetails - Update user details
- PUT /api/auth/updatepassword - Update password
- POST /api/auth/forgotpassword - Forgot password
- PUT /api/auth/resetpassword/:token - Reset password

### Profile
- GET /api/profile - Get user profile
- PUT /api/profile - Update profile
- POST /api/profile/resume - Upload resume
- POST /api/profile/image - Upload profile image
- GET /api/profile/:id - Get public profile

### Companies
- POST /api/companies - Create company (Recruiter)
- GET /api/companies - Get all companies
- GET /api/companies/my/company - Get my company
- GET /api/companies/:id - Get single company
- PUT /api/companies/:id - Update company
- DELETE /api/companies/:id - Delete company
- POST /api/companies/:id/logo - Upload company logo

### Jobs
- POST /api/jobs - Create job (Recruiter)
- GET /api/jobs - Get all jobs (with filters)
- GET /api/jobs/my/jobs - Get my jobs (Recruiter)
- GET /api/jobs/recommended - Get recommended jobs (Student)
- GET /api/jobs/:id - Get single job
- PUT /api/jobs/:id - Update job
- DELETE /api/jobs/:id - Delete job

### Applications
- POST /api/applications/:jobId - Apply for job (Student)
- GET /api/applications/my - Get my applications (Student)
- GET /api/applications/job/:jobId - Get job applications (Recruiter)
- GET /api/applications/:id - Get single application
- PUT /api/applications/:id/status - Update application status (Recruiter)
- DELETE /api/applications/:id - Withdraw application (Student)
- GET /api/applications/stats/overview - Get application stats (Recruiter)

### Saved Jobs
- POST /api/saved-jobs/:jobId - Save job (Student)
- GET /api/saved-jobs - Get saved jobs (Student)
- DELETE /api/saved-jobs/:jobId - Unsave job (Student)
- GET /api/saved-jobs/check/:jobId - Check if job is saved

### Admin
- GET /api/admin/stats - Get dashboard statistics
- GET /api/admin/users - Get all users
- PUT /api/admin/users/:id/toggle-status - Toggle user status
- DELETE /api/admin/users/:id - Delete user
- GET /api/admin/companies - Get all companies
- PUT /api/admin/companies/:id/approve - Approve/Reject company
- GET /api/admin/jobs - Get all jobs
- PUT /api/admin/jobs/:id/approve - Approve/Reject job
- GET /api/admin/applications - Get all applications

## Default Admin Account
Create an admin account manually in MongoDB or via register endpoint with role: 'admin'

## Features
- ✅ JWT Authentication
- ✅ Role-based Authorization (Student, Recruiter, Admin)
- ✅ File Upload (Resume, Profile Image, Company Logo)
- ✅ Email Notifications
- ✅ Password Reset
- ✅ Advanced Job Search & Filters
- ✅ Application Status Tracking
- ✅ Admin Dashboard
- ✅ Rate Limiting
- ✅ Security Headers
- ✅ Error Handling

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Cloudinary for File Storage
- Nodemailer for Emails
- Bcrypt for Password Hashing
