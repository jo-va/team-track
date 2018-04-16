export const isEmpty = (str) => !str || 0 === str.length;

export const isBlank = (str) => !str || str.trim().length === 0;

export const applyLetterSpacing = (string, count = 1) => {
    return string.split('').join('\u200A'.repeat(count));
};
