/**
 * Format a phone number to +(90) XXX XXX XX XX while typing
 * @param {string} phone - The phone number string
 * @returns {string} Formatted phone number
 */ export function formatPhoneInput(phone) {
  let cleaned = phone.replace(/\D/g, ''); // remove non-digits
  if (cleaned.startsWith('90')) cleaned = cleaned.slice(2);
  else if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);

  const digits = cleaned.slice(0, 10);
  let result = '+(90) ';

  if (digits.length > 0) result += digits.slice(0, 3);
  if (digits.length > 3) result += ' ' + digits.slice(3, 6);
  if (digits.length > 6) result += ' ' + digits.slice(6, 8);
  if (digits.length > 8) result += ' ' + digits.slice(8, 10);

  return result.trim();
}

/**
 * Format a phone number to +(90) XXX XXX XX XX
 * @param {string} phone - The phone number string
 * @returns {string} Formatted phone number
 */
export function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 12) return phone;

  const country = cleaned.slice(0, 2);
  const match = cleaned.slice(2).match(/^(\d{3})(\d{3})(\d{4})$/);

  return match ? `+(${country}) ${match[1]} ${match[2]} ${match[3]}` : phone;
}

/**
 * Format a dates to dd/mm/yyyy
 * @param {string} date - The date string
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
