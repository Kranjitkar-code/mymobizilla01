import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      customerName,
      customerEmail,
      customerPhone,
      service,
      message,
      to
    } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.in',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'support@mobizilla.com',
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'support@mobizilla.com';
    const adminEmail = to || process.env.ADMIN_EMAIL || 'mobizillaindia@gmail.com';

    const mailOptions = {
      from: `"Mobizilla Contact Form" <${fromEmail}>`,
      to: adminEmail,
      replyTo: customerEmail,
      subject: `📬 New Contact Form - ${service}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table width="600" style="background-color: #ffffff; border-radius: 8px; margin: 0 auto;">
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">📬 New Contact</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px;">
                <h2>Contact Details</h2>
                <p><strong>Name:</strong> ${customerName}</p>
                <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
                ${customerPhone ? `<p><strong>Phone:</strong> ${customerPhone}</p>` : ''}
                <p><strong>Service:</strong> ${service}</p>
                <hr/>
                <h3>Message</h3>
                <p style="white-space: pre-wrap;">${message}</p>
                <p style="text-align: center; margin-top: 30px;">
                  <a href="mailto:${customerEmail}?subject=Re: Your inquiry about ${service}" 
                     style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Reply to Customer
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId
      })
    };

  } catch (error) {
    console.error('Contact email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
