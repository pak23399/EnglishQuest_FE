export function getFileNameFromContentDisposition(
  disposition?: string,
): string {
  if (!disposition) return 'downloaded-file';

  // Ưu tiên filename*
  const filenameStarMatch = disposition.match(/filename\*\=([^;]+)/i);
  if (filenameStarMatch) {
    // Thường có dạng UTF-8''tenfile.log
    const encoded = filenameStarMatch[1].trim();
    const parts = encoded.split("''");
    if (parts.length === 2) {
      try {
        return decodeURIComponent(parts[1]);
      } catch {
        return parts[1]; // fallback
      }
    }
    return encoded;
  }

  // Nếu không có filename* thì lấy filename
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
  if (filenameMatch?.[1]) {
    return filenameMatch[1];
  }

  return 'downloaded-file';
}

export const showDownloadFile = (response: any) => {
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);

  const contentDisposition = response.headers['content-disposition'];
  const fileName = getFileNameFromContentDisposition(contentDisposition);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
