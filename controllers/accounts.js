// /accounts

// POST /:accountId/deposit
export const deposit = (req, res, next) => {
	let { amount } = req.body;
	let { accountId } = req.params;

	// let account = {
	// 	id,
	// 	name,
	// 	balance,
	// };

	let data = {
		// type: "deposit",
		// time,
		// amount,
		// account,
	};

	res.json({ data });
};

//POST /:accountId/withdraw
export const withdraw = (req, res, next) => {
	let { amount } = req.body;
	let { accountId } = req.params;

	// let account = {
	// 	id,
	// 	name,
	// 	balance,
	// };

	let data = {
		// type: "withdraw",
		// time,
		// amount,
		// account,
	};

	res.json({ data });
};

// POST /:accountId/transfer
export const transfer = (req, res, next) => {
	let { recipientAccountId, amount } = req.body;
	let { accountId } = req.params;

	// let senderAccount = {
	// 	id,
	// 	name,
	// 	balance,
	// };

	// let recipientAccount = {
	// 	id,
	// 	name,
	// 	balance,
	// };

	let data = {
		// type: "transfer",
		// time,
		// senderAccount,
		// recipientAccount,
		// amount,
		// account,
	};

	res.json({ data });
};

// GET /:accountId
export const checkAccount = (req, res, next) => {
	let { accountId } = req.params;

	// let account = {
	// 	id,
	// 	name,
	// 	balance,
	// };

	let data = {
		// account,
		// transaction: [],
	};

	res.json({ data });
};

// POST /
export const createAccount = (req, res, next) => {
	let { accountName } = req.body;

	// let account = {
	// 	id,
	// 	name,
	// 	balance,
	// };

	let data = {
		// account,
	};

	res.json({ data });
};
