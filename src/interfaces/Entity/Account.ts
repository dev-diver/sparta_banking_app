import { ID } from '@customTypes/Id'
import { Integer } from '@customTypes/Integer';
import { Transaction } from './Transaction';

export interface Account {
  id: ID;
  name: string;
  balance: Integer;
  transactions : Transaction[];
}