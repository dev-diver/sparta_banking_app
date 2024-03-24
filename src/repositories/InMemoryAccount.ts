import { IAccountRepository  } from "../interfaces/Repository/Account";
import { AccountEntity } from "@interfaces/Entity/Account";
import { ID } from "@customTypes/Id";
import { createTransactionDTO } from "@interfaces/RepositoryDTO/CreateTransactionDTO";
import { TransactionEntity } from "@interfaces/Entity/Transaction";
import { TransactionType } from "../enums/TransactionType.js";
import { AmountChangeType } from "../enums/AmountChange.js";
export class InMemoryAccountRepository implements IAccountRepository {
  
  private accounts: AccountEntity[] = [];
  private lastAccountId = 0;
  private lastTransactionId = 0;
  
  async createAccount(accountName: string): Promise<AccountEntity> {
    const newAccountId = (++this.lastAccountId).toString();
    const newAccount: AccountEntity = {
      id: newAccountId,
      name: accountName,
      balance: 0,
      transactions: []
    }
    console.log(newAccount);
    this.accounts.push(newAccount)
    return newAccount;
  };
  async findAccountById(accountId: ID): Promise<AccountEntity | null> {
    const account = this.accounts.find(account => account.id === accountId);
    return account || null;
  };

  async createTransaction(transactionRequest: createTransactionDTO): Promise<TransactionEntity> {
    const { accountId, amount } = transactionRequest;
    const account = await this.findAccountById(accountId);
    if (!account) throw new Error('계좌가 없습니다.');
    const newTransactionId = (++this.lastTransactionId).toString()

    let Ttype = transactionRequest.Ttype
    let changeType : AmountChangeType
    if(Ttype == TransactionType.Deposit || Ttype == TransactionType.Receive){
      changeType = AmountChangeType.Increase
    }
    else if(Ttype == TransactionType.Withdrawal || Ttype == TransactionType.Send){
      changeType = AmountChangeType.Decrease
    }

    if(changeType == AmountChangeType.Increase){
      account.balance += amount;
    }else if(changeType == AmountChangeType.Decrease){
      account.balance -= amount;
    }

    const newTransaction: TransactionEntity = {
      id: newTransactionId,
      Ttype: transactionRequest.Ttype,
      time: new Date(),
      accountId: accountId,
      counterpartyId: transactionRequest.counterpartyId,
      amountChangeType: changeType,
      amount: amount,
      balance: account.balance
    };

    console.log("Transaction", newTransaction)
    
    account.transactions.push(newTransaction);
    return newTransaction
  };
}