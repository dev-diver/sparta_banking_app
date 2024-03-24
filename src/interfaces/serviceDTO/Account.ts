import { TransactionEntity } from "@interfaces/Entity/Transaction";
import { AccountRepositoryDTO } from "interfaces/RepositoryDTO/Account";

export interface AccountServiceDTO {
  account: AccountRepositoryDTO
  transactions : TransactionEntity[];
}