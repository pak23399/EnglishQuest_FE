export function getNodeString(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  return '';
}
