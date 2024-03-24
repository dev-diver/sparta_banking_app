import express from "express";
import { AccountController } from "../controllers/accounts";

export const setupAccountRoutes = () => {
  const router = express.Router();

  let controller = new AccountController();

  router.post("/:accountId/deposit", controller.deposit.bind(controller));
  router.post("/:accountId/withdraw", controller.withdraw.bind(controller));
  router.post("/:accountId/transfer", controller.transfer.bind(controller));
  router.get("/:accountId", controller.checkAccount.bind(controller));
  router.post("/", controller.createAccount.bind(controller));
  
  return router;
}

