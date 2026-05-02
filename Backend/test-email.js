import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Email configuration is VALID!');
    
    // Send a test email
    const info = await transporter.sendMail({
      from: `"Ravi Graphics Test" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Test Email from Ravi Graphics",
      text: "If you receive this, email is working perfectly!"
    });
    console.log('✅ Test email sent! Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure 2-Step Verification is ON for this Google account');
    console.log('2. Generate a new App Password at: https://myaccount.google.com/apppasswords');
    console.log('3. Copy the password EXACTLY as shown (no spaces)');
    console.log('4. Update EMAIL_PASS in .env file');
    console.log('5. Restart the backend server');
  }
}

testEmail();