/**
 * Clase encargada de calcular el presupuesto total
 * Aplicando SRP (Single Responsibility Principle)
 */
export class BudgetCalculator {
  static calculate(
    partsCost: number,
    laborCost: number,
    discount: number = 0,
  ): number {
    const subtotal = partsCost + laborCost;
    const total = subtotal - subtotal * (discount / 100);

    // Redondeo a 2 decimales
    return Math.round(total * 100) / 100;
  }
}
