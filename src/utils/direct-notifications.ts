// Alternative notification system using direct API calls
// This can be used if Edge Functions deployment is not immediately available

const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'your_twilio_account_sid'
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'your_twilio_auth_token'  
const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER || 'your_twilio_phone_number'
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || 'your_sendgrid_api_key'

export async function sendDirectNotifications(data: {
  customer_name: string,
  tracking_code: string,
  device_info: string,
  estimated_cost: number
}) {
  const results = {
    sms_sent: false,
    email_sent: false,
    errors: []
  }

  // Send SMS via Twilio
  try {
    const smsMessage = `🔧 Hi ${data.customer_name}! Your Mobizilla repair booking for ${data.device_info} is confirmed! Tracking Code: ${data.tracking_code}. Track status: https://mobizilla.com/track/${data.tracking_code}`
    
    const smsResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: '+977-9801018203',
        Body: smsMessage
      })
    })

    if (smsResponse.ok) {
      results.sms_sent = true
      console.log('✅ SMS sent successfully!')
    } else {
      const error = await smsResponse.text()
      results.errors.push(`SMS failed: ${error}`)
    }
  } catch (error) {
    results.errors.push(`SMS error: ${error.message}`)
  }

  // Send Email via SendGrid  
  try {
    const emailData = {
      personalizations: [{
        to: [{ email: 'rayyanbusinessofficial@gmail.com', name: data.customer_name }],
        subject: `🔧 Repair Booking Confirmed - ${data.tracking_code}`
      }],
      from: {
        email: 'rayyanbusinessofficial@gmail.com',
        name: 'Mobizilla Support'
      },
      content: [{
        type: 'text/html',
        value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">🔧 Mobizilla</h1>
              <p style="color: white; margin: 10px 0 0 0;">Repair Booking Confirmed!</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Hi ${data.customer_name}! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Great news! Your repair booking has been successfully confirmed. Our expert technicians will take great care of your device.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #333; margin-top: 0;">📋 Booking Details</h3>
                <p><strong>Tracking Code:</strong> <span style="color: #667eea; font-weight: bold;">${data.tracking_code}</span></p>
                <p><strong>Device:</strong> ${data.device_info}</p>
                <p><strong>Estimated Cost:</strong> ₨${data.estimated_cost}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://mobizilla.com/track/${data.tracking_code}" 
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  📱 Track Your Repair
                </a>
              </div>
            </div>
          </div>
        `
      }]
    }

    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    if (emailResponse.ok) {
      results.email_sent = true
      console.log('✅ Email sent successfully!')
    } else {
      const error = await emailResponse.text()
      results.errors.push(`Email failed: ${error}`)
    }
  } catch (error) {
    results.errors.push(`Email error: ${error.message}`)
  }

  return results
}