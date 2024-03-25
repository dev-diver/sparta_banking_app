import { createApp } from "../../src/app";
import request from "supertest";

export class Util {
	app;

	counstructor() {
		this.init();
	}

	init() {
		this.app = createApp();
	}

	responseStatusTest(response, expectSuccess) {
		expect(response.status).toBe(expectSuccess ? 200 : 400);
	}

	responseWrap(response, expectSuccess) {
		let body = response.body;
		return expectSuccess ? body.data : body.error;
	}

	async createNewAccount(name, expectSuccess = true) {
		const response = await request(this.app).post("/accounts").send({ accountName: name });
		this.responseStatusTest(response, expectSuccess);
		return this.responseWrap(response, expectSuccess);
	}

	async checkAccount(id, expectSuccess = true) {
		const response = await request(this.app).get(`/accounts/${id}`).send();
		this.responseStatusTest(response, expectSuccess);
		return this.responseWrap(response, expectSuccess);
	}

	async deposit(id, amount, expectSuccess = true) {
		const response = await request(this.app).post(`/accounts/${id}/deposit`).send({ amount: amount });
		this.responseStatusTest(response, expectSuccess);
		return this.responseWrap(response, expectSuccess);
	}

	async withdraw(id, amount, expectSuccess = true) {
		const response = await request(this.app).post(`/accounts/${id}/withdraw`).send({ amount: amount });
		this.responseStatusTest(response, expectSuccess);
		return this.responseWrap(response, expectSuccess);
	}

	async transfer(id, recipientId, amount, expectSuccess = true) {
		const response = await request(this.app)
			.post(`/accounts/${id}/transfer`)
			.send({ recipientAccountId: recipientId, amount: amount });
		this.responseStatusTest(response, expectSuccess);
		return this.responseWrap(response, expectSuccess);
	}

	verifyNewAccount(response, expectedName, id) {
		expect(response.account).toHaveProperty("balance", 0);
		expect(response.account).toHaveProperty("id", id);
		expect(response.account).toHaveProperty("name", expectedName);
		expect(response).toHaveProperty("transactions");
		expect(Array.isArray(response.transactions)).toBe(true);
	}

	checkTransaction(transaction, Ttype, amountChangeType, amount, balance) {
		expect(transaction.Ttype).toEqual(Ttype);
		expect(transaction.amountChangeType).toEqual(amountChangeType);
		expect(transaction.amount).toEqual(amount);
		expect(transaction.balance).toEqual(balance);
	}
}
