import express from "express";
import * as controller from "../controllers/accounts.js";
const router = express.Router();

router.post("/:accountId/deposit", controller.deposit);
router.post("/:accountId/withdraw", controller.withdraw);
router.post("/:accountId/transfer", controller.transfer);
router.get("/:accountId", controller.checkAccount);
router.post("/", controller.createAccount);

export default router;
