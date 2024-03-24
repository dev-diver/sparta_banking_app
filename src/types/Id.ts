export type ID = number;

export function isId(value: any): value is ID {
  return typeof value === 'number';
}