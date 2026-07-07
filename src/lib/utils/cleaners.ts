/**
 * Removes country codes, spaces, and special characters from a phone number.
 * Ensures the output only contains digits and represents the local number.
 * Example: "+91 98765-43210" -> "9876543210"
 * Example: "001 (555) 123-4567" -> "5551234567"
 */
export const cleanPhoneNumber = (rawPhone: string): string => {
  if (!rawPhone) return '';
  
  // Strip all non-numeric characters
  let digits = rawPhone.replace(/\D/g, '');
  
  // Remove 00 prefix if present
  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }
  
  if (digits.length > 10) {
    if (digits.startsWith('91') && digits.length === 12) { // India
      return digits.substring(2);
    }
    if (digits.startsWith('1') && digits.length === 11) { // US/Canada
      return digits.substring(1);
    }
    if (digits.startsWith('44') && digits.length === 12) { // UK
      return digits.substring(2);
    }
    if (digits.startsWith('61') && digits.length === 11) { // Australia
      return digits.substring(2);
    }
    
    // Fallback: If it's really long, just take the last 10 digits as a best guess 
    // for standard mobile numbers in many regions.
    return digits.slice(-10);
  }
  
  return digits;
};

/**
 * Validates and cleans an email address.
 */
export const cleanEmail = (rawEmail: string): string | null => {
  if (!rawEmail) return null;
  const cleaned = rawEmail.trim().toLowerCase();
  
  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : null;
};

/**
 * Formats a date string into ISO format, or returns null if invalid.
 */
export const formatDateISO = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};
