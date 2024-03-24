import { IAccountRepository } from "@interfaces/Repository/Account";
import { AccountEntity } from "@interfaces/Entity/Account";
import { ID , isId } from "../types/Id.js";
import { Integer , isInteger } from "../types/Integer.js";
import { Result } from "@interfaces/RepositoryDTO/Result";
import { AccountRepositoryDTO } from "@interfaces/RepositoryDTO/Account";
import { TransactionServiceDTO } from "@interfaces/serviceDTO/Transaction";
import { IAccountService } from "@interfaces/Service/Account";
import { AccountServiceDTO } from "interfaces/serviceDTO/Account.js";
import { TransactionType } from "../enums/TransactionType.js";
import { TransactionEntity } from "../interfaces/Entity/Transaction.js";
export class AccountService implements IAccountService {
  constructor(private accountRepository: IAccountRepository) {}

  transctionEntityToService(entity: TransactionEntity) : TransactionServiceDTO {
    let { Ttype, time, amountChangeType, amount, balance} = entity
    let dto : TransactionServiceDTO = {
      Ttype,
      time,
      amountChangeType,
      amount,
      balance
    }
    return dto
  }

  async createAccount(accountName: string): Promise<Result<AccountRepositoryDTO>>{
    let data : AccountEntity = await this.accountRepository.createAccount(accountName)
    return { success: true, data }
  }

  async checkAccount(accountId: ID): Promise<Result<AccountServiceDTO | undefined>>{
    if (!isId(accountId)) {
      return { success: false, error:'잘못된 아이디 요청'}
    }
    let accountEntity = await this.accountRepository.findAccountById(accountId)
    let data : AccountServiceDTO = {
      account: {
        id :accountEntity.id,
        name : accountEntity.name,
        balance : accountEntity.balance
      },
      transactions:accountEntity.transactions
    }
    return { success: true, data }
  }
  
  async deposit(accountId: ID, amount: Integer) : Promise<Result<TransactionServiceDTO>>{
    let entity :TransactionEntity = await this.accountRepository.createTransaction({
      Ttype: TransactionType.Deposit,
      accountId: accountId,
      counterpartyId: 'atm',
      amount: amount
    })
    let data : TransactionServiceDTO = this.transctionEntityToService(entity)
    return { success: true, data }
  }

  async withdraw(accountId: ID, amount: Integer) : Promise<Result<TransactionServiceDTO>>{
    let entity :TransactionEntity = await this.accountRepository.createTransaction({
      Ttype: TransactionType.Withdrawal,
      accountId: accountId,
      counterpartyId: 'atm',
      amount: amount
    })
    let data : TransactionServiceDTO = this.transctionEntityToService(entity)
    return { success: true, data }
  }

  async transfer(accountId: ID, recipientAccountId: ID, amount: Integer): Promise<Result<TransactionServiceDTO>>{
    let sendTransaction :TransactionEntity = await this.accountRepository.createTransaction({
      Ttype: TransactionType.Send,
      accountId: accountId,
      counterpartyId: recipientAccountId,
      amount: amount
    })
    let data : TransactionServiceDTO = this.transctionEntityToService(sendTransaction)
    let receiveTransaction :TransactionEntity = await this.accountRepository.createTransaction({
      Ttype: TransactionType.Receive,
      accountId: recipientAccountId,
      counterpartyId: accountId,
      amount: amount
    })
    return { success: true, data: data }
  }

}