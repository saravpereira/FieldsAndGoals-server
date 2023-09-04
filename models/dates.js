function getDateRange(userStartDate, userEndDate) {
    const startDate = userStartDate || formatDate(new Date());
  
    const endDate = userEndDate || formatDate(new Date(new Date().setDate(new Date().getDate() + 7)));
  
    return {
      startDate,
      endDate
    };
  }
  
  function formatDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
  
  module.exports = {
    getDateRange,
  };
  