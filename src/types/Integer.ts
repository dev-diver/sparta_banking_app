export type Integer = number;

export function isInteger(value: any): value is Integer {
  return Number.isInteger(value);
}

export function isAmount(value: any): value is Integer {
  return Number.isInteger(value) && value > 0
}