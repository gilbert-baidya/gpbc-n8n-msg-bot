// Utility function to normalize user input from SMS messages

/**
 * Normalizes user input for consistent command matching
 * @param {string} input - Raw input string from SMS
 * @returns {string} Normalized input (lowercase, trimmed) or empty string if invalid
 */
function normalizeInput(input) {
  // Handle null, undefined, or non-string values
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Convert to lowercase and trim whitespace
  return input.trim().toLowerCase();
}

module.exports = normalizeInput;
