function setTextContentAndId(element, elemId, text) {
	element.textContent = text;
	element.id = elemId;
}

function createCard(bookObject) {
	let card = document.createElement("div");
	card.className = "card";
	let objId = bookObject.id;
	card.id = objId;
	let onClick = `openCard(${objId})`;
	card.setAttribute("onclick", onClick);

	let imageSection = document.createElement("div");
	imageSection.id = "imageSection";
	let img = document.createElement("img");
	img.id = "bookImage";
	img.src = bookObject.imageSrc;

	img.alt = "Book Image";
	imageSection.appendChild(img);

	let titleSection = document.createElement("div");
	titleSection.id = "titleSection";
	let title = document.createElement("p");
	setTextContentAndId(title, "title", "Title: " + bookObject.title);
	titleSection.appendChild(title);

	let authorSection = document.createElement("div");
	authorSection.id = "authorSection";
	let author = document.createElement("p");
	setTextContentAndId(author, "author", "Author: " + bookObject.author);
	authorSection.appendChild(author);

	let quantitySection = document.createElement("div");
	quantitySection.id = "quantitySection";
	let quantity = document.createElement("p");
	setTextContentAndId(quantity, "quantity", "Quantity: " + bookObject.quantity);
	quantitySection.appendChild(quantity);

	card.appendChild(imageSection);
	card.appendChild(titleSection);
	card.appendChild(authorSection);
	card.appendChild(quantitySection);

	return card;
}

function addCardAnimation() {
	let cards = document.getElementsByClassName("card");

	if (!cards) return alert("Card Element Does Not Exist");

	for (const card of cards) {
		card.classList.add("startUpAnimation");

		card.addEventListener("animationend", () => {
			card.classList.remove("startUpAnimation");
		});

		card.addEventListener("mouseleave", () => {
			card.classList.add("unHover");
			card.addEventListener("animationend", () => {
				card.classList.remove("unHover");
			});
		});
	}
}

function displayingDataInCards(books) {
	let bookContainer = document.getElementById("cardsContainer");

	let object = {};

	for (const key in books) {
		object[key] = books[key];
		let bookObject = books[key];
		let card = createCard(bookObject);
		bookContainer.appendChild(card);
	}

	localStorage.setItem("books", JSON.stringify(object));

	addCardAnimation();
}

async function getBooks() {
	try {
		let response = await fetch("/books", {
			method: "GET",
		});

		let books = await response.json();
		console.log(books);

		if (response.ok) {
			displayingDataInCards(books);
		}
	} catch (err) {
		console.log("Error: " + err);
	}
}

getBooks();
