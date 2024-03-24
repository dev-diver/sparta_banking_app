import { Account } from "@interfaces/Entity/Account";
import { Transaction } from "@interfaces/Entity/Transaction";

export interface AccountServiceDTO {
  account: Account;
  transactions : Transaction[];
}