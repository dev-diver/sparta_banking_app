import { IAccountRepository } from "@interfaces/Repository/Account";
import { AccountEntity } from "@interfaces/Entity/Account";
import { ID , isId } from "../types/Id";
import { Integer , isInteger, isAmount } from "../types/Integer";
import { Result } from "@interfaces/RepositoryDTO/Result";
import { AccountRepositoryDTO } from "@interfaces/RepositoryDTO/Account";
import { TransactionServiceDTO } from "@interfaces/serviceDTO/Transaction";
import { IAccountService } from "@interfaces/Service/Account";
import { AccountServiceDTO } from "interfaces/serviceDTO/Account";
import { TransactionType } from "../enums/TransactionType";
import { TransactionEntity } from "../interfaces/Entity/Transaction";
import { Lock } from "./Lock"
export class AccountService implements IAccountService {

  private lock : Lock
  constructor(private accountRepository: IAccountRepository) {
    this.lock = new Lock();
  }

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
    try{
      let data : AccountEntity = await this.accountRepository.createAccount(accountName)
      return { success: true, data }
    }catch(error){
      return { success: false, error: error.message }
    }
    
  }

  async checkAccount(accountId: ID): Promise<Result<AccountServiceDTO | undefined>>{

    try{
      if (!isId(accountId)) {
        throw new Error('잘못된 아이디 요청')
      }
      let accountEntity : AccountEntity
      accountEntity = await this.accountRepository.findAccountById(accountId)
      let data : AccountServiceDTO = {
        account: {
          id :accountEntity.id,
          name : accountEntity.name,
          balance : accountEntity.balance
        },
        transactions:accountEntity.transactions
      }
      return { success: true, data }
    }catch(e){
      return { success: false, error: e.message}
    }
  }
  
  async deposit(accountId: ID, amount: Integer) : Promise<Result<TransactionServiceDTO>>{

    let release = await this.lock.acquire();
    try{
      if (!isAmount(amount)) {
        throw new Error('금액은 0보다 커야합니다.')
      }
      let entity :TransactionEntity = await this.accountRepository.createTransaction({
        Ttype: TransactionType.Deposit,
        accountId: accountId,
        counterpartyId: 'atm',
        amount: amount
      })
      let data : TransactionServiceDTO = this.transctionEntityToService(entity)
      return { success: true, data }
    }catch(error){
      return { success: false, error: error.message}
    }finally{
      release()
    }
    
  }

  async withdraw(accountId: ID, amount: Integer) : Promise<Result<TransactionServiceDTO>>{

    let release = await this.lock.acquire();
    try{
      if (!isAmount(amount)) {
        throw new Error('금액은 0보다 커야합니다.')
      }
      let entity :TransactionEntity = await this.accountRepository.createTransaction({
        Ttype: TransactionType.Withdrawal,
        accountId: accountId,
        counterpartyId: 'atm',
        amount: amount
      })
      let data : TransactionServiceDTO = this.transctionEntityToService(entity)
      return { success: true, data }
    }catch(error){
      return { success: false, error: error.message }
    }finally{
      release()
    }

  }

  async transfer(accountId: ID, recipientAccountId: ID, amount: Integer): Promise<Result<TransactionServiceDTO>>{

    let release = await this.lock.acquire();
    try{
      if (!isAmount(amount)) {
        throw new Error('금액은 0보다 커야합니다.')
      }
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
    }catch(error){
      return { success: false, error: error.message }
    }finally{
      release();
    }
  }

}