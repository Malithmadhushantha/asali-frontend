// Currency utility functions for Sri Lankan Rupees (LKR)

/**
 * Format price in Sri Lankan Rupees
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: false for LKR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rs. 0';
  }

  const numericAmount = parseFloat(amount);
  
  if (showDecimals) {
    return `Rs. ${numericAmount.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  } else {
    return `Rs. ${Math.round(numericAmount).toLocaleString('en-LK')}`;
  }
};

/**
 * Format currency for admin/backend display (with decimals)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with decimals
 */
export const formatCurrencyDetailed = (amount) => {
  return formatCurrency(amount, true);
};

/**
 * Parse currency input (remove Rs. and commas)
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Numeric value
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== 'string') {
    return parseFloat(currencyString) || 0;
  }
  
  // Remove Rs., commas, and any whitespace
  const numericString = currencyString
    .replace(/Rs\.?\s*/g, '')
    .replace(/,/g, '')
    .trim();
  
  return parseFloat(numericString) || 0;
};

/**
 * Convert USD to LKR (approximate conversion for display)
 * Use this if you want to convert existing USD prices to LKR
 * @param {number} usdAmount - Amount in USD
 * @param {number} exchangeRate - USD to LKR exchange rate (default: ~325)
 * @returns {number} Amount in LKR
 */
export const convertUsdToLkr = (usdAmount, exchangeRate = 325) => {
  return usdAmount * exchangeRate;
};

/**
 * Currency symbol and info
 */
export const CURRENCY = {
  symbol: 'Rs.',
  code: 'LKR',
  name: 'Sri Lankan Rupee',
  locale: 'en-LK'
};