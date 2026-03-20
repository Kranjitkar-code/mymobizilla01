<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Twilio Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Twilio SMS and voice services
    |
    */

    'account_sid' => env('TWILIO_SID'),
    'auth_token' => env('TWILIO_AUTH_TOKEN'),
    'from_phone' => env('TWILIO_PHONE_NUMBER'),

    /*
    |--------------------------------------------------------------------------
    | SendGrid Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for SendGrid email services
    |
    */

    'sendgrid_api_key' => env('SENDGRID_API_KEY'),
    'sendgrid_from_email' => env('SENDGRID_FROM_EMAIL'),
    'sendgrid_from_name' => env('SENDGRID_FROM_NAME', 'Mobizilla'),

    /*
    |--------------------------------------------------------------------------
    | Demo Configuration
    |--------------------------------------------------------------------------
    |
    | Demo phone and email for testing
    |
    */

    'demo_phone' => env('DEMO_PHONE_NUMBER'),
    'demo_email' => env('DEMO_EMAIL'),

];