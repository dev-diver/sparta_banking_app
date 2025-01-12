import { ID } from "@customTypes/Id";
import { Integer } from "@customTypes/Integer";
import { TransactionType } from "@enums/TransactionType";

export interface createTransactionDTO {
  Ttype: TransactionType;
  accountId: ID;
  counterpartyId: ID;
  amount: Integer;
}