export function separateThousands(num: number | undefined | null): string {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}
