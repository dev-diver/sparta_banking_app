import createError from "http-errors";
import { Request, Response, NextFunction } from 'express';
import { TransactionServiceDTO } from '@interfaces/serviceDTO/Transaction';
import { AccountServiceDTO } from '@interfaces/serviceDTO/Account';
import { Result } from "@interfaces/RepositoryDTO/Result";
import { InMemoryAccountRepository } from "../repositories/InMemoryAccount.js";
import { AccountService } from "../services/accountService.js";
import { IAccountService } from "@interfaces/Service/Account";
import { IAccountRepository } from "@interfaces/Repository/Account";

const accountRepository : IAccountRepository= new InMemoryAccountRepository();
const accountService : IAccountService = new AccountService(accountRepository);

export const createAccount = (req: Request, res: Response, next: NextFunction) => {
  const { accountName } = req.body;

  next(createError(400, '잘못된 타입 요청'))
  let response : Result<AccountServiceDTO>
  res.json(response);
};

export const checkAccount = (req: Request, res: Response, next: NextFunction) => {
  const { accountId } = req.params;

  let data: Partial<AccountServiceDTO> = {};

  res.json({ data });
};

export const deposit = (req: Request, res: Response, next: NextFunction) => {
  const { amount } = req.body;
  const { accountId } = req.params;

  let response : Result<TransactionServiceDTO>
  res.json(response);
};

export const withdraw = (req: Request, res: Response, next: NextFunction) => {
  const { amount } = req.body;
  const { accountId } = req.params;

  let data: Partial<TransactionServiceDTO> = {};

  res.json({ data });
};

export const transfer = (req: Request, res: Response, next: NextFunction) => {
  const { recipientAccountId, amount } = req.body;
  const { accountId } = req.params;

  let data: Partial<TransactionServiceDTO> = {};

  res.json({ data });
};