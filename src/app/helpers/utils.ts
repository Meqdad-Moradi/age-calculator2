/* eslint-disable @typescript-eslint/no-explicit-any */

export const matDateFormat = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/**
 * getNestedValue
 * Helper function to extract a nested property value from an object using a string path.
 * It supports dot notation and array indices, e.g., "name.common" or "capital[0]".
 * @param obj any
 * @param propertyPath string
 * @returns any
 */
function getNestedValue(obj: any, propertyPath: string): any {
  const regex = /([^[.\]]+)|\[(\d+)\]/g;
  const path: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(propertyPath)) !== null) {
    // match[1] is the property name, match[2] is the array index if available
    path.push(match[1] || match[2]);
  }

  return path.reduce((acc, key) => acc && acc[key], obj);
}

/**
 * compare
 * Factory function that returns a comparator function based on a nested property path.
 * The 'order' parameter allows sorting in 'asc' (default) or 'desc' order.
 * @param propertyPath string
 * @param order asc | desc
 * @returns number
 */
export function compare(propertyPath: string, order: 'asc' | 'desc' = 'asc') {
  return (a: any, b: any): number => {
    const valA = getNestedValue(a, propertyPath);
    const valB = getNestedValue(b, propertyPath);

    // Normalize strings to be compared case-insensitively
    const normA = typeof valA === 'string' ? valA.toUpperCase() : valA;
    const normB = typeof valB === 'string' ? valB.toUpperCase() : valB;

    if (normA < normB) {
      return order === 'asc' ? -1 : 1;
    } else if (normA > normB) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };
}
