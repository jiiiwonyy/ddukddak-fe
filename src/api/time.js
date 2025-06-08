export function getLocalDateString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // 타임존 보정
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}
