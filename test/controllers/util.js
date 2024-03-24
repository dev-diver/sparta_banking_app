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

	async createNewAccount(name) {
		const response = await request(this.app).post("/accounts").send({ accountName: name }).expect(200);
		return response.body;
	}

	async checkAccount(id, status = 200) {
		const response = await request(this.app).get(`/accounts/${id}`).send().expect(status);
		return response.body;
	}

	async deposit(id, amount, status = 200) {
		const response = await request(this.app).post(`/accounts/${id}/deposit`).send({ amount: amount }).expect(status);
		return response.body;
	}

	async withdraw(id, amount, status = 200) {
		const response = await request(this.app).post(`/accounts/${id}/withdraw`).send({ amount: amount }).expect(status);
		return response.body;
	}

	transfer = async (id, recipientId, amount, status = 200) => {
		const response = await request(this.app)
			.post(`/accounts/${id}/transfer`)
			.send({ recipientAccountId: recipientId, amount: amount })
			.expect(status);
		return response.body;
	};

	verifyNewAccount(response, expectedName, id) {
		expect(response).toHaveProperty("success", true);
		expect(response).toHaveProperty("data");
		expect(response.data.account).toHaveProperty("balance", 0);
		expect(response.data.account).toHaveProperty("id", id);
		expect(response.data.account).toHaveProperty("name", expectedName);
		expect(response.data).toHaveProperty("transactions");
		expect(Array.isArray(response.data.transactions)).toBe(true);
	}

	checkTransaction(transaction, Ttype, amountChangeType, amount, balance) {
		expect(transaction.Ttype).toEqual(Ttype);
		expect(transaction.amountChangeType).toEqual(amountChangeType);
		expect(transaction.amount).toEqual(amount);
		expect(transaction.balance).toEqual(balance);
	}
}
