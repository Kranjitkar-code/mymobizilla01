// Phone number formatter service

export class PhoneNumberFormatter {
  /**
   * Format phone number for international SMS
   */
  static formatPhoneNumber(phone: string): string {
    console.log('Formatting phone number:', phone);
    const cleanPhone = phone.replace(/\D/g, '');
    console.log('Cleaned phone number:', cleanPhone);
    
    if (cleanPhone.startsWith('977') && cleanPhone.length === 13) {
      const formatted = `+${cleanPhone}`;
      console.log('Formatted as:', formatted);
      return formatted;
    }
    
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      const formatted = `+977${cleanPhone.substring(1)}`;
      console.log('Formatted as:', formatted);
      return formatted;
    }
    
    if (cleanPhone.length === 10) {
      const formatted = `+977${cleanPhone}`;
      console.log('Formatted as:', formatted);
      return formatted;
    }
    
    if (phone.startsWith('+')) {
      console.log('Already formatted as:', phone);
      return phone;
    }
    
    const formatted = `+977${cleanPhone}`;
    console.log('Default formatted as:', formatted);
    return formatted;
  }
}