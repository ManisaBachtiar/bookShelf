// Deklarasi variabel untuk menyimpan daftar buku
const books = [];
const STORAGE_KEY = "BOOK_SHELF";

// Fungsi untuk membuat ID unik berdasarkan waktu sekarang
function generateId() {
  return Date.now();
}

// Fungsi untuk membuat objek buku
function generateBookObject(id, title, author, year, isRead) {
  return {
    id,
    title,
    author,
    year,
    isRead,
  };
}

// Fungsi untuk mencari buku berdasarkan ID
function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

// Fungsi untuk mencari indeks buku berdasarkan ID
function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

// Fungsi untuk mengecek apakah browser mendukung local storage
function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
}

// Fungsi untuk menyimpan data buku ke local storage
function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    console.log("Data saved successfully.");
    renderBooks();
  }
}

// Fungsi untuk memuat data buku dari local storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData) || [];
  books.push(...data);
  renderBooks();
}

// Fungsi untuk membuat elemen HTML
function createElement(tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

// Fungsi untuk menghapus buku berdasarkan ID
function removeBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;
  books.splice(bookIndex, 1);
  renderBooks();
  saveData();
}

// Fungsi untuk membuat tampilan buku dalam bentuk card
function makeBook(bookObject) {
  const { id, title, author, year, isRead } = bookObject;

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
        isRead
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
    isRead ? markAsUnread(id) : markAsRead(id);
  });

  return container;
}

// Fungsi untuk menambahkan buku baru
function addBook(title, author, year, isRead) {
  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    isRead
  );
  books.push(bookObject);

  renderBooks();
  saveData();
}

// Fungsi untuk menandai buku sebagai sudah dibaca
function markAsRead(bookId) {
  const book = findBook(bookId);
  if (!book) return;
  book.isRead = true;
  renderBooks();
  saveData();
}

// Fungsi untuk menandai buku sebagai belum dibaca
function markAsUnread(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;
  books[bookIndex].isRead = false;
  renderBooks();
  saveData();
}

// Fungsi untuk merender tampilan daftar buku
function renderBooks() {
  const unfinishedBooksList = document.getElementById("unfinished-books-list");
  const finishedBooksList = document.getElementById("finished-books-list");
  unfinishedBooksList.innerHTML = "";
  finishedBooksList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = makeBook(book);
    book.isRead
      ? finishedBooksList.appendChild(bookElement)
      : unfinishedBooksList.appendChild(bookElement);
  });
}

// Event listener untuk saat halaman sudah dimuat
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("book_form");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isRead = document.getElementById("read").checked;
    addBook(title, author, year, isRead);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
