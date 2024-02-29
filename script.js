const books = [];
const STORAGE_KEY = "BOOK_SHELF";

function generateId() {
 return Date.now();
}

function generateBookObject(id, title, author, year, isComplete) {
   const yearNumber = Number(year);
 return {
    id,
    title,
    author,
    year:yearNumber,
    isComplete,
 };
}

function findBook(bookId) {
 return books.find((book) => book.id === bookId);
}

function findBookIndex(bookId) {
 return books.findIndex((book) => book.id === bookId);
}

function isStorageExist() {
 if (typeof Storage === "undefined") {
    alert("Your browser does not support local storage");
    return false;
 }
 return true;
}

function saveData() {
 if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    console.log("Data saved successfully.");
    console.log(saveData)
    renderBooks();
 }
}

function loadDataFromStorage() {
 const serializedData = localStorage.getItem(STORAGE_KEY);
 const data = JSON.parse(serializedData) || [];
 books.push(...data);
 renderBooks();
}

function createElement(tag, text) {
 const element = document.createElement(tag);
 element.textContent = text;
 return element;
}

function removeBook(bookId) {
 const bookIndex = findBookIndex(bookId);
 if (bookIndex === -1) return;
 Swal.fire({
 title: 'Are you sure?',
 text: "You won't be able to revert this!",
 icon: 'warning',
 showCancelButton: true,
 confirmButtonColor: '#3085d6',
 cancelButtonColor: '#d33',
 confirmButtonText: 'Yes, delete it!'
}).then((result) => {
 if (result.isConfirmed) {
    books.splice(bookIndex, 1);
    renderBooks();
    saveData();
    searchBooks();
 }
})
}

function makeBook(bookObject) {
 const { id, title, author, year, isComplete } = bookObject;

 const container = document.createElement("div");
 container.classList.add("book-card");
 
 container.setAttribute("id", `book-${id}`);

 container.innerHTML = `
    <h2>${title}</h2>
    <p>Author: ${author}</p>
    <p>Year: ${year}</p>
    <div class="book-buttons">
      <button class="trash-button"><i class="fas fa-trash"></i></button>
      ${
        isComplete
          ? '<button class="undo-button"><i class="fas fa-undo"></i></button>'
          : '<button class="check-button"><i class="fas fa-check"></i></button>'
      }
    </div>
 `;

 const trashButton = container.querySelector(".trash-button");
 trashButton.addEventListener("click", () => {
    removeBook(id);
 });

 const toggleReadButton = container.querySelector(
    ".check-button, .undo-button"
 );
 toggleReadButton.addEventListener("click", () => {
    isComplete ? markAsUnread(id) : markAsRead(id);
 });

 return container;
}

function addBook(title, author, year, isComplete) {
 const generatedID = generateId();
 const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    isComplete
 );
 books.push(bookObject);

 renderBooks();
 saveData();
}

function markAsRead(bookId) {
 const book = findBook(bookId);
 if (!book) return;
 book.isComplete = true;
 renderBooks();
 saveData();
}

function markAsUnread(bookId) {
 const bookIndex = findBookIndex(bookId);
 if (bookIndex === -1) return;
 books[bookIndex].isComplete = false;
 renderBooks();
 saveData();
}

function renderBooks() {
 const unfinishedBooksList = document.getElementById("unfinished-books-list");
 const finishedBooksList = document.getElementById("finished-books-list");
 unfinishedBooksList.innerHTML = "";
 finishedBooksList.innerHTML = "";

 books.forEach((book) => {
    const bookElement = makeBook(book);
    book.isComplete
      ? finishedBooksList.appendChild(bookElement)
      : unfinishedBooksList.appendChild(bookElement);
 });
}

document.addEventListener("DOMContentLoaded", () => {
 const submitForm = document.getElementById("book_form");
 submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isComplete = document.getElementById("read").checked;
    addBook(title, author, year, isComplete);
 });

 if (isStorageExist()) {
    loadDataFromStorage();
 }

 const searchInput = document.getElementById("search-input");
 searchInput.addEventListener("input", searchBooks);
});

function searchBooks() {
 const searchInput = document.getElementById("search-input");
 const searchResultsContainer = document.getElementById("search-results");
 const searchQuery = searchInput.value.trim().toLowerCase();

 if (searchQuery === "") {
    searchResultsContainer.innerHTML = "";
    return;
 }

 const searchResults = books.filter(book => book.title.toLowerCase().includes(searchQuery));

 searchResultsContainer.innerHTML = "";
 searchResults.forEach(book => {
    const bookElement = makeBook(book);
    searchResultsContainer.appendChild(bookElement);
 });
}
console.log(books)