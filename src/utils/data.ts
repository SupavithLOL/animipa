
export function formatDate(dateString: string | Date, locale: string = "en-US") {
  const date = new Date(dateString);

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
