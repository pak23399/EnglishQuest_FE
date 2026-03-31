export function normalizeString(str: string): string {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .normalize('NFD') // tách ký tự + dấu
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/[đð]/g, 'd'); // gộp luôn đ + Ð (eth)
}

export function advancedSearch(
  str: string | undefined | null,
  search: string | undefined | null,
): boolean {
  if (!search) return true;
  const normalizedStr = normalizeString(str ?? '');
  const normalizedSearch = normalizeString(search);
  return normalizedStr.includes(normalizedSearch);
  // return fuzzy(normalizedSearch, normalizedStr) >= threshold;
}

export function toAcronym(text: string | undefined | null): string {
  if (!text) return '';

  return normalizeString(text)
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .filter(Boolean) // bỏ chuỗi rỗng
    .map((word) => word[0].toUpperCase()) // lấy ký tự đầu, viết hoa
    .join('');
}
