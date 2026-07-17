export function trimForDiscord(text) {
  if (!text) return "The ronin has no words.";
  return text.length > 1900 ? `${text.slice(0, 1890)}...` : text;
}

export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}
