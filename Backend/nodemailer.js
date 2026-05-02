// backend/services/emailService.js
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Function to send order confirmation with files
const sendOrderEmail = async (orderData, files) => {
  try {
    // Create email attachments from uploaded files
    const attachments = files.map(file => ({
      filename: file.originalname || file.name,
      content: file.buffer || file,
      contentType: file.mimetype || file.type
    }));

    const mailOptions = {
      from: `"Ravi Graphics" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // Your email where files should go
      subject: `🆕 NEW ORDER - ${orderData.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316, #ef4444); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; }
            .order-id { font-size: 24px; font-weight: bold; color: #f97316; }
            .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #f97316; }
            .section-title { font-size: 18px; font-weight: bold; color: #f97316; margin-bottom: 10px; }
            .detail-row { display: flex; margin-bottom: 8px; }
            .detail-label { font-weight: bold; width: 120px; }
            .detail-value { flex: 1; }
            .files-list { list-style: none; padding: 0; }
            .files-list li { padding: 5px 0; border-bottom: 1px solid #e5e7eb; }
            .footer { text-align: center; margin-top: 20px; padding: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🆕 NEW ORDER RECEIVED</h1>
            </div>
            <div class="content">
              <div style="text-align: center; margin-bottom: 20px;">
                <span class="order-id">Order ID: ${orderData.orderId}</span>
              </div>

              <div class="section">
                <div class="section-title">👤 Customer Details</div>
                <div class="detail-row">
                  <div class="detail-label">Name:</div>
                  <div class="detail-value">${orderData.customer.name}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Phone:</div>
                  <div class="detail-value">${orderData.customer.phone}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Email:</div>
                  <div class="detail-value">${orderData.customer.email}</div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">📦 Product Details</div>
                <div class="detail-row">
                  <div class="detail-label">Category:</div>
                  <div class="detail-value">${orderData.product.category}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Product:</div>
                  <div class="detail-value">${orderData.product.name}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Quantity:</div>
                  <div class="detail-value">${orderData.orderDetails.quantity} ${orderData.orderDetails.unit || 'units'}</div>
                </div>
                ${orderData.orderDetails.totalAmount ? `
                <div class="detail-row">
                  <div class="detail-label">Total Amount:</div>
                  <div class="detail-value">₹${orderData.orderDetails.totalAmount}</div>
                </div>
                ` : ''}
              </div>

              ${Object.keys(orderData.orderDetails.options || {}).length > 0 ? `
              <div class="section">
                <div class="section-title">⚙️ Customizations</div>
                ${Object.entries(orderData.orderDetails.options).map(([key, value]) => `
                  <div class="detail-row">
                    <div class="detail-label">${key}:</div>
                    <div class="detail-value">${value}</div>
                  </div>
                `).join('')}
              </div>
              ` : ''}

              ${orderData.additionalInfo.message ? `
              <div class="section">
                <div class="section-title">📝 Customer Message</div>
                <p style="margin: 0;">${orderData.additionalInfo.message}</p>
              </div>
              ` : ''}

              ${files.length > 0 ? `
              <div class="section">
                <div class="section-title">📎 Attached Files (${files.length})</div>
                <ul class="files-list">
                  ${files.map(file => `<li>📄 ${file.originalname || file.name} (${(file.size / 1024).toFixed(1)} KB)</li>`).join('')}
                </ul>
                <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">Files are attached to this email.</p>
              </div>
              ` : ''}

              <div class="section">
                <div class="section-title">⏰ Order Time</div>
                <p>${orderData.orderDate}</p>
              </div>
            </div>
            <div class="footer">
              <p>Ravi Graphics - Where Quality Meets Excellence</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Function to send confirmation to customer
const sendCustomerConfirmation = async (orderData) => {
  try {
    const mailOptions = {
      from: `"Ravi Graphics" <${process.env.EMAIL_USER}>`,
      to: orderData.customer.email,
      subject: `✅ Order Confirmation - ${orderData.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .order-id { font-size: 20px; font-weight: bold; color: #22c55e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${orderData.customer.name},</p>
              <p>Thank you for your order! Here are your order details:</p>
              
              <p><strong>Order ID:</strong> <span class="order-id">${orderData.orderId}</span></p>
              <p><strong>Product:</strong> ${orderData.product.name}</p>
              <p><strong>Quantity:</strong> ${orderData.orderDetails.quantity} ${orderData.orderDetails.unit || 'units'}</p>
              ${orderData.orderDetails.totalAmount ? `<p><strong>Total:</strong> ₹${orderData.orderDetails.totalAmount}</p>` : ''}
              
              <p>We will contact you shortly on ${orderData.customer.phone} to confirm your order.</p>
              
              <p><strong>Important:</strong> Please save your Order ID for future reference.</p>
              
              <hr>
              <p style="font-size: 12px; color: #666;">Ravi Graphics - Where Quality Meets Excellence</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending customer email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOrderEmail, sendCustomerConfirmation };