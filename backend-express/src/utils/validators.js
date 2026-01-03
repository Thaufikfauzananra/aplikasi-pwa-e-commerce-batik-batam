// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Validation error formatter
export const formatValidationErrors = (errors) => {
  const formatted = {};
  for (const [field, messages] of Object.entries(errors)) {
    formatted[field] = Array.isArray(messages) ? messages : [messages];
  }
  return formatted;
};
