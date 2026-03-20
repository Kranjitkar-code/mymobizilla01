import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      to,
      customerName,
      trackingCode,
      deviceInfo,
      estimatedCost,
      customerEmail,
      customerPhone,
      description,
      issue
    } = body;

    // Create SMTP transporter
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

    // Use customer email if provided
    const recipientEmail = customerEmail || to || process.env.ADMIN_EMAIL || 'mobizillaindia@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'support@mobizilla.com';
    
    // Also send to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'mobizillaindia@gmail.com';
    const recipients = recipientEmail === adminEmail ? adminEmail : `${recipientEmail}, ${adminEmail}`;

    // Parse description for service type
    const isBuyback = description?.includes('BUYBACK') || issue?.includes('BUYBACK');
    const serviceType = isBuyback ? 'BUYBACK' : 'REPAIR';
    const serviceIcon = isBuyback ? '💰' : '🔧';
    
    // Extract details from description
    let problemOrCondition = issue || '';
    let additionalInfo = '';
    let address = '';
    
    if (description) {
      const lines = description.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        if (line.includes('PROBLEM:') || line.includes('CONDITION:')) {
          problemOrCondition = line.split(':')[1]?.trim() || problemOrCondition;
        } else if (line.includes('ADDITIONAL DETAILS:')) {
          additionalInfo = line.split(':')[1]?.trim() || '';
        } else if (line.includes('ADDRESS:')) {
          address = line.split(':')[1]?.trim() || '';
        }
      });
    }

    const mailOptions = {
      from: `"Mobizilla Support" <${fromEmail}>`,
      to: recipients,
      subject: `${serviceIcon} ${serviceType} Request Confirmed - ${trackingCode}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px;">${serviceIcon} Mobizilla</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">${serviceType} Request Confirmed!</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Hi ${customerName}! 👋</h2>
                      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                        Great news! Your ${serviceType.toLowerCase()} request has been successfully confirmed. 
                        ${isBuyback ? 'Our team will evaluate your device and get back to you with the best offer.' : 'Our expert technicians will take great care of your device.'}
                      </p>
                      
                      <!-- Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">📋 ${serviceType} Details</h3>
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Tracking Code:</strong> 
                              <span style="color: #667eea; font-weight: bold; font-size: 18px;">${trackingCode}</span>
                            </p>
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Device:</strong> ${deviceInfo}
                            </p>
                            ${problemOrCondition ? `<p style="margin: 8px 0; color: #666666;">
                              <strong>${isBuyback ? 'Device Condition' : 'Problem'}:</strong> ${problemOrCondition}
                            </p>` : ''}
                            <p style="margin: 8px 0; color: #666666;">
                              <strong>Estimated ${isBuyback ? 'Value' : 'Cost'}:</strong> 
                              <span style="color: #28a745; font-weight: bold;">₨${estimatedCost?.toLocaleString() || '0'}</span>
                            </p>
                            ${address ? `<p style="margin: 8px 0; color: #666666;">
                              <strong>Address:</strong> ${address}
                            </p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #666666; font-size: 14px; margin: 30px 0 0 0;">
                        Need help? Reply to this email or call us at <strong>+977 9841000000</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #333333; padding: 20px; text-align: center;">
                      <p style="color: #ffffff; margin: 0; font-size: 14px;">
                        © 2025 Mobizilla. Trusted device repair services.
                      </p>
                    </td>
                  </tr>
                </table>
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
        messageId: info.messageId,
        message: 'Email sent successfully'
      })
    };

  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
