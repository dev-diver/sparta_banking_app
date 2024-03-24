export type ID = string;

export function isId(value: any): value is ID {
  return typeof value === 'string';
}