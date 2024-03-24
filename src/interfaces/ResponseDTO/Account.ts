import { Account } from "@interfaces/Entity/Account";
import { Transaction } from "@interfaces/Entity/Transaction";

export interface AccountResponseDTO {
  account: Account;
  transactions : Transaction[];
}