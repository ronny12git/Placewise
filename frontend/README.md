# Job Portal Frontend

React-based frontend for the Job Portal / Placement Management System.

## Features

### For Students/Job Seekers
- Browse and search jobs with advanced filters
- Create and manage profile
- Upload resume (PDF)
- Apply for jobs
- Track application status
- Save jobs for later
- Get job recommendations based on skills
- Receive email notifications

### For Recruiters/Employers
- Create company profile
- Post job listings
- View and manage applications
- Update application status
- Dashboard with statistics
- Send notifications to applicants

### For Admins
- Dashboard with comprehensive analytics
- Manage users (students, recruiters)
- Approve/reject companies
- Approve/reject job postings
- View all applications
- Toggle user status

## Tech Stack

- **React** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **React Icons** - Icons
- **Chart.js** - Charts and analytics

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm start
```

The app will run on http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components (Navbar, Footer, etc.)
│   ├── student/        # Student-specific components
│   ├── recruiter/      # Recruiter-specific components
│   └── admin/          # Admin-specific components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── common/         # Public pages
│   ├── student/        # Student dashboard pages
│   ├── recruiter/      # Recruiter dashboard pages
│   └── admin/          # Admin dashboard pages
├── context/            # React Context (AuthContext)
├── services/           # API service layer
├── utils/              # Utility functions
├── App.js              # Main app component with routing
├── index.js            # React entry point
└── index.css           # Global styles
```

## Available Routes

### Public Routes
- `/` - Home page
- `/jobs` - Browse jobs
- `/jobs/:id` - Job details
- `/login` - Login
- `/register` - Register
- `/forgot-password` - Forgot password
- `/reset-password/:token` - Reset password

### Student Routes (Protected)
- `/student/dashboard` - Student dashboard
- `/student/profile` - Profile management
- `/student/applications` - My applications
- `/student/saved-jobs` - Saved jobs

### Recruiter Routes (Protected)
- `/recruiter/dashboard` - Recruiter dashboard
- `/recruiter/company` - Company profile
- `/recruiter/post-job` - Post new job
- `/recruiter/jobs` - My job postings
- `/recruiter/jobs/:id/applicants` - View applicants

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - Manage users
- `/admin/companies` - Manage companies
- `/admin/jobs` - Manage jobs

## Key Features Implementation

### Authentication
- JWT-based authentication
- Protected routes with role-based access
- Automatic redirect based on user role
- Persistent login with localStorage

### File Uploads
- Resume upload for students
- Profile image upload
- Company logo upload
- All files stored in Cloudinary

### Real-time Notifications
- Toast notifications for all actions
- Success/error/info messages
- Customized styling

### Responsive Design
- Mobile-first approach
- Tailwind CSS for responsive layouts
- Works on all screen sizes

## Development Notes

### Adding New Pages
1. Create component in appropriate directory under `src/pages/`
2. Add route in `src/App.js`
3. Add navigation link if needed

### Adding New API Calls
1. Add function to appropriate API service in `src/services/api.js`
2. Import and use in components

### Styling
- Use Tailwind CSS utility classes
- Custom colors defined in `tailwind.config.js`
- Primary color: Indigo (#4F46E5)

## Troubleshooting

### CORS Errors
Make sure the backend FRONTEND_URL in .env matches your frontend URL.

### API Connection Issues
Check that REACT_APP_API_URL in frontend .env matches your backend URL.

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## Future Enhancements

- [ ] Advanced job search with AI matching
- [ ] Video interview scheduling
- [ ] Chat/messaging between recruiter and applicant
- [ ] Skills assessment tests
- [ ] Resume builder
- [ ] Company reviews and ratings
- [ ] Salary insights
- [ ] Job alerts via push notifications

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Author

Rohan Wankhade
Email: wankhaderohan285@gmail.com
