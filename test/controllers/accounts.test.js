import { Util } from "./util";

const util = new Util();

describe("계정 생성과 조회 set", () => {
	beforeEach(() => {
		util.init();
	});

	it("새 계정 만들기", async () => {
		const response = await util.createNewAccount("스파르타");
		util.verifyNewAccount(response, "스파르타", "1");
	});

	it("새 계정 만들고 조회", async () => {
		await util.createNewAccount("스파르타");
		const response = await util.checkAccount("1");
		util.verifyNewAccount(response, "스파르타", "1");
	});

	it("여러 계정 만들고 순서 바꿔 조회", async () => {
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

	it("없는 계좌 조회", async () => {
		const response = await util.checkAccount("1", 400);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌가 없습니다.");
	});
});

describe("입금과 출금 set", () => {
	beforeEach(async () => {
		util.init();
		await util.createNewAccount("스파르타");
	});

	it("입금", async () => {
		let response = await util.deposit("1", 50);
		let data = response.data;
		util.checkTransaction(data, "DEPOSIT", 0, 50, 50);
		console.log(data);

		let accountResponse = await util.checkAccount("1");
		data = accountResponse.data;
		expect(data.account.balance).toBe(50);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 50, 50);
	});

	it("입금 후 출금", async () => {
		await util.deposit("1", 150);
		let response = await util.withdraw("1", 100);
		let data = response.data;
		util.checkTransaction(data, "WITHDRAWAL", 1, 100, 50);
		console.log(data);

		let accountResponse = await util.checkAccount("1");
		data = accountResponse.data;
		expect(data.account.balance).toBe(50);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "WITHDRAWAL", 1, 100, 50);
	});

	it("계좌보다 많은 돈 출금", async () => {
		await util.deposit("1", 150);
		let response = await util.withdraw("1", 400, 400);
		console.log(response);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌보다 많은 돈을 인출할 수 없습니다.");

		let accountResponse = await util.checkAccount("1");
		let data = accountResponse.data;
		expect(data.account.balance).toBe(150);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 150, 150);
	});

	it("입금보다 많은 돈 출금", async () => {
		let response = await util.withdraw("1", 100, 400);
		console.log(response);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌보다 많은 돈을 인출할 수 없습니다.");

		let accountResponse = await util.checkAccount("1");
		let data = accountResponse.data;
		expect(data.account.balance).toBe(0);
		expect(data.transactions.length).toBe(0);
	});

	it("없는 계좌에 입금", async () => {
		let response = await util.deposit("2", 100, 400);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌가 없습니다.");
	});

	it("없는 계좌에서 출금", async () => {
		let response = await util.withdraw("2", 100, 400);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌가 없습니다.");
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

	it("단순 송금", async () => {
		let response = await util.transfer("1", "2", 100);
		let data = response.data;
		expect(response.success).toBe(true);
		util.checkTransaction(data, "SEND", 1, 100, 100);

		let sendAccountResponse = await util.checkAccount("1");
		data = sendAccountResponse.data;
		expect(data.account.balance).toBe(100);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "SEND", 1, 100, 100);

		let receiveAccountResponse = await util.checkAccount("2");
		data = receiveAccountResponse.data;
		expect(data.account.balance).toBe(200);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "RECEIVE", 0, 100, 200);
	});

	it("계좌보다 많은 돈 송금", async () => {
		let response = await util.transfer("1", "2", 500, 400);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌보다 많은 돈을 인출할 수 없습니다.");

		let sendAccountResponse = await util.checkAccount("1");
		let data = sendAccountResponse.data;
		expect(data.account.balance).toBe(200);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 200, 200);

		let receiveAccountResponse = await util.checkAccount("2");
		data = receiveAccountResponse.data;
		expect(data.account.balance).toBe(100);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 100, 100);
	});

	it("없는 계좌에서 송금", async () => {
		let response = await util.transfer("3", "2", 100, 400);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌가 없습니다.");

		let sendAccountResponse = await util.checkAccount("1");
		let data = sendAccountResponse.data;
		expect(data.account.balance).toBe(200);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 200, 200);

		let receiveAccountResponse = await util.checkAccount("2");
		data = receiveAccountResponse.data;
		expect(data.account.balance).toBe(100);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 100, 100);
	});

	it("없는 계좌로 송금", async () => {
		let response = await util.transfer("1", "3", 100, 400);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌가 없습니다.");

		let sendAccountResponse = await util.checkAccount("1");
		let data = sendAccountResponse.data;
		expect(data.account.balance).toBe(200);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 200, 200);

		let receiveAccountResponse = await util.checkAccount("2");
		data = receiveAccountResponse.data;
		expect(data.account.balance).toBe(100);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 100, 100);
	});

	it("없는 계좌에서 없는 계좌로 송금", async () => {
		let response = await util.transfer("5", "3", 100, 400);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌가 없습니다.");

		let sendAccountResponse = await util.checkAccount("1");
		let data = sendAccountResponse.data;
		expect(data.account.balance).toBe(200);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 200, 200);

		let receiveAccountResponse = await util.checkAccount("2");
		data = receiveAccountResponse.data;
		expect(data.account.balance).toBe(100);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 100, 100);
	});

	it("계좌보다 많은 돈 없는 계좌로 송금", async () => {
		let response = await util.transfer("1", "3", 500, 400);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌가 없습니다.");

		let sendAccountResponse = await util.checkAccount("1");
		let data = sendAccountResponse.data;
		expect(data.account.balance).toBe(200);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 200, 200);

		let receiveAccountResponse = await util.checkAccount("2");
		data = receiveAccountResponse.data;
		expect(data.account.balance).toBe(100);
		util.checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 100, 100);
	});
});
