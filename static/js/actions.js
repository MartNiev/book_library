function changeQuantity(id, res) {
	let quantity = document.getElementById("quantity" + id);
	let quantityPopUp = document.getElementById("quantityPopUp");

	quantity.textContent = "Quantity: " + res.quantity;
	quantityPopUp.textContent = "Quantity: " + res.quantity;
}

function checkoutBook() {
	let selectedBook = JSON.parse(localStorage.getItem("selectedBook"));
	console.log(selectedBook);

	async function checkoutRequest(id) {
		try {
			let response = await fetch(`/checkout?id=${id}`, { method: "PATCH" });

			let res = await response.json();
			// console.log(res);

			if (res.message && res.message === "Book not available.") return alert("Book not available.");

			changeQuantity(id, res);
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

			changeQuantity(id, res);
		} catch (err) {
			console.log("Error: ", err);
		}
	}

	returnRequest(selectedBook.id);
}
