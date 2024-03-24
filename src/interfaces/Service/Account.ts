import { IAccountRepository } from "@interfaces/Repository/Account";
import { Account } from "@interfaces/Entity/Account";
import { ID , isId } from "@customTypes/Id";
import { Integer , isInteger } from "@customTypes/Integer";
import { Result } from "@interfaces/RepositoryDTO/Result";
import { AccountRepositoryDTO } from "@interfaces/RepositoryDTO/Account";
import { TransactionRepositoryDTO } from "@interfaces/RepositoryDTO/Transaction";

export interface IAccountService {
  createAccount(accountName: string): Result<AccountRepositoryDTO>;
  checkAccount(accountId: ID): Result<Account | undefined>;
  deposit(accountId: ID, amount: Integer): Result<TransactionRepositoryDTO>;
  withdraw(accountId: ID, amount: Integer): Result<TransactionRepositoryDTO>;
  transfer(accountId: ID, recipientAccountId: ID, amount:Integer) : Result<TransactionRepositoryDTO>;
}