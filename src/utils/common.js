export const formatDate = (dateString) => {
  if (!dateString) return '';

  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

