const emailTemplates = {
  applicationReceived: (applicantName, jobTitle, companyName) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Received</h1>
        </div>
        <div class="content">
          <p>Dear ${applicantName},</p>
          <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
          <p>Your application has been received and is currently under review. We will contact you soon regarding the next steps.</p>
          <p>Best regards,<br>${companyName} Recruitment Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Placewise. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  applicationStatusUpdate: (applicantName, jobTitle, companyName, status) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .status { padding: 10px; margin: 20px 0; border-radius: 5px; text-align: center; font-weight: bold; }
        .status.shortlisted { background-color: #10B981; color: white; }
        .status.interview { background-color: #3B82F6; color: white; }
        .status.rejected { background-color: #EF4444; color: white; }
        .status.hired { background-color: #8B5CF6; color: white; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Status Update</h1>
        </div>
        <div class="content">
          <p>Dear ${applicantName},</p>
          <p>We have an update regarding your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
          <div class="status ${status.toLowerCase()}">
            Status: ${status.toUpperCase()}
          </div>
          ${
            status === 'shortlisted'
              ? '<p>Congratulations! You have been shortlisted for the next round.</p>'
              : ''
          }
          ${
            status === 'interview'
              ? '<p>Great news! We would like to schedule an interview with you. Our team will contact you shortly with the details.</p>'
              : ''
          }
          ${
            status === 'hired'
              ? '<p>Congratulations! We are pleased to offer you the position. Our HR team will reach out to you with the details.</p>'
              : ''
          }
          ${
            status === 'rejected'
              ? '<p>Thank you for your interest. Unfortunately, we have decided to move forward with other candidates. We wish you the best in your job search.</p>'
              : ''
          }
          <p>Best regards,<br>${companyName} Recruitment Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Placewise. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  newJobAlert: (userName, jobTitle, companyName, jobLink) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Job Alert</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>A new job matching your profile has been posted:</p>
          <h2>${jobTitle}</h2>
          <p>Company: <strong>${companyName}</strong></p>
          <p>Check out this opportunity and apply before the deadline!</p>
          <a href="${jobLink}" class="button">View Job Details</a>
          <p>Best regards,<br>Placewise Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Placewise. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  welcomeEmail: (userName, userRole) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Placewise</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Welcome to Placewise! Your account has been successfully created as a <strong>${userRole}</strong>.</p>
          ${
            userRole === 'student'
              ? '<p>Start building your profile, upload your resume, and explore thousands of job opportunities!</p>'
              : ''
          }
          ${
            userRole === 'recruiter'
              ? '<p>Start posting jobs and find the best talent for your company!</p>'
              : ''
          }
          <p>Best regards,<br>Placewise Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Placewise. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordReset: (userName, resetLink) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Placewise Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Placewise. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

module.exports = emailTemplates;
