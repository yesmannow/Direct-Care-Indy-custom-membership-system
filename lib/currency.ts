/**
 * Utility functions for formatting and converting prices
 * Prices are stored in cents (integers) in the database to avoid floating-point precision issues
 */

/**
 * Convert cents to dollars for display
 * @param cents - Price in cents (e.g., 300 for $3.00)
 * @returns Formatted currency string (e.g., "$3.00")
 */
export function formatCentsAsCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}

/**
 * Convert dollars to cents for storage
 * @param dollars - Price in dollars (e.g., 3.00)
 * @returns Price in cents (e.g., 300)
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars as a number
 * @param cents - Price in cents
 * @returns Price in dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Format currency (for prices already in dollars)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
