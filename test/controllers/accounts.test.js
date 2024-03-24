import request from "supertest";
import app from "../src/app"; // Express 앱의 경로를 올바르게 지정하세요.

describe("계정 생성 test", () => {
	it("POST /accounts should create a new account", async () => {
		const response = await request(app)
			.post("/accounts") // 실제 경로로 변경하세요.
			.send({ accountName: "스파르타" })
			.expect(200);

		expect(response.body).toHaveProperty("id");
		expect(response.body.name).toEqual("스파르타");
	});
});
