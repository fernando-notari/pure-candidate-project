export function formatBlind(value: number): string {
  return value % 1 === 0 ? `$${value}` : `$${value.toFixed(2)}`;
}

export function getStakes(bigBlind: number) {
  const bb = bigBlind / 100;
  const sb = bb / 2;
  return { sb: formatBlind(sb), bb: formatBlind(bb) };
}

export function formatBalance(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatMemberCount(count: number): string {
  return `${count.toLocaleString()} members`;
}

export function darkenColor(hex: string, factor: number): string {
  const raw = hex.replace("#", "").slice(0, 6);
  const r = Math.round(parseInt(raw.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(raw.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(raw.slice(4, 6), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
