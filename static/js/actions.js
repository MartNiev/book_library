function checkoutBook() {
	let selectedBook = JSON.parse(localStorage.getItem("selectedBook"));
	console.log(selectedBook);

	async function checkoutRequest(id) {
		try {
			let response = await fetch(`/checkout?id=${id}`, { method: "PATCH" });

			let res = await response.json();

			console.log(res);
		} catch (err) {
			console.log("Error: ", err);
		}
	}

	checkoutRequest(selectedBook.id);
}

function returnBook() {
	let selectedBook = JSON.parse(localStorage.getItem("selectedBook"));

	async function returnRequest(id) {
		try {
			let response = await fetch(`/return?id=${id}`, { method: "PATCH" });

			let res = await response.json();

			console.log(res);
		} catch (err) {
			console.log("Error: ", err);
		}
	}

	returnRequest(selectedBook.id);
}
