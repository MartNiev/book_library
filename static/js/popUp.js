function createSection() {}

function getSelectedBook(objId, bookObject) {
	for (const key in bookObject) {
		if (objId == bookObject[key].id) {
			return bookObject[key];
		}
	}
}

function createSubSection(bookObject) {
	let cardSubSection = document.createElement("div");
	cardSubSection.id = "cardSubSection";

	let infoSection = document.createElement("div");
	infoSection.id = "infoSection";

	let title = document.createElement("p");
	setTextContentAndId(title, "titlePopUp", "Title: " + bookObject.title);

	let author = document.createElement("p");
	setTextContentAndId(author, "authorPopUp", "Author: " + bookObject.author);

	let quantity = document.createElement("p");
	setTextContentAndId(quantity, "quantityPopUp", "Quantity: " + bookObject.quantity);

	infoSection.appendChild(title);
	infoSection.appendChild(author);
	infoSection.appendChild(quantity);
	cardSubSection.appendChild(infoSection);

	let buttons = document.createElement("div");
	buttons.id = "buttons";

	let checkoutButton = document.createElement("button");
	checkoutButton.type = "button";
	checkoutButton.id = "checkoutButton";
	checkoutButton.textContent = "Checkout Book";
	checkoutButton.setAttribute("onclick", "checkoutBook()");

	let returnButton = document.createElement("button");
	returnButton.type = "button";
	returnButton.id = "returnButton";
	returnButton.textContent = "Return Book";
	returnButton.setAttribute("onclick", "returnBook()");

	buttons.appendChild(checkoutButton);
	buttons.appendChild(returnButton);
	cardSubSection.appendChild(buttons);

	return cardSubSection;
}

function createCardPopUp(bookObject) {
	let card = document.createElement("div");

	let buttonContainer = document.createElement("div");
	buttonContainer.id = "buttonContainer";

	let xClose = document.createElement("button");
	let closeIcon = document.createElement("img");
	closeIcon.src = "/static/icons/close.svg";
	xClose.appendChild(closeIcon);

	buttonContainer.appendChild(xClose);

	xClose.id = "closeButton";
	xClose.setAttribute("onclick", "closePopUp()");

	let imageSection = document.createElement("div");
	imageSection.id = "imageSectionPopUp";
	let img = document.createElement("img");
	img.id = "bookImage";
	img.src = bookObject.imageSrc;

	img.alt = "Book Image";
	imageSection.appendChild(img);

	let cardSubSection = createSubSection(bookObject);

	card.appendChild(buttonContainer);
	card.appendChild(imageSection);
	card.appendChild(cardSubSection);

	return card;
}

let currrentCard;

function openCard(id) {
	let bookObject = JSON.parse(localStorage.getItem("books"));

	currrentCard = document.getElementById(id);
	currrentCard.className = "cardClicked";

	let selectedBook = getSelectedBook(id, bookObject);
	localStorage.setItem("selectedBook", JSON.stringify(selectedBook));

	let popUpContainer = document.createElement("div");
	popUpContainer.id = "popUpContainer";
	document.getElementById("popUpSection").appendChild(popUpContainer);

	const card = createCardPopUp(selectedBook);
	card.id = "popUpCard";
	popUpContainer.appendChild(card);
}

function closePopUp() {
	document.getElementById("popUpContainer").remove();
	currrentCard.className = "card";
	// window.location.href = "/";
}
