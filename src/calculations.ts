export interface InvoiceLineInput {
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export interface InvoiceTotals {
  net: number;
  vat: number;
  gross: number;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateTotals(lines: InvoiceLineInput[]): InvoiceTotals {
  const net = roundMoney(lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0));
  const vat = roundMoney(lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice * line.vatRate) / 100, 0));
  return {
    net,
    vat,
    gross: roundMoney(net + vat)
  };
}
