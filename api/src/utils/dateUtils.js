const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const formatDateForDB = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

module.exports = {
  isValidDate,
  formatDateForDB
}; 