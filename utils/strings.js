export const flattenString = (value, replaceChar) => 
  value.replace(/\s+/g, replaceChar || '');