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
		.get("/accounts/" + id) // 실제 경로로 변경하세요.
		.send()
		.expect(200);
	return response.body;
}

describe("계정 생성 test", () => {
	beforeEach(() => {
		app = createApp();
	});

	it("POST / 이름이 같은 새 계정을 만들어야 함", async () => {
		const response = await createNewAccount("스파르타");
		verifyNewAccount(response, "스파르타", "1");
	});

	it("GET /:accountId id가 같은 계정을 transaction과 함께 반환해야 함.", async () => {
		await createNewAccount("스파르타");
		const response = await checkAccount("1");
		verifyNewAccount(response, "스파르타", "1");
	});

	it("여러 계정을 만들고 조회해도 id가 같은 계정을 transaction과 함께 반환해야 함.", async () => {
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
