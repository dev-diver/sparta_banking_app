import { ID } from '@customTypes/Id'
import { Integer } from '@customTypes/Integer';
import { TransactionEntity } from './Transaction';

export interface AccountEntity {
  id: ID;
  name: string;
  balance: Integer;
  transactions : TransactionEntity[];
}