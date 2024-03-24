import { IAccountRepository  } from "../interfaces/Repository/Account";
import { AccountEntity } from "@interfaces/Entity/Account";
import { ID } from "@customTypes/Id";
import { createTransactionDTO } from "@interfaces/RepositoryDTO/CreateTransactionDTO";
import { TransactionEntity } from "@interfaces/Entity/Transaction";
import { TransactionType } from "../enums/TransactionType.js";
import { AmountChangeType } from "../enums/AmountChange.js";
export class InMemoryAccountRepository implements IAccountRepository {
  
  private accounts: AccountEntity[] = [];
  
  async createAccount(accountName: string): Promise<AccountEntity> {
    let data : AccountEntity = {
      id: '1',
      name: '스파르타',
      balance: 0,
      transactions:[]
    }
    return data
  };
  async findAccountById(accountId: ID): Promise<AccountEntity | null> {
    let data : AccountEntity = {
      id: '1',
      name: '스파르타',
      balance: 0,
      transactions:[]
    }
    return data
  };
  async createTransaction(transactionRequest: createTransactionDTO): Promise<TransactionEntity> {
    let data : TransactionEntity = {
      id : '1',
      Ttype: TransactionType.Deposit,
      time: new Date(),
      accountId : '1',
      counterpartyId : '2',
      amountChangeType : AmountChangeType.Increase,
      amount: 100,
      balance: 100
    }
    return data
  };
}