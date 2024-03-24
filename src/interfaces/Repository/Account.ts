import { Account } from "@interfaces/Entity/Account";
import { ID } from "@customTypes/Id";
import { Transaction } from "@interfaces/Entity/Transaction";
import { createTransactionDTO } from "@interfaces/RepositoryDTO/CreateTransactionDTO";

export interface IAccountRepository {
  createAccount(accountName: string): Promise<Account>;
  findAccountById(accountId: ID): Promise<Account | null>;
  createTransaction(transactionRequest: createTransactionDTO): Promise<Transaction>;
}