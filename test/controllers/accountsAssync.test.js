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
