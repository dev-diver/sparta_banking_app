import { AmountChangeType } from '@enums/AmountChange';
import { TransactionType }  from '@enums/TransactionType'
import { ID } from '@customTypes/Id';
import { Integer } from '@customTypes/Integer';

export interface TransactionRepositoryDTO {
  id : ID;
  type: TransactionType;
  time: Date;
  amountChangeType : AmountChangeType;
  amount: Integer;
  balance: Integer;
}