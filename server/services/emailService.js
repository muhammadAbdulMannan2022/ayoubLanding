import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  /**
   * Send booking confirmation email to customer
   */
  async sendBookingConfirmation(bookingData) {
    const { firstName, lastName, email, date, time, projectType, address } = bookingData;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '✅ Booking Confirmed - Free In-Home Consultation',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { font-size: 28px; font-weight: bold; color: #C9A961; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C9A961; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; }
            .info-value { color: #1A1A1A; }
            .button { display: inline-block; background: #C9A961; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .highlight { color: #C9A961; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Ayoub Flooring</div>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Premium Flooring Solutions</p>
            </div>
            
            <div class="content">
              <h2 style="color: #1A1A1A; margin-top: 0;">🎉 Your Consultation is Confirmed!</h2>
              
              <p>Hi ${firstName},</p>
              
              <p>Thank you for choosing Ayoub Flooring! We're excited to help you with your <span class="highlight">${projectType}</span> project.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #1A1A1A;">📅 Appointment Details</h3>
                ${date && time ? `
                  <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Time:</span>
                    <span class="info-value">${time}</span>
                  </div>
                ` : `
                  <div class="info-row">
                    <span class="info-label">Scheduling:</span>
                    <span class="info-value">We'll contact you to schedule</span>
                  </div>
                `}
                <div class="info-row">
                  <span class="info-label">Project Type:</span>
                  <span class="info-value">${projectType}</span>
                </div>
                ${address ? `
                  <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">${typeof address === 'string' ? address : address.street1 + ', ' + address.city}</span>
                  </div>
                ` : ''}
              </div>
              
              <h3 style="color: #1A1A1A;">What to Expect:</h3>
              <ul style="line-height: 2;">
                <li>✅ Professional measurement of your space</li>
                <li>✅ Material samples and recommendations</li>
                <li>✅ Detailed quote with transparent pricing</li>
                <li>✅ Expert advice on your flooring options</li>
                <li>✅ Timeline and project planning</li>
              </ul>
              
              <p><strong>This consultation is completely FREE with no obligation.</strong></p>
              
              <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
              
              <div style="text-align: center;">
                <a href="tel:+1234567890" class="button">📞 Call Us: (123) 456-7890</a>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Ayoub Flooring</strong></p>
              <p>Licensed in Florida • CRC1331777</p>
              <p>Email: ${process.env.COMPANY_EMAIL} | Phone: (123) 456-7890</p>
              <p style="margin-top: 20px; color: #999;">
                This email was sent because you scheduled a consultation on our website.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Booking confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send quote email to customer
   */
  async sendQuoteEmail(quoteData) {
    const { email, firstName, projectType, totalEstimate, stairDetails, floorDetails } = quoteData;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '💰 Your Custom Flooring Quote is Ready!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { font-size: 28px; font-weight: bold; color: #C9A961; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .quote-box { background: #1A1A1A; color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0; }
            .price { font-size: 48px; font-weight: bold; color: #C9A961; margin: 10px 0; }
            .details-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-item { padding: 12px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
            .button { display: inline-block; background: #C9A961; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Ayoub Flooring</div>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your Custom Quote</p>
            </div>
            
            <div class="content">
              <h2 style="color: #1A1A1A; margin-top: 0;">💰 Your Quote is Ready!</h2>
              
              <p>Hi ${firstName || 'there'},</p>
              
              <p>Thank you for using our online configurator! Based on your project details, here's your custom quote:</p>
              
              <div class="quote-box">
                <p style="margin: 0; font-size: 14px; color: #C9A961; text-transform: uppercase; letter-spacing: 2px;">Estimated Total</p>
                <div class="price">$${totalEstimate?.toFixed(2) || '0.00'}</div>
                <p style="margin: 0; font-size: 12px; color: #999;">*Preliminary estimate</p>
              </div>
              
              <div class="details-box">
                <h3 style="margin-top: 0; color: #1A1A1A;">📋 Project Details</h3>
                <div class="detail-item">
                  <span><strong>Project Type:</strong></span>
                  <span>${projectType}</span>
                </div>
                
                ${floorDetails && floorDetails.sqft ? `
                  <div class="detail-item">
                    <span><strong>Floor Area:</strong></span>
                    <span>${floorDetails.sqft} sqft</span>
                  </div>
                  <div class="detail-item">
                    <span><strong>Rooms:</strong></span>
                    <span>${floorDetails.roomCount || 1}</span>
                  </div>
                  ${floorDetails.material ? `
                    <div class="detail-item">
                      <span><strong>Material:</strong></span>
                      <span>${floorDetails.material}</span>
                    </div>
                  ` : ''}
                ` : ''}
                
                ${stairDetails && stairDetails.steps ? `
                  <div class="detail-item">
                    <span><strong>Stair Steps:</strong></span>
                    <span>${stairDetails.steps}</span>
                  </div>
                  ${stairDetails.landings > 0 ? `
                    <div class="detail-item">
                      <span><strong>Landings:</strong></span>
                      <span>${stairDetails.landings}</span>
                    </div>
                  ` : ''}
                  ${stairDetails.boxSteps > 0 ? `
                    <div class="detail-item">
                      <span><strong>Box Steps:</strong></span>
                      <span>${stairDetails.boxSteps}</span>
                    </div>
                  ` : ''}
                ` : ''}
              </div>
              
              <div style="background: #FFF9E6; padding: 20px; border-radius: 8px; border-left: 4px solid #C9A961; margin: 20px 0;">
                <p style="margin: 0;"><strong>📌 Important Note:</strong></p>
                <p style="margin: 10px 0 0 0;">This is a preliminary estimate based on the information provided. Final pricing will be confirmed after our free in-home consultation where we'll measure your space and discuss all details.</p>
              </div>
              
              <h3 style="color: #1A1A1A;">Next Steps:</h3>
              <ol style="line-height: 2;">
                <li>Schedule your FREE in-home consultation</li>
                <li>We'll measure and confirm all details</li>
                <li>Receive your final detailed quote</li>
                <li>Choose your start date</li>
              </ol>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/#configurator" class="button">📅 Schedule Consultation</a>
              </div>
              
              <p style="text-align: center; margin-top: 30px;">
                Questions? Call us at <strong>(123) 456-7890</strong>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Ayoub Flooring</strong></p>
              <p>Licensed in Florida • CRC1331777</p>
              <p>Email: ${process.env.COMPANY_EMAIL} | Phone: (123) 456-7890</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Quote email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending quote email:', error);
      throw error;
    }
  }

  /**
   * Send notification to admin about new booking
   */
  async sendAdminNotification(bookingData) {
    const { firstName, lastName, email, phone, date, time, projectType, notes, address } = bookingData;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.COMPANY_EMAIL,
      subject: `🔔 New Booking: ${firstName} ${lastName} - ${projectType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1A1A1A; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #C9A961; }
            .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; display: inline-block; width: 150px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🔔 New Booking Received</h2>
            </div>
            
            <div class="content">
              <div class="info-box">
                <h3 style="margin-top: 0;">Customer Information</h3>
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span>${firstName} ${lastName}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span><a href="mailto:${email}">${email}</a></span>
                </div>
                <div class="info-row">
                  <span class="label">Phone:</span>
                  <span><a href="tel:${phone}">${phone}</a></span>
                </div>
                ${address ? `
                  <div class="info-row">
                    <span class="label">Address:</span>
                    <span>${typeof address === 'string' ? address : `${address.street1}, ${address.city}, ${address.province} ${address.postalCode}`}</span>
                  </div>
                ` : ''}
              </div>
              
              <div class="info-box">
                <h3 style="margin-top: 0;">Appointment Details</h3>
                ${date && time ? `
                  <div class="info-row">
                    <span class="label">Date:</span>
                    <span>${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Time:</span>
                    <span>${time}</span>
                  </div>
                ` : `
                  <div class="info-row">
                    <span class="label">Scheduling:</span>
                    <span>To be scheduled</span>
                  </div>
                `}
                <div class="info-row">
                  <span class="label">Project Type:</span>
                  <span><strong>${projectType}</strong></span>
                </div>
              </div>
              
              ${notes ? `
                <div class="info-box">
                  <h3 style="margin-top: 0;">Notes</h3>
                  <p>${notes}</p>
                </div>
              ` : ''}
              
              <p style="margin-top: 20px; padding: 15px; background: #FFF9E6; border-radius: 8px; border-left: 4px solid #C9A961;">
                <strong>Action Required:</strong> Please contact the customer to confirm the appointment and schedule the consultation.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Admin notification sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending admin notification:', error);
      throw error;
    }
  }

  /**
   * Test email configuration
   */
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection successful');
      return { success: true, message: 'SMTP connection successful' };
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      throw error;
    }
  }
}

export default new EmailService();
