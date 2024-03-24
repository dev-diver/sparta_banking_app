import { AccountEntity } from "@interfaces/Entity/Account";
import { ID } from "@customTypes/Id";
import { TransactionEntity } from "@interfaces/Entity/Transaction";
import { createTransactionDTO } from "@interfaces/RepositoryDTO/CreateTransactionDTO";

export interface IAccountRepository {
  createAccount(accountName: string): Promise<AccountEntity>;
  findAccountById(accountId: ID): Promise<AccountEntity | null>;
  createTransaction(transactionRequest: createTransactionDTO): Promise<TransactionEntity>;
}