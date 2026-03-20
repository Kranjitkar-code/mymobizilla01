import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

interface OTPRequest {
  phone_number: string
  otp: string
  type: 'repair' | 'buyback'
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone_number, otp, type }: OTPRequest = await req.json()

    console.log('📱 Supabase OTP Request:', { phone_number, otp, type })

    // Validate phone number
    if (!phone_number || phone_number.length < 10) {
      throw new Error('Invalid phone number provided')
    }

    // Generate OTP message based on type
    const message = type === 'repair'
      ? `🔧 Your Mobizilla Repair OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`
      : `💰 Your Mobizilla BuyBack OTP: ${otp}. Valid for 5 minutes.`

    console.log('📤 Sending SMS to:', phone_number)
    console.log('📝 Message:', message)

    // Send SMS via Twilio to user's actual phone number
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: phone_number, // Send to user's actual phone number
        Body: message
      })
    })

    const result = await response.json()
    console.log('🔄 Twilio Response:', result)

    if (response.ok) {
      console.log('✅ SMS sent successfully! SID:', result.sid)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'OTP sent successfully via Supabase + Twilio',
          sid: result.sid,
          phone: phone_number
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      console.error('❌ Twilio SMS error:', result)
      return new Response(
        JSON.stringify({
          success: false,
          error: result.message || 'Failed to send OTP via Twilio',
          details: result
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
  } catch (error) {
    console.error('❌ Error sending OTP:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})