export function getAvatarFallback(name: string): string {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    // 1 từ → lấy 2 ký tự đầu
    return parts[0].substring(0, 2).toUpperCase();
  }

  if (parts.length === 2) {
    // 2 từ → lấy chữ cái đầu của cả 2 từ
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // ≥ 3 từ → lấy chữ cái đầu của 2 từ cuối
  const last = parts[parts.length - 1][0];
  const secondLast = parts[parts.length - 2][0];

  return (secondLast + last).toUpperCase();
}
