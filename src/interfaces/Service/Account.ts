import { IAccountRepository } from "@interfaces/Repository/Account";
import { AccountEntity } from "@interfaces/Entity/Account";
import { ID , isId } from "@customTypes/Id";
import { Integer , isInteger } from "@customTypes/Integer";
import { Result } from "@interfaces/RepositoryDTO/Result";
import { AccountRepositoryDTO } from "@interfaces/RepositoryDTO/Account";
import { TransactionServiceDTO } from "@interfaces/serviceDTO/Transaction";
import { AccountServiceDTO } from "interfaces/serviceDTO/Account";

export interface IAccountService {
  createAccount(accountName: string): Promise<Result<AccountRepositoryDTO>>;
  checkAccount(accountId: ID): Promise<Result<AccountServiceDTO | undefined>>;
  deposit(accountId: ID, amount: Integer): Promise<Result<TransactionServiceDTO>>;
  withdraw(accountId: ID, amount: Integer): Promise<Result<TransactionServiceDTO>>;
  transfer(accountId: ID, recipientAccountId: ID, amount:Integer) : Promise<Result<TransactionServiceDTO>>;
}