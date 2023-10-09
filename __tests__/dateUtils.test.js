const { getDateRange, getYesterdayDate, formatDateToLongString } = require('../utils/dateUtils');

describe('Date Utils', () => {
  test('getDateRange should return correct date range', () => {
    const { startDate, endDate } = getDateRange('20231005');
    expect(startDate).toBeDefined();
    expect(endDate).toBeDefined();
  });

  test('getYesterdayDate should return yesterday\'s date', () => {
    const yesterday = getYesterdayDate();
    expect(yesterday).toBeDefined();
  });

  test('formatDateToLongString should format date correctly', () => {
    const formattedDate = formatDateToLongString('20231005');
    expect(formattedDate).toBe('October 5, 2023');
  });
});