export function joinWords(arr, separator = ', ') {
    if (!Array.isArray(arr)) return '';
    return arr.map(el => (el.name ? el.name : el)).join(separator);
}