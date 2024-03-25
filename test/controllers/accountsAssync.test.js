import { Util } from "./util";
import request from "supertest";
const util = new Util();

describe("계정 생성과 조회 동시성 set", () => {
	beforeEach(() => {
		util.init();
	});

	it("다계정 만들기", async () => {
		let names = ["스파르타", "마가리타", "스파게티"];
		const apiCalls = names.map((name) => {
			return request(util.app).post("/accounts").send({ accountName: name });
		});

		const responses = await Promise.all(apiCalls);

		responses.forEach((response) => {
			expect(response.status).toBe(200);
			let data = response.body.data;
			expect(data.account.balance).toBe(0);
			expect(data).toHaveProperty("transactions");
			expect(Array.isArray(data.transactions)).toBe(true);
		});

		const ids = responses.map((response) => response.body.data.account.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);

		const returnedNames = responses.map((response) => response.body.data.account.name);
		names.forEach((name) => {
			expect(returnedNames).toContain(name);
		});
	});

	it("다계정 만들고 다량 조회", async () => {
		let names = ["스파르타", "마가리타", "스파게티"];
		const apiCalls = names.map((name) => {
			return request(util.app).post("/accounts").send({ accountName: name });
		});

		await Promise.all(apiCalls);

		const apiCalls2 = Array.from(names, (_, i) => (i + 1).toString()).map((id) => {
			return request(util.app).get(`/accounts/${id}`).send();
		});

		const responses = await Promise.all(apiCalls2);

		responses.forEach((response, idx) => {
			expect(response.status).toBe(200);
			let data = response.body.data;
			let id = (idx + 1).toString();
			expect(data.account).toHaveProperty("balance", 0);
			expect(data.account).toHaveProperty("id", id);
			expect(data).toHaveProperty("transactions");
			expect(Array.isArray(data.transactions)).toBe(true);
		});
	});

	it("다계정 만들고 없는 계좌 조회", async () => {
		let names = ["스파르타", "마가리타", "스파게티"];
		const apiCalls = names.map((name) => {
			return request(util.app).post("/accounts").send({ accountName: name });
		});

		await Promise.all(apiCalls);

		const apiCalls2 = Array.from(names, (_, i) => i.toString()).map((id) => {
			return request(util.app).get(`/accounts/${id}`).send();
		});

		const responses = await Promise.all(apiCalls2);

		expect(
			responses.some((response) => {
				return response.status != 200;
			})
		).toBe(true);
	});
});

describe("입금과 출금 동시성 set", () => {
	beforeEach(async () => {
		util.init();
		await util.createNewAccount("스파르타");
	});

	it("동시 입금", async () => {
		const amounts = [100, 200, 300];
		const sum = amounts.reduce((p, c) => p + c);
		const apiCalls = amounts.map((amount) => {
			return request(util.app).post("/accounts/1/deposit").send({ amount: amount });
		});

		await Promise.all(apiCalls);

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(sum);
		let transactions = accountResponse.transactions;
		let lastTransaction = transactions[transactions.length - 1];
		expect(lastTransaction.Ttype).toEqual("DEPOSIT");
		expect(lastTransaction.amountChangeType).toEqual(0);
		expect(lastTransaction.balance).toEqual(sum);
	});

	it("동시 출금", async () => {
		const initialDeposit = 600;
		await util.deposit("1", initialDeposit);
		const amounts = [100, 200, 300];
		const sum = amounts.reduce((p, c) => p + c);
		const apiCalls = amounts.map((amount) => {
			return request(util.app).post("/accounts/1/withdraw").send({ amount: amount });
		});

		await Promise.all(apiCalls);

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(initialDeposit - sum);
		let transactions = accountResponse.transactions;
		let lastTransaction = transactions[transactions.length - 1];
		expect(lastTransaction.Ttype).toEqual("WITHDRAWAL");
		expect(lastTransaction.amountChangeType).toEqual(1);
		expect(lastTransaction.balance).toEqual(initialDeposit - sum);
	});

	it("잔액보다 많은 경우가 있는 동시 출금 실패", async () => {
		const initialDeposit = 100;
		await util.deposit("1", initialDeposit);

		const amounts = [50, 70, 110];
		const apiCalls = amounts.map((amount) => {
			return request(util.app).post("/accounts/1/withdraw").send({ amount });
		});

		const responses = await Promise.all(apiCalls);

		const hasFailure = responses.some((response) => response.status !== 200);
		expect(hasFailure).toBe(true);

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBeLessThanOrEqual(initialDeposit);
		expect(accountResponse.account.balance).toBeGreaterThanOrEqual(0);
	});

	it("동시 입금 출금 성공", async () => {
		const initialDeposit = 100;
		await util.deposit("1", initialDeposit);
		const amounts = [100, -100, 100, -100, 100, -100];
		const sum = amounts.reduce((p, c) => p + c);
		const apiCalls = amounts.map((amount) => {
			if (amount >= 0) {
				return request(util.app).post("/accounts/1/deposit").send({ amount });
			} else {
				return request(util.app).post("/accounts/1/withdraw").send({ amount: -amount });
			}
		});

		await Promise.all(apiCalls);

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBe(initialDeposit + sum);
		let transactions = accountResponse.transactions;
		let lastTransaction = transactions[transactions.length - 1];
		expect(lastTransaction.balance).toEqual(initialDeposit + sum);
	});

	it("입금과 잔액보다 많은 출금이 있는 동시성 실패", async () => {
		const initialDeposit = 100;
		await util.deposit("1", initialDeposit);
		const amounts = [100, -150, 100, -100, 100, -300];
		const sum = amounts.reduce((p, c) => p + c);
		const apiCalls = amounts.map((amount) => {
			if (amount >= 0) {
				return request(util.app).post("/accounts/1/deposit").send({ amount });
			} else {
				return request(util.app).post("/accounts/1/withdraw").send({ amount: -amount });
			}
		});

		const responses = await Promise.all(apiCalls);

		const hasFailure = responses.some((response) => response.status !== 200);
		expect(hasFailure).toBe(true);

		let accountResponse = await util.checkAccount("1");
		expect(accountResponse.account.balance).toBeGreaterThanOrEqual(0);
	});
});
