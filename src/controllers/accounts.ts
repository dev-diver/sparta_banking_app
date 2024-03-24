import { Request, Response, NextFunction } from 'express';
import { TransactionServiceDTO } from '@interfaces/serviceDTO/Transaction';
import { AccountServiceDTO } from '@interfaces/serviceDTO/Account';
import { Result } from "@interfaces/RepositoryDTO/Result";
import { InMemoryAccountRepository } from "../repositories/InMemoryAccount";
import { AccountService } from "../services/accountService";
import { IAccountService } from "@interfaces/Service/Account";
import { IAccountRepository } from "@interfaces/Repository/Account";
import { AccountRepositoryDTO } from "@interfaces/RepositoryDTO/Account";

const accountRepository : IAccountRepository= new InMemoryAccountRepository();
const accountService : IAccountService = new AccountService(accountRepository);

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { accountName } = req.body;
  let result : Result<AccountServiceDTO>
  let account : Result<AccountRepositoryDTO> = await accountService.createAccount(accountName);
  result = await accountService.checkAccount(account.data.id)
  req.result = result
  next()
};

export const checkAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { accountId } = req.params;
  let result : Result<AccountServiceDTO> = await accountService.checkAccount(accountId)
  req.result = result
  next()
};

export const deposit = async (req: Request, res: Response, next: NextFunction) => {
  const { amount } = req.body;
  const { accountId } = req.params;
  let result : Result<TransactionServiceDTO> = await accountService.deposit(accountId, amount);
  req.result = result
  next()
};

export const withdraw = async (req: Request, res: Response, next: NextFunction) => {
  const { amount } = req.body;
  const { accountId } = req.params;
  let result: Result<TransactionServiceDTO> = await accountService.withdraw(accountId, amount);
  req.result = result
  next()
};

export const transfer = async (req: Request, res: Response, next: NextFunction) => {
  const { recipientAccountId, amount } = req.body;
  const { accountId } = req.params;
  let result: Result<TransactionServiceDTO> = await accountService.transfer(accountId, recipientAccountId, amount)
  req.result = result
  next()
};