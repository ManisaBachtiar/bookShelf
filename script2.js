const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOK_SHELF';

const generateId = () => Date.now();

const generateBookObject = (id, title, author, year, isRead) => ({
  id,
  title,
  author,
  year,
  isRead,
});

const findBook = (bookId) => books.find((book) => book.id === bookId);

const findBookIndex = (bookId) => books.findIndex((book) => book.id === bookId);

const isStorageExist = () => {
  if (typeof Storage === 'undefined') {
    alert('Your browser does not support local storage');
    return false;
  }
  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData) || [];
  books.push(...data);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const createElement = (tag, text) => {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
};

const removeBook = (bookId) => {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const makeBook = (bookObject) => {
  const { id, title, author, year, isRead } = bookObject;

  const container = document.createElement('div');
  container.classList.add('book-card');
  container.setAttribute('id', `book-${id}`);

  container.innerHTML = `
    <h2>${title}</h2>
    <p>Author: ${author}</p>
    <p>Year: ${year}</p>
    <div class="book-buttons">
      <button class="trash-button"><i class="fas fa-trash"></i></button>
      ${isRead ? '<button class="undo-button"><i class="fas fa-undo"></i></button>' : '<button class="check-button"><i class="fas fa-check"></i></button>'}
    </div>
  `;

  const trashButton = container.querySelector('.trash-button');
  trashButton.addEventListener('click', () => {
    removeBook(id);
  });

  const toggleReadButton = container.querySelector('.check-button, .undo-button');
  toggleReadButton.addEventListener('click', () => {
    isRead ? markAsUnread(id) : markAsRead(id);
  });

  return container;
};

const addBook = (title, author, year, isRead) => {
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isRead);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const markAsRead = (bookId) => {
  const book = findBook(bookId);
  if (!book) return;
  book.isRead = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const markAsUnread = (bookId) => {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;
  books[bookIndex].isRead = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('book_form');
  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isRead = document.getElementById('read').checked;
    addBook(title, author, year, isRead);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data saved successfully.');
});

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBooksList = document.getElementById('unfinished-books-list');
  const finishedBooksList = document.getElementById('finished-books-list');
  unfinishedBooksList.innerHTML = '';
  finishedBooksList.innerHTML = '';

  books.forEach((book) => {
    const bookElement = makeBook(book);
    book.isRead ? finishedBooksList.appendChild(bookElement) : unfinishedBooksList.appendChild(bookElement);
  });
});
