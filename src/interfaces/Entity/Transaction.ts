import { AmountChangeType } from '@enums/AmountChange';
import { TransactionType }  from '@enums/TransactionType'
import { ID } from '@customTypes/Id';
import { Integer } from '@customTypes/Integer';

export interface Transaction {
  id : ID;
  type: TransactionType;
  time: Date;
  accountId : ID;
  counterpartyId : ID;
  amountChangeType : AmountChangeType;
  amount: Integer;
  balance: Integer;
}
