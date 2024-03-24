import { IAccountRepository  } from "../interfaces/Repository/Account";
import { Account } from "@interfaces/Entity/Account";
import { ID } from "@customTypes/Id";
import { createTransactionDTO } from "@interfaces/RepositoryDTO/CreateTransactionDTO";
import { Transaction } from "@interfaces/Entity/Transaction";

export class InMemoryAccountRepository implements IAccountRepository {
  
  private accounts: Account[] = [];
  
  createAccount(accountName: string): Promise<Account> {
    return
  };
  findAccountById(accountId: ID): Promise<Account | null> {
    return
  };
  createTransaction(transactionRequest: createTransactionDTO): Promise<Transaction> {
    return
  };
}