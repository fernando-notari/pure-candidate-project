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
