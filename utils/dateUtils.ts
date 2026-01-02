
/**
 * Formats a YYYY-MM-DD date string to DD/MM/YYYY.
 * If the input is already in DD/MM/YYYY or invalid, it returns it as is or a fallback.
 */
export const formatDateToBR = (dateStr: string | undefined): string => {
    if (!dateStr) return 'N/A';

    // Check if it's already DD/MM/YYYY (e.g. 01/01/2026)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;

    // Check if it's DD/MM (e.g. 14/10)
    if (/^\d{2}\/\d{2}$/.test(dateStr)) return dateStr;

    // Check if it's YYYY-MM-DD
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
        const [, year, month, day] = match;
        return `${day}/${month}/${year}`;
    }

    return dateStr;
};

/**
 * Normalizes any date string to YYYY-MM-DD for storage/calculation.
 */
export const normalizeToISO = (dateStr: string | undefined): string => {
    if (!dateStr) return '';

    // If it's DD/MM/YYYY
    const matchBR = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (matchBR) {
        const [, day, month, year] = matchBR;
        return `${year}-${month}-${day}`;
    }

    // If it's already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    return dateStr;
};
