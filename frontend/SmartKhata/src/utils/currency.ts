/**
 * Utility for Indian Rupee (INR) formatting
 * Formats numbers into ₹1,000 or ₹25,500.00
 */
export const formatINR = (amount: number | null | undefined, showDecimals = false): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  try {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  } catch (error) {
    const formattedNum = Number(amount).toLocaleString('en-IN', {
      maximumFractionDigits: showDecimals ? 2 : 0,
    });
    return `₹${formattedNum}`;
  }
};
