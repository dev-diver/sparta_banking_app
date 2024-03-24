import { IAccountRepository } from "@interfaces/Repository/Account";
import { Account } from "@interfaces/Entity/Account";
import { ID , isId } from "../types/Id.js";
import { Integer , isInteger } from "../types/Integer.js";
import { Result } from "@interfaces/RepositoryDTO/Result";
import { AccountRepositoryDTO } from "@interfaces/RepositoryDTO/Account";
import { TransactionRepositoryDTO } from "@interfaces/RepositoryDTO/Transaction";
import { IAccountService } from "@interfaces/Service/Account";

export class AccountService implements IAccountService {
  constructor(private accountRepository: IAccountRepository) {}

  createAccount(accountName: string): Result<AccountRepositoryDTO>{
    if (!isId(accountName)) {
      return { success: false, error:'잘못된 아이디 요청'}
    }
    let data = {
      id: '1',
      name: '스파르타',
      balance: 0
    }
    return { success: true, data }
  }

  checkAccount(accountId: ID): Result<Account | undefined>{
    return
  }
  
  deposit(accountId: ID, amount: Integer) : Result<TransactionRepositoryDTO>{
    return
  }

  withdraw(accountId: ID, amount: Integer) : Result<TransactionRepositoryDTO>{
    return
  }

  transfer(accountId: ID, recipientAccountId: ID, amount: Integer): Result<TransactionRepositoryDTO>{
    return
  }

}