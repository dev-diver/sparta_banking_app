import { Request, Response, NextFunction } from 'express';
import { TransactionServiceDTO } from '@interfaces/serviceDTO/Transaction';
import { AccountServiceDTO } from '@interfaces/serviceDTO/Account';
import { Result } from "@interfaces/RepositoryDTO/Result";

import { IAccountService } from "@interfaces/Service/Account";
import { AccountRepositoryDTO } from "@interfaces/RepositoryDTO/Account";
import { InMemoryAccountRepository } from '../repositories/InMemoryAccount';
import { AccountService } from "../services/accountService";
import { IAccountRepository } from "@interfaces/Repository/Account";
export class AccountController {

  private accountService: IAccountService
  private accountRepository : IAccountRepository;

  constructor(){
    this.accountRepository = new InMemoryAccountRepository();
    this.accountService = new AccountService(this.accountRepository)
  }

  public createAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { accountName } = req.body;
    let result : Result<AccountServiceDTO>
    let account : Result<AccountRepositoryDTO> = await this.accountService.createAccount(accountName);
    result = await this.accountService.checkAccount(account.data.id)
    req.result = result
    next()
  };
  
  public checkAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { accountId } = req.params;
    let result : Result<AccountServiceDTO> = await this.accountService.checkAccount(accountId)
    req.result = result
    next()
  };
  
  public deposit = async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    const { accountId } = req.params;
    let result : Result<TransactionServiceDTO> = await this.accountService.deposit(accountId, amount);
    req.result = result
    next()
  };
  
  public withdraw = async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    const { accountId } = req.params;
    let result: Result<TransactionServiceDTO> = await this.accountService.withdraw(accountId, amount);
    req.result = result
    next()
  };
  
  public transfer = async (req: Request, res: Response, next: NextFunction) => {
    const { recipientAccountId, amount } = req.body;
    const { accountId } = req.params;
    let result: Result<TransactionServiceDTO> = await this.accountService.transfer(accountId, recipientAccountId, amount)
    req.result = result
    next()
  };
}


