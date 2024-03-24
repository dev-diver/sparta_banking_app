import createError from "http-errors";
import { Request, Response, NextFunction } from 'express';
import { TransactionResponseDTO } from '@interfaces/ResponseDTO/Transaction';
import { AccountResponseDTO } from '@interfaces/ResponseDTO/Account';
import { Account } from '@interfaces/Entity/Account';
// import { isInteger } from "@customTypes/Integer.js";
// import { isId } from "@customTypes/Id.js";

const accounts: Account[] = [];

export const deposit = (req: Request, res: Response, next: NextFunction) => {
  const { amount } = req.body;
  const { accountId } = req.params;

  // if (!isInteger(amount) || !isId(accountId)) {
  //   next(createError(400, '잘못된 타입 요청'))
  // }

  let data: Partial<TransactionResponseDTO> = {};

  res.json({ data });
};

export const withdraw = (req: Request, res: Response, next: NextFunction) => {
  const { amount } = req.body;
  const { accountId } = req.params;

  let data: Partial<TransactionResponseDTO> = {};

  res.json({ data });
};

export const transfer = (req: Request, res: Response, next: NextFunction) => {
  const { recipientAccountId, amount } = req.body;
  const { accountId } = req.params;

  let data: Partial<TransactionResponseDTO> = {};

  res.json({ data });
};

export const checkAccount = (req: Request, res: Response, next: NextFunction) => {
  const { accountId } = req.params;

  let data: Partial<AccountResponseDTO> = {};

  res.json({ data });
};

export const createAccount = (req: Request, res: Response, next: NextFunction) => {
  const { accountName } = req.body;

  let data: Partial<AccountResponseDTO> = {};

  res.json({ data });
};
