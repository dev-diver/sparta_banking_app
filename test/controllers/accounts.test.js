import request from "supertest";
import { createApp } from "../../src/app";

function verifyNewAccount(response, expectedName, id) {
	expect(response).toHaveProperty("success", true);
	expect(response).toHaveProperty("data");
	expect(response.data.account).toHaveProperty("balance", 0);
	expect(response.data.account).toHaveProperty("id", id);
	expect(response.data.account).toHaveProperty("name", expectedName);
	expect(response.data).toHaveProperty("transactions");
	expect(Array.isArray(response.data.transactions)).toBe(true);
}

let app;

async function createNewAccount(name) {
	const response = await request(app)
		.post("/accounts") // 실제 경로로 변경하세요.
		.send({ accountName: name })
		.expect(200);
	return response.body;
}

async function checkAccount(id) {
	const response = await request(app)
		.get(`/accounts/${id}`) // 실제 경로로 변경하세요.
		.send()
		.expect(200);
	return response.body;
}

describe("계정 생성과 조회 set", () => {
	beforeEach(() => {
		app = createApp();
	});

	it("새 계정 만들기", async () => {
		const response = await createNewAccount("스파르타");
		verifyNewAccount(response, "스파르타", "1");
	});

	it("새 계정 만들고 조회", async () => {
		await createNewAccount("스파르타");
		const response = await checkAccount("1");
		verifyNewAccount(response, "스파르타", "1");
	});

	it("여러 계정 만들고 순서 바꿔 조회", async () => {
		await createNewAccount("스파르타");
		await createNewAccount("스파게티");
		await createNewAccount("마가리타");
		const response1 = await checkAccount("1");
		const response3 = await checkAccount("3");
		const response2 = await checkAccount("2");
		verifyNewAccount(response1, "스파르타", "1");
		verifyNewAccount(response2, "스파게티", "2");
		verifyNewAccount(response3, "마가리타", "3");
	});
});

async function deposit(id, amount) {
	const response = await request(app)
		.post(`/accounts/${id}/deposit`) // 실제 경로로 변경하세요.
		.send({ amount: amount })
		.expect(200);
	return response.body;
}

async function withdraw(id, amount, status = 200) {
	const response = await request(app)
		.post(`/accounts/${id}/withdraw`) // 실제 경로로 변경하세요.
		.send({ amount: amount })
		.expect(status);
	return response.body;
}

async function transfer(id, recipientId, amount) {
	const response = await request(app)
		.post(`/accounts/${id}/transfer`) // 실제 경로로 변경하세요.
		.send({ amount: amount })
		.expect(200);
	return response.body;
}

function checkTransaction(transaction, Ttype, amountChangeType, amount, balance) {
	expect(transaction.Ttype).toEqual(Ttype);
	expect(transaction.amountChangeType).toEqual(amountChangeType);
	expect(transaction.amount).toEqual(amount);
	expect(transaction.balance).toEqual(balance);
}

describe("입금과 출금 set", () => {
	beforeEach(async () => {
		app = createApp();
		await createNewAccount("스파르타");
	});

	it("입금", async () => {
		let response = await deposit("1", 50);
		let data = response.data;
		checkTransaction(data, "DEPOSIT", 0, 50, 50);
		console.log(data);

		let accountResponse = await checkAccount("1");
		data = accountResponse.data;
		expect(data.account.balance).toBe(50);
		checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 50, 50);
	});

	it("입금 후 출금", async () => {
		await deposit("1", 150);
		let response = await withdraw("1", 100);
		let data = response.data;
		checkTransaction(data, "WITHDRAWAL", 1, 100, 50);
		console.log(data);

		let accountResponse = await checkAccount("1");
		data = accountResponse.data;
		expect(data.account.balance).toBe(50);
		checkTransaction(data.transactions[data.transactions.length - 1], "WITHDRAWAL", 1, 100, 50);
	});

	it("계좌보다 많은 돈 출금", async () => {
		await deposit("1", 150);
		let response = await withdraw("1", 400, 400);
		console.log(response);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌보다 많은 돈을 인출할 수 없습니다.");

		let accountResponse = await checkAccount("1");
		let data = accountResponse.data;
		expect(data.account.balance).toBe(150);
		checkTransaction(data.transactions[data.transactions.length - 1], "DEPOSIT", 0, 150, 150);
	});

	it("입금보다 많은 돈 출금", async () => {
		let response = await withdraw("1", 100, 400);
		console.log(response);
		expect(response.success).toBe(false);
		expect(response.error).toBe("계좌보다 많은 돈을 인출할 수 없습니다.");

		let accountResponse = await checkAccount("1");
		let data = accountResponse.data;
		expect(data.account.balance).toBe(0);
		expect(data.transactions.length).toBe(0);
	});
});
