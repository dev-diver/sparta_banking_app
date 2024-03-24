import { TransactionType } from "@enums/TransactionType";
import { Integer } from "@customTypes/Integer";
import { AccountEntity } from "@interfaces/Entity/Account";
import { AmountChangeType } from "@enums/AmountChange";

export interface TransactionServiceDTO {
  Ttype: TransactionType;
  time: Date;
  amountChangeType: AmountChangeType;
  amount: Integer;
  balance: Integer;
}
