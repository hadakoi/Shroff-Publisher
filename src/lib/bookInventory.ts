type InventoryBook = {
  id: string;
  priceValue: number;
};

function digitSum(value: string) {
  return value
    .replace(/\D/g, "")
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

export function getSampleStock(book: InventoryBook) {
  const seed = digitSum(book.id) + Math.round(book.priceValue / 100);
  const stock = 4 + (seed % 17);
  return Math.max(1, stock);
}

export function getStockStatus(stock: number) {
  if (stock <= 0) {
    return { label: "Out of stock", tone: "text-rose-700" };
  }

  if (stock <= 4) {
    return { label: `Only ${stock} left`, tone: "text-amber-700" };
  }

  return { label: `In stock (${stock})`, tone: "text-emerald-700" };
}
