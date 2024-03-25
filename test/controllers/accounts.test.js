import { Util } from "./util";

const util = new Util();

describe("계정 생성과 조회 set", () => {
	beforeEach(() => {
		util.init();
	});

	it("새 계정 만들기 성공", async () => {
		const response = await util.createNewAccount("스파르타");
		util.verifyNewAccount(response, "스파르타", "1");
	});

	it("새 계정 만들고 조회 성공", async () => {
		await util.createNewAccount("스파르타");
		const response = await util.checkAccount("1");
		util.verifyNewAccount(response, "스파르타", "1");
	});

	it("여러 계정 만들고 순서 바꿔 조회 성공", async () => {
		await util.createNewAccount("스파르타");
		await util.createNewAccount("스파게티");
		await util.createNewAccount("마가리타");
		const response1 = await util.checkAccount("1");
		const response3 = await util.checkAccount("3");
		const response2 = await util.checkAccount("2");
		util.verifyNewAccount(response1, "스파르타", "1");
		util.verifyNewAccount(response2, "스파게티", "2");
		util.verifyNewAccount(response3, "마가리타", "3");
	});

	it("없는 계좌 조회 실패", async () => {
		const response = await util.checkAccount("1", false);
		expect(response).toBe("계좌가 없습니다.");
	});
});

describe("입금과 출금 set", () => {
	beforeEach(async () => {
		util.init();
		await util.createNewAccount("스파르타");
	});

	it("입금 성공", async () => {
		let depositResponse = await util.deposit("1", 50);
		util.checkTransaction(depositResponse, "DEPOSIT", 0, 50, 50);

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(50);
		let transactions = accountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "DEPOSIT", 0, 50, 50);
	});

	it("입금 후 출금 성공", async () => {
		await util.deposit("1", 150);
		let response = await util.withdraw("1", 100);
		util.checkTransaction(response, "WITHDRAWAL", 1, 100, 50);

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(50);
		let transactions = accountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "WITHDRAWAL", 1, 100, 50);
	});

	it("계좌보다 많은 돈 출금 실패", async () => {
		const initialDeposit = 150;
		await util.deposit("1", initialDeposit);
		let response = await util.withdraw("1", 400, false);
		expect(response).toBe("계좌보다 많은 돈을 인출할 수 없습니다.");

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(initialDeposit);
		let transactions = accountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "DEPOSIT", 0, initialDeposit, initialDeposit);
	});

	it("입금없이 출금 실패", async () => {
		let response = await util.withdraw("1", 100, false);
		expect(response).toBe("계좌보다 많은 돈을 인출할 수 없습니다.");

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(0);
		expect(accountResponse.transactions.length).toBe(0);
	});

	it("0원 입금 실패", async () => {
		let depositResponse = await util.deposit("1", 0, false);
		expect(depositResponse).toBe("금액은 0보다 커야합니다.");

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(0);
		expect(accountResponse.transactions.length).toBe(0);
	});

	it("음수 입금 실패", async () => {
		let depositResponse = await util.deposit("1", -100, false);
		expect(depositResponse).toBe("금액은 0보다 커야합니다.");

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(0);
		expect(accountResponse.transactions.length).toBe(0);
	});

	it("0원 출금 실패", async () => {
		const initialDeposit = 150;
		await util.deposit("1", initialDeposit);
		let depositResponse = await util.withdraw("1", 0, false);
		expect(depositResponse).toBe("금액은 0보다 커야합니다.");

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(initialDeposit);
		let transactions = accountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "DEPOSIT", 0, initialDeposit, initialDeposit);
	});

	it("음수 출금 실패", async () => {
		const initialDeposit = 150;
		await util.deposit("1", initialDeposit);
		let depositResponse = await util.withdraw("1", -100, false);
		expect(depositResponse).toBe("금액은 0보다 커야합니다.");

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(initialDeposit);
		let transactions = accountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "DEPOSIT", 0, initialDeposit, initialDeposit);
	});

	it("없는 계좌에 입금 실패", async () => {
		let response = await util.deposit("2", 100, false);
		expect(response).toBe("계좌가 없습니다.");
	});

	it("없는 계좌에서 출금 실패", async () => {
		let response = await util.withdraw("2", 100, false);
		expect(response).toBe("계좌가 없습니다.");
	});
});

describe("송금 set", () => {
	beforeEach(async () => {
		util.init();
		await util.createNewAccount("스파르타");
		await util.createNewAccount("마가리타");
		await util.deposit("1", 200);
		await util.deposit("2", 100);
	});

	async function validateNoChange() {
		let sendAccountResponse = await util.checkAccount("1");
		expect(sendAccountResponse.account.balance).toBe(200);
		let transactions = sendAccountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "DEPOSIT", 0, 200, 200);

		let receiveAccountResponse = await util.checkAccount("2");
		expect(receiveAccountResponse.account.balance).toBe(100);
		transactions = receiveAccountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "DEPOSIT", 0, 100, 100);
	}

	it("단순 송금", async () => {
		let response = await util.transfer("1", "2", 100);
		util.checkTransaction(response, "SEND", 1, 100, 100);

		let sendAccountResponse = await util.checkAccount("1");
		expect(sendAccountResponse.account.balance).toBe(100);
		let transactions = sendAccountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "SEND", 1, 100, 100);

		let receiveAccountResponse = await util.checkAccount("2");
		expect(receiveAccountResponse.account.balance).toBe(200);
		transactions = receiveAccountResponse.transactions;
		util.checkTransaction(transactions[transactions.length - 1], "RECEIVE", 0, 100, 200);
	});

	it("계좌보다 많은 돈 송금 실패", async () => {
		let response = await util.transfer("1", "2", 500, false);
		expect(response).toBe("계좌보다 많은 돈을 인출할 수 없습니다.");
		await validateNoChange();
	});

	it("0원 송금 실패", async () => {
		let response = await util.transfer("1", "2", 0, false);
		expect(response).toBe("금액은 0보다 커야합니다.");
		await validateNoChange();
	});

	it("음수 송금 실패", async () => {
		let response = await util.transfer("1", "2", -100, false);
		expect(response).toBe("금액은 0보다 커야합니다.");
		await validateNoChange();
	});

	it("없는 계좌에서 송금 실패", async () => {
		let response = await util.transfer("3", "2", 100, false);
		expect(response).toBe("계좌가 없습니다.");
		await validateNoChange();
	});

	it("없는 계좌로 송금 실패", async () => {
		let response = await util.transfer("1", "3", 100, false);
		expect(response).toBe("계좌가 없습니다.");
		await validateNoChange();
	});

	it("없는 계좌에서 없는 계좌로 송금 실패", async () => {
		let response = await util.transfer("5", "3", 100, false);
		expect(response).toBe("계좌가 없습니다.");
	});

	it("계좌보다 많은 돈, 없는 계좌로 송금 실패", async () => {
		let response = await util.transfer("1", "3", 500, false);
		expect(response).toBe("계좌가 없습니다.");
		await validateNoChange();
	});
});
