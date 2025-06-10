import nodemailer from 'nodemailer';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.CLIENT_URL) {
  throw new Error('Missing one of: EMAIL_USER, EMAIL_PASS, CLIENT_URL in .env');
}

// 2) create transporter once
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,                // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // your 16-char Gmail App Password, no spaces
  }
});

// 3) export the function
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
 await transporter.sendMail({
    from: `"TechTribe - Connecting Professionals" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Verify Your Email</title>
        <style>
          /* Base styles */
          body {
            background-color: #f5f7fa;
            color: #334155;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
          }
          
          /* Container */
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
          }
          
          /* Header */
          .header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            transform: rotate(30deg);
          }
          
          .logo {
            font-size: 32px;
            font-weight: 800;
            color: #ffffff;
            position: relative;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
          }
          
          .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            position: relative;
          }
          
          /* Content */
          .content {
            padding: 40px;
          }
          
          .title {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 24px;
            text-align: center;
            color: #1e293b;
          }
          
          .text {
            font-size: 16px;
            line-height: 1.7;
            color: #475569;
            margin-bottom: 24px;
          }
          
          /* Button */
          .btn-container {
            text-align: center;
            margin: 32px 0;
          }
          
          .btn {
            display: inline-block;
            padding: 16px 36px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff !important;
            text-decoration: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 700;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
          }
          
          /* Link box */
          .link-container {
            background: #f1f5f9;
            border-radius: 10px;
            padding: 20px;
            margin: 32px 0;
            text-align: center;
            border: 1px dashed #cbd5e1;
          }
          
          .verification-link {
            word-break: break-all;
            color: #6366f1;
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
          }
          
          /* Info box */
          .info-box {
            background: #f8fafc;
            border-left: 4px solid #94a3b8;
            padding: 16px;
            border-radius: 4px;
            margin: 32px 0;
          }
          
          .info-title {
            font-weight: 600;
            color: #475569;
            margin-bottom: 8px;
          }
          
          /* Footer */
          .footer {
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            color: #94a3b8;
            font-size: 14px;
            background: #f8fafc;
          }
          
          .footer p {
            margin: 5px 0;
          }
          
          .social-links {
            margin-top: 15px;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #94a3b8;
            text-decoration: none;
          }
          
          /* Responsive */
          @media (max-width: 600px) {
            .content {
              padding: 30px 20px;
            }
            .title {
              font-size: 22px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">TechTribe</div>
            <div class="tagline">Connecting Professionals</div>
          </div>
          
          <div class="content">
            <h1 class="title">Verify Your Email Address</h1>
            
            <p class="text">
              Welcome to TechTribe! To complete your registration and start connecting with professionals, 
              please verify your email address by clicking the button below:
            </p>
            
            <div class="btn-container">
              <a href="${verificationUrl}" class="btn">Verify Email Address</a>
            </div>
            
            <p class="text">
              If the button doesn't work, copy and paste this URL into your browser:
            </p>
            
            <div class="link-container">
              <a href="${verificationUrl}" class="verification-link">${verificationUrl}</a>
            </div>
            
            <div class="info-box">
              <div class="info-title">Important:</div>
              <p class="text">
                This verification link will expire in 24 hours. If you didn't create an account with TechTribe, 
                please ignore this email or contact our support team.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2025 TechTribe. All rights reserved.</p>
            <p>123 Innovation Drive, Tech Valley, CA 94103</p>
            <p>
              <a href="mailto:support@techtribe.com" style="color: #6366f1; text-decoration: none;">
                support@techtribe.com
              </a>
            </p>
            <div class="social-links">
              <a href="https://twitter.com/techtribe">Twitter</a>
              <a href="https://linkedin.com/company/techtribe">LinkedIn</a>
              <a href="https://github.com/techtribe">GitHub</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  });
};