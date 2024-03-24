import { TransactionType } from "@enums/TransactionType";
import { Integer } from "@customTypes/Integer";
import { Account } from "@interfaces/Entity/Account";
import { AmountChangeType } from "@enums/AmountChange";

export interface TransactionResponseDTO {
  type: TransactionType;
  time: Date;
  amountChangeType: AmountChangeType;
  amount: Integer;
  account: Account;
}
